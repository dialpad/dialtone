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
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
// …/apps/dialtone-documentation/scripts/data → repo root is four levels up.
const REPO_ROOT = resolve(__dirname, '../../../..');

export const DATA_DIR = resolve(REPO_ROOT, 'apps/dialtone-documentation/docs/_data');
const TOKENS_CONSTANTS = resolve(REPO_ROOT, 'packages/dialtone-tokens/postcss/constants.cjs');
const ROOT_TOKENS = resolve(REPO_ROOT, 'packages/dialtone-tokens/tokens/root.json');
const ICON_TOKENS = resolve(REPO_ROOT, 'packages/dialtone-tokens/tokens/components/icon/default.json');

/** Import a CommonJS module from ESM and return its `module.exports`. */
async function importCjs (absPath) {
  const mod = await import(pathToFileURL(absPath).href);
  return mod.default ?? mod;
}

/** Read + parse a JSON file. */
function loadJson (absPath) {
  return JSON.parse(readFileSync(absPath, 'utf-8'));
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
 * Icon sizes, in declaration order.
 *
 * The stops + multipliers are token source (tokens/components/icon/default.json, each value
 * `"{size.base} * N"`); the resolved px = `size.base` (root.json, 8px) × N. The `border`
 * sub-scale is excluded — it's not part of the icon-size docs table. Returns `{ size, px }`.
 * (Style Dictionary's dist output leaves these as unresolved `calc()`, so we resolve from source.)
 */
export function getIconSizes () {
  const sizeBase = parseFloat(loadJson(ROOT_TOKENS).size.base.value); // "8px" → 8
  const { icon } = loadJson(ICON_TOKENS);
  const sizes = [];
  for (const [stop, def] of Object.entries(icon.size)) {
    if (stop === 'border') continue;
    const match = /^\{size\.base\}\s*\*\s*([\d.]+)$/.exec(def.value);
    if (!match) {
      throw new Error(`icon-size "${stop}": unexpected token value "${def.value}" (expected "{size.base} * N")`);
    }
    sizes.push({ size: stop, px: sizeBase * parseFloat(match[1]) });
  }
  return sizes;
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
