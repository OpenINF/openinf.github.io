/**
 * @file Tests for TypeDoc Markdown portal helpers.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/shared/sdk-docs.test
 */

import {
  deepStrictEqual,
  doesNotMatch,
  match,
  throws,
} from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { describe, test } from 'node:test';
import {
  compareVersions,
  isApiMarkdown,
  normalizeHeadingHierarchy,
  packageOf,
  pathInside,
  portalPath,
  portalTitle,
  portalUrl,
  rewriteTypeDocLinks,
  sanitizeSdkHtml,
  stripTypeDocChrome,
} from '@openinf/portal/build/sdk-docs';

describe('portalPath', () => {
  test('turns TypeDoc indexes into portal indexes', () => {
    deepStrictEqual(portalPath('README.md'), 'index.md');
    deepStrictEqual(portalPath('packages.md'), 'packages/index.md');
    deepStrictEqual(
      portalPath('@openinf/util/README.md'),
      'packages/util/index.md'
    );
  });

  test('keeps a symbol below its package', () => {
    deepStrictEqual(
      portalPath('@openinf/util/functions/isString.md'),
      'packages/util/functions/isString.md'
    );
  });
});

describe('portalUrl', () => {
  test('gives indexes clean trailing-slash URLs', () => {
    deepStrictEqual(portalUrl('3.0.0', 'README.md'), '/docs/sdk/3.0.0/api/');
    deepStrictEqual(
      portalUrl('3.0.0', '@openinf/util/README.md'),
      '/docs/sdk/3.0.0/api/packages/util/'
    );
  });

  test('gives a symbol its own URL', () => {
    deepStrictEqual(
      portalUrl('3.0.0', '@openinf/util/functions/isString.md'),
      '/docs/sdk/3.0.0/api/packages/util/functions/isString/'
    );
  });
});

describe('stripTypeDocChrome', () => {
  test('keeps only a child page’s consumer content', () => {
    deepStrictEqual(
      stripTypeDocChrome(
        '[**OpenINF**](../../README.md)\n\n***\n\n[OpenINF](../../packages.md) / @openinf/util\n\n# @openinf/util\n\nUseful things.\n'
      ),
      { title: '@openinf/util', content: 'Useful things.\n' }
    );
  });

  test('also handles the root page', () => {
    deepStrictEqual(
      stripTypeDocChrome('**OpenINF**\n\n***\n\n# OpenINF\n\nWelcome.\n'),
      { title: 'OpenINF', content: 'Welcome.\n' }
    );
  });

  test('handles a package readme with an HTML h1', () => {
    deepStrictEqual(
      stripTypeDocChrome(
        '[**OpenINF**](../../README.md)\n\n***\n\n[OpenINF](../../packages.md) / @openinf/util-errors\n\n<h1 align="center">@openinf/util-errors</h1>\n\nIntro.\n'
      ),
      { title: '@openinf/util-errors', content: 'Intro.\n' }
    );
  });
});

describe('rewriteTypeDocLinks', () => {
  test('maps a relative Markdown link and keeps its fragment', () => {
    const urls = new Map([
      ['@openinf/util/README.md', '/docs/sdk/3.0.0/api/packages/util/'],
      [
        '@openinf/util/functions/isString.md',
        '/docs/sdk/3.0.0/api/packages/util/functions/isString/',
      ],
    ]);

    deepStrictEqual(
      rewriteTypeDocLinks(
        'See [isString](functions/isString.md#examples).',
        '@openinf/util/README.md',
        urls
      ),
      'See [isString](/docs/sdk/3.0.0/api/packages/util/functions/isString/#examples).'
    );
  });

  test('leaves external links and code alone', () => {
    const urls = new Map<string, string>();
    deepStrictEqual(
      rewriteTypeDocLinks(
        'See [TypeDoc](https://typedoc.org) and `](README.md)`.',
        'README.md',
        urls
      ),
      'See [TypeDoc](https://typedoc.org) and `](README.md)`.'
    );
  });

  test('refuses a link to an omitted generated page', () => {
    throws(
      () => rewriteTypeDocLinks('[no](missing.md)', 'README.md', new Map()),
      /not imported/
    );
  });

  test('leaves absolute Markdown URLs untouched', () => {
    const input = '[source](https://example.com/README.md#intro)';
    deepStrictEqual(rewriteTypeDocLinks(input, 'README.md', new Map()), input);
  });

  test('finishes the CodeQL repeated-link input within a bounded process', () => {
    // A child process timeout can interrupt a synchronous regexp. A test
    // timeout in the same process cannot. The old expression takes minutes.
    execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `
      import { rewriteTypeDocLinks } from ${JSON.stringify(new URL('./sdk-docs.mts', import.meta.url).href)};
      const input = '](' + '](!'.repeat(300_000);
      if (rewriteTypeDocLinks(input, 'README.md', new Map()) !== input) {
        throw new Error('Malformed link text changed');
      }
    `,
      ],
      { timeout: 10_000 }
    );
  });
});

describe('artifact safety', () => {
  test('keeps an artifact path inside its root', () => {
    deepStrictEqual(
      pathInside(
        'vendor/sdk-api/3.0.0/docs',
        'vendor/sdk-api/3.0.0/docs/README.md'
      ),
      'vendor/sdk-api/3.0.0/docs/README.md'
    );
    throws(() =>
      pathInside(
        'vendor/sdk-api/3.0.0/docs',
        'vendor/sdk-api/3.0.0/manifest.json'
      )
    );
  });

  test('does not make generated maintainer documents API pages', () => {
    deepStrictEqual(isApiMarkdown('@openinf/util/README.md'), true);
    deepStrictEqual(isApiMarkdown('_media/RELEASING.md'), false);
  });

  test('leaves a run of hashes inside an example alone', () => {
    // A shell comment in a fence is what the example says, not a section of
    // the page, and promoting it would rewrite the example.
    const markdown = [
      'Prose before any heading.',
      '',
      '```sh',
      '### output',
      '```',
      '',
      '## Parameters',
    ].join('\n');
    match(normalizeHeadingHierarchy(markdown), /### output/);
  });

  test('promotes an orphaned h3 below the portal page title', () => {
    deepStrictEqual(
      normalizeHeadingHierarchy(
        '### Explanation\n\nBody.\n\n## Parameters\n\n### Value'
      ),
      '## Explanation\n\nBody.\n\n## Parameters\n\n### Value'
    );
  });
});

describe('rendered SDK HTML', () => {
  test('removes executable markup and unsafe URL schemes', () => {
    const result = sanitizeSdkHtml(
      [
        '<script>alert(1)</script><style>body { display:none }</style>',
        '<iframe src="https://example.com"></iframe>',
        '<svg onload="alert(1)"><script>alert(1)</script></svg>',
        '<p onclick="alert(1)">Text</p>',
        '<img src="https://example.com/image.png" onerror="alert(1)">',
        '<a href="jav&#x61;script:alert(1)">Unsafe</a>',
        '<img src="data:image/svg+xml,bad">',
        '<a href="//example.com">Protocol relative</a>',
      ].join('')
    );
    doesNotMatch(
      result,
      /script|style|iframe|svg|onclick|onload|onerror|alert\(1\)|data:|href=/i
    );
    match(result, /<p>Text<\/p>/);
    match(result, /src="https:\/\/example.com\/image.png"/);
  });

  test('preserves API anchors, tables, formatting, and escaped examples', () => {
    const input =
      '<h2 id="example">Example</h2>' +
      '<pre><code class="language-ts">&lt;script&gt;example&lt;/script&gt;</code></pre>' +
      '<table><thead><tr><th scope="col">Type</th></tr></thead>' +
      '<tbody><tr><td><a href="/docs/sdk/3.0.0/api/#example">T</a></td></tr></tbody></table>';
    deepStrictEqual(sanitizeSdkHtml(input), input);
  });
});

describe('compareVersions', () => {
  test('orders releases newest first rather than by name', () => {
    deepStrictEqual(
      ['3.0.0', '10.0.0', '4.2.0', '3.1.0', '3.0.1'].sort(compareVersions),
      ['10.0.0', '4.2.0', '3.1.0', '3.0.1', '3.0.0']
    );
  });

  test('ranks a release above its own prereleases', () => {
    deepStrictEqual(
      ['3.1.0-next.0', '3.1.0', '3.0.0', '3.1.0-next.10'].sort(compareVersions),
      ['3.1.0', '3.1.0-next.10', '3.1.0-next.0', '3.0.0']
    );
  });

  test('ranks a longer prerelease above the prefix it extends', () => {
    deepStrictEqual(
      ['3.1.0-alpha', '3.1.0-alpha.1', '3.1.0-beta'].sort(compareVersions),
      ['3.1.0-beta', '3.1.0-alpha.1', '3.1.0-alpha']
    );
  });

  test('ignores build metadata, which carries no precedence', () => {
    deepStrictEqual(['3.1.0', '3.1.1+build.1'].sort(compareVersions), [
      '3.1.1+build.1',
      '3.1.0',
    ]);
    deepStrictEqual(compareVersions('3.1.0+a', '3.1.0+b'), 0);
    deepStrictEqual(
      ['3.1.0-next.1+build.9', '3.1.0-next.2'].sort(compareVersions),
      ['3.1.0-next.2', '3.1.0-next.1+build.9']
    );
  });

  test('ranks a numeric prerelease identifier below an alphanumeric one', () => {
    deepStrictEqual(['3.1.0-1', '3.1.0-alpha'].sort(compareVersions), [
      '3.1.0-alpha',
      '3.1.0-1',
    ]);
  });
});

describe('packageOf', () => {
  test('names the package a symbol page belongs to', () => {
    deepStrictEqual(
      packageOf('@openinf/util/functions/isString.md'),
      '@openinf/util'
    );
    deepStrictEqual(packageOf('@openinf/util/README.md'), '@openinf/util');
  });

  test('leaves the pages that belong to no package unnamed', () => {
    deepStrictEqual(packageOf('README.md'), '');
    deepStrictEqual(packageOf('packages.md'), '');
  });
});

describe('comparing versions past what a Number holds', () => {
  // The artifact schema bounds a release part at `\\d+` and no further, so
  // two versions can differ by one and still round to the same Number.
  test('keeps two releases apart beyond 2^53', () => {
    deepStrictEqual(
      ['9007199254740992.0.0', '9007199254740993.0.0'].sort(compareVersions),
      ['9007199254740993.0.0', '9007199254740992.0.0']
    );
  });

  test('keeps two prerelease identifiers apart beyond 2^53', () => {
    deepStrictEqual(
      ['1.0.0-9007199254740992', '1.0.0-9007199254740993'].sort(
        compareVersions
      ),
      ['1.0.0-9007199254740993', '1.0.0-9007199254740992']
    );
  });

  test('reads a leading zero as the number it does not change', () => {
    deepStrictEqual(compareVersions('1.0.0', '01.0.0'), 0);
    deepStrictEqual(compareVersions('01.0.0', '2.0.0') > 0, true);
  });
});

describe('portalTitle', () => {
  test('names the package index rather than repeating the project', () => {
    deepStrictEqual(portalTitle('packages.md', 'OpenINF'), 'Packages');
  });

  test('leaves every other page titled by its own heading', () => {
    deepStrictEqual(
      portalTitle(
        '@openinf/util/functions/isString.md',
        'Function: isString()'
      ),
      'Function: isString()'
    );
    deepStrictEqual(
      portalTitle('README.md', 'OpenINF API reference'),
      'OpenINF API reference'
    );
  });
});
