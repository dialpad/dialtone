import { describe, test, expect } from 'vitest';
import type { Component } from '@dialpad/dialtone-query-core';
import { selectComponent } from '../src/select-component.js';

const c = (displayName: string, extra: Partial<Component> = {}): Component => ({ displayName, ...extra });
const components = [
  // Listed first, so picking the first hit for "DtText" would be wrong.
  c('DtEmojiTextWrapper'),
  c('DtText'),
  c('DtBreadcrumbs', { description: 'Shows where the current page is located' }),
  c('DtNoticeIcon'),
  c('DtIcon', { metadata: { deprecated: true, replacement: 'Use @dialpad/dialtone-icons components' } }),
];
const iconWarning = 'DtIcon is deprecated. Use @dialpad/dialtone-icons components';

describe('selectComponent', () => {
  test('selects an exact name', () => {
    expect(selectComponent('DtText', components)).toEqual({ ok: true, result: expect.objectContaining({ name: 'DtText' }), warning: null });
  });

  test('selects a deprecated exact name, with its warning', () => {
    expect(selectComponent('DtIcon', components)).toEqual({ ok: true, result: expect.objectContaining({ name: 'DtIcon' }), warning: iconWarning });
  });

  test('does not select a lone non-exact match', () => {
    // "located" only appears in DtBreadcrumbs' description.
    expect(selectComponent('located', components)).toEqual({
      ok: false,
      message: 'No component named "located". Did you mean:\n  DtBreadcrumbs',
    });
  });

  test('lists at most 10 candidates', () => {
    const letters = 'ABCDEFGHIJKL'.split('');
    const lists = letters.map(l => c(`DtList${l}`));
    expect(selectComponent('list', lists)).toEqual({
      ok: false,
      message: ['No component named "list". Did you mean:', ...letters.slice(0, 10).map(l => `  DtList${l}`), '  ... and 2 more (12 total).'].join('\n'),
    });
  });

  test('points a bare word for a deprecated component to its replacement', () => {
    // DtIcon matches "icon" too, but stays filtered out.
    expect(selectComponent('icon', components)).toEqual({
      ok: false,
      message: `No component named "icon". Did you mean:\n  DtNoticeIcon\nNote: ${iconWarning}`,
    });
  });

  test('reports an unknown name', () => {
    expect(selectComponent('zzz', components)).toEqual({ ok: false, message: 'No component found matching "zzz".' });
  });

  test.each(['', '   '])('rejects an empty name (%j)', (name) => {
    expect(selectComponent(name, components)).toEqual({ ok: false, message: 'Component name is empty.' });
  });
});
