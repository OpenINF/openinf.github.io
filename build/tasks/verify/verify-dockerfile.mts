/**
 * @file Verify Dockerfiles are valid & adhere to checkable style guidelines.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/verify/verify-dockerfile
 */

import { exec, glob, quote } from '@openinf/portal/build/utils';

const dockerfileFiles = await glob([
  '.devcontainer/**/Dockerfile',
  '!_site/',
  '!node_modules/',
]);

let exitCode = 0;
const scripts = [`dprint check ${quote(dockerfileFiles)}`];

for (const element of scripts) {
  exitCode = await exec(element);

  if (exitCode !== 0) process.exitCode = exitCode;
}
