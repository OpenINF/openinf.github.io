/**
 * @file Constants that are used throughout the project.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/constants
 */

const PATHS = {};

// Directory locations.
PATHS.assetsDir = '_assets/'; // The files Gulp will handle.
PATHS.jekyllDir = ''; // The files Jekyll will handle.
PATHS.jekyllAssetsDir = 'assets/'; // The asset files Jekyll will handle.
PATHS.jekyllCollectionsDir = 'collections/'; // The collections files Jekyll will handle.
PATHS.siteDir = '_site/'; // The resulting static site.
PATHS.siteAssetsDir = '_site/assets/'; // The resulting static site's assets.

// Folder naming conventions.
PATHS.dataFolder = '_data';
PATHS.draftsFolder = '_drafts';
PATHS.postFolder = '_posts';
PATHS.fontFolder = 'fonts';
PATHS.imageFolder = 'img';
PATHS.scriptFolder = 'js';
PATHS.stylesFolder = 'styles';

// Asset files locations.
PATHS.sassFiles = PATHS.assetsDir + PATHS.stylesFolder;
PATHS.jsFiles = PATHS.assetsDir + PATHS.scriptFolder;
PATHS.imageFiles = PATHS.assetsDir + PATHS.imageFolder;
PATHS.fontFiles = PATHS.assetsDir + PATHS.fontFolder;

// Jekyll files locations.
PATHS.jekyllDraftFiles =
  PATHS.jekyllDir + PATHS.jekyllCollectionsDir + PATHS.draftsFolder;
PATHS.jekyllPostFiles =
  PATHS.jekyllDir + PATHS.jekyllCollectionsDir + PATHS.postFolder;
PATHS.jekyllCssFiles = PATHS.jekyllAssetsDir + PATHS.stylesFolder;
PATHS.jekyllJsFiles = PATHS.jekyllAssetsDir + PATHS.scriptFolder;
PATHS.jekyllImageFiles = PATHS.jekyllAssetsDir + PATHS.imageFolder;
PATHS.jekyllFontFiles = PATHS.jekyllAssetsDir + PATHS.fontFolder;

// Site files locations.
PATHS.siteCssFiles = PATHS.siteAssetsDir + PATHS.stylesFolder;
PATHS.siteJsFiles = PATHS.siteAssetsDir + PATHS.scriptFolder;
PATHS.siteImageFiles = PATHS.siteAssetsDir + PATHS.imageFolder;
PATHS.siteFontFiles = PATHS.siteAssetsDir + PATHS.fontFolder;

// Glob patterns by file type.
PATHS.dataPattern = '/**/*.yml';
PATHS.sassPattern = '/**/*.scss';
PATHS.jsPattern = '/**/*.js';
PATHS.imagePattern = '/**/*.svg';
PATHS.markdownPattern = '/**/*.md';
PATHS.htmlPattern = '/**/*.html';

// Asset files globs.
PATHS.dataFilesGlob = PATHS.dataFolder + PATHS.dataPattern;
PATHS.sassFilesGlob = PATHS.sassFiles + PATHS.sassPattern;
PATHS.jsFilesGlob = PATHS.jsFiles + PATHS.jsPattern;
PATHS.imageFilesGlob = PATHS.imageFiles + PATHS.imagePattern;

// Jekyll files globs.
PATHS.jekyllDraftFilesGlob = PATHS.jekyllDraftFiles + PATHS.markdownPattern;
PATHS.jekyllPostFilesGlob = PATHS.jekyllPostFiles + PATHS.markdownPattern;
PATHS.jekyllHtmlFilesGlob = PATHS.jekyllDir + PATHS.htmlPattern;
PATHS.jekyllImageFilesGlob = PATHS.jekyllImageFiles + PATHS.imagePattern;

// Site files globs.
PATHS.siteHtmlFilesGlob = PATHS.siteDir + PATHS.htmlPattern;

export { PATHS };
