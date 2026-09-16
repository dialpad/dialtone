#!/usr/bin/env node
/**
 * merge-migrate-stack-gap.mjs
 *
 * Thin repo-internal wrapper around the published `dialtone-merge-migrate`
 * CLI (packages/dialtone-css/lib/build/js/dialtone_merge_migrate), scoped to
 * the stack-gap-to-spacing config and this monorepo's root as --cwd.
 *
 * Usage:
 *   node scripts/merge-migrate-stack-gap.mjs [options]
 *
 * Options: same as `dialtone-merge-migrate --config stack-gap-to-spacing`, e.g.
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

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const PINNED_FLAGS = new Set(['--config', '--cwd']);

// Strip any --config/--cwd the caller passed — this wrapper always pins them
// to stack-gap-to-spacing/REPO_ROOT. yargs collects duplicate string flags
// into an array rather than "last wins", so simply appending the pinned
// flags after caller args would corrupt parsing instead of overriding it.
function stripPinnedFlags (args) {
  const result = [];
  for (let i = 0; i < args.length; i++) {
    const [flag] = args[i].split('=');
    if (PINNED_FLAGS.has(flag)) {
      if (!args[i].includes('=')) i++; // also skip the separate value token
      continue;
    }
    result.push(args[i]);
  }
  return result;
}

process.argv = [
  process.argv[0],
  process.argv[1],
  ...stripPinnedFlags(process.argv.slice(2)),
  '--config', 'stack-gap-to-spacing',
  '--cwd', REPO_ROOT,
];

await import(
  '../packages/dialtone-css/lib/build/js/dialtone_merge_migrate/index.mjs'
);
