// Derive search/lint data from the unchanged preferred migration-helper configs.
// The extractor accepts only their bounded flat maps: numeric/identifier keys,
// single-quoted string values, commas and line comments. Other syntax fails closed;
// update this extractor deliberately if a source map changes shape. Never evaluate it.
// Run with --check to verify all committed outputs without writing them.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const helperRoot = 'packages/dialtone-css/lib/build/js/dialtone_migration_helper';
const dataFile = 'packages/dialtone-css/postcss/migration-guidance.json';
const sources = {
  space: `${helperRoot}/configs/space-to-spacing.mjs`,
  utility: `${helperRoot}/configs/utility-class-to-token-stops.mjs`,
  size: `${helperRoot}/configs/size-to-layout.mjs`,
  flex: 'packages/dialtone-css/lib/build/less/utilities/flex.less',
};
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

function extractMap (source, name) {
  const declarations = [...source.matchAll(new RegExp(`^const ${name} = \\{\\r?\\n([\\s\\S]*?)^\\};`, 'gm'))];
  if (declarations.length !== 1 || declarations[0][1].length > 16000) {
    throw new Error(`Expected one bounded flat map: ${name}`);
  }
  const entries = declarations[0][1].replace(/\/\/[^\n]*/g, '').split(',').map(entry => entry.trim());
  if (entries.at(-1) === '') entries.pop();
  if (entries.some(entry => entry === '')) throw new Error(`Empty map entry: ${name}`);
  if (entries.length === 0 || entries.length > 128) throw new Error(`Unexpected map size: ${name}`);
  const result = {};
  for (const entry of entries) {
    const match = /^((?:0|[1-9]\d*|[a-z][a-z0-9_]*))\s*:\s*'([a-z0-9.-]+)'$/.exec(entry);
    if (!match || Object.hasOwn(result, match[1])) throw new Error(`Unsupported or duplicate map entry: ${name}`);
    result[match[1]] = match[2];
  }
  return result;
}

const utility = read(sources.utility);
const size = read(sources.size);
const guidance = {
  SPACE_TOKEN_MAP: extractMap(read(sources.space), 'MAP'),
  ...Object.fromEntries(['SIZING_MAP', 'SPACING_MAP', 'NEGATIVE_SPACING_MAP', 'SPACING_LAYOUT_MAP', 'RADIUS_MAP', 'RADIUS_PAIR_PREFIX_MAP'].map(name => [name, extractMap(utility, name)])),
  SIZE_LAYOUT_MAP: extractMap(size, 'LAYOUT_MAP'),
  RAW_FALLBACK: extractMap(size, 'RAW_FALLBACK'),
};

// Search/lint advice must account for this shipped legacy declaration's 1px value.
// It is an observed exception, not a change to any automatic migration config.
const flexRules = [...read(sources.flex).matchAll(/\.d-flg2\s*>\s*\*\s*\{([^}]+)\}/g)];
if (flexRules.length !== 1 || !/--fl-gap:\s*var\(--dt-spacing-1\)/.test(flexRules[0][1])) {
  throw new Error('Recheck the d-flg2 recommendation against its source declaration');
}
guidance.UTILITY_REVIEW_REQUIRED = {
  'd-flg2': 'Legacy d-flg2 resolves to 1px; its suffix does not identify its value. Manual layout review required.',
};

function writeOrCheck (path, content) {
  const file = new URL(`../${path}`, import.meta.url);
  if (process.argv.includes('--check')) {
    if (readFileSync(file, 'utf8') !== content) throw new Error(`Stale migration data: ${fileURLToPath(file)}; run node scripts/generate-migration-guidance.mjs`);
  } else {
    mkdirSync(dirname(fileURLToPath(file)), { recursive: true });
    writeFileSync(file, content);
  }
}

writeOrCheck(dataFile, `${JSON.stringify({ _generated: 'node scripts/generate-migration-guidance.mjs; do not edit.', _sources: Object.values(sources), ...guidance }, null, 2)}\n`);

const projections = {
  'eslint-plugin-dialtone': ['SIZING_MAP', 'SPACING_MAP', 'NEGATIVE_SPACING_MAP', 'SPACING_LAYOUT_MAP', 'RADIUS_MAP', 'RADIUS_PAIR_PREFIX_MAP', 'UTILITY_REVIEW_REQUIRED'],
  'stylelint-plugin-dialtone': ['SPACE_TOKEN_MAP'],
};
for (const [pkg, keys] of Object.entries(projections)) {
  const content = `${JSON.stringify(Object.fromEntries(keys.map(key => [key, guidance[key]])), null, 2)}\n`;
  writeOrCheck(`packages/${pkg}/lib/generated/migration-guidance.json`, content);
}
