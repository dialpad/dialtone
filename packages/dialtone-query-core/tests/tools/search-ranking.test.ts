import { describe, test, expect } from 'vitest';
import { searchUtilityClasses } from '../../src/tools/utility-classes.js';
import { searchTokens, formatTokenResults } from '../../src/tools/tokens.js';
import { searchIcons } from '../../src/tools/icons.js';
import { searchDocumentation } from '../../src/tools/docs.js';
import type { DocumentationRecord, UtilityClassesData, TokensData } from '../../src/types.js';

const utilities: UtilityClassesData = {
  'd-card': { values: [{ prop: 'padding', value: 'var(--dt-spacing-100)' }] },
  'd-p-100-extra': { values: [{ prop: 'padding', value: '0.8rem' }] },
  'd-p-100': { values: [{ prop: 'padding', value: '0.8rem' }] },
  'd-pbs-100': { values: [{ prop: 'padding-block-start', value: '0.8rem' }] },
  'd-p8': { values: [{ prop: 'padding', value: '0.8rem' }], metadata: {
    deprecated: true, reason: 'Dialtone 9 pixel utility; Dialtone 10 replacement preserves 8px.', alternatives: ['d-p-100'],
  } },
};
const tokens: TokensData = {
  '--dt-spacing-100-negative': { 'dp-light': { value: '-0.8rem' } },
  '--dt-spacing-100': { 'dp-light': { value: '0.8rem' } },
  '--dt-space-400-negative': { 'dp-light': { value: '-0.8rem' }, metadata: { deprecated: true, alternatives: ['--dt-spacing-100-negative'] } },
  '--dt-space-400': { 'dp-light': { value: '0.8rem' }, metadata: {
    deprecated: true, reason: 'Dialtone 9 space token; Dialtone 10 replacement preserves 8px.', alternatives: ['--dt-spacing-100'],
  } },
};

function doc(docId: string, title: string, content: string): DocumentationRecord {
  return { id: `${docId}#usage`, docId, docTitle: title, category: docId.split('/')[0], headingPath: ['Usage'], content, frontmatter: {}, filePath: `${docId}.md` };
}

describe('exact names and bounded utility intent', () => {
  test('ranks an exact class before incidental matches', () => {
    expect(searchUtilityClasses('d-p-100', utilities).results[0].name).toBe('d-p-100');
  });
  test('logical padding query recovers physical top in the default writing mode', () => {
    expect(searchUtilityClasses('padding top 8px', utilities).results.map(r => r.name)).toContain('d-pbs-100');
  });
  test('returns no utilities for an empty query', () => {
    expect(searchUtilityClasses('', utilities).results).toEqual([]);
  });
  test.each(['d-p8', '.d-p8'])('explicit legacy query %s retains its contract and migration warning', query => {
    const { results } = searchUtilityClasses(query, utilities);
    expect(results[0]).toMatchObject({ name: 'd-p8', metadata: { deprecated: true, alternatives: ['d-p-100'] } });
  });
  test('a leading decimal point remains a value query', () => {
    expect(searchUtilityClasses('.8rem', utilities).results.map(result => result.name)).toContain('d-p-100');
  });
  test('general spacing discovery excludes deprecated utilities', () => {
    expect(searchUtilityClasses('padding 8px', utilities).results.some(r => r.name === 'd-p8')).toBe(false);
  });
});

describe('token and icon ranking', () => {
  test('exact canonical token leads over its negative variant', () => {
    expect(searchTokens('--dt-spacing-100', tokens).results[0].name).toBe('--dt-spacing-100');
  });
  test('explicit legacy token keeps value and qualified replacement', () => {
    expect(searchTokens('--dt-space-400', tokens).results[0]).toMatchObject({ name: '--dt-space-400', metadata: { deprecated: true, alternatives: ['--dt-spacing-100'] } });
  });
  test('spacing examples use padding and do not count metadata as a theme', () => {
    const result = searchTokens('--dt-space-400', tokens).results;
    const output = formatTokenResults(result, '--dt-space-400');
    expect(output).toContain('padding: var(--dt-space-400)');
    expect(output).not.toContain('metadata:');
    expect(output).not.toContain('color: var(--dt-space-400)');
    const zero = searchTokens('--dt-spacing-0', { '--dt-spacing-0': { 'dp-light': { value: 0 } } }).results;
    expect(formatTokenResults(zero, '--dt-spacing-0')).toContain('dp-light: 0');
  });
  test.each(['--dt-spacing-100-negative', '--dt-space-400-negative'])('negative spacing %s uses a valid margin property', name => {
    const output = formatTokenResults(searchTokens(name, tokens).results, name);
    expect(output).toContain(`margin: var(${name})`);
    expect(output).not.toContain(`padding: var(${name})`);
  });
  test('voicemail leads over voicemail-drop regardless of corpus order', () => {
    expect(searchIcons('voicemail', { categories: { communication: { 'voicemail-drop': ['voicemail'], voicemail: ['message'] } } }).results[0].name).toBe('voicemail');
  });
});

describe('real news paths', () => {
  test('directive guidance leads over an exact news title', () => {
    const corpus = [doc('dialtone/whats-new/posts/2026-9-16', 'Mode Directive', 'Mode directive mode directive'), doc('guides/mode-directive', 'Mode', 'Use the mode directive to select a mode.')];
    expect(searchDocumentation('mode directive', corpus).results[0].details.docId).toBe('guides/mode-directive');
  });
});
