#!/usr/bin/env node
/**
 * Generate raw GFM markdown versions of doc pages.
 *
 * Reads source .md files from multiple sections (components, foundations,
 * dialtone, ui-kits, guides, tokens, utilities), transforms them into clean
 * markdown (no Vue components), and writes them to docs/.vuepress/public/md/{section}/.
 *
 * Usage:
 *   node scripts/generate-raw-markdown.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, basename, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseSourceMarkdown } from './lib/parse-source-markdown.mjs';
import { rewriteAbsoluteLinks, resolveRawLink } from './lib/utils.mjs';
import { setComponentDocs } from './lib/transform-vue-api.mjs';
import { setUtilityClassDocs } from './lib/transform-utility-class-table.mjs';
import { setTokenDocs } from './lib/transform-tokens.mjs';
import { setIconKeywords, setIllustrationData } from './lib/transform-icon-catalog.mjs';
import { setTokensDocs, setColorUtilityClassDocs } from './lib/transform-color-tables.mjs';

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
  { name: 'ui-kits', sourceDir: 'docs/ui-kits', outputDir: 'md/ui-kits' },
  { name: 'guides', sourceDir: 'docs/guides', outputDir: 'md/guides' },
  { name: 'tokens', sourceDir: 'docs/tokens', outputDir: 'md/tokens' },
  { name: 'utilities', sourceDir: 'docs/utilities', outputDir: 'md/utilities', navSection: '/utilities/' },
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
 * Append a "## Pages" section to a file from an array of markdown link lines.
 */
function appendPagesSection (filePath, links) {
  const existing = readFileSync(filePath, 'utf-8');
  writeFileSync(filePath, existing.trimEnd() + '\n\n## Pages\n\n' + links.join('\n') + '\n', 'utf-8');
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
function loadNavCategories (navSection) {
  const navData = loadJson(resolve(DATA_DIR, 'site-nav.json'), 'site-nav.json');
  return navData?.topLevelGroups?.dialtone?.sections?.[navSection]?.[0]?.children ?? null;
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
    const indexContent = readFileSync(indexPath, 'utf-8');
    writeFileSync(indexPath, indexContent.trimEnd() + '\n\n## Pages\n\n' + lines.join('\n').trimEnd() + '\n', 'utf-8');
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
    const indexContent = readFileSync(indexPath, 'utf-8');
    writeFileSync(indexPath, indexContent.trimEnd() + '\n\n## Sections\n\n' + links.join('\n') + '\n', 'utf-8');
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
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    const fm = fmMatch ? fmMatch[1] : '';
    const titleMatch = fm.match(/^title:\s*(.+)$/m);
    const title = titleMatch ? titleMatch[1] : basename(f, '.md');
    const statusMatch = fm.match(/^status:\s*(.+)$/m);
    const storybookMatch = fm.match(/^storybook:\s*(.+)$/m);
    const figmaMatch = fm.match(/^figma_url:\s*(.+)$/m) || fm.match(/^figma:\s*(.+)$/m);
    const css = componentStatus(statusMatch?.[1]);
    const vue = componentStatus(storybookMatch?.[1]);
    const figma = componentStatus(figmaMatch?.[1]);
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
 * Build a child link line from a nav child entry, reading the raw file for its title.
 */
function buildNavChildLink (child, parentDir, rawBase) {
  const childRel = relative(parentDir, child.link.replace(/^\/|\/$/g, '')) + '.md';
  const childFile = resolve(rawBase, child.link.replace(/^\/|\/$/g, '') + '.md');
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
  const parentFile = resolve(rawBase, entry.link.replace(/^\/|\/$/g, '') + '.md');
  let parentContent;
  try { parentContent = readFileSync(parentFile, 'utf-8'); } catch { return; }
  if (parentContent.includes('\n## Pages\n')) return;

  const parentDir = dirname(entry.link.replace(/^\/|\/$/g, ''));
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
  let navData;
  try {
    navData = JSON.parse(readFileSync(resolve(DATA_DIR, 'site-nav.json'), 'utf-8'));
  } catch { return; }

  function walk (entries) {
    if (!entries) return;
    for (const entry of entries) {
      tryAppendNavChildren(entry, rawBase);
      if (entry.children) walk(entry.children);
    }
  }

  const sections = navData?.topLevelGroups?.dialtone?.sections;
  if (!sections) return;
  for (const sectionEntries of Object.values(sections)) {
    walk(sectionEntries);
  }
}

const BASE_URL = 'https://dialtone.dialpad.com';

/**
 * Section display order and labels for llms.txt.
 */
const SECTION_META = {
  components: 'Components',
  utilities: 'Utilities',
  foundations: 'Foundations',
  tokens: 'Tokens',
  guides: 'Guides',
  dialtone: 'Dialtone',
  'ui-kits': 'UI Kits',
};

/**
 * Extract the first heading and first non-empty paragraph from a markdown file.
 */
function extractTitleAndDescription (filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : basename(filePath, '.md');

  // Find first non-empty line after the title that isn't a metadata bullet or heading
  const lines = content.split('\n');
  let description = '';
  let pastTitle = false;
  for (const line of lines) {
    if (!pastTitle) {
      if (/^#\s+/.test(line)) pastTitle = true;
      continue;
    }
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Skip metadata lines (- **Key**: value) and headings
    if (/^- \*\*/.test(trimmed) || /^#/.test(trimmed)) continue;
    description = trimmed;
    break;
  }

  return { title, description };
}

/**
 * Title-case a slug: "box-shadow" → "Box Shadow"
 */
function titleCase (slug) {
  return slug.replace(/(^|-)(\w)/g, (_, sep, ch) => (sep ? ' ' : '') + ch.toUpperCase());
}

/**
 * Build a single llms.txt list entry for a file.
 */
function llmsTxtEntry (sectionName, relFile, sectionDir) {
  const filePath = resolve(sectionDir, relFile);
  const { title, description } = extractTitleAndDescription(filePath);
  const url = `${BASE_URL}/md/${sectionName}/${relFile}`;
  const descSuffix = description ? `: ${description}` : '';
  return `- [${title}](${url})${descSuffix}`;
}

/**
 * Generate llms.txt — a structured index of all documentation pages.
 *
 * Sections with subdirectory hierarchy render parent pages as top-level entries
 * and group child pages under H3 sub-headings. Flat sections are unchanged.
 */
function generateLlmsTxt (mdBase) {
  const lines = [
    '# Dialtone Design System',
    '',
    '> Dialpad\'s design system: Vue components, CSS utilities, design tokens, and icons for consistent, accessible product experiences.',
    '',
    `Docs: ${BASE_URL}`,
    '',
  ];

  const sectionOrder = Object.keys(SECTION_META);

  for (const sectionName of sectionOrder) {
    const sectionDir = resolve(mdBase, sectionName);
    if (!existsSync(sectionDir)) continue;

    const files = walkDir(sectionDir, sectionDir).sort();

    if (files.length === 0) continue;

    lines.push(`## ${SECTION_META[sectionName]}`, '');

    // Identify parent/child relationships.
    // A top-level file "foo.md" with a sibling directory "foo/" is a parent;
    // files inside "foo/" (at any depth) are its children.
    const topLevel = []; // files with no directory component (e.g. "brand.md")
    const nested = {};   // dirName → [relFile, …]

    for (const relFile of files) {
      const parts = relFile.split('/');
      if (parts.length === 1) {
        topLevel.push(relFile);
      } else {
        const dirName = parts[0];
        (nested[dirName] ??= []).push(relFile);
      }
    }

    const hasHierarchy = Object.keys(nested).length > 0;

    if (!hasHierarchy) {
      // Flat section — index.md first, then alphabetical
      files.sort((a, b) => {
        if (basename(a) === 'index.md') return -1;
        if (basename(b) === 'index.md') return 1;
        return a.localeCompare(b);
      });
      for (const relFile of files) {
        lines.push(llmsTxtEntry(sectionName, relFile, sectionDir));
      }
      lines.push('');
      continue;
    }

    // Determine which top-level files are parents (have a matching subdirectory)
    const parentFiles = new Set();
    for (const f of topLevel) {
      const stem = basename(f, '.md');
      if (nested[stem]) parentFiles.add(f);
    }

    const orphanDirs = Object.keys(nested)
      .filter(d => !topLevel.includes(d + '.md'))
      .sort();

    // Phase 1 — H3 groups with parent files: parent page as first entry, then children
    const parentEntries = topLevel.filter(f => parentFiles.has(f)).sort();

    // Adopt standalone files whose title shares the first word with a parent
    // group's title (e.g. "Type" matches "Type in Product" → typography group)
    const adopted = new Set();
    const adoptedByDir = {};
    for (const f of topLevel) {
      if (parentFiles.has(f)) continue;
      const { title: fTitle } = extractTitleAndDescription(resolve(sectionDir, f));
      const fWord = fTitle.split(/\s+/)[0].toLowerCase();
      for (const pf of parentEntries) {
        const dirName = basename(pf, '.md');
        const { title: pTitle } = extractTitleAndDescription(resolve(sectionDir, pf));
        if (fWord === pTitle.split(/\s+/)[0].toLowerCase()) {
          adopted.add(f);
          (adoptedByDir[dirName] ??= []).push(f);
          break;
        }
      }
    }

    for (const relFile of parentEntries) {
      const stem = basename(relFile, '.md');
      const children = nested[stem];
      const parentPath = resolve(sectionDir, relFile);
      const { title: parentTitle } = extractTitleAndDescription(parentPath);
      lines.push(`### ${parentTitle}`, '');
      lines.push(llmsTxtEntry(sectionName, relFile, sectionDir));
      for (const af of (adoptedByDir[stem] ?? []).sort()) {
        lines.push(llmsTxtEntry(sectionName, af, sectionDir));
      }
      for (const child of children) {
        lines.push(llmsTxtEntry(sectionName, child, sectionDir));
      }
      lines.push('');
    }

    // Phase 2 — Orphan directory groups (no parent .md)
    for (const dirName of orphanDirs) {
      lines.push(`### ${titleCase(dirName)}`, '');
      for (const child of nested[dirName]) {
        lines.push(llmsTxtEntry(sectionName, child, sectionDir));
      }
      lines.push('');
    }

    // Phase 3 — Standalone files (no matching subdirectory), index.md first
    const standalone = topLevel
      .filter(f => !parentFiles.has(f) && !adopted.has(f))
      .sort((a, b) => {
        if (basename(a) === 'index.md') return -1;
        if (basename(b) === 'index.md') return 1;
        return a.localeCompare(b);
      });
    if (standalone.length > 0) {
      for (const relFile of standalone) {
        lines.push(llmsTxtEntry(sectionName, relFile, sectionDir));
      }
      lines.push('');
    }

    // Ensure section ends with a blank line
    if (lines[lines.length - 1] !== '') lines.push('');
  }

  const outputPath = resolve(mdBase, '..', 'llms.txt');
  writeFileSync(outputPath, lines.join('\n'), 'utf-8');
  console.log(`[generate-raw-markdown] Generated llms.txt`);
}

/**
 * Generate llms-full.txt — full concatenation of all documentation pages.
 */
function generateLlmsFullTxt (mdBase) {
  const parts = [];
  const sectionOrder = Object.keys(SECTION_META);

  for (const sectionName of sectionOrder) {
    const sectionDir = resolve(mdBase, sectionName);
    if (!existsSync(sectionDir)) continue;

    const files = walkDir(sectionDir, sectionDir).sort();

    for (const relFile of files) {
      const filePath = resolve(sectionDir, relFile);
      const content = readFileSync(filePath, 'utf-8');
      const fileRef = `${sectionName}/${relFile}`;
      const url = `${BASE_URL}/md/${fileRef}`;

      parts.push(
        '---',
        `file: ${fileRef}`,
        `url: ${url}`,
        '---',
        '',
        content.trimEnd(),
        '',
      );
    }
  }

  const outputPath = resolve(mdBase, '..', 'llms-full.txt');
  writeFileSync(outputPath, parts.join('\n'), 'utf-8');
  console.log(`[generate-raw-markdown] Generated llms-full.txt`);
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

    console.log(`[generate-raw-markdown] ${section.name}: ${successCount} generated, ${errorCount} errors`);
    totalSuccess += successCount;
    totalError += errorCount;
  }

  const rawBase = resolve(ROOT, 'docs/.vuepress/public/md');
  appendNavChildLinks(rawBase);

  // Generate LLM discovery files
  generateLlmsTxt(rawBase);
  generateLlmsFullTxt(rawBase);

  console.log(`[generate-raw-markdown] Done: ${totalSuccess} total generated, ${totalError} total errors`);
}

main();
