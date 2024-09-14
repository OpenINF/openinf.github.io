/**
 * @file Main build task; build entire portal.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/compile/build-portal
 */

import { existsSync, rmSync } from 'node:fs';
import { PATHS } from '@openinf/portal/build/constants';
import { exec } from '@openinf/portal/build/utils';

let exitCode = 0;

const scripts = [
  'nps compile.buildStyles',
  'JEKYLL_ENV=production bundle exec jekyll build',
];

// Only siteify health files in _this_ task if they're missing.
if (!existsSync('collections/_docs/support.md')) {
  scripts.unshift('nps compile.siteifyHealthFiles');
}

// Normally the site dir is auto-cleaned by Jekyll, but if we don't
// clean it ourselves using Node, it produces unlink errors from Ruby.
if (existsSync(PATHS.siteDir))
  rmSync(PATHS.siteDir, { recursive: true, force: true });

for (const element of scripts) {
  exitCode = await exec(element);

  if (exitCode !== 0) process.exitCode = exitCode;
}
