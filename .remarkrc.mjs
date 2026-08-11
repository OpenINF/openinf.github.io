/**-*- coding: utf-8 -*- esm -*- /.remarkrc.mjs ********************************

  This file is amongst the sources of OpenINF, Infuse.js, and webServagility.

********************************************************************************

  The main Remark Lint configuration file for lint rule & preset initialization

*******************************************************************************/

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { unified } from 'unified';

const infoStrings = [
  'ada',
  'bash',
  'bibtex',
  'c',
  'coffee',
  'console',
  'cpp',
  'csharp',
  'css',
  'diff',
  'dir',
  'dts',
  'elixir',
  'fortran',
  'fountain',
  'gitattributes',
  'golang',
  'html',
  'html+jinja',
  'html+liquid',
  'java',
  'js',
  'json',
  'markdown',
  'matlab',
  'objc',
  'pascal',
  'perl',
  'php',
  'powershell',
  'python',
  'r',
  'ruby',
  'rust',
  'scheme',
  'tex',
  'text',
  'typescript',
  'yaml',
];

// These are handed straight to unified, which -- unlike remark-cli -- does not
// resolve plugin names, so they have to be the functions themselves.
const naturalLanguage = unified().use([
  [(await import('retext-english')).default, {}],
  [(await import('retext-syntax-urls')).default, {}],
  [(await import('retext-readability')).default, { age: 30, minWords: 8 }],
  [(await import('retext-repeated-words')).default, {}],
  [
    (await import('retext-simplify')).default,
    {
      // Phrases whose suggested replacements read worse in technical
      // documentation than what they replace: `immediately` is not improved
      // by `at once`, and `aggregate` is a word from the project's own
      // tagline. Ignoring a phrase here is by its text, not by the rule id
      // the reporter prints, so multi-word entries keep their spaces.
      ignore: [
        'accomplish', 'additional', 'address', 'aggregate', 'attempt',
        'contains', 'ensure', 'equivalent', 'establish', 'function',
        'identical', 'identify', 'immediately', 'inception', 'indicate',
        'interface', 'maintain', 'multiple', 'portion', 'request',
        'require', 'subsequent', 'type',
        // Wordiness the house style tolerates.
        'all of', 'appropriate', 'however', 'it is', 'it is essential',
        'one particular', 'overall', 'there are', 'there is',
      ],
    },
  ],
  [(await import('retext-sentence-spacing')).default, { preferred: 1 }],
  [(await import('retext-syntax-mentions')).default, {}],
]);

export default {
  plugins: [
    'remark-lint',
    ['remark-gfm'],
    ['remark-frontmatter'],
    ['remark-preset-lint-consistent', {}],
    // Leave this preset at the top so that it can be overridden.
    ['remark-preset-lint-recommended', {}],
    [
      'remark-lint-checkbox-character-style',
      {
        checked: 'x',
        unchecked: ' ',
      },
    ],
    ['remark-lint-checkbox-content-indent'],

    // Remark Lint Style Guide preset and overrides.
    ['remark-preset-lint-markdown-style-guide'],
    ['remark-lint-no-file-name-consecutive-dashes', true],
    ['remark-lint-fenced-code-flag', { flags: infoStrings }],
    ['remark-lint-no-heading-punctuation', ':.,;'],
    ['remark-lint-no-file-name-mixed-case', false],
    ['remark-lint-no-file-name-irregular-characters', false],
    ['remark-lint-first-heading-level', 2],
    // GitHub renders these as callouts; to remark they look like references
    // to definitions that were never written.
    ['remark-lint-no-undefined-references', { allow: ['!NOTE', '!WARNING'] }],
    // A bold label introducing a code sample is the house style here, not a
    // heading that lost its hashes.
    ['remark-lint-no-emphasis-as-heading', false],

    // Third-party plugins.
    ['remark-validate-links', {}],
    ['remark-lint-maximum-line-length', {}],
    ['remark-lint-no-duplicate-headings-in-section', {}],
    ['remark-retext', naturalLanguage],

    // Disables all rules that conflict with Prettier. Leave this preset at the
    // bottom so that it can't be overridden.
    ['remark-preset-prettier', {}],
  ],
};
