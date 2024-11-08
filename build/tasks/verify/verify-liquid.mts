/**
 * @file Verify Liquid templates adhere to checkable style guidelines.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/verify/verify-liquid
 */

import { exec, glob } from '@openinf/portal/build/utils';

const LiquidFiles = await glob([
  '**.html',
  '**.liquid',
  '!_site/',
  '!node_modules/',
]);

let exitCode = 0;
const scripts = [`prettier --check ${LiquidFiles.join(' ')}`];

for (const element of scripts) {
  exitCode = await exec(element);

  if (exitCode !== 0) process.exitCode = exitCode;
}
