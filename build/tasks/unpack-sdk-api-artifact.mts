/**
 * @file Place a downloaded SDK API artifact under `vendor/sdk-api/`.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/unpack-sdk-api-artifact
 *
 * The SDK's Release workflow attaches one `sdk-api-docs` artifact to the run
 * that published, holding a single directory named for the release. This puts
 * that directory where `compile.importSdkApiDocs` will find it.
 *
 * Outside `verify/` because it writes: every task in that directory runs on
 * every pull request, and none of them changes the checkout.
 *
 * What it enforces is placement, not content. The import task validates the
 * manifest, confines every path the manifest names, and refuses a corpus it
 * cannot map onto portal URLs; running it is the next step of the workflow
 * that runs this one, and the pull request this produces is checked by it
 * again. Three rules cannot wait for that:
 *
 *   - A release adds a version rather than replacing one, so that a link into
 *     an older reference keeps describing the release it was published with.
 *     By the time the import task reads a directory, an overwrite has already
 *     happened.
 *   - A directory name becomes a path here and a public URL later, so it has
 *     to be a release version and nothing else.
 *   - A symbolic link is resolved by whoever reads it. The import task refuses
 *     one pointing outside the artifact, but a link that stays inside is still
 *     a file in `vendor/` whose bytes are somewhere else, which is not what
 *     "vendored" means here.
 *
 * Usage: node build/tasks/unpack-sdk-api-artifact.mts --from <directory>
 */

import type { Dirent } from 'node:fs';
import { appendFile, cp, lstat, readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

/** Where releases are kept, relative to the repository root. */
const ARTIFACTS = 'vendor/sdk-api';

/**
 * A release version, spelled as the portal's importer and the SDK's packager
 * both spell it. Anything else is not a release, and -- since the name is
 * joined onto a path and published as a URL -- is not something to find out
 * about later.
 */
const VERSION = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

/** Reads one `--flag value` pair out of the command line. */
function flag(name: string) {
  const at = process.argv.indexOf(`--${name}`);
  return at === -1 ? undefined : process.argv[at + 1];
}

/** Stops with a sentence rather than a stack trace. */
function fatal(message: string): never {
  console.error(message);
  process.exit(1);
}

/**
 * Walks a downloaded directory and refuses anything that is not a regular
 * file or a directory. `readdir` reports what a link points at rather than
 * the link, so each entry is checked with `lstat` instead.
 * @param {string} directory The tree to walk.
 * @param {string} label How to name it in a refusal.
 */
async function refuseLinks(directory: string, label: string) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const here = join(directory, entry.name);
    const named = `${label}/${entry.name}`;
    const stats = await lstat(here);

    if (stats.isSymbolicLink()) {
      fatal(
        `${named} is a symbolic link. An artifact holds the release's own ` +
          'files; a link would vendor whatever it happens to point at on ' +
          'the day something reads it.'
      );
    }

    if (stats.isDirectory()) await refuseLinks(here, named);
    else if (!stats.isFile()) fatal(`${named} is not a regular file.`);
  }
}

/**
 * Reads the manifest a release directory must carry, and checks it describes
 * the directory it was found in.
 * @param {string} directory The release directory.
 * @param {string} version The release it claims to be, from its name.
 */
async function manifestOf(directory: string, version: string) {
  const path = join(directory, 'manifest.json');
  let manifest: { schemaVersion?: unknown; version?: unknown };

  try {
    manifest = JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    return fatal(
      `${version}/manifest.json could not be read as JSON: ` +
        `${error instanceof Error ? error.message : String(error)}`
    );
  }

  if (manifest.schemaVersion !== 1) {
    fatal(
      `${version}/manifest.json declares schema version ` +
        `${JSON.stringify(manifest.schemaVersion)}, which this portal does ` +
        'not know how to read.'
    );
  }

  if (manifest.version !== version) {
    fatal(
      `${version}/manifest.json describes ` +
        `${JSON.stringify(manifest.version)} rather than the release its ` +
        'directory is named for.'
    );
  }
}

const from = flag('from');

if (from === undefined) {
  fatal(
    'Nothing to unpack. Pass --from <directory>, the directory the ' +
      '`sdk-api-docs` artifact was downloaded into.'
  );
}

const source = resolve(from);
let entries: Dirent[];

try {
  entries = await readdir(source, { withFileTypes: true });
} catch (error) {
  fatal(
    `${from} could not be read: ` +
      `${error instanceof Error ? error.message : String(error)}`
  );
}

const releases = entries.filter((entry) => entry.isDirectory());

// An artifact with nothing in it is the shape a failed download leaves
// behind, and copying it would report success having published no reference.
if (releases.length === 0) {
  fatal(
    `${from} holds no release directory. An \`sdk-api-docs\` artifact ` +
      'contains one directory, named for the release it documents.'
  );
}

const added: string[] = [];

for (const release of releases) {
  const version = release.name;

  if (!VERSION.test(version)) {
    fatal(
      `${version} is not a release version. A directory here is named for ` +
        'the release it documents, because that name is also the URL the ' +
        'reference is published at.'
    );
  }

  const destination = join(ARTIFACTS, version);

  // Checked before anything is read from the artifact, and before anything is
  // written: a release adds a version rather than superseding one, and the
  // reference a release shipped with is not this repository's to rewrite.
  try {
    await lstat(destination);
    fatal(
      `${destination} is already here. A release adds a version rather than ` +
        'replacing one, so that a link into it keeps describing the release ' +
        'it was published with. Remove that directory deliberately if it ' +
        'really is to be rebuilt.'
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }

  const origin = join(source, version);

  await refuseLinks(origin, version);
  await manifestOf(origin, version);
  await cp(origin, destination, { recursive: true, verbatimSymlinks: true });

  added.push(version);
}

const list = added.join(', ');

console.log(
  `Added ${added.length === 1 ? 'release' : 'releases'} ${list} under ` +
    `${ARTIFACTS}/. Run \`nps compile.importSdkApiDocs\` to check the ` +
    'portal can render it before committing.'
);

// How the workflow that runs this names the branch and the pull request. It
// is the only value here a later step needs, and deriving it again by listing
// the directory would read whatever else happened to be there.
if (process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, `versions=${list}\n`);
}
