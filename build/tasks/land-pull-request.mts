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
  checksVerdict,
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

const [number, ...flags] = process.argv.slice(2);
const dryRun = flags.includes('--dry-run');

const run = (command: string, args: string[]) =>
  execFileSync(command, args, { encoding: 'utf8', maxBuffer: 1 << 24 }).trim();

/**
 * Runs `gh`, and tries a second time before giving up. A read that fails
 * because GitHub returned a 502 or throttled the request is not a reason to
 * refuse to land, and it happens often enough to have happened here: an
 * earlier version crashed on one and worked when run again unchanged.
 * @param {...string} args What to pass to `gh`.
 * @returns {string} Its output.
 */
const gh = (...args: string[]) => {
  try {
    return run('gh', args);
  } catch (first) {
    // A merge is not safe to repeat blindly: if the first attempt reached
    // GitHub, the second would report an already-merged pull request as a
    // failure. Reads are.
    if (args.includes('PUT')) throw first;

    return run('gh', args);
  }
};

const git = (...args: string[]) => run('git', args);

/**
 * Works something out once, the first time it is wanted. Asked for at the top
 * of the file instead, these would run before anything could catch them
 * failing, and a broken `gh` would print a stack trace rather than a reason.
 * @param {() => T} work How to find the answer.
 * @returns {() => T} A function returning it, computed at most once.
 */
const once = <T,>(work: () => T) => {
  let answer: T | undefined;

  return () => {
    answer ??= work();

    return answer;
  };
};

// Nothing here names a repository. A workflow sets GITHUB_REPOSITORY, and a
// terminal has a remote to read it from, so a copy of this file lands in
// another repository without being edited first.
const repository = once(
  () =>
    process.env.GITHUB_REPOSITORY ??
    git('remote', 'get-url', 'origin').match(
      /github\.com[/:](?<repo>[^/]+\/[^/]+?)(?:\.git)?$/
    )?.groups?.repo ??
    ''
);

const defaultBranch = once(() =>
  gh('api', `repos/${repository()}`, '--jq', '.default_branch')
);

/** Who is asking for this to land: the labeller, or whoever is at the keyboard. */
const actor = once(
  () => process.env.LAND_ACTOR ?? gh('api', 'user', '--jq', '.login')
);

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
        `repos/${repository()}/pulls/${pull}`,
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
 * Fetches what GitHub reports about a commit, and asks whether it is a reason
 * to land. Both kinds are read: some services on this repository still report
 * the older commit statuses rather than check runs.
 * @param {string} sha The commit the pull request is at.
 * @returns {string} The reason not to land, or an empty string if there is none.
 */
const checksRefuse = (sha: string) =>
  checksVerdict(
    JSON.parse(
      gh(
        'api',
        `repos/${repository()}/commits/${sha}/check-runs`,
        '--jq',
        '[.check_runs[] | {name, status, conclusion, detailsUrl: .details_url}]'
      )
    ),
    JSON.parse(
      gh(
        'api',
        `repos/${repository()}/commits/${sha}/status`,
        '--jq',
        '[.statuses[] | {context, state}]'
      )
    ),
    process.env.GITHUB_RUN_ID ?? '',
    process.env.LAND_CHECK_NAME ?? ''
  );

/**
 * Says why the person asking is not entitled to land anything. Applying a
 * label needs only triage, which does not carry the right to push -- so
 * without this, the label would quietly hand out that right.
 * @returns {string} The reason, or an empty string if there is none.
 */
const actorRefuses = () => {
  const permission = gh(
    'api',
    `repos/${repository()}/collaborators/${actor()}/permission`,
    '--jq',
    '.permission'
  );

  return ['admin', 'maintain', 'write'].includes(permission)
    ? ''
    : `${actor()} has ${permission} access, which does not carry the right to push`;
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
    return `it conflicts with ${defaultBranch()}; rebase the branch onto it and push first`;
  }

  if (pull.base !== defaultBranch()) {
    return `it targets ${pull.base}; retarget it, or land its base first`;
  }

  if (pull.mergeableState === 'unknown') {
    return 'GitHub has not worked out whether it merges yet; try again shortly';
  }

  const unentitled = actorRefuses();

  if (unentitled !== '') return unentitled;

  const checks = checksRefuse(pull.head);

  return checks === '' ? '' : `${checks}`;
};

// Anything unexpected -- a network failure that outlived its retry, a
// command that is not installed -- should say so in a line rather than
// print a stack trace at whoever applied a label.
try {
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
      // Asked of the API rather than of git, so that the branch under review
      // never has to be fetched. Running as `pull_request_target`, this holds
      // credentials that can write to the repository, and the safest thing to
      // do with a stranger's commits is to not have them on disk at all.
      // GitHub returns them oldest first, which is the order to read them in,
      // and merges are dropped since their messages say nothing.
      const messages: string[] = JSON.parse(
        gh(
          'api',
          '--paginate',
          `repos/${repository()}/pulls/${number}/commits`,
          '--jq',
          '[.[] | select(.parents | length < 2) | .commit.message]'
        )
      );
      const parts = messages.map((message) => partsOfMessage(message));
      const message = composeLandingMessage(
        parts,
        `https://github.com/${repository()}/pull/${number}`
      );
      const problems = validateCommitMessage(`${pull.title}\n\n${message}`);
      const rule = '='.repeat(72);

      console.log(`${rule}\n${pull.title}\n\n${message}\n${rule}`);
      console.log(
        `#${number}: ${messages.length} commit${messages.length === 1 ? '' : 's'}, ${pull.mergeableState}`
      );

      if (messages.length === 0) {
        console.error(`\n#${number} has no commits over ${defaultBranch()}.`);
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
            `repos/${repository()}/pulls/${number}/merge`,
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
} catch (error) {
  console.error(
    `Could not land #${number}: ${error instanceof Error ? error.message.split(String.fromCharCode(10))[0] : String(error)}`
  );
  process.exitCode = 1;
}
