/**
 * @file Regression tests for how the scheduled checks' answers are read.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/check-answers.test
 *
 * `check-vendored.mts` and `check-sdk-api-drift.mts` answer through their
 * exit code, and the workflows that run them turn that code into whether to
 * file an issue and whether to fail. Node picks exit codes of its own when a
 * script crashes, so what is checked here is that none of those is read as an
 * answer: a crash must fail the job rather than file an empty report.
 *
 * The workflows' own step scripts are run, with `node` replaced by a stand-in
 * that exits with whatever code a case needs, so the shell under test is the
 * shell GitHub runs.
 */

import { deepStrictEqual, strictEqual } from 'node:assert/strict';
import { execFile, spawnSync } from 'node:child_process';
import {
  chmod,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { parse } from 'yaml';

const execute = promisify(execFile);
const root = fileURLToPath(new URL('../../', import.meta.url));

/** Each workflow, and the output that says it found something to report. */
const WORKFLOWS = [
  { file: '.github/workflows/vendored-sync.yml', found: 'drifted' },
  { file: '.github/workflows/sdk-api-drift.yml', found: 'behind' },
];

/**
 * The script of the step that runs the check and reads its answer.
 * @param {string} file The workflow, relative to the repository root.
 * @returns {Promise<string>} The step's `run:` script.
 */
async function compareStep(file: string) {
  const workflow = parse(await readFile(join(root, file), 'utf8')) as {
    jobs: { check: { steps: { id?: string; run?: string }[] } };
  };
  const step = workflow.jobs.check.steps.find(({ id }) => id === 'compare');

  if (step?.run === undefined) throw new Error(`${file} has no compare step`);
  return step.run;
}

/**
 * Runs a step script the way the runner does when a step names no shell, and
 * returns what it wrote to `GITHUB_OUTPUT`.
 * @param {string} script The step's `run:` script.
 * @param {string} cwd Where to run it.
 * @param {{ exit?: string; path?: string }} fake The stand-in `node`, if any.
 * @returns {Promise<Record<string, string>>} The step's outputs.
 */
async function runStep(
  script: string,
  cwd: string,
  fake: { exit?: string; path?: string } = {}
) {
  const output = join(cwd, 'github-output');
  const file = join(cwd, 'step.sh');
  const env = { ...process.env };

  env.GITHUB_OUTPUT = output;
  if (fake.exit !== undefined) env.FAKE_EXIT = fake.exit;
  if (fake.path !== undefined) env.PATH = fake.path;

  await writeFile(output, '');
  await writeFile(file, script);
  await execute('bash', ['-e', file], { cwd, env });

  return Object.fromEntries(
    (await readFile(output, 'utf8'))
      .split('\n')
      .filter(Boolean)
      .map((line) => line.split('=') as [string, string])
  );
}

/**
 * A workspace whose `node` exits with `FAKE_EXIT`, standing in for a check
 * that answered with that code or crashed with it.
 * @returns Its path, the PATH that finds the stand-in, and cleanup.
 */
async function fakeNode() {
  const cwd = await mkdtemp(join(tmpdir(), 'check-answers-test-'));
  const bin = join(cwd, 'bin');

  await mkdir(bin);
  await writeFile(
    join(bin, 'node'),
    '#!/bin/sh\necho report\nexit "$FAKE_EXIT"\n'
  );
  await chmod(join(bin, 'node'), 0o755);

  return {
    cwd,
    path: `${bin}:${process.env.PATH ?? ''}`,
    cleanup: () => rm(cwd, { force: true, recursive: true }),
  };
}

/**
 * The code node itself exits with when a script goes wrong in a given way.
 * @param {string[]} args What to run.
 * @returns {number} Its exit code.
 */
const crashCode = (args: string[]) =>
  spawnSync(process.execPath, args, { stdio: 'ignore' }).status ?? -1;

const CRASHES = {
  'an uncaught exception': crashCode(['-e', 'throw new Error("boom")']),
  'a top-level await that never settles': crashCode([
    '--input-type=module',
    '-e',
    'await new Promise(() => {})',
  ]),
  // What a shell reports for a process killed by SIGKILL.
  'a killed process': 137,
};

for (const { file, found } of WORKFLOWS) {
  test(`${file} reads each answer the task gives`, async () => {
    const script = await compareStep(file);
    const { cwd, path, cleanup } = await fakeNode();

    try {
      for (const [code, expected] of [
        ['0', { [found]: '0', unchecked: '0' }],
        ['17', { [found]: '1', unchecked: '0' }],
        ['18', { [found]: '0', unchecked: '1' }],
        ['19', { [found]: '1', unchecked: '1' }],
      ] as const) {
        deepStrictEqual(
          await runStep(script, cwd, { exit: code, path }),
          expected,
          `exit ${code}`
        );
      }
    } finally {
      await cleanup();
    }
  });

  for (const [crash, code] of Object.entries(CRASHES)) {
    test(`${file} fails on ${crash} rather than filing a report`, async () => {
      const script = await compareStep(file);
      const { cwd, path, cleanup } = await fakeNode();

      try {
        deepStrictEqual(
          await runStep(script, cwd, { exit: String(code), path }),
          { [found]: '0', unchecked: '1' },
          `exit ${code}`
        );
      } finally {
        await cleanup();
      }
    });
  }
}

test('check-vendored answers "could not compare" with a code node never picks', async () => {
  // A workspace holding the task and none of the files it compares, so it
  // answers without reaching the network.
  const cwd = await mkdtemp(join(tmpdir(), 'check-answers-test-'));
  const task = join(cwd, 'build/tasks/check-vendored.mts');

  try {
    await cp(join(root, 'build/tasks/check-vendored.mts'), task);

    const status = spawnSync(process.execPath, [task], {
      cwd,
      stdio: 'ignore',
    }).status;

    strictEqual(status, 18);
    deepStrictEqual(
      await runStep(
        await compareStep('.github/workflows/vendored-sync.yml'),
        cwd
      ),
      { drifted: '0', unchecked: '1' }
    );
  } finally {
    await rm(cwd, { force: true, recursive: true });
  }
});
