/**
 * @file Reading SDK releases, and saying whether the portal is behind them.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/sdk-release
 *
 * The deciding is here rather than in `check-sdk-api-drift.mts` so that it
 * can be read without reaching the network. What the task keeps is the two
 * things that do: asking the SDK repository for its tags, and reading the
 * directories in this checkout.
 */

import { compareVersions } from '@openinf/portal/build/sdk-docs';

/** A release version, as the portal, the SDK and Changesets all spell one. */
const VERSION = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

/** What this portal is being compared against, and where its releases sit. */
const ARTIFACTS = 'vendor/sdk-api';

/**
 * The release a tag names, if it names one.
 *
 * Changesets writes `@scope/name@1.2.3` for a scoped package, so the version
 * is what follows the last `@` rather than the first -- the scope's own `@`
 * is the one at the start. A tag that is not a release, such as someone's
 * marker, is not an error; it is simply not an answer, and is left out.
 * @param {string} tag The tag name as the API gives it.
 * @returns {string | undefined} The version it names, if it names one.
 */
export function releaseOf(tag: string) {
  const at = tag.lastIndexOf('@');
  const candidate = at <= 0 ? tag.replace(/^v/, '') : tag.slice(at + 1);

  return VERSION.test(candidate) ? candidate : undefined;
}

/**
 * The newest of a set of versions, by precedence rather than by name.
 * Sorting by name would put 10.0.0 below 4.2.0, which is the same mistake the
 * release listing on `/docs/sdk/` avoids.
 * @param {string[]} versions The versions to choose between.
 * @returns {string | undefined} The newest, or nothing when there are none.
 */
export function newestRelease(versions: string[]) {
  return [...versions].sort(compareVersions).at(0);
}

/** Whether the portal is behind, and what to say about it. */
export type Drift = { behind: boolean; report: string };

/**
 * Compares the newest release the SDK has tagged against the newest one this
 * portal documents, and writes what a reader should do about the answer.
 *
 * A portal documenting nothing is only behind once a release exists to be
 * behind. Before the SDK's first tag there is no artifact anywhere, so there
 * is nothing missing here -- which is not what asking the registry would have
 * said, since every package in the SDK shipped for years from a repository of
 * its own and those versions are still served.
 * @param {string | undefined} released The newest release the SDK has tagged.
 * @param {string | undefined} documented The newest release published here.
 * @returns {Drift} Whether to report, and the report.
 */
export function driftReport(
  released: string | undefined,
  documented: string | undefined
): Drift {
  if (released === undefined) {
    return {
      behind: false,
      report:
        'The SDK has tagged no release, so there is no API reference for ' +
        'this portal to be missing.',
    };
  }

  if (documented === undefined) {
    return {
      behind: true,
      report: [
        `The SDK has released ${released}, and this portal documents no`,
        'release at all.',
        '',
        `\`${ARTIFACTS}/\` holds no version directory, so \`/docs/sdk/\``,
        'renders its placeholder rather than an API reference.',
        '',
        'Run the **SDK API sync** workflow here with the ID of the Release',
        `run that published ${released}.`,
      ].join('\n'),
    };
  }

  if (compareVersions(released, documented) < 0) {
    return {
      behind: true,
      report: [
        `The SDK has released ${released}, and the newest API reference this`,
        `portal documents is ${documented}.`,
        '',
        "A release's reference is handed over separately from publishing it,",
        'and nothing fails when that step is missed. See "Publishing the API',
        'reference" in the SDK\'s `RELEASING.md`, or run the **SDK API sync**',
        'workflow here with the ID of the Release run that published',
        `${released}.`,
      ].join('\n'),
    };
  }

  return {
    behind: false,
    report:
      `The SDK has released ${released}, and this portal documents ` +
      `${documented}.`,
  };
}
