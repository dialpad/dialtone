import matter from 'gray-matter';

const PATTERNS = {
  headingGlobal: /^(#{1,6})\s+(.+?)(?:\s+#+)?$/gm,
  codeBlockFenced: /^`{3,}([^\n]*)\n([\s\S]*?)^`{3,}/gm,
  codeInline: /`([^`]+)`/g,
  link: /\[([^\]]*)\]\(([^)]+)\)/g,
  image: /!\[([^\]]*)\]\(([^)]+)\)/g,
  htmlComment: /<!--[\s\S]*?-->/g,
  htmlTag: /<[^>]+>/g,
  blockquote: /^>\s?.*/gm,
  horizontalRule: /^(?:[-*_]){3,}\s*$/gm,
  emphasis: /[*_]{1,2}([^*_]+)[*_]{1,2}/g,
};

/**
 * Strip YAML frontmatter from raw markdown, returning only the body.
 * If no frontmatter is present, the original string is returned unchanged.
 *
 * @param {string} markdown - Raw markdown string (may or may not have frontmatter)
 * @returns {string} Markdown body without frontmatter
 */
export function stripFrontmatter(markdown) {
  try {
    return matter(markdown).content;
  } catch {
    return markdown;
  }
}

/**
 * Strip markdown syntax, returning searchable plain text.
 * Removes frontmatter, fenced code blocks, HTML, link syntax, heading markers,
 * emphasis markers, and excess whitespace.
 *
 * This is the canonical text used in ai-docs.json `content` fields — keeping
 * the generator output and test assertions in sync by design.
 *
 * @param {string} markdown - Markdown string
 * @param {Object} [options]
 * @param {boolean} [options.stripFrontmatter=true] - Strip YAML frontmatter before parsing
 * @returns {string}
 */
export function stripMarkdown(markdown, options = {}) {
  const { stripFrontmatter: strip = true } = options;
  let text = strip ? stripFrontmatter(markdown) : markdown;

  text = text
    .replace(PATTERNS.htmlComment, '')
    .replace(PATTERNS.codeBlockFenced, ' ')
    .replace(PATTERNS.image, '$1')
    .replace(PATTERNS.link, '$1')
    .replace(PATTERNS.htmlTag, '')
    .replace(PATTERNS.headingGlobal, '$2')
    .replace(PATTERNS.blockquote, m => m.replace(/^>\s?/, ''))
    .replace(PATTERNS.horizontalRule, '')
    .replace(PATTERNS.codeInline, '$1')
    .replace(PATTERNS.emphasis, '$1')
    .replace(/\[([^\]]+)\]/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return text;
}
