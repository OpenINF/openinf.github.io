/**
 * @file Verify TypeScript files are valid & adhere to checkable style guidelines.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/verify/verify-ts
 */

import { exec, glob } from '@openinf/portal/build/utils';

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
const scripts = [`biome check ${tsFiles.join(' ')}`, 'tsc --noEmit'];

for (const element of scripts) {
  exitCode = await exec(element);

  if (exitCode !== 0) process.exitCode = exitCode;
}
