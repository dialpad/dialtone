#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DOCS_PATH = path.resolve(__dirname, '../../../../dialtone-css/lib/dist/dialtone-docs.json');
const OUTPUT_PATH = path.resolve(__dirname, '../text_tone_tokens.js');

function readDocs () {
  const raw = fs.readFileSync(DOCS_PATH, 'utf8');
  return JSON.parse(raw);
}

function extractToneTokens (docs) {
  const prefix = 'd-fc-';
  const tokens = Object.keys(docs)
    .filter(key => key.startsWith(prefix))
    .map(key => key.slice(prefix.length))
    // Exclude numeric base color stops like "red-400"
    .filter(token => !/\d/.test(token));

  return Array.from(new Set(tokens)).sort((a, b) => a.localeCompare(b, 'en'));
}

function writeTokens (tokens) {
  const body = `export default ${JSON.stringify(tokens, null, 2)};\n`;
  fs.writeFileSync(OUTPUT_PATH, body, 'utf8');
}

(function main () {
  try {
    const docs = readDocs();
    const tokens = extractToneTokens(docs);
    writeTokens(tokens);
    console.info(`Updated text tone tokens (${tokens.length} entries) -> ${path.relative(process.cwd(), OUTPUT_PATH)}`);
  } catch (error) {
    console.error('[update_text_tone_tokens] Failed to generate tokens');
    console.error(error);
    process.exitCode = 1;
  }
})();
