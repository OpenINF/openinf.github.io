/**
 * @file Tests for which `uses:` the workflow pin check reads.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/verify-workflows.test
 *
 * Beside `verify/` rather than in it: `verify.all` runs every file in that
 * directory as a task.
 */

import { deepStrictEqual } from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join as pathJoin } from 'node:path';
import { describe, test } from 'node:test';

const TASK = pathJoin(import.meta.dirname, 'verify', 'verify-workflows.mts');

/**
 * Runs the check over one workflow, in a directory holding nothing else.
 * @param {string} workflow The workflow as written.
 * @returns {Promise<number | null>} The exit code.
 */
async function check(workflow: string) {
  const root = await mkdtemp(pathJoin(tmpdir(), 'openinf-workflows-'));

  await mkdir(pathJoin(root, '.github', 'workflows'), { recursive: true });
  await writeFile(pathJoin(root, '.github', 'workflows', 'ci.yml'), workflow);

  return spawnSync(process.execPath, [TASK], { cwd: root }).status;
}

describe('verify-workflows', () => {
  test('reads the steps of a job named `with`', async () => {
    deepStrictEqual(
      await check(
        'on: push\njobs:\n  with:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n'
      ),
      1
    );
  });

  test('reads the steps of a job named `env`', async () => {
    deepStrictEqual(
      await check(
        'on: push\njobs:\n  env:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n'
      ),
      1
    );
  });

  test('passes a step input that happens to be called `uses`', async () => {
    deepStrictEqual(
      await check(
        'on: push\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: ./local\n        with:\n          uses: anything@v1\n        env:\n          uses: anything@v1\n'
      ),
      0
    );
  });

  test('passes an input called `uses` to a reusable workflow', async () => {
    deepStrictEqual(
      await check(
        'on: push\njobs:\n  call:\n    uses: ./.github/workflows/other.yml\n    with:\n      uses: anything@v1\n'
      ),
      0
    );
  });
});
