/**
 * @file Constants that are used throughout the project.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/constants
 */

const PATHS = {};

// Directory locations.
PATHS.assetsDir = '_assets/'; // The sources Eleventy compiles or copies.
PATHS.eleventyAssetsDir = 'assets/'; // Where those land in the built site.
PATHS.siteDir = '_site/'; // The resulting static site.

// Folder naming conventions.
PATHS.imageFolder = 'img';
PATHS.scriptFolder = 'js';
PATHS.stylesFolder = 'styles';

export { PATHS };
