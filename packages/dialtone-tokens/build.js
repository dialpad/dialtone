/**
 * Builds tokens via sd-transforms, runs postcss and outputs documentation for all tokens.
 */

import { writeDocs } from './build-docs.js';
import { run as runSdTransforms } from './build-sd-transforms.js';
import { generateThemeFiles } from './generate-themes.js';
import postcss from 'postcss';
import fs from 'fs';
import dialtoneTokensPlugin from './postcss/dialtone-tokens.cjs';
import layerRemoverPlugin from './postcss/layer-remover.cjs';
import debugMode from './postcss/debug-mode.js';
import path from 'path';
const TOKENS_OUTPUT_DIR = './dist/css/';

await runSdTransforms();

// Run postcss rather than via command line since we need to run it before writeDocs but after runSdTransforms.
await runPostCss(TOKENS_OUTPUT_DIR);
writeDocs();

await generateDebugTheme();

// Generate layered token system (includes per-material override CSS files for
// runtime setMaterial() switching — emitted via the same Style Dictionary
// pipeline that builds high-contrast)
console.log('\n=== Generating Layered Token System ===\n');
const { buildLayeredTokens } = await import('./build-layered.js');
await buildLayeredTokens();

// Generate theme files (now uses layered system - REPLACES old system)
await generateThemeFiles();

// Build theme files for distribution
await buildThemeFiles();

// Mirror every @layer-wrapped token CSS file under dist/css/no-layers/,
// unwrapped from `@layer dialtone.base`, for consumers who can't use CSS
// Cascade Layers. This is separate from dialtone-css's own no-layers build,
// which only strips layers from its own compiled bundle (tokens it inlines
// included) — it doesn't help consumers who import token CSS straight from
// @dialpad/dialtone-tokens. Files never wrapped in @layer to begin with
// (brand overrides, contrast, material) are skipped since they need no
// unlayered counterpart.
console.log('\n=== Generating No-Layers Token Variants ===\n');
await generateNoLayersTokens(TOKENS_OUTPUT_DIR);

/**
 * Generates the debug theme which shows all dialtone colors as bright orange so you can easily tell what is not
 * dialtone.
 */
async function generateDebugTheme () {
  // copy tokens-base-light to tokens-debug-base.css and tokens-dp-light to tokens-debug-dp.css
  fs.copyFileSync(path.join(TOKENS_OUTPUT_DIR, 'tokens-base-light.css'), `${TOKENS_OUTPUT_DIR}tokens-debug-base.css`);
  fs.copyFileSync(path.join(TOKENS_OUTPUT_DIR, 'tokens-dp-light.css'), `${TOKENS_OUTPUT_DIR}tokens-debug-dp.css`);
  // run postcss highlight-mode plugin only on those new files
  await runPostCss([`${TOKENS_OUTPUT_DIR}tokens-debug-base.css`, `${TOKENS_OUTPUT_DIR}tokens-debug-dp.css`], [debugMode]);
}

/**
 * @param {(string|string[])} filesOrDirectory - The directory or files to run postcss on. Supports a file path, a
 * directory path or an array of file paths.
 * @param {Array} plugins - The postcss plugins to run.
 * Runs postcss on all the files in the tokens output directory with the specified plugins.
 */
 
async function runPostCss (filesOrDirectory, plugins = [dialtoneTokensPlugin]) {
  const postCss = postcss(plugins);
  let files = Array.isArray(filesOrDirectory) ? filesOrDirectory : [filesOrDirectory];
  if (!Array.isArray(filesOrDirectory) && fs.lstatSync(filesOrDirectory).isDirectory()) {
    files = fs.readdirSync(filesOrDirectory)
      .map(file => path.join(filesOrDirectory, file))
      .filter(file => fs.lstatSync(file).isFile() && file.endsWith('.css')); // Skip directories and non-CSS files
  }
  for (const file of files) {
    const css = fs.readFileSync(file);
    const result = await postCss
      .process(css, { from: file, to: file });
    fs.writeFileSync(file, result.css);
    if (result.map) {
      fs.writeFileSync(file, result.map.toString());
    }
  }
}

/**
 * Recursively find every .css file under `dir` that contains an `@layer` rule
 * (skipping the no-layers output directory itself).
 */
function findLayeredCssFiles (dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'no-layers') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findLayeredCssFiles(fullPath));
    } else if (entry.name.endsWith('.css') && fs.readFileSync(fullPath, 'utf8').includes('@layer')) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * For every token CSS file wrapped in `@layer`, write an unlayered copy to
 * dist/css/no-layers/, preserving the file's path relative to dist/css/ (so
 * e.g. tokens-base-light.css -> no-layers/tokens-base-light.css and
 * layered/tokens-core.css -> no-layers/layered/tokens-core.css).
 */
async function generateNoLayersTokens (outputDir) {
  const postCss = postcss([layerRemoverPlugin]);
  const layeredFiles = findLayeredCssFiles(outputDir);

  for (const file of layeredFiles) {
    const relativePath = path.relative(outputDir, file);
    const outputPath = path.join(outputDir, 'no-layers', relativePath);

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    const css = fs.readFileSync(file);
    const result = await postCss.process(css, { from: file, to: outputPath });
    fs.writeFileSync(outputPath, result.css);
  }

  console.log(`Generated ${layeredFiles.length} no-layers token file(s)`);
}

/**
 * Build theme files for distribution using vite
 */
async function buildThemeFiles () {
  console.log('Building theme files for distribution...');

  try {
    // Dynamic import to avoid issues if vite is not available
    const { build } = await import('vite');
    const viteConfig = await import('./vite.config.js');

    await build(viteConfig.default);
    console.log('Theme files built successfully');
  } catch (error) {
    console.error('Failed to build theme files:', error);
    // Don't throw - allow build to continue for cases where vite build isn't critical
  }
}
