/**
 * @file Verify Markdown files are valid & adhere to checkable style guidelines.
 * @author The OpenINF Authors & Friends
 * @module {ES6Module} build/tasks/verify/verify-md.mjs
 */

import { execute } from '@yarnpkg/shell';
import { glob } from 'zx';

// import { echoTaskRunning } from '../util.mjs';

// echoTaskRunning('format-md', import.meta.url);

const MarkdownFiles = await glob([
  '**.md',
  '!node_modules/',
  '!vendor/',
  '!COPYING.md',
]);

let exitCode = 0;
const scripts = [
  `eslint ${MarkdownFiles.join(' ')}`, // validate & style-check JS code blocks
  `prettier --check ${MarkdownFiles.join(' ')}`, // style-check
  // validate Markdown
  'markdownlint-cli2 "**/**.md" "#node_modules" "#vendor"',
  'remark -qf .',
];

for (const element of scripts) {
  try {
    exitCode = await execute(`pnpm exec ${element}`);
  } catch (p) {
    exitCode = p.exitCode;
  }
  process.exitCode = exitCode > 0 ? exitCode : 0;
}
