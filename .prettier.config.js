'use strict';

module.exports = {
  arrowParens: "always",
  bracketSpacing: true,
  endOfLine: "lf",
  printWidth: 80,
  quoteProps: "consistent",
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "es5",
  useTabs: false,
  overrides: [
    {
      files: [".eslintrc", ".prettierrc", ".renovaterc.json", "*.json"],
      options: { parser: "json" },
    },
    {
      files: ["*.html"],
      options: {
        bracketSameLine: true,
        parser: "html",
        singleAttributePerLine: false,
        singleQuote: false,
      },
    },
    {
      files: ["*.md"],
      options: {
        parser: "markdown",
        proseWrap: "always",
      },
    },
  ],
};
