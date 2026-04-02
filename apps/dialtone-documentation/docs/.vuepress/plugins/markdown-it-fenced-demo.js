/**
 * markdown-it plugin that transforms fenced code blocks with `vue demo` info
 * string into <code-example> HTML blocks.
 *
 * Runs as a core rule that converts fence tokens to html_block tokens,
 * allowing the existing codeExampleSourcePlugin to process them for
 * auto-extracting source-code attributes.
 *
 * Info string variants:
 *   ```vue demo           → demo + code tabs (default)
 *   ```vue demo-only      → live preview only, no code tab
 *   ```vue code-only      → code tab only, no live preview
 *
 * Supported directives (HTML comments inside the fenced block):
 *   <!-- @demo-only -->     → only-show="demo" (alias for info string)
 *   <!-- @code-only -->     → only-show="code" (alias for info string)
 *   <!-- @code -->          → separator: above = live demo, below = code tab
 *   <!-- @wrapper -->       → adds data-demo-wrapper to the first element
 *   <!-- @bg classname -->  → bgclass="classname"
 *   <!-- @class name -->    → class="name"
 */

const INFO_RE = /^vue\s+(demo-only|code-only|demo)$/;

export default function fencedDemoPlugin (md) {
  md.core.ruler.push('fenced_demo', function (state) {
    for (let i = 0; i < state.tokens.length; i++) {
      const token = state.tokens[i];
      if (token.type !== 'fence') continue;

      const info = token.info.trim();
      const match = INFO_RE.exec(info);
      if (!match) continue;

      const infoMode = match[1]; // 'demo', 'demo-only', or 'code-only'

      token.type = 'html_block';
      token.content = transformFencedDemo(token.content, infoMode) + '\n';
      token.info = '';
      token.tag = '';
      token.nesting = 0;
      token.children = null;
    }
  });
}

/**
 * Parse directives from fenced block content and build a <code-example> HTML string.
 * @param {string} raw - The content inside the fenced block
 * @param {string} infoMode - 'demo' (default), 'demo-only', or 'code-only' from the info string
 */
export function transformFencedDemo (raw, infoMode = 'demo') {
  const lines = raw.split('\n');

  // --- Parse directives (info string takes precedence, directives can override) ---
  let onlyShow = infoMode === 'demo-only' ? 'demo'
    : infoMode === 'code-only' ? 'code'
      : null;
  let bgclass = null;
  let cssClass = null;
  let codeSeparatorIndex = -1;
  let hasWrapper = false;
  const directiveLines = new Set();

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (trimmed === '<!-- @demo-only -->') {
      onlyShow = 'demo';
      directiveLines.add(i);
    } else if (trimmed === '<!-- @code-only -->') {
      onlyShow = 'code';
      directiveLines.add(i);
    } else if (trimmed === '<!-- @code -->') {
      codeSeparatorIndex = i;
      directiveLines.add(i);
    } else if (trimmed === '<!-- @wrapper -->') {
      hasWrapper = true;
      directiveLines.add(i);
    } else if (/^<!-- @bg .+ -->$/.test(trimmed)) {
      bgclass = trimmed.slice('<!-- @bg '.length, -' -->'.length);
      directiveLines.add(i);
    } else if (/^<!-- @class .+ -->$/.test(trimmed)) {
      cssClass = trimmed.slice('<!-- @class '.length, -' -->'.length);
      directiveLines.add(i);
    }
  }

  // --- Build slot content and optional source-code ---
  let slotContent;
  let sourceCode = null;

  if (codeSeparatorIndex !== -1) {
    const above = [];
    const below = [];
    let pastSeparator = false;
    for (let i = 0; i < lines.length; i++) {
      if (i === codeSeparatorIndex) { pastSeparator = true; continue; }
      if (directiveLines.has(i)) continue;
      if (pastSeparator) below.push(lines[i]);
      else above.push(lines[i]);
    }
    slotContent = trimBlankLines(above.join('\n'));
    sourceCode = trimBlankLines(below.join('\n'));
  } else {
    const content = lines.filter((_, i) => !directiveLines.has(i));
    slotContent = trimBlankLines(content.join('\n'));
  }

  // --- Apply @wrapper ---
  if (hasWrapper) {
    slotContent = addDataDemoWrapper(slotContent);
  }

  // --- Build <code-example> tag ---
  const attrs = [];
  if (onlyShow) attrs.push(`only-show="${onlyShow}"`);
  if (bgclass) attrs.push(`bgclass="${bgclass}"`);
  if (cssClass) attrs.push(`class="${cssClass}"`);
  if (sourceCode) {
    attrs.push(`source-code='${encodeForAttr(sourceCode)}'`);
  }

  const attrStr = attrs.length ? ' ' + attrs.join(' ') : '';
  return `<code-example${attrStr}>\n${slotContent}\n</code-example>`;
}

/**
 * Add data-demo-wrapper attribute to the first HTML element in the content.
 */
function addDataDemoWrapper (content) {
  return content.replace(
    /^(\s*<[a-z][a-z0-9-]*)([\s>])/i,
    '$1 data-demo-wrapper$2',
  );
}

/**
 * Remove leading and trailing blank lines.
 */
function trimBlankLines (str) {
  return str.replace(/^\n+|\n+$/g, '');
}

/**
 * Encode a string for safe inclusion in a single-quoted HTML attribute.
 */
function encodeForAttr (str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
