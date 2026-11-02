import { it, expect } from 'vitest';
import * as core from '../src/index.js';
import type { DocumentationRecord, ComponentDocCatalog } from '../src/index.js';

const prose = (id: string, extra = {}): DocumentationRecord => ({
  id, docId: id.split('#')[0], docTitle: 'Toggle', category: 'components',
  content: 'Authored prose.', headingPath: ['Usage'], frontmatter: {}, filePath: 'docs/toggle.md', ...extra,
});
const catalog = {
  schemaVersion: 1, identitySchemaVersion: 2,
  source: { channel: 'production', origin: 'https://dialtone.dialpad.com', versionScope: 'latest', hash: 'fixture' },
  pages: [{ docId: 'components/toggle', components: [
    { canonicalName: 'DtToggle', relation: 'companion' }, { canonicalName: 'DtToggle', relation: 'api' },
  ] }],
} as ComponentDocCatalog;
const example = (extra = {}) => prose('examples/toggle', { docId: 'components/toggle', example: {
  source: { id: 'components/toggle#base' }, components: [{ canonicalName: 'DtStack' }], directives: [], ...extra,
} });
function lookup(id: string, records: DocumentationRecord[], associations = catalog) {
  expect(core.getDocumentationContext).toBeTypeOf('function');
  return core.getDocumentationContext({ id }, records, associations);
}

it('resolves an empty owning section, authored API and sibling prose without incidental imports', () => {
  const base = prose('components/toggle#base', { content: '' });
  const access = prose('components/toggle#accessibility', { headingPath: ['Accessibility'], documentation: { url: 'https://dialtone.dialpad.com/components/toggle.html', versionScope: 'latest', installedCompatibility: 'not_checked' } });
  const records = [base, access, example()];
  const result = lookup('examples/toggle', records);
  expect(result.sourceSectionId).toBe(base.id);
  expect(result.items).toEqual([
    { kind: 'documentation', relation: 'source', id: base.id, headingPath: ['Usage'], contentCharacters: 0 },
    { kind: 'component-api', relation: 'api', component: 'DtToggle' },
    { kind: 'documentation', relation: 'sibling', id: access.id, headingPath: ['Accessibility'], contentCharacters: 15 },
  ]);
  expect(result.documentation).toEqual(access.documentation);
});

it('keeps preset provenance and inherited headings distinct from source selectors', () => {
  const preset = example({ source: { kind: 'combinator-preset', id: 'combinator/toggle/default' } });
  const result = lookup(preset.id, [prose('components/toggle#usage'), preset]);
  expect(result.sourceSectionId).toBeNull();
  expect(result.items).toContainEqual(expect.objectContaining({ relation: 'sibling', id: 'components/toggle#usage' }));
  expect(result.items.some(item => 'id' in item && item.id.startsWith('combinator/'))).toBe(false);
});

it('accepts real page selectors and heading-free records, with honest missing source and no ranked substitution', () => {
  const records = [prose('components/toggle#usage'), prose('plain', { headingPath: [] }), example()];
  expect(lookup('components/toggle', records).sourceSectionId).toBeNull();
  expect(lookup('plain', records).sourceSectionId).toBe('plain');
  const missing = lookup('examples/toggle', records);
  expect(missing.sourceSectionId).toBeNull();
  expect(missing.notes.join(' ')).toMatch(/source/i);
  expect(lookup('toggle', records)).toMatchObject({ match: 'no-match', items: [] });
});

it('follows explicit directive subjects to actual corpus records and utilities to existing lookup names', () => {
  const selected = example({ directives: ['DtTooltipDirective'], utilities: ['d-ww-normal', 'd-ww-normal'] });
  const records = [selected, prose('directives/tooltip#binding', { docId: 'directives/tooltip', headingPath: ['Binding'] })];
  const result = lookup(selected.id, records);
  expect(result.items).toContainEqual(expect.objectContaining({ relation: 'directive', id: 'directives/tooltip#binding' }));
  expect(result.items.filter(item => item.kind === 'utility')).toEqual([{ kind: 'utility', relation: 'target', name: 'd-ww-normal' }]);
  for (const item of result.items) if (item.kind === 'documentation') expect(records.some(record => record.id === item.id)).toBe(true);
});

it('reports absent or ambiguous directive documentation rather than fabricating IDs', () => {
  const selected = example({ directives: ['DtTooltipDirective', 'DtMissingDirective'] });
  const result = lookup(selected.id, [selected, prose('directives/tooltip#usage'), prose('directives/tool-tip#usage')]);
  expect(result.items.some(item => item.kind === 'documentation' && item.relation === 'directive')).toBe(false);
  expect(result.notes.join(' ')).toMatch(/ambiguous/i);
  expect(result.notes.join(' ')).toMatch(/missing/i);
});

it('deduplicates authored links, preserves their first origin and does not choose conflicting page URLs', () => {
  const link = { label: 'Other', href: 'other.md', url: 'https://dialtone.dialpad.com/other.html', targetDocId: 'other' };
  const a = prose('components/toggle#a', { links: [link], documentation: { url: 'https://dialtone.dialpad.com/a.html', versionScope: 'latest', installedCompatibility: 'not_checked' } });
  const b = prose('components/toggle#b', { links: [link], documentation: { ...a.documentation, url: 'https://dialtone.dialpad.com/b.html' } });
  const result = lookup(a.id, [a, b, prose('other')]);
  expect(result.items.filter(item => item.kind === 'link')).toEqual([{ kind: 'link', relation: 'authored', sourceSectionId: a.id, ...link }]);
  expect(result.documentation).toBeNull();
  expect(result.notes.join(' ')).toMatch(/conflict/i);
});
