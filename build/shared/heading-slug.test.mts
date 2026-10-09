/**
 * @file Tests for the heading anchor rule.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/heading-slug.test
 */

// cspell:ignore fetchcontent

import { strictEqual } from 'node:assert/strict';
import { describe, test } from 'node:test';
import { headingSlug } from '@openinf/portal/build/heading-slug';

describe('headingSlug', () => {
  test('matches the anchors TypeDoc links to', () => {
    strictEqual(headingSlug('logLevel?'), 'loglevel');
    strictEqual(headingSlug('fetchContent()'), 'fetchcontent');
    strictEqual(headingSlug('set()?'), 'set');
    strictEqual(headingSlug('submodule_git_url?'), 'submodule_git_url');
  });

  test('drops punctuation as GitHub does, keeping hyphens', () => {
    strictEqual(
      headingSlug('Show the command, not the ceremony'),
      'show-the-command-not-the-ceremony'
    );
    strictEqual(
      headingSlug('Required items (commands, arguments, etc.)'),
      'required-items-commands-arguments-etc'
    );
    strictEqual(headingSlug('Questions or thoughts?'), 'questions-or-thoughts');
    strictEqual(headingSlug('Before-and-after'), 'before-and-after');
  });

  test('keeps letters and digits from any script', () => {
    strictEqual(headingSlug('Café naïve 2026'), 'café-naïve-2026');
  });

  test('turns every space into a hyphen', () => {
    strictEqual(headingSlug('  a  b '), 'a--b');
  });
});
