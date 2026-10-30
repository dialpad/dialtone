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

function extractProse (markdown, inlineCode, preserveFencedCode, usageLabels) {
  const output = [];
  // Consume blocks before scanning their contents, so apparent fences in a
  // comment/script and apparent HTML inside inline code have no special meaning.
  const tokens = new RegExp([
    /^ {0,3}(`{3,})[^`\n]*$|^ {0,3}(~{3,})[^\n]*$/,
    /<!--|<(script|style)(?![\w-])[^>]*>|(?<!`)(`+)(?!`)/,
    /(<\/?dialtone-usage(?![\w-])[^>]*>)/,
    /(<\/?template(?![\w-])[^>]*>)/,
  ].map(pattern => pattern.source).join('|'), 'gmi');
  let usageDepth = 0;
  let wrapperStart = 0;
  let nestedUsage = false;
  const templates = [];
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
      if (preserveFencedCode) {
        const index = inlineCode.push(markdown.slice(match.index, cursor)) - 1;
        output.push(`\uE000inline-code-${index}\uE001`);
      }
    } else if (match[0] === '<!--') {
      cursor = skipPast(/-->/g);
    } else if (match[3]) {
      cursor = skipPast(new RegExp(`</${match[3]}\\s*>`, 'gi'));
    } else if (match[5]) {
      if (/^<\//.test(match[0])) {
        usageDepth = Math.max(0, usageDepth - 1);
        if (!usageDepth) {
          templates.length = 0;
          for (let index = wrapperStart; index < usageLabels.length; index++) {
            usageLabels[index].valid = !nestedUsage;
          }
        }
      } else {
        if (!usageDepth) {
          wrapperStart = usageLabels.length;
          nestedUsage = false;
        } else {
          nestedUsage = true;
        }
        usageDepth++;
      }
      output.push(match[0]);
    } else if (match[6]) {
      if (usageDepth) {
        if (/^<\//.test(match[0])) {
          const slot = templates.pop();
          if (slot != null) output.push(`\uE000usage-end-${slot}\uE001`);
        } else {
          const namedSlot = match[0].match(/^<template\s+#(do|dont)\s*>$/i);
          const slot = usageDepth === 1 && templates.length === 0 && namedSlot
            ? usageLabels.push({ label: namedSlot[1].toLowerCase() === 'do' ? 'Do' : 'Don\'t', valid: false }) - 1
            : null;
          templates.push(slot);
          if (slot != null) output.push(`\uE000usage-start-${slot}\uE001`);
        }
      }
      output.push(match[0]);
    } else {
      const closing = new RegExp('(?<!`)' + match[4] + '(?!`)', 'g');
      closing.lastIndex = cursor;
      const end = closing.exec(markdown);
      const value = end && markdown.slice(cursor, end.index);
      // Inline spans cannot cross a paragraph or a code/comment block.
      if (end && !/\n[ \t]*\n|\n {0,3}(?:`{3,}|~{3,}|<!--|<(?:script|style)(?![\w-]))/i.test(value)) {
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
 * emphasis markers, and excess whitespace. Usage slots retain Do/Don't labels
 * only when their stripped content is nonempty.
 *
 * This is the canonical text used in ai-docs.json `content` fields — keeping
 * the generator output and test assertions in sync by design.
 *
 * @param {string} markdown - Markdown string
 * @param {Object} [options]
 * @param {boolean} [options.stripFrontmatter=true] - Strip YAML frontmatter before parsing
 * @param {boolean} [options.preserveFencedCode=false] - Retain literal fenced examples
 * @returns {string}
 */
export function stripMarkdown(markdown, options = {}) {
  const { stripFrontmatter: strip = true, preserveFencedCode = false } = options;
  const inlineCode = [];
  const usageLabels = [];
  const restoreCode = (text) => text.replace(/\uE000inline-code-(\d+)\uE001/g, (_match, index) => inlineCode[index]);
  let text = extractProse(strip ? stripFrontmatter(markdown) : markdown, inlineCode, preserveFencedCode, usageLabels);

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

  // Decide emptiness after stripping layout, but keep code protected through
  // final whitespace cleanup so retained examples remain verbatim.
  text = text.replace(/\uE000usage-start-(\d+)\uE001([\s\S]*?)\uE000usage-end-\1\uE001/g,
    (_match, index, content) => {
      if (!usageLabels[index].valid) return content;
      return restoreCode(content).trim() ? `\n\n${usageLabels[index].label}:\n\n${content.trim()}\n\n` : '';
    });
  text = text.replace(/\uE000usage-(?:start|end)-\d+\uE001/g, '').replace(/\n{3,}/g, '\n\n').trim();
  return restoreCode(text);
}
