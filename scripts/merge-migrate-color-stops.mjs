#!/usr/bin/env node
/**
 * merge-migrate-color-stops.mjs
 *
 * Runs the color-stops migration scoped only to files changed on a source
 * branch (default: staging). Prevents re-running migration on already-migrated
 * code during a staging→next merge.
 *
 * Files changed only on <source> are safe to auto-migrate.
 * Files changed on both branches are flagged for manual review with line-level
 * analysis showing which staging-added lines still contain old color stops.
 *
 * Usage:
 *   node scripts/merge-migrate-color-stops.mjs [options]
 *
 * Options:
 *   --merge-from <branch>   Source branch (default: staging)
 *   --dry-run               Preview without modifying files
 *   --force                 Skip confirmation prompt
 *   --verbose               Show line-level details for overlap files
 *   --help                  Show this help
 *
 * NOTE: This script is temporary for the staging→next migration period.
 * Delete it (and revert the dt-migrate skill additions) once the migration
 * is complete.
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { createInterface } from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const RELEVANT_EXTENSIONS = new Set([
  '.css', '.less', '.html', '.vue', '.md',
  '.js', '.ts', '.jsx', '.tsx',
]);

// ── arg parsing ───────────────────────────────────────────────────────────────

// eslint-disable-next-line complexity
function parseArgs () {
  const raw = process.argv.slice(2);
  const opts = { 'merge-from': 'staging', 'dry-run': false, force: false, verbose: false };

  for (let i = 0; i < raw.length; i++) {
    switch (raw[i]) {
      case '--merge-from':
        if (raw[i + 1]) opts['merge-from'] = raw[++i];
        break;
      case '--dry-run': opts['dry-run'] = true; break;
      case '--force':   opts.force   = true; break;
      case '--verbose': opts.verbose = true; break;
      case '--help':
      case '-h':
        console.log(`
Usage: node scripts/merge-migrate-color-stops.mjs [options]

Options:
  --merge-from <branch>   Source branch to scope migration to (default: staging)
  --dry-run               Preview changes without modifying files
  --force                 Skip confirmation prompt
  --verbose               Show line-level details for overlap files
  --help                  Show this help
`);
        process.exit(0);
    }
  }
  return opts;
}

// ── git helpers ───────────────────────────────────────────────────────────────

function git (cmd) {
  try {
    return execSync(`git ${cmd}`, { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

/** Returns relative file paths changed between ref1 and ref2. */
function getChangedFiles (ref1, ref2) {
  const out = git(`diff --name-only --diff-filter=ACMR ${ref1}..${ref2}`);
  return out ? out.split('\n').filter(Boolean) : [];
}

/** Returns lines added on the source side for a single file. */
function getStagingAddedLines (mergeBase, sourceBranch, filePath) {
  try {
    // Shell-quote the path to handle spaces/special characters
    const quoted = `'${filePath.replace(/'/g, '\'\\\'\'')}'`;
    const diff = execSync(
      `git diff ${mergeBase}..${sourceBranch} -- ${quoted}`,
      { cwd: REPO_ROOT, encoding: 'utf8' },
    );
    return diff
      .split('\n')
      .filter(l => l.startsWith('+') && !l.startsWith('+++'))
      .map(l => l.slice(1));
  } catch {
    return [];
  }
}

// ── migration helpers ─────────────────────────────────────────────────────────

/**
 * Returns true if applying the migration expressions to `line` would produce
 * a different string (i.e., the line contains an old color stop that needs
 * migrating).
 */
function lineNeedsMigration (line, expressions) {
  return expressions.some(expr => {
    // Use a fresh regex copy to avoid lastIndex state issues with global regexes
    const re = new RegExp(expr.from.source, expr.from.flags);
    return line.replace(re, expr.to) !== line;
  });
}

// ── confirmation ──────────────────────────────────────────────────────────────

function confirm (question) {
  return new Promise(resolve => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

// ── main ──────────────────────────────────────────────────────────────────────

const opts = parseArgs();
const sourceBranch = opts['merge-from'];
const dryRun = opts['dry-run'];
const force = opts.force;
const verbose = opts.verbose;

// Import helpers and config using URL-relative paths (works regardless of cwd)
const helpersUrl = new URL(
  '../packages/dialtone-css/lib/build/js/dialtone_migration_helper/helpers.mjs',
  import.meta.url,
);
const configUrl = new URL(
  '../packages/dialtone-css/lib/build/js/dialtone_migration_helper/configs/color-stops.mjs',
  import.meta.url,
);

const { getAllFileContents, modifyFileContents } = await import(helpersUrl);
const config = (await import(configUrl)).default;

// 1. Compute merge base ────────────────────────────────────────────────────────
const mergeBase = git(`merge-base HEAD ${sourceBranch}`);
if (!mergeBase) {
  console.error(`\nError: could not find merge base between HEAD and '${sourceBranch}'.`);
  console.error(`Make sure '${sourceBranch}' is a valid branch and is fetched locally.\n`);
  process.exit(1);
}

console.log(`\nMerge base : ${mergeBase.slice(0, 8)}`);
console.log(`Source     : ${sourceBranch}`);
if (dryRun) console.log('Mode       : dry-run (no files will be changed)');

// 2. Compute changed file sets ─────────────────────────────────────────────────
const stagingFiles = new Set(getChangedFiles(mergeBase, sourceBranch));
const currentFiles = new Set(getChangedFiles(mergeBase, 'HEAD'));

// 3. Classify files ────────────────────────────────────────────────────────────
const safeFiles    = []; // changed only on source branch → safe to auto-migrate
const overlapFiles = []; // changed on both branches → manual review required

for (const file of stagingFiles) {
  if (!RELEVANT_EXTENSIONS.has(path.extname(file))) continue;
  if (!existsSync(path.join(REPO_ROOT, file))) continue; // deleted on this branch

  if (currentFiles.has(file)) {
    overlapFiles.push(file);
  } else {
    safeFiles.push(file);
  }
}

console.log(`\nSafe files   (${sourceBranch}-only, auto-migrate) : ${safeFiles.length}`);
console.log(`Overlap files (both branches, manual review) : ${overlapFiles.length}`);

// 4. Safe files — run migration ────────────────────────────────────────────────
if (safeFiles.length > 0) {
  console.log('\n── Safe Files ────────────────────────────────────────────────────────────────');
  safeFiles.forEach(f => console.log(`  ${f}`));

  if (dryRun) {
    console.log('\n[dry-run] Would run color-stops migration on the above files.');
  } else {
    if (!force) {
      const answer = await confirm('\nProceed with color-stops migration on safe files? [y/N] ');
      if (answer !== 'y') {
        console.log('Cancelled.');
        process.exit(0);
      }
    }

    console.log('\nRunning migration...');
    const contents = await getAllFileContents(safeFiles, REPO_ROOT);
    await modifyFileContents(contents, config.expressions);
    console.log('\nMigration complete for safe files.');
  }
} else {
  console.log('\nNo safe files to migrate.');
}

// 5. Overlap files — line-level analysis ──────────────────────────────────────
if (overlapFiles.length > 0) {
  console.log('\n── Overlap Files (manual review required) ────────────────────────────────────');
  let anyNeedMigration = false;

  for (const file of overlapFiles) {
    const addedLines = getStagingAddedLines(mergeBase, sourceBranch, file);
    const flaggedLines = addedLines.filter(line => lineNeedsMigration(line, config.expressions));

    if (flaggedLines.length > 0) {
      anyNeedMigration = true;
      console.log(`\n  ${file}`);
      console.log(`  → ${flaggedLines.length} staging-added line(s) contain old color stops`);
      if (verbose) {
        flaggedLines.forEach(line => console.log(`      + ${line}`));
      }
    } else if (verbose) {
      console.log(`  ${file}: no old color stops in staging-added lines`);
    }
  }

  if (overlapFiles.length > 0 && !verbose) {
    console.log('\nRe-run with --verbose to see the specific lines that need updating.');
  }

  if (anyNeedMigration) {
    console.log('\nAction required: manually update old color stops in the flagged files above.');
    console.log('Reference MAP: packages/dialtone-css/lib/build/js/dialtone_migration_helper/configs/color-stops.mjs');
  } else {
    console.log('\nNo old color stops found in staging-added lines — overlap files are clean.');
  }
}

console.log('');
