import { createRequire } from 'node:module';
import { unified } from 'unified';

const require = createRequire(import.meta.url);

const infoStrings = [
  'ada',
  'bash',
  'bibtex',
  'c',
  'coffee',
  'console',
  'cpp',
  'csharp',
  'diff',
  'dts',
  'elixir',
  'fortran',
  'fountain',
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
  'tex',
  'text',
  'typescript',
  'yaml',
];

var fs = require('node:fs');
var strip = require('strip-comments');

var projectTerms = strip(fs.readFileSync('./project-terms.txt', 'utf8'));

var naturalLanguage = unified().use([
  await import('retext-english'),
  await import('retext-syntax-urls'),
  await import('retext-equality'),
  await import('retext-passive'),
  await import('retext-profanities'),
  [await import('retext-readability'), { age: 21, minWords: 8 }],
  await import('retext-repeated-words'),
  [
    await import('retext-simplify'),
    { ignore: ['function', 'interface', 'maintain'] },
  ],
  [await import('retext-sentence-spacing'), { preferred: 1 }],
  await import('retext-syntax-mentions'),
  [
    await import('retext-spell'),
    { dictionary: await import('dictionary-en'), personal: projectTerms },
  ],
  await import('retext-syntax-urls'),
  await import('retext-usage'),
]);

export default {
  plugins: [
    await import('remark-lint'),
    await import('remark-preset-lint-consistent'),
    // Leave this preset at the top so that it can be overridden.
    await import('remark-preset-lint-recommended'),
    [await import('remark-lint-blockquote-indentation'), 2],
    [
      await import('remark-lint-checkbox-character-style'),
      {
        checked: 'x',
        unchecked: ' ',
      },
    ],
    await import('remark-lint-checkbox-content-indent'),
    [await import('remark-lint-code-block-style'), 'fenced'],
    [await import('remark-lint-fenced-code-flag'), { flags: infoStrings }],
    await import('remark-lint-definition-spacing'),
    await import('remark-frontmatter'),

    // Remark Lint Style Guide preset and overrides.
    await import('remark-preset-lint-markdown-style-guide'),
    ['lint-no-file-name-mixed-case', false],
    ['lint-no-heading-punctuation', ':.,;'],

    // Third-party plugins.
    await import('remark-validate-links'),
    await import('remark-lint-maximum-line-length'),
    // await import("remark-lint-are-links-valid"),
    // await import("@sfdocs-internal/remark-lint-no-dead-url"),
    await import('remark-lint-no-duplicate-headings-in-section'),
    [await import('remark-retext'), naturalLanguage],

    // Disables all rules that conflict with Prettier. Leave this preset at the
    // bottom so that it can't be overridden.
    await import('remark-preset-prettier'),
  ],
};
