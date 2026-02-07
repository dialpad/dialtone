#!/usr/bin/env node
/**
 * Generate raw GFM markdown versions of doc pages.
 *
 * Reads source .md files from multiple sections (components, foundations,
 * dialtone, ui-kits, guides, tokens, utilities), transforms them into clean
 * markdown (no Vue components), and writes them to docs/.vuepress/public/raw/{section}/.
 *
 * Usage:
 *   node scripts/generate-raw-markdown.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, basename, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseSourceMarkdown } from './lib/parse-source-markdown.mjs';
import { setComponentDocs } from './lib/transform-vue-api.mjs';
import { setUtilityClassDocs } from './lib/transform-utility-class-table.mjs';
import { setTokenDocs } from './lib/transform-tokens.mjs';
import { setIconKeywords, setIllustrationData } from './lib/transform-icon-catalog.mjs';
import { setTokensDocs, setColorUtilityClassDocs } from './lib/transform-color-tables.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');

const DATA_DIR = resolve(ROOT, 'docs/_data');
const PUBLIC_RAW = resolve(ROOT, 'docs/.vuepress/public/raw');
const UTILITIES_DIR = resolve(ROOT, 'docs/utilities');

// Data source paths
const COMPONENT_DOCS_JSON = resolve(ROOT, '../../packages/dialtone-vue/dist/component-documentation.json');
const UTILITY_DOCS_JSON = resolve(ROOT, '../../packages/dialtone-css/lib/dist/dialtone-docs.json');
const TOKEN_DOCS_JSON = resolve(ROOT, '../../packages/dialtone-tokens/dist/doc.json');
const ICON_KEYWORDS_JSON = resolve(ROOT, '../../packages/dialtone-icons/dist/keywords-icons.json');
const ILLUSTRATION_JSON = resolve(ROOT, 'docs/_data/svg-spot.json');
const TOKENS_DOCS_JSON = resolve(ROOT, '../../packages/dialtone-css/lib/dist/tokens-docs.json');

/**
 * Section configuration.
 * - flat: true  → read only top-level .md files, skip index.md (legacy components behavior)
 * - flat: false → recursively discover all .md files in nested directories
 */
const SECTIONS = [
  { name: 'components', sourceDir: 'docs/components', outputDir: 'raw/components', flat: true },
  { name: 'foundations', sourceDir: 'docs/foundations', outputDir: 'raw/foundations' },
  {
    name: 'dialtone',
    sourceDir: 'docs/dialtone',
    outputDir: 'raw/dialtone',
    overviewLinks: [
      '/components/',
      '/utilities/',
      '/tokens/',
      '/guides/content/',
      '/functions-and-utilities/',
    ],
  },
  { name: 'ui-kits', sourceDir: 'docs/ui-kits', outputDir: 'raw/ui-kits' },
  { name: 'guides', sourceDir: 'docs/guides', outputDir: 'raw/guides' },
  { name: 'tokens', sourceDir: 'docs/tokens', outputDir: 'raw/tokens' },
  { name: 'utilities', sourceDir: 'docs/utilities', outputDir: 'raw/utilities' },
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
    // "index.md" at section root → section root file
    if (dir === '.') return 'index.md';
    // "colors/index.md" → "colors.md"
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
 * After all files are generated for a non-flat section, scan the output
 * directory for any .md file whose stem matches a sibling subdirectory.
 * For each match, append a "## Pages" section linking to child files.
 *
 * Example: guides/content.md + guides/content/ → append links from content/ dir
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

    const children = readdirSync(subDir)
      .filter(f => f.endsWith('.md'))
      .sort();

    if (children.length === 0) continue;

    const links = children.map(f => {
      const content = readFileSync(resolve(subDir, f), 'utf-8');
      const titleMatch = content.match(/^title:\s*(.+)$/m);
      const title = titleMatch ? titleMatch[1] : basename(f, '.md');
      return `- [${title}](${stem}/${f})`;
    });

    const filePath = resolve(outputBase, entry);
    const existing = readFileSync(filePath, 'utf-8');
    writeFileSync(filePath, existing.trimEnd() + '\n\n## Pages\n\n' + links.join('\n') + '\n', 'utf-8');
  }
}

function main () {
  console.log('[generate-raw-markdown] Starting...');

  // Load all data sources
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

  let totalSuccess = 0;
  let totalError = 0;

  for (const section of SECTIONS) {
    const sourceDir = resolve(ROOT, section.sourceDir);
    const outputBase = resolve(ROOT, 'docs/.vuepress/public', section.outputDir);

    mkdirSync(outputBase, { recursive: true });

    let files;
    if (section.flat) {
      // Legacy flat mode: top-level .md files only, skip index.md
      files = readdirSync(sourceDir)
        .filter(f => f.endsWith('.md') && f !== 'index.md');
    } else {
      // Recursive mode: discover all .md files
      files = walkDir(sourceDir);
    }

    console.log(`[generate-raw-markdown] ${section.name}: found ${files.length} files`);

    let successCount = 0;
    let errorCount = 0;

    for (const relFile of files) {
      const sourcePath = resolve(sourceDir, relFile);
      const outputRelPath = section.flat ? relFile : mapOutputPath(relFile);
      const outputPath = resolve(outputBase, outputRelPath);

      // Ensure intermediate output directories exist
      mkdirSync(dirname(outputPath), { recursive: true });

      const slug = basename(relFile, '.md');

      try {
        const source = readFileSync(sourcePath, 'utf-8');
        const result = parseSourceMarkdown(source, {
          dataDir: DATA_DIR,
          filePath: sourcePath,
          utilitiesDir: UTILITIES_DIR,
        });
        writeFileSync(outputPath, result, 'utf-8');
        successCount++;
      } catch (err) {
        console.error(`[generate-raw-markdown] Error processing ${section.name}/${relFile}: ${err.message}`);
        errorCount++;
      }
    }

    // For flat sections, generate an index.md listing all component pages
    if (section.flat) {
      const srcIndex = resolve(sourceDir, 'index.md');
      try {
        const srcContent = readFileSync(srcIndex, 'utf-8');
        const titleMatch = srcContent.match(/^title:\s*(.+)$/m);
        const descMatch = srcContent.match(/^description:\s*(.+)$/m);
        const title = titleMatch?.[1] ?? section.name;
        const desc = descMatch?.[1] ?? '';

        const outputFiles = readdirSync(outputBase)
          .filter(f => f.endsWith('.md') && f !== 'index.md')
          .sort();
        const links = outputFiles.map(f => {
          const content = readFileSync(resolve(outputBase, f), 'utf-8');
          const fTitleMatch = content.match(/^title:\s*(.+)$/m);
          const fTitle = fTitleMatch ? fTitleMatch[1] : basename(f, '.md');
          return `- [${fTitle}](${f})`;
        });

        let indexContent = `# ${title}\n\n${desc}\n`;
        if (links.length > 0) {
          indexContent += '\n## Pages\n\n' + links.join('\n') + '\n';
        }
        writeFileSync(resolve(outputBase, 'index.md'), indexContent, 'utf-8');
      } catch (err) {
        console.warn(`[generate-raw-markdown] ${section.name}: could not generate index.md: ${err.message}`);
      }
    }

    // For non-flat sections, append child page links to the section root index.md
    if (!section.flat) {
      const indexPath = resolve(outputBase, 'index.md');
      const siblings = readdirSync(outputBase)
        .filter(f => f.endsWith('.md') && f !== 'index.md')
        .sort();
      if (siblings.length > 0) {
        const links = siblings.map(f => {
          const content = readFileSync(resolve(outputBase, f), 'utf-8');
          const titleMatch = content.match(/^title:\s*(.+)$/m);
          const title = titleMatch ? titleMatch[1] : basename(f, '.md');
          return `- [${title}](${f})`;
        });
        try {
          const indexContent = readFileSync(indexPath, 'utf-8');
          writeFileSync(indexPath, indexContent.trimEnd() + '\n\n## Pages\n\n' + links.join('\n') + '\n', 'utf-8');
        } catch (err) {
          console.warn(`[generate-raw-markdown] ${section.name}: could not append links to index.md: ${err.message}`);
        }
      }

      // Append child page links to any intermediate landing pages
      appendSubdirectoryLinks(outputBase);
    }

    // Append overview section links (e.g. Components, Utilities) to the index.md
    if (section.overviewLinks?.length) {
      const indexPath = resolve(outputBase, 'index.md');
      const links = [];
      for (const linkPath of section.overviewLinks) {
        // linkPath is like "/components/" → source at docs/components/index.md
        const srcDir = linkPath.replace(/^\/|\/$/g, '');
        const srcFile = resolve(ROOT, 'docs', srcDir, 'index.md');
        try {
          const content = readFileSync(srcFile, 'utf-8');
          const titleMatch = content.match(/^title:\s*(.+)$/m);
          const descMatch = content.match(/^description:\s*(.+)$/m);
          const title = titleMatch?.[1] ?? srcDir;
          const desc = descMatch?.[1] ?? '';
          links.push(desc ? `- [${title}](${linkPath}) — ${desc}` : `- [${title}](${linkPath})`);
        } catch {
          links.push(`- [${srcDir}](${linkPath})`);
        }
      }
      try {
        const indexContent = readFileSync(indexPath, 'utf-8');
        writeFileSync(indexPath, indexContent.trimEnd() + '\n\n## Sections\n\n' + links.join('\n') + '\n', 'utf-8');
      } catch (err) {
        console.warn(`[generate-raw-markdown] ${section.name}: could not append sections to index.md: ${err.message}`);
      }
    }

    console.log(`[generate-raw-markdown] ${section.name}: ${successCount} generated, ${errorCount} errors`);
    totalSuccess += successCount;
    totalError += errorCount;
  }

  console.log(`[generate-raw-markdown] Done: ${totalSuccess} total generated, ${totalError} total errors`);
}

main();
