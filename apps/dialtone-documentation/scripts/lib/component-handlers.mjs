/**
 * Registry of inline Vue component handlers for the markdown parser.
 *
 * Each handler defines { match, handle, closingTags } to detect and
 * transform a specific Vue component tag into markdown output.
 *
 * Also provides shared helpers: consumeUntilClose and parseFrontmatterField.
 */

import { transformVueApi } from './transform-vue-api.mjs';
import { transformClassTable, transformAccessibleTable } from './transform-class-table.mjs';
import {
  transformDesignColorTable,
  transformThemeColorTable,
  transformColorsCatalog,
  parseExclusionList,
} from './transform-color-tables.mjs';
import { transformAllTokens } from './transform-tokens.mjs';
import { transformIconCatalog, transformIllustrationCatalog } from './transform-icon-catalog.mjs';

/**
 * Advance past lines until a closing tag is found.
 * If the current line is already self-closing or contains the closing tag, returns i unchanged.
 *
 * @param {string[]} lines - All source lines
 * @param {number} i - Current line index
 * @param {string} trimmed - Current line trimmed
 * @param {...string} closingTags - One or more closing tags to match (e.g. '</DesignColorTable>')
 * @returns {number} - Updated line index
 */
export function consumeUntilClose (lines, i, trimmed, ...closingTags) {
  // Check if already closed on the same line
  if (trimmed.endsWith('/>')) return i;
  for (const tag of closingTags) {
    if (trimmed.includes(tag)) return i;
  }
  // Advance until we find a closing tag
  while (i + 1 < lines.length) {
    i++;
    const t = lines[i].trim();
    for (const tag of closingTags) {
      if (t.includes(tag) || t === tag) return i;
    }
  }
  return i;
}

/**
 * Extract a frontmatter field value, stripping surrounding quotes.
 *
 * @param {string} trimmed - A trimmed frontmatter line
 * @param {string} field - Field name (e.g. 'title', 'description')
 * @returns {string|null} - Extracted value or null if no match
 */
export function parseFrontmatterField (trimmed, field) {
  const match = trimmed.match(new RegExp(`^${field}:\\s*(.+)`));
  if (!match) return null;
  return match[1].replace(/^['"]|['"]$/g, '').trim();
}

/**
 * Registry of inline component handlers.
 * Each entry: { match(trimmed) → matchResult|null, handle(matchResult, ctx) → string[], closingTags }
 *
 * ctx contains: { dataDir, scriptSetupContent, lines, i, trimmed }
 */
export const INLINE_HANDLERS = [
  // <component-vue-api component-name="X" />
  {
    match: (trimmed) => trimmed.match(/<component-vue-api\s+component-name="([^"]+)"/),
    handle: (m, ctx) => {
      const tag = ctx.trimmed;
      const showImport = !tag.includes(':show-import="false"');
      const alsoMatch = tag.match(/:also-import="\[([^\]]*)\]"/);
      const alsoImport = alsoMatch
        ? alsoMatch[1].split(',').map(s => s.trim().replace(/^'|'$/g, ''))
        : [];
      return transformVueApi(m[1], { showImport, alsoImport });
    },
    closingTags: ['</component-vue-api>'],
  },

  // <component-class-table component-name="X">
  {
    match: (trimmed) => trimmed.match(/<component-class-table\s+component-name="([^"]+)"/),
    handle: (m, ctx) => transformClassTable(m[1], ctx.dataDir),
    closingTags: ['</component-class-table>'],
  },

  // <component-accessible-table component-name="X">
  {
    match: (trimmed) => trimmed.match(/<component-accessible-table\s+component-name="([^"]+)"/),
    handle: (m, ctx) => transformAccessibleTable(m[1], ctx.dataDir),
    closingTags: ['</component-accessible-table>'],
  },

  // <DesignColorTable class-prefix="..." :excluded-colors="varName">
  {
    match: (trimmed) => trimmed.startsWith('<DesignColorTable') ? trimmed : null,
    handle: (trimmed, ctx) => {
      const prefixMatch = trimmed.match(/class-prefix="([^"]+)"/);
      const classPrefix = prefixMatch ? prefixMatch[1] : '';
      const excludeMatch = trimmed.match(/:excluded-colors="([^"]+)"/);
      const excludedColors = excludeMatch
        ? parseExclusionList(ctx.scriptSetupContent, excludeMatch[1])
        : [];
      return transformDesignColorTable(classPrefix, excludedColors);
    },
    closingTags: ['</DesignColorTable>'],
  },

  // <ThemeColorTable>
  {
    match: (trimmed) => trimmed.startsWith('<ThemeColorTable') ? trimmed : null,
    handle: () => transformThemeColorTable(),
    closingTags: ['</ThemeColorTable>'],
  },

  // <ColorsCatalog mode="light">
  {
    match: (trimmed) => trimmed.startsWith('<ColorsCatalog') ? trimmed : null,
    handle: (trimmed) => {
      const modeMatch = trimmed.match(/mode="([^"]+)"/);
      const mode = modeMatch ? modeMatch[1] : 'light';
      return transformColorsCatalog(mode);
    },
    closingTags: ['</ColorsCatalog>'],
  },

  // <all-tokens />
  {
    match: (trimmed) => trimmed.startsWith('<all-tokens') ? trimmed : null,
    handle: () => transformAllTokens(),
    closingTags: ['</all-tokens>'],
  },

  // <icon-catalog>
  {
    match: (trimmed) => trimmed.startsWith('<icon-catalog') ? trimmed : null,
    handle: () => transformIconCatalog(),
    closingTags: ['</icon-catalog>'],
  },

  // <icons illustration>
  {
    match: (trimmed) =>
      (trimmed.startsWith('<icons ') && trimmed.includes('illustration')) ? trimmed : null,
    handle: () => transformIllustrationCatalog(),
    closingTags: ['</icons>'],
  },
];
