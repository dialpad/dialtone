/**
 * Utility helpers for raw markdown generation.
 */

/**
 * Escape pipe characters inside a markdown table cell.
 * Also collapses whitespace and trims.
 */
export function escapeTableCell (text) {
  if (!text) return '';
  return text.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
}

/**
 * Clean up the final output:
 * - collapse 3+ consecutive blank lines into 2
 * - trim trailing whitespace on each line
 * - ensure file ends with a single newline
 */
export function cleanupOutput (text) {
  return text
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n';
}

/**
 * Detect whether a line is a standalone Vue component tag that should be removed.
 * Matches self-closing and opening tags like <dt-*, <Dt*, <ButtonVariantsTable>, etc.
 * Does NOT match standard HTML tags (table, tr, td, th, div, span, p, a, img, etc.)
 * or known components handled elsewhere.
 */
const KNOWN_HTML_TAGS = new Set([
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'colgroup', 'col',
  'div', 'span', 'p', 'a', 'img', 'svg', 'path', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'hr', 'em', 'strong',
  'b', 'i', 'u', 'pre', 'code', 'blockquote', 'section', 'header',
  'footer', 'nav', 'main', 'aside', 'figure', 'figcaption',
]);

const HANDLED_COMPONENTS = new Set([
  'code-well-header',
  'code-example-tabs',
  'component-vue-api',
  'component-class-table',
  'component-accessible-table',
  'dialtone-usage',
  'utility-class-table',
  'new-utility-class-table',
  'all-tokens',
  'icon-catalog',
  'icons',
  'script',
  'table',
  'designcolortable',
  'themecolortable',
  'colorscatalog',
  'flexstacknotice',
  'fontutilitiesnotice',
  'buttonvariantstable',
]);

export function isStandaloneVueComponentLine (line) {
  const trimmed = line.trim();
  // Match opening or self-closing tags
  const match = trimmed.match(/^<\/?([a-zA-Z][a-zA-Z0-9-]*)/);
  if (!match) return false;
  const tagName = match[1].toLowerCase();
  // Skip standard HTML tags
  if (KNOWN_HTML_TAGS.has(tagName)) return false;
  // Skip components we handle explicitly
  if (HANDLED_COMPONENTS.has(tagName)) return false;
  // Any tag not in KNOWN_HTML_TAGS and not in HANDLED_COMPONENTS is a Vue component
  // This catches lowercase non-hyphenated tags like <overview>, <token-table>, <iframe> (Figma embeds), etc.
  return true;
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert a kebab-case slug to PascalCase with Dt prefix.
 * e.g. "avatar" → "DtAvatar", "select-menu" → "DtSelectMenu"
 */
export function slugToPascalComponentName (slug) {
  const pascal = slug
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  return `Dt${pascal}`;
}

/**
 * Strip HTML tags from a string, preserving text content.
 */
export function stripHtmlTags (html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Sections that have raw markdown equivalents under /md/.
 */
const RAW_SECTIONS = new Set([
  'components', 'foundations', 'dialtone', 'ui-kits',
  'guides', 'tokens', 'utilities',
]);

/**
 * Convert a cleaned path-parts array into the .md file path.
 * Mirrors mapOutputPath logic: index.md in subdirs collapses to parent.md.
 */
function partsToMdPath (parts) {
  const last = parts[parts.length - 1];
  if (parts.length === 1) return parts[0] + '/index.md';
  if (last === 'index.md' || last === 'index.html') {
    const parent = parts.slice(0, -1);
    return parent.length === 1 ? parent[0] + '/index.md' : parent.join('/') + '.md';
  }
  if (last.endsWith('.html')) return parts.slice(0, -1).join('/') + '/' + last.replace(/\.html$/, '.md');
  if (last.endsWith('.md')) return parts.join('/');
  return parts.join('/') + '.md';
}

/**
 * Compute a relative path from one directory to a target file path.
 */
function toRelativePath (fromDir, toPath) {
  const fromParts = fromDir ? fromDir.split('/').filter(Boolean) : [];
  const toParts = toPath.split('/');
  let common = 0;
  while (common < fromParts.length && common < toParts.length && fromParts[common] === toParts[common]) {
    common++;
  }
  const ups = fromParts.length - common;
  const rest = toParts.slice(common).join('/');
  return ups > 0 ? '../'.repeat(ups) + rest : './' + rest;
}

/**
 * Convert a VuePress absolute link to a relative raw .md path.
 *
 * @param {string} href - The link href (e.g. "/components/text.html#tone")
 * @param {string} currentRawDir - Directory of the current file within md/ (e.g. "dialtone")
 * @returns {string} - Relative .md path, or original href if no conversion applies
 */
export function resolveRawLink (href, currentRawDir) {
  if (!href.startsWith('/') || href.startsWith('/assets/')) return href;

  const hashIdx = href.indexOf('#');
  const path = (hashIdx >= 0 ? href.slice(0, hashIdx) : href).replace(/^\/|\/$/g, '');
  const anchor = hashIdx >= 0 ? href.slice(hashIdx) : '';

  const parts = path.split('/');
  if (!RAW_SECTIONS.has(parts[0])) return href;

  const last = parts[parts.length - 1];
  const extMatch = last.match(/\.(\w+)$/);
  if (extMatch && !['md', 'html'].includes(extMatch[1])) return href;

  return toRelativePath(currentRawDir, partsToMdPath(parts)) + anchor;
}

/**
 * Rewrite all absolute markdown links in a string to relative raw .md paths.
 *
 * @param {string} markdown - The markdown content
 * @param {string} currentRawDir - Directory of the current file within md/
 * @returns {string} - Markdown with rewritten links
 */
export function rewriteAbsoluteLinks (markdown, currentRawDir) {
  return markdown.replace(
    /\[([^\]]*)\]\((\/[^)]+)\)/g,
    (match, text, href) => {
      const newHref = resolveRawLink(href, currentRawDir);
      if (newHref === href) return match;
      return `[${text}](${newHref})`;
    },
  );
}
