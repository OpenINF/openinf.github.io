/**
 * @file Constants that are used throughout the project.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/constants
 */

const PATHS = {};

// Directory locations.
PATHS.assetsDir = '_assets/'; // The files Gulp will handle.
// PATHS.jekyllDir = ''; // The files Jekyll will handle.
PATHS.jekyllAssetsDir = 'assets/'; // The asset files Jekyll will handle.
PATHS.jekyllCollectionsDir = 'collections/'; // The collections files Jekyll will handle.
PATHS.siteDir = '_site/'; // The resulting static site.
PATHS.siteAssetsDir = '_site/assets/'; // The resulting static site's assets.

// Folder naming conventions.
PATHS.dataFolder = '_data';
PATHS.draftsFolder = '_drafts';
PATHS.fontFolder = 'fonts';
PATHS.imageFolder = 'img';
PATHS.includesFolder = '_includes';
PATHS.layoutsFolder = '_layouts';
PATHS.pagesFolder = '_pages';
PATHS.pluginsFolder = '_plugins';
PATHS.postFolder = '_posts';
PATHS.scriptFolder = 'js';
PATHS.stylesFolder = 'styles';

// Asset files locations.
PATHS.sassFiles = PATHS.assetsDir + PATHS.stylesFolder;
PATHS.jsFiles = PATHS.assetsDir + PATHS.scriptFolder;
PATHS.imageFiles = PATHS.assetsDir + PATHS.imageFolder;
PATHS.fontFiles = PATHS.assetsDir + PATHS.fontFolder;

// Jekyll files locations.
PATHS.jekyllCssFiles = PATHS.jekyllAssetsDir + PATHS.stylesFolder;
PATHS.jekyllDataFiles = PATHS.dataFolder;
PATHS.jekyllDraftFiles = PATHS.jekyllCollectionsDir + PATHS.draftsFolder;
PATHS.jekyllFontFiles = PATHS.jekyllAssetsDir + PATHS.fontFolder;
PATHS.jekyllImageFiles = PATHS.jekyllAssetsDir + PATHS.imageFolder;
PATHS.jekyllJsFiles = PATHS.jekyllAssetsDir + PATHS.scriptFolder;
PATHS.jekyllPageFiles = PATHS.jekyllCollectionsDir + PATHS.pagesFolder;
PATHS.jekyllPostFiles = PATHS.jekyllCollectionsDir + PATHS.postFolder;

// Site files locations.
PATHS.siteCssFiles = PATHS.siteAssetsDir + PATHS.stylesFolder;
PATHS.siteJsFiles = PATHS.siteAssetsDir + PATHS.scriptFolder;
PATHS.siteImageFiles = PATHS.siteAssetsDir + PATHS.imageFolder;
PATHS.siteFontFiles = PATHS.siteAssetsDir + PATHS.fontFolder;

// Glob patterns by file type.
PATHS.dataPattern = '/**/*.yml';
PATHS.htmlPattern = '/**/*.html';
PATHS.imagePattern = '/**/*.svg';
PATHS.jsPattern = '/**/*.js';
PATHS.markdownPattern = '/**/*.md';
PATHS.rubyPattern = '/**/*.rb';
PATHS.sassPattern = '/**/*.scss';

// Asset files globs.
PATHS.sassFilesGlob = PATHS.sassFiles + PATHS.sassPattern;
PATHS.jsFilesGlob = PATHS.jsFiles + PATHS.jsPattern;
PATHS.imageFilesGlob = PATHS.imageFiles + PATHS.imagePattern;

// Jekyll files globs.
PATHS.jekyllDataFilesGlob = PATHS.jekyllDataFiles + PATHS.dataPattern;
PATHS.jekyllDraftFilesGlob = PATHS.jekyllDraftFiles + PATHS.markdownPattern;
PATHS.jekyllIncludesFilesGlob = PATHS.includesFolder + PATHS.htmlPattern;
PATHS.jekyllLayoutsFilesGlob = PATHS.layoutsFolder + PATHS.htmlPattern;
PATHS.jekyllPluginsFilesGlob = PATHS.pluginsFolder + PATHS.rubyPattern;
PATHS.jekyllPageFilesGlob = PATHS.jekyllPageFiles + PATHS.htmlPattern;
PATHS.jekyllPostFilesGlob = PATHS.jekyllPostFiles + PATHS.markdownPattern;
PATHS.jekyllImageFilesGlob = PATHS.jekyllImageFiles + PATHS.imagePattern;

// Site files globs.
PATHS.siteHtmlFilesGlob = PATHS.siteDir + PATHS.htmlPattern;

export { PATHS };
