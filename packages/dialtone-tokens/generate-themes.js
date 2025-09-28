/**
 * Script to automatically generate theme files based on the tokens/theme directory structure.
 * This script scans the tokens/theme directory and generates light and dark theme files for each theme.
 */

import fs from 'fs';
import path from 'path';

const TOKENS_THEME_DIR = './tokens/theme';
const THEMES_OUTPUT_DIR = './themes';

/**
 * Generate theme files for all themes in the tokens/theme directory
 */
export async function generateThemeFiles () {
  console.log('Generating theme files...');

  // Ensure themes directory exists
  if (!fs.existsSync(THEMES_OUTPUT_DIR)) {
    fs.mkdirSync(THEMES_OUTPUT_DIR, { recursive: true });
  }

  // Get all theme directories
  const themeDirs = fs.readdirSync(TOKENS_THEME_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`Found ${themeDirs.length} themes: ${themeDirs.join(', ')}`);

  // Generate theme files for each theme
  for (const theme of themeDirs) {
    await generateThemeFile(theme, 'dark');
    await generateThemeFile(theme, 'light');
  }

  // Generate universal high-contrast theme
  await generateHighContrastTheme();

  console.log('Theme files generation completed.');
}

/**
 * Generate a theme file for a specific theme and mode
 * @param {string} theme - The theme name
 * @param {string} mode - The mode (light or dark)
 */
async function generateThemeFile (theme, mode) {
  const fileName = `${theme}-${mode}.js`;
  const filePath = path.join(THEMES_OUTPUT_DIR, fileName);

  const content = `import Base from '@dialpad/dialtone-tokens/tokens-base-${mode}.css?inline';
import Brand from '@dialpad/dialtone-tokens/tokens-${theme}-${mode}.css?inline';

export default {
  base: {
    css: Base,
    name: '${mode}',
  },
  brand: {
    css: Brand,
    name: '${theme}',
  },
};
`;

  fs.writeFileSync(filePath, content);
  console.log(`Generated ${fileName.replace('.js', '')} theme`);
}

/**
 * Generate the universal high-contrast theme file
 */
async function generateHighContrastTheme () {
  const fileName = 'high-contrast.js';
  const filePath = path.join(THEMES_OUTPUT_DIR, fileName);

  const content = `import Contrast from '@dialpad/dialtone-tokens/tokens-contrast-high.css?inline';

export default {
  css: Contrast,
  name: 'high',
};
`;

  fs.writeFileSync(filePath, content);
  console.log('Generated high-contrast theme');
}
