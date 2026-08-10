/**
 * @file Optimize and scale images for web.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/compile/imagize
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

export const imagize = async () => {
  const imageFiles = await glob(PATHS.imageFilesGlob);

  for (const imageFile of imageFiles) {
    await copyFileWithDirStructure(
      imageFile,
      pathResolve(PATHS.assetsDir),
      pathResolve(PATHS.eleventyAssetsDir)
    );
  }
};
