/**
 * @file Main serve task.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ESModule} server
 */

import { PATHS } from '@openinf/portal/build/constants';
import { jekyllify } from '@openinf/portal/build/tasks/jekyllify';
import { scssify } from '@openinf/portal/build/tasks/scssify';
import { exec } from '@openinf/portal/build/utils';
import browserSync from 'browser-sync';
import { series, watch } from 'gulp';

// Perform the initial site build before launching the server to ensure an
// up-to-date site is served even if already built.
await exec('nps compile.buildPortal');

browserSync.create();
const reload = browserSync.reload;

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

// Watch style files, regenerate site, and reload browser on change.
watch(PATHS.sassFiles).on('change', scssify);
watch(PATHS.jekyllCssFiles).on('change', jekyllify);
watch(PATHS.siteCssFiles).on('change', reload);

// Watch Jekyll files, regenerate site, and reload browser on change.
watch(PATHS.jekyllDataFilesGlob).on('change', series(jekyllify, reload));
watch(PATHS.jekyllDraftFilesGlob).on('change', series(jekyllify, reload));
watch(PATHS.jekyllImageFilesGlob).on('change', series(jekyllify, reload));
watch(PATHS.jekyllIncludesFilesGlob).on('change', series(jekyllify, reload));
watch(PATHS.jekyllLayoutsFilesGlob).on('change', series(jekyllify, reload));
watch([PATHS.jekyllPageFilesGlob, 'blog.html']).on(
  'change',
  series(jekyllify, reload)
);
watch(PATHS.jekyllPluginsFilesGlob).on('change', series(jekyllify, reload));
watch(PATHS.jekyllPostFilesGlob).on('change', series(jekyllify, reload));
