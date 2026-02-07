/**
 * Transform <dialtone-usage> blocks into Do/Don't markdown sections.
 *
 * Input looks like:
 * <dialtone-usage>
 * <template #do>
 * - do item 1
 * - do item 2
 * </template>
 * <template #dont>
 * - don't item 1
 * </template>
 * </dialtone-usage>
 *
 * Output:
 * **Do:**
 * - do item 1
 * - do item 2
 *
 * **Don't:**
 * - don't item 1
 */

/**
 * Categorize a trimmed usage line into a slot transition or content.
 * Returns { slot: string|null } for transitions, or null for content lines.
 */
function categorizeUsageLine (trimmed) {
  if (trimmed.match(/<template\s+#do\s*>/)) return { slot: 'do' };
  if (trimmed.match(/<template\s+#dont\s*>/)) return { slot: 'dont' };
  if (trimmed === '</template>') return { slot: null };
  if (trimmed === '<dialtone-usage>' || trimmed === '</dialtone-usage>') return { slot: 'skip' };
  return null;
}

/**
 * Emit a labeled section if content is non-empty.
 */
function emitSection (label, contentLines, output) {
  const content = contentLines.join('\n').trim();
  if (!content) return;
  output.push(`**${label}:**`);
  output.push('');
  output.push(content);
  output.push('');
}

/**
 * Process accumulated lines from a <dialtone-usage> block.
 * @param {string[]} lines - All lines between <dialtone-usage> and </dialtone-usage> inclusive
 * @returns {string[]} - Output markdown lines
 */
export function transformUsage (lines) {
  let currentSlot = null;
  const doLines = [];
  const dontLines = [];

  for (const line of lines) {
    const transition = categorizeUsageLine(line.trim());
    if (transition) {
      if (transition.slot !== 'skip') currentSlot = transition.slot;
      continue;
    }
    if (currentSlot === 'do') doLines.push(line);
    else if (currentSlot === 'dont') dontLines.push(line);
  }

  const output = [];
  emitSection('Do', doLines, output);
  emitSection('Don\'t', dontLines, output);
  return output;
}
