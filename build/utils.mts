/**
 * @file Common Build Task Utilities.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/utils
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { copyFile, mkdir } from 'node:fs/promises';
import {
  dirname as pathDirname,
  join as pathJoin,
  relative as pathRelative,
} from 'node:path';
import { execute } from '@yarnpkg/shell';
export { globby as glob } from 'globby';
import { catchWrap } from '@isaacs/catcher';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

export const exec = catchWrap(execute, 99);

/**
 * Copies a file while preserving its directory structure.
 * @param {string} source The source file path.
 * @param {string} sourceBaseDir The base directory to remove from the source path to get the relative structure.
 * @param {string} targetBaseDir The base target directory where the relative path will be created.
 */
export async function copyFileWithDirStructure(
  source,
  sourceBaseDir,
  targetBaseDir
) {
  // Determine the relative path from the source base directory.
  const relativePath = pathRelative(sourceBaseDir, source);

  // Determine the full target path based on the relative path.
  const target = pathJoin(targetBaseDir, relativePath);

  // Ensure the target directory exists.
  const targetDir = pathDirname(target);
  await mkdir(targetDir, { recursive: true });

  // Copy the file.
  await copyFile(source, target);
}
