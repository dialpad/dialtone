/**
 * Builds layered tokens where themes only contain overrides from the base dp theme
 */

import { promises as fs, readFileSync, writeFileSync } from 'fs';
import { runLayeredTokens } from './build-sd-transforms-layered.js';
import postcss from 'postcss';
import dialtoneTokensPlugin from './postcss/dialtone-tokens.cjs';
import layeredTokensPlugin from './postcss/layered-tokens.cjs';

/**
 * Parse CSS file to extract variables
 *
 * Pulls all CSS custom properties from a file and organizes them by selector.
 * Returns a Map where keys are selectors (:root, [data-dt-mode="light"], etc)
 * and values are Maps of variable names to values.
 *
 * Example:
 *   Input: :root { --color-primary: blue; }
 *   Output: Map { ':root' => Map { '--color-primary' => 'blue' } }
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
 *
 * Compares a theme against base DP and creates a file with ONLY the different variables.
 * This is the key optimization. Instead of storing full 640KB files, we store tiny
 * overrides (usually 0.5KB each).
 *
 * Steps:
 * 1. Loop through light and dark mode selectors
 * 2. Check each variable against base DP
 * 3. Only include variables that differ
 * 4. Keep color-scheme property for accessibility
 *
 * Benefit: When base DP changes, override files stay small and accurate.
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
 *
 * Takes raw token variables and combines them into composite tokens.
 * Example: individual spacing variables get combined into typography classes.
 *
 * Two plugins:
 * - dialtoneTokensPlugin: For :root files (core tokens). Full composite set.
 * - layeredTokensPlugin: For [data-dt-mode] files. Only processes layered selectors.
 *
 * Keeps core tokens separate from theme-specific tokens.
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
 * Step 1: Generate full token files for all themes
 *
 * First phase of the build:
 * 1. Use Style Dictionary to generate complete files for every theme (~640KB each)
 * 2. Run PostCSS plugins on base files to create composite tokens (typography, shadows)
 *
 * These full files are temporary. We'll use them in Step 2 to find differences,
 * then delete them in Step 3.
 *
 * Why generate full files? Style Dictionary can't easily output only diffs.
 * Easier to generate complete files, extract differences, then clean up.
 */
async function generateFullTokens(outputDir) {
  console.log('Step 1: Generating full layered tokens for all themes...\n');

  // Generate all the layered tokens (full files, we'll strip these down later)
  await runLayeredTokens();

  console.log('\nStep 1b: Running postcss to generate composite tokens...\n');

  // Run postcss on base files
  await runPostCss(`${outputDir}/tokens-core.css`, true); // Original plugin for :root
  await runPostCss(`${outputDir}/tokens-base-colors.css`, false); // Layered plugin for [data-dt-mode]
  await runPostCss(`${outputDir}/tokens-dp-colors.css`, false); // Layered plugin for [data-dt-mode]

  console.log('Generated composite tokens (typography, shadows)');
}

/**
 * Step 2: Generate optimized theme overrides
 *
 * Core optimization step. For each theme from Step 1:
 * 1. Parse the full file to get all variables
 * 2. Compare each variable to base DP
 * 3. Build a new file with ONLY the different variables
 * 4. Write slim override file (usually 0.5KB) to themes/ directory
 *
 * Result: 95%+ file size reduction. A 640KB file becomes 3KB.
 *
 * Tracks stats (original vs optimized size) for the build summary.
 * These override files are what users actually import.
 */
async function generateThemeOverrides(outputDir) {
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

  return {
    totalOriginalSize,
    totalOptimizedSize,
    themeCount: themeFiles.length,
  };
}

/**
 * Step 3: Clean up full theme files
 *
 * Removes temporary full theme files (~640KB each) from Steps 1 and 2.
 * They served their purpose (comparison), so we don't need them anymore.
 *
 * Keeps only base layers:
 * - tokens-core.css (core/non-themeable tokens)
 * - tokens-base-colors.css (base color definitions)
 * - tokens-dp-colors.css (default theme)
 *
 * All theme data now lives in themes/ as small override files.
 * Saves ~640KB per deleted file.
 */
async function cleanupFullThemeFiles(outputDir) {
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
  return deletedCount;
}

/**
 * Step 4: Process high contrast files
 *
 * Style Dictionary generates separate light and dark high contrast files.
 * This combines them into one organized file.
 *
 * Process:
 * 1. Find high-light and high-dark files in contrast/ directory
 * 2. Extract variables from each (remove :root selector)
 * 3. Combine into one file with [data-dt-mode] and [data-dt-contrast] selectors
 * 4. Delete the original files
 *
 * Result: Single tokens-high-contrast.css supporting both modes.
 * Skipped if files don't exist.
 */
async function processHighContrast(outputDir) {
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
}

/**
 * Output build summary
 *
 * Shows a readable summary of what got built.
 *
 * Includes:
 * - Output location (dist/css/layered/)
 * - Core token files with sizes
 * - Number of theme override files
 * - High contrast location
 *
 * Gives visibility into build output without exploring files manually.
 */
function outputBuildSummary(stats) {
  console.log('\n✅ Optimized build complete!');
  console.log('\nFinal structure:');
  console.log('  dist/css/layered/');
  console.log('    ├── tokens-core.css (50KB) [typography, spacing, components]');
  console.log('    ├── tokens-base-colors.css (177KB)');
  console.log('    ├── tokens-dp-colors.css (628KB) [base theme]');
  console.log(`    ├── themes/ (${stats.themeCount} override files)`);
  console.log('    └── contrast/');
  console.log('        └── tokens-high-contrast.css [high contrast overrides]');
}

/**
 * Main function to generate optimized theme files
 *
 * Runs the complete layered token build. Multi-step workflow to optimize
 * CSS token file sizes while keeping full functionality.
 *
 * Steps:
 * 1. generateFullTokens()
 *    Generate full theme files (~640KB each) with Style Dictionary. Temporary.
 *
 * 2. generateThemeOverrides()
 *    Compare each theme to DP base, extract ONLY differences.
 *    Write tiny override files (~0.5KB) to themes/ directory.
 *    Track stats (usually 95%+ reduction).
 *
 * 3. cleanupFullThemeFiles()
 *    Delete temporary full files.
 *
 * 4. processHighContrast()
 *    Combine high-light and high-dark into one file.
 *
 * 5. outputBuildSummary()
 *    Show what got built and where to find it.
 *
 * Why not output diffs directly?
 * Style Dictionary can't easily output only differences. Simpler to generate
 * complete files, calculate diffs, then discard temps.
 */
async function buildLayeredTokens() {
  const outputDir = 'dist/css/layered';

  await generateFullTokens(outputDir);
  const stats = await generateThemeOverrides(outputDir);
  await cleanupFullThemeFiles(outputDir);
  await processHighContrast(outputDir);
  outputBuildSummary(stats);
}

// Export for use in build.js
export { buildLayeredTokens };

// Auto-run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildLayeredTokens().catch(console.error);
}
