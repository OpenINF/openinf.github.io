import { parse as pathParse } from 'node:path';
import { EleventyI18nPlugin } from '@11ty/eleventy';
import { PATHS } from '@openinf/portal/build/constants';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItFootnote from 'markdown-it-footnote';
import postcss from 'postcss';
import { compileString } from 'sass';

// skipcq: JS-0116
export default async function (eleventyConfig) {
  const isProduction = process.env.ELEVENTY_ENV === 'production';

  eleventyConfig.amendLibrary('md', (md) => {
    md.use(markdownItAnchor);
    md.use(markdownItFootnote);
  });

  // Configure Eleventy.
  // Order matters, leave this at top of configuration file.
  eleventyConfig.setLayoutsDirectory('_layouts'); // relative to input dir
  eleventyConfig.setUseGitIgnore(false);
  // Images and scripts go straight from source into the site. Eleventy tracks
  // what it copies, so `--serve` reloads on a change without a watcher of our
  // own, and nothing is written back into a directory it is watching.
  eleventyConfig.addPassthroughCopy({
    [`${PATHS.assetsDir}${PATHS.imageFolder}`]: `${PATHS.eleventyAssetsDir}${PATHS.imageFolder}`,
    [`${PATHS.assetsDir}${PATHS.scriptFolder}`]: `${PATHS.eleventyAssetsDir}${PATHS.scriptFolder}`,
  });

  // Ignoring these directories outright, as .eleventyignore used to, also
  // takes them out of the watch, so an edited image sat there until the next
  // restart. Only the licence notice among the icons needs keeping out, and
  // only from being rendered as a page -- passthrough still publishes it
  // beside the icons it covers.
  eleventyConfig.ignores.add(`${PATHS.assetsDir}**/*.md`);

  // The stylesheet is compiled by Eleventy as a template of its own, which is
  // what puts it in the dependency graph: editing a partial recompiles
  // `main.scss` and the browser is told to swap the stylesheet. Compiling it
  // outside Eleventy leaves it invisible to that graph, so no reload is sent.
  eleventyConfig.addTemplateFormats('scss');
  eleventyConfig.addExtension('scss', {
    outputFileExtension: 'css',
    useLayouts: false,
    compile(inputContent, inputPath) {
      const parsed = pathParse(inputPath);

      // Sass partials are compiled through whatever imports them, and
      // returning undefined is how Eleventy is told to skip a file.
      if (parsed.name.startsWith('_')) return undefined;

      const result = compileString(inputContent, {
        loadPaths: [parsed.dir || '.', this.config.dir.includes],
      });

      // Without this, editing a partial rebuilds nothing.
      this.addDependencies(inputPath, result.loadedUrls);

      return async () => {
        // Prefixing follows .browserslistrc, so it belongs in both builds;
        // minifying only earns its keep in the one that gets published.
        const plugins = [autoprefixer()];

        if (isProduction) plugins.push(cssnano());

        const processed = await postcss(plugins).process(result.css, {
          from: inputPath,
          to: `${PATHS.stylesFolder}/${parsed.name}.css`,
        });

        return processed.css;
      };
    },
    compileOptions: {
      // Without this the stylesheet would land beside its source, under
      // `_assets/`, rather than where the pages ask for it. Only the build
      // that minifies claims `.min`, so the name never overstates what is in
      // the file; head.liquid picks the matching one by `env`.
      permalink: (_contents, inputPath) => {
        const parsed = pathParse(inputPath);
        const suffix = isProduction ? '.min' : '';

        return () =>
          parsed.name.startsWith('_')
            ? false
            : `/${PATHS.eleventyAssetsDir}${PATHS.stylesFolder}/${parsed.name}${suffix}.css`;
      },
    },
  });

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
