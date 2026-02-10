/**
 * Updates the token JSON files with generated color palettes.
 * Preserves all non-color content (fonts, sizes, shadows, etc.).
 * Handles the stop mapping for references in theme/component files.
 */

import { readFileSync, writeFileSync } from 'fs';
import { generateAll, toTokenJson } from './generate-color-palette.mjs';

const BASE_DIR = './packages/dialtone-tokens/tokens/base';

// ============================================================================
// Generate palettes
// ============================================================================

const { light, dark } = generateAll();

// ============================================================================
// Update default.json (light mode)
// ============================================================================

const defaultJson = JSON.parse(readFileSync(`${BASE_DIR}/default.json`, 'utf8'));

// Replace color palettes with standardized versions
const colorOrder = ['neutral', 'black', 'purple', 'blue', 'magenta', 'gold', 'green', 'red', 'tan', 'berry', 'coral', 'olive', 'teal', 'indigo', 'gradient', 'brand'];

const newLightColors = {};

// Keep neutral as-is
newLightColors.neutral = defaultJson.color.neutral;

// Replace all chromatic and neutral scale palettes
for (const [name, palette] of Object.entries(light)) {
  newLightColors[name] = toTokenJson(palette);
}

// Keep gradient as-is
newLightColors.gradient = defaultJson.color.gradient;

// Keep brand as-is (brand tokens are independent of the palette)
newLightColors.brand = defaultJson.color.brand;

// Build the new default.json preserving all non-color content
const newDefaultJson = { ...defaultJson, color: newLightColors };

writeFileSync(
  `${BASE_DIR}/default.json`,
  JSON.stringify(newDefaultJson, null, 2) + '\n',
);
console.log('Updated default.json');

// ============================================================================
// Update dark.json (dark mode)
// ============================================================================

const darkJson = JSON.parse(readFileSync(`${BASE_DIR}/dark.json`, 'utf8'));

const newDarkColors = {};

// Replace all palettes
for (const [name, palette] of Object.entries(dark)) {
  newDarkColors[name] = toTokenJson(palette);
}

// Keep gradient if it exists in dark
if (darkJson.color.gradient) {
  newDarkColors.gradient = darkJson.color.gradient;
}

// Build new dark.json preserving non-color content
const newDarkJson = { ...darkJson, color: newDarkColors };

writeFileSync(
  `${BASE_DIR}/dark.json`,
  JSON.stringify(newDarkJson, null, 2) + '\n',
);
console.log('Updated dark.json');

// ============================================================================
// Report stop mapping for reference updates
// ============================================================================

// Map old non-standard stops to new standard stops
const STOP_MAPPING = {
  // Old stop → New stop (nearest standard stop)
  '250': '300',  // 250 → 300 (both in lighter mid-range)
  '350': '400',  // 350 → 400 (mid-range)
  '425': '400',  // 425 → 400 (just above 400)
  '450': '500',  // 450 → 500 (between 400 and 500, mapped to 500 for better semantic mapping)
  '475': '500',  // 475 → 500 (close to 500)
  '550': '600',  // 550 → 600 (between 500 and 600)
};

console.log('\nStop mapping for reference updates:');
for (const [old, newStop] of Object.entries(STOP_MAPPING)) {
  console.log(`  ${old} → ${newStop}`);
}

// Generate sed-compatible patterns for batch updates
console.log('\nReference update patterns:');
const colors = ['purple', 'blue', 'magenta', 'gold', 'green', 'red'];
for (const [oldStop, newStop] of Object.entries(STOP_MAPPING)) {
  for (const color of colors) {
    console.log(`  color.${color}.${oldStop} → color.${color}.${newStop}`);
  }
}
