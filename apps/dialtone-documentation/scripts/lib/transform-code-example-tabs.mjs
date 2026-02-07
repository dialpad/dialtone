/**
 * Transform <code-example-tabs> blocks into fenced Vue code blocks.
 *
 * Extracts the vueCode attribute value and emits it as a ```vue fenced block.
 * Skips htmlCode (and dynamic :htmlCode bindings).
 */

/**
 * Process accumulated lines from a <code-example-tabs> block.
 * @param {string[]} lines - All lines of the component (from opening tag to />)
 * @returns {string[]} - Output markdown lines
 */
export function transformCodeExampleTabs (lines) {
  const joined = lines.join('\n');

  // Extract vueCode='...' — single-quoted, may span multiple lines.
  // Vue templates inside always use double quotes, so the closing ' is unambiguous.
  const vueCodeMatch = joined.match(/vueCode='([\s\S]*?)'\s*(?:\n|\/?>)/);
  if (!vueCodeMatch) return [];

  let code = vueCodeMatch[1];

  // Trim leading/trailing blank lines within the code
  code = code.replace(/^\n+/, '').replace(/\n+$/, '');

  if (!code.trim()) return [];

  return [
    '```vue',
    code,
    '```',
    '',
  ];
}
