/**
 * markdown-it plugin that extracts the raw source content from <code-example> blocks
 * and injects it as a `_source` prop. This allows the CodeExample Vue component to
 * display the slot content as copyable Vue code without manual duplication.
 *
 * Processes `html_block` tokens that contain <code-example> tags. Extracts everything
 * between the opening and closing tags, then injects it as `_source='...'` on the
 * opening tag. Handles multi-line attributes with quote tracking.
 */
export default function codeExampleSourcePlugin (md) {
  const originalRender = md.renderer.rules.html_block;

  md.renderer.rules.html_block = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const content = token.content;

    if (content.includes('<code-example')) {
      token.content = injectSource(content);
    }

    return originalRender
      ? originalRender(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options);
  };
}

function injectSource (block) {
  const openTagEnd = findOpenTagEnd(block);
  if (openTagEnd === -1) return block;

  const closeTagStart = block.lastIndexOf('</code-example>');
  if (closeTagStart === -1) return block; // self-closing or malformed

  const innerContent = block.slice(openTagEnd, closeTagStart);
  const dedented = dedent(innerContent.replace(/^\n+|\n+$/g, ''));

  if (!dedented) return block;

  // Escape single quotes for the attribute value
  const escaped = dedented.replace(/'/g, '&#39;');

  // Inject source-code prop before the closing > of the opening tag
  const insertPos = openTagEnd - 1; // before the >
  const modified = block.slice(0, insertPos) +
    `\nsource-code='${escaped}'` +
    block.slice(insertPos);

  return modified;
}

/**
 * Remove common leading whitespace from all lines.
 */
function dedent (text) {
  const lines = text.split('\n');
  const nonEmptyLines = lines.filter(l => l.trim().length > 0);
  if (nonEmptyLines.length === 0) return text;

  const minIndent = Math.min(
    ...nonEmptyLines.map(l => l.match(/^(\s*)/)[1].length),
  );

  if (minIndent === 0) return text;
  return lines.map(l => l.slice(minIndent)).join('\n');
}

/**
 * Find the end of the opening <code-example ...> tag, handling multi-line
 * attributes with single-quoted values (which may contain > characters).
 */
function findOpenTagEnd (block) {
  let inQuote = false;
  let i = block.indexOf('<code-example');
  if (i === -1) return -1;

  i += '<code-example'.length;

  for (; i < block.length; i++) {
    const ch = block[i];

    if (ch === '\'' && !inQuote) {
      inQuote = true;
    } else if (ch === '\'' && inQuote) {
      inQuote = false;
    } else if (ch === '>' && !inQuote) {
      return i + 1; // position after the >
    }
  }

  return -1; // unclosed tag
}
