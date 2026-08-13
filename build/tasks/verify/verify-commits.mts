/**
 * @file Verify commit messages on this branch follow the project's format.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/verify/verify-commits
 */

import { execFileSync } from 'node:child_process';
import {
  readTrailers,
  validateCommitMessage,
} from '@openinf/portal/build/commit-message';

/**
 * A GitHub app commits as `<id>+<name>[bot]@users.noreply.github.com`, and the
 * `[bot]` is the part that is reserved -- an account cannot be named with it.
 */
const BOT_AUTHOR = /\[bot\]@users\.noreply\.github\.com$/;

const git = (...args: string[]) =>
  execFileSync('git', args, { encoding: 'utf8' }).trim();

/**
 * Finds what to compare against: the base branch of the pull request when a
 * workflow says so, and the default branch otherwise.
 * @returns {string} A revision, or an empty string if none could be resolved.
 */
const resolveBase = () => {
  const candidates = [
    process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : '',
    'origin/live',
    'live',
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      return git('rev-parse', '--verify', '--quiet', `${candidate}^{commit}`);
    } catch {
      // Try the next one; a shallow clone has few of these.
    }
  }

  return '';
};

const base = resolveBase();

if (base === '') {
  console.error(
    'Could not resolve a base revision to compare against. In a workflow ' +
      'this means the checkout is too shallow -- `fetch-depth: 0` gives the ' +
      'history this needs.'
  );
  process.exitCode = 1;
} else {
  const range = `${base}..HEAD`;
  const shas = git('rev-list', '--no-merges', range)
    .split('\n')
    .filter(Boolean);
  let failed = 0;
  let skipped = 0;

  for (const sha of shas) {
    // Renovate writes `chore(deps): …` and dependabot writes `Bump x from y
    // to z`, neither of which is this format, and neither of which is theirs
    // to change. Holding them to it would leave every dependency update
    // failing its checks and, since they automerge on green, never landing.
    if (BOT_AUTHOR.test(git('log', '-1', '--format=%ae', sha))) {
      skipped += 1;
      continue;
    }

    const message = git('log', '-1', '--format=%B', sha);
    const problems = validateCommitMessage(message);

    // git has the final say on what counts as a trailer, so the rules above
    // are cross-checked against it rather than trusted on their own. A
    // disagreement means the rules have drifted from the tool they describe.
    const parsed = execFileSync('git', ['interpret-trailers', '--parse'], {
      encoding: 'utf8',
      input: message,
    })
      .split('\n')
      .filter(Boolean);
    const expected = readTrailers(message);

    if (problems.length === 0 && parsed.length !== expected.length) {
      problems.push(
        `git reads ${parsed.length} trailers here where the rules read ${expected.length}; the two have drifted apart`
      );
    }

    if (problems.length > 0) {
      failed += 1;
      console.error(`${sha.slice(0, 9)} ${message.split('\n')[0]}`);
      for (const problem of problems) console.error(`  ${problem}`);
    }
  }

  const checked = shas.length - skipped;

  console.log(
    `Checked ${checked} commit${checked === 1 ? '' : 's'} in ${range}` +
      (skipped > 0 ? `, leaving ${skipped} written by a bot.` : '.')
  );

  if (failed > 0) process.exitCode = 1;
}
