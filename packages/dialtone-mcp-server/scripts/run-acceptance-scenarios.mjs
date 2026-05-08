/**
 * Acceptance harness for the search_documentation MCP tool.
 * Runs all 10 scenarios from the PRD against searchDocumentation directly
 * (bypasses MCP transport — tests search behavior, not JSON-RPC plumbing).
 *
 * Exit 0 if ≥ 8 of 10 scenarios pass; exit 1 otherwise.
 * Run: node scripts/run-acceptance-scenarios.mjs
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { searchDocumentation, documentation } from '@dialpad/dialtone-query-core';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PASS_BAR = 8;

const scenarios = JSON.parse(
  readFileSync(resolve(__dirname, 'acceptance-scenarios.json'), 'utf8'),
);

// Guard against accidental scenario edits — PASS_BAR is calibrated to exactly 10 scenarios.
if (scenarios.length !== 10) {
  console.error(`❌ Expected exactly 10 scenarios, found ${scenarios.length}. Update PASS_BAR if scenario count changes.`);
  process.exit(1);
}

const COL_ID = 8;
const COL_QUERY = 48;
const COL_TOP3 = 45;
const COL_STATUS = 6;
const DIVIDER = `${'─'.repeat(COL_ID + COL_QUERY + COL_TOP3 + COL_STATUS + 7)}`;

console.log('\n📋 search_documentation Acceptance Scenarios\n');
console.log(DIVIDER);
console.log(
  `${'ID'.padEnd(COL_ID)} ${'Query'.padEnd(COL_QUERY)} ${'Top-3 doc_ids'.padEnd(COL_TOP3)} ${'Status'.padEnd(COL_STATUS)}`,
);
console.log(DIVIDER);

let passed = 0;
const failures = [];

for (const scenario of scenarios) {
  const { id, query, allowlist } = scenario;
  const { results } = searchDocumentation(query, documentation);
  const top3DocIds = results.slice(0, 3).map(r => r.details.docId);

  const pass = allowlist.length > 0
    ? allowlist.some(d => top3DocIds.includes(d))
    : top3DocIds.length > 0;

  const status = pass ? '✅ PASS' : '❌ FAIL';
  const top3Str = top3DocIds.join(', ') || '(no results)';

  console.log(
    `${id.padEnd(COL_ID)} ${query.slice(0, COL_QUERY - 1).padEnd(COL_QUERY)} ${top3Str.slice(0, COL_TOP3 - 1).padEnd(COL_TOP3)} ${status}`,
  );

  if (pass) {
    passed++;
  } else {
    failures.push({ id, query, allowlist, top3DocIds });
  }
}

console.log(DIVIDER);
console.log(`\nResult: ${passed}/${scenarios.length} scenarios passed (bar: ≥ ${PASS_BAR})\n`);

if (failures.length > 0) {
  console.log('❌ Failing scenarios — add missing vocabulary to the corpus doc pages:');
  for (const f of failures) {
    console.log(`\n  ${f.id}: "${f.query}"`);
    console.log(`    Expected one of: ${JSON.stringify(f.allowlist)}`);
    console.log(`    Got top-3:       ${JSON.stringify(f.top3DocIds)}`);
  }
  console.log('');
}

if (passed < PASS_BAR) {
  console.error(`❌ Acceptance bar not met: ${passed}/${scenarios.length} < ${PASS_BAR} required. Corpus edits needed before proceeding to MCP registration.\n`);
  process.exit(1);
}

console.log(`✅ Acceptance bar met. Proceeding to MCP registration is safe.\n`);
process.exit(0);
