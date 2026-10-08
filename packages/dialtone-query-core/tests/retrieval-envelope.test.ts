import { describe, it, expect } from 'vitest';
import {
  createRetrievalEnvelope,
  formatRetrievalEnvelope,
} from '../src/retrieval.js';
const stamp = {
  schemaVersion: 1,
  buildHash: 'a'.repeat(64),
  domains: {
    components: {
      package: '@dialpad/dialtone-vue',
      version: '4.3.1',
      schemaVersion: 2,
      hash: 'b'.repeat(64),
    },
  },
};
const envelope = (options: Parameters<typeof createRetrievalEnvelope>[0]) => {
  return createRetrievalEnvelope(options, stamp);
};
describe('bounded C2 result contract', () => {
  it('returns counts, explicit omissions, bundled versions and a stable continuation', () => {
    const result = envelope({
      tool: 'search_components',
      args: { query: 'button', limit: 2, offset: 0 },
      mode: 'discovery',
      domain: 'components',
      match: 'candidate',
      items: [{ name: 'A' }, { name: 'B' }, { name: 'C' }],
    });
    expect(result.counts).toEqual({ total: 3, returned: 2 });
    expect(result.continuation).toEqual({
      tool: 'search_components',
      arguments: { query: 'button', limit: 2, offset: 2 },
    });
    expect(result.source).toMatchObject({
      selection: 'bundled',
      installedCompatibility: 'not_checked',
      domains: stamp.domains,
    });
    expect(result.truncation.truncated).toBe(true);
  });
  it('pages only between atomic contracts using UTF8 rather than character count', () => {
    const items = Array.from({ length: 15 }, (_, i) => ({
      name: `item${i}`,
      description: 'é'.repeat(800),
    }));
    const result = envelope({
      tool: 'search_components',
      args: { query: 'button', limit: 15, offset: 0 },
      mode: 'discovery',
      domain: 'components',
      match: 'candidate',
      items,
    });
    expect(Buffer.byteLength(JSON.stringify(result))).toBeLessThanOrEqual(6000);
    expect(result.items[0]).toEqual(items[0]);
    expect(result.counts.returned).toBeLessThan(15);
    expect(result.continuation.arguments.offset).toBe(result.counts.returned);
  });
  it('does not mislabel an oversized atomic field as a complete result', () => {
    const result = envelope({
      tool: 'get_component',
      args: {
        component: 'DtButton',
        projection: 'props',
        field: 'kind',
        limit: 20,
        offset: 0,
      },
      mode: 'detail',
      domain: 'components',
      match: 'exact',
      items: [
        {
          section: 'props',
          contract: { name: 'kind', values: ['a'.repeat(60000)] },
        },
      ],
    });
    expect(result.match).toBe('unavailable');
    expect(result.truncation.omissions).toContain(
      'atomic_contract_exceeds_budget',
    );
    expect(result.continuation).toBeNull();
    expect(result.budget.estimatedTokens).toBe(
      Math.ceil(Buffer.byteLength(JSON.stringify(result)) / 4),
    );
  });
  it('text fallback includes the same selected facts, source and continuation as structured JSON', () => {
    const result = envelope({
      tool: 'get_component',
      args: { component: 'DtButton', limit: 1, offset: 0 },
      mode: 'detail',
      domain: 'components',
      match: 'exact',
      items: [
        {
          name: 'kind',
          values: ['primary', 'old'],
          defaultValue: { value: 'primary' },
        },
      ],
    });
    expect(formatRetrievalEnvelope(result)).toContain(JSON.stringify(result));
  });
});
