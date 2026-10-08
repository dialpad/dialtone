import type { TokensData, Metadata } from './types.js';

/** Exact token selection retains all named source themes and migration metadata. */
export function getValueDetail(name: string, data: TokensData) {
  if (!Object.hasOwn(data, name))
    return { match: 'no-match' as const, subject: null, items: [] };
  const record = data[name];
  return {
    match: 'exact' as const,
    subject: {
      type: 'design-token', name,
      metadata: (record.metadata as Metadata | undefined) ?? null,
    },
    items: Object.entries(record)
      .filter(([theme]) => theme !== 'metadata')
      .map(([theme, contract]) => ({ theme, contract })),
  };
}
