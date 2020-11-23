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
];

var fs = require('fs');
var strip = require('strip-comments');
var unified = require('unified');

var personal = strip(fs.readFileSync('./dictionary.txt', 'utf8'));

var naturalLanguage = unified().use([
  require('retext-english'),
  require('retext-equality'),
  require('retext-passive'),
  require('retext-profanities'),
  [require('retext-readability'), { age: 21, minWords: 8 }],
  [
    require('retext-simplify'),
    { ignore: ['function', 'interface', 'maintain'] },
  ],
  require('retext-syntax-mentions'),
  [
    require('retext-spell'),
    { dictionary: require('dictionary-en-gb'), personal: personal },
  ],
]);

module.exports = {
  plugins: [
    require('remark-lint'),
    // Leave this preset at the top so that it can be overridden.
    require('remark-preset-lint-recommended'),
    [require('remark-lint-blockquote-indentation'), 2],
    [
      require('remark-lint-checkbox-character-style'),
      {
        checked: 'x',
        unchecked: ' ',
      },
    ],
    require('remark-lint-checkbox-content-indent'),
    [require('remark-lint-code-block-style'), 'fenced'],
    [require('remark-lint-fenced-code-flag'), { flags: infoStrings }],
    require('remark-lint-definition-spacing'),
    require('remark-frontmatter'),

    // Remark Lint Style Guide preset and overrides.
    require('remark-preset-lint-markdown-style-guide'),
    ['lint-no-file-name-mixed-case', false],
    ['lint-no-heading-punctuation', ':.,;'],

    // Third-party plugins.
    require('remark-validate-links'),
    require('remark-lint-maximum-line-length'),
    require('remark-lint-are-links-valid'),
    require('remark-lint-no-duplicate-headings-in-section'),
    [require('remark-retext'), naturalLanguage],

    // Disables all rules that conflict with Prettier. Leave this preset at the
    // bottom so that it can't be overridden.
    require('remark-preset-prettier'),

    // Custom plugins.
    require('./_tools/unified-lint-rules/no-smart-quotes.js'),
    require('./_tools/unified-lint-rules/no-dash-spaces.js'),
    require('./_tools/unified-lint-rules/no-repeat-punctuation.js'),
    require('./_tools/unified-lint-rules/no-smart-quotes.js'),
    require('./_tools/unified-lint-rules/no-unescaped-template-tags.js'),
  ],
};
