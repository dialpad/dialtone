import { describe, test, expect } from 'vitest';
import { searchComponents, formatComponentResults, formatSingleResult } from '../../src/tools/components.js';
import type { Component } from '../../src/types.js';
import { normalizeComponents, componentImportStatement } from '../../src/component-identity.js';

const component = (displayName: string, extra: Partial<Component> = {}): Component => ({
  displayName,
  description: `${displayName} component`,
  props: [],
  events: [],
  slots: [],
  ...extra,
});

// Ordered so a first-hit search would pick the wrong component.
const fixture: Component[] = [
  component('DtEmojiTextWrapper'),
  component('DtText'),
  component('DtButtonGroup'),
  component('DtButton'),
  component('DtNoticeIcon'),
  component('DtIcon', {
    description: 'Legacy glyph renderer',
    metadata: { deprecated: true, reason: 'Replaced', replacement: 'Individual icon components from @dialpad/dialtone-icons' },
  }),
  component('SplitButtonEnd'),
];

const iconNote = 'DtIcon is deprecated. Individual icon components from @dialpad/dialtone-icons';

describe('searchComponents exact name matching', () => {
  test.each([
    ['DtText', 'DtText'],
    ['text', 'DtText'],
    ['dt-text', 'DtText'],
    ['Button Group', 'DtButtonGroup'],
    ['buttongroup', 'DtButtonGroup'],
    ['button', 'DtButton'],
    ['splitbuttonend', 'SplitButtonEnd'],
  ])('"%s" puts %s first', (query, expected) => {
    const { results, exactMatch } = searchComponents(query, fixture);
    expect(exactMatch).toBe(true);
    expect(results[0].name).toBe(expected);
  });

  test('keeps the other matches after the exact one, without repeating it', () => {
    expect(searchComponents('text', fixture).results.map(r => r.name)).toEqual(['DtText', 'DtEmojiTextWrapper']);
  });

  test('no exact match leaves the fuzzy results as they were', () => {
    const { exactMatch, results } = searchComponents('wrapper', fixture);
    expect(exactMatch).toBe(false);
    expect(results.map(r => r.name)).toEqual(['DtEmojiTextWrapper']);
  });

  test('the "no component named" note appears only when there is no exact match', () => {
    // Both queries miss the name bucket and hit only this description.
    const withProse = [component('DtButtonGroup', { description: 'Wraps a buttongroup of related actions' })];
    expect(searchComponents('related', withProse).notes.join(' ')).toContain('No component named');
    expect(searchComponents('buttongroup', withProse).notes).toEqual([]);
  });

  describe('name collisions', () => {
    const colliding = [component('DtFooBar'), component('FooBar')];

    test('are not exact without a case-sensitive match', () => {
      expect(searchComponents('foobar', colliding).exactMatch).toBe(false);
    });

    test('are settled by a case-sensitive match', () => {
      const { results, exactMatch } = searchComponents('FooBar', colliding);
      expect(exactMatch).toBe(true);
      expect(results[0].name).toBe('FooBar');
    });
  });
});

describe('searchComponents deprecated and discouraged components', () => {
  test.each(['DtIcon', 'dt-icon', '<dt-icon>'])('"%s" returns deprecated DtIcon first with a note instead of filtering it out', (query) => {
    const { results, notes, exactMatch, warning } = searchComponents(query, fixture);
    expect(exactMatch).toBe(true);
    expect(results[0].name).toBe('DtIcon');
    expect(notes).toEqual([iconNote]);
    expect(warning).toBe(iconNote);
  });

  test('a bare word keeps a deprecated component filtered but still points to its replacement', () => {
    const { results, notes, exactMatch, warning } = searchComponents('icon', fixture);
    expect(exactMatch).toBe(false);
    expect(results.map(r => r.name)).toEqual(['DtNoticeIcon']);
    expect(notes[0]).toBe(iconNote);
    expect(warning).toBe(iconNote);
  });

  test('deprecated components are still filtered for unrelated queries, with no warning', () => {
    const { results, warning } = searchComponents('glyph', fixture);
    expect(results.map(r => r.name)).not.toContain('DtIcon');
    expect(warning).toBeNull();
  });

  test('a deprecated component with no replacement or reason gets a plain note', () => {
    const { notes } = searchComponents('DtOld', [component('DtOld', { metadata: { deprecated: true } })]);
    expect(notes).toEqual(['DtOld is deprecated.']);
  });

  describe('discouraged', () => {
    const withDiscouraged = [
      component('DtButtonLegacy', { metadata: { discouraged: true, alternatives: ['DtButton'] } }),
      component('DtButton'),
    ];

    test('the exact match is not repeated when the filter swaps it back in', () => {
      expect(searchComponents('button', withDiscouraged).results.map(r => r.name)).toEqual(['DtButton']);
    });

    test('an exact match is returned with a note naming its alternatives', () => {
      const { results, notes, exactMatch, warning } = searchComponents('DtButtonLegacy', withDiscouraged);
      expect(exactMatch).toBe(true);
      expect(results.map(r => r.name)).toEqual(['DtButtonLegacy']);
      expect(notes).toEqual(['DtButtonLegacy is discouraged. Use DtButton instead.']);
      expect(warning).toBe('DtButtonLegacy is discouraged. Use DtButton instead.');
    });
  });
});

describe('component result formatting', () => {
  test('a deprecated result without a reason shows a plain DEPRECATED warning', () => {
    const { results } = searchComponents('DtOld', [component('DtOld', { metadata: { deprecated: true } })]);
    expect(formatComponentResults(results, 'DtOld')).toContain('⚠️  **DEPRECATED**\n');
    expect(formatSingleResult(results[0], 1)).toContain('⚠️  **DEPRECATED**\n');
  });
});

describe('component identity and import safety', () => {
  const publicResizable = component('DtResizable', {
    schemaVersion: 2,
    identity: {
      canonicalName: 'DtResizable', aliases: ['Resizable', 'ResizePane'], kind: 'public',
      source: { package: '@dialpad/dialtone-vue', version: '4.3.1', path: 'components/Resizable/Resizable.vue' },
      imports: [{ name: 'DtResizable', from: '@dialpad/dialtone-vue', kind: 'root', verification: 'source-export', package: '@dialpad/dialtone-vue', version: '4.3.1' }],
    },
  });

  test('verified aliases resolve to the canonical export and preserve identity', () => {
    const result = searchComponents('ResizePane', [publicResizable]);
    expect(result.exactMatch).toBe(true);
    expect(result.results[0].name).toBe('DtResizable');
    expect(result.results[0].details.identity).toEqual(publicResizable.identity);
    expect(formatComponentResults(result.results, 'ResizePane')).toContain("import { DtResizable } from '@dialpad/dialtone-vue'");
  });

  test('an alias lookup imports the canonical component name within the preferred package', () => {
    const panel = component('DtPanel', {
      schemaVersion: 2,
      identity: {
        canonicalName: 'DtPanel', aliases: ['PanelAlias'], kind: 'public',
        imports: ['PanelAlias', 'DtPanel'].map(name => ({ name, from: '@dialpad/dialtone-vue', kind: 'root' as const, verification: 'source-export' as const, package: '@dialpad/dialtone-vue', version: '4.3.1' })),
      },
    });
    const { results } = searchComponents('PanelAlias', [panel]);
    const output = formatComponentResults(results, 'PanelAlias');
    expect(results[0].name).toBe('DtPanel');
    expect(componentImportStatement(results[0].details.identity, '@dialpad/dialtone-vue')).toBe("import { DtPanel } from '@dialpad/dialtone-vue'");
    expect(output).toContain("import { DtPanel } from '@dialpad/dialtone-vue'");
    expect(output).not.toContain('import { PanelAlias }');
  });

  test('internal components remain discoverable without unsupported root imports', () => {
    const internal = component('KitchenSinkView', {
      schemaVersion: 2,
      identity: { canonicalName: 'KitchenSinkView', aliases: [], kind: 'internal', imports: [] },
    });
    const { results } = searchComponents('KitchenSinkView', [internal]);
    expect(results[0].details.identity.kind).toBe('internal');
    const output = formatComponentResults(results, 'KitchenSinkView');
    expect(output).not.toContain('import {');
    expect(output).toContain('not exported');
  });

  test('legacy APIs are retained but imports remain unverified without export evidence', () => {
    const { results } = searchComponents('DtText', [component('DtText', { props: [{ name: 'size' }] })]);
    expect(results[0].details.props).toEqual([{ name: 'size' }]);
    expect(results[0].details.identity).toMatchObject({ canonicalName: 'DtText', kind: 'unknown', imports: [] });
    const output = formatComponentResults(results, 'DtText');
    expect(output).not.toContain('import {');
    expect(output).toContain('unverified');
  });

  test('an ambiguous alias is not an exact identity', () => {
    const other = component('DtOtherResizable', {
      ...publicResizable,
      displayName: 'DtOtherResizable',
      identity: { ...publicResizable.identity!, canonicalName: 'DtOtherResizable' },
    });
    expect(searchComponents('ResizePane', [publicResizable, other]).exactMatch).toBe(false);
  });

  test('installed export verification survives subsequent searches without adding missing APIs', () => {
    const installed = { package: '@dialpad/dialtone', version: '10.5.1', from: '@dialpad/dialtone/vue', names: ['DtResizable', 'DtBreadcrumbItem'] };
    const normalized = normalizeComponents([component('Resizable', { props: [{ name: 'size' }] }), component('KitchenSinkView')], installed);
    const { results } = searchComponents('DtResizable', normalized);
    expect(results[0].name).toBe('DtResizable');
    expect(results[0].details.identity.imports).toEqual([{ name: 'DtResizable', from: '@dialpad/dialtone/vue', kind: 'subpath', verification: 'installed-export', package: '@dialpad/dialtone', version: '10.5.1' }]);
    expect(normalized.find(record => record.displayName === 'DtBreadcrumbItem')).toBeUndefined();
    expect(searchComponents('KitchenSinkView', normalized).results[0].details.identity.imports).toEqual([]);
  });
});
