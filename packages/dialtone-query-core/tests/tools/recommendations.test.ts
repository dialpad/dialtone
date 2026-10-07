import { test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { utilityClasses, tokens } from '../../src/data.js';

// These sections recommend current use. Migration guides and explicit avoid examples
// intentionally contain legacy identifiers and are outside this check.
test('MCP guide and client recommendations name current generated contracts', () => {
  const guide = readFileSync(new URL('../../../../apps/dialtone-documentation/docs/guides/mcp-server/index.md', import.meta.url), 'utf8');
  const guideRecommendations = guide.split('## What It Does')[1].split('### Smart Features')[0];
  const rules = JSON.parse(readFileSync(new URL('../../../dialtone-mcp-server/client-rules.json', import.meta.url), 'utf8'));
  const codex = readFileSync(new URL('../../../../.agents/resources/rules/css-utilities.md', import.meta.url), 'utf8');
  const claude = readFileSync(new URL('../../../../.claude/rules/css-utilities.md', import.meta.url), 'utf8');
  const codexPositive = codex.split('## Location And Naming')[1].split('## Token Usage')[0];
  const claudeNaming = claude.split('## Naming Convention')[1].split('Common shorthands:')[0];
  const claudeCorrect = claude.split('// CORRECT')[1].split('// WRONG')[0];
  const recommendations = [guideRecommendations, codexPositive, claudeNaming, claudeCorrect, rules.priority.details['utility-class'], ...rules.typography.details.examples.good, ...rules.colors.details.examples.good].join(' ');
  const classNames = [...new Set(recommendations.match(/\bd-[a-z0-9-]+\b/g))];
  const tokenNames = [...new Set(recommendations.match(/--dt-[a-z0-9-]+/g))];
  expect(classNames.length).toBeGreaterThan(0);
  for (const name of classNames) {
    expect(utilityClasses[name], name).toBeDefined();
    expect(utilityClasses[name]?.metadata?.deprecated, name).not.toBe(true);
  }
  for (const name of tokenNames) {
    expect(tokens[name], name).toBeDefined();
    expect(tokens[name]?.metadata?.deprecated, name).not.toBe(true);
  }
});
