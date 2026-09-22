/**
 * @file Compare the API reference published here against what the SDK tagged.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/check-sdk-api-drift
 *
 * Outside `verify/` for the reason `check-vendored.mts` is: it reaches the
 * network, and every task in that directory runs on every pull request. A
 * host that is slow or unreachable would fail changes that have nothing to do
 * with it.
 *
 * Handing a release's documentation over is a step of its own, and nothing
 * fails when it is skipped -- the packages are on the registry either way and
 * this portal simply never hears about them. That silence is what this reads.
 *
 * It asks the SDK repository for its tags rather than asking the registry for
 * versions, because the question is narrower than "what is published". Every
 * package in the SDK was published for years from a repository of its own,
 * and those versions are on the registry still; none was built with an
 * artifact for this portal to import, so the registry would report a
 * reference missing for releases that never had one. `changeset publish`
 * tags what it publishes, in the SDK's own repository, so a tag there is
 * exactly a release that shipped from the workspace the Release workflow
 * builds the artifact from.
 *
 * What to make of the answer is in `build/shared/sdk-release.mts`, where it
 * can be read without a network. This is the part that cannot: the tags, and
 * the directories in this checkout.
 *
 * The exit code carries both answers at once, the way `check-vendored.mts`
 * does: bit 1 is set when the portal is behind, bit 2 when the tags could not
 * be read. Being behind is a thing to act on and an unreachable host is not,
 * so neither hides the other.
 */

import { readdir } from 'node:fs/promises';
import {
  driftReport,
  newestRelease,
  releaseOf,
} from '@openinf/portal/build/sdk-release';

/** Where releases are kept, relative to the repository root. */
const ARTIFACTS = 'vendor/sdk-api';

/** The repository whose releases this portal documents. */
const SDK = 'OpenINF/sdk';

/** How long to wait on the API before giving up, in milliseconds. */
const TIMEOUT = 30_000;

/**
 * Tags to ask for at once, and how many pages to walk. Changesets tags every
 * package it publishes, so one release of the SDK leaves as many tags as it
 * has packages, and this list grows a good deal faster than the releases in
 * it. The ceiling is high enough to be years away and low enough that a
 * misbehaving API cannot hold the job open indefinitely.
 */
const PER_PAGE = 100;
const PAGES = 20;

/** Bits of the exit code. Both can be set; neither masks the other. */
const MATCHED = 0;
const BEHIND = 1;
const UNCHECKED = 2;

/**
 * Says what went wrong in a sentence rather than a stack trace.
 * @param {unknown} error Whatever was thrown.
 * @returns {string} Its message.
 */
const reasonOf = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

/**
 * The releases this portal documents, read from the directories themselves
 * rather than from the generated collection, which is not in the checkout.
 * @returns {Promise<string[]>} Every release version found.
 */
async function imported() {
  try {
    const entries = await readdir(ARTIFACTS, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((e) => e.name);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

/**
 * Every release the SDK repository has tagged.
 *
 * The API does not promise an order for tags, so they are all read rather
 * than the first page being trusted to hold the newest. A page short of
 * `PER_PAGE` is the last one; running out of pages first is reported rather
 * than answered, since the newest release could be on a page never asked for.
 * @returns The releases found, or why they could not be read.
 */
async function tagged(): Promise<{ releases?: string[]; problem?: string }> {
  const token = process.env.GITHUB_TOKEN;
  const releases: string[] = [];

  for (let page = 1; page <= PAGES; page += 1) {
    const url =
      `https://api.github.com/repos/${SDK}/tags` +
      `?per_page=${PER_PAGE}&page=${page}`;
    let tags: { name?: unknown }[];

    try {
      const response = await fetch(url, {
        headers: {
          accept: 'application/vnd.github+json',
          // The API refuses a request that does not introduce itself.
          'user-agent': `${SDK} API reference drift check`,
          'x-github-api-version': '2022-11-28',
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        signal: AbortSignal.timeout(TIMEOUT),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      tags = (await response.json()) as { name?: unknown }[];
    } catch (error) {
      return { problem: reasonOf(error) };
    }

    if (!Array.isArray(tags)) {
      return { problem: 'the API served something other than a list of tags' };
    }

    for (const tag of tags) {
      if (typeof tag.name !== 'string') continue;
      const release = releaseOf(tag.name);
      if (release !== undefined) releases.push(release);
    }

    if (tags.length < PER_PAGE) return { releases };
  }

  return {
    problem:
      `more than ${PER_PAGE * PAGES} tags, which is past what this reads. ` +
      'The newest release may be on a page it never asked for.',
  };
}

const answer = await tagged();
const { behind, report } = driftReport(
  answer.releases === undefined ? undefined : newestRelease(answer.releases),
  newestRelease(await imported())
);

// Everything goes to stdout, including what went wrong: whatever runs this
// keeps only that, and a reason written anywhere else is a reason lost.
if (answer.problem !== undefined) {
  console.log(`The SDK's tags could not be read: ${answer.problem}`);
  console.log('');
} else {
  console.log(report);
}

process.exitCode =
  MATCHED |
  (behind ? BEHIND : MATCHED) |
  (answer.problem === undefined ? MATCHED : UNCHECKED);
