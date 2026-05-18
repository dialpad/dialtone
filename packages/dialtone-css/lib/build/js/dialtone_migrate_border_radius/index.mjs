#!/usr/bin/env node

/**
 * @fileoverview Migration script for deprecated physical border-radius utility classes.
 *
 * DLT-3329  Physical directional border-radius utility classes have been replaced
 *           by logical equivalents. This script rewrites:
 *
 *   All-corners numeric:  d-bar6     → d-bar-350
 *   Pair numeric:         d-btr8     → d-bbsr-400
 *   Pair keyword:         d-btr-pill → d-bbsr-pill
 *
 * The full pair-prefix mapping is:
 *   btr → bbsr   (top    → block-start pair)
 *   bbr → bber   (bottom → block-end pair)
 *   blr → bisr   (left   → inline-start pair)
 *   brr → bier   (right  → inline-end pair)
 *
 * Usage:
 *   npx dialtone-migrate-border-radius [options]
 *
 * Options:
 *   --cwd <path>     Working directory (default: current directory)
 *   --dry-run        Show changes without applying them
 *   --yes            Apply all changes without prompting
 *   --help           Show help
 *
 * Examples:
 *   npx dialtone-migrate-border-radius
 *   npx dialtone-migrate-border-radius --dry-run
 *   npx dialtone-migrate-border-radius --cwd ./src
 *   npx dialtone-migrate-border-radius --yes
 */

import fs from 'fs/promises';
import { realpathSync } from 'node:fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Mapping — MUST STAY IN SYNC with:
// - packages/eslint-plugin-dialtone/lib/rules/deprecated-radius-utility-classes.js
// - packages/dialtone-css/postcss/constants.cjs  (RADIUS_STOPS)
// ---------------------------------------------------------------------------

const RADIUS_STOP_MAP = {
  0: '0', 1: '100', 2: '200', 4: '300', 6: '350',
  8: '400', 12: '450', 16: '500', 24: '550', 32: '600',
};

const PAIR_PREFIX_MAP = {
  btr: 'bbsr', // top    → block-start pair
  bbr: 'bber', // bottom → block-end pair
  blr: 'bisr', // left   → inline-start pair
  brr: 'bier', // right  → inline-end pair
};

// Ordered by descending string length so regex alternation matches longest first.
const NUMERIC_SUFFIXES = Object.keys(RADIUS_STOP_MAP)
  .sort((a, b) => b.length - a.length || Number(b) - Number(a))
  .join('|');
const PAIR_PREFIXES = Object.keys(PAIR_PREFIX_MAP).join('|');

// Word-boundary anchored patterns to avoid matching inside unrelated class names.
const ALL_CORNERS_NUMERIC = new RegExp(`(?<=[\\s"'=\`])d-bar(${NUMERIC_SUFFIXES})(?=[\\s"'>;\`])`, 'g');
const PAIR_NUMERIC        = new RegExp(`(?<=[\\s"'=\`])d-(${PAIR_PREFIXES})(${NUMERIC_SUFFIXES})(?=[\\s"'>;\`])`, 'g');
const PAIR_KEYWORD        = new RegExp(`(?<=[\\s"'=\`])d-(${PAIR_PREFIXES})-(pill|circle)(?=[\\s"'>;\`])`, 'g');

// ---------------------------------------------------------------------------
// Transform
// ---------------------------------------------------------------------------

export function transformContent (content) {
  let transformed = content;
  let count = 0;

  transformed = transformed
    .replace(ALL_CORNERS_NUMERIC, (_, px) => { count++; return `d-bar-${RADIUS_STOP_MAP[px]}`; })
    .replace(PAIR_NUMERIC, (_, legacyPrefix, px) => { count++; return `d-${PAIR_PREFIX_MAP[legacyPrefix]}-${RADIUS_STOP_MAP[px]}`; })
    .replace(PAIR_KEYWORD, (_, legacyPrefix, keyword) => { count++; return `d-${PAIR_PREFIX_MAP[legacyPrefix]}-${keyword}`; });

  return { transformed, count };
}

export { RADIUS_STOP_MAP, PAIR_PREFIX_MAP };

// ---------------------------------------------------------------------------
// File walker
// ---------------------------------------------------------------------------

function isIgnoredPath (fullPath, ignore) {
  const segments = fullPath.split(path.sep);
  return ignore.some(ig => {
    if (ig.includes('/')) {
      const parts = ig.split('/');
      for (let i = 0; i + parts.length <= segments.length; i++) {
        if (parts.every((p, j) => segments[i + j] === p)) return true;
      }
      return false;
    }
    return segments.includes(ig);
  });
}

async function findFiles (dir, extensions, ignore = []) {
  const results = [];
  async function walk (currentDir) {
    let entries;
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (isIgnoredPath(fullPath, ignore)) continue;
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  }
  await walk(dir);
  return results;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function printHelp () {
  console.log(`
Usage: npx dialtone-migrate-border-radius [options]

Replaces deprecated physical border-radius utility classes with logical equivalents (DLT-3329).

  d-bar6     → d-bar-350      (all-corners numeric → token stop)
  d-btr8     → d-bbsr-400     (top pair → block-start pair)
  d-bbr-pill → d-bber-pill    (bottom pair → block-end pair)
  d-blr12    → d-bisr-450     (left pair → inline-start pair)
  d-brr-circle → d-bier-circle (right pair → inline-end pair)

Pair-prefix mapping:
  btr → bbsr   (top    → block-start)
  bbr → bber   (bottom → block-end)
  blr → bisr   (left   → inline-start)
  brr → bier   (right  → inline-end)

Numeric-stop mapping:
  0 → 0     1 → 100   2 → 200   4 → 300    6 → 350
  8 → 400   12 → 450  16 → 500  24 → 550   32 → 600

Options:
  --cwd <path>     Working directory (default: current directory)
  --dry-run        Show changes without applying them
  --yes            Apply all changes without prompting
  --help           Show help
`);
}

function parseArgs (args) {
  const cwdIndex = args.indexOf('--cwd');
  let cwd = process.cwd();
  if (cwdIndex !== -1) {
    const next = args[cwdIndex + 1];
    if (!next || next.startsWith('--')) {
      console.error('Error: --cwd requires a path argument.');
      process.exit(1);
    }
    cwd = path.resolve(next);
  }
  return {
    help: args.includes('--help'),
    dryRun: args.includes('--dry-run'),
    autoYes: args.includes('--yes'),
    cwd,
  };
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

// eslint-disable-next-line complexity
async function main () {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    printHelp();
    process.exit(0);
  }

  console.log(`\nScanning ${opts.cwd} for deprecated border-radius utility classes...\n`);

  const extensions = ['.vue', '.md', '.html', '.js', '.ts', '.jsx', '.tsx'];
  const ignore = ['node_modules', 'dist', '.git', '.vuepress/public', '.vuepress/.temp', '.vuepress/.cache', 'storybook-static'];
  const files = await findFiles(opts.cwd, extensions, ignore);

  const changes = [];

  for (const file of files) {
    try {
      const content = await fs.readFile(file, 'utf8');
      const { transformed, count } = transformContent(content);
      if (count > 0) {
        changes.push({ file, content, transformed, count });
      }
    } catch (err) {
      console.warn(`  ⚠ skipped (read error): ${path.relative(opts.cwd, file)} — ${err.message}`);
    }
  }

  if (changes.length === 0) {
    console.log('No deprecated border-radius utility classes found. Nothing to migrate.');
    process.exit(0);
  }

  console.log(`Found ${changes.reduce((sum, c) => sum + c.count, 0)} deprecated border-radius class references across ${changes.length} file(s):\n`);

  for (const { file, count } of changes) {
    const rel = path.relative(opts.cwd, file);
    console.log(`  ${rel} (${count} change${count > 1 ? 's' : ''})`);
  }

  if (opts.dryRun) {
    console.log('\n--dry-run: No files were modified.\n');
    process.exit(0);
  }

  if (!opts.autoYes) {
    const answer = await prompt('\nApply changes? (y/N) ');
    if (answer !== 'y' && answer !== 'yes') {
      console.log('Cancelled.');
      process.exit(0);
    }
  }

  let written = 0;
  let migratedRefs = 0;
  for (const { file, transformed, count } of changes) {
    try {
      await fs.writeFile(file, transformed, 'utf8');
      written++;
      migratedRefs += count;
    } catch (err) {
      console.warn(`  ⚠ skipped (write error): ${path.relative(opts.cwd, file)} — ${err.message}`);
    }
  }

  console.log(`\nMigrated ${migratedRefs} references across ${written} file(s).\n`);
}

const isDirectRun = (() => {
  try {
    return realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
})();

if (isDirectRun) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
