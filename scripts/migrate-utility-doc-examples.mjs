#!/usr/bin/env node

/**
 * Migration script: converts <code-well-header> + fenced html block patterns
 * in utility doc pages to fenced ```vue demo syntax.
 *
 * Usage:
 *   node scripts/migrate-utility-doc-examples.mjs [--dry-run] [--verbose] [file ...]
 *
 * --dry-run   Show what would change without writing files
 * --verbose   Show detailed conversion info
 * No file args: process all .md files in apps/dialtone-documentation/docs/utilities/ recursively
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const UTILITIES_DIR = resolve(ROOT, 'apps/dialtone-documentation/docs/utilities');

// ---------------------------------------------------------------------------
// CLI parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const verbose = args.includes('--verbose');
const fileArgs = args.filter(a => !a.startsWith('--'));

// ---------------------------------------------------------------------------
// File discovery (recursive)
// ---------------------------------------------------------------------------

function collectMdFiles (dir) {
  const results = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectMdFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

function getFilesToProcess () {
  if (fileArgs.length > 0) {
    return fileArgs.map(f => resolve(f));
  }
  return collectMdFiles(UTILITIES_DIR);
}

// ---------------------------------------------------------------------------
// Attribute parsing helpers
// ---------------------------------------------------------------------------

/**
 * Parse the opening <code-well-header ...> tag, which may span multiple lines.
 * Returns { endIndex, attrs } where endIndex is the position after the closing '>'.
 *
 * attrs: { custom: boolean, bgclass: string|null, class: string|null, otherAttrs: string[] }
 */
// eslint-disable-next-line complexity
function parseOpeningTag (content, tagStart) {
  // Find the end of the opening tag -- track quote state because attribute
  // values may contain '>' characters.
  let i = tagStart + '<code-well-header'.length;
  let inSingleQuote = false;
  let inDoubleQuote = false;

  while (i < content.length) {
    const ch = content[i];
    if (inSingleQuote) {
      if (ch === '\'') inSingleQuote = false;
    } else if (inDoubleQuote) {
      if (ch === '"') inDoubleQuote = false;
    } else {
      if (ch === '\'') inSingleQuote = true;
      else if (ch === '"') inDoubleQuote = true;
      else if (ch === '>') break;
    }
    i++;
  }

  const endIndex = i + 1; // past the '>'
  const tagText = content.slice(tagStart, endIndex);

  const attrs = {
    custom: false,
    bgclass: null,
    class: null,
    otherAttrs: [],
  };

  // To check for the boolean 'custom' attribute, strip out quoted attribute
  // values first so we don't false-match on class="...custom..." etc.
  const stripped = tagText
    .replace(/"[^"]*"/g, '""')
    .replace(/'[^']*'/g, '\'\'');
  if (/\bcustom\b/.test(stripped)) {
    attrs.custom = true;
  }

  // Extract bgclass="..."
  const bgclassMatch = tagText.match(/bgclass=["']([^"']+)["']/);
  if (bgclassMatch) attrs.bgclass = bgclassMatch[1];

  // Extract class="..." -- use negative lookbehind to avoid matching bgclass
  const classMatch = tagText.match(/(?<![a-z])class=["']([^"']+)["']/);
  if (classMatch) attrs.class = classMatch[1];

  // Extract v-dt-scrollbar:... directives
  const scrollbarMatch = tagText.match(/v-dt-scrollbar:\w+/g);
  if (scrollbarMatch) {
    attrs.otherAttrs.push(...scrollbarMatch);
  }

  return { endIndex, attrs };
}

/**
 * Find the closing </code-well-header> tag.
 * Returns { start, end } where end is position after closing tag, or null.
 */
function findClosingTag (content, fromIndex) {
  const tag = '</code-well-header>';
  const idx = content.indexOf(tag, fromIndex);
  if (idx === -1) return null;
  return { start: idx, end: idx + tag.length };
}

/**
 * Check if a fenced ```html block follows the closing tag (with optional
 * blank lines in between). Returns { htmlContent, blockEnd } or null.
 */
function findFollowingHtmlBlock (content, afterClosingTag) {
  // Match optional whitespace/newlines then ```html\n
  const rest = content.slice(afterClosingTag);
  const match = rest.match(/^(\s*\n)*```html\n/);
  if (!match) return null;

  const htmlBlockStart = afterClosingTag + match[0].length;

  // Find the closing ``` for this fenced block -- must be at start of line
  const closingFenceIdx = content.indexOf('\n```', htmlBlockStart);
  if (closingFenceIdx === -1) return null;

  // Make sure this ``` is on its own line (just ```, not ```something)
  const afterFence = content[closingFenceIdx + 4];
  if (afterFence !== undefined && afterFence !== '\n' && afterFence !== '\r') {
    return null;
  }

  const htmlContent = content.slice(htmlBlockStart, closingFenceIdx);
  const blockEnd = closingFenceIdx + 4; // past \n```

  return { htmlContent, blockEnd };
}

// ---------------------------------------------------------------------------
// Fenced code block detection
// ---------------------------------------------------------------------------

/**
 * Check if a position in the content is inside a fenced code block.
 * Scans from the start, toggling state at each ``` that begins a line.
 */
function isInsideFencedBlock (content, position) {
  let insideFence = false;
  let i = 0;

  while (i < position) {
    if ((i === 0 || content[i - 1] === '\n') && content.slice(i, i + 3) === '```') {
      insideFence = !insideFence;
      // Skip to end of this line
      const lineEnd = content.indexOf('\n', i);
      if (lineEnd === -1) break;
      i = lineEnd + 1;
    } else {
      i++;
    }
  }

  return insideFence;
}

// ---------------------------------------------------------------------------
// Content transformation
// ---------------------------------------------------------------------------

/**
 * Strip leading 2-space indentation from every line of slot content.
 */
function stripIndent (text) {
  return text.split('\n').map(line => {
    if (line.startsWith('  ')) return line.slice(2);
    return line;
  }).join('\n');
}

/**
 * Convert a single <code-well-header> block (+ optional fenced html) to
 * fenced ```vue demo syntax.
 */
// eslint-disable-next-line complexity
function convertBlock (attrs, slotContent, htmlContent) {
  // Strip the 2-space indentation from slot content
  let content = stripIndent(slotContent);

  // Trim leading/trailing blank lines
  content = content.replace(/^\n+/, '').replace(/\n+$/, '');

  // Build directives
  const directives = [];

  // custom -> <!-- @custom -->
  if (attrs.custom) {
    directives.push('<!-- @custom -->');
  }

  // bgclass handling:
  //   d-bgc-secondary (default) -> omit
  //   anything else -> <!-- @bg something -->
  //   no bgclass -> omit (uses default)
  if (attrs.bgclass && attrs.bgclass !== 'd-bgc-secondary') {
    directives.push(`<!-- @bg ${attrs.bgclass} -->`);
  }

  // class on code-well-header -> <!-- @class ... --> (only when custom is present,
  // because without custom the class is merged with defaults in CodeWellHeader)
  if (attrs.class && attrs.custom) {
    directives.push(`<!-- @class ${attrs.class} -->`);
  }

  // Handle v-dt-scrollbar and similar attrs by wrapping content in a div
  if (attrs.otherAttrs.length > 0) {
    const attrStr = attrs.otherAttrs.join(' ');
    const innerLines = content.split('\n');
    content = `<div ${attrStr}>\n` +
      innerLines.map(l => (l.trim() === '' ? l : '  ' + l)).join('\n') +
      '\n</div>';
  }

  // Build the fenced block
  const lines = [];
  lines.push('```vue demo');

  for (const d of directives) {
    lines.push(d);
  }

  lines.push(content);

  // Add code separator + html content if present
  if (htmlContent !== null) {
    lines.push('<!-- @code -->');
    const trimmedHtml = htmlContent.replace(/^\n+/, '').replace(/\n+$/, '');
    lines.push(trimmedHtml);
  }

  lines.push('```');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Warning detection
// ---------------------------------------------------------------------------

function checkForBlankLines (fencedContent, relPath, lineNum) {
  const warnings = [];
  const lines = fencedContent.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '' && i > 0 && i < lines.length - 1) {
      warnings.push(
        `[warn] ${relPath}:${lineNum}: blank line in fenced block at relative line ${i + 1} -- may break markdown-it`,
      );
    }
  }
  return warnings;
}

// ---------------------------------------------------------------------------
// Main processing
// ---------------------------------------------------------------------------

// eslint-disable-next-line complexity
function processFile (filePath) {
  let content = readFileSync(filePath, 'utf8');
  const relPath = relative(UTILITIES_DIR, filePath);
  let convertedCount = 0;
  const warnings = [];

  let searchFrom = 0;

  while (true) {
    const idx = content.indexOf('<code-well-header', searchFrom);
    if (idx === -1) break;

    // Skip if inside a fenced code block
    if (isInsideFencedBlock(content, idx)) {
      searchFrom = idx + '<code-well-header'.length;
      continue;
    }

    // Parse the opening tag
    const { endIndex, attrs } = parseOpeningTag(content, idx);

    // Find the closing tag
    const closing = findClosingTag(content, endIndex);
    if (!closing) {
      console.error(`[error] ${relPath}: unclosed <code-well-header> at offset ${idx}`);
      searchFrom = endIndex;
      continue;
    }

    // Extract slot content
    const slotContent = content.slice(endIndex, closing.start);

    // Check if a fenced html block follows
    const htmlBlock = findFollowingHtmlBlock(content, closing.end);

    let htmlContent = null;
    let replacementEnd = closing.end;

    if (htmlBlock) {
      htmlContent = htmlBlock.htmlContent;
      replacementEnd = htmlBlock.blockEnd;
    }

    // Convert
    const fenced = convertBlock(attrs, slotContent, htmlContent);

    // Check for blank line warnings
    const lineNum = content.slice(0, idx).split('\n').length;
    const fencedBody = fenced.split('\n').slice(1, -1).join('\n');
    warnings.push(...checkForBlankLines(fencedBody, relPath, lineNum));

    if (verbose) {
      const custom = attrs.custom ? ' custom' : '';
      const bg = attrs.bgclass ? ` bgclass="${attrs.bgclass}"` : '';
      const cls = attrs.class ? ` class="${attrs.class}"` : '';
      const other = attrs.otherAttrs.length > 0 ? ` ${attrs.otherAttrs.join(' ')}` : '';
      const hasCode = htmlContent !== null ? ' +html' : '';
      console.log(`  line ${lineNum}:${custom}${bg}${cls}${other}${hasCode}`);
    }

    // Replace the entire block
    content = content.slice(0, idx) + fenced + content.slice(replacementEnd);
    convertedCount++;

    // Move search past the replacement
    searchFrom = idx + fenced.length;
  }

  return { content, convertedCount, warnings };
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

const files = getFilesToProcess();
let totalConverted = 0;
let totalFiles = 0;
const allWarnings = [];

for (const filePath of files) {
  const relPath = relative(UTILITIES_DIR, filePath);
  const { content, convertedCount, warnings } = processFile(filePath);

  allWarnings.push(...warnings);

  if (convertedCount === 0) continue;

  totalFiles++;
  totalConverted += convertedCount;

  if (dryRun) {
    console.log(`[dry-run] ${relPath}: would convert ${convertedCount} blocks`);
  } else {
    writeFileSync(filePath, content, 'utf8');
    console.log(`[migrate] ${relPath}: ${convertedCount} blocks converted`);
  }
}

// Print warnings
for (const w of allWarnings) {
  console.log(w);
}

if (totalConverted === 0) {
  console.log('[migrate] No <code-well-header> blocks found to convert.');
} else if (dryRun) {
  console.log(`[dry-run] Done: ${totalConverted} blocks would be converted in ${totalFiles} files`);
} else {
  console.log(`[migrate] Done: ${totalConverted} blocks converted in ${totalFiles} files`);
}
