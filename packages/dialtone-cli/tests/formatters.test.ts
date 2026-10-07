import { describe, test, expect } from 'vitest';
import type { SearchResult } from '@dialpad/dialtone-query-core';
import { formatComponentOutput, formatPrompt } from '../src/formatters.js';

describe('import hints name the given package', () => {
  // Not a real Dialtone path, so a hint hard-coded to any of them fails.
  const importFrom = '@example/ui';
  const identity = {
    canonicalName: 'DtButton', aliases: [], kind: 'public' as const,
    imports: [{ name: 'DtButton', from: importFrom, kind: 'root' as const, verification: 'installed-export' as const, package: importFrom, version: '1.0.0' }],
  };
  const button: SearchResult = { type: 'component', name: 'DtButton', details: { identity }, metadata: null };

  test('minimal component view', () => {
    expect(formatComponentOutput(button, 'minimal', undefined, { importFrom })).toBe([
      'DtButton',
      '',
      "Import: import { DtButton } from '@example/ui'",
    ].join('\n'));
  });

  test('markdown component view', () => {
    expect(formatComponentOutput(button, 'markdown', undefined, { importFrom })).toBe([
      '# DtButton',
      '',
      '## Usage',
      '',
      '```vue',
      "import { DtButton } from '@example/ui'",
      '```',
    ].join('\n'));
  });

  test('examples import the canonical binding even when a public alias appears first', () => {
    const aliased = { ...button, details: { identity: {
      ...identity, aliases: ['ButtonAlias'],
      imports: [{ ...identity.imports[0], name: 'ButtonAlias' }, ...identity.imports],
    } } };
    expect(formatComponentOutput(aliased, 'minimal', 'examples', { importFrom }))
      .toBe("import { DtButton } from '@example/ui'\n\n<DtButton />");
  });

  test('examples retain a known public tag when its import route is unverified', () => {
    const unverified = { ...button, details: { identity: { ...identity, imports: [] } } };
    const text = formatComponentOutput(unverified, 'minimal', 'examples', { importFrom });
    expect(text).toContain('unverified');
    expect(text).toContain('<DtButton />');
    expect(text).not.toContain('import {');
  });

  test('prompt text', () => {
    expect(formatPrompt({ displayName: 'DtButton', identity }, importFrom))
      .toBe("<DtButton>\nImport: import { DtButton } from '@example/ui'");
  });
});

describe('unverified import guidance', () => {
  const unknown: SearchResult = { type: 'component', name: 'KitchenSinkView', details: {}, metadata: null };
  test.each(['minimal', 'markdown'] as const)('%s component and examples withhold unverified imports', format => {
    for (const filter of [undefined, 'examples'] as const) {
      const text = formatComponentOutput(unknown, format, filter, { importFrom: '@dialpad/dialtone/vue' });
      expect(text).not.toContain('import {');
      expect(text).toContain('unverified');
      if (filter === 'examples') expect(text).not.toContain('<KitchenSinkView />');
    }
  });
  test('examples do not recommend an internal component', () => {
    const internal = { ...unknown, details: { identity: {
      canonicalName: 'KitchenSinkView', aliases: [], kind: 'internal' as const, imports: [],
    } } };
    const text = formatComponentOutput(internal, 'minimal', 'examples', { importFrom: '@dialpad/dialtone/vue' });
    expect(text).toContain('not exported');
    expect(text).not.toContain('<KitchenSinkView />');
    expect(text).not.toContain('import {');
  });
  test('prompt text withholds unverified imports', () => {
    const text = formatPrompt({ displayName: 'KitchenSinkView' }, '@dialpad/dialtone/vue');
    expect(text).not.toContain('import {');
    expect(text).toContain('unverified');
  });
});
