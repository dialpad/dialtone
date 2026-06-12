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
 *   <!-- @custom -->        → bypasses default demo wrapper styles (custom prop)
 *   <!-- @bg classname -->  → bgclass="classname"
 *   <!-- @class name -->    → class="name"
 */

import { encodeForAttr, trimBlankLines, parseDirectives } from './fenced-demo-shared.js';

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
  const directives = parseDirectives(lines, infoMode);

  let { slotContent, sourceCode } = splitContent(lines, directives);

  if (directives.onlyShow === 'code') {
    sourceCode ??= slotContent;
    slotContent = '';
  }

  if (directives.hasWrapper) {
    slotContent = addDataDemoWrapper(slotContent);
  }

  return buildCodeExampleTag(directives, slotContent, sourceCode);
}

/**
 * Split lines into slot content (demo) and optional source code (code tab)
 * based on the @code separator position.
 */
function splitContent (lines, { codeSeparatorIndex, directiveLines }) {
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
    return {
      slotContent: trimBlankLines(above.join('\n')),
      sourceCode: trimBlankLines(below.join('\n')),
    };
  }

  const content = lines.filter((_, i) => !directiveLines.has(i));
  return { slotContent: trimBlankLines(content.join('\n')), sourceCode: null };
}

/**
 * Build the <code-example> HTML tag string from parsed directives and content.
 */
function buildCodeExampleTag ({ onlyShow, bgclass, cssClass, hasCustom }, slotContent, sourceCode) {
  const attrs = [];
  if (onlyShow) attrs.push(`only-show="${onlyShow}"`);
  if (hasCustom) attrs.push('custom');
  if (bgclass) attrs.push(`bgclass="${encodeForAttr(bgclass)}"`);
  if (cssClass) attrs.push(`class="${encodeForAttr(cssClass)}"`);
  if (sourceCode) {
    // Single-quoted because source-code contains HTML with double quotes
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
