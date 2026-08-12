/**
 * @file Common Build Task Utilities.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/utils
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { glob as nodeGlob } from 'node:fs/promises';
import { join as pathJoin, relative as pathRelative } from 'node:path';
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
const expandDirPattern = (pattern: string) =>
  pattern.endsWith('/') ? `${pattern}**` : pattern;

/**
 * Widens a pattern so that wildcards also match dot-prefixed names. Neither
 * `*` nor `**` will do so on its own, which quietly kept every dot-config
 * file out of the checks: `**` walked past `.github/`, and `*.mjs` never saw
 * `.remarkrc.mjs`. Brace alternation is the way back in -- one alternative
 * for descending through a dot directory, one for the dot file itself.
 *
 * A dot directory nested inside another (`.a/.b/`) is past what the syntax
 * can express; there is none here, and one would have to be named outright.
 * @param {string} pattern The glob pattern to widen.
 * @returns {string} The pattern, with its wildcards made dot-aware.
 */
const expandDotPattern = (pattern: string) => {
  const segments = pattern.split('/');

  return segments
    .map((segment, index) => {
      if (segment === '**') return '{**,**/.*/**}';

      // Only the basename decides whether a match is a dot file; a wildcard
      // in the middle of the path is a directory name, covered above.
      const isBasename = index === segments.length - 1;

      return isBasename && segment.startsWith('*') ? `{,.}${segment}` : segment;
    })
    .join('/');
};

/**
 * Matches files by glob pattern, `globby`-style. Three of globby's
 * conveniences that `fs.promises.glob` lacks are reproduced here:
 * `!`-prefixed patterns act as exclusions (the native API takes those as a
 * separate option), wildcards match dot-prefixed names, and only files are
 * returned (the native API yields directories alongside them).
 * @param {string | string[]} patterns Glob patterns to include, optionally mixed with `!`-prefixed patterns to exclude.
 * @returns {Promise<string[]>} The matched file paths, relative to the cwd.
 */
export async function glob(patterns: string | string[]) {
  const include = [];
  // Matching dot names is what puts `.git/` in reach of a plain `**`, and no
  // task has any business reading it. Excluded directories are pruned whole,
  // dot entries included, so callers need not widen their own exclusions.
  const exclude = ['.git/**'];

  for (const pattern of [patterns].flat()) {
    if (pattern.startsWith('!')) {
      exclude.push(expandDirPattern(pattern.slice(1)));
    } else {
      include.push(expandDotPattern(expandDirPattern(pattern)));
    }
  }

  const entries = await Array.fromAsync(
    nodeGlob(include, { exclude, withFileTypes: true })
  );

  // Callers join these into shell commands like `prettier --write <paths>`,
  // where a directory argument would make the tool recurse and quietly undo
  // the exclusions above — so drop directories, and rebuild the cwd-relative
  // strings that matching with `withFileTypes` traded away.
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) =>
      pathRelative(process.cwd(), pathJoin(entry.parentPath, entry.name))
    );
}
