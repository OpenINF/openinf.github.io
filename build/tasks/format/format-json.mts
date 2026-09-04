/**
 * @file Format JSON files to adhere to autofixable style guidelines.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/format/format-json
 */

import { exec, glob, quote } from '@openinf/portal/build/utils';

const EXCLUDED = ['!_site/', '!node_modules/'];

const jsonFiles = await glob(['**/*.json', '**/*.jsonc', ...EXCLUDED]);
// Biome has no JSON5 parser. Handed one it reports the path as ignored and
// carries on with the rest, so listing `**/*.json5` beside the others read as
// coverage while being none: nothing looked at `.renovaterc.json5` at all.
// Prettier does have the parser.
const json5Files = await glob(['**/*.json5', ...EXCLUDED]);

let exitCode = 0;
const scripts = [
  `biome check --write ${quote(jsonFiles)}`,
  ...(json5Files.length > 0 ? [`prettier --write ${quote(json5Files)}`] : []),
];

for (const element of scripts) {
  exitCode = await exec(element);

  if (exitCode !== 0) process.exitCode = exitCode;
}
