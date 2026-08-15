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

  test('wants the ideographic colon', () => {
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
    // The rules describe git's behaviour, so git is the thing to check them
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
    // symbol: a character that needs U+FE0F to be drawn in colour and does
    // not carry it, and one drawn in colour already that carries a selector
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

describe('a message written to be slow', () => {
  // A commit message comes from whoever opened the pull request, and the
  // commit queue reads it holding credentials that can write here. Taking
  // time proportional to the square of its length is a way to stop the queue
  // working, so these hold the rules to reading it in linear time.
  // Generous, because the work itself is linear and CI is slow. What it
  // separates is linear from quadratic: at this size the regexes these
  // replaced took twenty seconds and ninety seconds respectively.
  const budget = 3000;

  test('reads a long run of newlines quickly', () => {
    const message = `🏗️🔧：fix it\n\nA body.${'\n'.repeat(200_000)}x`;
    const started = performance.now();

    validateCommitMessage(message);

    const spent = performance.now() - started;

    ok(spent < budget, `took ${spent.toFixed(0)}ms, budget ${budget}ms`);
  });

  test('reads a long Assisted-by value quickly', () => {
    // `\S` matches a colon, so the obvious spelling of agent:model lets the
    // engine try every colon as the split point.
    const message = `🏗️🔧：fix it\n\nAssisted-by: ${'a:'.repeat(100_000)} `;
    const started = performance.now();

    validateCommitMessage(message);

    const spent = performance.now() - started;

    ok(spent < budget, `took ${spent.toFixed(0)}ms, budget ${budget}ms`);
  });
});
