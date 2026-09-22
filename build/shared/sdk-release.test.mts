/**
 * @file Regression tests for reading SDK releases and reporting drift.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/sdk-release.test
 */

import { match, strictEqual } from 'node:assert/strict';
import { test } from 'node:test';
import {
  driftReport,
  newestRelease,
  releaseOf,
} from '@openinf/portal/build/sdk-release';

test('reads the release out of a tag Changesets wrote', () => {
  strictEqual(releaseOf('@openinf/util-types@2.1.3'), '2.1.3');
  strictEqual(releaseOf('@openinf/util@10.0.0'), '10.0.0');
  strictEqual(releaseOf('@openinf/util@3.0.0-rc.1'), '3.0.0-rc.1');
});

test('reads a release tagged without a package name', () => {
  strictEqual(releaseOf('v3.0.0'), '3.0.0');
  strictEqual(releaseOf('3.0.0'), '3.0.0');
});

test('ignores a tag that does not name a release', () => {
  // The scope's `@` is not the one the version follows, so a bare package
  // name must not read as the release `openinf/util-types`.
  strictEqual(releaseOf('@openinf/util-types'), undefined);
  strictEqual(releaseOf('before-the-rewrite'), undefined);
  strictEqual(releaseOf('@openinf/util@latest'), undefined);
  strictEqual(releaseOf('@openinf/util@3.0'), undefined);
  strictEqual(releaseOf(''), undefined);
});

test('chooses the newest release by precedence, not by name', () => {
  strictEqual(newestRelease(['3.0.0', '10.0.0', '4.2.0']), '10.0.0');
  strictEqual(newestRelease(['3.0.0', '3.0.0-rc.1']), '3.0.0');
  strictEqual(newestRelease(['3.0.1']), '3.0.1');
  strictEqual(newestRelease([]), undefined);
});

test('reports nothing missing before the SDK has tagged a release', () => {
  // The registry serves versions of every SDK package, published for years
  // from repositories of their own. None of them had an artifact, so a
  // portal documenting nothing is not behind them.
  const { behind, report } = driftReport(undefined, undefined);

  strictEqual(behind, false);
  match(report, /tagged no release/);
});

test('reports a portal that documents nothing once a release exists', () => {
  const { behind, report } = driftReport('3.0.0', undefined);

  strictEqual(behind, true);
  match(report, /released 3\.0\.0/);
  match(report, /documents no\nrelease at all/);
  match(report, /SDK API sync/);
});

test('reports a portal left behind by a newer release', () => {
  const { behind, report } = driftReport('3.1.0', '3.0.0');

  strictEqual(behind, true);
  match(report, /released 3\.1\.0/);
  match(report, /documents is 3\.0\.0/);
  match(report, /RELEASING\.md/);
});

test('reports nothing when the portal documents the newest release', () => {
  const { behind, report } = driftReport('3.0.0', '3.0.0');

  strictEqual(behind, false);
  match(report, /released 3\.0\.0, and this portal documents 3\.0\.0/);
});

test('reports nothing when the portal is ahead of the newest tag', () => {
  // A release whose tag has not appeared yet, or a reference imported before
  // the tag was pushed. Either way there is nothing missing here.
  strictEqual(driftReport('3.0.0', '3.1.0').behind, false);
});

test('compares releases by precedence rather than by name', () => {
  strictEqual(driftReport('10.0.0', '4.2.0').behind, true);
  strictEqual(driftReport('4.2.0', '10.0.0').behind, false);
});

test('treats a release as newer than its own prereleases', () => {
  strictEqual(driftReport('3.0.0', '3.0.0-rc.1').behind, true);
  strictEqual(driftReport('3.0.0-rc.1', '3.0.0').behind, false);
});
