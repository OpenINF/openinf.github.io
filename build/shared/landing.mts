/**
 * @file Building the commit message a pull request lands as.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/landing
 *
 * Nothing here knows what a subject is supposed to look like. Composing a
 * landed message -- keeping every commit's words, gathering the trailers into
 * the one paragraph git reads, adding the pull request it came through -- is
 * the same job whatever house style a repository writes its subjects in, and
 * the repositories in this organization do not agree on that yet.
 */

import { linesOf, TRAILER_ORDER } from '@openinf/portal/build/commit-message';

/** One commit's message, split into the parts a landed message reuses. */
export type CommitParts = {
  subject: string;
  body: string[];
  trailers: string[];
};

const tokenOf = (line: string) => line.match(/^([A-Za-z][\w-]*):/)?.[1] ?? '';

/**
 * Splits a commit message into the parts a landed message reuses. Trailers
 * are lifted out wherever they were written, because a squashed message can
 * only have one trailer block and it has to be at the end.
 * @param {string} message One commit's whole message.
 * @returns {CommitParts} Its subject, its body, and the trailers it carried.
 */
export function partsOfMessage(message: string): CommitParts {
  const [subject = '', ...rest] = linesOf(message);
  const body: string[] = [];
  const trailers: string[] = [];

  for (const line of rest) {
    if (TRAILER_ORDER.includes(tokenOf(line))) trailers.push(line);
    else body.push(line);
  }

  while (body.at(-1)?.trim() === '') body.pop();
  while (body.at(0)?.trim() === '') body.shift();

  return { subject, body, trailers };
}

/**
 * Builds the message a pull request should land as. One commit lands as
 * itself. Several land as one, every message kept whole so that nothing
 * written down is lost -- each subject becomes a heading in the body, the
 * first included, since a pull request title describes the whole and need not
 * be any single commit's subject.
 * @param {CommitParts[]} parts Each commit on the branch, oldest first.
 * @param {string} prUrl The pull request the commits are landing through.
 * @returns {string} Everything below the subject line.
 */
export function composeLandingMessage(parts: CommitParts[], prUrl: string) {
  const paragraphs =
    parts.length === 1
      ? (parts[0]?.body ?? [])
      : parts.flatMap((part, index) => [
          ...(index === 0 ? [] : ['']),
          part.subject,
          '',
          ...part.body,
        ]);

  const rank = (line: string) => TRAILER_ORDER.indexOf(tokenOf(line));
  const gathered = [
    ...new Set([...parts.flatMap((part) => part.trailers), `PR-URL: ${prUrl}`]),
  ].sort((one, other) => rank(one) - rank(other));

  // `Fixes:` says everything `Refs:` would about the same issue.
  const fixed = new Set(
    gathered
      .filter((line) => line.startsWith('Fixes:'))
      .map((line) => line.slice('Fixes:'.length).trim())
  );

  return [
    ...paragraphs,
    '',
    ...gathered.filter(
      (line) =>
        !(
          line.startsWith('Refs:') &&
          fixed.has(line.slice('Refs:'.length).trim())
        )
    ),
  ].join('\n');
}

/** What GitHub reports about one check run on a commit. */
export type CheckRun = {
  name: string;
  status: string;
  conclusion: string | null;
  detailsUrl?: string;
  startedAt?: string;
};

/** What GitHub reports about one commit status, which is the older kind. */
export type CommitStatus = { context: string; state: string };

/**
 * Says why the checks on a commit are not a reason to land it. Anything still
 * running counts against it: a label applied while a check was in flight says
 * nothing about how that check turned out. Neutral and skipped do not count
 * against it, since neither is a complaint.
 *
 * The queue is itself a check, and none of its runs count -- neither the one
 * doing the asking, which cannot finish until it stops waiting, nor any run
 * before it. A refusal exits non-zero and so leaves a failed check of its own
 * behind, and counting that would let the first refusal decide every later
 * one: label a pull request while a check is in flight, and the queue would
 * go on citing its own complaint for as long as the branch sat at that commit.
 * @param {CheckRun[]} all The check runs reported on the commit.
 * @param {CommitStatus[]} statuses The commit statuses reported on it.
 * @param {string} ownRunId The workflow run doing the asking, if it is one.
 * @param {string} ownCheckName What the queue reports as, if it knows.
 * @returns {string} The reason, or an empty string if there is none.
 */
export function checksVerdict(
  all: CheckRun[],
  statuses: CommitStatus[],
  ownRunId = '',
  ownCheckName = ''
) {
  const isOwn = (run: CheckRun) =>
    (ownRunId !== '' &&
      (run.detailsUrl ?? '').includes(`/actions/runs/${ownRunId}/`)) ||
    (ownCheckName !== '' && run.name === ownCheckName);
  // A workflow that cancels superseded runs leaves the cancelled one on the
  // commit beside the run that replaced it. Both carry the same name, and
  // only the newest says how that check turned out.
  const newest = new Map<string, CheckRun>();
  for (const run of all.filter((run) => !isOwn(run))) {
    const seen = newest.get(run.name);
    if (seen === undefined || (run.startedAt ?? '') >= (seen.startedAt ?? '')) {
      newest.set(run.name, run);
    }
  }

  const runs = [...newest.values()];
  const pending = [
    ...runs.filter((run) => run.status !== 'completed').map((run) => run.name),
    ...statuses
      .filter((status) => status.state === 'pending')
      .map((status) => status.context),
  ];

  if (pending.length > 0) {
    return `these have not finished: ${pending.sort().join(', ')}`;
  }

  const failed = [
    ...runs
      .filter(
        (run) =>
          run.conclusion !== null &&
          !['success', 'neutral', 'skipped'].includes(run.conclusion)
      )
      .map((run) => run.name),
    ...statuses
      .filter((status) => !['success', 'pending'].includes(status.state))
      .map((status) => status.context),
  ];

  return failed.length > 0
    ? `these did not pass: ${failed.sort().join(', ')}`
    : '';
}
