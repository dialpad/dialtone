/**
 * Transform <icon-catalog> and <icons illustration> into markdown.
 *
 * Icon data: packages/dialtone-icons/dist/keywords-icons.json
 *   { categories: { "alerts": { "alert-circle": ["warning", "caution"], ... }, ... } }
 *
 * Illustration data: docs/_data/svg-spot.json
 *   [{ name, file, vue, desc }, ...]
 */

import { escapeTableCell, capitalize } from './utils.mjs';

let iconKeywords = null;
let illustrationData = null;

export function setIconKeywords (data) {
  iconKeywords = data || null;
}

export function setIllustrationData (data) {
  illustrationData = data || null;
}

/**
 * Render the icon catalog grouped by category.
 * Each icon shows its name, keywords, and usage snippets.
 * @returns {string[]}
 */
export function transformIconCatalog () {
  if (!iconKeywords?.categories) {
    return ['<!-- icon-catalog: icon data not loaded -->'];
  }

  const lines = [];

  lines.push('## Usage', '');
  lines.push('Icons can be used via Vue components or SVG sprites:', '');
  lines.push('**Vue (recommended, tree-shakeable):**');
  lines.push('```html');
  lines.push('<dt-icon-{icon-name} size="500" />');
  lines.push('```');
  lines.push('');
  lines.push('**Vue (deprecated, not tree-shakeable):**');
  lines.push('```html');
  lines.push('<dt-icon name="{icon-name}" size="500" />');
  lines.push('```');
  lines.push('');
  lines.push('Available sizes: 100, 200, 300, 400, 500 (default), 600, 700, 800.', '');

  const categories = iconKeywords.categories;
  let totalIcons = 0;

  for (const [category, icons] of Object.entries(categories)) {
    const iconNames = Object.keys(icons).sort();
    totalIcons += iconNames.length;

    lines.push(`## ${capitalize(category)}`, '');
    lines.push('| Icon | Keywords |');
    lines.push('| --- | --- |');

    for (const name of iconNames) {
      const kw = icons[name];
      const keywords = Array.isArray(kw) ? kw.join(', ') : '';
      lines.push(`| ${name} | ${escapeTableCell(keywords)} |`);
    }
    lines.push('');
  }

  lines.push(`*${totalIcons} icons across ${Object.keys(categories).length} categories.*`, '');

  return lines;
}

/**
 * Render the illustration catalog as a table.
 * @returns {string[]}
 */
export function transformIllustrationCatalog () {
  if (!illustrationData || !Array.isArray(illustrationData)) {
    return ['<!-- illustrations: illustration data not loaded -->'];
  }

  const lines = [];
  lines.push('| Name | Vue Component | Description |');
  lines.push('| --- | --- | --- |');

  for (const item of illustrationData) {
    const name = item.name || '';
    const vue = item.vue ? `\`<${item.vue} />\`` : '';
    const desc = item.desc || '';
    lines.push(`| ${escapeTableCell(name)} | ${vue} | ${escapeTableCell(desc)} |`);
  }

  return lines;
}
