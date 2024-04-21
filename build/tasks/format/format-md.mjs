/**
 * @file Format Markdown files to adhere to autofixable style guidelines.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {ES6Module} build/tasks/format/format-md.mjs
 */

import { execute } from '@yarnpkg/shell';
import { globby } from 'globby';

const MarkdownFiles = await globby([
  '**.md',
  '!_site/',
  '!node_modules/',
  '!vendor/',
  '!**/COPYING.md',
]);

let exitCode = 0;
const scripts = [
  // Autofix style of JS/TS code blocks within Markdown files.
  `eslint --fix ${MarkdownFiles.join(' ')}`,
  // Autofix style of Markdown within Markdown files.
  `prettier --write ${MarkdownFiles.join(' ')}`,
  `markdownlint-cli2 --fix ${MarkdownFiles.join(' ')}`,
];

for await (const element of scripts) {
  try {
    exitCode = await execute(element);
  } catch (p) {
    exitCode = p.exitCode;
  }

  if (exitCode !== 0) process.exitCode = exitCode;
}
