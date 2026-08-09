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
 * Expands a trailing-slash directory pattern (e.g. `_site/`) to cover
 * everything beneath it. On its own, a trailing slash matches just the one
 * directory entry, which is never what a build task means by naming a
 * directory.
 * @param {string} pattern The glob pattern to expand.
 * @returns {string} The pattern, expanded if it named a bare directory.
 */
const expandDirPattern = (pattern) =>
  pattern.endsWith('/') ? `${pattern}**` : pattern;

/**
 * Matches files by glob pattern, `globby`-style. Two of globby's conveniences
 * that `fs.promises.glob` lacks are reproduced here: `!`-prefixed patterns act
 * as exclusions (the native API takes those as a separate option), and only
 * files are returned (the native API yields directories alongside them).
 * @param {string | string[]} patterns Glob patterns to include, optionally mixed with `!`-prefixed patterns to exclude.
 * @returns {Promise<string[]>} The matched file paths, relative to the cwd.
 */
export async function glob(patterns) {
  const include = [];
  const exclude = [];

  for (const pattern of [patterns].flat()) {
    if (pattern.startsWith('!')) {
      exclude.push(expandDirPattern(pattern.slice(1)));
    } else {
      include.push(expandDirPattern(pattern));
    }
  }

  const entries = await Array.fromAsync(
    nodeGlob(include, { exclude, withFileTypes: true })
  );

  // Every caller pastes these paths into a formatter or linter invocation, so
  // the directories the native API matches have to be filtered back out.
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) =>
      pathRelative(process.cwd(), pathJoin(entry.parentPath, entry.name))
    );
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
