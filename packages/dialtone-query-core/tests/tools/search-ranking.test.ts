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

  test.each([
    ['spinner component', ['DtLoader'], 'components/loader'],
    ['loading spinner', ['DtLoader'], 'components/loader'],
    ['blank slate when the list has no results', ['DtEmptyState'], 'components/empty-state'],
    ['typeahead autocomplete search', ['DtCombobox', 'DtComboboxWithPopover'], 'components/combobox'],
    ['typeahead search for contacts', ['DtCombobox', 'DtComboboxWithPopover'], 'components/combobox'],
    ['add a loader to the settings page', ['DtLoader'], 'components/loader'],
  ])('%s retains complete discovery phrases in context', (query, expected, docId) => {
    const found = searchComponents(query, components, componentDocumentation).results;
    expect(found.slice(0, expected.length).map(result => result.name)).toEqual(expected);
    expect(searchDocumentation(query, documentation).results[0].details.docId).toBe(docId);
  });

  test.each([
    ['panel for tabs', 'DtTabGroup'],
    ['top left', 'DtBanner'],
  ])('%s keeps complete API-text matches before partial contextual discovery', (query, expected) => {
    expect(searchComponents(query, components, componentDocumentation).results[0].name).toBe(expected);
  });

  test.each([
    ['text fields', 'DtInput'],
    ['tab panels', 'DtTabPanel'],
    ['add empty states to the settings page', 'DtEmptyState'],
  ])('%s recognizes regular plurals of complete discovery phrases', (query, expected) => {
    expect(searchComponents(query, components, componentDocumentation).results[0].name).toBe(expected);
  });

  test('selects a source section rather than repeating page keywords as section evidence', () => {
    const usage = { ...doc('components/text', 'Text', 'Semantic typography.'), frontmatter: { keywords: ['font', 'strength'] } };
    const strength = { ...usage, id: 'components/text#strength', headingPath: ['Variants', 'Strength'], content: 'Choose font weight using strength.' };
    expect(searchDocumentation('font strength', [usage, strength]).results[0].details.id).toBe(strength.id);
  });

  test('a named component size request keeps its source page ahead of generic size keywords', () => {
    expect(searchDocumentation('icon size', documentation).results[0].details.docId).toBe('components/icon');
    expect(searchDocumentation('dark mode theme', documentation).results.slice(0, 3).map(result => result.details.docId))
      .toContain('directives/mode');
  });

  test('filler does not become contextual evidence, while an explicit keyword still works', () => {
    const page = { ...doc('guides/routing', 'Routing', 'Navigation.'), frontmatter: { keywords: ['to'] } };
    expect(searchDocumentation('to a for', [page]).results).toEqual([]);
    expect(searchDocumentation('to', [page]).results[0].details.docId).toBe(page.docId);
    expect(searchComponents('focusgroup directive', components, componentDocumentation).results.map(result => result.name))
      .not.toContain('DtModeIsland');
  });

  test('authored text-box and scroll-area vocabulary reaches its existing sources', () => {
    const found = searchComponents('a text box for the user email with validation', components, componentDocumentation);
    expect(found.results[0].name).toBe('DtInput');
    expect(found.results[0].details.keywordSource.keywords).toContain('text box');
    expect(searchDocumentation('scroll area', documentation).results[0].details.docId).toBe('components/scrollbar');
  });

  test('recognizes complete phrases and exposes the keyword behind partial context', () => {
    const catalog = withPages(componentDocumentation.pages
      .filter(page => page.docId === 'components/loader')
      .map(page => ({ ...page, keywords: ['blank slate', 'spinner'] })));
    for (const query of ['slated', 'blanket', 'blank mortgage']) {
      expect(searchComponents(query, components, catalog).results).toEqual([]);
    }
    const found = searchComponents('spinner mortgage', components, catalog);
    expect(found.results[0].name).toBe('DtLoader');
    expect(found.exactMatch).toBe(false);
    expect(found.notes.find(note => note.includes('Curated keyword matches'))).toContain('spinner');
  });

  test('a complete public name beats a shorter name supplemented by a related keyword', () => {
    const found = searchComponents('add a tab panel to the settings page', components, componentDocumentation);
    expect(found.results[0].name).toBe('DtTabPanel');
  });

  test('name-only context uses selected public names without inventing keyword evidence', () => {
    const found = searchComponents('add an input to the settings page', selected);
    expect(found.results.map(result => result.name)).toEqual(['DtInput']);
    expect(found.results[0].details.keywordSource).toBeUndefined();
    expect(found.notes.some(note => note.includes('DtInput'))).toBe(true);
    const excluded = searchComponents('add an icon to the settings page', components);
    expect(excluded.results).toEqual([]);
    expect(excluded.notes.some(note => note.includes('No component named'))).toBe(false);
  });

  test('bounds text keyword evidence while retaining all authored phrases in results', () => {
    const keywords = ['spinner one', 'spinner two', 'spinner three', 'spinner four',
      'spinner five', 'spinner six', 'spinner seven', 'spinner eight', 'spinner nine', 'spinner ten'];
    const catalog = withPages(componentDocumentation.pages
      .filter(page => page.docId === 'components/loader')
      .map(page => ({ ...page, keywords })));
    const found = searchComponents(keywords.join(' '), components, catalog);
    expect(found.results[0].details.keywordSource.keywords).toEqual(keywords);
    const note = found.notes.find(note => note.includes('Curated keyword matches'))!;
    expect(note).toContain('spinner eight');
    expect(note).not.toContain('spinner nine');
    expect(note).toContain('2 more');
  });

  test.each([
    ['Dialtone CLI', 'guides/cli/index'],
    ['MCP server configuration', 'guides/mcp-server/index'],
    ['figma icon usage', 'foundations/icons/usage/index'],
    ['vue2 removal', 'guides/migration/vue2-removal/index'],
  ])('%s keeps explicit documentation intent', (query, docId) => {
    expect(searchDocumentation(query, documentation).results[0].details.docId).toBe(docId);
  });

  test.each([
    ['figma', ['design/icons/index', 'foundations/icons/usage/index', 'components/index', 'components/status/index', 'tokens/for-designers/index']],
    ['storybook', ['components/index', 'components/status/index', 'guides/mcp-server/index']],
    ['vue', ['guides/getting-started/index', 'guides/migration/vue2-removal/index', 'guides/migration/component-props/index', 'components/index']],
    ['component', ['components/index', 'components/status/index', 'guides/migration/component-props/index', 'guides/cli/index', 'guides/mcp-server/index']],
  ])('%s retains useful broad navigation without forcing a unique winner', (query, allowed) => {
    const first = searchDocumentation(query, documentation).results.slice(0, 3);
    expect(first.some(result => allowed.includes(result.details.docId))).toBe(true);
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
    expect(searchComponents('spinner component', selected, componentDocumentation).results).toEqual([]);
    const companionOnly = withPages(componentDocumentation.pages
      .filter(page => page.docId === 'components/input')
      .map(page => ({ ...page, components: page.components.map(reference => ({ ...reference, relation: 'companion' })) })));
    expect(searchComponents('text field', selected, companionOnly).results).toEqual([]);
    const withoutKeywords = withPages(componentDocumentation.pages.map(({ keywords, ...page }) => page));
    expect(searchComponents('text field', selected, withoutKeywords).results).toEqual([]);
  });

  test.each([
    { query: 'DtInput', data: selected, keywordEvidence: false },
    { query: 'DtLoader', data: components, keywordEvidence: false },
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
