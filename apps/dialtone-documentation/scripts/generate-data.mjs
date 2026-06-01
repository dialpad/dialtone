#!/usr/bin/env node
/**
 * Generate token-derived docs data files in apps/dialtone-documentation/docs/_data/.
 *
 * Each emitter reads the source of truth (Style Dictionary token output + the dialtone-tokens /
 * dialtone-css PostCSS generator constants) and merges a small hand-maintained metadata schema
 * (data/metadata.mjs). The emitted JSON replaces the values that used to be hand-copied into
 * _data/, so the documented scales can no longer drift from the tokens.
 *
 * Idempotent: running it twice on an unchanged tree produces no diff. Wired into the docs build
 * via the `gen-data` NX target (dependsOn dialtone-tokens:build), and guarded by a pre-commit
 * hook + a CI check that regenerates and fails on any diff.
 *
 * Usage: node apps/dialtone-documentation/scripts/generate-data.mjs
 */
import { writeDataFile } from './data/token-values.mjs';
import * as zIndex from './data/emit-z-index.mjs';
import * as iconsSizes from './data/emit-icons-sizes.mjs';
import * as gap from './data/emit-gap.mjs';

// Each emitter exposes `{ file, build() }`. Add new emitters here.
const emitters = [zIndex, iconsSizes, gap];

async function main () {
  for (const emitter of emitters) {
    const data = await emitter.build();
    const count = Array.isArray(data) ? data.length : Object.keys(data).length;
    const outPath = writeDataFile(emitter.file, data);
    console.info(`gen-data: wrote ${emitter.file} (${count} entries) → ${outPath}`);
  }
}

main().catch((err) => {
  console.error('gen-data failed:', err);
  process.exit(1);
});
