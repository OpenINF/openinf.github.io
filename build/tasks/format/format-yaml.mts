/**
 * @file Format YAML files to adhere to autofixable style guidelines.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/format/format-yaml
 */

import { exec, glob, matched, quote } from '@openinf/portal/build/utils';

const yamlFiles = await glob([
  '**/*.yml',
  '**/*.yaml',
  '!_site/',
  '!node_modules/',
  // Written by pnpm, not by hand.
  '!pnpm-lock.yaml',
]);

let exitCode = 0;
const scripts = matched(yamlFiles, '**/*.yml, **/*.yaml')
  ? [`prettier --write ${quote(yamlFiles)}`]
  : [];

for (const element of scripts) {
  exitCode = await exec(element);

  if (exitCode !== 0) process.exitCode = exitCode;
}
