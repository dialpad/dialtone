/**
 * Transform <all-tokens /> into categorized markdown tables.
 *
 * Data source: packages/dialtone-tokens/dist/doc.json
 * Merges base + theme tokens for each mode (matching the Vue component logic
 * in docs/.vuepress/baseComponents/tokens/utilities.js:21).
 *
 * Outputs both Light and Dark mode sections with categorized token tables.
 * Descriptions are included when available.
 */

import { escapeTableCell, capitalize } from './utils.mjs';

let tokenDocs = null;

export function setTokenDocs (docs) {
  tokenDocs = docs || null;
}

/**
 * Group theme tokens by category → subcategory.
 * Filters out base/root tokens and deprecated space tokens.
 * Returns Map<string, Map<string, {name, value, description}[]>>.
 */
function groupTokensByCategory (theme) {
  const categories = new Map();
  for (const [tokenPath, formats] of Object.entries(theme)) {
    const cssVar = formats['css/variables'];
    if (!cssVar) continue;

    // Filter base/root tokens (matches utilities.js:210)
    if (tokenPath.endsWith('base') || tokenPath.endsWith('root')) continue;

    // Filter deprecated space tokens (matches utilities.js:202)
    if (tokenPath.startsWith('space')) continue;

    const parts = tokenPath.split('/');
    const category = parts[0] || 'other';
    const subcategory = parts.length > 2 ? parts[1] : 'general';

    if (!categories.has(category)) categories.set(category, new Map());
    const subcats = categories.get(category);
    if (!subcats.has(subcategory)) subcats.set(subcategory, []);
    subcats.get(subcategory).push({
      name: cssVar.name,
      value: cssVar.value != null ? String(cssVar.value) : '',
      description: cssVar.description || '',
    });
  }
  return categories;
}

/**
 * Render the full token catalog as markdown lines.
 * Outputs both light and dark mode sections.
 * @returns {string[]}
 */
export function transformAllTokens () {
  if (!tokenDocs) return ['<!-- all-tokens: token data not loaded -->'];

  const modes = [
    { label: 'Light', base: 'base-light', theme: 'dp-light' },
    { label: 'Dark', base: 'base-dark', theme: 'dp-dark' },
  ];

  const lines = [];
  for (const mode of modes) {
    const combined = { ...(tokenDocs[mode.base] || {}), ...(tokenDocs[mode.theme] || {}) };
    if (!Object.keys(combined).length) continue;

    lines.push(`## ${mode.label} mode`, '');
    const categories = groupTokensByCategory(combined);
    for (const [category, subcats] of categories) {
      lines.push(`### ${capitalize(category)}`, '');
      for (const [subcategory, tokens] of subcats) {
        lines.push(`#### ${capitalize(subcategory)}`, '');

        const hasDescriptions = tokens.some(t => t.description);
        if (hasDescriptions) {
          lines.push('| Token | Description | Value |');
          lines.push('| --- | --- | --- |');
          for (const token of tokens) {
            lines.push(`| \`${token.name}\` | ${escapeTableCell(token.description)} | ${escapeTableCell(token.value || '')} |`);
          }
        } else {
          lines.push('| Token | Value |');
          lines.push('| --- | --- |');
          for (const token of tokens) {
            lines.push(`| \`${token.name}\` | ${escapeTableCell(token.value || '')} |`);
          }
        }
        lines.push('');
      }
    }
  }

  return lines;
}
