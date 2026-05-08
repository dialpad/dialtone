import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { glob } from 'glob';
import { stripMarkdown } from '../utils/strip-markdown.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageRoot = resolve(__dirname, '../..');
const repoRoot = resolve(packageRoot, '../..');
const docsRoot = resolve(repoRoot, 'apps/dialtone-documentation/docs');
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
  const match = body.match(/^#\s+(.+)$/m);
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
 * NOTE: The stripping pipeline in stripMarkdown runs codeBlockFenced BEFORE htmlTag.
 * This ordering is load-bearing — fenced blocks are replaced with a space before
 * htmlTag strips VuePress directives. Do not change the call order in strip-markdown.mjs.
 */
export function chunkSections(body) {
  const lines = body.split('\n');
  const sections = [];
  let currentH2 = null;
  let currentH3 = null;
  let currentLines = [];
  let inFence = false;
  let fenceChar = null;

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
    const fenceMatch = line.match(/^(`{3,}|~{3,})/);
    if (fenceMatch) {
      const char = fenceMatch[1][0];
      if (!inFence) {
        inFence = true;
        fenceChar = char;
      } else if (char === fenceChar) {
        inFence = false;
        fenceChar = null;
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
  const { data: frontmatter, content: body } = matter(rawFile);

  // Blacklist filter: skip explicitly non-ready docs
  if (frontmatter.status && NON_READY_STATUSES.has(String(frontmatter.status))) return [];

  const filePath = relative(repoRoot, absolutePath).replace(/\\/g, '/');
  const name = basename(absolutePath, '.md');

  // Category = first path component under docs/ root.
  // Falls back to parent directory name for files outside docsRoot (test fixtures).
  const relToDocsRoot = relative(docsRoot, absolutePath);
  const relParts = relToDocsRoot.replace(/\\/g, '/').split('/');
  const category = relParts[0] === '..'
    ? basename(dirname(absolutePath))
    : (relParts.length > 1 ? relParts[0] : 'root');

  const docId = name;
  const docTitle = extractTitle(frontmatter, body) ?? docId;

  // Frontmatter stored on each record. Source uses snake_case (VuePress convention),
  // output uses camelCase (figma_url → figmaUrl).
  const fm = {
    title: frontmatter.title ?? null,
    description: frontmatter.description ?? null,
    status: frontmatter.status ?? null,
    figmaUrl: frontmatter.figma_url ?? null,
    storybook: frontmatter.storybook ?? null,
  };

  const sections = chunkSections(body);

  if (sections.length === 0) {
    // No H2/H3 headings — emit one record for the whole body
    const content = stripMarkdown(body, { stripFrontmatter: false });
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

  return sections.map(({ headingPath, raw }) => {
    const content = stripMarkdown(raw, { stripFrontmatter: false });
    const slug = headingPath.length > 0 ? slugify(headingPath.join('-')) : 'intro';
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
  });
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

  const allRecords = [];
  for (const file of files) {
    allRecords.push(...buildRecords(file));
  }

  // Sort alphabetically by docId; Array.sort is stable in V8, so section order
  // within each doc is preserved.
  allRecords.sort((a, b) => a.docId.localeCompare(b.docId));

  if (allRecords.length === 0) {
    throw new Error('Zero records produced — check status filter and glob path');
  }

  mkdirSync(distDir, { recursive: true });
  writeFileSync(outputPath, JSON.stringify(allRecords, null, 2), 'utf8');
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
