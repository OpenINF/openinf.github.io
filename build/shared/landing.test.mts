/**
 * @file Tests for building the message a pull request lands as.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/landing.test
 */

import { deepStrictEqual, match, ok } from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { describe, test } from 'node:test';
import { validateCommitMessage } from '@openinf/portal/build/commit-message';
import {
  checksVerdict,
  composeLandingMessage,
  partsOfMessage,
} from '@openinf/portal/build/landing';

const URL_ = 'https://github.com/OpenINF/openinf.github.io/pull/1234';

describe('partsOfMessage', () => {
  test('separates subject, body and trailers', () => {
    deepStrictEqual(
      partsOfMessage(
        '🏗️🔧：fix it\n\nWhy it needed fixing.\n\nSigned-off-by: A <a@e>\n'
      ),
      {
        subject: '🏗️🔧：fix it',
        body: ['Why it needed fixing.'],
        trailers: ['Signed-off-by: A <a@e>'],
      }
    );
  });

  test('lifts a trailer out of the middle of a body', () => {
    // A squashed message can only have one trailer block, at the end, so one
    // written half way up has to be found wherever it is.
    const { body, trailers } = partsOfMessage(
      '🏗️🔧：fix it\n\nRefs: https://x/1\n\nMore explanation.'
    );

    deepStrictEqual(trailers, ['Refs: https://x/1']);
    deepStrictEqual(body, ['More explanation.']);
  });

  test('reads a message written with carriage returns', () => {
    deepStrictEqual(
      partsOfMessage('🏗️🔧：fix it\r\n\r\nBody.\r\n\r\nFixes: https://x/1\r\n')
        .trailers,
      ['Fixes: https://x/1']
    );
  });
});

describe('composeLandingMessage', () => {
  test('a single commit lands as itself, plus where it came from', () => {
    const parts = [partsOfMessage('🏗️🔧：fix it\n\nWhy.\n\nRefs: https://x/1')];

    // `PR-URL` comes before `Refs` in the documented order, so the trailer
    // the commit carried moves below the one the landing adds.
    deepStrictEqual(
      composeLandingMessage(parts, URL_),
      `Why.\n\nPR-URL: ${URL_}\nRefs: https://x/1`
    );
  });

  test('several commits keep every word, subjects as headings', () => {
    const parts = [
      partsOfMessage('🏗️✨：the first thing\n\nWhy the first.'),
      partsOfMessage('🏗️🔧：the second thing\n\nWhy the second.'),
    ];

    deepStrictEqual(
      composeLandingMessage(parts, URL_),
      [
        '🏗️✨：the first thing',
        '',
        'Why the first.',
        '',
        '🏗️🔧：the second thing',
        '',
        'Why the second.',
        '',
        `PR-URL: ${URL_}`,
      ].join('\n')
    );
  });

  test('gathers scattered trailers into one block, in order', () => {
    const parts = [
      partsOfMessage('🏗️✨：one\n\nA.\n\nFixes: https://x/9'),
      partsOfMessage(
        '🏗️🔧：two\n\nB.\n\nAssisted-by: Claude-Code:claude-opus-5\nSigned-off-by: D <d@e>'
      ),
    ];
    const message = composeLandingMessage(parts, URL_);
    const block = message.slice(message.lastIndexOf('\n\n') + 2).split('\n');

    deepStrictEqual(block, [
      'Signed-off-by: D <d@e>',
      'Assisted-by: Claude-Code:claude-opus-5',
      `PR-URL: ${URL_}`,
      'Fixes: https://x/9',
    ]);
  });

  test('keeps one copy of a trailer both commits carried', () => {
    const signed = 'Signed-off-by: D <d@e>';
    const parts = [
      partsOfMessage(`🏗️✨：one\n\nA.\n\n${signed}`),
      partsOfMessage(`🏗️🔧：two\n\nB.\n\n${signed}`),
    ];

    deepStrictEqual(
      composeLandingMessage(parts, URL_)
        .split('\n')
        .filter((l) => l === signed).length,
      1
    );
  });

  test('drops a Refs that duplicates a Fixes', () => {
    const parts = [
      partsOfMessage('🏗️✨：one\n\nA.\n\nRefs: https://x/9'),
      partsOfMessage('🏗️🔧：two\n\nB.\n\nFixes: https://x/9'),
    ];
    const message = composeLandingMessage(parts, URL_);

    ok(message.includes('Fixes: https://x/9'));
    ok(!message.includes('Refs: https://x/9'));
  });
});

describe('the message that comes out', () => {
  test('passes the rules a commit answers to', () => {
    const parts = [
      partsOfMessage(
        '🏗️✨：one\n\nA reason.\n\nSigned-off-by: D <d@e>\nAssisted-by: Claude-Code:claude-opus-5'
      ),
      partsOfMessage('🏗️🔧：two\n\nAnother reason.'),
    ];
    const subject = '🏗️✨：land two things at once';

    deepStrictEqual(
      validateCommitMessage(
        `${subject}\n\n${composeLandingMessage(parts, URL_)}`
      ),
      []
    );
  });

  test('ends in a block git reads as trailers', () => {
    const parts = [
      partsOfMessage('🏗️✨：one\n\nA reason.\n\nSigned-off-by: D <d@e>'),
    ];
    const message = `🏗️✨：one\n\n${composeLandingMessage(parts, URL_)}`;
    const parsed = execFileSync('git', ['interpret-trailers', '--parse'], {
      encoding: 'utf8',
      input: message,
    })
      .split('\n')
      .filter(Boolean);

    deepStrictEqual(parsed, ['Signed-off-by: D <d@e>', `PR-URL: ${URL_}`]);
  });

  test('a body that would be too wide is still reported', () => {
    // The rules are applied to the composed message, not to the commits it
    // came from, so an over-wide line cannot slip through the join.
    const parts = [partsOfMessage(`🏗️✨：one\n\n${'word '.repeat(20)}`)];

    match(
      validateCommitMessage(
        `🏗️✨：one\n\n${composeLandingMessage(parts, URL_)}`
      ).join(),
      /the limit is 72/
    );
  });
});

describe('checksVerdict', () => {
  const run = (
    name: string,
    conclusion: string | null,
    status = 'completed'
  ) => ({
    name,
    status,
    conclusion,
  });

  test('says nothing when everything passed', () => {
    deepStrictEqual(checksVerdict([run('Lint and test', 'success')], []), '');
  });

  test('counts anything still running against it', () => {
    // A label applied while a check was in flight says nothing about how that
    // check turned out.
    match(
      checksVerdict([run('Lint and test', null, 'in_progress')], []),
      /have not finished: Lint and test/
    );
  });

  test('reports a failure by name', () => {
    match(
      checksVerdict([run('CodeQL', 'failure')], []),
      /did not pass: CodeQL/
    );
  });

  test('treats neutral and skipped as no complaint', () => {
    deepStrictEqual(
      checksVerdict(
        [run('Pages changed', 'neutral'), run('Deploy', 'skipped')],
        []
      ),
      ''
    );
  });

  test('reads the older commit statuses too', () => {
    // Some services on this repository report these rather than check runs,
    // so looking only at check runs would call a red commit green.
    match(
      checksVerdict([], [{ context: 'ci/legacy', state: 'failure' }]),
      /did not pass: ci\/legacy/
    );
  });

  test('holds a pending status back as well', () => {
    match(
      checksVerdict([], [{ context: 'ci/legacy', state: 'pending' }]),
      /have not finished: ci\/legacy/
    );
  });

  test('reports everything wrong, not just the first', () => {
    match(
      checksVerdict([run('A', 'failure'), run('B', 'timed_out')], []),
      /did not pass: A, B/
    );
  });
});

describe('checksVerdict and its own run', () => {
  test('does not wait for the queue that is doing the asking', () => {
    // The queue reports as a check itself, so counting it would mean waiting
    // for a job that cannot finish until it stops waiting.
    const own = {
      name: 'Land',
      status: 'in_progress',
      conclusion: null,
      detailsUrl: 'https://github.com/o/r/actions/runs/999/job/1',
    };

    deepStrictEqual(
      checksVerdict(
        [own, { name: 'Lint', status: 'completed', conclusion: 'success' }],
        [],
        '999'
      ),
      ''
    );
  });

  test('still waits for a different run', () => {
    const other = {
      name: 'Lint',
      status: 'in_progress',
      conclusion: null,
      detailsUrl: 'https://github.com/o/r/actions/runs/1000/job/1',
    };

    match(checksVerdict([other], [], '999'), /have not finished: Lint/);
  });

  test('does not cite the refusal it left behind last time', () => {
    // A refusal exits non-zero, so an attempt made while a check was still
    // running leaves a failed check of its own on the commit. Counting it
    // would mean the first refusal decided every later one, and the pull
    // request could never be landed from that commit again.
    const earlier = {
      name: 'Land',
      status: 'completed',
      conclusion: 'failure',
      detailsUrl: 'https://github.com/o/r/actions/runs/998/job/1',
    };

    deepStrictEqual(
      checksVerdict(
        [earlier, { name: 'Lint', status: 'completed', conclusion: 'success' }],
        [],
        '999',
        'Land'
      ),
      ''
    );
  });

  test('still reports a failure that is not the queue', () => {
    match(
      checksVerdict(
        [{ name: 'Lint', status: 'completed', conclusion: 'failure' }],
        [],
        '999',
        'Land'
      ),
      /did not pass: Lint/
    );
  });
});
