#!/usr/bin/env node
/**
 * Generate raw GFM markdown versions of doc pages.
 *
 * Reads source .md files from multiple sections (components, foundations,
 * dialtone, functions-and-utilities, ui-kits, guides, tokens, utilities),
 * transforms them into clean markdown (no Vue components), and writes them to
 * docs/.vuepress/public/md/{section}/.
 *
 * Usage:
 *   node scripts/generate-raw-markdown.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, basename, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseSourceMarkdown } from './lib/parse-source-markdown.mjs';
import { codeCell, escapeTableCell, rewriteAbsoluteLinks, resolveRawLink } from './lib/utils.mjs';
import { setComponentDocs } from './lib/transform-vue-api.mjs';
import { setUtilityClassDocs } from './lib/transform-utility-class-table.mjs';
import { setTokenDocs } from './lib/transform-tokens.mjs';
import { setIconKeywords, setIllustrationData } from './lib/transform-icon-catalog.mjs';
import { setTokensDocs, setColorUtilityClassDocs } from './lib/transform-color-tables.mjs';
import { SECTION_META, generateLlmsTxt, generateLlmsFullTxt } from './lib/generate-llms.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');

const DATA_DIR = resolve(ROOT, 'docs/_data');
const UTILITIES_DIR = resolve(ROOT, 'docs/utilities');

// Data source paths
const COMPONENT_DOCS_JSON = resolve(ROOT, '../../packages/dialtone-vue/dist/component-documentation.json');
const UTILITY_DOCS_JSON = resolve(ROOT, '../../packages/dialtone-css/lib/dist/dialtone-docs.json');
const TOKEN_DOCS_JSON = resolve(ROOT, '../../packages/dialtone-tokens/dist/doc.json');
const ICON_KEYWORDS_JSON = resolve(ROOT, '../../packages/dialtone-icons/dist/keywords-icons.json');
const ILLUSTRATION_JSON = resolve(ROOT, 'docs/_data/svg-spot.json');
const TOKENS_DOCS_JSON = resolve(ROOT, '../../packages/dialtone-css/lib/dist/tokens-docs.json');
const TYPE_JSON = resolve(DATA_DIR, 'type.json');
const DOWNLOADS_JSON = resolve(DATA_DIR, 'downloads.json');
const VUE_UTILITIES_JSON = resolve(DATA_DIR, 'vue-utilities.json');

/** Cached site-nav.json data — loaded once in loadAllDataSources(). */
let _navData = null;

/**
 * Section configuration.
 * - flat: true  → read only top-level .md files, skip index.md (legacy components behavior)
 * - flat: false → recursively discover all .md files in nested directories
 */
const SECTIONS = [
  { name: 'components', sourceDir: 'docs/components', outputDir: 'md/components', flat: true },
  { name: 'foundations', sourceDir: 'docs/foundations', outputDir: 'md/foundations' },
  {
    name: 'dialtone',
    sourceDir: 'docs/dialtone',
    outputDir: 'md/dialtone',
    overviewLinks: [
      '/components/',
      '/utilities/',
      '/tokens/',
      '/guides/content/',
      '/functions-and-utilities/',
    ],
  },
  {
    name: 'functions-and-utilities',
    sourceDir: 'docs/functions-and-utilities',
    outputDir: 'md/functions-and-utilities',
  },
  { name: 'ui-kits', sourceDir: 'docs/ui-kits', outputDir: 'md/ui-kits' },
  { name: 'guides', sourceDir: 'docs/guides', outputDir: 'md/guides' },
  { name: 'tokens', sourceDir: 'docs/tokens', outputDir: 'md/tokens' },
  { name: 'utilities', sourceDir: 'docs/utilities', outputDir: 'md/utilities', navSection: '/utilities/' },
  { name: 'downloads', sourceDir: 'docs/downloads', outputDir: 'md/downloads' },
];

/**
 * Recursively discover all .md files under a directory.
 * Returns paths relative to the given root directory.
 */
function walkDir (dir, rootDir = dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...walkDir(full, rootDir));
    } else if (entry.endsWith('.md')) {
      results.push(relative(rootDir, full));
    }
  }
  return results;
}

/**
 * Map a relative source path to an output filename for nested sections.
 * - "colors/index.md" → "colors.md"
 * - "typography/marketing.md" → "typography/marketing.md"
 * - "index.md" (section root) → kept as-is, caller handles
 */
function mapOutputPath (relPath) {
  const base = basename(relPath);
  const dir = dirname(relPath);
  if (base === 'index.md') {
    if (dir === '.') return 'index.md';
    return dir + '.md';
  }
  return relPath;
}

/**
 * Extract a flat set of frontmatter field values from a markdown source string.
 * Returns an object keyed by requested field names; missing fields are omitted.
 */
function parseFrontmatter (content, fields) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = match[1];
  const result = {};
  for (const field of fields) {
    const fieldMatch = fm.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
    if (fieldMatch) result[field] = fieldMatch[1].trim();
  }
  return result;
}

/**
 * Load a JSON file with a friendly warning on failure.
 */
function loadJson (path, label) {
  try {
    const data = JSON.parse(readFileSync(path, 'utf-8'));
    const size = Array.isArray(data) ? data.length : Object.keys(data).length;
    console.log(`[generate-raw-markdown] Loaded ${label}: ${size} entries`);
    return data;
  } catch (err) {
    console.warn(`[generate-raw-markdown] Warning: Could not load ${label}: ${err.message}`);
    return null;
  }
}

/**
 * Build a markdown link line from a file's first heading.
 * Optionally appends a date if found in the file's metadata.
 */
function buildLinkFromFile (filePath, linkTarget, { includeDate = false } = {}) {
  const content = readFileSync(filePath, 'utf-8');
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : basename(linkTarget, '.md');
  if (includeDate) {
    const dateMatch = content.match(/^- \*\*Posted\*\*:\s*(.+)$/m);
    if (dateMatch) return `- [${title}](${linkTarget}) — ${dateMatch[1]}`;
  }
  return `- [${title}](${linkTarget})`;
}

/**
 * List .md files in a directory (excluding index.md), sorted.
 */
function listMdFiles (dir) {
  return readdirSync(dir)
    .filter(f => f.endsWith('.md') && f !== 'index.md')
    .sort();
}

/**
 * Sort files by date descending if all match YYYY-M-D.md, else alphabetically.
 * Returns true if date-based sorting was applied.
 */
const DATE_RE = /(\d{4})-(\d{1,2})-(\d{1,2})\.md$/;
function sortChildFiles (children) {
  const hasDates = children.every(f => DATE_RE.test(f));
  if (hasDates) {
    children.sort((a, b) => {
      const [, yA, mA, dA] = a.match(DATE_RE);
      const [, yB, mB, dB] = b.match(DATE_RE);
      return (yB - yA) || (mB - mA) || (dB - dA);
    });
  } else {
    children.sort();
  }
  return hasDates;
}

/**
 * Append a markdown section to a file from an array of content lines.
 * @param {string} filePath - Absolute path to the file
 * @param {string[]} lines - Content lines to append
 * @param {string} heading - Section heading (default: "## Pages")
 */
function appendMarkdownSection (filePath, lines, heading = '## Pages') {
  const existing = readFileSync(filePath, 'utf-8');
  writeFileSync(filePath, existing.trimEnd() + '\n\n' + heading + '\n\n' + lines.join('\n').trimEnd() + '\n', 'utf-8');
}

/**
 * Append a "## Pages" section to a file from an array of markdown link lines.
 */
function appendPagesSection (filePath, links) {
  appendMarkdownSection(filePath, links);
}

/**
 * After all files are generated for a non-flat section, scan the output
 * directory for any .md file whose stem matches a sibling subdirectory.
 * For each match, append a "## Pages" section linking to child files.
 */
function appendSubdirectoryLinks (outputBase) {
  let entries;
  try {
    entries = readdirSync(outputBase);
  } catch { return; }

  for (const entry of entries) {
    if (!entry.endsWith('.md') || entry === 'index.md') continue;
    const stem = basename(entry, '.md');
    const subDir = resolve(outputBase, stem);
    try {
      if (!statSync(subDir).isDirectory()) continue;
    } catch { continue; }

    const children = walkDir(subDir, subDir);
    if (children.length === 0) continue;

    const hasDates = sortChildFiles(children);
    const links = children.map(f => buildLinkFromFile(resolve(subDir, f), `${stem}/${f}`, { includeDate: hasDates }));
    appendPagesSection(resolve(outputBase, entry), links);
  }
}

/**
 * Load all external JSON data sources and push them into module-level caches.
 */
function loadAllDataSources () {
  const componentDocs = loadJson(COMPONENT_DOCS_JSON, 'component-documentation.json');
  setComponentDocs(componentDocs || []);

  const utilityDocs = loadJson(UTILITY_DOCS_JSON, 'dialtone-docs.json');
  setUtilityClassDocs(utilityDocs || {});

  const tokenDocs = loadJson(TOKEN_DOCS_JSON, 'token doc.json');
  setTokenDocs(tokenDocs);

  const iconKeywords = loadJson(ICON_KEYWORDS_JSON, 'keywords-icons.json');
  setIconKeywords(iconKeywords);

  const illustrationData = loadJson(ILLUSTRATION_JSON, 'svg-spot.json');
  setIllustrationData(illustrationData);

  const cssTokensDocs = loadJson(TOKENS_DOCS_JSON, 'tokens-docs.json');
  setTokensDocs(cssTokensDocs);
  setColorUtilityClassDocs(utilityDocs || {});

  _navData = loadJson(resolve(DATA_DIR, 'site-nav.json'), 'site-nav.json');
}

/**
 * Generate an index.md listing all pages for a flat section.
 */
function generateFlatIndex (section, sourceDir, outputBase) {
  const srcIndex = resolve(sourceDir, 'index.md');
  try {
    const srcContent = readFileSync(srcIndex, 'utf-8');
    const titleMatch = srcContent.match(/^title:\s*(.+)$/m);
    const descMatch = srcContent.match(/^description:\s*(.+)$/m);
    const title = titleMatch?.[1] ?? section.name;
    const desc = descMatch?.[1] ?? '';

    const links = listMdFiles(outputBase).map(f => buildLinkFromFile(resolve(outputBase, f), f));

    let indexContent = `# ${title}\n\n${desc}\n`;
    if (links.length > 0) {
      indexContent += '\n## Pages\n\n' + links.join('\n') + '\n';
    }
    writeFileSync(resolve(outputBase, 'index.md'), indexContent, 'utf-8');
  } catch (err) {
    console.warn(`[generate-raw-markdown] ${section.name}: could not generate index.md: ${err.message}`);
  }
}

/**
 * Append sibling page links to a non-flat section's index.md.
 */
function appendSiblingLinks (section, outputBase) {
  const indexPath = resolve(outputBase, 'index.md');
  const siblings = listMdFiles(outputBase);
  if (siblings.length === 0) return;

  const links = siblings.map(f => buildLinkFromFile(resolve(outputBase, f), f));
  try {
    appendPagesSection(indexPath, links);
  } catch (err) {
    console.warn(`[generate-raw-markdown] ${section.name}: could not append links to index.md: ${err.message}`);
  }
}

/**
 * Build a markdown link for an overview section from its source index.md.
 */
function buildOverviewLink (linkPath, currentRawDir) {
  const srcDir = linkPath.replace(/^\/|\/$/g, '');
  const srcFile = resolve(ROOT, 'docs', srcDir, 'index.md');
  const rawLink = resolveRawLink(linkPath, currentRawDir);
  try {
    const content = readFileSync(srcFile, 'utf-8');
    const titleMatch = content.match(/^title:\s*(.+)$/m);
    const descMatch = content.match(/^description:\s*(.+)$/m);
    const title = titleMatch?.[1] ?? srcDir;
    const desc = descMatch?.[1] ?? '';
    return desc ? `- [${title}](${rawLink}) — ${desc}` : `- [${title}](${rawLink})`;
  } catch {
    return `- [${srcDir}](${rawLink})`;
  }
}

/**
 * Load nav categories for a section from site-nav.json.
 * Returns the category children array, or null if not found.
 */
function findNavItemByLink (items, link) {
  for (const item of items || []) {
    if (item.link === link) return item;
    if (item.children) {
      const found = findNavItemByLink(item.children, link);
      if (found) return found;
    }
  }
  return null;
}

function loadNavCategories (navSection) {
  return findNavItemByLink(_navData?.nav, navSection)?.children ?? null;
}

/**
 * Build categorized markdown link lines from nav category entries.
 */
function buildCategoryLinks (categories, currentRawDir) {
  const lines = [];
  for (const category of categories) {
    if (!category.children?.length) continue;
    lines.push(`### ${category.text}`);
    for (const child of category.children) {
      lines.push(`- [${child.text}](${resolveRawLink(child.link, currentRawDir)})`);
    }
    lines.push('');
  }
  return lines;
}

/**
 * Append categorized child page links from site-nav.json to a section's index.md.
 * Used for sections like utilities where pages are nested in subdirectories.
 */
function appendNavLinks (section, outputBase) {
  if (!section.navSection) return;

  const categories = loadNavCategories(section.navSection);
  if (!categories?.length) return;

  const currentRawDir = section.outputDir.replace(/^md\//, '');
  const lines = buildCategoryLinks(categories, currentRawDir);
  if (lines.length === 0) return;

  const indexPath = resolve(outputBase, 'index.md');
  try {
    appendMarkdownSection(indexPath, lines);
  } catch (err) {
    console.warn(`[generate-raw-markdown] ${section.name}: could not append nav links to index.md: ${err.message}`);
  }
}

/**
 * Append overview section links (e.g. Components, Utilities) to a section's index.md.
 */
function appendOverviewLinks (section, outputBase) {
  if (!section.overviewLinks?.length) return;

  const indexPath = resolve(outputBase, 'index.md');
  const currentRawDir = section.outputDir.replace(/^md\//, '');
  const links = section.overviewLinks.map(lp => buildOverviewLink(lp, currentRawDir));
  try {
    appendMarkdownSection(indexPath, links, '## Sections');
  } catch (err) {
    console.warn(`[generate-raw-markdown] ${section.name}: could not append sections to index.md: ${err.message}`);
  }
}

/**
 * Map a frontmatter value to a status label, matching the VuePress theme logic.
 */
function componentStatus (property) {
  if (!property) return 'N/A';
  switch (property) {
    case 'wip': return 'In progress';
    case 'planned': return 'Planned';
    default: return 'Ready';
  }
}

/**
 * Generate a component status page with CSS, Vue, and Figma columns.
 * Reads source frontmatter for status/storybook/figma fields.
 */
function generateComponentStatusPage (sourceDir, outputBase) {
  const files = readdirSync(sourceDir)
    .filter(f => f.endsWith('.md') && f !== 'index.md')
    .sort();

  const rows = files.map(f => {
    const content = readFileSync(resolve(sourceDir, f), 'utf-8');
    const fm = parseFrontmatter(content, ['title', 'status', 'storybook', 'figma_url', 'figma']);
    const title = fm.title || basename(f, '.md');
    const css = componentStatus(fm.status);
    const vue = componentStatus(fm.storybook);
    const figma = componentStatus(fm.figma_url || fm.figma);
    return `| [${title}](${f}) | ${css} | ${vue} | ${figma} |`;
  });

  const output = [
    '# Component Status',
    '',
    'Overview of the components health status.',
    '',
    'Ready | In progress | Planned | N/A',
    '',
    '| Component | CSS | Vue | Figma |',
    '| --- | --- | --- | --- |',
    ...rows,
    '',
  ].join('\n');

  writeFileSync(resolve(outputBase, 'status.md'), output, 'utf-8');
}

/**
 * Build a markdown table from typographyStyles entries.
 */
function buildTypographyTable (styles) {
  const rows = styles.map(s => `| .${s.var} | ${s.output} |`);
  return ['| Class | Output |', '| --- | --- |', ...rows].join('\n');
}

/**
 * Post-process the generated typography.md to replace Vue template expressions
 * with actual data from type.json.
 */
function postProcessTypography (filePath, typographyStyles) {
  let content = readFileSync(filePath, 'utf-8');

  // Replace broken API table (v-for produced a single row with {{ }} expressions)
  // Also clean up stray <div> wrapper from <clamped-table-wrapper>
  content = content.replace(
    /\s*<div>\n\| Class \| Output \|\n\| --- \| --- \|\n\| \.?\{\{ varName \}\} \| \{\{ output \}\} \|\n+\s*<\/div>/,
    '\n' + buildTypographyTable(typographyStyles),
  );

  // Insert category tables after each heading + description paragraph
  const categories = [
    { heading: '### Headlines', prefix: 'd-text-headline' },
    { heading: '### Body', prefix: 'd-text-body' },
    { heading: '### Label', prefix: 'd-text-label' },
    { heading: '### Code', prefix: 'd-text-code' },
  ];
  for (const { heading, prefix } of categories) {
    const styles = typographyStyles.filter(s => s.var.startsWith(prefix));
    if (styles.length === 0) continue;
    const table = buildTypographyTable(styles);
    // Insert table after the heading's description paragraph (next blank line)
    const idx = content.indexOf(heading);
    if (idx === -1) continue;
    const afterHeading = content.indexOf('\n\n', idx + heading.length);
    if (afterHeading === -1) continue;
    const nextSection = content.indexOf('\n\n', afterHeading + 2);
    const insertAt = nextSection !== -1 ? nextSection + 2 : content.length;
    content = content.slice(0, insertAt) + '\n' + table + '\n' + content.slice(insertAt);
  }

  writeFileSync(filePath, content, 'utf-8');
}

/**
 * Build the markdown chunk for a single downloads section.
 */
function buildDownloadsSectionLines (section) {
  const lines = [`## ${section.title}`, ''];

  const topLinks = [];
  if (section.relatedLink) {
    topLinks.push(`[${section.relatedLabel}](${section.relatedLink})`);
  }
  if (section.downloadAllUrl) {
    topLinks.push(`[${section.downloadAllLabel}](${section.downloadAllUrl})`);
  }
  if (topLinks.length > 0) {
    lines.push(topLinks.join(' | '), '');
  }

  const linkedItems = (section.items || []).filter(i => i.label && i.downloadUrl);
  if (linkedItems.length > 0) {
    for (const item of linkedItems) {
      lines.push(`- [${item.label}](${item.downloadUrl})`);
    }
    lines.push('');
  }

  return lines;
}

/**
 * Replace the Downloads raw-markdown file with a flat, LLM-friendly expansion
 * built from docs/_data/downloads.json. The source `downloads/index.md` contains
 * only `<downloads-catalog />`; without this post-process the raw output would
 * be empty of actual download links, making "Open in Claude.ai" / "Copy MD" useless.
 *
 * Title and description are read from the source page's frontmatter
 * (`parseSourceMarkdown` strips it from the output file, so we read the source
 * directly) — single source of truth, no drift risk.
 */
function postProcessDownloads (sourcePath, outputPath, data) {
  const source = readFileSync(sourcePath, 'utf-8');
  const { title, description } = parseFrontmatter(source, ['title', 'description']);

  const lines = [`# ${title || 'Downloads'}`, ''];
  if (description) lines.push(description, '');

  for (const slug of data.order) {
    const section = data.sections[slug];
    if (!section) continue;
    lines.push(...buildDownloadsSectionLines(section));
  }

  writeFileSync(outputPath, lines.join('\n').trimEnd() + '\n', 'utf-8');
}

/**
 * Build markdown rows for one vue-utilities table.
 */
function buildVueUtilitiesRows (items, codeNames) {
  return (items || []).map((item) => {
    const name = codeNames ? `\`${codeCell(item.name)}\`` : escapeTableCell(item.name);
    const storybook = item.storybook ? `[Storybook](${item.storybook})` : '';
    return `| ${name} | ${escapeTableCell(item.description)} | ${storybook} |`;
  }).join('\n');
}

/**
 * Post-process the generated functions-and-utilities/index.md: the standard
 * pipeline renders each v-for table as a single placeholder row, so replace
 * that row with real rows from vue-utilities.json. Patching the generated
 * file (rather than rebuilding from the source page) keeps the pipeline's
 * frontmatter, section prose, and appended links intact.
 */
function postProcessVueUtilities (filePath, data) {
  let content = readFileSync(filePath, 'utf-8');

  const tables = [
    { column: 'Directive', items: data.directives, codeNames: true },
    { column: 'Function', items: data.functions, codeNames: false },
    { column: 'Utility', items: data.utilities, codeNames: false },
  ];
  for (const { column, items, codeNames } of tables) {
    const header = `| ${column} | Description | Docs |\n| --- | --- | --- |`;
    const placeholder = `${header}\n| {{ item.name }} | {{ item.description }} | Storybook |`;
    if (!content.includes(placeholder)) {
      throw new Error(`placeholder table for "${column}" not found`);
    }
    content = content.replace(placeholder, () => `${header}\n${buildVueUtilitiesRows(items, codeNames)}`);
  }

  writeFileSync(filePath, content, 'utf-8');
}

/**
 * Normalize a nav link to the corresponding raw .md path stem.
 * Strips leading/trailing slashes and .html extension.
 * e.g. "/utilities/backgrounds/attachment.html" → "utilities/backgrounds/attachment"
 */
function navLinkToStem (link) {
  return link.replace(/^\/|\/$/g, '').replace(/\.html$/, '');
}

/**
 * Build a child link line from a nav child entry, reading the raw file for its title.
 */
function buildNavChildLink (child, parentDir, rawBase) {
  const stem = navLinkToStem(child.link);
  const childRel = relative(parentDir, stem) + '.md';
  const childFile = resolve(rawBase, stem + '.md');
  try {
    const cc = readFileSync(childFile, 'utf-8');
    const tm = cc.match(/^#\s+(.+)$/m);
    return `- [${tm ? tm[1] : child.text}](${childRel})`;
  } catch {
    return `- [${child.text}](${childRel})`;
  }
}

/**
 * Walk the site-nav.json tree and append child links to any page
 * whose nav entry has children (e.g. Getting Started → Theme and Mode, etc.).
 * Skips pages that already have a "## Pages" section from filesystem-based linking.
 */
/**
 * If a nav entry has children and the corresponding raw file lacks a ## Pages
 * section, append child links to it.
 */
function tryAppendNavChildren (entry, rawBase) {
  if (!entry.link || !entry.children?.length) return;
  const stem = navLinkToStem(entry.link);
  const parentFile = resolve(rawBase, stem + '.md');
  let parentContent;
  try { parentContent = readFileSync(parentFile, 'utf-8'); } catch { return; }
  if (parentContent.includes('\n## Pages\n')) return;

  const parentDir = dirname(stem);
  const links = entry.children
    .filter(c => c.link && !c.link.startsWith('http'))
    .map(c => buildNavChildLink(c, parentDir, rawBase));
  if (links.length > 0) appendPagesSection(parentFile, links);
}

/**
 * Walk the site-nav.json tree and append child links to any page
 * whose nav entry has children (e.g. Getting Started → Theme and Mode, etc.).
 * Skips pages that already have a "## Pages" section from filesystem-based linking.
 */
function appendNavChildLinks (rawBase) {
  if (!_navData?.nav) return;

  function walk (entries) {
    if (!entries) return;
    for (const entry of entries) {
      tryAppendNavChildren(entry, rawBase);
      if (entry.children) walk(entry.children);
    }
  }

  walk(_navData.nav);
}

function main () {
  console.log('[generate-raw-markdown] Starting...');

  loadAllDataSources();

  let totalSuccess = 0;
  let totalError = 0;

  for (const section of SECTIONS) {
    const sourceDir = resolve(ROOT, section.sourceDir);
    const outputBase = resolve(ROOT, 'docs/.vuepress/public', section.outputDir);

    mkdirSync(outputBase, { recursive: true });

    const files = section.flat
      ? readdirSync(sourceDir).filter(f => f.endsWith('.md') && f !== 'index.md')
      : walkDir(sourceDir);

    console.log(`[generate-raw-markdown] ${section.name}: found ${files.length} files`);

    let successCount = 0;
    let errorCount = 0;

    for (const relFile of files) {
      const sourcePath = resolve(sourceDir, relFile);
      const outputRelPath = section.flat ? relFile : mapOutputPath(relFile);
      const outputPath = resolve(outputBase, outputRelPath);

      mkdirSync(dirname(outputPath), { recursive: true });

      try {
        const source = readFileSync(sourcePath, 'utf-8');
        const rawDir = dirname(section.outputDir.replace(/^md\//, '') + '/' + outputRelPath);
        const result = rewriteAbsoluteLinks(
          parseSourceMarkdown(source, {
            dataDir: DATA_DIR,
            filePath: sourcePath,
            utilitiesDir: UTILITIES_DIR,
          }),
          rawDir,
        );
        writeFileSync(outputPath, result, 'utf-8');
        successCount++;
      } catch (err) {
        console.error(`[generate-raw-markdown] Error processing ${section.name}/${relFile}: ${err.message}`);
        errorCount++;
      }
    }

    if (section.flat) {
      generateFlatIndex(section, sourceDir, outputBase);
      if (section.name === 'components') {
        generateComponentStatusPage(sourceDir, outputBase);
        successCount++;
      }
    } else {
      appendSiblingLinks(section, outputBase);
      appendSubdirectoryLinks(outputBase);
    }

    appendNavLinks(section, outputBase);
    appendOverviewLinks(section, outputBase);

    if (section.name === 'foundations') {
      try {
        const typeData = JSON.parse(readFileSync(TYPE_JSON, 'utf-8'));
        postProcessTypography(resolve(outputBase, 'typography.md'), typeData.typographyStyles);
      } catch (err) {
        console.warn(`[generate-raw-markdown] typography post-process: ${err.message}`);
      }
    }

    if (section.name === 'downloads') {
      try {
        const downloadsData = JSON.parse(readFileSync(DOWNLOADS_JSON, 'utf-8'));
        postProcessDownloads(
          resolve(sourceDir, 'index.md'),
          resolve(outputBase, 'index.md'),
          downloadsData,
        );
      } catch (err) {
        console.error(`[generate-raw-markdown] downloads post-process: ${err.message}`);
        errorCount++;
      }
    }

    if (section.name === 'functions-and-utilities') {
      try {
        const vueUtilitiesData = JSON.parse(readFileSync(VUE_UTILITIES_JSON, 'utf-8'));
        postProcessVueUtilities(resolve(outputBase, 'index.md'), vueUtilitiesData);
      } catch (err) {
        console.error(`[generate-raw-markdown] functions-and-utilities post-process: ${err.message}`);
        errorCount++;
      }
    }

    console.log(`[generate-raw-markdown] ${section.name}: ${successCount} generated, ${errorCount} errors`);
    totalSuccess += successCount;
    totalError += errorCount;
  }

  const rawBase = resolve(ROOT, 'docs/.vuepress/public/md');
  appendNavChildLinks(rawBase);

  // Build file index once for LLM discovery files
  const sectionFiles = {};
  for (const sectionName of Object.keys(SECTION_META)) {
    const sectionDir = resolve(rawBase, sectionName);
    if (existsSync(sectionDir)) {
      sectionFiles[sectionName] = walkDir(sectionDir, sectionDir).sort();
    }
  }
  generateLlmsTxt(rawBase, sectionFiles);
  generateLlmsFullTxt(rawBase, sectionFiles);

  console.log(`[generate-raw-markdown] Done: ${totalSuccess} total generated, ${totalError} total errors`);
}

main();
