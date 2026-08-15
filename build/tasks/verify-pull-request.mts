/**
 * @file Verify a pull request's title and description before it can land.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/verify/verify-pull-request
 */

import { validateCommitMessage } from '@openinf/portal/build/commit-message';
import { visibleText } from '@openinf/portal/build/pull-request';

// Read from the environment rather than interpolated into a command by the
// workflow: a title is written by whoever opened the pull request, and pasting
// one into a shell is how a title comes to run as code.
const title = process.env.PR_TITLE ?? '';
const body = process.env.PR_BODY ?? '';

if (process.env.PR_TITLE === undefined) {
  console.error(
    'PR_TITLE is not set. This task reads the pull request from the ' +
      'environment; see .github/workflows/pull-request-policy.yml.'
  );
  process.exitCode = 1;
} else {
  const problems: string[] = [];

  // The title becomes the subject of the commit that lands, because the
  // squash takes it verbatim. So it answers to the same rules, and checking
  // it here is the only chance to say so before the subject is history.
  for (const problem of validateCommitMessage(title)) {
    problems.push(`title: ${problem}`);
  }

  // The template is one long HTML comment, so a pull request opened without a
  // word written renders as nothing at all. That is what this looks for --
  // not what the description says, only that there is one.
  if (visibleText(body) === '') {
    problems.push(
      'description: say why the change is needed and what it does. The ' +
        'template is a comment, so a description that is only the template ' +
        'shows a reader nothing.'
    );
  }

  if (problems.length > 0) {
    console.error(`This pull request is not ready to land:\n`);
    for (const problem of problems) console.error(`  ${problem}`);
    process.exitCode = 1;
  } else {
    console.log('Title and description are in order.');
  }
}
