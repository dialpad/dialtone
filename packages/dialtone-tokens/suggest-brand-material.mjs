/**
 * suggest-brand-material.mjs
 *
 * One-shot CLI helper that reads the resolved `--dt-shell-base-color-surface`
 * OKLCH value from each brand's emitted light-mode CSS and suggests the
 * material whose neutral hue tint best harmonizes with that surface.
 *
 * Usage:
 *   node packages/dialtone-tokens/suggest-brand-material.mjs <brand>
 *   node packages/dialtone-tokens/suggest-brand-material.mjs --all
 *   node packages/dialtone-tokens/suggest-brand-material.mjs --all --apply
 *
 * --apply writes `shell.base.material: { value, type }` into
 *   tokens/theme/<brand>/default.json for each brand processed.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Single source of truth for algorithm constants ──────────────────────────

const MATERIAL_HUES = {
  sandstone: 84,
  jade: 251,
  steel: 271,
  graphite: 286,
  amethyst: 290,
};

const THRESHOLDS = {
  hue: 30,
  // Catches only surfaces with essentially zero chroma (e.g. 116/117, C=0.000).
  // 0.01 was the initial guess but fired too early for low-chroma hued brands
  // like 102 (C=0.0095) and 105 (C=0.0052) that the reference table expects
  // to resolve via hue match, not the achromatic rule.
  chroma: 0.002,
};

// Brands that never receive a material lock — absence of shell.base.material
// in their entrypoint means "free choice" for the consumer.
const EXEMPT_BRANDS = new Set(['dp', 'tmo']);

// ─── Core algorithm ──────────────────────────────────────────────────────────

/**
 * Shortest angular distance between two hues on the 360° wheel.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function hueDistance(a, b) {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Given a parsed OKLCH triplet, return the material name that best harmonizes
 * with the surface color.
 *
 * Rules (in order):
 *  1. C < THRESHOLDS.chroma → 'iron' (achromatic surface)
 *  2. Compute shortest angular hue distance to each MATERIAL_HUES anchor.
 *  3. Best distance ≤ THRESHOLDS.hue → return that material.
 *  4. Fallback → 'sandstone'.
 *
 * @param {{ C: number, H: number }} oklch
 * @returns {string}
 */
function pickMaterial({ C, H }) {
  if (C < THRESHOLDS.chroma) return 'iron';

  let bestMaterial = null;
  let bestDist = Infinity;

  for (const [name, anchor] of Object.entries(MATERIAL_HUES)) {
    const dist = hueDistance(H, anchor);
    if (dist < bestDist) {
      bestDist = dist;
      bestMaterial = name;
    }
  }

  return bestDist <= THRESHOLDS.hue ? bestMaterial : 'sandstone';
}

/**
 * Read `dist/css/tokens-<brand>-light.css` and parse the
 * `--dt-shell-base-color-surface` declaration as an OKLCH triplet.
 *
 * Returns `null` if:
 *  - the CSS file doesn't exist
 *  - the property is absent
 *  - the value is a CSS variable reference rather than a literal oklch()
 *
 * @param {string} brandName
 * @returns {{ L: number, C: number, H: number } | null}
 */
function parseShellSurfaceOklch(brandName) {
  const cssPath = path.join(__dirname, `dist/css/tokens-${brandName}-light.css`);
  if (!fs.existsSync(cssPath)) return null;

  const css = fs.readFileSync(cssPath, 'utf8');
  const propMatch = css.match(/--dt-shell-base-color-surface:\s*([^;]+);/);
  if (!propMatch) return null;

  const rawValue = propMatch[1].trim();
  // Accepts: oklch(L C H) or oklch(L C H / α)
  const oklchMatch = rawValue.match(
    /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+)?\s*\)$/i,
  );
  if (!oklchMatch) return null;

  return {
    L: parseFloat(oklchMatch[1]),
    C: parseFloat(oklchMatch[2]),
    H: parseFloat(oklchMatch[3]),
  };
}

/**
 * Suggest a material for the given brand.
 * Returns the material name string, or `null` if the surface token could not
 * be parsed (e.g. it resolves to a CSS variable reference rather than a
 * literal oklch() — see open questions in the shaping doc).
 *
 * @param {string} brandName
 * @returns {string | null}
 */
function suggestMaterial(brandName) {
  const oklch = parseShellSurfaceOklch(brandName);
  if (!oklch) return null;
  return pickMaterial(oklch);
}

// ─── --apply writer ──────────────────────────────────────────────────────────

/**
 * Write (or update) `shell.base.material` in tokens/theme/<brand>/default.json.
 * Preserves 2-space indent and all other keys. The `material` entry is always
 * the first property within `shell.base` to match the pattern established by
 * botany in V1.
 *
 * @param {string} brandName
 * @param {string} materialName
 */
function applyMaterial(brandName, materialName) {
  const jsonPath = path.join(__dirname, `tokens/theme/${brandName}/default.json`);
  if (!fs.existsSync(jsonPath)) {
    console.warn(`[suggest-brand-material] No default.json for ${brandName} — skipped.`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  if (!data.shell) data.shell = {};
  if (!data.shell.base) data.shell.base = {};

  // If the value is already correct, don't write (idempotent).
  if (data.shell.base.material?.value === materialName) return;

  // Rebuild shell.base with material first, then all other existing keys.
  const rest = { ...data.shell.base };
  delete rest.material;
  data.shell.base = {
    material: { value: materialName, type: 'other' },
    ...rest,
  };

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

// ─── Brand enumeration ───────────────────────────────────────────────────────

/**
 * List all brand directories in tokens/theme/ that should be processed:
 * - Excludes dp and tmo (free-choice brands)
 * - Excludes directories with no default.json
 *
 * @returns {string[]}
 */
function listBrands() {
  const themeDir = path.join(__dirname, 'tokens/theme');
  return fs.readdirSync(themeDir)
    .filter(name => {
      if (EXEMPT_BRANDS.has(name)) return false;
      const jsonPath = path.join(themeDir, name, 'default.json');
      return fs.existsSync(jsonPath);
    })
    .sort();
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const isAll = args.includes('--all');
const isApply = args.includes('--apply');
const brandArg = args.find(a => !a.startsWith('--'));

if (!isAll && !brandArg) {
  console.error(
    'Usage:\n' +
    '  node packages/dialtone-tokens/suggest-brand-material.mjs <brand>\n' +
    '  node packages/dialtone-tokens/suggest-brand-material.mjs --all\n' +
    '  node packages/dialtone-tokens/suggest-brand-material.mjs --all --apply',
  );
  process.exit(1);
}

const brands = isAll ? listBrands() : [brandArg];

let hadUnparseable = false;

for (const brand of brands) {
  const material = suggestMaterial(brand);

  if (material === null) {
    const cssPath = `dist/css/tokens-${brand}-light.css`;
    const cssExists = fs.existsSync(path.join(__dirname, cssPath));
    const reason = cssExists
      ? `--dt-shell-base-color-surface is not a literal oklch() in ${cssPath} (CSS variable reference — see open questions in brand-locked-material-shaping.md)`
      : `${cssPath} not found — run pnpm nx run dialtone-tokens:build first`;
    console.warn(`[SKIP] ${brand}: ${reason}`);
    hadUnparseable = true;
    continue;
  }

  console.log(`${brand}: ${material}`);

  if (isApply) {
    applyMaterial(brand, material);
  }
}

if (hadUnparseable) {
  process.exit(2);
}
