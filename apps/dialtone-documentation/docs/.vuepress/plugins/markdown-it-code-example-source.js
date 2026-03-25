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

    // Only process <code-example> blocks, not <code-example-tabs> (legacy pattern)
    if (token.content.includes('<code-example') && !token.content.includes('<code-example-tabs')) {
      if (token.content.includes('vueCode=\'')) {
        token.content = encodeVueCodeAttr(token.content);
      }
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

    // Find the closing ' using stateful double-quote tracking.
    // Inside the single-quoted vueCode value, double quotes toggle freely
    // (e.g., :class="{'active': true}"). We only match an unescaped ' that
    // is NOT inside a double-quoted substring.
    let end = -1;
    let inDoubleQuote = false;
    for (let i = valueStart; i < result.length; i++) {
      if (result[i] === '"') {
        inDoubleQuote = !inDoubleQuote;
      } else if (result[i] === '\'' && !inDoubleQuote) {
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
  let extracted = dedent(innerContent.replace(/^\n+|\n+$/g, ''));
  if (!extracted) return block;

  // Strip wrapper element marked with data-demo-wrapper
  extracted = stripMarkedWrapper(extracted);

  const encoded = encodeForAttr(extracted);

  return block.slice(0, openTagEnd - 1) +
    ` source-code='${encoded}'` +
    block.slice(openTagEnd - 1);
}

/**
 * If the content starts with an element that has `data-demo-wrapper`,
 * remove the opening and closing tags of that element, keeping only the children.
 */
export function stripMarkedWrapper (content) {
  const trimmed = content.trim();
  if (!trimmed.includes('data-demo-wrapper')) return content;

  // Find the end of the opening tag (first > not inside quotes)
  const openEnd = findFirstUnquotedClose(trimmed);
  if (openEnd === -1) return content;

  // Find the last closing tag (e.g., </dt-stack> or </div>)
  const lastCloseStart = trimmed.lastIndexOf('</');
  if (lastCloseStart === -1 || lastCloseStart <= openEnd) return content;

  // Extract children between the opening and closing tags
  const children = trimmed.slice(openEnd + 1, lastCloseStart);
  return dedent(children.replace(/^\n+|\n+$/g, ''));
}

/**
 * Find the index of the first `>` not inside a quoted attribute value.
 */
function findFirstUnquotedClose (str) {
  let inSingleQuote = false;
  let inDoubleQuote = false;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '\'' && !inDoubleQuote) inSingleQuote = !inSingleQuote;
    else if (str[i] === '"' && !inSingleQuote) inDoubleQuote = !inDoubleQuote;
    else if (str[i] === '>' && !inSingleQuote && !inDoubleQuote) return i;
  }
  return -1;
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
 * attributes with quoted values (which may contain > characters).
 */
function findOpenTagEnd (block) {
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let i = block.indexOf('<code-example');
  if (i === -1) return -1;

  i += '<code-example'.length;

  for (; i < block.length; i++) {
    const ch = block[i];

    if (ch === '\'' && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
    } else if (ch === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
    } else if (ch === '>' && !inSingleQuote && !inDoubleQuote) {
      return i + 1;
    }
  }

  return -1;
}
