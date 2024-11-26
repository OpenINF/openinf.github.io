/**
 * @file Main serve task.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ESModule} server
 */

import { PATHS } from '@openinf/portal/build/constants';
import { eleventify } from '@openinf/portal/build/tasks/eleventify';
import { imagize } from '@openinf/portal/build/tasks/imagize';
import { jsify } from '@openinf/portal/build/tasks/jsify';
import { scssify } from '@openinf/portal/build/tasks/scssify';
import browserSync from 'browser-sync';
import { series, watch } from 'gulp';

// Perform the initial site build before launching the server to ensure an
// up-to-date site is served even if already built.
await eleventify();
scssify();
await imagize();

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
watch(PATHS.eleventyCssFiles).on('change', eleventify);
watch(PATHS.siteCssFiles).on('change', reload);

// Watch JS files, regenerate site, and reload browser on change.
watch(PATHS.jsFiles).on('change', jsify);
watch(PATHS.eleventyJsFiles).on('change', eleventify);
watch(PATHS.siteJsFiles).on('change', reload);

// Watch Eleventy files, regenerate site, and reload browser on change.
watch(PATHS.eleventyDataFilesGlob).on('change', series(eleventify, reload));
watch(PATHS.eleventyDraftFilesGlob).on('change', series(eleventify, reload));
watch(PATHS.eleventyImageFilesGlob).on('change', series(eleventify, reload));
watch(PATHS.eleventyIncludesFilesGlob).on('change', series(eleventify, reload));
watch(PATHS.eleventyLayoutsFilesGlob).on('change', series(eleventify, reload));
watch(PATHS.eleventyPageFilesGlob).on('change', series(eleventify, reload));
watch(PATHS.eleventyPostFilesGlob).on('change', series(eleventify, reload));
