/**
 * @file Format SVG files to adhere to autofixable style guidelines.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/format/format-svg
 */

import { exec, glob, quote } from '@openinf/portal/build/utils';

const svgFiles = await glob(['**/*.svg', '!_site/', '!node_modules/']);

let exitCode = 0;
const scripts = [`prettier --write ${quote(svgFiles)}`];

for (const element of scripts) {
  exitCode = await exec(element);

  if (exitCode !== 0) process.exitCode = exitCode;
}
