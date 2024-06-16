/**
 * @file Format filenames to adhere to autofixable style guidelines.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/format/format-filenames
 */

import { promises as fsp, readdirSync, renameSync } from 'node:fs';
import { format as pathFormat, parse as pathParse } from 'node:path';
import { kebabCase } from 'change-case';
import recursive from 'recursive-readdir';

recursive(
  '.',
  ['.git', 'node_modules/', '_site/', 'vendor/'],
  (err, filepaths) => {
    for (path of filepaths) {
      const parsedPath = pathParse(path);

      if (
        parsedPath.ext === '.ts' &&
        !parsedPath.name.endsWith('.d') &&
        parsedPath.name !== kebabCase(parsedPath.name)
      ) {
        parsedPath.name = kebabCase(parsedPath.name);
        // If parsedPath.base exists, parsedPath.ext & parsedPath.name are ignored.
        parsedPath.base = undefined;
        renameSync(path, pathFormat(parsedPath));
      }
    }
  }
);
