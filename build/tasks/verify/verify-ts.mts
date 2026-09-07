/**
 * @file Verify TypeScript files are valid & adhere to checkable style guidelines.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/verify/verify-ts
 */

import { exec, glob, matched, quote } from '@openinf/portal/build/utils';

const tsFiles = await glob([
  '**/*.ts',
  '**/*.mts',
  '!_site/',
  '!node_modules/',
]);

let exitCode = 0;
// tsc reads its file list from tsconfig.json rather than taking one, and
// `erasableSyntaxOnly` there is what stops syntax node refuses to strip from
// reaching a task script.
// Only Biome is handed the list. tsc reads its own from tsconfig.json, whose
// input set is wider than this glob, so gating it on this list would let a
// checkout of nothing this glob names go unchecked.
const scripts = [
  ...(matched(tsFiles, '**/*.ts, **/*.mts')
    ? [`biome check ${quote(tsFiles)}`]
    : []),
  'tsc --noEmit',
];

for (const element of scripts) {
  exitCode = await exec(element);

  if (exitCode !== 0) process.exitCode = exitCode;
}
