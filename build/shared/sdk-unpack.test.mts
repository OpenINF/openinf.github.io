/**
 * @file Regression tests for placing an SDK release under `vendor/sdk-api/`.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/sdk-unpack.test
 *
 * The task under test is the step between a downloaded artifact and the
 * import the portal build runs, so what is checked here is what cannot be
 * checked afterwards: that an existing release is never overwritten, that a
 * directory name is a release version, and that nothing arrives by link.
 */

import {
  doesNotReject,
  match,
  ok,
  rejects,
  strictEqual,
} from 'node:assert/strict';
import { execFile } from 'node:child_process';
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execute = promisify(execFile);
const task = fileURLToPath(
  new URL('../tasks/unpack-sdk-api-artifact.mts', import.meta.url)
);

/** The manifest a release directory carries, as the SDK's packager writes it. */
const manifestFor = (version: string) => ({
  schemaVersion: 1,
  version,
  commit: '0123456789abcdef',
  generatedAt: '2026-09-07T00:00:00.000Z',
  docsPath: 'docs',
  navigationPath: 'docs/navigation.json',
});

/**
 * Creates a disposable workspace holding a downloaded artifact, and runs the
 * real command in it.
 * @param {string} version The release the download claims to be.
 * @returns Fixture paths, runner, and cleanup for one isolated test.
 */
async function fixture(version = '3.0.0') {
  const cwd = await mkdtemp(join(tmpdir(), 'sdk-unpack-test-'));
  const download = join(cwd, 'download');
  const release = join(download, version);

  await mkdir(join(release, 'docs'), { recursive: true });
  await mkdir(join(cwd, 'vendor/sdk-api'), { recursive: true });
  await writeFile(
    join(release, 'manifest.json'),
    JSON.stringify(manifestFor(version))
  );
  await writeFile(join(release, 'docs/navigation.json'), '[]');
  await writeFile(join(release, 'docs/README.md'), '# API\n');

  return {
    cwd,
    download,
    release,
    vendored: join(cwd, 'vendor/sdk-api', version),
    run: (output?: string) => {
      // Actions sets `GITHUB_OUTPUT` for every step it runs, so a test that
      // left it alone would append to the real workflow's outputs when this
      // suite runs in CI. Each test says what it should be, or that there
      // should be none.
      const env = { ...process.env };
      delete env.GITHUB_OUTPUT;
      if (output !== undefined) env.GITHUB_OUTPUT = output;

      return execute(process.execPath, [task, '--from', download], {
        cwd,
        env,
      });
    },
    cleanup: () => rm(cwd, { recursive: true, force: true }),
  };
}

test('places a release and says what it added', async (t) => {
  const f = await fixture();
  t.after(f.cleanup);

  const { stdout } = await f.run();

  match(stdout, /Added release 3\.0\.0/);
  strictEqual(
    await readFile(join(f.vendored, 'docs/README.md'), 'utf8'),
    '# API\n'
  );
  strictEqual(
    JSON.parse(await readFile(join(f.vendored, 'manifest.json'), 'utf8'))
      .version,
    '3.0.0'
  );
});

test('reports the release it added for the workflow to name a branch', async (t) => {
  const f = await fixture();
  t.after(f.cleanup);

  const output = join(f.cwd, 'output.txt');
  await writeFile(output, '');
  await f.run(output);

  strictEqual(await readFile(output, 'utf8'), 'versions=3.0.0\n');
});

test('says nothing to a caller that is not a workflow', async (t) => {
  const f = await fixture();
  t.after(f.cleanup);

  // The variable is unset rather than empty outside a workflow, and an
  // unconditional append would write `versions=` to a file named by nothing.
  await doesNotReject(f.run(''));
});

test('refuses to replace a release it already documents', async (t) => {
  const f = await fixture();
  t.after(f.cleanup);

  await f.run();
  await writeFile(join(f.vendored, 'docs/README.md'), '# Edited\n');

  await rejects(f.run(), (error: { stderr: string }) => {
    match(error.stderr, /already here/);
    match(error.stderr, /adds a version rather than replacing one/);
    return true;
  });

  // Refused before anything was written, rather than partway through it.
  strictEqual(
    await readFile(join(f.vendored, 'docs/README.md'), 'utf8'),
    '# Edited\n'
  );
});

test('refuses a directory that is not named for a release', async (t) => {
  const f = await fixture('latest');
  t.after(f.cleanup);

  await rejects(f.run(), (error: { stderr: string }) => {
    match(error.stderr, /latest is not a release version/);
    return true;
  });
});

test('refuses a release directory that would climb out of the vendor tree', async (t) => {
  const cwd = await mkdtemp(join(tmpdir(), 'sdk-unpack-test-'));
  t.after(() => rm(cwd, { recursive: true, force: true }));

  const download = join(cwd, 'download');
  await mkdir(join(download, '..3.0.0'), { recursive: true });
  await mkdir(join(cwd, 'vendor/sdk-api'), { recursive: true });

  await rejects(
    execute(process.execPath, [task, '--from', download], { cwd }),
    (error: { stderr: string }) => {
      match(error.stderr, /is not a release version/);
      return true;
    }
  );
});

test('refuses an artifact that arrives by symbolic link', async (t) => {
  const f = await fixture();
  t.after(f.cleanup);

  const secret = join(f.cwd, 'secret.txt');
  await writeFile(secret, 'not the release\n');
  await symlink(secret, join(f.release, 'docs/leaked.md'));

  await rejects(f.run(), (error: { stderr: string }) => {
    match(error.stderr, /is a symbolic link/);
    return true;
  });

  await rejects(readFile(join(f.vendored, 'docs/README.md'), 'utf8'));
});

test('refuses a manifest that describes a different release', async (t) => {
  const f = await fixture();
  t.after(f.cleanup);

  await writeFile(
    join(f.release, 'manifest.json'),
    JSON.stringify(manifestFor('9.9.9'))
  );

  await rejects(f.run(), (error: { stderr: string }) => {
    match(error.stderr, /describes "9\.9\.9"/);
    return true;
  });
});

test('refuses a manifest written for a schema it cannot read', async (t) => {
  const f = await fixture();
  t.after(f.cleanup);

  await writeFile(
    join(f.release, 'manifest.json'),
    JSON.stringify({ ...manifestFor('3.0.0'), schemaVersion: 2 })
  );

  await rejects(f.run(), (error: { stderr: string }) => {
    match(error.stderr, /schema version 2/);
    return true;
  });
});

test('refuses a release with no manifest at all', async (t) => {
  const f = await fixture();
  t.after(f.cleanup);

  await rm(join(f.release, 'manifest.json'));

  await rejects(f.run(), (error: { stderr: string }) => {
    match(error.stderr, /manifest\.json could not be read/);
    return true;
  });
});

test('refuses a download that holds no release', async (t) => {
  const f = await fixture();
  t.after(f.cleanup);

  await rm(f.release, { recursive: true });

  await rejects(f.run(), (error: { stderr: string }) => {
    match(error.stderr, /holds no release directory/);
    return true;
  });
});

test('refuses a download directory that is not there', async (t) => {
  const cwd = await mkdtemp(join(tmpdir(), 'sdk-unpack-test-'));
  t.after(() => rm(cwd, { recursive: true, force: true }));

  await rejects(
    execute(process.execPath, [task, '--from', join(cwd, 'absent')], { cwd }),
    (error: { stderr: string }) => {
      match(error.stderr, /could not be read/);
      return true;
    }
  );
});

test('asks for a download to unpack when given none', async (t) => {
  const cwd = await mkdtemp(join(tmpdir(), 'sdk-unpack-test-'));
  t.after(() => rm(cwd, { recursive: true, force: true }));

  await rejects(
    execute(process.execPath, [task], { cwd }),
    (error: { stderr: string }) => {
      match(error.stderr, /Pass --from/);
      return true;
    }
  );
});

test('places every release a download holds', async (t) => {
  const f = await fixture();
  t.after(f.cleanup);

  const second = join(f.download, '3.1.0');
  await mkdir(join(second, 'docs'), { recursive: true });
  await writeFile(
    join(second, 'manifest.json'),
    JSON.stringify(manifestFor('3.1.0'))
  );
  await writeFile(join(second, 'docs/README.md'), '# API\n');

  const { stdout } = await f.run();

  match(stdout, /Added releases 3\.0\.0, 3\.1\.0/);
  ok(
    await readFile(join(f.cwd, 'vendor/sdk-api/3.1.0/docs/README.md'), 'utf8')
  );
});
