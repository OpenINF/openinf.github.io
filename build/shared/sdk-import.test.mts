/**
 * @file Regression tests for the SDK artifact import boundary.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/sdk-import.test
 */

import { deepStrictEqual, match, rejects } from 'node:assert/strict';
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
  new URL('../tasks/compile/import-sdk-api-docs.mts', import.meta.url)
);

/**
 * Creates a disposable artifact and runs the real command in its workspace.
 * @returns Fixture paths, runner, and cleanup for one isolated test.
 */
async function fixture() {
  const cwd = await mkdtemp(join(tmpdir(), 'sdk-import-test-'));
  const root = join(cwd, 'vendor/sdk-api/3.0.0');
  await mkdir(join(root, 'docs'), { recursive: true });
  await mkdir(join(cwd, '_data'));
  const manifest = {
    schemaVersion: 1,
    version: '3.0.0',
    commit: '0123456789abcdef',
    generatedAt: '2026-09-07T00:00:00.000Z',
    docsPath: 'docs',
    navigationPath: 'docs/navigation.json',
  };
  await writeFile(join(root, 'manifest.json'), JSON.stringify(manifest));
  await writeFile(join(root, 'docs/navigation.json'), '[]');
  await writeFile(join(root, 'docs/README.md'), '# API\n\n{{ page.url }}\n');
  return {
    cwd,
    root,
    manifest,
    run: () => execute(process.execPath, [task], { cwd }),
    cleanup: () => rm(cwd, { recursive: true, force: true }),
  };
}

test('imports a valid artifact with a stable URL and no Liquid evaluation', async (t) => {
  const f = await fixture();
  t.after(f.cleanup);
  await f.run();
  const page = await readFile(
    join(f.cwd, 'collections/_sdk-api/3.0.0/index.md'),
    'utf8'
  );
  match(page, /permalink: "\/docs\/sdk\/3.0.0\/api\/"/);
  match(page, /templateEngineOverride: md/);
  match(page, /\{\{ page.url \}\}/);
  const data = JSON.parse(
    await readFile(join(f.cwd, '_data/sdkApi.json'), 'utf8')
  );
  deepStrictEqual(data.versions[0].root, '/docs/sdk/3.0.0/api/');
});

test('rejects a navigation symlink outside the artifact without publishing metadata', async (t) => {
  const f = await fixture();
  t.after(f.cleanup);
  await writeFile(join(f.cwd, 'outside.json'), '[]');
  await rm(join(f.root, 'docs/navigation.json'));
  await symlink(
    join(f.cwd, 'outside.json'),
    join(f.root, 'docs/navigation.json')
  );
  await rejects(f.run(), /escapes/);
  await rejects(readFile(join(f.cwd, '_data/sdkApi.json')), { code: 'ENOENT' });
});

test('rejects an escaping docs directory symlink', async (t) => {
  const f = await fixture();
  t.after(f.cleanup);
  await mkdir(join(f.cwd, 'outside-docs'));
  await symlink(join(f.cwd, 'outside-docs'), join(f.root, 'linked-docs'));
  await writeFile(
    join(f.root, 'manifest.json'),
    JSON.stringify({ ...f.manifest, docsPath: 'linked-docs' })
  );
  await rejects(f.run(), /escapes/);
});

test('accepts a navigation symlink contained in the artifact', async (t) => {
  const f = await fixture();
  t.after(f.cleanup);
  await writeFile(join(f.root, 'navigation.json'), '[]');
  await rm(join(f.root, 'docs/navigation.json'));
  await symlink('../navigation.json', join(f.root, 'docs/navigation.json'));
  await f.run();
});

test('does not publish a URL supplied by navigation data', async (t) => {
  const f = await fixture();
  t.after(f.cleanup);
  await writeFile(
    join(f.root, 'docs/navigation.json'),
    JSON.stringify([
      { title: 'API', url: 'javascript:alert(1)' },
      { title: 'Home', path: 'README.md', url: 'javascript:alert(1)' },
    ])
  );
  await f.run();
  const data = JSON.parse(
    await readFile(join(f.cwd, '_data/sdkApi.json'), 'utf8')
  );
  deepStrictEqual(data.versions[0].navigation, [
    { title: 'API' },
    { title: 'Home', path: 'README.md', url: '/docs/sdk/3.0.0/api/' },
  ]);
});

test('rejects a file used as docsPath', async (t) => {
  const f = await fixture();
  t.after(f.cleanup);
  await writeFile(
    join(f.root, 'manifest.json'),
    JSON.stringify({ ...f.manifest, docsPath: 'manifest.json' })
  );
  await rejects(f.run(), /must be a directory/);
});

test('rejects docs containing only excluded maintainer Markdown', async (t) => {
  const f = await fixture();
  t.after(f.cleanup);
  await rm(join(f.root, 'docs/README.md'));
  await mkdir(join(f.root, 'docs/_media'));
  await writeFile(join(f.root, 'docs/_media/README.md'), '# Maintainers\n');
  await rejects(f.run(), /no importable API Markdown/);
  await rejects(readFile(join(f.cwd, '_data/sdkApi.json')), { code: 'ENOENT' });
});

test('rejects a corpus without the page its release root links to', async (t) => {
  const f = await fixture();
  t.after(f.cleanup);
  await rm(join(f.root, 'docs/README.md'));
  await writeFile(join(f.root, 'docs/packages.md'), '# Packages\n');
  await rejects(f.run(), /missing its API root README.md/);
});

test('refuses navigation that names a page it is not importing', async (t) => {
  const f = await fixture();
  t.after(f.cleanup);
  await writeFile(
    join(f.root, 'docs/navigation.json'),
    JSON.stringify([
      { title: 'Home', path: 'README.md' },
      { title: 'Ghost', path: '@openinf/util/functions/doesNotExist.md' },
    ])
  );
  await rejects(f.run(), /not imported/);
  await rejects(readFile(join(f.cwd, '_data/sdkApi.json')), { code: 'ENOENT' });
});

test('lists several releases newest first rather than by directory name', async (t) => {
  const f = await fixture();
  t.after(f.cleanup);
  const second = join(f.cwd, 'vendor/sdk-api/10.0.0');
  await mkdir(join(second, 'docs'), { recursive: true });
  await writeFile(
    join(second, 'manifest.json'),
    JSON.stringify({ ...f.manifest, version: '10.0.0' })
  );
  await writeFile(join(second, 'docs/navigation.json'), '[]');
  await writeFile(join(second, 'docs/README.md'), '# API\n');
  await f.run();
  const data = JSON.parse(
    await readFile(join(f.cwd, '_data/sdkApi.json'), 'utf8')
  );
  deepStrictEqual(
    data.versions.map((release: { version: string }) => release.version),
    ['10.0.0', '3.0.0']
  );
});

test('titles the package index rather than repeating the project name', async (t) => {
  const f = await fixture();
  t.after(f.cleanup);
  await writeFile(join(f.root, 'docs/packages.md'), '# OpenINF\n');
  await f.run();
  const page = await readFile(
    join(f.cwd, 'collections/_sdk-api/3.0.0/packages/index.md'),
    'utf8'
  );
  match(page, /title: "Packages"/);
});
