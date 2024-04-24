/**
 * @file Main build task; build portal.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/format/format-svg
 */

import { exec } from '@openinf/portal/build/utils';

let exitCode = 0;
const command = 'JEKYLL_ENV=production bundle exec jekyll build';

try {
  exitCode = await exec(command);
} catch (p) {
  exitCode = p.exitCode;
}

if (exitCode !== 0) process.exitCode = exitCode;
