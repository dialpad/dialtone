/**
 * Script to automatically generate theme files using the NEW LAYERED TOKEN SYSTEM.
 * Replaces the old system entirely - generates theme files that reference layered tokens.
 */

import fs from 'fs';
import path from 'path';

const LAYERED_CSS_DIR = './dist/css/layered';
const THEMES_OUTPUT_DIR = './themes';

/**
 * Generate theme files for all themes (LAYERED SYSTEM)
 */
export async function generateThemeFiles () {
  console.log('Generating layered theme files (DIRECT REPLACEMENT)...');

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

  console.log('Layered theme files generated - OLD SYSTEM REPLACED');
}

/**
 * Generate core theme file (contains core tokens + base colors)
 */
async function generateCoreThemeFile() {
  const filePath = path.join(THEMES_OUTPUT_DIR, 'core.js');

  const content = `import CoreTokens from '@dialpad/dialtone-tokens/dist/css/layered/tokens-core.css?inline';
import BaseColors from '@dialpad/dialtone-tokens/dist/css/layered/tokens-base-colors.css?inline';

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

  const content = `import DpColors from '@dialpad/dialtone-tokens/dist/css/layered/tokens-dp-colors.css?inline';

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
 * Generate a brand override theme file
 * @param {string} brandName - The brand name (e.g., 'tmo', 'sunflower')
 */
async function generateBrandThemeFile(brandName) {
  const fileName = `${brandName}.js`;
  const filePath = path.join(THEMES_OUTPUT_DIR, fileName);

  const content = `import BrandColors from '@dialpad/dialtone-tokens/dist/css/layered/themes/tokens-${brandName}-colors.css?inline';

export default {
  brand: {
    css: BrandColors,
    name: '${brandName}',
  },
};
`;

  fs.writeFileSync(filePath, content);
  console.log(`Generated ${brandName} theme`);
}

/**
 * Generate high contrast theme file
 */
async function generateHighContrastTheme() {
  const filePath = path.join(THEMES_OUTPUT_DIR, 'high-contrast.js');

  const content = `import HighContrast from '@dialpad/dialtone-tokens/dist/css/layered/contrast/tokens-high-contrast.css?inline';

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
