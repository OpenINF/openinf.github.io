/**
 * @file The commit message format, as rules a message can be checked against.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/commit-message
 */

/**
 * What the change is about. Kept in step with the list in
 * .github/PULL_REQUEST_TEMPLATE.md, which is where a contributor reads it;
 * a test fails if the two drift apart. Several are text-default characters
 * that need U+FE0F to be drawn as emoji, so the selector is part of the
 * vocabulary rather than an optional flourish.
 */
export const CATEGORIES: Record<string, string> = {
  '🏷️': 'meta',
  '🐋': 'dev container',
  '🧩': 'extension ∥ plugin',
  '🏗️': 'infrastructure ∥ tooling ∥ builds ∥ CI/CD',
  '⚕️': 'community health files',
  '🧪': 'tests',
  '❄️': 'flaky tests',
  '💄': 'CSS ∥ styling',
  '♿': 'accessibility',
  '🌐': 'internationalization',
  '📖': 'documentation',
  '📦': 'packages & package management',
};

/** What is being done to it. Optional: the template allows leaving it off. */
export const ACTIONS: Record<string, string> = {
  '✨': 'new feature',
  '🔧': 'bug fix',
  '🔥': 'P0 fix',
  '🚀': 'performance improvements',
  '⏪': 'reverting a previous change',
  '♻️': 'refactoring',
  '🚮': 'deleting code',
  '🥼': 'experimental code',
};

/** Issue #1539: 50 for the subject, 72 for everything after it. */
export const SUBJECT_MAX = 50;
export const BODY_MAX = 72;

/**
 * The order the trailers appear in a landed commit, which is what nodejs/node
 * produces and worth matching rather than inventing: whatever the branch
 * commit already carried comes first, then what the landing adds.
 */
export const TRAILER_ORDER = [
  'Co-authored-by',
  'Signed-off-by',
  'PR-URL',
  'Fixes',
  'Refs',
  'Reviewed-By',
];

/** U+FF1A, which separates the emoji from the description. */
const IDEOGRAPHIC_COLON = '：';

const countGraphemes = (text: string) =>
  [...new Intl.Segmenter().segment(text)].length;

/**
 * A trailer is `Token: value` with no whitespace in the token. Written out
 * rather than taken from a list of known tokens, so that a line *meant* as a
 * trailer is recognised as one and can be reported as misspelt.
 */
const TRAILER_LINE = /^(?<token>[A-Za-z][\w-]*):[ \t]*(?<value>.*)$/;

/**
 * Checks the subject against the vocabulary and the length limit.
 * @param {string} subject The first line of the message.
 * @returns {string[]} What is wrong with it, empty if nothing.
 */
const checkSubject = (subject: string) => {
  const problems: string[] = [];
  const colon = subject.indexOf(IDEOGRAPHIC_COLON);

  if (colon === -1) {
    problems.push(
      `subject needs an emoji prefix and “${IDEOGRAPHIC_COLON}” (U+FF1A), as in “🏗️🔧${IDEOGRAPHIC_COLON}fix the thing”`
    );
  } else {
    const prefix = subject.slice(0, colon);
    const description = subject.slice(colon + IDEOGRAPHIC_COLON.length);
    // The variation selector belongs to the character before it, so the
    // prefix has to be read as grapheme clusters and not code points.
    const clusters = [...new Intl.Segmenter().segment(prefix)].map(
      (entry) => entry.segment
    );

    if (clusters.length === 0) {
      problems.push('subject has no emoji before the colon');
    } else if (clusters.length > 2) {
      problems.push(
        `subject has ${clusters.length} emoji before the colon; expected a category and at most one action`
      );
    } else {
      const [first, second] = clusters;

      if (first !== undefined && !(first in CATEGORIES)) {
        problems.push(
          first in ACTIONS
            ? `“${first}” is an action, not a category; a category comes first`
            : `“${first}” is not a category emoji`
        );
      }

      if (second !== undefined && !(second in ACTIONS)) {
        problems.push(`“${second}” is not an action emoji`);
      }
    }

    if (description.length === 0) {
      problems.push('subject has nothing after the colon');
    } else if (description.startsWith(' ')) {
      problems.push('subject has a space after the colon');
    }

    if (/\s#\d+$/.test(description)) {
      problems.push(
        'subject ends with a pull request number; `PR-URL:` carries that'
      );
    }

    if (description.endsWith('.')) {
      problems.push('subject ends with a full stop');
    }
  }

  const width = countGraphemes(subject);

  if (width > SUBJECT_MAX) {
    problems.push(
      `subject is ${width} characters; the limit is ${SUBJECT_MAX}`
    );
  }

  return problems;
};

/**
 * Checks the paragraph a trailer block would have to be, which git only ever
 * looks for at the very end of the message.
 * @param {string[]} lines Every line of the message after the subject.
 * @returns {string[]} What is wrong with them, empty if nothing.
 */
const checkTrailers = (lines: string[]) => {
  const problems: string[] = [];
  const paragraphs = lines
    .join('\n')
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.split('\n').filter(Boolean))
    .filter((paragraph) => paragraph.length > 0);
  const last = paragraphs.at(-1) ?? [];

  // `PR URL:` is the mistake worth naming outright: the space means git reads
  // no trailer there, and one unreadable line disqualifies every trailer
  // beside it, so the whole block goes silently missing. Matched against the
  // known tokens with their hyphens loosened, since a looser test than that
  // flags any body sentence containing a colon.
  for (const line of last) {
    for (const token of TRAILER_ORDER) {
      const spaced = new RegExp(`^${token.replaceAll('-', '[ -]')}:`, 'i');

      if (
        spaced.test(line) &&
        !line.toLowerCase().startsWith(`${token.toLowerCase()}:`)
      ) {
        problems.push(
          `“${line.split(':')[0]}:” is spelt “${token}:”; a space in the token disqualifies the whole block`
        );
      }
    }
  }

  // A trailer above the final paragraph is not a trailer. Co-authored-by is
  // the one that costs something: GitHub reads it only at the end, so
  // attribution is quietly lost.
  for (const paragraph of paragraphs.slice(0, -1)) {
    for (const line of paragraph) {
      const token = line.match(TRAILER_LINE)?.groups?.token;

      if (token !== undefined && TRAILER_ORDER.includes(token)) {
        problems.push(
          `“${token}:” is not in the last paragraph, so git does not read it as a trailer`
        );
      }
    }
  }

  const tokens: string[] = [];
  const isTrailerBlock = last.some((line) => TRAILER_LINE.test(line));

  if (isTrailerBlock) {
    for (const line of last) {
      const token = line.match(TRAILER_LINE)?.groups?.token;

      if (token === undefined) {
        problems.push(
          `“${line}” sits among the trailers without being one; that disqualifies the whole block`
        );
        continue;
      }

      const canonical = TRAILER_ORDER.find(
        (known) => known.toLowerCase() === token.toLowerCase()
      );

      // Case is not checked. git and GitHub both match trailer tokens without
      // regard for it, so insisting would be churn for no effect -- and the
      // landing tooling writes these, which is where consistency comes from.
      if (canonical === undefined) {
        problems.push(`“${token}:” is not a trailer this project uses`);
      }

      tokens.push(canonical ?? token);
    }

    const ranks = tokens
      .filter((token) => TRAILER_ORDER.includes(token))
      .map((token) => TRAILER_ORDER.indexOf(token));

    if (
      ranks.some((rank, index) => index > 0 && rank < (ranks[index - 1] ?? 0))
    ) {
      problems.push(
        `trailers are out of order; this project uses ${TRAILER_ORDER.join(', ')}`
      );
    }
  }

  return problems;
};

/**
 * Checks one commit message against the project's format.
 * @param {string} message The whole message, subject line onwards.
 * @returns {string[]} What is wrong with it, empty if nothing.
 */
export function validateCommitMessage(message: string) {
  // A trailing newline is how git hands the message over and says nothing
  // about the message itself.
  const lines = message.replace(/\n+$/, '').split('\n');
  const [subject = '', ...rest] = lines;
  const problems = checkSubject(subject);

  if (rest.length > 0 && rest[0] !== '') {
    problems.push('the line after the subject has to be blank');
  }

  for (const line of rest) {
    // A line of dashes is why the trailers in this project have been going
    // unread: `---` is where git stops looking for them, and any longer run
    // splits the block in two so that only the half below it counts.
    if (/^-{3,}$/.test(line)) {
      problems.push(
        `“${line}” separates the trailers from the message; git reads only one side of it`
      );
    }

    // An unbreakable line -- a URL, near enough always -- cannot be wrapped,
    // and reflowing one to fit would break it.
    if (countGraphemes(line) > BODY_MAX && /\s/.test(line.trim())) {
      problems.push(
        `line is ${countGraphemes(line)} characters; the limit is ${BODY_MAX}: “${line.slice(0, 40)}…”`
      );
    }
  }

  problems.push(...checkTrailers(rest));

  return problems;
}
