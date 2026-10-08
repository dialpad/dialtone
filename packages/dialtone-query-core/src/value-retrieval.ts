import type {
  SearchResult,
  TokenData,
  TokensData,
  ClassData,
  UtilityClassesData,
  Metadata,
} from './types.js';

type ValueDomain = 'tokens' | 'utilityClasses';
function valueRecords(result: SearchResult) {
  return result.type === 'design-token'
    ? Object.entries(result.details.allThemes as TokenData)
        .filter(([theme]) => theme !== 'metadata')
        .map(([theme, contract]) => ({ theme, contract }))
    : result.details.properties;
}

/** Named previews retain their source values; counts never imply completeness. */
export function projectDiscoveryValues(result: SearchResult) {
  const values = valueRecords(result);
  const previewValues = values.slice(0, 2);
  return {
    type: result.type,
    name: result.name,
    metadata: result.metadata,
    valueCounts: {
      total: values.length,
      previewed: previewValues.length,
      omitted: values.length - previewValues.length,
    },
    previewValues,
  };
}

/** Exact source-key selection bypasses fuzzy search and alternative replacement. */
export function getValueDetail(
  name: string,
  domain: ValueDomain,
  data: TokensData | UtilityClassesData,
) {
  if (!Object.hasOwn(data, name))
    return { match: 'no-match' as const, subject: null, items: [] };
  const record = data[name];
  const result: SearchResult = {
    type: domain === 'tokens' ? 'design-token' : 'utility-class',
    name,
    metadata: (record.metadata as Metadata | undefined) ?? null,
    details:
      domain === 'tokens'
        ? { allThemes: record as TokenData }
        : { properties: (record as ClassData).values },
  };
  return {
    match: 'exact' as const,
    subject: { type: result.type, name, metadata: result.metadata },
    items: valueRecords(result),
  };
}
