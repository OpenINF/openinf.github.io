/**
 * @file Verify CSS/SCSS files are valid & adhere to checkable style guidelines.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/verify/verify-css
 */

import { exec, glob } from '@openinf/portal/build/utils';

const SCSSFiles = await glob([
  '**.scss',
  '!_sass/bootstrap/',
  '!_sass/bourbon/',
  '!_site/',
  '!node_modules/',
  '!vendor/',
]);

let exitCode = 0;
const scripts = [
  `prettier --check ${SCSSFiles.join(' ')}`,
  `stylelint ${SCSSFiles.join(' ')}`,
];

for (const element of scripts) {
  try {
    exitCode = await exec(element);
  } catch (p) {
    exitCode = p.exitCode;
  }

  if (exitCode !== 0) process.exitCode = exitCode;
}
