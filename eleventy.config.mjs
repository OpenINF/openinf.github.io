import { EleventyI18nPlugin } from '@11ty/eleventy';
import { PATHS } from '@openinf/portal/build/constants';
import { imagize } from '@openinf/portal/build/tasks/imagize';
import { jsify } from '@openinf/portal/build/tasks/jsify';
import { scssify } from '@openinf/portal/build/tasks/scssify';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItFootnote from 'markdown-it-footnote';

// skipcq: JS-0116
export default async function (eleventyConfig) {
  eleventyConfig.amendLibrary('md', (md) => {
    md.use(markdownItAnchor);
    md.use(markdownItFootnote);
  });

  // Configure Eleventy.
  // Order matters, leave this at top of configuration file.
  eleventyConfig.setLayoutsDirectory('_layouts'); // relative to input dir
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addPassthroughCopy('assets');

  // The stylesheets, images and scripts under `_assets/` are compiled into
  // `assets/`, which the passthrough copy above then carries into the site.
  // Doing that from here rather than from tasks run ahead of Eleventy is what
  // lets `--serve` rebuild them on change, with no second watcher to keep in
  // step.
  eleventyConfig.on('eleventy.before', async () => {
    await Promise.all([scssify(), imagize(), jsify()]);
  });

  eleventyConfig.addWatchTarget(PATHS.assetsDir);

  // 3000 is where the previous server sat, so it is what the devcontainer
  // forwards and what the docs tell people to open.
  eleventyConfig.setServerOptions({ port: 3000 });
  eleventyConfig.addGlobalData('siteTitle', 'OpenINF');
  eleventyConfig.addGlobalData(
    'siteDescription',
    'Aggregate, curate, disseminate, and apply information derived from diverse sources.'
  );
  eleventyConfig.addGlobalData('siteUrl', 'https://open.inf.is');
  eleventyConfig.addGlobalData(
    'env',
    process.env.ELEVENTY_ENV || 'development'
  );

  // Drafts, see also _data/eleventyDataSchema.js.
  eleventyConfig.addPreprocessor('drafts', '*', (data /*, content*/) => {
    if (data.draft && process.env.ELEVENTY_ENV === 'production') {
      return false;
    }

    return null;
  });

  eleventyConfig.addCollection('posts', (collectionApi) => {
    return collectionApi
      .getFilteredByGlob([
        'collections/_posts/*.md',
        'collections/_drafts/*.md',
      ])
      .sort(
        (a, b) => b.date - a.date // sort by date - descending
      );
  });

  eleventyConfig.addPlugin(EleventyI18nPlugin, {
    // Any valid BCP 47-compatible language tag is supported.
    defaultLanguage: 'en', // required

    // When to throw errors for missing localized content files.
    errorMode: 'strict', // throw an error if content is missing at /en/slug
  });
}
