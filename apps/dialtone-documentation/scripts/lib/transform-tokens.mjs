/**
 * Transform <all-tokens /> into categorized markdown tables.
 *
 * Data source: packages/dialtone-tokens/dist/doc.json
 * Uses the dp-light theme, css/variables format.
 *
 * Groups tokens by category (first path segment) and subcategory (second segment),
 * rendering H2 per category and H3 per subcategory with a table of token names + values.
 */

let tokenDocs = null;

export function setTokenDocs (docs) {
  tokenDocs = docs || null;
}

/**
 * Render the full token catalog as markdown lines.
 * @returns {string[]}
 */
export function transformAllTokens () {
  if (!tokenDocs) {
    return ['<!-- all-tokens: token data not loaded -->'];
  }

  const theme = tokenDocs['dp-light'];
  if (!theme) {
    return ['<!-- all-tokens: dp-light theme not found -->'];
  }

  // Group by category/subcategory
  // Token paths look like: "color/foreground/primary", "size/border/focus"
  const categories = new Map();

  for (const [tokenPath, formats] of Object.entries(theme)) {
    const cssVar = formats['css/variables'];
    if (!cssVar) continue;

    const parts = tokenPath.split('/');
    const category = parts[0] || 'other';
    const subcategory = parts.length > 2 ? parts[1] : 'general';
    const tokenName = cssVar.name; // e.g. var(--dt-color-foreground-primary)
    const tokenValue = cssVar.value; // e.g. #1C1C1C

    if (!categories.has(category)) {
      categories.set(category, new Map());
    }
    const subcats = categories.get(category);
    if (!subcats.has(subcategory)) {
      subcats.set(subcategory, []);
    }
    subcats.get(subcategory).push({ name: tokenName, value: tokenValue });
  }

  const lines = [];

  for (const [category, subcats] of categories) {
    lines.push(`## ${capitalize(category)}`, '');

    for (const [subcategory, tokens] of subcats) {
      lines.push(`### ${capitalize(subcategory)}`, '');
      lines.push('| Token | Value |');
      lines.push('| --- | --- |');

      for (const token of tokens) {
        const val = token.value || '';
        lines.push(`| \`${token.name}\` | ${escapeCell(val)} |`);
      }
      lines.push('');
    }
  }

  return lines;
}

function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeCell (text) {
  return text.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
}
