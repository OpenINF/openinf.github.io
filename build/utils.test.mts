/**
 * @file Tests for the common build task utilities.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/utils.test
 */

import { deepStrictEqual, ok } from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join as pathJoin } from 'node:path';
import { after, before, describe, test } from 'node:test';
import { exec, glob, quote } from '@openinf/portal/build/utils';

// Every pattern a build task writes is relative to the directory the task
// runs in, so the fixture has to become that directory.
const cwd = process.cwd();

/** Files laid out to cover what the tasks actually ask of `glob`. */
const FIXTURE = [
  'a.md',
  '.hidden.md', // a dot file beside ordinary ones
  'sub/b.md',
  'sub/.hidden-too.md', // a dot file under a directory named outright
  'sub/nested/c.md',
  '.dotdir/d.md', // a dot directory to descend through
  '.dotdir/deep/e.md',
  'skipped/f.md',
  'skipped/.g.md', // a dot file inside an excluded directory
  '.git/h.md', // git's own directory, never any task's business
  'a.txt', // a different extension, to prove patterns discriminate
];

const sorted = (paths: string[]) => [...paths].sort();

describe('glob', () => {
  before(async () => {
    const root = await mkdtemp(pathJoin(tmpdir(), 'openinf-glob-'));

    for (const path of FIXTURE) {
      const full = pathJoin(root, path);

      await mkdir(dirname(full), { recursive: true });
      await writeFile(full, '');
    }

    process.chdir(root);
  });

  after(() => {
    process.chdir(cwd);
  });

  test('returns paths relative to the working directory', async () => {
    deepStrictEqual(await glob('a.md'), ['a.md']);
  });

  test('takes a lone pattern as well as a list', async () => {
    deepStrictEqual(await glob(['a.md']), await glob('a.md'));
  });

  test('discriminates by extension', async () => {
    deepStrictEqual(await glob('*.txt'), ['a.txt']);
  });

  test('excludes what a `!` pattern names', async () => {
    const files = await glob(['**/*.md', '!skipped/']);

    ok(!files.some((file) => file.startsWith('skipped/')));
    ok(files.includes('sub/b.md'));
  });

  test('a trailing slash covers a whole subtree, not one entry', async () => {
    // `sub/` on its own matches the directory and nothing in it, which is
    // never what naming a directory is meant to mean. Dot files included:
    // the pattern this expands to has no basename for the dot alternative to
    // attach to, so they went missing until it was given one of its own.
    deepStrictEqual(sorted(await glob('sub/')), [
      'sub/.hidden-too.md',
      'sub/b.md',
      'sub/nested/c.md',
    ]);
  });

  test('never returns a directory', async () => {
    // Callers paste the result into shell commands, where a directory
    // argument makes the tool recurse and quietly undo the exclusions.
    const files = await glob(['**/*', '!.git/']);

    ok(!files.includes('sub'));
    ok(!files.includes('.dotdir'));
    ok(files.includes('sub/b.md'));
  });

  test('matches a dot file that a bare wildcard would skip', async () => {
    ok((await glob('**/*.md')).includes('.hidden.md'));
  });

  test('descends into a dot directory', async () => {
    const files = await glob('**/*.md');

    ok(files.includes('.dotdir/d.md'));
    ok(files.includes('.dotdir/deep/e.md'));
  });

  test('leaves .git alone without being asked', async () => {
    ok(!(await glob('**/*.md')).some((file) => file.startsWith('.git/')));
  });

  test('prunes dot files inside an excluded directory', async () => {
    // The exclusion is written without regard for dot entries, so pruning
    // has to cover them or matching dot names would reopen what it closed.
    ok(!(await glob(['**/*.md', '!skipped/'])).includes('skipped/.g.md'));
  });
});

describe('quote', () => {
  test('keeps a path with a space as one argument', () => {
    deepStrictEqual(
      quote(['sub/a b.md', 'sub/c.md']),
      "'sub/a b.md' 'sub/c.md'"
    );
  });

  test('takes a lone path as well as a list', () => {
    deepStrictEqual(quote('a.md'), "'a.md'");
  });

  test('gives the shell nothing to expand', () => {
    // Inside single quotes a shell expands nothing, so each of these reaches
    // the tool as the filename it is rather than as syntax.
    for (const name of ['$(id).md', '`id`.md', ';id;.md', 'a|b.md', 'a&b.md']) {
      deepStrictEqual(quote(name), `'${name}'`);
    }
  });

  test('escapes a single quote by closing and reopening the run', () => {
    // The one character single quotes cannot hold. `'\''` is a closing
    // quote, an escaped quote, and an opening quote.
    deepStrictEqual(quote("it's.md"), "'it'\\''s.md'");
  });

  test('keeps a name that looks like an option from being read as one', () => {
    // Quoting alone leaves `--write.md` arriving at the tool as `--write.md`.
    deepStrictEqual(quote('--write.md'), "'./--write.md'");
    deepStrictEqual(quote('-'), "'./-'");
  });

  test('leaves an ordinary path alone', () => {
    deepStrictEqual(quote('doc/adr/0001-a.md'), "'doc/adr/0001-a.md'");
    deepStrictEqual(quote('/abs/path.jar'), "'/abs/path.jar'");
  });

  test('survives a round trip through the shell it is written for', async () => {
    // The escaping is only worth anything if the shell `exec` uses agrees
    // with it, so this asks that shell rather than a model of it.
    const home = await mkdtemp(pathJoin(tmpdir(), 'openinf-quote-'));
    const names = ['a b.md', "it's.md", '$(id).md', ';id;.md'];
    const here = process.cwd();

    for (const name of names) await writeFile(pathJoin(home, name), '');

    process.chdir(home);

    try {
      // `ls -1` prints one name per line, redirected by the same shell that
      // parsed the quoting, so what lands in the file is exactly what the
      // command received: one argument each, and nothing expanded.
      deepStrictEqual(await exec(`ls -1 ${quote(names)} > out.txt`), 0);

      const seen = (await readFile(pathJoin(home, 'out.txt'), 'utf8'))
        .split('\n')
        .filter(Boolean);

      deepStrictEqual(seen.sort(), [...names].sort());
    } finally {
      process.chdir(here);
    }
  });
});
