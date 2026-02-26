/**
 * Converts all hex color values in dialtone-tokens JSON files to OKLCH format.
 * Handles: regular color values, shadow color fields, and hex values inside gradient strings.
 * Skips: `transparent`, token references (`{...}`), and non-hex values.
 */

import Color from 'colorjs.io';
import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';

const files = globSync('packages/dialtone-tokens/tokens/**/*.json');

let converted = 0;
let skipped = 0;
let gradientColors = 0;

function hexToOklch (hex) {
  if (!hex || !hex.startsWith('#')) return null;
  try {
    const c = new Color(hex).to('oklch');
    const [l, ch, h] = c.coords;
    const a = c.alpha;
    const fmt = (v, d) => +(isNaN(v) ? 0 : v).toFixed(d);
    const base = `oklch(${fmt(l, 4)} ${fmt(ch, 4)} ${fmt(h, 2)})`;
    return a < 1 ? base.slice(0, -1) + ` / ${+a.toFixed(4)})` : base;
  } catch { return null; }
}

function convertGradientHex (gradientStr) {
  return gradientStr.replace(/#[0-9a-fA-F]{6,8}\b/g, (match) => {
    const ok = hexToOklch(match);
    if (ok) {
      gradientColors++;
      return ok;
    }
    return match;
  });
}

function walk (obj) {
  if (!obj || typeof obj !== 'object') return;

  // Handle color type with string value
  if (obj.type === 'color' && typeof obj.value === 'string') {
    const val = obj.value;
    if (val === 'transparent' || val.startsWith('{')) {
      skipped++;
    } else if (val.startsWith('linear-gradient')) {
      obj.value = convertGradientHex(val);
    } else {
      const ok = hexToOklch(val);
      if (ok) {
        obj.value = ok;
        converted++;
      }
    }
  }

  // Handle shadow layers (array of objects with "color" field)
  if (Array.isArray(obj.value)) {
    obj.value.forEach(layer => {
      if (layer.color && typeof layer.color === 'string' && layer.color.startsWith('#')) {
        const ok = hexToOklch(layer.color);
        if (ok) {
          layer.color = ok;
          converted++;
        }
      }
    });
  }

  // Recurse into child objects (skip "value" to avoid double-processing)
  for (const k of Object.keys(obj)) {
    if (k !== 'value' && typeof obj[k] === 'object') walk(obj[k]);
  }
}

for (const f of files) {
  const json = JSON.parse(readFileSync(f, 'utf-8'));
  walk(json);
  writeFileSync(f, JSON.stringify(json, null, 2) + '\n');
}

console.log(`Done. Converted ${converted} color values, ${gradientColors} gradient hex stops, skipped ${skipped} references/transparent.`);
