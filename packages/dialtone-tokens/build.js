/**
 * Builds both sd tranforms and token transformer tokens and outputs documentation for all tokens.
 */

import { writeDocs } from './build-docs.js';
import { run as runSdTransforms } from './build-sd-transforms.js';
import postcss from 'postcss';
import fs from 'fs';
import dialtoneTokensPlugin from './postcss/dialtone-tokens.cjs';
import path from 'path';
const TOKENS_OUTPUT_DIR = './dist/css/';

await runSdTransforms();

// Run postcss rather than via command line since we need to run it before writeDocs but after runSdTransforms.
await runPostCss(TOKENS_OUTPUT_DIR);
writeDocs();

/**
 * Runs postcss on all the files in the tokens output directory with the dialtone-tokens plugin.
 */
async function runPostCss (tokensOutputDir) {
  const postCss = postcss([dialtoneTokensPlugin]);
  const files = fs.readdirSync(tokensOutputDir);
  for (const file of files) {
    const css = fs.readFileSync(path.join(tokensOutputDir, file));
    const result = await postCss
      .process(css, { from: path.join(tokensOutputDir, file), to: path.join(tokensOutputDir, file) });
    fs.writeFile(path.join(tokensOutputDir, file), result.css, () => true);
    if (result.map) {
      fs.writeFile(path.join(tokensOutputDir, file), result.map.toString(), () => true);
    }
  }
}
