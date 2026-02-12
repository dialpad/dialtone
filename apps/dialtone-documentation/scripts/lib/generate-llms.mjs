/**
 * Generate llms.txt and llms-full.txt — LLM discovery files.
 *
 * llms.txt: Structured index of all documentation pages with titles and descriptions.
 * llms-full.txt: Full concatenation of all documentation pages.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, basename } from 'node:path';

const BASE_URL = 'https://dialtone.dialpad.com';

/**
 * Section display order and labels for llms.txt.
 */
export const SECTION_META = {
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
    // Skip Vue/HTML attribute remnants (e.g. kind="warning", :hideClose="true")
    if (/^:?\w+="/.test(trimmed)) continue;
    // Skip HTML/Vue tag lines and closing angle brackets from multi-line tags
    if (/^<\/?[a-zA-Z]/.test(trimmed) || trimmed === '>') continue;
    // Skip bare placeholder text
    if (trimmed === 'Description') continue;
    // Strip inline HTML/Vue tags but preserve markdown autolinks (<https://...>)
    description = trimmed.replace(/<(?!https?:\/\/)[^>]*>/g, '').trim();
    if (!description) continue;
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
 * @param {string} sectionName
 * @param {string} relFile
 * @param {string} sectionDir
 * @param {Map<string,{title:string,description:string}>} [cache] - Optional pre-built cache
 */
function llmsTxtEntry (sectionName, relFile, sectionDir, cache) {
  const { title, description } = cache
    ? cache.get(relFile)
    : extractTitleAndDescription(resolve(sectionDir, relFile));
  const url = `${BASE_URL}/md/${sectionName}/${relFile}`;
  const descSuffix = description ? `: ${description}` : '';
  return `- [${title}](${url})${descSuffix}`;
}

/**
 * Generate llms.txt — a structured index of all documentation pages.
 *
 * Sections with subdirectory hierarchy render parent pages as top-level entries
 * and group child pages under H3 sub-headings. Flat sections are unchanged.
 *
 * @param {string} mdBase - Absolute path to the md/ output directory
 * @param {Object<string, string[]>} sectionFiles - Pre-built map of section → sorted relative file paths
 */
export function generateLlmsTxt (mdBase, sectionFiles) {
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
    const files = sectionFiles[sectionName];
    if (!files || files.length === 0) continue;

    const sectionDir = resolve(mdBase, sectionName);

    // Build title/description cache — read each file once for this section
    const cache = new Map();
    for (const relFile of files) {
      cache.set(relFile, extractTitleAndDescription(resolve(sectionDir, relFile)));
    }

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
      const sorted = [...files].sort((a, b) => {
        if (basename(a) === 'index.md') return -1;
        if (basename(b) === 'index.md') return 1;
        return a.localeCompare(b);
      });
      for (const relFile of sorted) {
        lines.push(llmsTxtEntry(sectionName, relFile, sectionDir, cache));
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
      const { title: fTitle } = cache.get(f);
      const fWord = fTitle.split(/\s+/)[0].toLowerCase();
      for (const pf of parentEntries) {
        const dirName = basename(pf, '.md');
        const { title: pTitle } = cache.get(pf);
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
      const { title: parentTitle } = cache.get(relFile);
      lines.push(`### ${parentTitle}`, '');
      lines.push(llmsTxtEntry(sectionName, relFile, sectionDir, cache));
      for (const af of (adoptedByDir[stem] ?? []).sort()) {
        lines.push(llmsTxtEntry(sectionName, af, sectionDir, cache));
      }
      for (const child of children) {
        lines.push(llmsTxtEntry(sectionName, child, sectionDir, cache));
      }
      lines.push('');
    }

    // Phase 2 — Orphan directory groups (no parent .md)
    for (const dirName of orphanDirs) {
      lines.push(`### ${titleCase(dirName)}`, '');
      for (const child of nested[dirName]) {
        lines.push(llmsTxtEntry(sectionName, child, sectionDir, cache));
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
        lines.push(llmsTxtEntry(sectionName, relFile, sectionDir, cache));
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
 *
 * @param {string} mdBase - Absolute path to the md/ output directory
 * @param {Object<string, string[]>} sectionFiles - Pre-built map of section → sorted relative file paths
 */
export function generateLlmsFullTxt (mdBase, sectionFiles) {
  const parts = [];
  const sectionOrder = Object.keys(SECTION_META);

  for (const sectionName of sectionOrder) {
    const files = sectionFiles[sectionName];
    if (!files || files.length === 0) continue;

    const sectionDir = resolve(mdBase, sectionName);

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
