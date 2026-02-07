/**
 * Transform utility class tables into markdown.
 *
 * Handles both patterns:
 * - <new-utility-class-table> — prefix extracted from `<script setup>` via
 *   `extractUtilityClasses(utilityClassDocs, 'PREFIX')`
 * - <utility-class-table> — prefix resolved from a static mapping keyed by
 *   file path (see utility-class-prefixes.mjs)
 *
 * Data source: dialtone-docs.json — { className: { values: [{ prop, value }] } }
 */

import { UTILITY_CLASS_MAPPING } from './utility-class-prefixes.mjs';
import { escapeTableCell } from './utils.mjs';

let utilityClassDocs = {};

export function setUtilityClassDocs (docs) {
  utilityClassDocs = docs || {};
}

/**
 * Look up classes matching the given prefixes and optional cssProperty filter.
 */
function filterClasses (prefixes, cssProperty, excludePrefixes) {
  return Object.entries(utilityClassDocs)
    .filter(([key]) => {
      const matchesPrefix = prefixes.some(p => key.startsWith(p));
      if (!matchesPrefix) return false;
      if (excludePrefixes?.length) {
        if (excludePrefixes.some(ep => key.startsWith(ep))) return false;
      }
      return true;
    })
    .filter(([, entry]) => {
      if (!cssProperty) return true;
      return entry.values.some(v => v.prop.includes(cssProperty));
    })
    .sort(([a], [b]) => a.localeCompare(b));
}

/**
 * Render a markdown table from filtered class entries.
 */
function renderTable (entries) {
  if (entries.length === 0) return [];

  const lines = [
    '| Class | Output |',
    '| --- | --- |',
  ];

  for (const [className, entry] of entries) {
    const outputs = entry.values
      .map(v => `${v.prop}: ${v.value}`)
      .join('; ');
    lines.push(`| \`${escapeTableCell(className)}\` | ${escapeTableCell(outputs)} |`);
  }

  return lines;
}

/**
 * Transform a <new-utility-class-table> by extracting the prefix from
 * the page's <script setup> content.
 *
 * @param {string} scriptContent - The full <script setup> block text
 * @returns {string[]} markdown lines
 */
export function transformNewUtilityClassTable (scriptContent) {
  const match = scriptContent?.match(/extractUtilityClasses\(\w+,\s*'([^']+)'\)/);
  if (!match) {
    return ['<!-- utility class table: could not extract prefix from script -->'];
  }
  const prefix = match[1];
  const entries = filterClasses([prefix]);
  if (entries.length === 0) {
    return [`<!-- utility class table: no classes found for prefix "${prefix}" -->`];
  }
  return renderTable(entries);
}

/**
 * Transform a <utility-class-table> (old pattern) by looking up the prefix
 * mapping for the given file path.
 *
 * @param {string} filePath - Absolute path to the source .md file
 * @param {string} utilitiesDir - Absolute path to docs/utilities/ directory
 * @returns {string[]} markdown lines
 */
export function transformOldUtilityClassTable (filePath, utilitiesDir) {
  if (!filePath || !utilitiesDir) {
    return ['<!-- utility class table: missing filePath or utilitiesDir -->'];
  }

  // Derive relative key: /path/to/utilities/spacing/margin.md → spacing/margin
  let relKey = filePath;
  const idx = relKey.indexOf('/utilities/');
  if (idx !== -1) {
    relKey = relKey.slice(idx + '/utilities/'.length);
  }
  relKey = relKey.replace(/\.md$/, '').replace(/\/index$/, '');

  const mapping = UTILITY_CLASS_MAPPING[relKey];
  if (!mapping) {
    return [`<!-- utility class table: no prefix mapping for "${relKey}" -->`];
  }

  const entries = filterClasses(mapping.prefixes, mapping.cssProperty, mapping.excludePrefixes);
  if (entries.length === 0) {
    return [`<!-- utility class table: no classes found for "${relKey}" -->`];
  }
  return renderTable(entries);
}
