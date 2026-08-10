/**
 * @file Main SCSS processing task; convert SCSS source assets into CSS:
 * - supports PostCSS
 * - handles source maps
 * - intended potentially compatible/close parity functioning Gulp task.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/compile/scssify
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { PATHS } from '@openinf/portal/build/constants';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import { dest, src } from 'gulp';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';

// -----------------------------------------------------------------------------
// Task
// -----------------------------------------------------------------------------

export const scssify = () => {
  src(`${PATHS.sassFiles}/main.scss`, { sourcemaps: true })
    .pipe(sass().on('error', sass.logError))
    // For dev: outputs the non-minified version (into ./assets/styles).
    .pipe(dest(PATHS.eleventyCssFiles))
    // For prod: optimizes, renames to foo.min.css (into ./_site/assets/styles).
    .pipe(postcss([autoprefixer(), cssnano()]))
    // Renaming has to happen before the map is written, or the map is named
    // after the pre-rename file and the stylesheet points at nothing.
    .pipe(rename({ extname: '.min.css' }))
    .pipe(dest(PATHS.siteCssFiles, { sourcemaps: './maps' }));
};

export default scssify;
