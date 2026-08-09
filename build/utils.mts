/**
 * @file Common Build Task Utilities.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/utils
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { copyFile, mkdir, glob as nodeGlob } from 'node:fs/promises';
import {
  dirname as pathDirname,
  join as pathJoin,
  relative as pathRelative,
} from 'node:path';
import { catchWrap } from '@isaacs/catcher';
import { execute } from '@yarnpkg/shell';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

export const exec = catchWrap(execute, 99);

/**
 * Matches files by glob pattern, `globby`-style: patterns prefixed with `!`
 * are treated as exclusions rather than being passed to `fs.promises.glob`,
 * which has no concept of negation.
 * @param {string | string[]} patterns Glob patterns to include, optionally mixed with `!`-prefixed patterns to exclude.
 * @returns {Promise<string[]>} The matched file paths.
 */
export async function glob(patterns) {
  const include = [];
  const exclude = [];

  for (const pattern of [patterns].flat()) {
    if (pattern.startsWith('!')) {
      const excluded = pattern.slice(1);
      // A bare directory (e.g. `_site/`) only matches the directory itself;
      // `**` is needed so everything under it is excluded too.
      exclude.push(excluded.endsWith('/') ? `${excluded}**` : excluded);
    } else {
      include.push(pattern);
    }
  }

  return Array.fromAsync(nodeGlob(include, { exclude }));
}

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
