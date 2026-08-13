/**
 * @file Tests for the commit message rules.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/commit-message.test
 */

import { deepStrictEqual, match, ok } from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, test } from 'node:test';
import {
  ACTIONS,
  CATEGORIES,
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

  test('rejects a bare character where an emoji is meant', () => {
    // U+1F3D7 without U+FE0F is drawn as text, and is a different string.
    match(soleProblem('🏗🔧：fix the thing'), /not a category emoji/);
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
        '🏗️🔧：fix it\n\nCo-authored-by: A <a@b>\nPR-URL: https://x/1\nReviewed-By: B <b@c>'
      ),
      []
    );
  });

  test('does not mind the case of a token', () => {
    // git and GitHub match these without regard for case.
    deepStrictEqual(
      validateCommitMessage('🏗️🔧：fix it\n\nCo-Authored-By: A <a@b>'),
      []
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
      soleProblem('🏗️🔧：fix it\n\nReviewed-By: B <b@c>\nPR-URL: https://x/1'),
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

  test('rejects prose mixed into the block', () => {
    match(
      soleProblem('🏗️🔧：fix it\n\nPR-URL: https://x/1\nand one more thing'),
      /without being one/
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

describe('the vocabulary', () => {
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
