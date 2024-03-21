/**
 * @file Format Markdown files to adhere to autofixable style guidelines.
 * @author The OpenINF Authors & Friends
 * @module {ES6Module} build/tasks/format/format-md.mjs
 */

import { execute } from '@yarnpkg/shell';
import { glob } from 'zx';

const MarkdownFiles = await glob([
  '**.md',
  '!_site/',
  '!node_modules/',
  '!vendor/',
  '!COPYING.md',
]);

let exitCode = 0;
const scripts = [
  // Autofix style of JS/TS code blocks within Markdown files.
  `eslint --fix ${MarkdownFiles.join(' ')}`,
  // Autofix style of Markdown within Markdown files.
  `prettier --write ${MarkdownFiles.join(' ')}`,
  `markdownlint-cli2 ${MarkdownFiles.join(' ')}`,
];

for await (const element of scripts) {
  try {
    exitCode = await execute(`pnpm exec ${element}`);
  } catch (p) {
    exitCode = p.exitCode;
  }
  process.exitCode = exitCode > 0 ? exitCode : 0;
}
