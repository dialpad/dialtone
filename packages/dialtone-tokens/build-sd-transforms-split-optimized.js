/**
 * Builds optimized split tokens where themes only contain overrides from the base dp theme
 */

 

import { promises as fs, readFileSync, writeFileSync } from 'fs';
import { runSplitTokens } from './build-sd-transforms-split.js';
import postcss from 'postcss';
import dialtoneTokensPlugin from './postcss/dialtone-tokens.cjs';

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
async function runPostCss(filesOrDirectory) {
  const postCssProcessor = postcss([dialtoneTokensPlugin]);
  let files = Array.isArray(filesOrDirectory) ? filesOrDirectory : [filesOrDirectory];

  if (!Array.isArray(filesOrDirectory)) {
    const stat = await fs.stat(filesOrDirectory);
    if (stat.isDirectory()) {
      const dirFiles = await fs.readdir(filesOrDirectory);
      files = dirFiles
        .filter(f => f.endsWith('.css'))
        .map(f => `${filesOrDirectory}/${f}`);
    }
  }

  for (const file of files) {
    const css = readFileSync(file, 'utf8');
    const result = await postCssProcessor.process(css, { from: file, to: file });
    writeFileSync(file, result.css);
  }
}

/**
 * Main function to generate optimized theme files
 */
async function main() {
  console.log('Step 1: Generating full split tokens for all themes...\n');

  // First, generate all the split tokens
  await runSplitTokens();

  console.log('\nStep 1b: Running postcss to generate composite tokens...\n');

  const outputDir = 'dist/css/split';

  // Run postcss on the core files to generate typography/shadow composites
  await runPostCss([
    `${outputDir}/tokens-core.css`,
    `${outputDir}/tokens-base-colors.css`,
    `${outputDir}/tokens-dp-colors.css`,
  ]);

  console.log('Generated composite tokens (typography, shadows)');

  console.log('\nStep 2: Generating optimized override files...\n');

  // Read the base dp theme
  const dpContent = await fs.readFile(`${outputDir}/tokens-dp-colors.css`, 'utf8');
  const dpVars = parseCssVariables(dpContent);

  // Get all theme files
  const files = await fs.readdir(outputDir);
  const themeFiles = files.filter(f =>
    f.startsWith('tokens-') &&
    f.endsWith('-colors.css') &&
    f !== 'tokens-dp-colors.css' &&
    f !== 'tokens-base-colors.css',
  );

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (const themeFile of themeFiles) {
    const themeName = themeFile.replace('tokens-', '').replace('-colors.css', '');

    // Read theme file
    const themeContent = await fs.readFile(`${outputDir}/${themeFile}`, 'utf8');
    const themeVars = parseCssVariables(themeContent);

    // Generate overrides only
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

  // Step 3: Clean up redundant full theme files (keep only dp, base, core files)
  console.log('\nStep 3: Cleaning up redundant full theme files...\n');

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

  console.log(`Removed ${deletedCount} redundant full theme files`);
  console.log('\n✅ Optimized build complete!');
  console.log('\nFinal structure:');
  console.log('  dist/css/split/');
  console.log('    ├── tokens-core.css (64KB) ← typography, spacing, components');
  console.log('    ├── tokens-base-colors.css (23KB)');
  console.log('    ├── tokens-dp-colors.css (89KB) ← base theme');
  console.log('    └── themes/');
  console.log('        ├── tokens-tmo-colors.css (0.54KB)');
  console.log('        ├── tokens-sunflower-colors.css (4.15KB)');
  console.log('        └── ... 49 more theme files ...');
}

main().catch(console.error);
