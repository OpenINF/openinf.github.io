/**
 * @file Land a pull request as one commit, with a message worth keeping.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/land-pull-request
 *
 * Run as `nps land <number>`, or `nps "land <number> --dry-run"` to see the
 * message without landing anything. Squash merging through the GitHub user
 * interface would take the pull request body, or nothing, and leave the
 * trailers where git cannot read them; this builds the message instead, holds
 * it to the same rules a commit answers to, and only then merges.
 */

import { execFileSync } from 'node:child_process';
import { validateCommitMessage } from '@openinf/portal/build/commit-message';
import {
  composeLandingMessage,
  partsOfMessage,
} from '@openinf/portal/build/landing';

/** What this task needs to know about a pull request. */
type PullRequest = {
  title: string;
  base: string;
  head: string;
  state: string;
  draft: boolean;
  mergeableState: string;
};

const REPOSITORY = 'OpenINF/openinf.github.io';
const DEFAULT_BRANCH = 'live';

const [number, ...flags] = process.argv.slice(2);
const dryRun = flags.includes('--dry-run');

const gh = (...args: string[]) =>
  execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 1 << 24 }).trim();
const git = (...args: string[]) =>
  execFileSync('git', args, { encoding: 'utf8', maxBuffer: 1 << 24 }).trim();

/**
 * Reads the pull request, waiting for GitHub to work out whether it merges.
 * The answer is `unknown` for a moment after anything lands on the base, and
 * acting on that would be acting on a stale one.
 * @param {string} pull The pull request number.
 * @returns {Promise<PullRequest>} The fields this task needs.
 */
const readPull = async (pull: string): Promise<PullRequest> => {
  const fetchPull = () =>
    JSON.parse(
      gh(
        'api',
        `repos/${REPOSITORY}/pulls/${pull}`,
        '--jq',
        '{title, base: .base.ref, head: .head.sha, state, draft, mergeableState: .mergeable_state}'
      )
    );
  let found = fetchPull();

  // Only an open pull request is worth waiting on. A closed one reports
  // `unknown` for ever, and waiting twenty seconds to say so helps nobody.
  for (
    let attempt = 0;
    attempt < 10 &&
    found.state === 'open' &&
    !found.draft &&
    found.mergeableState === 'unknown';
    attempt += 1
  ) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    found = fetchPull();
  }

  return found;
};

/**
 * Says why a pull request cannot be landed as it stands.
 * @param {PullRequest} pull What GitHub reports about it.
 * @returns {string} The reason, or an empty string if there is none.
 */
const refuse = (pull: PullRequest) => {
  if (pull.draft || pull.state !== 'open') {
    return `it is ${pull.draft ? 'a draft' : pull.state}`;
  }

  if (pull.mergeableState === 'dirty') {
    return `it conflicts with ${DEFAULT_BRANCH}; rebase the branch onto it and push first`;
  }

  if (pull.base !== DEFAULT_BRANCH) {
    return `it targets ${pull.base}; retarget it, or land its base first`;
  }

  if (pull.mergeableState === 'unknown') {
    return 'GitHub has not worked out whether it merges yet; try again shortly';
  }

  return '';
};

if (number === undefined || !/^\d+$/.test(number)) {
  console.error('Usage: nps "land <number> [--dry-run]"');
  process.exitCode = 1;
} else {
  const pull = await readPull(number);
  const reason = refuse(pull);

  if (reason !== '') {
    console.error(`#${number} cannot be landed: ${reason}.`);
    process.exitCode = 1;
  } else {
    // Oldest first, so the landed message reads in the order the work was
    // done rather than the order git lists it.
    const shas = git(
      'rev-list',
      '--reverse',
      '--no-merges',
      `origin/${DEFAULT_BRANCH}..${pull.head}`
    )
      .split('\n')
      .filter(Boolean);
    const parts = shas.map((sha) =>
      partsOfMessage(git('log', '-1', '--format=%B', sha))
    );
    const message = composeLandingMessage(
      parts,
      `https://github.com/${REPOSITORY}/pull/${number}`
    );
    const problems = validateCommitMessage(`${pull.title}\n\n${message}`);
    const rule = '='.repeat(72);

    console.log(`${rule}\n${pull.title}\n\n${message}\n${rule}`);
    console.log(
      `#${number}: ${shas.length} commit${shas.length === 1 ? '' : 's'}, ${pull.mergeableState}`
    );

    if (shas.length === 0) {
      console.error(`\n#${number} has no commits over ${DEFAULT_BRANCH}.`);
      process.exitCode = 1;
    } else if (problems.length > 0) {
      console.error(
        '\nThe message this would land does not pass its own rules:'
      );
      for (const problem of problems) console.error(`  ${problem}`);
      process.exitCode = 1;
    } else if (dryRun) {
      console.log('\nDry run; nothing landed.');
    } else {
      const merged = JSON.parse(
        gh(
          'api',
          '-X',
          'PUT',
          `repos/${REPOSITORY}/pulls/${number}/merge`,
          '-f',
          'merge_method=squash',
          '-f',
          `commit_title=${pull.title}`,
          '-f',
          `commit_message=${message}`,
          '-f',
          `sha=${pull.head}`,
          '--jq',
          '{merged, sha}'
        )
      );

      if (merged.merged === true) console.log(`\nLanded as ${merged.sha}`);
      else {
        console.error(`\n#${number} did not merge.`);
        process.exitCode = 1;
      }
    }
  }
}
