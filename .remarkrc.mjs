/**-*- coding: utf-8 -*- esm -*- /.remarkrc.mjs ********************************

  This file is amongst the sources of OpenINF, Infuse.js, and webServagility.

********************************************************************************

  The main Remark Lint configuration file for lint rule & preset initialization

*******************************************************************************/

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { readFileSync as fsReadFileSync } from 'node:fs';
import strip from 'strip-comments';
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

const projectTerms = strip(fsReadFileSync('./project-terms.txt', 'utf8'));

const naturalLanguage = unified().use([
  [await import('retext-english'), {}],
  [await import('retext-syntax-urls'), {}],
  [await import('retext-passive'), {}],
  [await import('retext-readability'), { age: 21, minWords: 8 }],
  [await import('retext-repeated-words'), {}],
  [
    await import('retext-simplify'),
    { ignore: ['function', 'interface', 'maintain'] },
  ],
  [await import('retext-sentence-spacing'), { preferred: 1 }],
  [await import('retext-syntax-mentions'), {}],
  [
    await import('retext-spell'),
    { dictionary: await import('dictionary-en'), personal: projectTerms },
  ],
  [await import('retext-syntax-urls')],
]);

export default {
  plugins: [
    await import('remark-lint'),
    ['remark-gfm'],
    ['remark-footnotes'],
    ['remark-frontmatter'],
    [await import('remark-preset-lint-consistent'), {}],
    // Leave this preset at the top so that it can be overridden.
    [await import('remark-preset-lint-recommended'), {}],
    [
      await import('remark-lint-checkbox-character-style'),
      {
        checked: 'x',
        unchecked: ' ',
      },
    ],
    [await import('remark-lint-checkbox-content-indent')],

    // Remark Lint Style Guide preset and overrides.
    [await import('remark-preset-lint-markdown-style-guide')],
    ['remark-lint-no-file-name-consecutive-dashes', true],
    ['remark-lint-fenced-code-flag', { flags: infoStrings }],
    ['remark-lint-no-heading-punctuation', ':.,;'],
    ['remark-lint-no-file-name-mixed-case', false],
    ['remark-lint-no-file-name-irregular-characters', false],
    ['remark-lint-first-heading-level', 2],

    // Third-party plugins.
    [await import('remark-validate-links'), {}],
    [await import('remark-lint-maximum-line-length'), {}],
    [await import('remark-lint-no-duplicate-headings-in-section'), {}],
    [await import('remark-retext'), naturalLanguage],

    // Disables all rules that conflict with Prettier. Leave this preset at the
    // bottom so that it can't be overridden.
    [await import('remark-preset-prettier'), {}],
  ],
};
