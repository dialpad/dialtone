#!/usr/bin/env node

/**
 * @fileoverview Migration script for v-dt-scrollbar :never → :always rename.
 *
 * DLT-3158  The `:never` directive argument was renamed to `:always` to reflect
 *           its actual meaning (always show the scrollbar, never auto-hide it).
 *           The `DtBox` `scrollbar="never"` prop value is similarly renamed to
 *           `scrollbar="always"`.
 *
 * This script:
 *   - Replaces `v-dt-scrollbar:never` with `v-dt-scrollbar:always` in .vue and .html files.
 *   - Replaces `scrollbar="never"` with `scrollbar="always"` (DtBox prop) in .vue files.
 *   - Replaces `:scrollbar="'never'"` and `scrollbar='never'` variants in .vue files.
 *
 * Usage:
 *   npx dialtone-migrate-scrollbar-always [options]
 *
 * Options:
 *   --cwd <path>   Working directory (default: cwd)
 *   --dry-run      Show changes without applying them
 *   --yes          Apply all changes without prompting
 *   --help         Show help
 */

import fs from 'fs/promises';
import { realpathSync } from 'node:fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Transform
// ---------------------------------------------------------------------------

/**
 * Apply all renames to a single file's content.
 * Returns the transformed string (may be identical to input if no matches).
 */
export function transformContent (content) {
  return content
    // v-dt-scrollbar:never → v-dt-scrollbar:always
    .replace(/v-dt-scrollbar:never\b/g, 'v-dt-scrollbar:always')
    // scrollbar="never" → scrollbar="always" (unbound prop only; negative lookbehind excludes :scrollbar="never")
    .replace(/(?<!:)\bscrollbar="never"/g, 'scrollbar="always"')
    // scrollbar='never' → scrollbar='always' (unbound prop only)
    .replace(/(?<!:)\bscrollbar='never'/g, 'scrollbar=\'always\'')
    // :scrollbar="'never'" → :scrollbar="'always'"
    .replace(/:scrollbar="'never'"/g, ':scrollbar="\'always\'"')
    // :scrollbar="\"never\"" → :scrollbar="\"always\""
    .replace(/:scrollbar='"never"'/g, ':scrollbar=\'"always"\'');
}

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
// CLI plumbing
// ---------------------------------------------------------------------------

function printHelp () {
  console.log(`
Usage: npx dialtone-migrate-scrollbar-always [options]

Renames the v-dt-scrollbar ":never" directive argument to ":always" (DLT-3158).
Also renames the DtBox scrollbar="never" prop value to scrollbar="always".

Options:
  --cwd <path>   Working directory (default: cwd)
  --dry-run      Show changes without applying them
  --yes          Apply all changes without prompting
  --help         Show help

Examples:
  npx dialtone-migrate-scrollbar-always
  npx dialtone-migrate-scrollbar-always --dry-run
  npx dialtone-migrate-scrollbar-always --cwd ./src
  npx dialtone-migrate-scrollbar-always --yes
`);
}

function parseArgs (args) {
  const cwdIndex = args.indexOf('--cwd');
  return {
    help: args.includes('--help'),
    dryRun: args.includes('--dry-run'),
    autoYes: args.includes('--yes'),
    cwd: cwdIndex !== -1 && args[cwdIndex + 1]
      ? path.resolve(args[cwdIndex + 1])
      : process.cwd(),
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

async function scanFiles (cwd) {
  const extensions = ['.vue', '.html'];
  const ignore = ['node_modules', 'dist', '.git', '.vuepress/public', '.vuepress/.temp', '.vuepress/.cache', 'storybook-static'];
  const files = await findFiles(cwd, extensions, ignore);

  const changes = [];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const transformed = transformContent(content);
    if (transformed !== content) {
      changes.push({ file, content, transformed });
    }
  }

  return changes;
}

async function applyChanges (changes, autoYes) {
  if (!autoYes) {
    const answer = await prompt('\nApply changes? (y/N) ');
    if (answer !== 'y' && answer !== 'yes') {
      console.log('Cancelled.');
      return false;
    }
  }
  for (const { file, transformed } of changes) {
    await fs.writeFile(file, transformed, 'utf8');
  }
  return true;
}

function printChangeSummary (changes, cwd) {
  console.log(`\nFound changes in ${changes.length} file(s):\n`);
  for (const { file } of changes) {
    console.log(`  ${path.relative(cwd, file)}`);
  }
}

async function main () {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    printHelp();
    process.exit(0);
  }

  console.log(`\nScanning ${opts.cwd} for v-dt-scrollbar:never and scrollbar="never" usages...`);

  const changes = await scanFiles(opts.cwd);

  if (changes.length === 0) {
    console.log('No usages found. Nothing to migrate.');
    process.exit(0);
  }

  printChangeSummary(changes, opts.cwd);

  if (opts.dryRun) {
    console.log('\n--dry-run: No files were modified.');
    process.exit(0);
  }

  const applied = await applyChanges(changes, opts.autoYes);
  if (applied) console.log(`\nMigrated ${changes.length} file(s).\n`);
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
