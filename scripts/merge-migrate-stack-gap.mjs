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

process.argv = [
  process.argv[0],
  process.argv[1],
  '--config', 'stack-gap-to-spacing',
  '--cwd', REPO_ROOT,
  ...process.argv.slice(2),
];

await import(
  '../packages/dialtone-css/lib/build/js/dialtone_merge_migrate/index.mjs'
);
