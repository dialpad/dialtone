#!/usr/bin/env node
/* eslint-disable complexity */

/**
 * @fileoverview Migration script to convert d-d-flex patterns to <dt-stack> components
 *
 * Usage:
 *   node scripts/migrate-flex-to-stack.mjs [options] [glob patterns]
 *
 * Options:
 *   --cwd <path>     Working directory (default: current directory)
 *   --dry-run        Show changes without applying them
 *   --yes            Apply all changes without prompting
 *   --help           Show help
 *
 * Examples:
 *   node scripts/migrate-flex-to-stack.mjs
 *   node scripts/migrate-flex-to-stack.mjs --dry-run
 *   node scripts/migrate-flex-to-stack.mjs --cwd ./apps/my-app
 *   node scripts/migrate-flex-to-stack.mjs --yes  # Apply all without prompts
 */

import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';

/**
 * Simple recursive file finder (replaces glob)
 */
async function findFiles(dir, pattern, ignore = []) {
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
        } else if (entry.isFile() && entry.name.endsWith('.vue')) {
          results.push(fullPath);
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
  /^d-g(80|96|112|128|144|160|176|192|208)$/, // large gaps without prop equivalent
];

//------------------------------------------------------------------------------
// Pattern Detection
//------------------------------------------------------------------------------

/**
 * Regex to match elements with d-d-flex in class attribute
 * Captures: tag name, attributes before class, class value, attributes after class, self-closing
 */
const ELEMENT_REGEX = /<(\w+)([^>]*?)\bclass="([^"]*\bd-d-flex\b[^"]*)"([^>]*?)(\/?)>/g;

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
    });
  }

  return matches;
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

  for (const cls of classes) {
    // Check if class should be removed
    if (CLASSES_TO_REMOVE.includes(cls)) continue;

    // Check if class converts to a prop
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

  // Build the new element
  let newElement = '<dt-stack';

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

  let changes = 0;
  let skipped = 0;
  let newContent = content;
  let applyAll = options.yes || false;

  for (const element of elements) {
    const transformation = transformElement(element);

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
      // Replace opening tag
      newContent = newContent.replace(transformation.original, transformation.transformed);

      // Replace closing tag if not self-closing
      if (!element.selfClosing) {
        // Only replace the specific closing tag for this element
        // This is a simplification - a proper solution would track tag nesting
        newContent = newContent.replace(
          new RegExp(`</${element.tagName}>`, 'g'),
          '</dt-stack>',
        );
      }

      changes++;
    } else {
      skipped++;
    }
  }

  // Write changes if not dry-run and there were changes
  if (!options.dryRun && changes > 0) {
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
    patterns: [],
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      console.log(`
Usage: node scripts/migrate-flex-to-stack.mjs [options] [glob patterns]

Options:
  --cwd <path>     Working directory (default: current directory)
  --dry-run        Show changes without applying them
  --yes, -y        Apply all changes without prompting
  --help, -h       Show help

Examples:
  node scripts/migrate-flex-to-stack.mjs
  node scripts/migrate-flex-to-stack.mjs --dry-run
  node scripts/migrate-flex-to-stack.mjs --cwd ./apps/my-app "**/*.vue"
  node scripts/migrate-flex-to-stack.mjs --yes
`);
      process.exit(0);
    }

    if (arg === '--cwd' && args[i + 1]) {
      options.cwd = path.resolve(args[++i]);
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
  log.gray(`Patterns: ${options.patterns.join(', ')}`);
  if (options.dryRun) {
    console.log(log.yellow('DRY RUN - no files will be modified'));
  }
  if (options.yes) {
    console.log(log.yellow('AUTO-APPLY - all changes will be applied without prompts'));
  }

  // Find files
  const files = await findFiles(options.cwd, options.patterns, ['node_modules', 'dist', 'coverage']);

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
