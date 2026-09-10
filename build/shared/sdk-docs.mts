/**
 * @file Turns TypeDoc Markdown paths into stable OpenINF portal URLs.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/sdk-docs
 */

import { realpath } from 'node:fs/promises';
import { isAbsolute, relative, resolve } from 'node:path';
import {
  dirname as pathDirname,
  extname as pathExtname,
  normalize as pathNormalize,
  relative as pathRelative,
} from 'node:path/posix';
import sanitizeHtml from 'sanitize-html';

const normalizePath = (input: string) =>
  pathNormalize(input).replace(/^\.\//, '');

/**
 * Maps one TypeDoc Markdown filename to its portal-relative source filename.
 * `README.md` is a directory index in TypeDoc's tree; the portal gives it an
 * actual `index.md` source, so Eleventy can make the corresponding clean URL.
 * @param {string} sourcePath A slash-separated path beneath the Markdown root.
 * @returns The matching generated source path beneath `collections/_sdk-api`.
 */
export function portalPath(sourcePath: string) {
  const normalized = normalizePath(sourcePath);

  if (normalized === 'README.md') return 'index.md';
  if (normalized === 'packages.md') return 'packages/index.md';

  const packageMatch = normalized.match(/^@openinf\/([^/]+)\/(.*)$/);
  if (packageMatch === null) {
    throw new Error(`Unexpected TypeDoc path: ${sourcePath}`);
  }

  const [, packageName, remainder] = packageMatch;
  if (remainder === 'README.md') return `packages/${packageName}/index.md`;

  return `packages/${packageName}/${remainder}`;
}

/**
 * The package a generated page belongs to, named as the navigation names it,
 * or an empty string for the two pages that belong to no package. The layout
 * reads this to find that package in the navigation tree, so that a symbol
 * page can list the symbols beside it rather than only the package roots.
 * @param {string} sourcePath A slash-separated path beneath the Markdown root.
 * @returns The package's navigation title, or an empty string.
 */
export function packageOf(sourcePath: string) {
  return normalizePath(sourcePath).match(/^(@openinf\/[^/]+)\//)?.[1] ?? '';
}

/**
 * Returns the public URL for one TypeDoc Markdown source path.
 * @param {string} version The SDK release version that generated the page.
 * @param {string} sourcePath A slash-separated path beneath the Markdown root.
 * @returns The portal URL at which Eleventy publishes the page.
 */
export function portalUrl(version: string, sourcePath: string) {
  const file = portalPath(sourcePath).replace(/\.md$/, '');
  const path = file.endsWith('/index') ? file.slice(0, -'/index'.length) : file;
  const suffix = path === 'index' ? '' : `${path}/`;

  return `/docs/sdk/${version}/api/${suffix}`;
}

/**
 * Reads TypeDoc's first heading after removing the product link and generated
 * breadcrumb it puts above every page. The portal supplies those itself.
 * @param {string} markdown A generated TypeDoc Markdown page.
 * @returns The page title and the Markdown that belongs in the portal body.
 */
export function stripTypeDocChrome(markdown: string) {
  let content = markdown.replace(/\r\n/g, '\n');

  // The root has bold text; child pages link that same text home. Both are
  // followed by a thematic break.
  content = content.replace(
    /^(?:\[\*{1,2}OpenINF\*{1,2}\]\([^\n)]*\)|\*{1,2}OpenINF\*{1,2})\n\n\*\*\*\n\n/,
    ''
  );
  // A child page's generated breadcrumb would duplicate the portal's trail.
  content = content.replace(/^\[OpenINF\]\([^\n)]*\)(?:\s*\/[^\n]*)?\n\n/, '');

  const heading = content.match(/^# ([^\n]+)\n+/);
  const htmlHeading = content.match(/^<h1(?:\s[^>]*)?>([^<]+)<\/h1>\n+/);

  if (heading !== null) {
    return {
      title: heading[1],
      content: content.slice(heading[0].length),
    };
  }

  if (htmlHeading !== null) {
    return {
      title: htmlHeading[1],
      content: content.slice(htmlHeading[0].length),
    };
  }

  throw new Error('Generated TypeDoc page has no h1');
}

/**
 * Rewrites relative TypeDoc Markdown links to their portal URLs. TypeDoc's
 * links name `.md` files, whereas the portal publishes clean directory URLs.
 * @param {string} markdown Generated TypeDoc Markdown.
 * @param {string} sourcePath The current page's source path beneath the Markdown root.
 * @param {Map<string, string>} urls Public URLs keyed by TypeDoc source path.
 * @returns Markdown whose internal document links point at the portal.
 */
export function rewriteTypeDocLinks(
  markdown: string,
  sourcePath: string,
  urls: Map<string, string>
) {
  // A destination cannot consume another link opener. Otherwise an
  // unterminated run of `](` makes the matcher retry the entire suffix at
  // every opener, producing quadratic work on malformed artifact text.
  const rewrite = (prose: string) =>
    prose.replace(
      /(\]\()(?<target><?[^()[\]\s<>]+>?)(\))/g,
      (whole, before: string, target: string, after: string) => {
        const wrapped = target.startsWith('<') && target.endsWith('>');
        const destination = wrapped ? target.slice(1, -1) : target;
        const hash = destination.indexOf('#');
        const file = hash === -1 ? destination : destination.slice(0, hash);
        const fragment = hash === -1 ? '' : destination.slice(hash);

        if (
          !file.endsWith('.md') ||
          /^[a-z][a-z\d+.-]*:/i.test(file) ||
          file.startsWith('/')
        )
          return whole;

        const resolved = normalizePath(
          pathNormalize(`${pathDirname(sourcePath)}/${file}`)
        );
        const url = urls.get(resolved);
        if (url === undefined) {
          throw new Error(
            `${sourcePath} links to generated Markdown that is not imported: ${file}`
          );
        }

        return `${before}${url}${fragment}${after}`;
      }
    );

  // Generated signatures and examples are fenced; inline examples use one
  // backtick. A link-shaped string in either is code, not navigation.
  return markdown
    .split(/(```[\s\S]*?```|`[^`\n]*`)/)
    .map((part, index) => (index % 2 === 0 ? rewrite(part) : part))
    .join('');
}

/**
 * Sanitizes the rendered SDK body before the portal layout embeds it.
 * Running after Markdown rendering also covers Markdown-generated URLs;
 * code examples have already been escaped and remain readable text.
 * @param {string} html Rendered API documentation, without the portal shell.
 * @returns HTML restricted to documentation elements and safe attributes.
 */
export function sanitizeSdkHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      'a',
      'abbr',
      'b',
      'blockquote',
      'br',
      'code',
      'dd',
      'del',
      'details',
      'div',
      'dl',
      'dt',
      'em',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'hr',
      'i',
      'img',
      'li',
      'ol',
      'p',
      'pre',
      's',
      'span',
      'strong',
      'sub',
      'summary',
      'sup',
      'table',
      'tbody',
      'td',
      'th',
      'thead',
      'tr',
      'ul',
    ],
    allowedAttributes: {
      '*': ['id', 'class', 'title', 'aria-label', 'aria-describedby'],
      a: ['href', 'name', 'rel'],
      img: ['src', 'alt', 'width', 'height'],
      ol: ['start'],
      th: ['colspan', 'rowspan', 'scope', 'align'],
      td: ['colspan', 'rowspan', 'align'],
      details: ['open'],
    },
    allowedSchemes: ['https', 'http', 'mailto'],
    allowedSchemesByTag: { img: ['https', 'http'] },
    allowProtocolRelative: false,
  });
}

/**
 * Resolves an artifact member and checks physical as well as lexical bounds.
 * @param {string} root Directory containing the trusted artifact boundary.
 * @param {string} value Relative member path, possibly containing symlinks.
 * @returns The contained real path to use for subsequent reads.
 */
export async function artifactFile(root: string, value: string) {
  if (isAbsolute(value)) throw new Error(`${value} must be relative`);
  const directory = await realpath(root);
  const candidate = resolve(directory, value);
  const check = (file: string) => {
    const fromRoot = relative(directory, file);
    if (
      fromRoot === '..' ||
      fromRoot.startsWith('../') ||
      fromRoot.startsWith('..\\') ||
      isAbsolute(fromRoot)
    ) {
      throw new Error(`${value} escapes ${directory}`);
    }
  };
  check(candidate);
  const file = await realpath(candidate);
  check(file);
  return file;
}

/**
 * Keeps generated subsection headings valid below the portal-provided h1.
 * A few hand-authored comments begin at h3 before TypeDoc emits an h2.
 * @param {string} markdown Generated Markdown body.
 * @returns Markdown with leading h3 sections promoted to h2.
 */
export function normalizeHeadingHierarchy(markdown: string) {
  let hasH2 = false;

  const promote = (prose: string) =>
    prose.replace(/^#{2,3} .+$/gm, (heading) => {
      if (heading.startsWith('## ')) {
        hasH2 = true;
        return heading;
      }

      return hasH2 ? heading : `## ${heading.slice(4)}`;
    });

  // A run of hashes inside a fence is part of an example -- a shell comment,
  // a Markdown sample -- and promoting it would rewrite what the example
  // says. Split the same way the link rewriter does, and read only the prose.
  return markdown
    .split(/(```[\s\S]*?```|`[^`\n]*`)/)
    .map((part, index) => (index % 2 === 0 ? promote(part) : part))
    .join('');
}

/**
 * Rejects an artifact path which would leave its declared documentation root.
 * @param {string} root The artifact's documentation root.
 * @param {string} candidate A path that claims to sit under it.
 * @returns A normalized path beneath `root`.
 */
export function pathInside(root: string, candidate: string) {
  const relative = pathRelative(root, candidate);
  if (relative === '' || (!relative.startsWith('../') && relative !== '..')) {
    return normalizePath(candidate);
  }

  throw new Error(`${candidate} is outside ${root}`);
}

/**
 * Compares two runs of digits as numbers, without making them into any. What
 * the artifact schema accepts is `\\d+`, which is not bounded, and past 2^53
 * two distinct versions round to one Number and compare as equal. Leading
 * zeros go first, since they lengthen a string without changing its value.
 * @param {string} a One run of digits.
 * @param {string} b Another run of digits.
 * @returns A negative number when `a` is the smaller.
 */
function compareDigits(a: string, b: string) {
  const left = a.replace(/^0+(?=\d)/, '');
  const right = b.replace(/^0+(?=\d)/, '');

  if (left.length !== right.length) return left.length - right.length;

  return left < right ? -1 : left > right ? 1 : 0;
}

/**
 * Splits a release version into the parts that decide its precedence.
 * Build metadata takes no part in it, so it is dropped before anything else
 * is read: left in, `3.1.1+build.1` would have `1+build` for its patch, and
 * comparing that to a number answers neither larger nor smaller.
 * @param {string} version A release version the artifact schema accepts.
 * @returns Its numeric release parts and its prerelease identifiers.
 */
function releaseParts(version: string) {
  const precedence = version.split('+', 1)[0] ?? version;
  const at = precedence.indexOf('-');

  return {
    release: (at === -1 ? precedence : precedence.slice(0, at)).split('.'),
    prerelease: at === -1 ? [] : precedence.slice(at + 1).split('.'),
  };
}

/**
 * Orders release versions newest first, by precedence rather than by name.
 * The portal lists releases in the order it imports them, and importing them
 * in the order their directory names sort would put 10.0.0 before 3.0.0.
 * @param {string} a One release version.
 * @param {string} b Another release version.
 * @returns A negative number when `a` is the newer release.
 */
export function compareVersions(a: string, b: string) {
  const left = releaseParts(a);
  const right = releaseParts(b);

  for (const [index, part] of left.release.entries()) {
    const difference = compareDigits(right.release[index] ?? '0', part);
    if (difference !== 0) return difference;
  }

  // A release outranks every prerelease of the same version.
  if (left.prerelease.length === 0) {
    return right.prerelease.length === 0 ? 0 : -1;
  }
  if (right.prerelease.length === 0) return 1;

  const numeric = /^\d+$/;
  const length = Math.max(left.prerelease.length, right.prerelease.length);

  for (let index = 0; index < length; index += 1) {
    const ours = left.prerelease[index];
    const theirs = right.prerelease[index];

    // A prerelease that runs out of identifiers first is the older one.
    if (ours === undefined) return 1;
    if (theirs === undefined) return -1;
    if (ours === theirs) continue;

    if (numeric.test(ours) && numeric.test(theirs)) {
      return compareDigits(theirs, ours);
    }

    // Numeric identifiers rank below alphanumeric ones.
    if (numeric.test(ours)) return 1;
    if (numeric.test(theirs)) return -1;

    return ours < theirs ? 1 : -1;
  }

  return 0;
}

/**
 * The title the portal gives one generated page. TypeDoc heads its package
 * index with the project name, which on the portal reads as the name of the
 * site rather than as what the page is; every other page names itself.
 * @param {string} sourcePath A slash-separated path beneath the Markdown root.
 * @param {string} heading The page's own first heading.
 * @returns The title to publish the page under.
 */
export function portalTitle(sourcePath: string, heading: string) {
  return normalizePath(sourcePath) === 'packages.md' ? 'Packages' : heading;
}

/** Whether a file is one TypeDoc Markdown page the portal should import. */
export function isApiMarkdown(sourcePath: string) {
  return pathExtname(sourcePath) === '.md' && !sourcePath.startsWith('_media/');
}
