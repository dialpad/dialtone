/**
 * Shared utilities for the fenced-demo / code-example markdown-it plugins
 * and the raw-markdown source parser.
 */

/**
 * Encode a string for safe inclusion in a single-quoted HTML attribute.
 * Vue auto-decodes these entities when passing to component props.
 */
export function encodeForAttr (str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Remove leading and trailing blank lines.
 */
export function trimBlankLines (str) {
  return str.replace(/^\n+|\n+$/g, '');
}

/**
 * Parse directive HTML comments from fenced-demo content lines.
 *
 * Recognised directives:
 *   <!-- @demo-only -->     → onlyShow = 'demo'
 *   <!-- @code-only -->     → onlyShow = 'code'
 *   <!-- @code -->          → codeSeparatorIndex
 *   <!-- @wrapper -->       → hasWrapper = true
 *   <!-- @custom -->        → hasCustom = true
 *   <!-- @bg classname -->  → bgclass = 'classname'
 *   <!-- @class name -->    → cssClass = 'name'
 *
 * @param {string[]} lines - Content lines (without fences)
 * @param {string} [infoMode='demo'] - 'demo', 'demo-only', or 'code-only' from the info string
 * @returns {{ onlyShow: string|null, bgclass: string|null, cssClass: string|null,
 *             codeSeparatorIndex: number, hasWrapper: boolean, hasCustom: boolean, directiveLines: Set<number> }}
 */
export function parseDirectives (lines, infoMode = 'demo') {
  let onlyShow = infoMode === 'demo-only' ? 'demo'
    : infoMode === 'code-only' ? 'code'
      : null;
  let bgclass = null;
  let cssClass = null;
  let codeSeparatorIndex = -1;
  let hasWrapper = false;
  let hasCustom = false;
  const directiveLines = new Set();

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (trimmed === '<!-- @demo-only -->') {
      onlyShow = 'demo';
      directiveLines.add(i);
    } else if (trimmed === '<!-- @code-only -->') {
      onlyShow = 'code';
      directiveLines.add(i);
    } else if (trimmed === '<!-- @code -->' && codeSeparatorIndex === -1) {
      codeSeparatorIndex = i;
      directiveLines.add(i);
    } else if (trimmed === '<!-- @wrapper -->') {
      hasWrapper = true;
      directiveLines.add(i);
    } else if (trimmed === '<!-- @custom -->') {
      hasCustom = true;
      directiveLines.add(i);
    } else {
      const bgMatch = trimmed.match(/^<!-- @bg (.+) -->$/);
      if (bgMatch) {
        bgclass = bgMatch[1];
        directiveLines.add(i);
      } else {
        const classMatch = trimmed.match(/^<!-- @class (.+) -->$/);
        if (classMatch) {
          cssClass = classMatch[1];
          directiveLines.add(i);
        }
      }
    }
  }

  return { onlyShow, bgclass, cssClass, codeSeparatorIndex, hasWrapper, hasCustom, directiveLines };
}
