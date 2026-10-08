import { describe, it, expect } from 'vitest';
import { getValueDetail } from '../src/value-retrieval.js';

describe('exact token theme retrieval', () => {
  it('retains all named theme contracts, zero values and migration metadata', () => {
    const metadata = {
      deprecated: true, reason: 'Legacy subject', alternatives: ['--dt-new'],
      docs: '/migration/', replacement: '--dt-new',
    };
    const detail = getValueDetail('--dt-test', {
      '--dt-test': {
        metadata,
        light: { value: 0, description: 'Zero value' },
        dark: { value: 1, description: 'Dark value' },
        material: { value: 2, description: 'Material value' },
      },
    });
    expect(detail.subject?.metadata).toEqual(metadata);
    expect(detail.items).toEqual([
      { theme: 'light', contract: { value: 0, description: 'Zero value' } },
      { theme: 'dark', contract: { value: 1, description: 'Dark value' } },
      { theme: 'material', contract: { value: 2, description: 'Material value' } },
    ]);
  });

  it('does not interpret broad phrases, prefixes or inherited keys as selected names', () => {
    const data = {
      '--dt-color-primary': { base: { value: 'red' } },
      '--dt-color-primary-hover': { base: { value: 'blue' } },
    };
    for (const query of ['color primary', '--dt-color', 'constructor'])
      expect(getValueDetail(query, data)).toMatchObject({
        match: 'no-match', subject: null, items: [],
      });
    expect(getValueDetail('--dt-color-primary', data).items).toEqual([
      { theme: 'base', contract: { value: 'red' } },
    ]);
  });
});
