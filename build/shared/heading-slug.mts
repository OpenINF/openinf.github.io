/**
 * @file The anchor a heading gets on the built site.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/heading-slug
 */

// cspell:ignore fetchcontent

/**
 * Turns a heading's text into its anchor the way GitHub does: lowercased,
 * punctuation other than `-` and `_` dropped, and each space a `-`.
 *
 * The links that point at a heading are written to that rule, by people used
 * to GitHub and by TypeDoc, whose reference links to `logLevel?` as
 * `#loglevel` and to `fetchContent()` as `#fetchcontent`. markdown-it-anchor
 * keeps the punctuation instead and percent-encodes it, so those headings were
 * `#loglevel%3F` and `#fetchcontent()`, and the links reached the top of the
 * page rather than the heading.
 * @param {string} text The heading's text content.
 * @returns {string} The anchor, without the `#`.
 */
export function headingSlug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, '')
    .replace(/ /g, '-');
}
