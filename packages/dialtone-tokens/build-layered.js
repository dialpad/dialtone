/**
 * Builds layered tokens where themes only contain overrides from the base dp theme
 */

/* eslint-disable complexity */

import { promises as fs, readFileSync, writeFileSync } from 'fs';
import { runLayeredTokens } from './build-sd-transforms-layered.js';
import postcss from 'postcss';
import dialtoneTokensPlugin from './postcss/dialtone-tokens.cjs';
import layeredTokensPlugin from './postcss/layered-tokens.cjs';

/**
 * Parse CSS file to extract variables
 */
function parseCssVariables(cssContent) {
  const variables = new Map();
  const selectorRegex = /^(\[data-dt-mode="[^"]+"\]|:root)\s*\{([^}]+)\}/gm;

  let match;
  while ((match = selectorRegex.exec(cssContent)) !== null) {
    const selector = match[1];
    const content = match[2];

    const varRegex = /--([^:]+):\s*([^;]+);/g;
    let varMatch;

    while ((varMatch = varRegex.exec(content)) !== null) {
      const varName = `--${varMatch[1].trim()}`;
      const varValue = varMatch[2].trim();

      if (!variables.has(selector)) {
        variables.set(selector, new Map());
      }
      variables.get(selector).set(varName, varValue);
    }
  }

  return variables;
}

/**
 * Generate CSS with only the differences from base theme
 */
function generateOverridesCss(baseVars, themeVars, themeName) {
  let css = `/**
 * Do not edit directly, this file was auto-generated.
 * Theme: ${themeName}
 * Contains only overrides from base dp theme.
 */

`;

  const selectors = ['[data-dt-mode="light"]', '[data-dt-mode="dark"]'];

  for (const selector of selectors) {
    const baseVarsForSelector = baseVars.get(selector) || new Map();
    const themeVarsForSelector = themeVars.get(selector) || new Map();

    const overrides = [];

    // Find differences
    for (const [varName, varValue] of themeVarsForSelector) {
      const baseValue = baseVarsForSelector.get(varName);
      if (baseValue !== varValue) {
        overrides.push(`  ${varName}: ${varValue};`);
      }
    }

    // Only output selector if there are overrides
    if (overrides.length > 0) {
      const mode = selector.includes('light') ? 'light' : 'dark';
      css += `/* ${mode.charAt(0).toUpperCase() + mode.slice(1)} mode overrides */\n`;
      css += `${selector} {\n`;
      css += `  color-scheme: ${mode};\n`;
      css += overrides.join('\n') + '\n';
      css += '}\n\n';
    }
  }

  return css;
}

/**
 * Run postcss on CSS files to generate composite tokens (typography, shadows)
 */
async function runPostCss(file, useOriginalPlugin = false) {
  // Use original plugin for :root files (core), layered plugin for mode-specific files
  const plugin = useOriginalPlugin ? dialtoneTokensPlugin : layeredTokensPlugin;
  const postCssProcessor = postcss([plugin]);

  const css = readFileSync(file, 'utf8');
  const result = await postCssProcessor.process(css, { from: file, to: file });
  writeFileSync(file, result.css);
}

/**
 * Main function to generate optimized theme files
 *
 * Process overview:
 * 1. Generate FULL theme files (~640KB each) using Style Dictionary
 * 2. Compare each theme to DP base and extract only the differences
 * 3. Write tiny override files (0.5KB each) to themes/ directory
 * 4. Delete the full theme files (we only needed them for comparison)
 *
 * Why not just output diffs directly? Style Dictionary's architecture makes
 * this extremely complex. Easier to generate full files, calculate diffs, then clean up.
 */
async function main() {
  console.log('Step 1: Generating full layered tokens for all themes...\n');

  // Generate all the layered tokens (full files, we'll strip these down later)
  await runLayeredTokens();

  console.log('\nStep 1b: Running postcss to generate composite tokens...\n');

  const outputDir = 'dist/css/layered';

  // Run postcss on files - use original plugin for :root, layered plugin for mode-specific
  await runPostCss(`${outputDir}/tokens-core.css`, true); // Original plugin for :root
  await runPostCss(`${outputDir}/tokens-base-colors.css`, false); // Layered plugin for [data-dt-mode]
  await runPostCss(`${outputDir}/tokens-dp-colors.css`, false); // Layered plugin for [data-dt-mode]

  console.log('Generated composite tokens (typography, shadows)');

  console.log('\nStep 2: Generating optimized override files...\n');

  // Read the base dp theme (this is what we compare against)
  const dpContent = await fs.readFile(`${outputDir}/tokens-dp-colors.css`, 'utf8');
  const dpVars = parseCssVariables(dpContent);

  // Get all theme files (the full ~640KB files we just generated)
  const files = await fs.readdir(outputDir);
  const themeFiles = files.filter(f =>
    f.startsWith('tokens-') &&
    f.endsWith('-colors.css') &&
    f !== 'tokens-dp-colors.css' &&
    f !== 'tokens-base-colors.css',
  );

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  // For each theme: compare to DP base and extract only the differences
  for (const themeFile of themeFiles) {
    const themeName = themeFile.replace('tokens-', '').replace('-colors.css', '');

    // Read the full theme file
    const themeContent = await fs.readFile(`${outputDir}/${themeFile}`, 'utf8');
    const themeVars = parseCssVariables(themeContent);

    // Generate CSS with ONLY the tokens that differ from DP base
    const overridesCss = generateOverridesCss(dpVars, themeVars, themeName);

    // Write to themes directory
    const themesDir = `${outputDir}/themes`;
    await fs.mkdir(themesDir, { recursive: true });
    const themesFile = `${themesDir}/${themeFile}`;
    await fs.writeFile(themesFile, overridesCss);

    const originalSize = Buffer.byteLength(themeContent, 'utf8');
    const optimizedSize = Buffer.byteLength(overridesCss, 'utf8');

    totalOriginalSize += originalSize;
    totalOptimizedSize += optimizedSize;

    const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
    console.log(`${themeName.padEnd(20)} ${(originalSize / 1024).toFixed(2)}KB → ${(optimizedSize / 1024).toFixed(2)}KB (${reduction}% reduction)`);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Total reduction: ${((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1)}%`);
  console.log(`Original total: ${(totalOriginalSize / 1024).toFixed(2)}KB`);
  console.log(`Optimized total: ${(totalOptimizedSize / 1024).toFixed(2)}KB`);
  console.log(`Savings: ${((totalOriginalSize - totalOptimizedSize) / 1024).toFixed(2)}KB`);

  // Step 3: Delete the full theme files (we only needed them to calculate diffs)
  console.log('\nStep 3: Cleaning up redundant full theme files...\n');

  // Keep only the base layers. Delete everything else.
  // All theme overrides are now in themes/ directory as tiny files.
  let deletedCount = 0;
  const filesToKeep = ['tokens-core.css', 'tokens-base-colors.css', 'tokens-dp-colors.css'];

  for (const file of await fs.readdir(outputDir)) {
    const shouldDelete = file.startsWith('tokens-') &&
                        file.endsWith('.css') &&
                        !filesToKeep.includes(file);

    if (shouldDelete) {
      await fs.unlink(`${outputDir}/${file}`);
      deletedCount++;
    }
  }

  console.log(`Removed ${deletedCount} redundant full theme files (saved ~${(deletedCount * 640).toFixed(0)}KB)`);

  // Step 4: Process high contrast files and combine light/dark
  console.log('\nStep 4: Processing high contrast overrides...\n');

  const contrastDir = `${outputDir}/contrast`;
  try {
    const contrastFiles = await fs.readdir(contrastDir);

    // Combine high-light and high-dark into a single file with selectors
    const highLightFile = contrastFiles.find(f => f.includes('high-light'));
    const highDarkFile = contrastFiles.find(f => f.includes('high-dark'));

    if (highLightFile && highDarkFile) {
      const lightContent = await fs.readFile(`${contrastDir}/${highLightFile}`, 'utf8');
      const darkContent = await fs.readFile(`${contrastDir}/${highDarkFile}`, 'utf8');

      const extractVars = (content) => {
        const match = content.match(/:root\s*\{([^}]+)\}/s);
        if (!match) return '';
        return match[1].trim().split('\n')
          .filter(line => line.trim() && !line.includes('color-scheme'))
          .map(line => '  ' + line.trim())
          .join('\n');
      };

      const lightVars = extractVars(lightContent);
      const darkVars = extractVars(darkContent);

      const combined = `/**
 * Do not edit directly, this file was auto-generated.
 * High contrast overrides for both light and dark modes
 */

/* High contrast - Light mode */
[data-dt-mode="light"][data-dt-contrast="high"] {
${lightVars}
}

/* High contrast - Dark mode */
[data-dt-mode="dark"][data-dt-contrast="high"] {
${darkVars}
}`;

      await fs.writeFile(`${contrastDir}/tokens-high-contrast.css`, combined);
      await fs.unlink(`${contrastDir}/${highLightFile}`);
      await fs.unlink(`${contrastDir}/${highDarkFile}`);

      console.log('Generated high contrast override file');
    }
  } catch {
    console.log('No high contrast files found, skipping...');
  }

  console.log('\n✅ Optimized build complete!');
  console.log('\nFinal structure:');
  console.log('  dist/css/layered/');
  console.log('    ├── tokens-core.css (50KB) ← typography, spacing, components');
  console.log('    ├── tokens-base-colors.css (177KB)');
  console.log('    ├── tokens-dp-colors.css (628KB) ← base theme');
  console.log('    ├── themes/ (51 override files)');
  console.log('    └── contrast/');
  console.log('        └── tokens-high-contrast.css ← high contrast overrides');
}

// Export for use in build.js
export { main as buildLayeredTokens };

// Auto-run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
