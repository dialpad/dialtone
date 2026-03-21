/**
 * markdown-it plugin that processes <code-example> blocks in two steps:
 *
 * 1. encodeVueCodeAttr: Converts any `vueCode='...'` attributes to entity-encoded
 *    `source-code='...'` so the Vue template compiler doesn't parse HTML-like
 *    content (e.g. </dt-text>) inside attribute values.
 *
 * 2. processCodeExample: For blocks WITHOUT an explicit vueCode/source-code,
 *    auto-extracts the slot content, dedents it, and injects it as source-code.
 *    Skips only-show="demo" blocks (no code tab to populate).
 *
 * The CodeExample Vue component reads `sourceCode` (camelCase of source-code)
 * and uses it as the Vue code tab content. Vue auto-decodes HTML entities in
 * prop values.
 */
export default function codeExampleSourcePlugin (md) {
  const originalRender = md.renderer.rules.html_block;

  md.renderer.rules.html_block = function (tokens, idx, options, env, self) {
    const token = tokens[idx];

    if (token.content.includes('vueCode=\'')) {
      token.content = encodeVueCodeAttr(token.content);
    }

    if (token.content.includes('<code-example')) {
      token.content = processCodeExample(token.content);
    }

    return originalRender
      ? originalRender(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options);
  };
}

/**
 * Replace all vueCode='...' attributes with source-code='encoded...'.
 * Runs on every html_block token containing vueCode, even if markdown-it
 * split the <code-example> across multiple tokens.
 */
function encodeVueCodeAttr (content) {
  let result = content;
  let searchFrom = 0;

  while (true) {
    const start = result.indexOf('vueCode=\'', searchFrom);
    if (start === -1) break;

    const valueStart = start + 'vueCode=\''.length;

    // Find the closing ' by checking the next character is a tag-level delimiter
    let end = -1;
    for (let i = valueStart; i < result.length; i++) {
      if (result[i] === '\'' && (
        i + 1 >= result.length ||
        result[i + 1] === '>' ||
        result[i + 1] === ' ' ||
        result[i + 1] === '\n' ||
        result[i + 1] === '/'
      )) {
        end = i;
        break;
      }
    }
    if (end === -1) break;

    const value = result.slice(valueStart, end);
    const trimmed = value.replace(/^\n+|\n+$/g, '');
    if (!trimmed) { searchFrom = end + 1; continue; }

    const encoded = encodeForAttr(trimmed);
    const replacement = 'source-code=\'' + encoded + '\'';
    result = result.slice(0, start) + replacement + result.slice(end + 1);
    searchFrom = start + replacement.length;
  }

  return result;
}

/**
 * Auto-extract slot content from <code-example> blocks that don't already
 * have a source-code attribute. Injects dedented, entity-encoded slot
 * content as source-code.
 */
function processCodeExample (block) {
  const openTagEnd = findOpenTagEnd(block);
  if (openTagEnd === -1) return block;

  const openTag = block.slice(0, openTagEnd);

  // Skip demo-only blocks (no code tab to populate)
  if (openTag.includes('only-show="demo"') || openTag.includes('only-show=\'demo\'')) return block;

  // Skip if source-code was already injected (by encodeVueCodeAttr or prior pass)
  if (openTag.includes('source-code=')) return block;

  const closeTagStart = block.lastIndexOf('</code-example>');
  if (closeTagStart === -1) return block;

  const innerContent = block.slice(openTagEnd, closeTagStart);
  const dedented = dedent(innerContent.replace(/^\n+|\n+$/g, ''));
  if (!dedented) return block;

  const encoded = encodeForAttr(dedented);

  return block.slice(0, openTagEnd - 1) +
    ` source-code='${encoded}'` +
    block.slice(openTagEnd - 1);
}

/**
 * Encode a string for safe inclusion in a single-quoted HTML attribute.
 * Vue auto-decodes these entities when passing to component props.
 */
function encodeForAttr (str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
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
      return i + 1;
    }
  }

  return -1;
}
