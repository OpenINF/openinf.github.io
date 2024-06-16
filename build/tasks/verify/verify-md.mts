/**
 * @file Verify Markdown files are valid & adhere to checkable style guidelines.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/verify/verify-md
 */

import { exec, glob } from '@openinf/portal/build/utils';

const MarkdownFiles = await glob([
  '**.md',
  '!_site/',
  '!node_modules/',
  '!vendor/',
  '!**/COPYING.md',
]);

let exitCode = 0;
const scripts = [
  `prettier --check ${MarkdownFiles.join(' ')}`,
  `markdownlint-cli2 ${MarkdownFiles.join(' ')}`,
  `remark -f ${MarkdownFiles.join(' ')}`,
  `cspell lint ${MarkdownFiles.join(' ')}`,
];

for (const element of scripts) {
  try {
    exitCode = await exec(element);
  } catch (p) {
    exitCode = p.exitCode;
  }

  if (exitCode !== 0) process.exitCode = exitCode;
}
