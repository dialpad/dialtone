import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { parseMarkdownFrontmatter } from '../../../../apps/dialtone-documentation/scripts/lib/frontmatter.mjs';
import { mapOutputPath } from '../../../../apps/dialtone-documentation/scripts/lib/source-page.mjs';
import { SITE_URL } from '../../../../apps/dialtone-documentation/docs/.vuepress/site-reference.js';
import {
  readPublicComponentExports,
  withComponentIdentity,
} from '../../../../scripts/lib/vue-component-identity.mjs';
import { normalizeComponentName } from '../../../dialtone-query-core/src/component-name.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const appRequire = createRequire(
  resolve(root, 'apps/dialtone-documentation/package.json'),
);
const { inferPagePath, resolvePagePath } = await import(
  pathToFileURL(appRequire.resolve('vuepress/core'))
);

const MarkdownIt = appRequire('markdown-it');
const markdown = new MarkdownIt({ html: true });

/** Only live HTML tokens contribute associations; code/comment syntax does not. */
function authoredApiTags(body) {
  const tags = [];
  function addHtml(html, line) {
    const live = html.replace(/<!--[\s\S]*?-->/g, (comment) =>
      comment.replace(/[^\n]/g, ' '),
    );
    for (const match of live.matchAll(/<component-vue-api\b[\s\S]*?>/g)) {
      tags.push({
        tag: match[0],
        line: line + live.slice(0, match.index).split('\n').length,
      });
    }
  }
  const lineOffsets = [0];
  for (const match of body.matchAll(/\n/g)) lineOffsets.push(match.index + 1);
  let sourceCursor = 0;
  for (const token of markdown.parse(body, {})) {
    if (token.type === 'html_block') addHtml(token.content, token.map[0]);
    if (token.type !== 'inline') continue;
    const sourceIndex = body.indexOf(
      token.content,
      token.map ? lineOffsets[token.map[0]] : sourceCursor,
    );
    const sourceLine =
      token.map?.[0] ??
      (sourceIndex >= 0
        ? body.slice(0, sourceIndex).split('\n').length - 1
        : null);
    if (sourceIndex >= 0) sourceCursor = sourceIndex + token.content.length;
    let cursor = 0;
    for (const child of token.children ?? []) {
      const index = token.content.indexOf(child.content, cursor);
      if (index < 0) continue;
      if (
        child.type === 'html_inline' &&
        child.content.includes('<component-vue-api')
      ) {
        if (sourceLine === null)
          throw new Error('Cannot locate authored component API source line');
        addHtml(
          child.content,
          sourceLine + token.content.slice(0, index).split('\n').length - 1,
        );
      }
      cursor = index + child.content.length;
    }
  }
  return tags;
}

/** Build page associations before prose status filtering/HTML stripping. */
export async function buildComponentPage(filePathRelative, source, identities) {
  const { data, content } = parseMarkdownFrontmatter(source, {
    filePath: filePathRelative,
  });
  const { pathInferred } = inferPagePath({
    app: { siteData: { locales: {} } },
    filePathRelative,
  });
  if (data.permalinkPattern)
    throw new Error(`Unsupported page permalinkPattern in ${filePathRelative}`);
  const pagePath = resolvePagePath({
    permalink: data.permalink ?? null,
    pathInferred,
    options: {},
  });
  const offset = source.indexOf(content);
  const lineBase = source.slice(0, offset).split('\n').length - 1;
  const components = [];
  const resolveReference = (referenceName, relation, sourceLine) => {
    const key = normalizeComponentName(referenceName);
    const candidates = identities.filter(
      (record) =>
        record.identity?.kind === 'public' &&
        [record.identity.canonicalName, ...record.identity.aliases].some(
          (name) => normalizeComponentName(name) === key,
        ),
    );
    if (candidates.length !== 1)
      throw new Error(
        `Unresolved or ambiguous component reference '${referenceName}' in ${filePathRelative}:${sourceLine}`,
      );
    components.push({
      canonicalName: candidates[0].identity.canonicalName,
      referenceName,
      relation,
      sourceLine,
    });
  };
  for (const { tag, line } of authoredApiTags(content)) {
    if (/(?:[:@]component-name|v-bind:component-name)\s*=/.test(tag))
      throw new Error(`Dynamic component reference in ${filePathRelative}`);
    const name = tag.match(/\bcomponent-name\s*=\s*['"]([^'"]+)['"]/)?.[1];
    if (!name)
      throw new Error(
        `Dynamic or missing component reference in ${filePathRelative}`,
      );
    const sourceLine = lineBase + line;
    resolveReference(name, 'api', sourceLine);
    const also = tag.match(/:also-import\s*=\s*"([^"]+)"/)?.[1];
    if (/also-import/.test(tag) && !also)
      throw new Error(`Unsupported companion reference in ${filePathRelative}`);
    if (also && !/^\[\s*(?:'[^']+'\s*,?\s*)*\]$/.test(also))
      throw new Error(`Dynamic companion reference in ${filePathRelative}`);
    for (const companion of (also ?? '').matchAll(/'([^']+)'/g))
      resolveReference(companion[1], 'companion', sourceLine);
  }
  return {
    docId: filePathRelative.replace(/\.md$/, ''),
    title: data.title ?? data.heading ?? null,
    pageStatus: data.status ?? 'unspecified',
    sourcePath: `apps/dialtone-documentation/docs/${filePathRelative}`,
    pagePath,
    rawMarkdownPath: `/md/${mapOutputPath(filePathRelative)}`,
    components,
  };
}

export async function buildComponentDocLinks() {
  const vueRoot = resolve(root, 'packages/dialtone-vue');
  const manifest = JSON.parse(
    readFileSync(resolve(vueRoot, 'package.json'), 'utf8'),
  );
  const exports = readPublicComponentExports(vueRoot);
  const identities = [...exports].map(([file]) =>
    withComponentIdentity(
      { displayName: '' },
      file,
      exports,
      vueRoot,
      manifest,
    ),
  );
  const directory = resolve(
    root,
    'apps/dialtone-documentation/docs/components',
  );
  const pages = [];
  const sourceHash = createHash('sha256');
  for (const filename of readdirSync(directory)
    .filter((name) => name.endsWith('.md') && name !== 'index.md')
    .sort()) {
    const source = readFileSync(resolve(directory, filename), 'utf8');
    sourceHash.update(filename).update('\0').update(source).update('\0');
    const page = await buildComponentPage(
      `components/${filename}`,
      source,
      identities,
    );
    if (page.components.length) pages.push(page);
  }
  sourceHash.update(JSON.stringify(identities)).update(SITE_URL);
  const catalog = {
    schemaVersion: 1,
    identitySchemaVersion: 2,
    source: {
      channel: 'production',
      origin: SITE_URL,
      versionScope: 'latest',
      hash: sourceHash.digest('hex'),
    },
    pages,
  };
  const output = resolve(
    root,
    'packages/dialtone-docs/dist/component-doc-links.json',
  );
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, JSON.stringify(catalog, null, 2));
  console.info(
    `component-doc-links.json built: ${pages.length} authored pages`,
  );
  return catalog;
}
if (
  process.argv[1] &&
  relative(root, resolve(process.argv[1])) ===
    relative(root, fileURLToPath(import.meta.url))
) {
  buildComponentDocLinks().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
