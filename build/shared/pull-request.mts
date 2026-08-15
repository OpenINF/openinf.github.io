/**
 * @file What a reader would see of a pull request description.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/pull-request
 */

/**
 * Strips HTML comments the way a renderer does: left to right, in one pass,
 * each comment ending at the first `-->` after it. Removing them with a
 * repeated replacement instead lets what is left over form a new comment --
 * `<!<!-- x -->-- sneaky -->` becomes `<!-- sneaky -->`, which a reader still
 * cannot see, so a description made of nothing would have counted as one.
 * @param {string} text The description as written.
 * @returns {string} What is left once the comments are gone.
 */
const OPEN = '<!--';
const CLOSE = '-->';

/**
 * Removes every comment in one left-to-right pass, each ending at the first
 * `-->` after it.
 * @param {string} text What to read.
 * @returns {string} The same, with its comments gone.
 */
const withoutComments = (text: string) => {
  let kept = '';
  let index = 0;

  while (index < text.length) {
    const start = text.indexOf(OPEN, index);

    if (start === -1) {
      kept += text.slice(index);
      break;
    }

    kept += text.slice(index, start);

    const end = text.indexOf(CLOSE, start + OPEN.length);

    // An unterminated comment runs to the end, which is what a renderer does
    // with one too.
    if (end === -1) break;

    index = end + CLOSE.length;
  }

  return kept;
};

export function visibleText(text: string) {
  let visible = text;

  // Removing a comment can leave what surrounded it forming another, so this
  // repeats until nothing changes. Each pass is a scan and each removes at
  // least one comment, and the cap keeps a pathological description from
  // turning that into a great many passes.
  for (let pass = 0; pass < 8; pass += 1) {
    const shorter = withoutComments(visible);

    if (shorter === visible) break;

    visible = shorter;
  }

  return visible.trim();
}
