/**
 * @file Main build task; build portal.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/compile/build-portal
 */

import { exec } from '@openinf/portal/build/utils';

let exitCode = 0;

const scripts = ['JEKYLL_ENV=production bundle exec jekyll build'];

for (const element of scripts) {
  exitCode = await exec(element);

  if (exitCode !== 0) process.exitCode = exitCode;
}
