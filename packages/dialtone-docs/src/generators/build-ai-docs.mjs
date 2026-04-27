import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, basename, relative, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { glob } from 'glob';
import { stripMarkdown } from '../utils/strip-markdown.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageRoot = resolve(__dirname, '../..');
const distDir = resolve(packageRoot, 'dist');
const outputPath = resolve(distDir, 'ai-docs.json');

/**
 * Extract the first H1 heading text from a markdown body (frontmatter already stripped).
 * Strips inline markdown (backticks, bold, italic) from the heading text.
 * Returns null if no H1 is found.
 */
function extractTitle(markdownBody) {
  const match = markdownBody.match(/^#\s+(.+)$/m);
  if (!match) return null;
  return match[1]
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
    .trim();
}

/**
 * Build a single document entry from a markdown file path.
 */
function buildEntry(absolutePath) {
  const raw = readFileSync(absolutePath, 'utf8');
  const { data: frontmatter, content: body } = matter(raw);

  const filePath = relative(packageRoot, absolutePath).split('\\').join('/');
  const name = basename(absolutePath, '.md');
  // INDEX.md files get category-prefixed ids to avoid collisions (e.g. "architecture-INDEX")
  const category = posix.basename(posix.dirname(filePath));
  const id = name === 'INDEX' ? `${category}-INDEX` : name;
  const title = extractTitle(body) ?? id;
  const content = stripMarkdown(body, { stripFrontmatter: false });

  return {
    id,
    title,
    type: frontmatter.type ?? null,
    category: frontmatter.category ?? null,
    keywords: Array.isArray(frontmatter.keywords) ? frontmatter.keywords : [],
    summary: frontmatter.ai_summary ?? null,
    content,
    lastUpdated: frontmatter.last_updated instanceof Date
      ? frontmatter.last_updated.toISOString().split('T')[0]
      : (frontmatter.last_updated ?? null),
    relatedPackages: Array.isArray(frontmatter.related_packages) ? frontmatter.related_packages : [],
    filePath,
  };
}

async function build() {
  const files = await glob('src/content/**/*.md', { cwd: packageRoot, absolute: true });

  if (files.length === 0) {
    throw new Error('No markdown files found in src/content/');
  }

  const entries = files
    .map(buildEntry)
    .sort((a, b) => a.id.localeCompare(b.id));

  mkdirSync(distDir, { recursive: true });
  writeFileSync(outputPath, JSON.stringify(entries, null, 2), 'utf8');

  console.info(`ai-docs.json built: ${entries.length} documents → ${outputPath}`);
}

build().catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
