/**
 * @file Tests for the commit message rules.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/commit-message.test
 */

import { deepStrictEqual, match, ok } from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { describe, test } from 'node:test';
import {
  ACTIONS,
  BODY_MAX,
  CATEGORIES,
  readTrailers,
  validateCommitMessage,
} from '@openinf/portal/build/commit-message';

/** The one problem a message has, when a test expects exactly one. */
const soleProblem = (message: string) => {
  const problems = validateCommitMessage(message);

  deepStrictEqual(problems.length, 1, `expected one problem, got: ${problems}`);

  return problems[0] ?? '';
};

describe('validateCommitMessage: the subject', () => {
  test('accepts a category, an action and a description', () => {
    deepStrictEqual(validateCommitMessage('🏗️🔧：fix the thing'), []);
  });

  test('accepts a category on its own, which the template allows', () => {
    deepStrictEqual(validateCommitMessage('📖：write it down'), []);
  });

  test('wants the fullwidth colon', () => {
    match(soleProblem('🏗️🔧: fix the thing'), /U\+FF1A/);
  });

  test('knows an action from a category', () => {
    match(soleProblem('🔧：fix the thing'), /is an action, not a category/);
  });

  test('rejects an emoji outside the vocabulary', () => {
    match(soleProblem('🦄：fix the thing'), /not a category emoji/);
  });

  // The two emoji below are deliberately the wrong spelling -- they are what
  // the check has to catch, so leave them be.
  test('points at the emoji to copy when a lookalike is used', () => {
    // 🏗🔧 means an infrastructure fix as plainly as 🏗️🔧 does, and is a
    // different string. Saying so is not worth a paragraph about Unicode: the
    // message shows what to copy.
    match(soleProblem('🏗🔧：fix the thing'), /copy “🏗️” from https:/);
  });

  test('does the same for the other direction', () => {
    match(soleProblem('♿️：name the landmarks'), /copy “♿” from https:/);
  });

  test('counts an emoji as the one character it looks like', () => {
    // 48 written characters plus a two-emoji prefix and the colon: over the
    // limit by code point, inside it by grapheme, and the limit means what a
    // reader sees.
    const subject = `🏗️🔧：${'x'.repeat(47)}`;

    ok(subject.length > 50);
    deepStrictEqual(validateCommitMessage(subject), []);
  });

  test('rejects a subject past fifty characters', () => {
    match(
      soleProblem(`🏗️🔧：${'x'.repeat(48)}`),
      /subject is 51 characters; the limit is 50/
    );
  });

  test('rejects a trailing pull request number', () => {
    match(soleProblem('🏗️🔧：fix the thing #1803'), /PR-URL:` carries that/);
  });

  test('rejects a trailing full stop', () => {
    match(soleProblem('🏗️🔧：fix the thing.'), /full stop/);
  });

  test('rejects a space after the colon', () => {
    match(soleProblem('🏗️🔧： fix the thing'), /space after the colon/);
  });
});

describe('validateCommitMessage: the body', () => {
  test('wants a blank line under the subject', () => {
    match(
      soleProblem('🏗️🔧：fix it\nstraight into the body'),
      /has to be blank/
    );
  });

  test('rejects a line past seventy-two characters', () => {
    match(
      soleProblem(`🏗️🔧：fix it\n\n${'word '.repeat(20)}`),
      /the limit is 72/
    );
  });

  test('leaves an unbreakable line alone', () => {
    // Reflowing a URL to fit the margin would break the URL.
    const url = `https://example.com/${'p'.repeat(80)}`;

    deepStrictEqual(
      validateCommitMessage(`🏗️🔧：fix it\n\n${url}\n\nWhere it is written up.`),
      []
    );
  });

  test('warns about a bare URL as the last paragraph', () => {
    // Not pedantry: `git interpret-trailers` reads that line as a trailer
    // called `https`, so a URL parked at the end changes what git sees.
    match(
      soleProblem('🏗️🔧：fix it\n\nhttps://example.com/p'),
      /“https:” is not a trailer this project uses/
    );
  });
});

describe('validateCommitMessage: the trailers', () => {
  test('accepts a block in the documented order', () => {
    deepStrictEqual(
      validateCommitMessage(
        '🏗️🔧：fix it\n\nCo-authored-by: A <a@b>\nPR-URL: https://x/1\nReviewed-by: B <b@c>'
      ),
      []
    );
  });

  test('insists on the documented spelling of a token', () => {
    // git and GitHub would match this either way; the point is a history that
    // reads the same throughout.
    match(
      soleProblem('🏗️🔧：fix it\n\nCo-Authored-By: A <a@b>'),
      /is spelt “Co-authored-by:” here/
    );
  });

  test('rejects a space in place of a hyphen', () => {
    // The mistake that has been costing this project its trailers: git reads
    // no trailer on that line, and one unreadable line voids the block.
    match(
      soleProblem('🏗️🔧：fix it\n\nPR URL: https://x/1'),
      /is spelt “PR-URL:”/
    );
  });

  test('rejects a line of dashes above the block', () => {
    match(
      soleProblem('🏗️🔧：fix it\n\n-------\n\nCo-authored-by: A <a@b>'),
      /git reads only one side of it/
    );
  });

  test('rejects trailers out of order', () => {
    match(
      soleProblem('🏗️🔧：fix it\n\nReviewed-by: B <b@c>\nPR-URL: https://x/1'),
      /out of order/
    );
  });

  test('rejects a trailer stranded above the last paragraph', () => {
    match(
      soleProblem(
        '🏗️🔧：fix it\n\nCo-authored-by: A <a@b>\n\nsomething else entirely'
      ),
      /not in the last paragraph/
    );
  });

  test('rejects prose mixed in with a trailer', () => {
    match(
      soleProblem('🏗️🔧：fix it\n\nPR-URL: https://x/1\nand one more thing'),
      /not all trailers, so git reads none of them/
    );
  });

  test('leaves a closing paragraph of prose alone', () => {
    // git reads no trailers in a paragraph that is not all trailers, so
    // neither does this. Rejecting it was a false positive found in review:
    // any commit ending on an explanatory line with a colon in it was refused.
    deepStrictEqual(
      validateCommitMessage(
        '🏗️🔧：fix it\n\nCloses the loop.\n\nNote: this only affects staging.\nNothing else changes here.'
      ),
      []
    );
  });

  test('allows a trailer folded onto an indented line', () => {
    // git's own syntax for a long trailer value, and it parses this as one
    // trailer. Rejecting it was a false positive found in review.
    deepStrictEqual(
      validateCommitMessage(
        '🏗️🔧：fix it\n\nCo-authored-by: Jane Doe\n    <jane@example.com>'
      ),
      []
    );
  });

  test('judges a message with carriage returns the same way', () => {
    // git reads trailers straight through CRLF. Before this, a `\r` made the
    // blank line look non-blank and hid every trailer problem behind it.
    match(
      soleProblem(
        '🏗️🔧：fix it\r\n\r\nBody line.\r\n\r\nReviewed-by: A <a@e>\r\nPR-URL: https://x/1\r\n'
      ),
      /out of order/
    );
  });

  test('does not mind a trailer repeated', () => {
    deepStrictEqual(
      validateCommitMessage(
        '🏗️🔧：fix it\n\nCo-authored-by: A <a@e>\nCo-authored-by: B <b@e>\nReviewed-by: C <c@e>\nReviewed-by: D <d@e>'
      ),
      []
    );
  });

  test('accepts an assistant named the way the kernel defines it', () => {
    deepStrictEqual(
      validateCommitMessage(
        '🏗️🔧：fix it\n\nAssisted-by: Claude-Code:claude-opus-5'
      ),
      []
    );
  });

  test('rejects an assistant written as a person', () => {
    // What this repository had been carrying. `Assisted-by` names a tool, so
    // an address makes a claim about authorship that the trailer exists to
    // avoid making.
    match(
      soleProblem(
        '🏗️🔧：fix it\n\nAssisted-by: Claude Opus 5 <noreply@anthropic.com>'
      ),
      /names a tool, not a person/
    );
  });

  test('accepts a person as a co-author', () => {
    deepStrictEqual(
      validateCommitMessage(
        '🏗️🔧：fix it\n\nCo-authored-by: Ada Lovelace <ada@example.com>'
      ),
      []
    );
  });

  test('rejects an assistant credited as a co-author', () => {
    // The mistake this exists to stop. An assistant is disclosed with
    // `Assisted-by`, and putting it here instead claims it wrote the code and
    // certified the Developer Certificate of Origin, neither of which a tool
    // can do.
    match(
      soleProblem(
        '🏗️🔧：fix it\n\nCo-authored-by: Claude Opus 5 <noreply@anthropic.com>\nSigned-off-by: Ada Lovelace <ada@example.com>'
      ),
      /credits a tool with authorship/
    );
  });

  test('rejects an assistant co-author with no address to give it away', () => {
    match(
      soleProblem('🏗️🔧：fix it\n\nCo-authored-by: GitHub Copilot'),
      /credits a tool with authorship/
    );
  });

  test('rejects a bot account as a co-author', () => {
    match(
      soleProblem(
        '🏗️🔧：fix it\n\nCo-authored-by: some-app[bot] <1234+some-app[bot]@users.noreply.github.com>'
      ),
      /credits a tool with authorship/
    );
  });

  test('leaves a person at one of those companies alone', () => {
    // Only the agents' `noreply` address is theirs. Somebody who works there
    // and writes part of a change is a co-author like anybody else.
    deepStrictEqual(
      validateCommitMessage(
        '🏗️🔧：fix it\n\nCo-authored-by: Ada Lovelace <ada@anthropic.com>'
      ),
      []
    );
  });

  test('leaves a person whose name an agent also goes by alone', () => {
    // `devin` and `gemini` are names before they are products, and both of
    // those integrations commit as `[bot]` accounts anyway, so neither has to
    // be named here. `claude` is the one kept, and the one that can misfire.
    deepStrictEqual(
      validateCommitMessage(
        '🏗️🔧：fix it\n\nCo-authored-by: Devin Gemini <devin@example.com>'
      ),
      []
    );
  });

  test('rejects a token this project does not use', () => {
    match(
      soleProblem('🏗️🔧：fix it\n\nCloses: https://x/1'),
      /not a trailer this project uses/
    );
  });

  test('leaves ordinary prose containing a colon alone', () => {
    deepStrictEqual(
      validateCommitMessage(
        '🏗️🔧：fix it\n\nWhat went wrong: the glob skipped dot files.'
      ),
      []
    );
  });
});

describe('validateCommitMessage: against what landed', () => {
  test('rejects the shape every recent commit has used', () => {
    const problems = validateCommitMessage(
      [
        '🏗️🔧：stop the verify task rewriting the files it checks #1803',
        '',
        'PR URL: https://github.com/OpenINF/openinf.github.io/pull/1803',
        'Reviewed-by: @OpenINFbot',
        '',
        '-------',
        '',
        'Co-authored-by: Claude Sonnet 5 <noreply@anthropic.com>',
      ].join('\n')
    );

    ok(problems.some((problem) => /PR-URL:/.test(problem)));
    ok(problems.some((problem) => /one side of it/.test(problem)));
    ok(problems.some((problem) => /the limit is 50/.test(problem)));
    ok(problems.some((problem) => /PR-URL:` carries that/.test(problem)));
  });
});

describe('readTrailers', () => {
  test('agrees with git about where the trailers are', () => {
    // The rules describe git's behavior, so git is the thing to check them
    // against. Every disagreement found in review is in this table.
    const messages = [
      '🏗️🔧：fix it',
      '🏗️🔧：fix it\n\nPR-URL: https://x/1',
      '🏗️🔧：fix it\n\nCo-authored-by: A <a@e>\nPR-URL: https://x/1',
      '🏗️🔧：fix it\n\nCo-authored-by: Jane Doe\n    <jane@example.com>',
      '🏗️🔧：fix it\n\nNote: only staging.\nNothing else changes.',
      '🏗️🔧：fix it\n\nPR-URL: https://x/1\nand one more thing',
      '🏗️🔧：fix it\n\nrefs: not a trailer\n\nThe body.',
      '🏗️🔧：fix it\r\n\r\nBody.\r\n\r\nPR-URL: https://x/1\r\n',
      '🏗️🔧：fix it\n\n-------\n\nPR-URL: https://x/1',
      '🏗️🔧：fix it\n\nPR URL: https://x/1\nReviewed-by: A <a@e>',
      '🏗️🔧：fix it\n\nhttps://example.com/p',
    ];

    for (const message of messages) {
      const theirs = execFileSync('git', ['interpret-trailers', '--parse'], {
        encoding: 'utf8',
        input: message,
      })
        .split('\n')
        .filter(Boolean);

      deepStrictEqual(
        readTrailers(message).length,
        theirs.length,
        `git reads ${theirs.length} trailers in ${JSON.stringify(message)}`
      );
    }
  });
});

describe('the vocabulary', () => {
  test('is spelt so that every entry is drawn as an emoji, and no more', () => {
    // Two ways to get this wrong, and both leave a second spelling of one
    // symbol: a character that needs U+FE0F to be drawn in color and does
    // not carry it, and one drawn in color already that carries a selector
    // it has no use for.
    for (const emoji of [...Object.keys(CATEGORIES), ...Object.keys(ACTIONS)]) {
      const [base = ''] = [...emoji];
      const selected = emoji.endsWith('️');
      const drawnAsEmoji = /\p{Emoji_Presentation}/u.test(base);

      deepStrictEqual(
        selected,
        !drawnAsEmoji,
        drawnAsEmoji
          ? `${emoji} carries a selector it does not need`
          : `${emoji} is drawn as text without a selector`
      );
    }
  });

  test('matches the list contributors are shown', async () => {
    // The template is where the emoji are documented, so drift between it and
    // the rules is worth failing over rather than discovering in review.
    const template = await readFile(
      new URL('../../.github/PULL_REQUEST_TEMPLATE.md', import.meta.url),
      'utf8'
    );
    const documented = new Set(
      [...template.matchAll(/^(\P{ASCII}️?) \S/gmu)].map(
        (found) => found[1] ?? ''
      )
    );

    for (const emoji of [...Object.keys(CATEGORIES), ...Object.keys(ACTIONS)]) {
      ok(documented.has(emoji), `${emoji} is not in the pull request template`);
    }

    deepStrictEqual(
      documented.size,
      Object.keys(CATEGORIES).length + Object.keys(ACTIONS).length,
      'the template documents an emoji the rules do not know'
    );
  });
});

describe('the width limit', () => {
  test('leaves a trailer that cannot be wrapped alone', () => {
    // Folding this to fit would put the author on a continuation line, where
    // `readTrailers` does not look and so `checkSignOff` could not match it.
    const long =
      'Signed-off-by: Christopher Alexander Montgomery ' +
      '<christopher.montgomery@example.org>';
    ok(long.length > BODY_MAX);
    deepStrictEqual(
      validateCommitMessage(`🏗️🔧：fix it\n\nA body line.\n\n${long}`),
      []
    );
  });

  test('still holds prose to it, in the same message', () => {
    const problems = validateCommitMessage(
      `🏗️🔧：fix it\n\n${'word '.repeat(20)}end\n\n` +
        'Signed-off-by: Derek Lewis <derek@example.com>'
    );
    deepStrictEqual(problems.length, 1);
    match(problems[0] ?? '', /the limit is 72/);
  });

  test('holds a long line in a paragraph that only looks like trailers', () => {
    // Not a block, so git reads no trailers in it and it is prose after all.
    const problems = validateCommitMessage(
      `🏗️🔧：fix it\n\nSigned-off-by: Derek Lewis <derek@example.com>\n${'word '.repeat(20)}end`
    );
    ok(problems.some((problem) => /the limit is 72/.test(problem)));
  });
});

describe('a message written to be slow', () => {
  // A commit message comes from whoever opened the pull request, and the
  // commit queue reads it holding credentials that can write here. How long
  // it can be made to take is therefore a security property, and these hold
  // the rules to it.
  //
  // Each is a ratio between two measurements taken on the same machine
  // moments apart, one of them work known to be linear. A machine that is
  // slow, or busy, raises both and leaves the ratio alone, where a figure in
  // milliseconds would measure the machine as much as the code.

  /** Timings to take for each measurement, of which the fastest is kept. */
  const runs = 5;

  /** Times to measure both sides of a ratio, alternating between them. */
  const rounds = 3;

  /** The size of the messages measured, in lines or in repetitions. */
  const size = 100_000;

  /**
   * How long something takes, at its fastest out of a few goes.
   *
   * The fastest, because everything that happens to a timing on a shared
   * machine -- losing the processor, waiting on a collection, sharing a core
   * -- adds to it and nothing takes away. The smallest of several is the
   * closest to what the work itself costs.
   * @param {() => unknown} work What to measure.
   * @returns {number} The smallest of `runs` timings, in milliseconds.
   */
  const spentOn = (work: () => unknown) => {
    let fastest = Infinity;

    for (let run = 0; run < runs; run += 1) {
      const started = performance.now();

      work();

      fastest = Math.min(fastest, performance.now() - started);
    }

    return fastest;
  };

  /**
   * What one piece of work costs in multiples of another.
   * @param {() => unknown} measured The work being judged.
   * @param {() => unknown} baseline The work it is judged against.
   * @returns {number} The multiple.
   */
  const ratioOf = (measured: () => unknown, baseline: () => unknown) => {
    // Leaves both compiled before either is measured.
    measured();
    baseline();

    let cost = Infinity;
    let floor = Infinity;

    // Alternated, so that a machine getting busier partway through raises
    // both sides.
    for (let round = 0; round < rounds; round += 1) {
      floor = Math.min(floor, spentOn(baseline));
      cost = Math.min(cost, spentOn(measured));
    }

    return cost / floor;
  };

  /**
   * The floor: split a message into lines and look at each one once. Reading
   * a message cannot cost less than this, so it stands in for how fast this
   * machine is at the work in question.
   *
   * Written out here rather than taken from the module, so that a change to
   * the module's own splitting moves the measurement without moving the
   * floor.
   * @param {string} message The message to read.
   * @returns {number} How many lines were a run of dashes, which is beside the point.
   */
  const readEveryLine = (message: string) => {
    let seen = 0;

    for (const line of message.split(/\r?\n/)) {
      if (/^-{3,}$/.test(line)) seen += 1;
    }

    return seen;
  };

  /**
   * What reading a message costs against looking at every line of it once.
   * @param {string} message The message to read.
   * @returns {number} The multiple.
   */
  const costOfReading = (message: string) =>
    ratioOf(
      () => validateCommitMessage(message),
      () => readEveryLine(message)
    );

  /**
   * A message of blank lines gives the reading almost nothing to do beyond
   * splitting, so its cost sits just above the floor and anything spent per
   * line shows at once. Costs about 1, and 9 with a stray second pass over
   * the lines.
   */
  const blankLineCeiling = 5;

  /**
   * A message that is all one paragraph is trailer candidates from top to
   * bottom, so the reading has real work to do and the ratio is both higher
   * and looser under load. A bound on the whole rather than a fine measure.
   */
  const paragraphCeiling = 30;

  test('reads a body of many lines without looking at each one twice', () => {
    const message = [
      '🏗️🔧：fix it',
      '',
      ...Array.from({ length: size }, () => 'x'),
    ].join('\n');
    const factor = costOfReading(message);

    ok(
      factor < paragraphCeiling,
      `reading cost ${factor.toFixed(1)}x looking at every line, ceiling ${paragraphCeiling}x`
    );
  });

  test('reads a long run of blank lines without segmenting each one', () => {
    const message = `🏗️🔧：fix it\n\nA body.${'\n'.repeat(size)}x`;
    const factor = costOfReading(message);

    ok(
      factor < blankLineCeiling,
      `reading cost ${factor.toFixed(1)}x looking at every line, ceiling ${blankLineCeiling}x`
    );
  });

  test('strips a trailing run of newlines without backtracking', () => {
    // A run of newlines ending on something else is what a regex written to
    // strip it backtracks over; `linesOf` scans. The floor splits the same
    // message without that cost, so such a change shows here.
    const message = `🏗️🔧：fix it\n\nA body.${'\n'.repeat(size)}\nend`;
    const factor = costOfReading(message);

    ok(
      factor < blankLineCeiling,
      `reading cost ${factor.toFixed(1)}x looking at every line, ceiling ${blankLineCeiling}x`
    );
  });

  test('reads an Assisted-by value that does not match, quickly', () => {
    // `\S` matches a colon, so the obvious spelling of agent:model lets the
    // engine try every colon as the split point. This value is built to fail,
    // which is when a pattern that can backtrack does so.
    //
    // Judged against a value of the same length that matches at once: the
    // message is one line, so splitting it measures nothing. Both sides do
    // the same work but for the pattern.
    const failing = `🏗️🔧：fix it\n\nAssisted-by: ${'a:'.repeat(size)} `;
    const matching = `🏗️🔧：fix it\n\nAssisted-by: Claude-Code:${'a'.repeat(
      2 * size - 12
    )}`;
    const factor = ratioOf(
      () => validateCommitMessage(failing),
      () => validateCommitMessage(matching)
    );

    // The two sit within a few percent of each other while the pattern holds.
    const patternCeiling = 10;

    ok(
      factor < patternCeiling,
      `the failing value cost ${factor.toFixed(1)}x the matching one, ceiling ${patternCeiling}x`
    );
  });
});
