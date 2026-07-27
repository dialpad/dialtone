import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { createInterface } from 'readline';
import path from 'path';

const RELEVANT_EXTENSIONS = new Set([
  '.css', '.less', '.html', '.vue', '.md',
  '.js', '.ts', '.jsx', '.tsx',
]);

// ── git helpers ───────────────────────────────────────────────────────────────

function git (cmd, cwd) {
  try {
    return execSync(`git ${cmd}`, { cwd, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

// returns relative file paths changed between ref1 and ref2
function getChangedFiles (ref1, ref2, cwd) {
  const out = git(`diff --name-only --diff-filter=ACMR ${ref1}..${ref2}`, cwd);
  return out ? out.split('\n').filter(Boolean) : [];
}

// returns lines added on the source side for a single file
function getStagingAddedLines (mergeBase, sourceBranch, filePath, cwd) {
  try {
    // shell-quote the path to handle spaces/special characters
    const quoted = `'${filePath.replace(/'/g, '\'\\\'\'')}'`;
    const diff = execSync(
      `git diff ${mergeBase}..${sourceBranch} -- ${quoted}`,
      { cwd, encoding: 'utf8' },
    );
    return diff
      .split('\n')
      .filter(l => l.startsWith('+') && !l.startsWith('+++'))
      .map(l => l.slice(1));
  } catch {
    return [];
  }
}

// returns true if applying the migration expressions to `line` would produce a
// different string (i.e., the line contains an old value that needs migrating)
function lineNeedsMigration (line, expressions) {
  return expressions.some(expr => {
    // use a fresh regex copy to avoid lastIndex state issues with global regexes
    const re = new RegExp(expr.from.source, expr.from.flags);
    return line.replace(re, expr.to) !== line;
  });
}

function confirm (question) {
  return new Promise(resolve => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

// splits files changed on the source branch into safe-to-auto-migrate
// (source-only) vs. overlap (also changed on the current branch)
function classifyFiles (stagingFiles, currentFiles, cwd) {
  const safeFiles = [];
  const overlapFiles = [];

  for (const file of stagingFiles) {
    if (!RELEVANT_EXTENSIONS.has(path.extname(file))) continue;
    if (!existsSync(path.join(cwd, file))) continue; // deleted on this branch

    if (currentFiles.has(file)) {
      overlapFiles.push(file);
    } else {
      safeFiles.push(file);
    }
  }

  return { safeFiles, overlapFiles };
}

async function migrateSafeFiles ({
  safeFiles, cwd, dryRun, force, config, configLabel, getAllFileContents, modifyFileContents,
}) {
  if (safeFiles.length === 0) {
    console.log('\nNo safe files to migrate.');
    return;
  }

  console.log('\n── Safe Files ────────────────────────────────────────────────────────────────');
  safeFiles.forEach(f => console.log(`  ${f}`));

  if (dryRun) {
    console.log(`\n[dry-run] Would run ${configLabel} migration on the above files.`);
    return;
  }

  if (!force) {
    const answer = await confirm(`\nProceed with ${configLabel} migration on safe files? [y/N] `);
    if (answer !== 'y') {
      console.log('Cancelled.');
      process.exit(0);
    }
  }

  console.log('\nRunning migration...');
  const contents = await getAllFileContents(safeFiles, cwd);
  await modifyFileContents(contents, config.expressions);
  console.log('\nMigration complete for safe files.');
}

function reportOverlapFile ({ file, mergeBase, sourceBranch, cwd, config, configLabel, verbose }) {
  const addedLines = getStagingAddedLines(mergeBase, sourceBranch, file, cwd);
  const flaggedLines = addedLines.filter(line => lineNeedsMigration(line, config.expressions));

  if (flaggedLines.length > 0) {
    console.log(`\n  ${file}`);
    console.log(`  → ${flaggedLines.length} ${sourceBranch}-added line(s) still need ${configLabel} migration`);
    if (verbose) flaggedLines.forEach(line => console.log(`      + ${line}`));
    return true;
  }

  if (verbose) console.log(`  ${file}: no ${configLabel} changes needed in ${sourceBranch}-added lines`);
  return false;
}

function reportOverlapFiles ({ overlapFiles, mergeBase, sourceBranch, cwd, config, configLabel, configPath, verbose }) {
  if (overlapFiles.length === 0) return;

  console.log('\n── Overlap Files (manual review required) ────────────────────────────────────');
  const anyNeedMigration = overlapFiles
    .map(file => reportOverlapFile({ file, mergeBase, sourceBranch, cwd, config, configLabel, verbose }))
    .some(Boolean);

  if (!verbose) {
    console.log('\nRe-run with --verbose to see the specific lines that need updating.');
  }

  if (anyNeedMigration) {
    console.log(`\nAction required: manually apply the ${configLabel} migration in the flagged files above.`);
    console.log(`Reference config: ${configPath}`);
  } else {
    console.log(`\nNo pending ${configLabel} changes in ${sourceBranch}-added lines — overlap files are clean.`);
  }
}

/**
 * Runs a dialtone_migration_helper config scoped only to files changed on a
 * source branch, relative to the current branch checked out at `cwd`.
 *
 * Files changed only on the source branch are safe to auto-migrate. Files
 * changed on both the source branch and the current branch are flagged for
 * manual review, with line-level analysis of which source-added lines still
 * need migrating.
 *
 * @param {object} params
 * @param {string} params.cwd            Consumer repo root to run git/file operations against.
 * @param {string} params.sourceBranch   Branch to scope the migration to (e.g. staging).
 * @param {boolean} params.dryRun        Preview without modifying files.
 * @param {boolean} params.force         Skip the confirmation prompt.
 * @param {boolean} params.verbose       Show line-level details for overlap files.
 * @param {object} params.config         Loaded migration config module (expressions, description, etc).
 * @param {string} params.configLabel    Human label for this config, e.g. "color-stops".
 * @param {string} params.configPath     Path to the config module, shown in the "reference MAP" message.
 * @param {Function} params.getAllFileContents  From dialtone_migration_helper/helpers.mjs.
 * @param {Function} params.modifyFileContents  From dialtone_migration_helper/helpers.mjs.
 */
export async function runMergeMigration ({
  cwd,
  sourceBranch,
  dryRun,
  force,
  verbose,
  config,
  configLabel,
  configPath,
  getAllFileContents,
  modifyFileContents,
}) {
  // 1. Compute merge base ──────────────────────────────────────────────────────
  const mergeBase = git(`merge-base HEAD ${sourceBranch}`, cwd);
  if (!mergeBase) {
    console.error(`\nError: could not find merge base between HEAD and '${sourceBranch}'.`);
    console.error(`Make sure '${sourceBranch}' is a valid branch and is fetched locally.\n`);
    process.exit(1);
  }

  console.log(`\nMerge base : ${mergeBase.slice(0, 8)}`);
  console.log(`Source     : ${sourceBranch}`);
  if (dryRun) console.log('Mode       : dry-run (no files will be changed)');

  // 2. Compute changed file sets ───────────────────────────────────────────────
  const stagingFiles = new Set(getChangedFiles(mergeBase, sourceBranch, cwd));
  const currentFiles = new Set(getChangedFiles(mergeBase, 'HEAD', cwd));

  // 3. Classify files ──────────────────────────────────────────────────────────
  const { safeFiles, overlapFiles } = classifyFiles(stagingFiles, currentFiles, cwd);

  console.log(`\nSafe files   (${sourceBranch}-only, auto-migrate) : ${safeFiles.length}`);
  console.log(`Overlap files (both branches, manual review) : ${overlapFiles.length}`);

  // 4. Safe files — run migration ──────────────────────────────────────────────
  await migrateSafeFiles({
    safeFiles, cwd, dryRun, force, config, configLabel, getAllFileContents, modifyFileContents,
  });

  // 5. Overlap files — line-level analysis ─────────────────────────────────────
  reportOverlapFiles({ overlapFiles, mergeBase, sourceBranch, cwd, config, configLabel, configPath, verbose });

  console.log('');
}
