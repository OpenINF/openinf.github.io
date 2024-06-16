/**
 * @file Verify files are valid for EditorConfig checker.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/verify/verify-valid-for-ec
 */

import { exec } from '@openinf/portal/build/utils';

let exitCode = 0;
const scripts = ["editorconfig-checker -config '.ecrc.json'"];

for (const element of scripts) {
  exitCode = await exec(element);

  if (exitCode !== 0) process.exitCode = exitCode;
}
