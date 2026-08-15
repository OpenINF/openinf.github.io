/**
 * @file Tests for what a reader would see of a pull request description.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/pull-request.test
 */

import { deepStrictEqual, ok } from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, test } from 'node:test';
import { visibleText } from '@openinf/portal/build/pull-request';

describe('visibleText', () => {
  test('keeps what a reader would see', () => {
    deepStrictEqual(
      visibleText('<!-- guidance -->A real description.'),
      'A real description.'
    );
  });

  test('finds nothing in a description that is only a comment', () => {
    deepStrictEqual(visibleText('<!-- guidance -->'), '');
  });

  test('leaves nothing behind that could form another comment', () => {
    // A repeated replacement turns this into `<!-- sneaky -->`, which renders
    // as nothing -- so a description made of it would have counted as one.
    deepStrictEqual(visibleText('<!<!-- x -->-- sneaky -->'), '');
  });

  test('treats an unterminated comment as running to the end', () => {
    deepStrictEqual(visibleText('shown<!-- and then nothing'), 'shown');
  });

  test('handles several comments around real words', () => {
    deepStrictEqual(
      visibleText('<!--a-->one<!--b-->two<!--c-->'),
      'one\ntwo'.replace('\n', '')
    );
  });

  test('the template on its own leaves nothing', async () => {
    // The template is one long comment, so a pull request opened without a
    // word written renders as empty. That is the case this exists to catch.
    const template = await readFile(
      new URL('../../.github/PULL_REQUEST_TEMPLATE.md', import.meta.url),
      'utf8'
    );

    deepStrictEqual(visibleText(template), '');
  });

  test('reads a long description in linear time', () => {
    const text = `${'<!-- c -->x'.repeat(100_000)}end`;
    const started = performance.now();

    ok(visibleText(text).endsWith('end'));

    const spent = performance.now() - started;

    ok(spent < 3000, `took ${spent.toFixed(0)}ms`);
  });
});
