import type { TokensData, Metadata, ThemeData } from './types.js';

export interface TokenThemeRecord {
  theme: string;
  contract: ThemeData;
}

/** Exact token selection retains all named source themes and migration metadata. */
export function getValueDetail(name: string, data: TokensData) {
  if (!Object.hasOwn(data, name))
    return { match: 'no-match' as const, subject: null, items: [] as TokenThemeRecord[] };
  const record = data[name];
  return {
    match: 'exact' as const,
    subject: {
      type: 'design-token', name,
      metadata: (record.metadata as Metadata | undefined) ?? null,
    },
    items: Object.entries(record)
      .filter(([theme]) => theme !== 'metadata')
      .map(([theme, contract]): TokenThemeRecord => ({ theme, contract: contract as ThemeData })),
  };
}

function fieldsText(fields: object) {
  return Object.entries(fields)
    .map(([field, value]) => `   - ${field}: ${typeof value === 'string' ? value : JSON.stringify(value)}`)
    .join('\n');
}

/** Markdown for a page of one token's theme records. */
export function formatTokenThemes(
  name: string,
  metadata: Metadata | null,
  page: TokenThemeRecord[],
): string {
  const metadataText = metadata ? `**Metadata:**\n${fieldsText(metadata)}\n\n` : '';
  const records = page
    .map((item, index) => `${index + 1}. **${item.theme}**\n${fieldsText(item.contract)}`)
    .join('\n');
  return `Theme records for **${name}**:\n\n${metadataText}${records}\nTheme values do not identify the active installed theme.`;
}
