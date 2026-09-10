/**
 * @file Imports a versioned TypeDoc Markdown artifact into the portal.
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @module {type ES6Module} build/tasks/compile/import-sdk-api-docs
 */

import { existsSync } from 'node:fs';
import {
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { dirname as pathDirname, join as pathJoin, relative } from 'node:path';
import {
  artifactFile,
  compareVersions,
  isApiMarkdown,
  normalizeHeadingHierarchy,
  packageOf,
  portalPath,
  portalTitle,
  portalUrl,
  rewriteTypeDocLinks,
  stripTypeDocChrome,
} from '@openinf/portal/build/sdk-docs';
import { glob } from '@openinf/portal/build/utils';
import { z } from 'zod';

const artifactDir = 'vendor/sdk-api';
const collectionDir = 'collections/_sdk-api';
const dataPath = '_data/sdkApi.json';

const Artifact = z.object({
  schemaVersion: z.literal(1),
  version: z.string().regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/),
  commit: z.string().regex(/^[0-9a-f]{7,64}$/),
  generatedAt: z.string().datetime(),
  docsPath: z.string().min(1),
  navigationPath: z.string().min(1),
});

type NavigationNode = {
  title: string;
  kind?: number;
  path?: string;
  isDeprecated?: boolean;
  children?: NavigationNode[];
  url?: string;
};

// Drop fields the artifact does not own, especially precomputed public URLs.
const Navigation: z.ZodType<NavigationNode[]> = z.array(
  z.object({
    title: z.string(),
    kind: z.number().optional(),
    path: z.string().optional(),
    isDeprecated: z.boolean().optional(),
    children: z.lazy(() => Navigation).optional(),
  })
);

const sourcePath = (docsPath: string, file: string) =>
  relative(docsPath, file).replaceAll('\\', '/');

const readArtifact = async (directory: string) => {
  const root = await artifactFile(artifactDir, directory);
  const manifestPath = await artifactFile(root, 'manifest.json');
  const parsed = Artifact.safeParse(
    JSON.parse(await readFile(manifestPath, 'utf8'))
  );

  if (!parsed.success)
    throw new Error(`Invalid ${manifestPath}: ${parsed.error}`);
  if (parsed.data.version !== directory) {
    throw new Error(`${manifestPath} version does not match its directory`);
  }

  return { ...parsed.data, directory: root };
};

const withFrontmatter = (
  title: string,
  version: string,
  source: string,
  permalink: string,
  content: string
) =>
  [
    '---',
    `title: ${JSON.stringify(title)}`,
    'layout: sdk-api.liquid',
    'templateEngineOverride: md',
    `api_version: ${JSON.stringify(version)}`,
    `api_package: ${JSON.stringify(packageOf(source))}`,
    `api_source: ${JSON.stringify(source)}`,
    `permalink: ${JSON.stringify(permalink)}`,
    'editable: false',
    '---',
    '',
    content.trim(),
    '',
  ].join('\n');

const addUrls = (
  nodes: NavigationNode[],
  urls: Map<string, string>,
  where: string
): NavigationNode[] =>
  nodes.map((node) => {
    // Every other malformed thing in an artifact is refused rather than
    // worked around, and this was the exception: a path naming no imported
    // page left `url` undefined, `JSON.stringify` dropped the key, and the
    // build went on to publish a navigation entry that goes nowhere.
    if (node.path !== undefined && !urls.has(node.path)) {
      throw new Error(
        `${where} names a page that is not imported: ${node.path}`
      );
    }

    return {
      ...node,
      ...(node.path === undefined ? {} : { url: urls.get(node.path) }),
      ...(node.children === undefined
        ? {}
        : { children: addUrls(node.children, urls, where) }),
    };
  });

await rm(collectionDir, { recursive: true, force: true });
await rm(dataPath, { force: true });

if (!existsSync(artifactDir)) {
  console.info('No SDK API artifacts to import.');
  process.exit();
}

const entries = await readdir(artifactDir, { withFileTypes: true });
const artifactDirectories = entries
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort(compareVersions);

if (artifactDirectories.length === 0) {
  console.info('No SDK API artifacts to import.');
  process.exit();
}

const imported = [];

for (const directory of artifactDirectories) {
  const artifact = await readArtifact(directory);
  const docsPath = await artifactFile(artifact.directory, artifact.docsPath);
  const navigationPath = await artifactFile(
    artifact.directory,
    artifact.navigationPath
  );

  if (!(await stat(docsPath)).isDirectory()) {
    throw new Error(`${docsPath} must be a directory`);
  }

  const files = (await glob(`${docsPath}/**/*.md`))
    .map((file) => ({ file, source: sourcePath(docsPath, file) }))
    .filter(({ source }) => isApiMarkdown(source));
  if (files.length === 0) {
    throw new Error(`${docsPath} contains no importable API Markdown`);
  }
  if (!files.some(({ source }) => source === 'README.md')) {
    throw new Error(`${docsPath} is missing its API root README.md`);
  }
  const urls = new Map(
    files.map(({ source }) => [source, portalUrl(artifact.version, source)])
  );

  for (const { file, source } of files) {
    const resolved = await artifactFile(docsPath, sourcePath(docsPath, file));
    const markdown = await readFile(resolved, 'utf8');
    const { title, content } = stripTypeDocChrome(markdown);
    const destination = pathJoin(
      collectionDir,
      artifact.version,
      portalPath(source)
    );
    await mkdir(pathDirname(destination), { recursive: true });
    await writeFile(
      destination,
      withFrontmatter(
        portalTitle(source, title),
        artifact.version,
        source,
        portalUrl(artifact.version, source),
        normalizeHeadingHierarchy(rewriteTypeDocLinks(content, source, urls))
      )
    );
  }

  const navigation = addUrls(
    Navigation.parse(JSON.parse(await readFile(navigationPath, 'utf8'))),
    urls,
    artifact.navigationPath
  );
  imported.push({
    version: artifact.version,
    commit: artifact.commit,
    generatedAt: artifact.generatedAt,
    root: `/docs/sdk/${artifact.version}/api/`,
    navigation,
  });
}

await writeFile(
  dataPath,
  `${JSON.stringify({ versions: imported }, null, 2)}\n`
);
console.info(
  `Imported SDK API documentation for ${imported.length} version(s).`
);
