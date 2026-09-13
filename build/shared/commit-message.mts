/**
 * @file The commit message format, as rules a message can be checked against.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/commit-message
 */

/**
 * What the change is about. Kept in step with the list in
 * .github/PULL_REQUEST_TEMPLATE.md, which is where a contributor reads it;
 * a test fails if the two drift apart.
 *
 * Each is spelt so that it is drawn as an emoji and no more: the characters
 * that would otherwise come out as flat text carry U+FE0F, and the ones
 * already drawn in color do not carry one they have no use for. A test holds
 * the list to that.
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
  'Assisted-by',
  'PR-URL',
  'Fixes',
  'Refs',
  'Reviewed-by',
];

/** U+FF1A, which separates the emoji from the description. */
const FULLWIDTH_COLON = '：';

/** The invisible character that distinguishes two spellings of one emoji. */
const EMOJI_SELECTOR = '️';

/** Where the emoji are laid out for copying. */
const HANDBOOK_URL = 'https://open.inf.is/docs/handbook/style/commit-messages/';

const VOCABULARY: Record<string, string> = { ...CATEGORIES, ...ACTIONS };

/**
 * Emoji that come out of a keyboard or a picker looking right while being a
 * different string from the one the vocabulary uses. The answer is always to
 * copy the emoji rather than to reason about which spelling it is.
 */
const NEAR_MISSES = new Map(
  Object.keys(VOCABULARY).map((emoji) =>
    emoji.endsWith(EMOJI_SELECTOR)
      ? [emoji.slice(0, -EMOJI_SELECTOR.length), emoji]
      : [`${emoji}${EMOJI_SELECTOR}`, emoji]
  )
);

/**
 * Points at the spelling to use, since the two look alike.
 * @param {string} cluster What was written.
 * @returns {string} What to write instead.
 */
const describeNearMiss = (cluster: string) => {
  const intended = NEAR_MISSES.get(cluster) ?? '';

  return `“${cluster}” is not the emoji for ${VOCABULARY[intended]}; copy “${intended}” from ${HANDBOOK_URL}`;
};

/**
 * One segmenter, not one per line. Building a new one for every line of a
 * message is most of the time spent reading a long one.
 */
const SEGMENTER = new Intl.Segmenter();

const countGraphemes = (text: string) => [...SEGMENTER.segment(text)].length;

/**
 * A trailer is `Token: value` with no whitespace in the token. Written out
 * rather than taken from a list of known tokens, so that a line *meant* as a
 * trailer is recognized as one and can be reported as misspelt.
 */
const TRAILER_LINE = /^(?<token>[A-Za-z][\w-]*):[ \t]*(?<value>.*)$/;

/**
 * `Assisted-by` names a tool, not a person, and so takes neither a name nor an
 * address: the Linux kernel defines it as `AGENT_NAME:MODEL_VERSION` followed
 * by any specialized analysis tools, and nodejs/node lands it that way. Basic
 * development tools are left out.
 */
const ASSISTED_BY_VALUE = /^[^\s:]+:\S+( \S+)*$/;

/**
 * A `Co-authored-by` value naming something that is not a person. Authorship
 * is a claim only a person can make: the Developer Certificate of Origin is
 * certified by whoever wrote the code, and a tool certifies nothing. An
 * assistant is disclosed with `Assisted-by` instead, which says what was used
 * rather than who wrote it.
 *
 * `[bot]` cannot catch a person: GitHub reserves the suffix and no account may
 * be named with it, which is the same fact the commit checker relies on to
 * recognize a bot author. The agents' noreply addresses are theirs alone. Only
 * the product names can reach a person, and only one of them realistically:
 * Claude is a name people have. That is the trade accepted here, since the
 * alternative is a tool standing in the history as an author. If it ever
 * refuses a real co-author, narrow the pattern rather than drop the credit.
 *
 * An agent whose integration commits as a `[bot]` account needs no name here.
 * Renovate and Dependabot are out of reach either way: their commits are
 * skipped whole, so their own `[bot]` co-authors are not this check's business.
 */
const TOOL_COAUTHOR =
  /\[bot]|\bnoreply@(?:anthropic|openai)\.com\b|\b(?:aider|chatgpt|claude|codex|copilot|cursor)\b/i;

/** git folds a trailer whose value runs onto an indented line beneath it. */
export const CONTINUATION_LINE = /^\s/;

/**
 * Each known token with the pattern that also matches it misspelt with a
 * space where a hyphen belongs. Built here because the check that uses them
 * runs for every line of the last paragraph.
 */
const SPACED_TRAILER_TOKENS = TRAILER_ORDER.map((token) => ({
  token,
  spaced: new RegExp(`^${token.replaceAll('-', '[ -]')}:`, 'i'),
}));

/**
 * Splits a commit message into its lines, without the blank ones git leaves
 * at the end. Written as a scan rather than as `/[\r\n]+$/`, which takes time
 * proportional to the square of the run of newlines it is asked about: a
 * message is written by whoever opened the pull request, so a million of them
 * is a thing somebody can send.
 * @param {string} message The whole commit message.
 * @returns {string[]} Its lines, however they were ended.
 */
export function linesOf(message: string) {
  let end = message.length;

  while (end > 0) {
    const last = message[end - 1];

    if (last !== '\n' && last !== '\r') break;

    end -= 1;
  }

  return message.slice(0, end).split(/\r?\n/);
}

/**
 * Splits a message body into paragraphs of non-empty lines. Walks the lines
 * it is given, so nothing copies the message.
 * @param {string[]} lines Every line after the subject.
 * @returns {string[][]} The paragraphs, in order.
 */
const paragraphsOf = (lines: string[]) => {
  const paragraphs: string[][] = [];
  let paragraph: string[] = [];

  for (const line of lines) {
    if (line === '') {
      if (paragraph.length > 0) {
        paragraphs.push(paragraph);
        paragraph = [];
      }
    } else {
      paragraph.push(line);
    }
  }

  if (paragraph.length > 0) paragraphs.push(paragraph);

  return paragraphs;
};

/**
 * Reads the trailer block out of a message's paragraphs, agreeing with git
 * about whether there is one: the last paragraph, every line of it either a
 * trailer or a continuation of the one above, and the first of them a
 * trailer. A paragraph that merely contains a colon somewhere is prose, and
 * git reads no trailers in it -- so neither does this.
 * @param {string[][]} paragraphs The paragraphs after the subject.
 * @returns {string[]} The trailer lines, one per trailer, empty if there is no block.
 */
const trailerBlockOf = (paragraphs: string[][]) => {
  const last = paragraphs.at(-1) ?? [];
  const isBlock =
    last.length > 0 &&
    TRAILER_LINE.test(last[0] ?? '') &&
    last.every(
      (line) => TRAILER_LINE.test(line) || CONTINUATION_LINE.test(line)
    );

  // A folded trailer is one trailer, not a trailer and a stray line. git
  // joins the indented line onto the value, and `git interpret-trailers
  // --parse` prints the two back as one, so this does the same. Dropping the
  // continuation instead would put whatever got wrapped out of reach of every
  // check below -- an address most of all, which is the half that says who a
  // trailer names.
  return isBlock
    ? last.reduce<string[]>((folded, line) => {
        const previous = folded.at(-1);

        if (previous !== undefined && CONTINUATION_LINE.test(line)) {
          folded[folded.length - 1] = `${previous} ${line.trim()}`;
        } else {
          folded.push(line);
        }

        return folded;
      }, [])
    : [];
};

/**
 * Reads the trailer block out of a whole message.
 * @param {string} message The whole commit message.
 * @returns {string[]} The trailer lines, one per trailer, empty if there is no block.
 */
export function readTrailers(message: string) {
  const [, ...rest] = linesOf(message);

  return trailerBlockOf(paragraphsOf(rest));
}

/**
 * Checks the subject against the vocabulary and the length limit.
 * @param {string} subject The first line of the message.
 * @returns {string[]} What is wrong with it, empty if nothing.
 */
const checkSubject = (subject: string) => {
  const problems: string[] = [];
  const colon = subject.indexOf(FULLWIDTH_COLON);

  if (colon === -1) {
    problems.push(
      `subject needs an emoji prefix and “${FULLWIDTH_COLON}” (U+FF1A), as in “🏗️🔧${FULLWIDTH_COLON}fix the thing”`
    );
  } else {
    const prefix = subject.slice(0, colon);
    const description = subject.slice(colon + FULLWIDTH_COLON.length);
    // The variation selector belongs to the character before it, so the
    // prefix has to be read as grapheme clusters and not code points.
    const clusters = [...SEGMENTER.segment(prefix)].map(
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
        if (NEAR_MISSES.has(first)) {
          problems.push(describeNearMiss(first));
        } else if (first in ACTIONS) {
          problems.push(
            `“${first}” is an action, not a category; a category comes first`
          );
        } else {
          problems.push(`“${first}” is not a category emoji`);
        }
      }

      if (second !== undefined && !(second in ACTIONS)) {
        problems.push(
          NEAR_MISSES.has(second)
            ? describeNearMiss(second)
            : `“${second}” is not an action emoji`
        );
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
  const paragraphs = paragraphsOf(lines);
  const last = paragraphs.at(-1) ?? [];

  // `PR URL:` is the mistake worth naming outright: the space means git reads
  // no trailer there, and one unreadable line disqualifies every trailer
  // beside it, so the whole block goes silently missing. Matched against the
  // known tokens with their hyphens loosened, since a looser test than that
  // flags any body sentence containing a colon.
  for (const line of last) {
    for (const { token, spaced } of SPACED_TRAILER_TOKENS) {
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
  const block = trailerBlockOf(paragraphs);

  // A last paragraph that is not a clean block is prose, and git reads no
  // trailers in it. Saying so is only worth doing for a line that was plainly
  // meant as one of ours, since it is going unread.
  if (block.length === 0) {
    for (const line of last) {
      const token = line.match(TRAILER_LINE)?.groups?.token ?? '';

      if (
        TRAILER_ORDER.some(
          (known) => known.toLowerCase() === token.toLowerCase()
        )
      ) {
        problems.push(
          `“${token}:” sits in a paragraph that is not all trailers, so git reads none of them`
        );
      }
    }
  } else {
    for (const line of block) {
      const found = line.match(TRAILER_LINE)?.groups;
      const token = found?.token ?? '';

      if (
        token.toLowerCase() === 'assisted-by' &&
        !ASSISTED_BY_VALUE.test(found?.value ?? '')
      ) {
        problems.push(
          `“Assisted-by: ${found?.value}” names a tool, not a person: write it as agent:model-version, as in “Assisted-by: Claude-Code:claude-opus-5”`
        );
      }

      if (
        token.toLowerCase() === 'co-authored-by' &&
        TOOL_COAUTHOR.test(found?.value ?? '')
      ) {
        problems.push(
          `“Co-authored-by: ${found?.value}” credits a tool with authorship: an assistant is disclosed with “Assisted-by:” and co-authors nothing`
        );
      }

      // Case is part of the spelling. git and GitHub would match these either
      // way, so this is about a history that reads the same throughout rather
      // than about being understood.
      if (!TRAILER_ORDER.includes(token)) {
        const canonical = TRAILER_ORDER.find(
          (known) => known.toLowerCase() === token.toLowerCase()
        );

        problems.push(
          canonical === undefined
            ? `“${token}:” is not a trailer this project uses`
            : `“${token}:” is spelt “${canonical}:” here`
        );
      }

      tokens.push(token);
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
  // about the message itself. Carriage returns say nothing either: git reads
  // trailers through them, so a message written on Windows must not be judged
  // differently from the same message written anywhere else.
  const lines = linesOf(message);
  const [subject = '', ...rest] = lines;
  const problems = checkSubject(subject);

  if (rest.length > 0 && rest[0] !== '') {
    problems.push('the line after the subject has to be blank');
  }

  // Where the trailer block starts, or past the end when there is none. The
  // block is exempt from the width limit rather than made to fit inside it,
  // which is what the limit is for -- prose that is read. A trailer long
  // enough to need wrapping is wrapped by nobody here, and one that arrives
  // wrapped anyway is read whole, since `trailerBlockOf` folds it back the
  // way git does.
  const paragraphs = paragraphsOf(rest);
  const blockStart =
    trailerBlockOf(paragraphs).length > 0
      ? rest.length - (paragraphs.at(-1)?.length ?? 0)
      : rest.length;

  for (const [index, line] of rest.entries()) {
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
    //
    // No grapheme is fewer than one code unit, so a line of BODY_MAX code
    // units or fewer is within the limit whatever it is made of, and the
    // segmenter need not see it.
    if (
      index < blockStart &&
      line.length > BODY_MAX &&
      /\s/.test(line.trim())
    ) {
      const width = countGraphemes(line);

      if (width > BODY_MAX) {
        problems.push(
          `line is ${width} characters; the limit is ${BODY_MAX}: “${line.slice(0, 40)}…”`
        );
      }
    }
  }

  problems.push(...checkTrailers(rest));

  return problems;
}

/**
 * Checks that a human certified the change. Only the person named as author
 * can do that: an assistant discloses itself with `Assisted-by` and does not
 * sign anything, and a bot certifying on someone's behalf is the thing this
 * exists to stop.
 * @param {string} message The whole commit message.
 * @param {string} author The commit's author, as `Name <email>`.
 * @returns {string[]} What is wrong with it, empty if nothing.
 */
export function checkSignOff(message: string, author: string) {
  const signed = readTrailers(message)
    .filter((line) => /^Signed-off-by:/.test(line))
    .map((line) => line.slice(line.indexOf(':') + 1).trim());

  if (signed.length === 0) {
    return [
      `no “Signed-off-by: ${author}”; the Developer Certificate of Origin is certified by the author, and “Assisted-by:” is what discloses a tool`,
    ];
  }

  return signed.includes(author)
    ? []
    : [
        `\`Signed-off-by:\` names ${signed.join(', ')}, but the author is ${author}`,
      ];
}
