import { describe, test, expect } from 'vitest';
import { searchUtilityClasses } from '../../src/tools/utility-classes.js';
import { searchTokens, formatTokenResults } from '../../src/tools/tokens.js';
import { searchIcons } from '../../src/tools/icons.js';
import { components, componentDocumentation, documentation } from '../../src/data.js';
import { searchComponents } from '../../src/tools/components.js';
import { normalizeComponents, componentNames } from '../../src/component-identity.js';
import { getComponentDetail } from '../../src/component-detail.js';
import type { ComponentDocPage } from '../../src/component-documentation.js';
import { searchDocumentation } from '../../src/tools/docs.js';
import type { DocumentationRecord, UtilityClassesData, TokensData } from '../../src/types.js';

const utilities: UtilityClassesData = {
  'd-datepicker__cell': { values: [{ prop: 'padding-block-start', value: '0.8rem' }, { prop: 'display', value: 'flex' }] },
  'd-card': { values: [{ prop: 'padding', value: 'var(--dt-spacing-100)' }] },
  'd-p-100-z': { values: [{ prop: 'padding', value: '0.8rem' }] },
  'd-p-100-extra': { values: [{ prop: 'padding', value: '0.8rem' }] },
  'd-p-100': { values: [{ prop: 'padding', value: '0.8rem' }] },
  'd-pbs-100': { values: [{ prop: 'padding-block-start', value: '0.8rem !important' }] },
  'd-d-flex': { values: [{ prop: 'display', value: 'flex !important' }] },
  'd-p8': { values: [{ prop: 'padding', value: '0.8rem' }], metadata: {
    deprecated: true, reason: 'Dialtone 9 pixel utility; Dialtone 10 replacement preserves 8px.', alternatives: ['d-p-100'],
  } },
};
const tokens: TokensData = {
  '--dt-spacing-100-z': { 'dp-light': { value: '0.8rem' } },
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
  test('ranks an exact class first and preserves match order within each tier', () => {
    expect(searchUtilityClasses('d-p-100', utilities).results.map(result => result.name)).toEqual([
      'd-p-100', 'd-p-100-z', 'd-p-100-extra', 'd-pbs-100', 'd-card',
    ]);
  });
  test('physical padding queries recover logical matches with a writing-mode warning', () => {
    for (const query of ['padding top 8px', 'padding-top 8px', 'padding/top 8px']) {
      const { results, notes } = searchUtilityClasses(query, utilities);
      expect(results.map(r => r.name)).toEqual(['d-pbs-100', 'd-datepicker__cell']);
      expect(notes.some(note => note.includes('horizontal-tb'))).toBe(true);
    }
  });
  test('ranks a matching display utility before component CSS without hiding either', () => {
    expect(searchUtilityClasses('display flex', utilities).results.map(r => r.name)).toEqual([
      'd-d-flex', 'd-datepicker__cell',
    ]);
    expect(searchUtilityClasses('d-datepicker__cell', utilities).results[0].name).toBe('d-datepicker__cell');
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
  test('exact canonical token leads without reordering other matches', () => {
    expect(searchTokens('--dt-spacing-100', tokens).results.map(result => result.name)).toEqual([
      '--dt-spacing-100', '--dt-spacing-100-z', '--dt-spacing-100-negative',
    ]);
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
  test('voicemail leads without reordering other icon matches', () => {
    const icons = { categories: { communication: { 'voicemail-z': ['voicemail'], 'voicemail-drop': ['voicemail'], voicemail: ['message'] } } };
    expect(searchIcons('voicemail', icons).results.map(result => result.name)).toEqual([
      'voicemail', 'voicemail-z', 'voicemail-drop',
    ]);
  });
});

describe('real news paths', () => {
  test('directive guidance leads over an exact news title', () => {
    const corpus = [doc('dialtone/whats-new/posts/2026-9-16', 'Mode Directive', 'Mode directive mode directive'), doc('guides/mode-directive', 'Mode', 'Use the mode directive to select a mode.')];
    expect(searchDocumentation('mode directive', corpus).results[0].details.docId).toBe('guides/mode-directive');
  });
});

describe('curated public-page discovery', () => {
  const withPages = (pages: ComponentDocPage[]) => ({ ...componentDocumentation, pages });
  const selected = normalizeComponents([{ displayName: 'input', description: 'Legacy text input' }], {
    package: '@dialpad/dialtone', version: '9.185.0', from: '@dialpad/dialtone/vue3', names: ['DtInput'],
  });

  test.each([
    ['switch', ['DtToggle'], 'components/toggle'],
    ['spinner', ['DtLoader'], 'components/loader'],
    ['spinner?', ['DtLoader'], 'components/loader'],
    ['activity indicator', ['DtLoader'], 'components/loader'],
    ['blank slate', ['DtEmptyState'], 'components/empty-state'],
    ['zero state', ['DtEmptyState'], 'components/empty-state'],
    ['text field', ['DtInput'], 'components/input'],
    ['text-field', ['DtInput'], 'components/input'],
    ['TEXT / field', ['DtInput'], 'components/input'],
    ['textbox', ['DtInput'], 'components/input'],
    ['autocomplete', ['DtCombobox', 'DtComboboxWithPopover'], 'components/combobox'],
    ['typeahead', ['DtCombobox', 'DtComboboxWithPopover'], 'components/combobox'],
    ['notification', ['DtBanner', 'DtNotice', 'DtToast'], 'components/notice'],
    ['tab navigation', ['DtTab', 'DtTabGroup', 'DtTabPanel'], 'components/tabs'],
  ])('%s leads with supported subjects before incidental text', (query, expected, docId) => {
    const found = searchComponents(query, components, componentDocumentation).results;
    expect(found.slice(0, expected.length).map(r => r.name)).toEqual(expected);
    expect(searchDocumentation(query, documentation).results[0].details.docId).toBe(docId);
  });

  test('a competing keyword does not displace canonical name and family matches', () => {
    const catalog = withPages(componentDocumentation.pages.map(page =>
      page.docId === 'components/banner' ? { ...page, keywords: [...(page.keywords ?? []), 'DtInput'] } : page));
    expect(searchComponents('DtInput', components, catalog).results.slice(0, 3).map(r => r.name))
      .toEqual(['DtInput', 'DtInputGroup', 'DtBanner']);
    expect(searchDocumentation('DtInput', documentation).results[0].details.docId).toBe('components/input');
  });

  test.each(['DLT3659MissingCapability', '???'])('an unknown or punctuation-only query %s finds nothing', (query) => {
    expect(searchComponents(query, components, componentDocumentation).results).toEqual([]);
    expect(searchDocumentation(query, documentation).results).toEqual([]);
  });

  test('joins keywords only to API components in the selected dataset', () => {
    expect(searchComponents('text field', selected, componentDocumentation).results.map(r => r.name)).toEqual(['DtInput']);
    expect(searchComponents('spinner', selected, componentDocumentation).results).toEqual([]);
    const companionOnly = withPages(componentDocumentation.pages
      .filter(page => page.docId === 'components/input')
      .map(page => ({ ...page, components: page.components.map(reference => ({ ...reference, relation: 'companion' })) })));
    expect(searchComponents('text field', selected, companionOnly).results).toEqual([]);
    const withoutKeywords = withPages(componentDocumentation.pages.map(({ keywords, ...page }) => page));
    expect(searchComponents('text field', selected, withoutKeywords).results).toEqual([]);
  });

  test.each([
    { query: 'DtInput', data: selected, keywordEvidence: false },
    { query: 'text field', data: selected, keywordEvidence: true },
    { query: 'text field', data: selected.map(c => ({ ...c, metadata: { deprecated: true } })), keywordEvidence: false },
  ])('qualifies only retained keyword evidence for $query ($keywordEvidence)', ({ query, data, keywordEvidence }) => {
    const { results, notes } = searchComponents(query, data, componentDocumentation);
    expect(results.some(r => r.details.keywordSource)).toBe(keywordEvidence);
    expect(notes.some(note => note.includes('Curated keyword matches'))).toBe(keywordEvidence);
  });

  test('preserves legacy lookup without a verified identity', () => {
    const legacy = [{ displayName: 'input', description: 'Legacy input' }];
    expect(searchComponents('Legacy', legacy, componentDocumentation).results[0].name).toBe('input');
  });

  test('keywords never become component names for exact API selection', () => {
    expect(componentNames(components.find(c => c.displayName === 'DtLoader')!)).not.toContain('spinner');
    for (const query of ['spinner', 'switch', 'DtTabs', 'dt-tabs', 'DtTable', 'dt-table', 'DtScrollbar', 'dt-scrollbar']) {
      expect(getComponentDetail({ component: query }, components).match).toBe('no-match');
    }
  });
});
