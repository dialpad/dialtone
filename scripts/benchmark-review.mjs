/**
 * benchmark-review.mjs — Code Review Signal Benchmark
 *
 * Captures per-finding data from all three Dialtone reviewers (CodeRabbit, local
 * /review, Codex) for a curated set of merged PRs, structured for manual
 * "useful vs noise" rating and before/after comparison.
 *
 * USAGE
 *   node scripts/benchmark-review.mjs --help
 *   node scripts/benchmark-review.mjs --pr 1259 [--label baseline|post]
 *   node scripts/benchmark-review.mjs --summarize
 *
 * PROTOCOL
 *   1. Pick 2 closed PRs that were reviewed by CodeRabbit. Add them to
 *      scripts/benchmark-review-prs.json (see schema there).
 *   2. For each PR, run: node scripts/benchmark-review.mjs --pr <num> --label baseline
 *      This captures CodeRabbit comments automatically via gh.
 *   3. Manually run /review on the PR's head SHA (check out the branch, run /review,
 *      paste terminal output into the CSV's evidence_excerpt column).
 *   4. Manually run: codex review --base <base-sha> in the same checkout.
 *      Paste Codex findings into the CSV similarly.
 *   5. Open the CSV and fill in usefulness_rating: "useful" or "noise" for each row.
 *   6. After implementing all review changes (Tasks 1-9), repeat steps 2-5 with
 *      --label post, rate again, then run --summarize to compare.
 *
 * TIME BUDGET: ~2 hours per PR per pass (all 3 reviewers). 2 PRs × 2 passes ≈ 8 hours.
 * Start with 1 PR if time is limited — two data points per reviewer is still meaningful.
 *
 * CSV COLUMNS (8):
 *   pr_number, reviewer, file_path, line, severity,
 *   evidence_excerpt, usefulness_rating, notes
 *   reviewer: coderabbit | review | codex
 *   usefulness_rating: useful | noise | tbd (default — fill this in manually)
 *
 * SUCCESS CRITERION: per-reviewer useful/(useful+noise) ≥ 0.80 on post-change rating.
 * Count is descriptive only; usefulness ratio is the metric.
 */

import { execSync } from 'node:child_process';
import { createWriteStream, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUTPUT_DIR = join(__dirname, 'benchmark-review-output');
const PRS_FILE = join(__dirname, 'benchmark-review-prs.json');

const HELP = `
benchmark-review.mjs — Code Review Signal Benchmark

USAGE
  node scripts/benchmark-review.mjs --help
  node scripts/benchmark-review.mjs --pr <number> [--label baseline|post]
  node scripts/benchmark-review.mjs --all [--label baseline|post]
  node scripts/benchmark-review.mjs --summarize

OPTIONS
  --pr <number>          Capture CodeRabbit comments for this PR into a CSV
  --all                  Run --pr for all PRs listed in scripts/benchmark-review-prs.json
  --label <tag>          Suffix for the output file: "baseline" or "post" (default: baseline)
  --summarize            Read all rated CSVs and emit summary.json
  --help                 Show this help

WORKFLOW
  1. Run --all --label baseline (before changes) to capture all benchmark PRs
  2. Manually fill in /review and Codex findings + rate all rows (useful/noise)
  3. Implement all review changes (Tasks 1-9)
  4. Run --all --label post, fill in again, rate again
  5. Run --summarize to compare useful-ratio before vs after

OUTPUT
  scripts/benchmark-review-output/<pr>-<label>.csv
  scripts/benchmark-review-output/summary.json (from --summarize)
`.trim();

const CSV_HEADER = 'pr_number,reviewer,file_path,line,severity,evidence_excerpt,usefulness_rating,notes';

function csvEscape(s) {
  if (s == null) return '';
  const str = String(s).replace(/"/g, '""');
  return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str}"` : str;
}

function csvRow(fields) {
  return fields.map(csvEscape).join(',');
}

function capturePR(prNumber, label = 'baseline') {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`Fetching CodeRabbit comments for PR #${prNumber}...`);
  let prComments = [];
  let reviewComments = [];
  try {
    // PR-level comments (summary comments, non-diff)
    const raw = execSync(
      `gh pr view ${prNumber} --repo dialpad/dialtone --json comments,number`,
      { cwd: ROOT, encoding: 'utf8' },
    );
    const prData = JSON.parse(raw);
    prComments = prData.comments || [];
  } catch (err) {
    console.error(`Error fetching PR #${prNumber} comments: ${err.message}`);
    process.exit(1);
  }
  try {
    // Inline review comments (diff comments, per-line). Use --paginate to cover PRs
    // with >30 inline comments (default page size); --jq merges all pages into one array.
    const raw = execSync(
      `gh api --paginate repos/dialpad/dialtone/pulls/${prNumber}/comments --jq '.'`,
      { cwd: ROOT, encoding: 'utf8' },
    );
    // --paginate returns multiple JSON arrays concatenated; parse each line if needed.
    const trimmed = raw.trim();
    if (trimmed.startsWith('[')) {
      // Single page or merged array
      reviewComments = JSON.parse(trimmed);
    } else {
      // Multiple pages — split by newline-separated arrays and concatenate
      reviewComments = trimmed.split(/(?<=\])\s*(?=\[)/)
        .flatMap(chunk => JSON.parse(chunk));
    }
  } catch (err) {
    console.warn(`Warning: could not fetch inline review comments for PR #${prNumber}: ${err.message}`);
  }

  const allComments = [
    ...prComments,
    ...reviewComments,
  ];

  // Filter to CodeRabbit comments. The two API sources use DIFFERENT author field shapes:
  // - `gh pr view --json comments` returns `c.author.login` (issue-comment GraphQL shape)
  // - `gh api .../pulls/N/comments` returns `c.user.login` (REST review-comment shape)
  // Check both to avoid dropping inline review comments. Use startsWith to catch
  // `coderabbitai`, `coderabbitai[bot]`, etc.
  const coderabbitComments = allComments.filter(c => {
    const login = c.author?.login || c.user?.login;
    return login?.startsWith('coderabbitai');
  });

  if (coderabbitComments.length === 0) {
    console.warn(`⚠️  No CodeRabbit comments found for PR #${prNumber}. Check that this PR was reviewed by CodeRabbit.`);
  }

  const outPath = join(OUTPUT_DIR, `${prNumber}-${label}.csv`);
  const stream = createWriteStream(outPath);
  stream.write(CSV_HEADER + '\n');

  for (const c of coderabbitComments) {
    // Inline review comments have path/line; PR-level comments don't
    const filePath = c.path || '';
    const line = c.line || c.original_line || '';
    const severity = ''; // CodeRabbit comments don't have a machine-readable severity field — fill manually
    const body = (c.body || '').replace(/\n/g, ' ').slice(0, 200);
    stream.write(csvRow([prNumber, 'coderabbit', filePath, line, severity, body, 'tbd', '']) + '\n');
  }

  // Placeholder rows for /review and codex — fill these manually per protocol
  stream.write(csvRow([prNumber, 'review', '', '', '', '(fill manually: run /review on the PR branch, paste findings here)', 'tbd', '']) + '\n');
  stream.write(csvRow([prNumber, 'codex', '', '', '', '(fill manually: run codex review --base <sha>, paste findings here)', 'tbd', '']) + '\n');

  stream.end();
  console.log(`✓ Wrote ${coderabbitComments.length} CodeRabbit rows + 2 placeholder rows to ${outPath}`);
  console.log(`  Next: open the CSV, fill in /review and Codex findings, set usefulness_rating for each row.`);
}

function parseLocalReviewOutput(stdout) {
  const findings = [];
  // Parses the terminal output from /review skill:
  // Grouped by file: "### path/to/file.vue\n- [severity] Description (line N)\n  Evidence: ...\n  Recommendation: ..."
  const fileBlocks = stdout.split(/(?=^### )/m);
  for (const block of fileBlocks) {
    const fileMatch = block.match(/^### (.+)/);
    if (!fileMatch) continue;
    const filePath = fileMatch[1].trim();
    const findingLines = block.split('\n').filter(l => l.startsWith('- ['));
    for (const fl of findingLines) {
      const severityMatch = fl.match(/\[(BLOCKING|IMPORTANT|NIT)\]/);
      const lineMatch = fl.match(/line (\d+)/i);
      findings.push({
        filePath,
        line: lineMatch ? lineMatch[1] : '',
        severity: severityMatch ? severityMatch[1] : '',
        excerpt: fl.replace(/^- /, '').slice(0, 200),
      });
    }
  }
  return findings;
}

function summarize() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const csvFiles = execSync(`find "${OUTPUT_DIR}" -name "*.csv"`, { encoding: 'utf8' })
    .trim().split('\n').filter(Boolean);

  if (csvFiles.length === 0) {
    console.log('No CSV files found in benchmark-review-output/. Run --pr first and fill in ratings.');
    return;
  }

  const stats = {};

  for (const file of csvFiles) {
    const rows = readFileSync(file, 'utf8').split('\n').slice(1).filter(Boolean);
    for (const row of rows) {
      // CSV-aware split: split only on commas outside quoted fields
      const cols = row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
      if (cols.length < 7) continue;
      const reviewer = cols[1]?.replace(/^"|"$/g, '');
      const rating = cols[6]?.replace(/^"|"$/g, '');
      if (!reviewer || !rating || rating === 'tbd') continue;
      if (!stats[reviewer]) stats[reviewer] = { useful: 0, noise: 0 };
      if (rating === 'useful') stats[reviewer].useful++;
      if (rating === 'noise') stats[reviewer].noise++;
    }
  }

  const summary = {};
  for (const [reviewer, counts] of Object.entries(stats)) {
    const total = counts.useful + counts.noise;
    summary[reviewer] = {
      useful: counts.useful,
      noise: counts.noise,
      total,
      ratio: total > 0 ? Math.round((counts.useful / total) * 100) / 100 : null,
    };
  }

  const outPath = join(OUTPUT_DIR, 'summary.json');
  writeFileSync(outPath, JSON.stringify(summary, null, 2) + '\n');
  console.log('Summary:');
  for (const [reviewer, s] of Object.entries(summary)) {
    const pct = s.ratio != null ? `${Math.round(s.ratio * 100)}%` : 'n/a';
    const goal = s.ratio != null ? (s.ratio >= 0.8 ? '✓ ≥80%' : '✗ <80%') : '';
    console.log(`  ${reviewer.padEnd(12)} ${pct.padStart(4)} useful  (${s.useful}/${s.total}) ${goal}`);
  }
  console.log(`\nWrote ${outPath}`);
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.length === 0) {
    console.log(HELP);
    process.exit(0);
  }

  if (args.includes('--summarize')) {
    summarize();
    return;
  }

  if (args.includes('--all')) {
    const labelIdx = args.indexOf('--label');
    const label = labelIdx !== -1 ? args[labelIdx + 1] : 'baseline';
    if (!existsSync(PRS_FILE)) {
      console.error(`Error: ${PRS_FILE} not found. Create it with an array of {pr, title, baseSha, notes} objects.`);
      process.exit(1);
    }
    const prs = JSON.parse(readFileSync(PRS_FILE, 'utf8'));
    for (const entry of prs) {
      capturePR(entry.pr, label);
    }
    return;
  }

  const prIdx = args.indexOf('--pr');
  const labelIdx = args.indexOf('--label');

  if (prIdx === -1) {
    console.error('Error: --pr <number> is required. Run --help for usage.');
    process.exit(1);
  }

  const prNumber = parseInt(args[prIdx + 1], 10);
  if (isNaN(prNumber)) {
    console.error('Error: --pr requires a PR number.');
    process.exit(1);
  }

  const label = labelIdx !== -1 ? args[labelIdx + 1] : 'baseline';
  if (!['baseline', 'post'].includes(label)) {
    console.error('Error: --label must be "baseline" or "post".');
    process.exit(1);
  }

  capturePR(prNumber, label);
}

// Export helpers for testing
export { parseLocalReviewOutput, csvRow, csvEscape };

main();
