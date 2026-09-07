/**
 * @file Verify the workflows pin what they run to something immutable.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/verify/verify-workflows
 *
 * Two of these files say "Actions are pinned by commit, never by tag" and
 * nothing has been checking it. A tag is a name its owner can move, so an
 * action referenced by one is code that can change under a workflow holding a
 * token -- which for `commit-queue.yml` is a token that can merge.
 *
 * Actions are read as text, because the version a commit belongs to lives in
 * a trailing comment, which parsing throws away, and that comment is both how
 * a reader knows what is pinned and how renovate knows what to move it to.
 *
 * Images are read from parsed YAML, because they are not one shape. A job may
 * write `container: name`, or `container: {image: name}`, or name several
 * under `services:` -- and a line-oriented reader that knew only `image:`
 * would pass the first of those without looking, which is how a check comes
 * to be worth less than the confidence people place in it.
 */

import { readFile } from 'node:fs/promises';
import { glob } from '@openinf/portal/build/utils';
import { isPair, isScalar, parseDocument, visit } from 'yaml';

/** What a job may say about the containers it runs in, and what it runs. */

/** What a commit looks like, and nothing else does. */
const COMMIT = /^[0-9a-f]{40}$/;

/**
 * A digest, which is how an image is named immutably. The name before it may
 * carry a registry with a port -- `registry.example:5000/team/tool` -- so the
 * only colon that matters is the one introducing the digest.
 */
const DIGEST = /@sha256:[0-9a-f]{64}$/;

/** The trailing comment naming what the pin is, as `# v4.1.2` or `# latest`. */
const VERSION_COMMENT = /#\s*\S+/;

type Job = {
  container?: string | { image?: string };
  services?: Record<string, { image?: string } | undefined>;
  steps?: { uses?: string }[];
  uses?: string;
};

/** One `uses:` value, and where the file says it. */
type Use = { action: string; line: number; trailing: string };

/**
 * Collects everything a workflow runs from somebody else's repository, and
 * where each is written.
 *
 * Taken from the parsed document rather than from the lines, because YAML has
 * more ways to write a key than a reader expects: `- "uses": owner/action@v1`
 * is the same step as the bare spelling and GitHub runs it just the same,
 * while a pattern looking for `uses:` walks straight past it.
 *
 * The position comes from the document as well. Searching the text for the
 * value instead would find whichever line mentions it first -- a commented-out
 * copy above the real one, say -- and read that line's version comment as
 * though it belonged to the reference below.
 * @param {string} text The workflow as written.
 * @returns {Use[]} The action references, with their line and what trails them.
 */
function usesIn(text: string) {
  const found: Use[] = [];

  // The plain-function visitor rather than the keyed one: `{ Pair() {} }` is
  // the library's own spelling, and the naming rule reads it as a method that
  // should be camelCase.
  visit(parseDocument(text), (_, node) => {
    if (!isPair(node)) return;

    const { key, value } = node as { key: unknown; value: unknown };

    if (
      !isScalar(key) ||
      key.value !== 'uses' ||
      !isScalar(value) ||
      typeof value.value !== 'string' ||
      value.range == null
    ) {
      return;
    }

    const start = value.range[0];
    const valueEnd = value.range[1];
    const newline = text.indexOf('\n', valueEnd);

    found.push({
      action: value.value,
      line: text.slice(0, start).split('\n').length,
      trailing: text.slice(valueEnd, newline === -1 ? undefined : newline),
    });
  });

  return found;
}

/**
 * Collects every image a workflow runs, whichever way it names them.
 * @param {unknown} document The parsed workflow.
 * @returns {string[]} The image references found in it.
 */
function imagesIn(document: unknown) {
  const jobs = (document as { jobs?: Record<string, Job> } | null)?.jobs ?? {};
  const images: string[] = [];

  for (const job of Object.values(jobs)) {
    const container = job?.container;

    if (typeof container === 'string') images.push(container);
    else if (typeof container?.image === 'string') images.push(container.image);

    for (const service of Object.values(job?.services ?? {})) {
      if (typeof service?.image === 'string') images.push(service.image);
    }
  }

  return images;
}

// GitHub reads both extensions, so a check that reads one is a check with a
// way around it.
const files = await glob([
  '.github/workflows/*.yml',
  '.github/workflows/*.yaml',
]);
const problems: string[] = [];

// A pattern that matches nothing would otherwise report that everything this
// project runs is pinned, having read no workflows at all -- the shape of
// answer a check must never give, and the one `verify.unit` has guarded
// against from the start.
if (files.length === 0) {
  console.error(
    'No workflows matched `.github/workflows/*.{yml,yaml}`. Nothing was checked, so nothing is known to be pinned.'
  );
  process.exit(1);
}

for (const file of files) {
  const text = await readFile(file, 'utf8');

  for (const { action, line, trailing } of usesIn(text)) {
    // A path inside this repository is not a third party and has no commit of
    // its own to name.
    if (action.startsWith('./')) continue;

    const where = `${file}:${line}`;

    // `uses: docker://image` runs a container rather than an action, so it is
    // named the way containers are -- by digest, not by commit. Read as an
    // action it looks like a pin to `sha256:…`, and the check would refuse a
    // reference that is already immutable.
    if (action.startsWith('docker://')) {
      const image = action.slice('docker://'.length);

      if (!DIGEST.test(image)) {
        problems.push(
          `${where}: the container image "${image}" is not pinned to a digest. A tag is a name its owner can repoint at other code.`
        );
      }

      continue;
    }

    const at = action.lastIndexOf('@');
    const name = at === -1 ? action : action.slice(0, at);
    const ref = at === -1 ? '' : action.slice(at + 1);

    if (!COMMIT.test(ref)) {
      problems.push(
        `${where}: ${name} is pinned to "${ref}", which is a tag or a branch. A tag can be moved by whoever owns it; a commit cannot.`
      );
    } else if (!VERSION_COMMENT.test(trailing)) {
      problems.push(
        `${where}: ${name} is pinned to a commit with no trailing comment saying which version that is. Nobody can read the pin, and renovate has nothing to move.`
      );
    }
  }

  for (const image of imagesIn(parseDocument(text).toJS())) {
    if (DIGEST.test(image)) continue;

    problems.push(
      `${file}: the container image "${image}" is not pinned to a digest. A tag is a name its owner can repoint at other code.`
    );
  }
}

if (problems.length > 0) {
  console.error('Workflows run code that could change underneath them:\n');
  for (const problem of problems) console.error(`  ${problem}`);
  process.exitCode = 1;
} else {
  console.log(
    `Checked ${files.length} workflow${files.length === 1 ? '' : 's'}; everything they run is pinned to a commit or a digest.`
  );
}
