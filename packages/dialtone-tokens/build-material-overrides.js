/**
 * Emit per-material override CSS files for V2 runtime material switching.
 *
 * For each non-default material (steel, graphite, iron), reads the ramp values
 * from `tokens/base/refs/{default,dark}.json` and writes a CSS file that
 * re-binds `--dt-color-black-N` (light values to `:root`, dark values under
 * `[data-dt-mode="dark"]`). Sandstone is the default and ships baked into the
 * base CSS, so it doesn't need an override file.
 *
 * Output: `dist/css/layered/material/tokens-{material}.css`
 *
 * The `setMaterial()` runtime API in `themes/config.js` injects one of these
 * files via `<style id="dialtone-css-material">`. Tokens whose value is
 * relative-color syntax (`oklch(from var(--dt-color-black-N) l c h / α)`,
 * emitted by the V1 build pipeline) re-derive automatically when this binding
 * changes — no per-token reload needed.
 */

import { promises as fs, readFileSync } from 'fs';
import path from 'path';

const REFS_LIGHT = './tokens/base/refs/default.json';
const REFS_DARK = './tokens/base/refs/dark.json';
const OUTPUT_DIR = './dist/css/layered/material/';
const NON_DEFAULT_MATERIALS = ['steel', 'graphite', 'iron'];

function readRamp (file, material) {
  const json = JSON.parse(readFileSync(file, 'utf8'));
  const ramp = json?.material?.[material];
  if (!ramp) throw new Error(`material.${material} not found in ${file}`);
  return Object.entries(ramp).map(([stop, { value }]) => [stop, value]);
}

function buildCss (material) {
  const light = readRamp(REFS_LIGHT, material);
  const dark = readRamp(REFS_DARK, material);
  const lightVars = light.map(([stop, value]) => `  --dt-color-black-${stop}: ${value};`).join('\n');
  const darkVars = dark.map(([stop, value]) => `  --dt-color-black-${stop}: ${value};`).join('\n');
  // Use [data-dt-mode="light"] (NOT :root) so a nested mode island that flips
  // to light inside a dark root still picks up the light values. The :root
  // selector only matches <html> and doesn't re-resolve at descendant scopes,
  // which means light-inside-dark inheritance fails for material overrides.
  // Matches the selector pattern used by the base ramp CSS.
  return `/**\n * Material override: ${material}\n * Re-binds --dt-color-black-* so V1 relative-color tokens follow this ramp.\n * Do not edit directly, this file was auto-generated.\n */

[data-dt-mode="light"] {
${lightVars}
}

[data-dt-mode="dark"] {
${darkVars}
}
`;
}

export async function buildMaterialOverrides () {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  for (const material of NON_DEFAULT_MATERIALS) {
    const out = path.join(OUTPUT_DIR, `tokens-${material}.css`);
    await fs.writeFile(out, buildCss(material));
    console.log(`Generated ${out}`);
  }
}
