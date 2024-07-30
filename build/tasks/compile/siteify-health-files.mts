/**
 * @file Process health files for website use (inspired by jekyll/jekyll SLOCs).
 * @author The OpenINF Authors & Friends
 * @see https://github.com/jekyll/jekyll/blob/dbbfc5d48c81cf424f29c7b0eebf10886bc99904/Rakefile#L94
 * @module {ES6Module} build/tasks/compile/siteify-health-files
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import nodePath from 'node:path';
import { GhFileImporter } from '@openinf/gh-file-importer';

const require = createRequire(import.meta.url);
const { dump } = require('js-yaml');

const ghFileImporterOptions = {
  destDir: tmpdir(),
  log: require('console-log-level')({ level: 'info' }),
};

const ghFileImporter = new GhFileImporter(ghFileImporterOptions);

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

const importHealthFiles = async () => {
  for (const healthFile of healthFiles) {
    await ghFileImporter.importContents('OpenINF', '.github', healthFile);
  }
};

/**
 * Verifies that the community health file exists, and returns its contents.
 * @param {string} file
 * @returns {string}
 */
const getHealthFileContents = (file) => {
  const healthFilePath = nodePath.join(ghFileImporterOptions.destDir, file);

  if (!existsSync(healthFilePath)) {
    throw new Error(`You seem to have misplaced your ${file} file. I can haz?`);
  }

  return readFileSync(healthFilePath, 'utf8');
};

/**
 * Add site metdata to document frontmatter and copy to collection dir.
 * @param {string} file
 * @param {string} destDir
 * @param {!(Object | undefined)} frontmatterOverrides
 */
const siteifyFile = (file, destDir, frontmatterOverrides = {}) => {
  let title = '';
  let healthFileContents = getHealthFileContents(file);

  try {
    title = healthFileContents.match(/^## (.*)$/m)[1];
    healthFileContents = healthFileContents.replace(/^## (.*)\n\n/gm, '');
  } catch {
    let tokens = nodePath.basename(file, '.md').toLowerCase().split('_');
    tokens = tokens.map((value) => {
      return `${String(value.charAt(0).toUpperCase()).concat(value.slice(1))}`;
    });
    title = tokens.join(' ');
  }
  const slug = nodePath.basename(file, '.md').toLowerCase().replace(/_/g, '-');
  let frontmatter = {
    title,
    permalink: `/docs/${slug}`,
    note: `This file is autogenerated. Edit ${file} instead.`,
  };
  frontmatter = { ...frontmatter, ...frontmatterOverrides };
  healthFileContents = `---\n${dump(frontmatter)}---\n\n${healthFileContents}`;
  writeFileSync(`${destDir}/${slug}.md`, healthFileContents);
};

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

await importHealthFiles();

for (const value of healthFiles) {
  switch (value) {
    case 'CODE_OF_CONDUCT.md':
      siteifyFile(value, 'collections/_docs', {
        title: 'OpenINF Code of Conduct',
        editable: false,
      });
      break;
    case 'CONTRIBUTING.md':
      siteifyFile(value, 'collections/_docs', {
        title: 'Contributing to OpenINF',
        permalink: '/docs/dev/internals/contributing',
      });
      break;
    case 'SECURITY.md': {
      siteifyFile(value, 'collections/_docs', {
        title: 'OpenINF Security Policies',
        permalink: '/docs/dev/internals/security',
      });
      break;
    }
    case 'SUPPORT.md':
      siteifyFile(value, 'collections/_docs', {
        title: 'Support • Frequently Asked Questions',
        permalink: '/docs/dev/faq/support',
        redirect_from: '/docs/dev/faq/help',
      });
      break;
    case 'VISION.md':
      siteifyFile(value, 'collections/_pages', {
        title: 'OpenINF Vision',
        permalink: '/about/vision',
      });
      break;
    default:
      siteifyFile(value);
  }
}
