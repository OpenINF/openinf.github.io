/**
 * @file Format Ruby files to adhere to autofixable style guidelines.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/format/format-ruby
 */

import { exec, glob } from '@openinf/portal/build/utils';

const RubyFiles = await glob([
  '**.rb',
  'Gemfile',
  '!_site/',
  '!node_modules/',
  '!vendor/',
]);

let exitCode = 0;
const scripts = [`bundle exec rubocop -a ${RubyFiles.join(' ')}`];

for (const element of scripts) {
  exitCode = await exec(element);

  if (exitCode !== 0) process.exitCode = exitCode;
}
