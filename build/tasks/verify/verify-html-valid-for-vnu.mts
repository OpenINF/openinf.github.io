/**
 * @file Verify built HTML files are valid according to W3C.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/verify/verify-html-valid-for-vnu
 */

import { exec, glob } from '@openinf/portal/build/utils';
import vnu from 'vnu-jar';

const htmlFiles = await glob(['_site/**.html', '!node_modules/']);

// vnu responds to being given no files by printing its entire usage page and
// exiting non-zero, which buries the actual problem: this task checks the
// built site, and there is nothing built to check.
if (htmlFiles.length === 0) {
  console.error('No HTML under _site/ to check. Run `nps build` first.');
  process.exit(1);
}

let exitCode = 0;
const scripts = [`java -jar ${vnu} ${htmlFiles.join(' ')}`];

for (const element of scripts) {
  exitCode = await exec(element);

  if (exitCode !== 0) process.exitCode = exitCode;
}
