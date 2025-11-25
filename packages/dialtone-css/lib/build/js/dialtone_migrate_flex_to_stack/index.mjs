#!/usr/bin/env node
/* eslint-disable complexity */

/**
 * @fileoverview Migration script to convert d-d-flex patterns to <dt-stack> components
 *
 * Usage:
 *   npx dialtone-migrate-flex-to-stack [options]
 *
 * Options:
 *   --cwd <path>     Working directory (default: current directory)
 *   --dry-run        Show changes without applying them
 *   --yes            Apply all changes without prompting
 *   --help           Show help
 *
 * Examples:
 *   npx dialtone-migrate-flex-to-stack
 *   npx dialtone-migrate-flex-to-stack --dry-run
 *   npx dialtone-migrate-flex-to-stack --cwd ./src
 *   npx dialtone-migrate-flex-to-stack --yes
 */

import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';

/**
 * Simple recursive file finder (replaces glob)
 */
async function findFiles(dir, extensions, ignore = []) {
  const results = [];

  async function walk(currentDir) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        // Skip ignored directories
        if (ignore.some(ig => fullPath.includes(ig))) continue;

        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.isFile()) {
          const matchesExtension = extensions.some(ext => entry.name.endsWith(ext));
          if (matchesExtension) {
            results.push(fullPath);
          }
        }
      }
    } catch {
      // Skip directories we can't read
    }
  }

  await walk(dir);
  return results;
}

//------------------------------------------------------------------------------
// Conversion Mappings
//------------------------------------------------------------------------------

const FLEX_TO_PROP = {
  // Align mappings (d-ai-* → align prop)
  'd-ai-flex-start': { prop: 'align', value: 'start' },
  'd-ai-center': { prop: 'align', value: 'center' },
  'd-ai-flex-end': { prop: 'align', value: 'end' },
  'd-ai-stretch': { prop: 'align', value: 'stretch' },
  'd-ai-baseline': { prop: 'align', value: 'baseline' },
  'd-ai-normal': { prop: 'align', value: 'normal' },

  // Justify mappings (d-jc-* → justify prop)
  'd-jc-flex-start': { prop: 'justify', value: 'start' },
  'd-jc-center': { prop: 'justify', value: 'center' },
  'd-jc-flex-end': { prop: 'justify', value: 'end' },
  'd-jc-space-around': { prop: 'justify', value: 'around' },
  'd-jc-space-between': { prop: 'justify', value: 'between' },
  'd-jc-space-evenly': { prop: 'justify', value: 'evenly' },

  // Direction mappings (d-fd-* → direction prop)
  'd-fd-row': { prop: 'direction', value: 'row' },
  'd-fd-column': { prop: 'direction', value: 'column' },
  'd-fd-row-reverse': { prop: 'direction', value: 'row-reverse' },
  'd-fd-column-reverse': { prop: 'direction', value: 'column-reverse' },

  // Gap mappings (d-g* → gap prop)
  'd-g0': { prop: 'gap', value: '0' },
  'd-g8': { prop: 'gap', value: '400' },
  'd-g16': { prop: 'gap', value: '500' },
  'd-g24': { prop: 'gap', value: '550' },
  'd-g32': { prop: 'gap', value: '600' },
  'd-g48': { prop: 'gap', value: '650' },
  'd-g64': { prop: 'gap', value: '700' },

  // Grid-gap mappings (d-gg* → gap prop) - deprecated utilities, same as d-g*
  'd-gg0': { prop: 'gap', value: '0' },
  'd-gg8': { prop: 'gap', value: '400' },
  'd-gg16': { prop: 'gap', value: '500' },
  'd-gg24': { prop: 'gap', value: '550' },
  'd-gg32': { prop: 'gap', value: '600' },
  'd-gg48': { prop: 'gap', value: '650' },
  'd-gg64': { prop: 'gap', value: '700' },
};

// Classes to remove (redundant on dt-stack)
const CLASSES_TO_REMOVE = ['d-d-flex'];

// Classes that have no prop equivalent - retain as classes on dt-stack
const RETAIN_PATTERNS = [
  /^d-fw-/,      // flex-wrap
  /^d-fl-/,      // flex-grow, flex-shrink
  /^d-as-/,      // align-self
  /^d-order/,    // order
  /^d-ac-/,      // align-content
  /^d-flow\d+$/, // flow gap
  /^d-gg?(80|96|112|128|144|160|176|192|208)$/, // large gaps without prop equivalent (d-g* and d-gg*)
];

// Native HTML elements that are safe to convert to dt-stack
// Custom Vue components (anything with hyphens or PascalCase) should NOT be converted
const NATIVE_HTML_ELEMENTS = new Set([
  'div', 'span', 'section', 'article', 'aside', 'nav', 'main',
  'header', 'footer', 'ul', 'ol', 'li', 'form', 'fieldset',
  'label', 'p', 'figure', 'figcaption', 'details', 'summary',
  'address', 'blockquote', 'dialog', 'menu', 'a', 'button',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th',
]);

//------------------------------------------------------------------------------
// Pattern Detection
//------------------------------------------------------------------------------

/**
 * Regex to match elements with d-d-flex in class attribute
 * Captures: tag name (including hyphenated), attributes before class, class value, attributes after class, self-closing
 * Uses [\w-]+ to capture hyphenated tag names like 'code-well-header'
 */
const ELEMENT_REGEX = /<([\w-]+)([^>]*?)\bclass="([^"]*\bd-d-flex\b[^"]*)"([^>]*?)(\/?)>/g;

/**
 * Find all elements with d-d-flex in a template string
 */
function findFlexElements(content) {
  const matches = [];
  let match;

  while ((match = ELEMENT_REGEX.exec(content)) !== null) {
    const [fullMatch, tagName, attrsBefore, classValue, attrsAfter, selfClosing] = match;

    // Skip if already dt-stack
    if (tagName === 'dt-stack' || tagName === 'DtStack') continue;

    // Skip custom Vue components - only convert native HTML elements
    // Custom components have their own behavior and shouldn't be replaced with dt-stack
    if (!NATIVE_HTML_ELEMENTS.has(tagName.toLowerCase())) continue;

    // Skip if d-d-flex only appears with responsive prefix (e.g., lg:d-d-flex)
    // Check if there's a bare d-d-flex (not preceded by breakpoint prefix)
    const hasBareFlexClass = classValue.split(/\s+/).some(cls => cls === 'd-d-flex');
    if (!hasBareFlexClass) continue;

    matches.push({
      fullMatch,
      tagName,
      attrsBefore: attrsBefore.trim(),
      classValue,
      attrsAfter: attrsAfter.trim(),
      selfClosing: selfClosing === '/',
      index: match.index,
      endIndex: match.index + fullMatch.length,
    });
  }

  return matches;
}

/**
 * Find the matching closing tag for an element, accounting for nesting
 * @param {string} content - The file content
 * @param {number} startPos - Position after the opening tag ends
 * @param {string} tagName - The tag name to find closing tag for
 * @returns {object|null} - { index, length } of the closing tag, or null if not found
 */
function findMatchingClosingTag(content, startPos, tagName) {
  let depth = 1;
  let pos = startPos;

  // Regex patterns for this specific tag
  // Opening tag: <tagName followed by whitespace, >, or />
  const openPatternStr = `<${tagName}(?:\\s[^>]*?)?>`;
  const selfClosePatternStr = `<${tagName}(?:\\s[^>]*?)?/>`;
  const closePatternStr = `</${tagName}>`;

  while (depth > 0 && pos < content.length) {
    // Find next opening tag (non-self-closing)
    const openMatch = content.slice(pos).match(new RegExp(openPatternStr));
    // Find next self-closing tag (doesn't affect depth)
    const selfCloseMatch = content.slice(pos).match(new RegExp(selfClosePatternStr));
    // Find next closing tag
    const closeMatch = content.slice(pos).match(new RegExp(closePatternStr));

    if (!closeMatch) {
      // No closing tag found - malformed HTML
      return null;
    }

    const closePos = pos + closeMatch.index;

    // Check if there's an opening tag before this closing tag
    let openPos = openMatch ? pos + openMatch.index : Infinity;

    // If the opening tag is actually a self-closing tag, it doesn't count
    if (selfCloseMatch && openMatch && selfCloseMatch.index === openMatch.index) {
      openPos = Infinity; // Treat as no opening tag
    }

    if (openPos < closePos) {
      // Found an opening tag before the closing tag - increase depth
      depth++;
      pos = openPos + openMatch[0].length;
    } else {
      // Found a closing tag
      depth--;
      if (depth === 0) {
        return {
          index: closePos,
          length: closeMatch[0].length,
        };
      }
      pos = closePos + closeMatch[0].length;
    }
  }

  return null; // No matching closing tag found
}

//------------------------------------------------------------------------------
// Transformation Logic
//------------------------------------------------------------------------------

/**
 * Transform a flex element to dt-stack
 */
function transformElement(element) {
  const classes = element.classValue.split(/\s+/).filter(Boolean);
  const props = [];
  const retainedClasses = [];
  const directionClasses = ['d-fd-row', 'd-fd-column', 'd-fd-row-reverse', 'd-fd-column-reverse'];

  // Find ALL direction utilities present
  const foundDirectionClasses = classes.filter(cls => directionClasses.includes(cls));
  const directionCount = foundDirectionClasses.length;

  for (const cls of classes) {
    // Check if class should be removed
    if (CLASSES_TO_REMOVE.includes(cls)) continue;

    // Special handling for direction utilities
    if (FLEX_TO_PROP[cls] && FLEX_TO_PROP[cls].prop === 'direction') {
      if (directionCount === 1) {
        // Single direction utility - safe to convert
        const { prop, value } = FLEX_TO_PROP[cls];

        // Skip d-fd-column since DtStack defaults to column
        if (value !== 'column') {
          props.push({ prop, value });
        }
        // Don't add to retainedClasses - it's been converted (or omitted as redundant)
        continue;
      } else if (directionCount > 1) {
        // Multiple direction utilities - retain all, let CSS cascade decide
        retainedClasses.push(cls);
        continue;
      }
    }

    // Check if class converts to a prop (non-direction)
    if (FLEX_TO_PROP[cls]) {
      const { prop, value } = FLEX_TO_PROP[cls];
      // Avoid duplicate props
      if (!props.some(p => p.prop === prop)) {
        props.push({ prop, value });
      }
      continue;
    }

    // Check if class should be retained
    if (RETAIN_PATTERNS.some(pattern => pattern.test(cls))) {
      retainedClasses.push(cls);
      continue;
    }

    // Keep other classes (non-flex utilities like d-p16, d-mb8, etc.)
    retainedClasses.push(cls);
  }

  // Add default direction="row" if no direction utilities found OR multiple found
  if (directionCount === 0 || directionCount > 1) {
    props.unshift({ prop: 'direction', value: 'row' });
  }

  // Build the new element
  let newElement = '<dt-stack';

  // Add `as` prop for non-div elements to preserve semantic HTML
  const tagLower = element.tagName.toLowerCase();
  if (tagLower !== 'div') {
    newElement += ` as="${element.tagName}"`;
  }

  // Add converted props
  for (const { prop, value } of props) {
    newElement += ` ${prop}="${value}"`;
  }

  // Add retained classes if any
  if (retainedClasses.length > 0) {
    newElement += ` class="${retainedClasses.join(' ')}"`;
  }

  // Add other attributes (before and after class)
  if (element.attrsBefore) {
    newElement += ` ${element.attrsBefore}`;
  }
  if (element.attrsAfter) {
    newElement += ` ${element.attrsAfter}`;
  }

  // Close tag
  newElement += element.selfClosing ? ' />' : '>';

  return {
    original: element.fullMatch,
    transformed: newElement,
    tagName: element.tagName,
    props,
    retainedClasses,
  };
}

//------------------------------------------------------------------------------
// Console Helpers (replace chalk)
//------------------------------------------------------------------------------

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bold: '\x1b[1m',
};

const log = {
  cyan: (msg) => console.log(`${colors.cyan}${msg}${colors.reset}`),
  gray: (msg) => console.log(`${colors.gray}${msg}${colors.reset}`),
  red: (msg) => `${colors.red}${msg}${colors.reset}`,
  green: (msg) => `${colors.green}${msg}${colors.reset}`,
  yellow: (msg) => `${colors.yellow}${msg}${colors.reset}`,
  bold: (msg) => console.log(`${colors.bold}${msg}${colors.reset}`),
};

//------------------------------------------------------------------------------
// Interactive Prompt (replace inquirer)
//------------------------------------------------------------------------------

async function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().trim());
    });
  });
}

//------------------------------------------------------------------------------
// File Processing
//------------------------------------------------------------------------------

/**
 * Process a single file
 */
async function processFile(filePath, options) {
  const content = await fs.readFile(filePath, 'utf-8');

  // Find elements with d-d-flex
  const elements = findFlexElements(content);

  if (elements.length === 0) return { changes: 0, skipped: 0 };

  log.cyan(`\n📄 ${filePath}`);
  log.gray(`   Found ${elements.length} element(s) with d-d-flex\n`);

  // Check for dynamic :class bindings with flex utilities
  const dynamicClassRegex = /:(class|v-bind:class)="([^"]*)"/g;
  let dynamicMatch;
  const flexUtilityPattern = /d-d-flex|d-ai-|d-jc-|d-fd-|d-gg?\d/;

  while ((dynamicMatch = dynamicClassRegex.exec(content)) !== null) {
    const bindingContent = dynamicMatch[2];
    if (flexUtilityPattern.test(bindingContent)) {
      console.log(log.yellow(`   ⚠ Skipped: dynamic :class binding with flex utilities at position ${dynamicMatch.index}`));
      console.log(log.gray(`     "${bindingContent.length > 60 ? bindingContent.substring(0, 60) + '...' : bindingContent}"`));
      console.log(log.gray(`     Requires manual review - cannot auto-migrate dynamic bindings\n`));
    }
  }

  let changes = 0;
  let skipped = 0;
  let applyAll = options.yes || false;

  // Collect all transformations with their positions first
  // We need to process all elements and find their closing tags BEFORE making any changes
  const transformations = [];

  for (const element of elements) {
    const transformation = transformElement(element);

    // Find the matching closing tag position (in original content)
    let closingTag = null;
    if (!element.selfClosing) {
      closingTag = findMatchingClosingTag(content, element.endIndex, element.tagName);
    }

    // Show before/after
    console.log(log.red('   - ') + transformation.original);
    console.log(log.green('   + ') + transformation.transformed);

    if (transformation.retainedClasses.length > 0) {
      console.log(log.yellow(`     ⚠ Retained classes: ${transformation.retainedClasses.join(', ')}`));
    }
    console.log();

    if (options.dryRun) {
      changes++;
      continue;
    }

    let shouldApply = applyAll;

    if (!applyAll) {
      const answer = await prompt('   Apply? [y]es / [n]o / [a]ll / [q]uit: ');

      if (answer === 'q' || answer === 'quit') break;
      if (answer === 'a' || answer === 'all') {
        applyAll = true;
        shouldApply = true;
      }
      if (answer === 'y' || answer === 'yes') shouldApply = true;
    }

    if (shouldApply) {
      transformations.push({
        // Opening tag replacement
        openStart: element.index,
        openEnd: element.endIndex,
        openReplacement: transformation.transformed,
        // Closing tag replacement (if not self-closing)
        closeStart: closingTag ? closingTag.index : null,
        closeEnd: closingTag ? closingTag.index + closingTag.length : null,
        closeReplacement: '</dt-stack>',
        selfClosing: element.selfClosing,
      });
      changes++;
    } else {
      skipped++;
    }
  }

  // Apply all transformations in reverse order (end to start) to preserve positions
  if (!options.dryRun && transformations.length > 0) {
    // Sort by position descending (process from end of file to start)
    // We need to handle both opening and closing tags, so collect all replacements
    const allReplacements = [];

    for (const t of transformations) {
      // Add opening tag replacement
      allReplacements.push({
        start: t.openStart,
        end: t.openEnd,
        replacement: t.openReplacement,
      });

      // Add closing tag replacement if not self-closing
      if (!t.selfClosing && t.closeStart !== null) {
        allReplacements.push({
          start: t.closeStart,
          end: t.closeEnd,
          replacement: t.closeReplacement,
        });
      }
    }

    // Sort by start position descending
    allReplacements.sort((a, b) => b.start - a.start);

    // Apply replacements from end to start
    let newContent = content;
    for (const r of allReplacements) {
      newContent = newContent.slice(0, r.start) + r.replacement + newContent.slice(r.end);
    }

    await fs.writeFile(filePath, newContent, 'utf-8');
    console.log(log.green(`   ✓ Saved ${changes} change(s)`));
  }

  return { changes, skipped };
}

//------------------------------------------------------------------------------
// Argument Parsing (simple, no yargs)
//------------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    cwd: process.cwd(),
    dryRun: false,
    yes: false,
    extensions: ['.vue'],
    patterns: [],
    hasExtFlag: false, // Track if --ext was used
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      console.log(`
Usage: npx dialtone-migrate-flex-to-stack [options]

Migrates d-d-flex utility patterns to <dt-stack> components.

Options:
  --cwd <path>     Working directory (default: current directory)
  --ext <ext>      File extension to process (default: .vue)
                   Can be specified multiple times (e.g., --ext .vue --ext .md)
  --dry-run        Show changes without applying them
  --yes, -y        Apply all changes without prompting
  --help, -h       Show help

Examples:
  npx dialtone-migrate-flex-to-stack                          # Process .vue files
  npx dialtone-migrate-flex-to-stack --ext .md                # Process .md files only
  npx dialtone-migrate-flex-to-stack --ext .vue --ext .md     # Process both
  npx dialtone-migrate-flex-to-stack --ext .md --cwd ./docs   # Process .md in docs/
  npx dialtone-migrate-flex-to-stack --dry-run                # Preview changes
  npx dialtone-migrate-flex-to-stack --yes                    # Auto-apply all changes
`);
      process.exit(0);
    }

    if (arg === '--cwd' && args[i + 1]) {
      options.cwd = path.resolve(args[++i]);
    } else if (arg === '--ext' && args[i + 1]) {
      // First --ext call clears the default
      if (!options.hasExtFlag) {
        options.extensions = [];
        options.hasExtFlag = true;
      }
      const ext = args[++i];
      // Add leading dot if not present
      options.extensions.push(ext.startsWith('.') ? ext : `.${ext}`);
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--yes' || arg === '-y') {
      options.yes = true;
    } else if (!arg.startsWith('-')) {
      options.patterns.push(arg);
    }
  }

  if (options.patterns.length === 0) {
    options.patterns = ['**/*.vue'];
  }

  return options;
}

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

async function main() {
  const options = parseArgs();

  log.bold('\n🔄 Flex to Stack Migration Tool\n');
  log.gray(`Working directory: ${options.cwd}`);
  log.gray(`Extensions: ${options.extensions.join(', ')}`);
  if (options.dryRun) {
    console.log(log.yellow('DRY RUN - no files will be modified'));
  }
  if (options.yes) {
    console.log(log.yellow('AUTO-APPLY - all changes will be applied without prompts'));
  }

  // Find files
  const files = await findFiles(options.cwd, options.extensions, ['node_modules', 'dist', 'coverage']);

  log.gray(`Found ${files.length} file(s) to scan\n`);

  if (files.length === 0) {
    console.log(log.yellow('No files found matching the patterns.'));
    return;
  }

  // Process files
  let totalChanges = 0;
  let totalSkipped = 0;
  let filesModified = 0;

  for (const file of files) {
    const result = await processFile(file, {
      dryRun: options.dryRun,
      yes: options.yes,
    });
    totalChanges += result.changes;
    totalSkipped += result.skipped;
    if (result.changes > 0) filesModified++;
  }

  // Summary
  log.bold('\n📊 Summary\n');
  console.log(`   Files scanned: ${files.length}`);
  console.log(`   Files modified: ${filesModified}`);
  console.log(`   Changes applied: ${totalChanges}`);
  console.log(`   Changes skipped: ${totalSkipped}`);

  if (options.dryRun && totalChanges > 0) {
    console.log(log.yellow('\n   Run without --dry-run to apply changes.'));
  }

  console.log();
}

main().catch((error) => {
  console.error(`${colors.red}Error:${colors.reset}`, error.message);
  process.exit(1);
});
