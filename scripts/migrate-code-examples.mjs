#!/usr/bin/env node

/**
 * Migration script: converts <code-example> blocks to fenced ```vue demo syntax.
 *
 * Usage:
 *   node scripts/migrate-code-examples.mjs [--dry-run] [--verbose] [file ...]
 *
 * --dry-run   Show what would change without writing files
 * --verbose   Show detailed conversion info
 * No file args: process all .md files in apps/dialtone-documentation/docs/components/
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const COMPONENTS_DIR = resolve(ROOT, 'apps/dialtone-documentation/docs/components');

// ---------------------------------------------------------------------------
// CLI parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const verbose = args.includes('--verbose');
const fileArgs = args.filter(a => !a.startsWith('--'));

function getFilesToProcess () {
  if (fileArgs.length > 0) {
    return fileArgs.map(f => resolve(f));
  }
  return readdirSync(COMPONENTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => resolve(COMPONENTS_DIR, f));
}

// ---------------------------------------------------------------------------
// Attribute parsing helpers
// ---------------------------------------------------------------------------

/**
 * Parse the opening <code-example ...> tag, which may span multiple lines.
 * Returns { endIndex, attrs } where endIndex is the position after the closing '>'.
 *
 * attrs is an object with keys: onlyShow, vueCode, bgclass, class
 */
function parseOpeningTag (content, startIndex) {
  // Find the end of the opening tag — but we need stateful quote tracking
  // because vueCode can contain '>' inside quoted strings.
  let i = startIndex;
  let inSingleQuote = false;
  let inDoubleQuote = false;

  // Skip past '<code-example'
  const tagStart = content.indexOf('<code-example', i);
  i = tagStart + '<code-example'.length;

  while (i < content.length) {
    const ch = content[i];
    if (inSingleQuote) {
      if (ch === '\'') inSingleQuote = false;
    } else if (inDoubleQuote) {
      if (ch === '"') inDoubleQuote = false;
    } else {
      if (ch === '\'') inSingleQuote = true;
      else if (ch === '"') inDoubleQuote = true;
      else if (ch === '>') {
        // Found the end of the opening tag
        break;
      }
    }
    i++;
  }

  const endIndex = i + 1; // past the '>'
  const tagText = content.slice(tagStart, endIndex);

  const attrs = {};

  // Extract vueCode FIRST — single-quoted, may span multiple lines and contain
  // double quotes and class= attributes. We need to strip it before parsing
  // other attributes so inner content doesn't produce false matches.
  let tagTextForAttrs = tagText;
  const vueCodeStart = tagText.indexOf('vueCode=\'');
  if (vueCodeStart !== -1) {
    const valueStart = vueCodeStart + 'vueCode=\''.length;
    // Find matching closing single quote
    let j = valueStart;
    while (j < tagText.length && tagText[j] !== '\'') {
      j++;
    }
    attrs.vueCode = tagText.slice(valueStart, j);
    // Remove vueCode='...' from the tag text used for other attribute parsing
    tagTextForAttrs = tagText.slice(0, vueCodeStart) + tagText.slice(j + 1);
  }

  // Extract only-show attribute
  const onlyShowMatch = tagTextForAttrs.match(/only-show=["']([^"']+)["']/);
  if (onlyShowMatch) attrs.onlyShow = onlyShowMatch[1];

  // Extract bgclass attribute
  const bgclassMatch = tagTextForAttrs.match(/bgclass=["']([^"']+)["']/);
  if (bgclassMatch) attrs.bgclass = bgclassMatch[1];

  // Extract class attribute (on the code-example itself)
  // Be careful: only match class= not bgclass=
  const classMatch = tagTextForAttrs.match(/(?<![a-z])class=["']([^"']+)["']/);
  if (classMatch) attrs.class = classMatch[1];

  return { endIndex, attrs };
}

/**
 * Find the closing </code-example> tag.
 * Returns the index of the character after the closing tag.
 */
function findClosingTag (content, fromIndex) {
  const tag = '</code-example>';
  const idx = content.indexOf(tag, fromIndex);
  if (idx === -1) return null;
  return { start: idx, end: idx + tag.length };
}

// ---------------------------------------------------------------------------
// Content transformation
// ---------------------------------------------------------------------------

/**
 * Strip leading 2-space indentation from every line of slot content.
 */
function stripIndent (text) {
  const lines = text.split('\n');
  const stripped = lines.map(line => {
    if (line.startsWith('  ')) return line.slice(2);
    return line;
  });
  return stripped.join('\n');
}

/**
 * Check if the first element in slotContent has data-demo-wrapper,
 * and if so remove the attribute and return { hasWrapper: true, content }.
 */
function handleDemoWrapper (slotContent) {
  const wrapperPattern = /^(<[a-z][^\n>]*?) data-demo-wrapper([^\n>]*>)/i;
  const match = slotContent.match(wrapperPattern);
  if (match) {
    const cleaned = slotContent.replace(wrapperPattern, '$1$2');
    return { hasWrapper: true, content: cleaned };
  }
  return { hasWrapper: false, content: slotContent };
}

/**
 * Determine if a class value is a utility class (starts with d-).
 * Component-level classes on slot content should NOT be converted.
 */
function isUtilityClass (classValue) {
  // Check if all classes start with d-
  const classes = classValue.trim().split(/\s+/);
  return classes.some(c => c.startsWith('d-'));
}

/**
 * Clean up vueCode value: trim leading/trailing newlines.
 */
function cleanVueCode (vueCode) {
  // Remove leading and trailing newlines, but preserve internal formatting
  return vueCode.replace(/^\n+/, '').replace(/\n+$/, '');
}

/**
 * Convert a single <code-example> block to fenced demo syntax.
 */
function convertBlock (attrs, slotContent) {
  // Strip the 2-space indentation from slot content
  let content = stripIndent(slotContent);

  // Trim leading/trailing blank lines
  content = content.replace(/^\n+/, '').replace(/\n+$/, '');

  // Check for data-demo-wrapper
  const wrapper = handleDemoWrapper(content);
  content = wrapper.content;

  // Build directives
  const directives = [];

  if (attrs.onlyShow === 'demo') directives.push('<!-- @demo-only -->');
  if (attrs.onlyShow === 'code') directives.push('<!-- @code-only -->');
  if (wrapper.hasWrapper) directives.push('<!-- @wrapper -->');
  if (attrs.bgclass) directives.push(`<!-- @bg ${attrs.bgclass} -->`);
  if (attrs.class && isUtilityClass(attrs.class)) {
    directives.push(`<!-- @class ${attrs.class} -->`);
  }

  // Build the fenced block
  const lines = [];
  lines.push('```vue demo');

  for (const d of directives) {
    lines.push(d);
  }

  lines.push(content);

  if (attrs.vueCode) {
    lines.push('<!-- @code -->');
    lines.push(cleanVueCode(attrs.vueCode));
  }

  lines.push('```');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Main processing
// ---------------------------------------------------------------------------

function processFile (filePath) {
  let content = readFileSync(filePath, 'utf8');
  const fileName = basename(filePath);
  let convertedCount = 0;

  // We process iteratively — find each <code-example> from the start,
  // convert it, and replace in the string. We loop because indices shift
  // after each replacement.
  let searchFrom = 0;

  while (true) {
    // Find the next <code-example that is NOT <code-example-tabs
    const idx = content.indexOf('<code-example', searchFrom);
    if (idx === -1) break;

    // Check it's not <code-example-tabs or <code-example-
    const afterTag = content.slice(idx + '<code-example'.length);
    if (afterTag.startsWith('-')) {
      // It's <code-example-tabs or <code-example-something — skip
      searchFrom = idx + '<code-example'.length;
      continue;
    }

    // Parse the opening tag
    const { endIndex, attrs } = parseOpeningTag(content, idx);

    // Find the closing tag
    const closing = findClosingTag(content, endIndex);
    if (!closing) {
      console.error(`[error] ${fileName}: unclosed <code-example> at offset ${idx}`);
      searchFrom = endIndex;
      continue;
    }

    // Extract slot content (between opening tag end and closing tag start)
    const slotContent = content.slice(endIndex, closing.start);

    // Convert
    const fenced = convertBlock(attrs, slotContent);

    if (verbose) {
      const lineNum = content.slice(0, idx).split('\n').length;
      const preview = attrs.vueCode ? ' (has vueCode)' : '';
      const onlyShow = attrs.onlyShow ? ` only-show="${attrs.onlyShow}"` : '';
      const bg = attrs.bgclass ? ` bgclass="${attrs.bgclass}"` : '';
      console.log(`  line ${lineNum}:${onlyShow}${bg}${preview}`);
    }

    // Replace the entire block
    content = content.slice(0, idx) + fenced + content.slice(closing.end);
    convertedCount++;

    // Move search past the replacement
    searchFrom = idx + fenced.length;
  }

  return { content, convertedCount };
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

const files = getFilesToProcess();
let totalConverted = 0;
let totalFiles = 0;

for (const filePath of files) {
  const fileName = basename(filePath);
  const { content, convertedCount } = processFile(filePath);

  if (convertedCount === 0) continue;

  totalFiles++;
  totalConverted += convertedCount;

  if (dryRun) {
    console.log(`[dry-run] ${fileName}: would convert ${convertedCount} blocks`);
  } else {
    writeFileSync(filePath, content, 'utf8');
    console.log(`[migrate] ${fileName}: ${convertedCount} blocks converted`);
  }
}

if (totalConverted === 0) {
  console.log('[migrate] No <code-example> blocks found to convert.');
} else if (dryRun) {
  console.log(`[dry-run] Done: ${totalConverted} blocks would be converted in ${totalFiles} files`);
} else {
  console.log(`[migrate] Done: ${totalConverted} blocks converted in ${totalFiles} files`);
}
