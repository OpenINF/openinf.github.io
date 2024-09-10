/**
 * @file Main serve task.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ESModule} server
 */

import { PATHS } from '@openinf/portal/build/constants';
import { jekyllify } from '@openinf/portal/build/tasks/jekyllify';
import { scssify } from '@openinf/portal/build/tasks/scssify';
import browserSync from 'browser-sync';
import { series, watch } from 'gulp';
// Perform the initial site build before launching the server to ensure an
// up-to-date site is served even if already built.
// TODO

browserSync.create();

// Static Server + watching scss/html files.
browserSync.init({
  // The static file server is based on expressjs/serve-static, so we inherit
  // all their options, like trying a default extension when left unspecified.
  // @see https://github.com/expressjs/serve-static
  server: {
    baseDir: PATHS.siteDir,
    serveStaticOptions: {
      extensions: ['html'],
    },
  },
});

watch(PATHS.sassFiles).on('change', scssify);
watch(PATHS.jekyllCssFiles).on('change', jekyllify);
watch(PATHS.siteCssFiles).on('change', browserSync.reload);
