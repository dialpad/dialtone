/**
 * Shared loaders + helpers for the docs-data generator (generate-data.mjs).
 *
 * These read the *sources of truth* for token-derived docs data:
 *   - dialtone-tokens / dialtone-css PostCSS generator constants (CommonJS)
 *   - the Style Dictionary doc output (packages/dialtone-tokens/dist/doc.json)
 * and write the merged result into apps/dialtone-documentation/docs/_data/.
 *
 * CJS interop uses dynamic import() — per .claude/rules/scripts.md, never `require()` in .mjs.
 * Paths are resolved relative to this file (never process.cwd()) so the script works the same
 * from `node …`, NX, or CI.
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
// …/apps/dialtone-documentation/scripts/data → repo root is four levels up.
const REPO_ROOT = resolve(__dirname, '../../../..');

export const DATA_DIR = resolve(REPO_ROOT, 'apps/dialtone-documentation/docs/_data');
const TOKENS_CONSTANTS = resolve(REPO_ROOT, 'packages/dialtone-tokens/postcss/constants.cjs');

/** Import a CommonJS module from ESM and return its `module.exports`. */
async function importCjs (absPath) {
  const mod = await import(pathToFileURL(absPath).href);
  return mod.default ?? mod;
}

/**
 * z-index levels, in declaration order.
 *
 * The ONLY source of truth is the `Z_INDEX` map in dialtone-tokens/postcss/constants.cjs —
 * z-index has no Style Dictionary token form; the PostCSS plugin injects the `--zi-*` custom
 * properties from this map. (This is also why z-index.json silently drifts today.)
 */
export async function getZIndexLevels () {
  const { Z_INDEX } = await importCjs(TOKENS_CONSTANTS);
  return Object.entries(Z_INDEX).map(([name, value]) => ({ name, value }));
}

/**
 * Write a docs `_data` file as 2-space-indented JSON + trailing newline — matching the
 * formatting of the existing committed files so regeneration produces a minimal diff.
 */
export function writeDataFile (filename, data) {
  const outPath = resolve(DATA_DIR, filename);
  writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  return outPath;
}
