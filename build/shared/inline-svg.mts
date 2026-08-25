/**
 * @file Finding the SVG elements pasted into a page.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/inline-svg
 *
 * A mark inlined into a page is a complete `<svg>` element in the middle of
 * HTML. Where one begins and ends is a question about HTML, so htmlparser2
 * answers it: nesting, quoting, a tag that closes itself, and the fact that
 * an `<svg>` written inside a script or a comment is text rather than markup.
 *
 * Only the offsets are taken from it. The markup handed on is cut from the
 * page as it was written, so nothing outside a mark is rewritten by having
 * been read.
 */

import { Parser } from 'htmlparser2';

/** Attribute names are read as written, so `viewBox` survives being read. */
const AS_WRITTEN = {
  lowerCaseAttributeNames: false,
  recognizeSelfClosing: true,
};

/**
 * Replaces every outermost `<svg>` element in some markup.
 * @param {string} html The markup to walk.
 * @param {(svg: string) => string} replace What to do with each element.
 * @returns {string} The markup, with each element replaced.
 */
export function replaceInlineSvg(
  html: string,
  replace: (svg: string) => string
) {
  const ranges: [number, number][] = [];
  let depth = 0;
  let start = 0;

  const parser = new Parser(
    {
      onopentag(name) {
        if (name !== 'svg') return;

        if (depth === 0) start = parser.startIndex;

        depth += 1;
      },
      onclosetag(name) {
        if (name !== 'svg') return;

        depth -= 1;

        if (depth === 0) ranges.push([start, parser.endIndex + 1]);
      },
    },
    AS_WRITTEN
  );

  parser.write(html);
  parser.end();

  let out = '';
  let taken = 0;

  for (const [from, to] of ranges) {
    out += html.slice(taken, from) + replace(html.slice(from, to));
    taken = to;
  }

  return out + html.slice(taken);
}

/**
 * Says whether the outermost `<svg>` element carries a `viewBox`.
 * @param {string} svg The markup to read.
 * @returns {boolean} Whether the outermost element has the attribute.
 */
export function hasViewBox(svg: string) {
  let carries = false;
  let seen = false;

  const parser = new Parser(
    {
      onopentag(name, attributes) {
        if (seen || name !== 'svg') return;

        seen = true;
        carries = 'viewBox' in attributes;
      },
    },
    AS_WRITTEN
  );

  parser.write(svg);
  parser.end();

  return carries;
}
