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

import { TRAILER_ORDER } from '@openinf/portal/build/commit-message';

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
  const [subject = '', ...rest] = message
    .replace(/[\r\n]+$/, '')
    .split(/\r?\n/);
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
