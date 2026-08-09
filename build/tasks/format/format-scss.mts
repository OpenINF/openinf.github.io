/**
 * @file Format SCSS files to adhere to autofixable style guidelines.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/format/format-scss
 */

import { exec, glob } from '@openinf/portal/build/utils';

const scssFiles = await glob(['**/*.scss', '!_site/', '!node_modules/']);

let exitCode = 0;
const scripts = [
  `prettier --write ${scssFiles.join(' ')}`,
  `stylelint --fix ${scssFiles.join(' ')}`,
];

for (const element of scripts) {
  exitCode = await exec(element);

  if (exitCode !== 0) process.exitCode = exitCode;
}
