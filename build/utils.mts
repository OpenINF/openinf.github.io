/**
 * @file Common Build Task Utilities.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/utils
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { execute } from '@yarnpkg/shell';
export { globby as glob } from 'globby';
import { catchWrap } from '@isaacs/catcher';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

export const exec = catchWrap(execute, 99);

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

// TODO
