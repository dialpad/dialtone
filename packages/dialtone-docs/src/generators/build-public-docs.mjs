import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { buildSourceExamples, publicIdentities } from './documentation-examples.mjs';
import { buildPresetExampleRecords } from './preset-examples.mjs';
import { buildComponentPage } from './build-component-doc-links.mjs';
import { glob } from 'glob';
import { readKeywords } from '../utils/keywords.mjs';
import { stripMarkdown } from '../utils/strip-markdown.mjs';
import { SITE_URL } from '../../../../apps/dialtone-documentation/docs/.vuepress/site-reference.js';

import { chunkSections, slugify, NON_READY_STATUSES } from './source-sections.mjs';
export { chunkSections } from './source-sections.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageRoot = resolve(__dirname, '../..');
const repoRoot = resolve(packageRoot, '../..');
const docsRoot = resolve(repoRoot, 'apps/dialtone-documentation/docs');
const vueRoot = resolve(repoRoot, 'packages/dialtone-vue');
const vuePackage = JSON.parse(readFileSync(resolve(vueRoot, 'package.json'), 'utf8'));
const distDir = resolve(packageRoot, 'dist');
const outputPath = resolve(distDir, 'public-docs.json');


function extractTitle(frontmatter, body) {
  if (frontmatter.title) return String(frontmatter.title);
  // Strip fenced code blocks before searching for H1 — a shell comment inside a
  // code block (e.g. `# some-flag`) must not be mistaken for a page heading.
  const bodyWithoutCode = body.replace(/^ {0,3}(?:`{3,}|~{3,}).*\n[\s\S]*?^ {0,3}(?:`{3,}|~{3,})[^\n]*/gm, '');
  const match = bodyWithoutCode.match(/^#\s+(.+)$/m);
  if (!match) return null;
  return match[1]
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
    .trim();
}

/**
 * Split a markdown body into heading-bounded sections.
 * H2 headings start a new top-level section; H3 headings nest under the current H2.
 * Headings inside fenced code blocks are treated as plain content and do NOT split.
 * Returns: Array<{ headingPath: string[], raw: string }>
 *
 * NOTE: stripMarkdown consumes fenced code, comments and script/style blocks in
 * extractProse before htmlTag strips VuePress directives. Usage-slot boundaries
 * are protected there too; labels are finalized only after stripping empty slots.
 * Keep extractProse first in strip-markdown.mjs.
 */

/**
 * Build DocumentationRecord[] from a single markdown file.
 * Returns an empty array for files with non-ready statuses (planned, beta, wip).
 *
 * NOTE: VuePress markdown frontmatter uses snake_case (figma_url) by convention.
 * The output JSON uses camelCase (figmaUrl) to match TypeScript/JavaScript conventions —
 * same pattern as build-ai-docs.mjs (e.g. ai_summary → summary, last_updated → lastUpdated).
 */
function readPage(absolutePath, componentPage) {
  const rawFile = readFileSync(absolutePath, 'utf8');
  const { data: frontmatter, content } = matter(rawFile);
  const filePath = relative(repoRoot, absolutePath).replace(/\\/g, '/');
  const isDirective = filePath.startsWith('packages/dialtone-vue/directives/') && filePath.endsWith('.mdx');
  // Skip Storybook authoring imports and Meta; directive usage examples remain searchable.
  const headingStart = isDirective ? content.search(/^#\s+/m) : 0;
  if (headingStart < 0) throw new Error(`Missing H1 for ${filePath}`);
  const body = content.slice(headingStart);

  // Blacklist filter: skip explicitly non-ready docs (case-insensitive against canonical lowercase set)
  const status = typeof frontmatter.status === 'string'
    ? frontmatter.status.trim().toLowerCase()
    : '';
  const excluded = status && NON_READY_STATUSES.has(status);

  const name = basename(absolutePath).replace(/\.mdx?$/, '');

  // Category = first path component under docs/ root; docId = relative path from
  // docsRoot to avoid collisions (e.g. multiple index.md files). Files outside
  // docsRoot (test fixtures) fall back to their parent directory name and basename.
  const relToDocsRoot = relative(docsRoot, absolutePath).replace(/\\/g, '/');
  const relParts = relToDocsRoot.split('/');
  let category, docId;
  if (isDirective) {
    category = 'directives';
    docId = `directives/${name}`;
  } else if (relParts[0] === '..') {
    category = basename(dirname(absolutePath));
    docId = name;
  } else {
    category = relParts.length > 1 ? relParts[0] : 'root';
    docId = relToDocsRoot.replace(/\.md$/, '');
  }
  const docTitle = extractTitle(frontmatter, body) ?? docId;

  // Frontmatter stored on each record. Source uses snake_case (VuePress convention),
  // output uses camelCase (figma_url → figmaUrl).
  const fm = {
    title: frontmatter.title ?? null,
    description: frontmatter.description ?? null,
    status: frontmatter.status ?? null,
    figmaUrl: frontmatter.figma_url ?? null,
    storybook: frontmatter.storybook ?? null,
    keywords: readKeywords(frontmatter.keywords, filePath),
  };
  if (isDirective) {
    const storiesImport = rawFile.match(/^import \* as \w+ from ['"](.+\.stories\.js)['"]/m);
    const stories = storiesImport && readFileSync(resolve(dirname(absolutePath), storiesImport[1]), 'utf8');
    const storyTitle = stories?.match(/title:\s*['"]([^'"]+)['"]/)?.[1];
    if (!storyTitle) throw new Error(`Missing Storybook title for ${filePath}`);
    fm.storybook = `${SITE_URL}/vue/?path=/docs/${slugify(storyTitle)}--docs`;
    fm.sourcePackage = vuePackage.name;
    fm.sourceVersion = vuePackage.version;
  }

  const sections = chunkSections(body);

  if (sections.length === 0) {
    // No H2/H3 headings — emit one record for the whole body
    const content = stripMarkdown(body, { stripFrontmatter: false, preserveFencedCode: isDirective });
    return { records: excluded ? [] : [{
      id: docId,
      docId,
      docTitle,
      category,
      headingPath: [],
      content,
      frontmatter: fm,
      filePath,
    }], coverage: buildSourceExamples({
      rawFile, sections, records: [], filePath, vuePackage, componentPage,
    }).coverage };
  }

  const usedSlugs = new Map();
  const records = sections.map(({ headingPath, raw, baseSlug }) => {
    const content = stripMarkdown(raw, { stripFrontmatter: false, preserveFencedCode: isDirective });
    const count = usedSlugs.get(baseSlug) ?? 0;
    usedSlugs.set(baseSlug, count + 1);
    const slug = count === 0 ? baseSlug : `${baseSlug}-${count}`;
    const id = `${docId}#${slug}`;
    return {
      id,
      docId,
      docTitle,
      category,
      headingPath,
      content,
      frontmatter: fm,
      filePath,
    };
  }).filter(record => !isDirective || record.content.trim().length > 0);
  const lineOffset = rawFile.slice(0, rawFile.length - content.length + headingStart).split('\n').length - 1;
  const sourceExamples = buildSourceExamples({
    rawFile, sections, records, filePath, vuePackage, componentPage, lineOffset,
  });
  return { records: excluded ? [] : [...records, ...sourceExamples.records], coverage: sourceExamples.coverage };
}

export function buildRecords(absolutePath) {
  return readPage(absolutePath).records;
}

async function build() {
  const files = await glob('apps/dialtone-documentation/docs/**/*.md', {
    cwd: repoRoot,
    absolute: true,
    ignore: [
      'apps/dialtone-documentation/docs/_data/**',
      'apps/dialtone-documentation/docs/.vuepress/**',
    ],
  });

  if (files.length === 0) {
    throw new Error('No markdown files found in apps/dialtone-documentation/docs/');
  }

  // Only include directive folders exported by the public package barrel.
  const barrel = readFileSync(resolve(vueRoot, 'index.js'), 'utf8');
  const directiveGlobs = [...barrel.matchAll(/export \* from ['"]\.\/(directives\/[^'"]+)['"]/g)]
    .map(match => `packages/dialtone-vue/${match[1]}/*.mdx`);
  files.push(...await glob(directiveGlobs, { cwd: repoRoot, absolute: true }));

  const allRecords = [];
  const coverage = [];
  const componentPages = [];
  const identities = publicIdentities(vuePackage).map(identity => ({ identity }));
  for (const file of files) {
    const rawFile = readFileSync(file, 'utf8');
    const componentPage = relative(docsRoot, file).replace(/\\/g, '/').startsWith('components/')
      ? await buildComponentPage(relative(docsRoot, file).replace(/\\/g, '/'), rawFile, identities) : undefined;
    if (componentPage) componentPages.push(componentPage);
    const page = readPage(file, componentPage);
    allRecords.push(...page.records);
    if (page.coverage) coverage.push(page.coverage);
  }

  const presetPath = resolve(repoRoot, 'packages/combinator/.generated/preset-examples.json');
  let presetReport;
  try {
    presetReport = JSON.parse(readFileSync(presetPath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error('Missing preset intermediate; run dialtone-combinator:generate-examples');
    throw error;
  }
  const presets = buildPresetExampleRecords(presetReport, { records: allRecords, vuePackage, componentPages });
  allRecords.push(...presets.records);

  const ids = new Set();
  for (const record of allRecords) {
    if (ids.has(record.id)) throw new Error(`Duplicate documentation ID: ${record.id}`);
    ids.add(record.id);
  }


  // Sort alphabetically by docId; Array.sort is stable in V8, so section order
  // within each doc is preserved.
  allRecords.sort((a, b) => a.docId.localeCompare(b.docId));

  if (allRecords.length === 0) {
    throw new Error('Zero records produced — check status filter and glob path');
  }

  mkdirSync(distDir, { recursive: true });
  writeFileSync(outputPath, JSON.stringify(allRecords, null, 2), 'utf8');
  coverage.sort((a, b) => a.filePath < b.filePath ? -1 : a.filePath > b.filePath ? 1 : 0);
  const report = { schemaVersion: 1, pages: coverage, summary: {
    pages: coverage.length, liveCandidates: coverage.reduce((sum, page) => sum + page.liveCandidates, 0),
    delivered: coverage.reduce((sum, page) => sum + page.deliveredIds.length, 0),
    remaining: coverage.reduce((sum, page) => sum + page.remaining, 0),
    completePages: coverage.filter(page => page.complete).map(page => page.filePath),
  } };
  writeFileSync(resolve(distDir, 'preset-example-coverage.json'), JSON.stringify(presets.coverage, null, 2), 'utf8');
  writeFileSync(resolve(distDir, 'example-coverage.json'), JSON.stringify(report, null, 2), 'utf8');
  console.info(`public-docs.json built: ${allRecords.length} sections → ${outputPath}`);
}

// Execute only when run as a script, not when imported as a module (e.g. by tests)
const isMain = process.argv[1] === __filename;
if (isMain) {
  build().catch(err => {
    console.error('Build failed:', err.message);
    process.exit(1);
  });
}
