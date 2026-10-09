import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
// Integration validation consumes data from the existing CLI prerequisite build.
const utilityClasses = JSON.parse(read('packages/dialtone-css/lib/dist/dialtone-docs.json'));
const tokens = JSON.parse(read('packages/dialtone-css/lib/dist/tokens-docs.json'));

// These sections recommend current use. Migration guides and explicit avoid examples
// intentionally contain legacy identifiers and are outside this check.
test('MCP guide and client recommendations name current generated contracts', () => {
  const guide = read('apps/dialtone-documentation/docs/guides/mcp-server/index.md');
  const guideRecommendations = guide.split('## What It Does')[1].split('### Smart Features')[0];
  const rules = JSON.parse(read('packages/dialtone-mcp-server/client-rules.json'));
  const codex = read('.agents/resources/rules/css-utilities.md');
  const claude = read('.claude/rules/css-utilities.md');
  const codexPositive = codex.split('## Location And Naming')[1].split('## Token Usage')[0];
  const claudeNaming = claude.split('## Naming Convention')[1].split('Common shorthands:')[0];
  const claudeCorrect = claude.split('// CORRECT')[1].split('// WRONG')[0];
  const recommendations = [guideRecommendations, codexPositive, claudeNaming, claudeCorrect, rules.priority.details['utility-class'], ...rules.typography.details.examples.good, ...rules.colors.details.examples.good].join(' ');
  const classNames = [...new Set(recommendations.match(/\bd-[a-z0-9-]+\b/g))];
  const tokenNames = [...new Set(recommendations.match(/--dt-[a-z0-9-]+/g))];
  assert.ok(classNames.length > 0);
  for (const name of classNames) {
    assert.ok(utilityClasses[name], name);
    assert.notEqual(utilityClasses[name]?.metadata?.deprecated, true, name);
  }
  for (const name of tokenNames) {
    assert.ok(tokens[name], name);
    assert.notEqual(tokens[name]?.metadata?.deprecated, true, name);
  }
});
