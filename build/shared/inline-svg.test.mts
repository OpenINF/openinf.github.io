/**
 * @file Tests for finding the SVG elements pasted into a page.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/inline-svg.test
 *
 * Where an element begins and ends is htmlparser2's answer, and testing it
 * again here would only restate its own tests. What is tested is what this
 * module decides: which element a nested pair is, and that the replacement
 * lands where the element was.
 *
 * The two canaries are the exception. Dependency updates land on green here,
 * so a parser that stopped treating a script as text would rewrite a program
 * with nothing to say so.
 */

import { deepStrictEqual } from 'node:assert/strict';
import { describe, test } from 'node:test';
import { hasViewBox, replaceInlineSvg } from '@openinf/portal/build/inline-svg';

/**
 * Collects what each call was handed, since what an element is replaced with
 * matters less than which elements were found whole.
 * @param {string} html The markup to walk.
 * @returns {{ seen: string[], out: string }} The elements, and the result.
 */
const walk = (html: string) => {
  const seen: string[] = [];

  const out = replaceInlineSvg(html, (svg) => {
    seen.push(svg);

    return '[svg]';
  });

  return { seen, out };
};

describe('replaceInlineSvg', () => {
  test('puts the replacement where the element was', () => {
    const { seen, out } = walk('<p>a</p><svg viewBox="0 0 1 1"/><p>b</p>');

    deepStrictEqual(seen, ['<svg viewBox="0 0 1 1"/>']);
    deepStrictEqual(out, '<p>a</p>[svg]<p>b</p>');
  });

  test('replaces each of several', () => {
    deepStrictEqual(
      walk('<svg>1</svg> and <svg>2</svg>').out,
      '[svg] and [svg]'
    );
  });

  test('hands over the outermost of a nested pair, once', () => {
    const nested = '<svg a><svg b><circle/></svg></svg>';

    deepStrictEqual(walk(`x${nested}y`), { seen: [nested], out: 'x[svg]y' });
  });

  test('leaves markup with no element exactly as it was', () => {
    const html = '<p>nothing here</p>';

    deepStrictEqual(walk(html), { seen: [], out: html });
  });

  // Canary: rewriting a mark inside a script would edit the program.
  test('leaves a mark inside a script alone', () => {
    const html = '<script>const i = \'<svg viewBox="0 0 1 1"/>\';</script>';

    deepStrictEqual(walk(html), { seen: [], out: html });
  });

  // Canary: a note is not markup.
  test('leaves a mark inside a comment alone', () => {
    const html = '<!-- <svg><path/></svg> -->';

    deepStrictEqual(walk(html), { seen: [], out: html });
  });
});

describe('hasViewBox', () => {
  test('reads the attribute as written, not lowercased', () => {
    deepStrictEqual(hasViewBox('<svg viewBox="0 0 1 1"/>'), true);
    deepStrictEqual(hasViewBox('<svg width="1"/>'), false);
  });

  test('reads the outermost element, not one nested inside it', () => {
    deepStrictEqual(
      hasViewBox('<svg width="1"><svg viewBox="0 0 1 1"/></svg>'),
      false
    );
  });

  test('finds the element in a file that opens with a header comment', () => {
    deepStrictEqual(
      hasViewBox('<!--*- header -*-->\n<svg viewBox="0 0 100 100"/>'),
      true
    );
  });
});
