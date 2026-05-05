/**
 * Script to automatically generate theme files using the NEW LAYERED TOKEN SYSTEM.
 * Replaces the old system entirely - generates theme files that reference layered tokens.
 */

import fs from 'fs';
import path from 'path';
import { NON_DEFAULT_MATERIALS } from './build-material-overrides.js';

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

  // Generate per-material override themes (V2 — runtime material switching)
  await generateMaterialThemeFiles();

  console.log('Layered theme files generated - OLD SYSTEM REPLACED');
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
 * Generate a brand override theme file
 * @param {string} brandName - The brand name (e.g., 'tmo', 'sunflower')
 */
async function generateBrandThemeFile(brandName) {
  const fileName = `${brandName}.js`;
  const filePath = path.join(THEMES_OUTPUT_DIR, fileName);

  const content = `import BrandColors from '@dialpad/dialtone-tokens/layered/themes/tokens-${brandName}-colors.css?inline';

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

/**
 * Generate per-material override theme files. Iterates the canonical
 * `NON_DEFAULT_MATERIALS` list exported from `build-material-overrides.js` so
 * the CSS emitter and the runtime entrypoint generator stay in lockstep.
 * Sandstone is the default and ships baked into base CSS, so it doesn't get a file.
 * Stale `material-*.js` files in THEMES_OUTPUT_DIR are removed before generation
 * so a renamed/dropped material can't leave a shipped artifact behind.
 */
async function generateMaterialThemeFiles() {
  // Prune stale material-*.js entrypoints (e.g. from a renamed/removed material).
  for (const file of fs.readdirSync(THEMES_OUTPUT_DIR)) {
    if (file.startsWith('material-') && file.endsWith('.js')) {
      fs.unlinkSync(path.join(THEMES_OUTPUT_DIR, file));
    }
  }

  for (const name of NON_DEFAULT_MATERIALS) {
    const cssPath = path.join(LAYERED_CSS_DIR, 'material', `tokens-${name}.css`);
    if (!fs.existsSync(cssPath)) {
      throw new Error(`Missing override CSS for material '${name}' at ${cssPath}. Did buildMaterialOverrides() run first?`);
    }
    const filePath = path.join(THEMES_OUTPUT_DIR, `material-${name}.js`);
    const content = `import MaterialCss from '@dialpad/dialtone-tokens/layered/material/tokens-${name}.css?inline';

export default {
  material: {
    css: MaterialCss,
    name: '${name}',
  },
};
`;
    fs.writeFileSync(filePath, content);
    console.log(`Generated material-${name} theme`);
  }
}
