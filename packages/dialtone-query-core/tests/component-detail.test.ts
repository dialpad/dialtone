import { describe, expect, it } from 'vitest';
import { getComponentDetail } from '../src/component-detail.js';
import type { Component } from '../src/types.js';

const identity = (name: string) => ({
  canonicalName: name,
  aliases: [],
  kind: 'public' as const,
  imports: [
    {
      name,
      from: '@dialpad/dialtone-vue',
      kind: 'root' as const,
      verification: 'source-export' as const,
      package: '@dialpad/dialtone-vue',
      version: '4.3.1',
    },
  ],
});
const records = [
  {
    displayName: 'DtButton',
    schemaVersion: 2,
    identity: identity('DtButton'),
    props: [
      {
        name: 'kind',
        type: { name: 'string' },
        values: ['primary', 'secondary', 'old'],
        defaultValue: { value: "'primary'" },
        tags: { deprecated: [{ description: 'old: use secondary' }] },
      },
    ],
  },
  {
    displayName: 'DtBanner',
    schemaVersion: 2,
    identity: identity('DtBanner'),
    props: [{ name: 'kind', values: ['info'] }],
  },
  {
    displayName: 'DtComboboxWithPopover',
    schemaVersion: 2,
    identity: identity('DtComboboxWithPopover'),
    events: [
      {
        name: 'select',
        properties: [{ name: 'option', type: { name: 'object' } }],
      },
    ],
    slots: [
      {
        name: 'option',
        bindings: [{ name: 'selected', type: { name: 'boolean' } }],
      },
    ],
  },
] as unknown as Component[];
const detail = (
  args: Parameters<typeof getComponentDetail>[0],
  components = records,
) => getComponentDetail(args, components);

describe('selected component contract', () => {
  it('constrains kind to Button and retains complete values/default/deprecation tags', () => {
    const result = detail({
      component: ' DtButton ',
      projection: 'props',
      field: 'kind',
    });
    expect(result.match).toBe('exact');
    expect(result.component.identity.canonicalName).toBe('DtButton');
    expect(result.items).toEqual([
      { section: 'props', contract: records[0].props![0] },
    ]);
  });
  it('retains every scoped binding and event payload from the selected generated record', () => {
    const result = detail({ component: 'combobox-with-popover' });
    expect(result.items).toContainEqual({
      section: 'events',
      contract: records[2].events![0],
    });
    expect(result.items).toContainEqual({
      section: 'slots',
      contract: records[2].slots![0],
    });
    expect(result.unknown).toContain('methods');
  });
  it('never substitutes a candidate for an absent component or field', () => {
    expect(detail({ component: 'DtButton kind' }).match).toBe('no-match');
    const result = detail({
      component: 'DtButton',
      projection: 'props',
      field: 'missing',
    });
    expect(result.match).toBe('no-match');
    expect(result.available).toEqual(['kind']);
    expect(result.items).toEqual([]);
  });
  it('declares legacy import uncertainty and refuses ambiguous alias selection', () => {
    expect(
      detail({ component: 'Legacy' }, [{ displayName: 'Legacy', props: [] }])
        .match,
    ).toBe('unverified');
    const duplicate = records.map((c) => ({
      ...c,
      identity: { ...c.identity!, aliases: ['same'] },
    }));
    expect(detail({ component: 'same' }, duplicate).match).toBe('candidate');
  });
  it('keeps methods and exposed members when the generator supplies them', () => {
    const method = {
      name: 'focus',
      params: [{ name: 'options', type: { name: 'object' } }],
    };
    const result = detail({ component: 'DtButton' }, [
      {
        ...records[0],
        methods: [method],
        expose: [{ name: 'element', type: { name: 'HTMLElement' } }],
      } as Component,
    ]);
    expect(result.items).toContainEqual({
      section: 'methods',
      contract: method,
    });
    expect(result.items).toContainEqual({
      section: 'expose',
      contract: { name: 'element', type: { name: 'HTMLElement' } },
    });
  });
});
