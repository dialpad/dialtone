/**
 * Builds tokens via sd-transforms, runs postcss and outputs documentation for all tokens.
 */

import { writeDocs } from './build-docs.js';
import { run as runSdTransforms } from './build-sd-transforms.js';
import postcss from 'postcss';
import fs from 'fs';
import dialtoneTokensPlugin from './postcss/dialtone-tokens.cjs';
import debugMode from './postcss/debug-mode.js';
import path from 'path';
const TOKENS_OUTPUT_DIR = './dist/css/';

await runSdTransforms();

// Run postcss rather than via command line since we need to run it before writeDocs but after runSdTransforms.
await runPostCss(TOKENS_OUTPUT_DIR);
writeDocs();

await generateDebugTheme();

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
// eslint-disable-next-line complexity
async function runPostCss (filesOrDirectory, plugins = [dialtoneTokensPlugin]) {
  const postCss = postcss(plugins);
  let files = Array.isArray(filesOrDirectory) ? filesOrDirectory : [filesOrDirectory];
  if (!Array.isArray(filesOrDirectory) && fs.lstatSync(filesOrDirectory).isDirectory()) {
    files = fs.readdirSync(filesOrDirectory).map(file => path.join(filesOrDirectory, file));
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
