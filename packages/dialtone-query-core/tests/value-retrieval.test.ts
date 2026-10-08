import { describe, it, expect } from 'vitest';
import {
  projectDiscoveryValues,
  getValueDetail,
} from '../src/value-retrieval.js';

describe('bounded value discovery and exact source detail', () => {
  it('projects large theme maps with explicit previews/counts and all migration metadata', () => {
    const metadata = {
      deprecated: true,
      reason: 'Legacy subject',
      alternatives: ['--dt-new'],
      docs: '/migration/',
      replacement: '--dt-new',
    };
    const allThemes = {
      metadata,
      ...Object.fromEntries(
        Array.from({ length: 120 }, (_, i) => [
          `theme-${i}`,
          { value: i, description: 'Source value description' },
        ]),
      ),
    };
    const summary = projectDiscoveryValues({
      type: 'design-token',
      name: '--dt-test',
      metadata,
      details: { allThemes },
    });
    expect(summary).toMatchObject({
      type: 'design-token',
      name: '--dt-test',
      metadata,
      valueCounts: { total: 120, previewed: 2, omitted: 118 },
    });
    expect(summary.previewValues).toEqual([
      {
        theme: 'theme-0',
        contract: { value: 0, description: 'Source value description' },
      },
      {
        theme: 'theme-1',
        contract: { value: 1, description: 'Source value description' },
      },
    ]);
    const detail = getValueDetail('--dt-test', 'tokens', {
      '--dt-test': allThemes,
    });
    expect(detail.items).toHaveLength(120);
    expect(detail.subject?.metadata).toEqual(metadata);
    expect(detail.items[119]).toEqual({
      theme: 'theme-119',
      contract: allThemes['theme-119'],
    });
  });
  it('retains compound property records and migration metadata', () => {
    const values = Array.from({ length: 51 }, (_, i) => ({
      prop: `property-${i}`,
      value: 'é'.repeat(120),
      description: 'Source property',
    }));
    const metadata = {
      discouraged: true,
      reason: 'Prefer a newer class',
      alternatives: ['d-new'],
    };
    const summary = projectDiscoveryValues({
      type: 'utility-class',
      name: 'd-test',
      metadata,
      details: { properties: values },
    });
    expect(summary.valueCounts).toEqual({
      total: 51,
      previewed: 2,
      omitted: 49,
    });
    expect(summary.previewValues).toEqual(values.slice(0, 2));
    const detail = getValueDetail('d-test', 'utilityClasses', {
      'd-test': { values, metadata },
    });
    expect(detail.items).toEqual(values);
    expect(detail.subject).toEqual({
      type: 'utility-class',
      name: 'd-test',
      metadata,
    });
  });
  it('does not interpret broad phrases, prefixes or inherited keys as selected names', () => {
    const data = {
      '--dt-color-primary': { base: { value: 'red' } },
      '--dt-color-primary-hover': { base: { value: 'blue' } },
    };
    for (const query of ['color primary', '--dt-color', 'constructor'])
      expect(getValueDetail(query, 'tokens', data)).toMatchObject({
        match: 'no-match',
        subject: null,
        items: [],
      });
    expect(getValueDetail('--dt-color-primary', 'tokens', data).items).toEqual([
      { theme: 'base', contract: { value: 'red' } },
    ]);
  });
});
