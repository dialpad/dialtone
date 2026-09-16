#!/usr/bin/env node

/**
 * @fileoverview Migration script for DtChip `interactive` prop default change.
 *
 * DLT-3195  DtChip `interactive` prop default changed from `true` → `false`.
 *           Chips that need click/keyboard behavior must now explicitly set
 *           `:interactive="true"`.
 *
 * This script:
 *   - Adds `:interactive="true"` to <dt-chip> tags that have a click event
 *     listener (@click, v-on:click) or an object v-on binding (v-on="…"),
 *     since those clearly need interactive behavior.
 *   - Skips chips that already set the `interactive` prop (any form).
 *   - Warns about remaining chips with no `interactive` prop and no detected
 *     click handler — these may be display-only (no change needed) or may
 *     need `:interactive="true"` added manually.
 *
 * Usage:
 *   npx dialtone-migrate-chip-interactive [options]
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
// Constants
// ---------------------------------------------------------------------------

// Quote-aware attribute body. Matches sequences of non-quote/non-gt chars
// optionally followed by a fully-quoted attribute value, so `>` inside a
// quoted value like `:class="a > b"` does not prematurely terminate the tag.
const QUOTE_AWARE_ATTRS = '(?:[^>"\']|"[^"]*"|\'[^\']*\')*';

// Matches `<dt-chip` or `<DtChip` opening tags (including self-closing).
// Group 1: tag name; group 2: attributes (quote-aware); group 3: closer (`>` or `/>`).
const CHIP_TAG_RE = new RegExp(
  `(<(?:dt-chip|DtChip)\\b)(${QUOTE_AWARE_ATTRS})(\\s*\\/?>)`,
  'g',
);

// Detects that the `interactive` prop is already present in any form:
//   interactive, :interactive, v-bind:interactive
const HAS_INTERACTIVE_RE = /(?:^|\s)(?::|v-bind:)?interactive(?:\s*=|\s|\/|>)/;

// Detects a click event listener:
//   @click, v-on:click, @click.stop, @click.prevent, etc.
const HAS_CLICK_RE = /(?:^|\s)(?:@click|v-on:click)(?:\s*=|\s*\.|\/|>|\s)/;

// Detects an object-form v-on binding (v-on="…") which may contain click.
// We treat this conservatively as "may be interactive" and add the prop.
const HAS_VON_OBJECT_RE = /(?:^|\s)v-on\s*=\s*(?:"[^"]*"|'[^']*')/;

// ---------------------------------------------------------------------------
// Transform
// ---------------------------------------------------------------------------

/**
 * Strip quoted attribute values from an attrs string before regex testing.
 * Replaces "…" and '…' with empty equivalents so keywords that happen to
 * appear inside a quoted value (e.g. :title=" @click is cool") don't
 * false-positive against HAS_CLICK_RE / HAS_INTERACTIVE_RE / HAS_VON_OBJECT_RE.
 * Real attribute tokens like @click="handler" survive as @click="" and still match.
 */
function stripQuotedValues (attrs) {
  return attrs.replace(/"[^"]*"|'[^']*'/g, match => (match[0] === '"' ? '""' : '\'\''));
}

/**
 * Find the position to insert `:interactive="true"` — immediately after the
 * tag name so it appears first in the attribute list (consistent with existing
 * Dialtone convention where `:interactive` is an early structural prop).
 *
 * Returns the index within `attrs` where the insertion should happen.
 * We insert after any leading whitespace on the attribute string.
 */
function insertInteractiveProp (attrs) {
  const leadingSpace = attrs.match(/^\s*/)[0];
  const rest = attrs.slice(leadingSpace.length);
  // Preserve the original leading whitespace, then prepend the prop
  return `${leadingSpace}:interactive="true" ${rest}`;
}

/**
 * Transform a single file's content.
 * Returns { transformed, warnings } where warnings are strings.
 */
export function transformContent (content, opts = {}) {
  const filePath = opts.filePath || '<input>';
  const warnings = [];

  // Fast path: skip files with no dt-chip / DtChip reference at all.
  if (!/(?:dt-chip|DtChip)/i.test(content)) {
    return { transformed: content, warnings };
  }

  // Mask inert content (HTML comments, <script>, <style>) so we don't
  // accidentally match tag-like text inside them.
  const { masked, segments, token } = maskInertContent(content);

  let out = masked;
  const replacements = [];

  // Reset lastIndex before iterating
  CHIP_TAG_RE.lastIndex = 0;

  let m;
  while ((m = CHIP_TAG_RE.exec(out)) !== null) {
    const [fullMatch, openTag, attrs, closer] = m;
    const matchStart = m.index;
    const matchEnd = matchStart + fullMatch.length;

    // Strip quoted values before regex testing so keywords inside quoted
    // attribute values don't produce false positives.
    const attrsForTest = stripQuotedValues(attrs);

    // Already has the interactive prop — nothing to do.
    if (HAS_INTERACTIVE_RE.test(attrsForTest)) continue;

    const hasClick = HAS_CLICK_RE.test(attrsForTest);
    const hasVOnObject = HAS_VON_OBJECT_RE.test(attrsForTest);

    if (hasClick || hasVOnObject) {
      // Auto-add :interactive="true"
      const newAttrs = insertInteractiveProp(attrs);
      replacements.push({
        start: matchStart,
        end: matchEnd,
        text: `${openTag}${newAttrs}${closer}`,
      });
    } else {
      // No click handler and no interactive prop.
      // Warn: this chip will now render as a <span>. May be intentional
      // (display-only) or may need :interactive="true" manually.
      warnings.push(
        `${filePath}: <dt-chip> has no interactive prop and no @click handler — ` +
        `will now render as a non-interactive <span>. ` +
        `Add :interactive="true" if this chip should be clickable.`,
      );
    }
  }

  // Apply replacements in reverse order to preserve indices
  replacements.sort((a, b) => b.start - a.start);
  for (const r of replacements) {
    out = out.slice(0, r.start) + r.text + out.slice(r.end);
  }

  return { transformed: unmaskInertContent(out, segments, token), warnings };
}

// ---------------------------------------------------------------------------
// Inert-content masking (same pattern as dialtone_migrate_link_rendering)
// ---------------------------------------------------------------------------

function maskInertContent (content) {
  const token = Math.random().toString(36).slice(2, 10);
  const innerRe = /<!--[\s\S]*?-->|<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>/g;
  const segments = [];
  const masked = content.replace(innerRe, (match) => {
    const placeholder = ` DT_MIGRATE_INERT_${token}_${segments.length} `;
    segments.push(match);
    return placeholder;
  });
  return { masked, segments, token };
}

function unmaskInertContent (masked, segments, token) {
  return masked.replace(new RegExp(` DT_MIGRATE_INERT_${token}_(\\d+) `, 'g'), (_, idx) => segments[Number(idx)]);
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
Usage: npx dialtone-migrate-chip-interactive [options]

Migrates DtChip usage after the \`interactive\` prop default changed from
\`true\` to \`false\` (DLT-3195).

Chips with a @click handler or v-on object binding automatically receive
:interactive="true". All other chips without an existing interactive prop
are listed as warnings for manual review.

Options:
  --cwd <path>   Working directory (default: cwd)
  --dry-run      Show changes without applying them
  --yes          Apply all changes without prompting
  --help         Show help

Examples:
  npx dialtone-migrate-chip-interactive
  npx dialtone-migrate-chip-interactive --dry-run
  npx dialtone-migrate-chip-interactive --cwd ./src
  npx dialtone-migrate-chip-interactive --yes
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
  const extensions = ['.vue'];
  const ignore = ['node_modules', 'dist', '.git', '.vuepress/public', '.vuepress/.temp', '.vuepress/.cache'];
  const files = await findFiles(cwd, extensions, ignore);

  const changes = [];
  const allWarnings = [];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const { transformed, warnings } = transformContent(content, {
      filePath: path.relative(cwd, file),
    });
    if (transformed !== content) {
      changes.push({ file, content, transformed });
    }
    if (warnings.length) allWarnings.push(...warnings);
  }

  return { changes, allWarnings };
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

function printWarnings (warnings) {
  if (!warnings.length) return;
  console.log('\nWarnings — manual review required:\n');
  for (const w of warnings) console.log(`  ${w}`);
  console.log();
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

  console.log(`\nScanning ${opts.cwd} for DtChip usages...`);

  const { changes, allWarnings } = await scanFiles(opts.cwd);

  printWarnings(allWarnings);

  if (changes.length === 0) {
    console.log(allWarnings.length
      ? 'No automated code changes needed. See manual review items above.'
      : 'No DtChip usages found. Nothing to migrate.');
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
