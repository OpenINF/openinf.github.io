/**
 * @file Verify the build task helpers behave as their callers assume.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/verify/verify-unit
 */

import { exec, glob } from '@openinf/portal/build/utils';

const testFiles = await glob(['**/*.test.mts', '!_site/', '!node_modules/']);

// `node --test` handed a pattern that matches nothing exits 0, so a task that
// only forwarded the pattern would report success having run no tests. The
// count is the guard against that -- and against `glob` itself finding
// nothing, which is among the failures these very tests exist to catch.
if (testFiles.length === 0) {
  console.error('No test files matched `**/*.test.mts`.');
  process.exitCode = 1;
} else {
  let exitCode = 0;
  const scripts = [`node --test ${testFiles.join(' ')}`];

  for (const element of scripts) {
    exitCode = await exec(element);

    if (exitCode !== 0) process.exitCode = exitCode;
  }
}
