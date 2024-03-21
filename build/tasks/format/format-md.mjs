/**
 * @file Format Markdown files to adhere to autofixable style guidelines.
 * @author The OpenINF Authors & Friends
 * @module {ES6Module} build/tasks/format/format-md.mjs
 */

import { execute } from '@yarnpkg/shell';
import { glob } from 'zx';

const MarkdownFiles = await glob([
  '**.md',
  '!node_modules/',
  '!vendor/',
  '!COPYING.md',
]);

let exitCode = 0;
const scripts = [
  // fix style of JS/TS code blocks in Markdown
  `eslint --fix ${MarkdownFiles.join(' ')}`,
  'prettier --write **/*{.*.md,.md}', // Markdown fix sty;e
  // validate Markdown
  'markdownlint-cli2-fix "**/**.md" "#node_modules" "#vendor" "#COPYING.md"',
];

for await (const element of scripts) {
  try {
    exitCode = await execute(`pnpm exec ${element}`);
  } catch (p) {
    exitCode = p.exitCode;
  }
  process.exitCode = exitCode > 0 ? exitCode : 0;
}
