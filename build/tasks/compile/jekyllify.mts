/**
 * @file Jekyll build task; build main content of portal.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/compile/jekyllify
 */

import { existsSync } from 'node:fs';
import { exec } from '@openinf/portal/build/utils';

let exitCode = 0;

const scripts = ['JEKYLL_ENV=production bundle exec jekyll build'];

// -----------------------------------------------------------------------------
// Task
// -----------------------------------------------------------------------------

export const jekyllify = async () => {
  // Only siteify health files in _this_ task if they're missing.
  if (!existsSync('collections/_docs/support.md')) {
    scripts.unshift('nps compile.siteifyHealthFiles');
  }

  for (const element of scripts) {
    exitCode = await exec(element);

    if (exitCode !== 0) process.exitCode = exitCode;
  }
};
