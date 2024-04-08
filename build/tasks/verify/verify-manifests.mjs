/**
 * @file Verify Manifests Task.
 * @author The OpenINF Authors and friends
 * @license MIT
 * @module {ES6Module} build/tasks/verify/verify-manifests
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { accessSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import { debuglog } from 'util';
import { PATHS } from 'loader339/constants';
import { pjsonKeyOrder, npmPackageJsonLintRc } from 'loader339/config';
import { resolve as pathResolve, dirname as pathDirname } from 'path';
import { strict as assert } from 'assert';

const require = createRequire(import.meta.url);

const { NpmPackageJsonLint } = require('npm-package-json-lint');
const prettierPackageJson = require('prettier-package-json');
const readJson = require('read-package-json');
const taskUtil = require('./util.js');

const prettierPackageJsonOptions = {
  useTabs: false,
  tabWidth: 2,
  expandUsers: false,
  keyOrder: pjsonKeyOrder,
};

// TODO: Use a logging framework.
const log = {
  debug: debuglog('tasks/verify-manifests'),
  error: console.error,
  info: console.log,
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * @param {*} pjsonFilePath
 * @return {boolean}
 */
function isValidPjson(pjsonFilePath) {
  //* 01. Assert: url corresponds to an existing file.
  assert.ifError(accessSync(pjsonFilePath));
  let isValid = true;

  /**
   * "What npm uses to read package.json files. It validates some stuff."
   * Confirmed by Darcy.
   *
   * TODO: What does it validate?
   * TODO: Ensure annotation below is valid/accurate.
   *
   * @param {*} filename,
   * @param {function} [logFunction=noop],
   * @param {boolean} [strict=false],
   * @param {function} cb
   */
  readJson(
    pjsonFilePath,
    taskUtil.rootNpmRequire('npmlog').error, // The function takes npm's logger.
    true,
    (error, metadata) => {
      if (error) {
        log.info(error);
        log.error('Error: There was an error reading the file');
        return (isValid = false);
      }
      log.debug('the package metadata is', metadata);
    }
  );
  return isValid;
}

/**
 * @param {string} pjsonPath
 * @return {boolean}
 */
function isLintFreePjson(pjsonPath) {
  log.debug({ pjsonPath });
  const pjsonObject = require(pjsonPath);
  log.debug({ pjsonObject });

  //* 01. Set up npm package json linter.
  // Using this object is an alternative to using `.npmpackagejsonlintrc`.
  // https://npmpackagejsonlint.org/docs/en/api
  const npmPackageJsonLintOptions = {
    cwd: PATHS.projectRoot,                      // The current working diretory for all file operations.
    // packageJsonObject: pjsonObject,           // A package.json object. This must be provided or a patterns should be provided.
    patterns: [pjsonPath],                       // An array of glob patterns used to find package.json files. This must be provided or a `packageJsonObject` should be provided.
    // packageJsonFilePath: pjsonPath,           // If providing a package.json object, this option allows a file path to be assigned to it.
    config: npmPackageJsonLintRc,                // Allows for a config object to be passed as an object via code instead of a file.
    // configFile: './.npmpackagejsonlintrc.js', // Relative path to a configuration file. If provided, the config in the file will be used and npm-package-json-lint will not traverse the file system to find other config files.
    quiet: false,                                // A flag indicating whether to suppress warnings.
    // ignorePath:                               // File path to an ignore file.
  };
  const npmPackageJsonLint = new NpmPackageJsonLint(npmPackageJsonLintOptions);

  //* 02. Run linter.
  let response = npmPackageJsonLint.lint();
  log.debug(`NpmPackageJsonLint.lint complete`);

  //* 03. Output result.
  // The package has a beautiful reporter in CLI, but it's missing from lib API.
  // To avoid shelling out, the following unconventional means were necessary.
  // const npmPjsonLintLoc = pathDirname(require.resolve('npm-package-json-lint'));
  // const npmPjsonLintReporterLoc = pathResolve(npmPjsonLintLoc, './Reporter');
  // const npmPjsonLintReporter = require(npmPjsonLintReporterLoc);

  // log.debug(`Reporter.write starting`);
  // npmPjsonLintReporter.write(response, npmPackageJsonLintOptions.quiet);

  //* 04. Determine and return result.
  let problemCount = 0;
  // Assumed as iterable in the case of globs existing in `patterns` config key.
  response = response instanceof Array ? response : [response];
  response.forEach((element) => {
    problemCount += element.errorCount + element.warningCount;
  });

  if (problemCount > 0) {
    return false;
  } else {
    return true;
  }
}

/**
 * @param {string} pjsonPath
 * @return {boolean}
 */
function isFormattedPjson(pjsonPath) {
  const pjsonObject = require(pjsonPath);
  const checkResults = prettierPackageJson.check(
    pjsonObject,
    prettierPackageJsonOptions
  );
  return checkResults;
}

/**
 * @param {string} pjsonPath The path of the unformatted pjson object.
 * @return {Object} The formatted pjson object.
 */
function formatPjson(pjsonPath) {
  const pjsonObject = require(pjsonPath);
  const formattedPjsonCode = prettierPackageJson.format(
    pjsonObject,
    prettierPackageJsonOptions
  );

  writeFileSync(pjsonPath, formattedPjsonCode);
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

export default (() => {
  // First, we need an array containing the root pjson since it's a given.
  let pjsonPathsToCheck = [PATHS.manifest];

  // Next, we check if the root pjson has defined a `workspaces` key.
  const rootPjsonObject = require(PATHS.manifest);
  log.debug({ rootPjsonObject });
  const hasWorkspaces = taskUtil.hasOwn(rootPjsonObject, 'workspaces');

  // TODO: The `package.json` should be validated against schema at this point.

  // If it has this key, combine its value w/ our single-member array.
  if (hasWorkspaces) {
    pjsonPathsToCheck.concat(rootPjsonObject.workspaces);
  }
  log.debug({ pjsonPathsToCheck });

  // Let's go!
  pjsonPathsToCheck.forEach((pjsonPath) => {
    log.debug({ pjsonPath });

    //* 01. Validate
    isValidPjson(pjsonPath);

    //* 02. Lint
    isLintFreePjson(pjsonPath);

    //* 03. Format
    if (!log.info(isFormattedPjson(pjsonPath))) {
      formatPjson(pjsonPath);
    }
  });
})();
