import matter from 'gray-matter';

const PATTERNS = {
  headingGlobal: /^(#{1,6})\s+(.+?)(?:\s+#+)?$/gm,
  link: /\[([^\]]*)\]\(([^)]+)\)/g,
  image: /!\[([^\]]*)\]\(([^)]+)\)/g,
  htmlTag: /<[^>]+>/g,
  blockquote: /^>\s?.*/gm,
  horizontalRule: /^(?:[-*_]){3,}\s*$/gm,
  emphasis: /[*_]{1,2}([^*_]+)[*_]{1,2}/g,
};

function extractProse (markdown, inlineCode) {
  const output = [];
  // Consume blocks before scanning their contents, so apparent fences in a
  // comment/script and apparent HTML inside inline code have no special meaning.
  const tokens = /^ {0,3}(`{3,})[^`\n]*$|^ {0,3}(~{3,})[^\n]*$|<!--|<(script|style)\b[^>]*>|(?<!`)(`+)(?!`)/gmi;
  let cursor = 0;
  let match;
  // Unclosed blocks run to the end of the input.
  const skipPast = (closing) => {
    closing.lastIndex = cursor;
    return closing.exec(markdown) ? closing.lastIndex : markdown.length;
  };
  while ((match = tokens.exec(markdown))) {
    output.push(markdown.slice(cursor, match.index));
    cursor = tokens.lastIndex;
    const fence = match[1] || match[2];
    if (fence) {
      cursor = skipPast(new RegExp(`^ {0,3}${fence[0]}{${fence.length},}[ \\t]*$`, 'gm'));
    } else if (match[0] === '<!--') {
      cursor = skipPast(/-->/g);
    } else if (match[3]) {
      cursor = skipPast(new RegExp(`</${match[3]}\\s*>`, 'gi'));
    } else {
      const closing = new RegExp('(?<!`)' + match[4] + '(?!`)', 'g');
      closing.lastIndex = cursor;
      const end = closing.exec(markdown);
      const value = end && markdown.slice(cursor, end.index);
      // Inline spans cannot cross a paragraph or a code/comment block.
      if (end && !/\n[ \t]*\n|\n {0,3}(?:`{3,}|~{3,}|<!--|<(?:script|style)\b)/i.test(value)) {
        const span = markdown.slice(match.index, closing.lastIndex);
        const index = inlineCode.push(/[<>]/.test(value) ? span : value) - 1;
        output.push(`\uE000inline-code-${index}\uE001`);
        cursor = closing.lastIndex;
      } else {
        output.push(match[0]);
      }
    }
    tokens.lastIndex = cursor;
  }
  output.push(markdown.slice(cursor));
  return output.join('');
}

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
 * Removes frontmatter, fenced code blocks, layout HTML, link syntax, heading markers,
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
  const inlineCode = [];
  let text = extractProse(strip ? stripFrontmatter(markdown) : markdown, inlineCode);

  text = text
    .replace(PATTERNS.image, '$1')
    .replace(PATTERNS.link, '$1')
    .replace(PATTERNS.htmlTag, '')
    .replace(PATTERNS.headingGlobal, '$2')
    .replace(PATTERNS.blockquote, m => m.replace(/^>\s?/, ''))
    .replace(PATTERNS.horizontalRule, '')
    .replace(PATTERNS.emphasis, '$1')
    .replace(/\[([^\]]+)\]/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return text.replace(/\uE000inline-code-(\d+)\uE001/g, (_match, index) => inlineCode[index]);
}
