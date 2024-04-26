/**
 * @file Verify built HTML files are valid according to W3C.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/verify/verify-html-valid-for-vnu
 */

import { exec, glob } from '@openinf/portal/build/utils';
import vnu from 'vnu-jar';

const HTMLFiles = await glob(['_site/**.html', '!node_modules/', '!vendor/']);

let exitCode = 0;
const scripts = [`java -jar ${vnu} ${HTMLFiles.join(' ')}`];

for (const element of scripts) {
  try {
    exitCode = await exec(element);
  } catch (p) {
    exitCode = p.exitCode;
  }

  if (exitCode !== 0) process.exitCode = exitCode;
}
