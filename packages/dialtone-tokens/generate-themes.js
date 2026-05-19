/**
 * Generate per-theme `.js` entrypoints that re-export the layered CSS as inline
 * strings. Each entrypoint is consumed by the runtime setMode/setBrand/
 * setContrast APIs in `themes/config.js`. Material switching is attribute-only
 * (driven by `data-dt-material` against pre-bundled per-material CSS) and does
 * not generate JS entrypoints.
 */

import fs from 'fs';
import path from 'path';

const LAYERED_CSS_DIR = './dist/css/layered';
const THEMES_OUTPUT_DIR = './themes';

export async function generateThemeFiles () {
  console.log('Generating layered theme files...');

  // Ensure themes directory exists
  if (!fs.existsSync(THEMES_OUTPUT_DIR)) {
    fs.mkdirSync(THEMES_OUTPUT_DIR, { recursive: true });
  }

  // Generate core theme file (shared across all brands)
  await generateCoreThemeFile();

  // Generate DP base theme
  await generateDpThemeFile();

  // Generate brand override themes
  const themesDir = path.join(LAYERED_CSS_DIR, 'themes');
  if (fs.existsSync(themesDir)) {
    const themeFiles = fs.readdirSync(themesDir)
      .filter(f => f.endsWith('-colors.css'))
      .map(f => f.replace('tokens-', '').replace('-colors.css', ''));

    for (const themeName of themeFiles) {
      await generateBrandThemeFile(themeName);
    }
  }

  // Generate high contrast theme
  await generateHighContrastTheme();

  console.log('Layered theme files generated');
}

/**
 * Generate core theme file (contains core tokens + base colors)
 */
async function generateCoreThemeFile() {
  const filePath = path.join(THEMES_OUTPUT_DIR, 'core.js');

  const content = `import CoreTokens from '@dialpad/dialtone-tokens/layered/tokens-core.css?inline';
import BaseColors from '@dialpad/dialtone-tokens/layered/tokens-base-colors.css?inline';

export default {
  core: CoreTokens,
  baseColors: BaseColors,
};
`;

  fs.writeFileSync(filePath, content);
  console.log('Generated core theme file');
}

/**
 * Generate DP base theme file
 */
async function generateDpThemeFile() {
  const filePath = path.join(THEMES_OUTPUT_DIR, 'dp.js');

  const content = `import DpColors from '@dialpad/dialtone-tokens/layered/tokens-dp-colors.css?inline';

export default {
  brand: {
    css: DpColors,
    name: 'dp',
  },
};
`;

  fs.writeFileSync(filePath, content);
  console.log('Generated dp theme file');
}

/**
 * Read the declared material lock for a brand from its source token JSON.
 * Returns the material name string (e.g. "sandstone") or null if the brand
 * does not declare a lock OR has no source JSON (e.g. CSS-only variants like
 * `expressive-sm` whose CSS is generated from a parent brand).
 * @param {string} brandName
 * @returns {string|null}
 */
function readBrandMaterial(brandName) {
  const jsonPath = `./tokens/theme/${brandName}/default.json`;
  if (!fs.existsSync(jsonPath)) return null;
  return JSON.parse(fs.readFileSync(jsonPath, 'utf8')).shell?.base?.material?.value ?? null;
}

/**
 * Generate a brand override theme file
 * @param {string} brandName - The brand name (e.g., 'tmo', 'sunflower')
 */
async function generateBrandThemeFile(brandName) {
  const fileName = `${brandName}.js`;
  const filePath = path.join(THEMES_OUTPUT_DIR, fileName);

  const materialName = readBrandMaterial(brandName);
  const materialExport = materialName
    ? `  material: {\n    name: '${materialName}',\n  },\n`
    : '';

  const content = `import BrandColors from '@dialpad/dialtone-tokens/layered/themes/tokens-${brandName}-colors.css?inline';

export default {
  brand: {
    css: BrandColors,
    name: '${brandName}',
  },
${materialExport}};
`;

  fs.writeFileSync(filePath, content);
  console.log(`Generated ${brandName} theme`);
}

/**
 * Generate high contrast theme file
 */
async function generateHighContrastTheme() {
  const filePath = path.join(THEMES_OUTPUT_DIR, 'high-contrast.js');

  const content = `import HighContrast from '@dialpad/dialtone-tokens/layered/contrast/tokens-high-contrast.css?inline';

export default {
  contrast: {
    css: HighContrast,
    name: 'high',
  },
};
`;

  fs.writeFileSync(filePath, content);
  console.log('Generated high-contrast theme');
}

