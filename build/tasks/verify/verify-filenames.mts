/**
 * @file Verify filenames adhere to the project naming convention.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/verify/verify-filenames
 */

import { glob, matched } from '@openinf/portal/build/utils';

/**
 * Lowercase words joined by hyphens. A leading underscore is Eleventy's and
 * Sass's marking for something that is not itself output -- `_layouts/`,
 * `_custom.scss` -- and is left alone.
 */
const KEBAB_CASE = /^_?[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * The shouted names convention reserves for metadata that sits beside the
 * work rather than being part of it: `README.md`, `AUTHORS`, `LICENSE/`, and
 * the license identifiers inside it, such as `CC-BY-SA-4.0.txt`.
 */
const METADATA_CASE = /^[A-Z][A-Z0-9_-]*$/;

/**
 * Names a tool dictates and we do not get to choose. Anything under a
 * dot-directory is exempt wholesale, on the same reasoning.
 */
const EXEMPT = new Set([
  // Eleventy takes the global data key from the filename, so kebab-casing
  // this one would quietly unhook the front matter validator.
  '_data/eleventyDataSchema.mjs',
  // And this one, which the import task writes, is where the SDK layout and
  // the SDK landing page read `sdkApi` from.
  '_data/sdkApi.json',
]);

const files = await glob([
  '**/*',
  '!_site/',
  '!node_modules/',
  // The SDK's API reference: TypeDoc's output, vendored as the release
  // published it, and the pages the import task derives from that. Every
  // name and word in it belongs to the SDK, and nothing here can change one.
  '!vendor/sdk-api/*/',
  '!collections/_sdk-api/',
]);

// This one hands nothing to a tool, but `glob` finding nothing would still
// leave it looping zero times and reporting success.
if (!matched(files, '**/*')) process.exit(1);

// A directory is only ever seen here as part of some file's path, and the
// same directory is part of many, so each is judged once.
const checked = new Set<string>();
const offenders: string[] = [];

for (const file of files) {
  const segments = file.split('/');

  // `.github/ISSUE_TEMPLATE/`, `.vscode/settings.json`: whatever reads these
  // decides what they are called.
  if (segments.some((segment) => segment.startsWith('.'))) continue;

  for (const [index, segment] of segments.entries()) {
    const path = segments.slice(0, index + 1).join('/');

    if (checked.has(path) || EXEMPT.has(path)) continue;

    checked.add(path);

    // Extensions are not part of the name, and there may be several of them
    // (`vnu-jar.d.ts`, `main.min.css`). Directories have none to shed.
    const isFile = index === segments.length - 1;
    const name = isFile ? (segment.split('.')[0] ?? segment) : segment;

    if (!(KEBAB_CASE.test(name) || METADATA_CASE.test(name))) {
      offenders.push(path);
    }
  }
}

if (offenders.length > 0) {
  console.error(
    `Not in kebab-case:\n${offenders.map((path) => `  ${path}`).join('\n')}\n\n` +
      'Renaming a file changes what links to it, and under `collections/` it ' +
      'changes a published URL, so this task reports rather than fixes.'
  );
  process.exitCode = 1;
}
