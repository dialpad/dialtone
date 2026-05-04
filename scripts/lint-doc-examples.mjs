#!/usr/bin/env node

/**
 * Lint documentation component examples for consistent code-example-tabs patterns.
 *
 * Checks:
 * 1. No static inline htmlCode strings (must use ref-based :htmlCode)
 * 2. code-example-tabs after code-well-header must have htmlCode
 * 3. No raw HTML component representations in code-well-header
 * 4. No self-closing <code-example /> tags
 * 5. No empty lines inside <code-example> blocks
 * 6. No vueCode with empty/missing slot content
 *
 * Usage:
 *   node scripts/lint-doc-examples.mjs [--warn] [--fix-list] [file ...]
 *   --warn      Print warnings but exit 0 (default: exit 1 on violations)
 *   --fix-list  Print a machine-readable list of files needing fixes
 *   file ...    Lint only specific files (used by lint-staged)
 */

import { createRequire } from 'node:module';
import { readFileSync, readdirSync } from 'node:fs';
import { join, basename, resolve } from 'node:path';

const DOCS_DIR = join(import.meta.dirname, '..', 'apps', 'dialtone-documentation', 'docs', 'components');

// Files intentionally exempt from checks
const ALLOWLIST = new Set([
  'text.md',    // Intentionally omits htmlCode to discourage manual CSS
  'table.md',   // CSS-only, uses fenced code blocks
  'icon.md',    // No code-example-tabs
  'illustration.md', // No code-example-tabs
  'scroller.md',     // No code-example-tabs
  'index.md',        // Directory listing page
]);

// Inline disable comment: <!-- lint-doc-examples-disable -->
const DISABLE_COMMENT = 'lint-doc-examples-disable';

// Derive component CSS class prefixes from the canonical components list.
const require = createRequire(import.meta.url);
const COMPONENTS_LIST = require('../common/components_list.js');

const CSS_PREFIX_OVERRIDES = {
  Button: 'btn',
  SplitButton: 'split-btn',
};

const componentPrefixes = COMPONENTS_LIST.map(filename => {
  const name = filename.replace('.vue', '');
  return CSS_PREFIX_OVERRIDES[name] ?? name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
});

const prefixAlternation = componentPrefixes.join('|');
// Match component classes with or without BEM modifiers (d-card, d-card__content, d-btn--primary)
const COMPONENT_CLASS_PATTERN = new RegExp(
  `class="[^"]*\\bd-(?:${prefixAlternation})(?:__|--|\\b)[^"]*"`,
);

const STATIC_HTMLCODE_RE = /(?<![:])\bhtmlCode='/;

function findDisabledLines (lines) {
  const disabled = new Set();
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(DISABLE_COMMENT)) {
      disabled.add(i);
    }
  }
  return disabled;
}

function isDisabledNearLine (disabledLines, lineIndex) {
  // Check only the 2 lines immediately before (tighter than 5)
  for (let d = lineIndex - 1; d >= Math.max(0, lineIndex - 2); d--) {
    if (disabledLines.has(d)) return true;
  }
  return false;
}

function checkCodeExampleTabs (lines, filename, disabledLines) {
  const violations = [];
  let inTag = false;
  let inQuotedAttr = false;
  let tagStartLine = 0;
  let tagContent = '';
  let lastHeaderEndLine = -1;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (trimmed.includes('</code-well-header>') && !trimmed.startsWith('<!--') && !trimmed.includes('-->')) {
      lastHeaderEndLine = i;
    }

    if (trimmed.startsWith('<code-example-tabs')) {
      inTag = true;
      inQuotedAttr = false;
      tagStartLine = i;
      tagContent = '';
    }

    if (inTag) {
      tagContent += lines[i] + '\n';

      // Track single-quote state to avoid false positives on > inside quoted attrs
      const singleQuotes = (trimmed.match(/'/g) || []).length;
      if (singleQuotes % 2 !== 0) inQuotedAttr = !inQuotedAttr;

      // Only detect tag close when not inside a quoted attribute
      if (!inQuotedAttr && (trimmed === '/>' || trimmed.endsWith('/>'))) {
        inTag = false;

        if (isDisabledNearLine(disabledLines, tagStartLine)) continue;

        if (STATIC_HTMLCODE_RE.test(tagContent)) {
          violations.push({
            file: filename,
            line: tagStartLine + 1,
            check: 'static-htmlCode',
            message: 'Static inline htmlCode string detected. Use :htmlCode=\'() => $refs.refName\' instead.',
          });
        }

        if (!tagContent.includes('htmlCode') && lastHeaderEndLine >= 0) {
          const gap = tagStartLine - lastHeaderEndLine;
          if (gap > 0 && gap <= 10) {
            violations.push({
              file: filename,
              line: tagStartLine + 1,
              check: 'missing-htmlCode',
              message: 'code-example-tabs after code-well-header is missing htmlCode. Add :htmlCode=\'() => $refs.refName\'.',
            });
          }
        }
      }
    }
  }

  return violations;
}

function checkRawHtmlInHeaders (lines, filename, disabledLines) {
  const violations = [];
  let inHeader = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (trimmed.startsWith('<code-well-header')) {
      inHeader = !isDisabledNearLine(disabledLines, i);
    }

    if (inHeader && !trimmed.startsWith('<code-well-header') && !trimmed.startsWith('</code-well-header')) {
      const isVueOrTemplate = trimmed.startsWith('<dt-') || trimmed.startsWith('</dt-') ||
        trimmed.startsWith('<template') || trimmed.startsWith('</template');

      if (!isVueOrTemplate && trimmed.startsWith('<') && COMPONENT_CLASS_PATTERN.test(lines[i])) {
        violations.push({
          file: filename,
          line: i + 1,
          check: 'raw-html-in-header',
          message: 'Raw HTML with component CSS classes in code-well-header. Use the equivalent Vue component instead.',
        });
      }
    }

    if (trimmed.includes('</code-well-header>')) {
      inHeader = false;
    }
  }

  return violations;
}

function checkCodeExampleStructure (lines, filename) {
  const violations = [];
  let inCodeExample = false;
  let inQuotedAttr = false;
  let codeExampleStartLine = 0;
  let hasSlotContent = false;
  let hasVueCode = false;
  let openTagClosed = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // Detect opening tag (not code-example-tabs)
    if (trimmed.startsWith('<code-example') && !trimmed.startsWith('<code-example-tabs')) {
      inCodeExample = true;
      inQuotedAttr = false;
      codeExampleStartLine = i;
      hasSlotContent = false;
      hasVueCode = trimmed.includes('vueCode=');
      openTagClosed = false;
    }

    if (inCodeExample && !openTagClosed) {
      if (!hasVueCode && lines[i].includes('vueCode=')) hasVueCode = true;

      // Track single-quote state for multi-line attributes
      const quotes = (trimmed.match(/'/g) || []).length;
      if (quotes % 2 !== 0) inQuotedAttr = !inQuotedAttr;

      if (!inQuotedAttr) {
        // Check 4: self-closing
        if (trimmed.endsWith('/>')) {
          violations.push({
            file: filename,
            line: i + 1,
            check: 'self-closing-code-example',
            message: 'Self-closing <code-example /> is not allowed. Use <code-example>...</code-example> with slot content.',
          });
          inCodeExample = false;
          continue;
        }

        if (trimmed.endsWith('>') || trimmed === '>') {
          openTagClosed = true;
        }
      }
      continue;
    }

    if (inCodeExample && openTagClosed) {
      // Check 5: empty lines
      if (trimmed === '') {
        violations.push({
          file: filename,
          line: i + 1,
          check: 'empty-line-in-code-example',
          message: 'Empty line inside <code-example> causes markdown-it to split the block. Remove the blank line.',
        });
      }

      // Track slot content (any non-empty, non-closing line)
      if (trimmed !== '' && trimmed !== '</code-example>') {
        hasSlotContent = true;
      }

      // Detect closing tag
      if (trimmed === '</code-example>') {
        // Check 6: vueCode without slot content
        if (hasVueCode && !hasSlotContent) {
          violations.push({
            file: filename,
            line: codeExampleStartLine + 1,
            check: 'vuecode-without-slot',
            message: 'vueCode used without slot content. Move the code into the slot and remove vueCode, or add meaningful slot content.',
          });
        }
        inCodeExample = false;
      }
    }
  }

  return violations;
}

export function lintContent (filename, content) {
  if (ALLOWLIST.has(filename)) return [];

  const lines = content.split('\n');
  const disabledLines = findDisabledLines(lines);

  return [
    ...checkCodeExampleTabs(lines, filename, disabledLines),
    ...checkRawHtmlInHeaders(lines, filename, disabledLines),
    ...checkCodeExampleStructure(lines, filename),
  ];
}

function lintFile (filepath) {
  const filename = basename(filepath);
  const content = readFileSync(filepath, 'utf-8');
  return lintContent(filename, content).map(v => ({ ...v, file: filepath }));
}

function main () {
  const flags = [];
  const fileArgs = [];
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--')) flags.push(arg);
    else fileArgs.push(arg);
  }

  const warnOnly = flags.includes('--warn');
  const fixList = flags.includes('--fix-list');

  // Use file args from lint-staged if provided, otherwise scan the directory
  let files;
  if (fileArgs.length > 0) {
    files = fileArgs.map(f => resolve(f)).filter(f => f.endsWith('.md'));
  } else {
    try {
      files = readdirSync(DOCS_DIR)
        .filter(f => f.endsWith('.md'))
        .map(f => join(DOCS_DIR, f))
        .sort();
    } catch (err) {
      console.error(`Error reading docs directory: ${DOCS_DIR}`);
      console.error(err.message);
      process.exit(1);
    }
  }

  const allViolations = [];

  for (const file of files) {
    allViolations.push(...lintFile(file));
  }

  if (allViolations.length === 0) {
    console.log('All component doc examples follow the ref-based pattern.');
    process.exit(0);
  }

  if (fixList) {
    const uniqueFiles = [...new Set(allViolations.map(v => basename(v.file)))].sort();
    console.log(uniqueFiles.join('\n'));
    process.exit(warnOnly ? 0 : 1);
  }

  const byFile = {};
  for (const v of allViolations) {
    const name = basename(v.file);
    if (!byFile[name]) byFile[name] = [];
    byFile[name].push(v);
  }

  const prefix = warnOnly ? 'warning' : 'error';

  for (const [file, violations] of Object.entries(byFile).sort()) {
    for (const v of violations) {
      console.log(`${prefix}: ${file}:${v.line} [${v.check}] ${v.message}`);
    }
  }

  console.log(`\n${allViolations.length} violation(s) in ${Object.keys(byFile).length} file(s).`);
  process.exit(warnOnly ? 0 : 1);
}

// Only run when executed directly, not when imported for testing
import { fileURLToPath } from 'node:url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
