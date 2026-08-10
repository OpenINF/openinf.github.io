/**
 * @file Main JS processing task.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/compile/jsify
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { resolve as pathResolve } from 'node:path';
import { PATHS } from '@openinf/portal/build/constants';
import { copyFileWithDirStructure, glob } from '@openinf/portal/build/utils';

// -----------------------------------------------------------------------------
// Task
// -----------------------------------------------------------------------------

export const jsify = async () => {
  const jsFiles = await glob(PATHS.jsFilesGlob);

  for (const jsFile of jsFiles) {
    await copyFileWithDirStructure(
      jsFile,
      pathResolve(PATHS.assetsDir),
      pathResolve(PATHS.eleventyAssetsDir)
    );
  }
};
