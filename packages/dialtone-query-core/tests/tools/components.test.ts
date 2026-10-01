import { describe, test, expect } from 'vitest';
import { searchComponents, formatComponentResults, formatSingleResult } from '../../src/tools/components.js';
import type { Component } from '../../src/types.js';

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
