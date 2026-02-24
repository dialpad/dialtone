/**
 * Transforms for color-related Vue components:
 * - <DesignColorTable> — semantic color tables (foreground, surface, border)
 * - <ThemeColorTable> — shell theme color table
 * - <ColorsCatalog> — base color palette grouped by color name
 */

import { escapeTableCell, capitalize } from './utils.mjs';

let tokensDocs = {};
let utilityClassDocs = {};

export function setTokensDocs (data) { tokensDocs = data || {}; }
export function setColorUtilityClassDocs (data) { utilityClassDocs = data || {}; }

/**
 * Extract the CSS variable name from a utility class's value.
 * Matches the logic of extractCSSVariableName in utilities.js.
 */
function extractCSSVariableName (propValue) {
  const value = propValue?.values?.[0]?.value;
  if (!value) return undefined;
  const match = value.match(/var\((--[\w-]+)\)/);
  if (!match) return undefined;
  return match[1].replace(/(-(h|s|c|l|a|hsl|hsla|oklch|oklcha))$/, '');
}

/**
 * Test if a class name is a base color class (e.g. d-fc-black-300).
 */
function isBaseColorClass (className) {
  return /d-(bgc|fc|bc|bgg)-\w+-\d{2,4}$/.test(className);
}

/**
 * Transform <DesignColorTable> into a markdown table.
 *
 * @param {string} classPrefix - e.g. "d-fc-", "d-bgc-", "d-bc-"
 * @param {string[]} excludedColors - color substrings to exclude
 * @returns {string[]}
 */
export function transformDesignColorTable (classPrefix, excludedColors = []) {
  const filteredClasses = Object.keys(utilityClassDocs)
    .filter(className =>
      className.startsWith(classPrefix) &&
      !excludedColors.some(color => className.includes(color)) &&
      !isBaseColorClass(className),
    )
    .sort();

  if (filteredClasses.length === 0) {
    return ['<!-- No color classes found for prefix "' + classPrefix + '" -->'];
  }

  const output = [];
  output.push('| Color | CSS Variable | CSS Utility |');
  output.push('| --- | --- | --- |');

  for (const className of filteredClasses) {
    const tokenName = extractCSSVariableName(utilityClassDocs[className]);
    const colorName = className.replace(classPrefix, '').replace(/-/g, ' ');
    const token = tokensDocs[tokenName]?.['dp-light'];
    const desc = token?.description ? ` — ${token.description}` : '';

    output.push(`| ${escapeTableCell(colorName)}${desc} | ${tokenName ? `\`var(${tokenName})\`` : '-'} | \`${className}\` |`);
  }

  output.push('');
  return output;
}

/**
 * Derive the CSS property from a shell token name.
 */
function getTokenProperty (token) {
  if (token.includes('foreground')) return 'color';
  if (['background', 'surface', 'presence', 'logo'].some(s => token.includes(s))) return 'background-color';
  if (token.includes('border')) return 'border-color';
  return '-';
}

/**
 * Extract state(s) from a shell token name.
 */
function getTokenStates (token) {
  const states = {
    hovering: token.endsWith('-hover'),
    pressing: token.endsWith('-active'),
    inverted: token.includes('inverted'),
    unread: token.endsWith('-unread'),
    selected: token.includes('selected'),
    available: token.endsWith('-available'),
    'actively busy': token.endsWith('-busy-unavailable'),
    busy: token.endsWith('-busy'),
  };

  return Object.keys(states).filter(state => states[state]).join(', ') || 'resting';
}

/**
 * Transform <ThemeColorTable> into a markdown table.
 * Filters tokens-docs for --dt-shell-* keys.
 *
 * @returns {string[]}
 */
export function transformThemeColorTable () {
  const excludedPrefixes = ['--dt-shell-base'];
  const themeTokens = Object.keys(tokensDocs)
    .filter(token =>
      /--dt-shell-(\w+)-.+/.test(token) &&
      !/-(h|s|l|a|hsl|hsla)$/.test(token) &&
      !excludedPrefixes.some(excluded => token.startsWith(excluded)),
    )
    .sort();

  if (themeTokens.length === 0) {
    return ['<!-- No theme color tokens found -->'];
  }

  const output = [];
  output.push('| Section | State | Property | Variable |');
  output.push('| --- | --- | --- | --- |');

  for (const token of themeTokens) {
    const section = token.replace(/--dt-shell(-\w+)?-color-.*/, '$1').replace('-', ' ').trim() || '-';
    const states = getTokenStates(token);
    const property = getTokenProperty(token);

    output.push(`| ${escapeTableCell(section)} | ${escapeTableCell(states)} | \`${property}\` | \`${token}\` |`);
  }

  output.push('');
  return output;
}

/**
 * Transform <ColorsCatalog> into grouped color tables.
 * Filters tokens-docs for --dt-color-{name}-{stop} patterns.
 *
 * @param {string} mode - "light" or "dark"
 * @returns {string[]}
 */
export function transformColorsCatalog (mode = 'light') {
  const themeKey = `base-${mode}`;
  const colorTokens = Object.keys(tokensDocs)
    .filter(tokenName => /--dt-color-\w+-\d{2,4}$/.test(tokenName))
    .sort();

  if (colorTokens.length === 0) {
    return ['<!-- No base color tokens found -->'];
  }

  // Group by color name
  const groups = {};
  for (const tokenName of colorTokens) {
    const colorName = tokenName.replace(/--dt-color-(\w+).*/, '$1');
    const stop = tokenName.replace(/--dt-color-\w+-(\d{2,4})/, '$1');
    const token = tokensDocs[tokenName]?.[themeKey];
    const value = token?.value || '-';

    if (!groups[colorName]) groups[colorName] = [];
    groups[colorName].push({ stop, variable: tokenName, value });
  }

  const output = [];
  for (const [colorName, stops] of Object.entries(groups)) {
    stops.sort((a, b) => Number(a.stop) - Number(b.stop));
    output.push(`#### ${capitalize(colorName)}`);
    output.push('');
    output.push('| Stop | Variable | Value |');
    output.push('| --- | --- | --- |');
    for (const { stop, variable, value } of stops) {
      output.push(`| ${stop} | \`${variable}\` | \`${value}\` |`);
    }
    output.push('');
  }

  return output;
}

/**
 * Parse exclusion list arrays from <script setup> content.
 * Matches patterns like: const myList = ['foo', 'bar', 'baz'];
 *
 * @param {string} scriptContent - The script setup block content
 * @param {string} varName - The variable name to find
 * @returns {string[]}
 */
export function parseExclusionList (scriptContent, varName) {
  const regex = new RegExp(`const\\s+${varName}\\s*=\\s*\\[([^\\]]+)\\]`);
  const match = scriptContent.match(regex);
  if (!match) return [];
  return match[1]
    .split(',')
    .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}
