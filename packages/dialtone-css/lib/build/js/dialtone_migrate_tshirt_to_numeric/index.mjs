#!/usr/bin/env node

/**
 * @fileoverview Migration script to convert t-shirt size props to numeric scale on Dialtone components.
 *
 * Transforms: size="sm" → :size="200", label-size="xs" → :label-size="100", speed="md" → :speed="300"
 *
 * Usage:
 *   npx dialtone-migrate-tshirt-to-numeric [options]
 *
 * Options:
 *   --cwd <path>     Working directory (default: current directory)
 *   --dry-run        Show changes without applying them
 *   --yes            Apply all changes without prompting
 *   --help           Show help
 *
 * Examples:
 *   npx dialtone-migrate-tshirt-to-numeric
 *   npx dialtone-migrate-tshirt-to-numeric --dry-run
 *   npx dialtone-migrate-tshirt-to-numeric --cwd ./src
 */

import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';

// ---------------------------------------------------------------------------
// Mapping
// ---------------------------------------------------------------------------

const SIZE_MAP = {
  xs: '100',
  sm: '200',
  md: '300',
  lg: '400',
  xl: '500',
  '2xl': '600',
  '3xl': '700',
};

const TSHIRT_VALUES = Object.keys(SIZE_MAP).join('|');

// Single regex that captures the full prop name (including compound like label-size)
// and the t-shirt value. Matches: size="sm", label-size="xs", speed="md",
// description-size="lg", or any future *-size compound prop.
// Match any prop ending in size/Size/speed/Speed with a t-shirt value.
// The simple approach: match the full prop="value", then in the replacer
// check that the character before the match is NOT a colon (v-bind).
const PROP_REGEX = new RegExp(
  `([\\w-]*(?:[Ss]ize|[Ss]peed))="(${TSHIRT_VALUES})"`,
  'g',
);

// Only match on Dialtone component tags
const DT_TAG_PATTERN = /<(dt-[\w-]+|Dt\w+)\b[^>]*>/g;

// ---------------------------------------------------------------------------
// File finder
// ---------------------------------------------------------------------------

async function findFiles (dir, extensions, ignore = []) {
  const results = [];

  async function walk (currentDir) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (ignore.some(ig => fullPath.includes(ig))) continue;
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.isFile()) {
          if (extensions.some(ext => entry.name.endsWith(ext))) {
            results.push(fullPath);
          }
        }
      }
    } catch {
      // Skip unreadable directories
    }
  }

  await walk(dir);
  return results;
}

// ---------------------------------------------------------------------------
// Transform logic
// ---------------------------------------------------------------------------

function transformContent (content) {
  let transformed = content;
  let count = 0;

  // Replace t-shirt sizes only within Dialtone component tags
  transformed = transformed.replace(DT_TAG_PATTERN, (tag) => {
    PROP_REGEX.lastIndex = 0;
    return tag.replace(PROP_REGEX, (match, propName, tshirt, offset, fullTag) => {
      // Skip if preceded by ':' (already a v-bind expression)
      if (offset > 0 && fullTag[offset - 1] === ':') return match;
      if (SIZE_MAP[tshirt]) {
        count++;
        return `:${propName}="${SIZE_MAP[tshirt]}"`;
      }
      return match;
    });
  });

  return { transformed, count };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function printHelp () {
  console.log(`
Usage: npx dialtone-migrate-tshirt-to-numeric [options]

Converts t-shirt size props to numeric scale on Dialtone components.

  size="sm"       → :size="200"
  label-size="xs" → :label-size="100"
  speed="md"      → :speed="300"

Options:
  --cwd <path>     Working directory (default: current directory)
  --dry-run        Show changes without applying them
  --yes            Apply all changes without prompting
  --help           Show help

Size mapping:
  xs → 100    sm → 200    md → 300    lg → 400    xl → 500
  2xl → 600   3xl → 700
`);
}

async function prompt (question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function main () {
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    printHelp();
    process.exit(0);
  }

  const dryRun = args.includes('--dry-run');
  const autoYes = args.includes('--yes');
  const cwdIndex = args.indexOf('--cwd');
  const cwd = cwdIndex !== -1 && args[cwdIndex + 1]
    ? path.resolve(args[cwdIndex + 1])
    : process.cwd();

  console.log(`\nScanning ${cwd} for t-shirt size usage on Dialtone components...\n`);

  const extensions = ['.vue', '.md', '.html', '.js', '.ts', '.jsx', '.tsx'];
  const ignore = ['node_modules', 'dist', '.git', '.vuepress/public'];
  const files = await findFiles(cwd, extensions, ignore);

  const changes = [];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const { transformed, count } = transformContent(content);
    if (count > 0) {
      changes.push({ file, content, transformed, count });
    }
  }

  if (changes.length === 0) {
    console.log('No t-shirt size usage found. Nothing to migrate.');
    process.exit(0);
  }

  console.log(`Found ${changes.reduce((sum, c) => sum + c.count, 0)} t-shirt size references across ${changes.length} files:\n`);

  for (const { file, count } of changes) {
    const rel = path.relative(cwd, file);
    console.log(`  ${rel} (${count} change${count > 1 ? 's' : ''})`);
  }

  if (dryRun) {
    console.log('\n--dry-run: No files were modified.\n');
    process.exit(0);
  }

  if (!autoYes) {
    const answer = await prompt('\nApply changes? (y/N) ');
    if (answer !== 'y' && answer !== 'yes') {
      console.log('Cancelled.');
      process.exit(0);
    }
  }

  for (const { file, transformed } of changes) {
    await fs.writeFile(file, transformed, 'utf8');
  }

  console.log(`\nMigrated ${changes.reduce((sum, c) => sum + c.count, 0)} references across ${changes.length} files.\n`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
