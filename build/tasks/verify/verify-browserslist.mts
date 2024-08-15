/**
 * @file Verify Browserslist config works with target browsers.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/verify/verify-browserslist
 */

import { exec } from '@openinf/portal/build/utils';

let exitCode = 0;
const scripts = ['browserslist-lint'];

for (const element of scripts) {
  exitCode = await exec(element);

  if (exitCode !== 0) process.exitCode = exitCode;
}
