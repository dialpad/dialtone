// Generate standalone lint-package projections from the preferred helper authority.
// Run with --check to verify committed projections without writing them.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import guidance from '../packages/dialtone-css/lib/build/js/dialtone_migration_helper/migration-guidance.cjs';

const projections = {
  'eslint-plugin-dialtone': ['SIZING_MAP', 'SPACING_MAP', 'NEGATIVE_SPACING_MAP', 'SPACING_LAYOUT_MAP', 'RADIUS_MAP', 'RADIUS_PAIR_PREFIX_MAP', 'UTILITY_REVIEW_REQUIRED'],
  'stylelint-plugin-dialtone': ['SPACE_TOKEN_MAP'],
};
for (const [pkg, keys] of Object.entries(projections)) {
  const file = new URL(`../packages/${pkg}/lib/generated/migration-guidance.json`, import.meta.url);
  const content = `${JSON.stringify(Object.fromEntries(keys.map(key => [key, guidance[key]])), null, 2)}\n`;
  if (process.argv.includes('--check')) {
    if (readFileSync(file, 'utf8') !== content) throw new Error(`Stale migration projection: ${fileURLToPath(file)}; run node scripts/generate-migration-guidance.mjs`);
  } else {
    mkdirSync(dirname(fileURLToPath(file)), { recursive: true });
    writeFileSync(file, content);
  }
}
