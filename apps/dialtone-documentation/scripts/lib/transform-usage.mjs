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
 * Process accumulated lines from a <dialtone-usage> block.
 * @param {string[]} lines - All lines between <dialtone-usage> and </dialtone-usage> inclusive
 * @returns {string[]} - Output markdown lines
 */
export function transformUsage (lines) {
  const output = [];
  let currentSlot = null;
  const doLines = [];
  const dontLines = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect slot boundaries
    if (trimmed.match(/<template\s+#do\s*>/)) {
      currentSlot = 'do';
      continue;
    }
    if (trimmed.match(/<template\s+#dont\s*>/)) {
      currentSlot = 'dont';
      continue;
    }
    if (trimmed === '</template>') {
      currentSlot = null;
      continue;
    }
    if (trimmed === '<dialtone-usage>' || trimmed === '</dialtone-usage>') {
      continue;
    }

    // Accumulate content into the appropriate slot
    if (currentSlot === 'do') {
      doLines.push(line);
    } else if (currentSlot === 'dont') {
      dontLines.push(line);
    }
  }

  // Emit Do section
  const doContent = doLines.join('\n').trim();
  if (doContent) {
    output.push('**Do:**');
    output.push('');
    output.push(doContent);
    output.push('');
  }

  // Emit Don't section
  const dontContent = dontLines.join('\n').trim();
  if (dontContent) {
    output.push("**Don't:**");
    output.push('');
    output.push(dontContent);
    output.push('');
  }

  return output;
}
