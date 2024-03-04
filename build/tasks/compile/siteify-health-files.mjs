/**
 * @file Process health files for website use (inspired by jekyll/jekyll SLOCs).
 * @author The OpenINF Authors & Friends
 * @see https://github.com/jekyll/jekyll/blob/dbbfc5d48c81cf424f29c7b0eebf10886bc99904/Rakefile#L94
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { basename as pathBasename } from 'path';
import YAML from 'js-yaml';

const healthFiles = [
  'CODE_OF_CONDUCT.md',
  'CONTRIBUTING.md',
  'SECURITY.md',
  'SUPPORT.md',
  'VISION.md',
];

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Throws an error with the given message.
 * @param {string} message
 * @returns {string}
 */
function throwError(message) {
  const err = new Error(message);
  err.showStack = false;
  throw err;
}

/**
 * Verifies that the community health file exists, and returns its contents.
 * @param {string} file
 * @returns {string}
 */
function getHealthFileContents(file) {
  if (!existsSync(file)) {
    throwError(`You seem to have misplaced your ${file} file. I can haz?`);
  }
  return readFileSync(file, 'utf8');
}

/**
 * Add site metdata to document frontmatter and copy to collection dir.
 * @param {string} file
 * @param {!(Object | undefined)} frontmatterOverrides
 */
function siteifyFile(file, frontmatterOverrides = {}) {
  let title = '';
  let healthFileContents = getHealthFileContents(file);
  healthFileContents = healthFileContents.replace(/<!--(.*?)-->\n\n/gm, '');

  try {
    title = healthFileContents.match(/^# (.*)$/m)[1];
    healthFileContents = healthFileContents.replace(/^# (.*)\n\n/gm, '');
  } catch {
    let tokens = pathBasename(file, '.md').toLowerCase().split('_');
    tokens = tokens.map((val) => {
      return `${val.charAt(0).toUpperCase()} ${val.slice(1)}`;
    });
    title = tokens.join(' ');
  }
  const slug = pathBasename(file, '.md').toLowerCase().replace(/_/g, '-');
  let frontmatter = {
    title,
    permalink: `/docs/${slug}/`,
    note: `This file is autogenerated. Edit ${file} instead.`,
  };
  frontmatter = { ...frontmatter, ...frontmatterOverrides };
  healthFileContents =
    `---\n${YAML.dump(frontmatter)}---\n\n${healthFileContents}`;
  writeFileSync(`collections/_docs/${slug}.md`, healthFileContents);
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

healthFiles.forEach((val) => {
  switch (val) {
    case 'CODE_OF_CONDUCT.md':
      siteifyFile(val, {
        title: 'OpenINF Code of Conduct',
        editable: false,
      });
      break;
    case 'CONTRIBUTING.md':
      siteifyFile(val, {
        title: 'Contributing to OpenINF',
        permalink: '/docs/dev/internals/contributing/',
      });
      break;
    case 'SECURITY.md': {
      siteifyFile(val, {
        title: 'OpenINF Security Policies',
        permalink: '/docs/dev/internals/security/',
      });
      break;
    }
    case 'SUPPORT.md':
      siteifyFile(val, {
        title: 'Support • Frequently Asked Questions',
        permalink: '/docs/dev/faq/support/',
        redirect_from: '/docs/dev/faq/help/',
      });
      break;
    case 'VISION.md':
      siteifyFile(val, {
        title: 'OpenINF Vision',
        permalink: '/about/vision/',
      });
      break;
    default:
      siteifyFile(val);
  }
});
