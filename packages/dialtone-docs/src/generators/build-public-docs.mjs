import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { buildExampleRecords, buildExampleCoverage, selectedExampleIds } from './documentation-examples.mjs';
import { glob } from 'glob';
import { readKeywords } from '../utils/keywords.mjs';
import { stripMarkdown } from '../utils/strip-markdown.mjs';
import { SITE_URL } from '../../../../apps/dialtone-documentation/docs/.vuepress/site-reference.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageRoot = resolve(__dirname, '../..');
const repoRoot = resolve(packageRoot, '../..');
const docsRoot = resolve(repoRoot, 'apps/dialtone-documentation/docs');
const vueRoot = resolve(repoRoot, 'packages/dialtone-vue');
const vuePackage = JSON.parse(readFileSync(resolve(vueRoot, 'package.json'), 'utf8'));
const distDir = resolve(packageRoot, 'dist');
const outputPath = resolve(distDir, 'public-docs.json');

// Statuses that indicate a doc is NOT yet production-ready.
// Files with no status field are treated as published (guides, design pages, whats-new).
// NOTE: this is a blacklist, not a whitelist — any unrecognized status is included.
// If a new non-ready status is added to the corpus, add it here explicitly.
const NON_READY_STATUSES = new Set(['planned', 'beta', 'wip']);

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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
export function chunkSections(body) {
  const lines = body.split('\n');
  const sections = [];
  let currentH2 = null;
  let currentH3 = null;
  let currentLines = [];
  let inFence = false;
  let fenceChar = null;
  let fenceLength = 0;

  function flush() {
    const raw = currentLines.join('\n').trim();
    if (!raw) return;
    const headingPath = [];
    if (currentH2) headingPath.push(currentH2);
    if (currentH3) headingPath.push(currentH3);
    sections.push({ headingPath, raw });
  }

  for (const line of lines) {
    // Track fenced code blocks (3+ backticks or tildes)
    const fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (fenceMatch) {
      const char = fenceMatch[1][0];
      const len = fenceMatch[1].length;
      const trailing = fenceMatch[2];
      if (!inFence) {
        inFence = true;
        fenceChar = char;
        fenceLength = len;
      } else if (char === fenceChar && len >= fenceLength && /^[ \t]*$/.test(trailing)) {
        // CommonMark §4.5: closing fences must have no trailing text (info strings are only valid on openers)
        inFence = false;
        fenceChar = null;
        fenceLength = 0;
      }
      currentLines.push(line);
      continue;
    }

    if (inFence) {
      currentLines.push(line);
      continue;
    }

    // Check for H2 before H3 — H3 regex (###) is a subset of H2 (##)
    const h2 = line.match(/^##(?!#)\s+(.+)$/);
    const h3 = !h2 && line.match(/^###(?!#)\s+(.+)$/);

    if (h2) {
      flush();
      currentH2 = h2[1].replace(/[*_`]/g, '').trim();
      currentH3 = null;
      currentLines = [];
    } else if (h3) {
      flush();
      // H3 inherits the current H2 context (or stands alone if no H2 seen yet)
      currentH3 = h3[1].replace(/[*_`]/g, '').trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }
  flush();
  return sections;
}

/**
 * Build DocumentationRecord[] from a single markdown file.
 * Returns an empty array for files with non-ready statuses (planned, beta, wip).
 *
 * NOTE: VuePress markdown frontmatter uses snake_case (figma_url) by convention.
 * The output JSON uses camelCase (figmaUrl) to match TypeScript/JavaScript conventions —
 * same pattern as build-ai-docs.mjs (e.g. ai_summary → summary, last_updated → lastUpdated).
 */
export function buildRecords(absolutePath) {
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
  if (status && NON_READY_STATUSES.has(status)) return [];

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
    return [{
      id: docId,
      docId,
      docTitle,
      category,
      headingPath: [],
      content,
      frontmatter: fm,
      filePath,
    }];
  }

  const usedSlugs = new Map();
  const records = sections.map(({ headingPath, raw }) => {
    const content = stripMarkdown(raw, { stripFrontmatter: false, preserveFencedCode: isDirective });
    const baseSlug = headingPath.length > 0 ? slugify(headingPath.join('-')) : 'intro';
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
  return [...records, ...buildExampleRecords({ rawFile, sections, records, filePath, vuePackage })];
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
  for (const file of files) {
    const records = buildRecords(file);
    allRecords.push(...records);
    coverage.push(buildExampleCoverage({ rawFile: readFileSync(file, 'utf8'), filePath: relative(repoRoot, file).replace(/\\/g, '/'), records }));
  }

  const ids = new Set();
  for (const record of allRecords) {
    if (ids.has(record.id)) throw new Error(`Duplicate documentation ID: ${record.id}`);
    ids.add(record.id);
  }
  for (const id of selectedExampleIds) {
    if (!ids.has(id)) throw new Error(`Selected example source missing: ${id}; retire or update its definition deliberately`);
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
