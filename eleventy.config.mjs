import { execFileSync } from 'node:child_process';
import { parse as pathParse } from 'node:path';
import { EleventyI18nPlugin } from '@11ty/eleventy';
import { PATHS } from '@openinf/portal/build/constants';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import { minify as minifyHtml } from 'html-minifier-terser';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItFootnote from 'markdown-it-footnote';
import markdownItGitHubAlerts from 'markdown-it-github-alerts';
import postcss from 'postcss';
import { compileString } from 'sass';

// skipcq: JS-0116
export default async function (eleventyConfig) {
  const isProduction = process.env.ELEVENTY_ENV === 'production';

  eleventyConfig.amendLibrary('md', (md) => {
    md.use(markdownItAnchor);
    md.use(markdownItFootnote);
    // `> [!NOTE]` and the rest become a titled callout rather than a
    // blockquote opening on the literal marker. The icons it ships with come
    // through as well; _docs-page.scss draws them in the title's own color.
    md.use(markdownItGitHubAlerts);
  });

  // When a page last changed, read from git rather than the file's mtime,
  // which a checkout sets to the moment it ran. A shallow clone holds one
  // commit and would date every page to the build, so it reports nothing
  // instead and the layouts leave the line off.
  const gitIsShallow = (() => {
    try {
      return (
        execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore'],
        }).trim() === 'true'
      );
    } catch {
      return true;
    }
  })();

  const lastChanged = new Map();
  eleventyConfig.addFilter('gitLastUpdated', (inputPath) => {
    if (gitIsShallow || !inputPath) return null;
    const file = String(inputPath).replace(/^\.\//, '');
    if (!lastChanged.has(file)) {
      let iso = '';
      try {
        iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore'],
        }).trim();
      } catch {
        iso = '';
      }
      lastChanged.set(file, iso ? new Date(iso) : null);
    }

    return lastChanged.get(file);
  });

  // The trail to a page, built from somewhere a reader can actually go
  // rather than from the slashes in its URL. `/docs/handbook/style/colons/`
  // has no page at `/docs/handbook/` or `/docs/handbook/style/`, so a trail
  // split off the URL would link twice into nothing, and a post's date
  // directories would do it three times. A step appears here only if a page
  // sits at that URL, or `_data/sections.json` names somewhere else it can
  // point. The trail always terminates at the front page, and stops short of
  // the page it is on, whose title is the heading directly below it.
  eleventyConfig.addFilter('breadcrumb', (url, all, sections) => {
    if (typeof url !== 'string' || url === '/') return [];

    const titles = new Map(
      (all ?? [])
        .filter((item) => item?.url && item.data?.title)
        .map((item) => [item.url, item.data.title])
    );
    // Keyed lookup by name, so a segment called `__proto__` finds nothing
    // rather than the object prototype.
    const named = new Map(Object.entries(sections ?? {}));
    // The front page is titled for its own heading, not for this list.
    const trail = [{ title: 'Home', url: '/' }];
    const parts = url.split('/').filter(Boolean);

    for (const [index, part] of parts.slice(0, -1).entries()) {
      const ancestor = `/${parts.slice(0, index + 1).join('/')}/`;
      const section = named.get(part);

      if (titles.has(ancestor)) {
        trail.push({ title: titles.get(ancestor), url: ancestor });
      } else if (section?.name && section?.url) {
        trail.push({ title: section.name, url: section.url });
      }
    }

    return trail;
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
  // restart. Only the license notice among the icons needs keeping out, and
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

  // Only the build that publishes. A reader downloads this output; a
  // developer reads `_site` in a diff.
  if (isProduction) {
    eleventyConfig.addTransform('minifyHtml', function (content) {
      // Sass partials output nothing, and their `outputPath` is `false`
      // rather than absent, which optional chaining does not catch.
      const output = this.page.outputPath;

      if (typeof output !== 'string' || !output.endsWith('.html')) {
        return content;
      }

      return minifyHtml(content, {
        // `<pre>` and `<textarea>` are left alone by the minifier itself.
        collapseWhitespace: true,
        // SVG attributes are camelCase -- `viewBox`, `preserveAspectRatio` --
        // and lowercasing them stops the browser seeing them.
        caseSensitive: true,
        collapseBooleanAttributes: true,
        // biome-ignore lint/style/useNamingConvention: the minifier's name
        minifyCSS: true,
        // biome-ignore lint/style/useNamingConvention: the minifier's name
        minifyJS: true,
        removeComments: true,
        removeRedundantAttributes: true,
        sortAttributes: true,
        sortClassName: true,
        useShortDoctype: true,
      });
    });
  }

  // 3000 is where the previous server sat, so it is what the devcontainer
  // forwards and what the docs tell people to open.
  eleventyConfig.setServerOptions({ port: 3000 });
  eleventyConfig.addGlobalData('siteTitle', 'OpenINF');
  eleventyConfig.addGlobalData(
    'siteDescription',
    'Aggregate, curate, disseminate, and apply information derived from diverse sources.'
  );
  eleventyConfig.addGlobalData('siteUrl', 'https://open.inf.is');
  // The branch an "Improve this page" link opens against. Fixed rather than
  // read from the checkout, which during a pull request build is the branch
  // under review; GitHub's editor also wants a branch it can commit to, and
  // takes no symbolic ref.
  eleventyConfig.addGlobalData('repoBranch', 'live');
  // What Jekyll called `site.time`: the moment the site was generated. The
  // footer still asks for it through a `date` filter, so this is the instant
  // rather than a formatted year, and anything else wanting a build date can
  // format it its own way.
  eleventyConfig.addGlobalData('buildTime', () => new Date());
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

  // The two groups the index at /docs/ shows. The handbook is alphabetical,
  // being reference; the community docs follow their `order`, and a doc
  // without one stays off the index.
  eleventyConfig.addCollection('handbook', (collectionApi) => {
    return collectionApi
      .getFilteredByGlob('collections/_docs/handbook/**/*.md')
      .sort((a, b) => a.data.title.localeCompare(b.data.title));
  });

  eleventyConfig.addCollection('communityDocs', (collectionApi) => {
    return collectionApi
      .getFilteredByGlob('collections/_docs/*.md')
      .filter((doc) => typeof doc.data.order === 'number')
      .sort((a, b) => a.data.order - b.data.order);
  });

  eleventyConfig.addPlugin(EleventyI18nPlugin, {
    // Any valid BCP 47-compatible language tag is supported.
    defaultLanguage: 'en', // required

    // When to throw errors for missing localized content files.
    errorMode: 'strict', // throw an error if content is missing at /en/slug
  });
}
