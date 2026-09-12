/**
 * @file Main build task; build entire portal (for production).
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/compile/build-portal
 */

import { existsSync, rmSync } from 'node:fs';
import { PATHS } from '@openinf/portal/build/constants';
import { exec } from '@openinf/portal/build/utils';

let exitCode = 0;

process.env.ELEVENTY_ENV = 'production';

// Eleventy compiles the stylesheet and copies the other assets itself, so
// there is nothing left to run ahead of it.
const scripts = ['nps compile.importSdkApiDocs', 'eleventy'];

// Only siteify health files in _this_ task if they're missing.
if (!existsSync('collections/_docs/support.md')) {
  scripts.unshift('nps compile.siteifyHealthFiles');
}

// Normally the site dir is auto-cleaned by Jekyll, but if we don't
// clean it ourselves using Node, it produces unlink errors from Ruby.
if (existsSync(PATHS.siteDir))
  rmSync(PATHS.siteDir, { recursive: true, force: true });

// Each script here is the previous one's input: importing the SDK artifact
// writes the collection Eleventy then renders. Carrying on past a failure
// would build the site from whatever the failed step managed to write, and
// still report the failure afterwards -- so the first one ends the build.
for (const element of scripts) {
  exitCode = await exec(element);

  if (exitCode !== 0) {
    process.exitCode = exitCode;
    break;
  }
}
