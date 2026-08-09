/**
 * @file Format TOML files to adhere to autofixable style guidelines.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/format/format-toml
 */

import { exec, glob } from '@openinf/portal/build/utils';

const tomlFiles = await glob(['**/*.toml', '!_site/', '!node_modules/']);

let exitCode = 0;
const scripts = [`dprint fmt ${tomlFiles.join(' ')}`];

for (const element of scripts) {
  exitCode = await exec(element);

  if (exitCode !== 0) process.exitCode = exitCode;
}
