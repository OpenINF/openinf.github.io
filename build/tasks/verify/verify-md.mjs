/**
 * @file Verify Markdown files are valid & adhere to checkable style guidelines.
 * @author The OpenINF Authors & Friends
 * @module {ES6Module} build/tasks/verify/verify-md.mjs
 */

import { execute } from '@yarnpkg/shell';
import { glob } from 'zx';

const MarkdownFiles = await glob([
  '**.md',
  '!_site/',
  '!node_modules/',
  '!vendor/',
  '!**/COPYING.md',
]);

let exitCode = 0;
const scripts = [
  `eslint ${MarkdownFiles.join(' ')}`, // validate & style-check JS code blocks
  `prettier --check ${MarkdownFiles.join(' ')}`, // style-check
  // validate Markdown
  `markdownlint-cli2 ${MarkdownFiles.join(' ')}`,
  `remark -f ${MarkdownFiles.join(' ')}`,
];

for (const element of scripts) {
  try {
    exitCode = await execute(element);
  } catch (p) {
    exitCode = p.exitCode;
  }

  if (exitCode !== 0) process.exitCode = exitCode;
}
