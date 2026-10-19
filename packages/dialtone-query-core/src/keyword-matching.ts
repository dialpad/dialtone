// Authored keywords come from a fixed dataset, so each phrase is normalized once.
const normalizedPhrases = new Map<string, string>();

export function normalizeKeywordText(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ').replace(/\s+/g, ' ').trim();
}

function normalizedKeyword(keyword: string): string {
  let phrase = normalizedPhrases.get(keyword);
  if (phrase === undefined) normalizedPhrases.set(keyword, phrase = normalizeKeywordText(keyword));
  return phrase;
}

/** Match one authored phrase; discovery may also recognize that complete phrase inside a request. */
export function keywordMatcher(query: string, { includeContext = false }: { includeContext?: boolean } = {}): (keywords?: readonly string[]) => string[] {
  const normalized = normalizeKeywordText(query);
  const context = ` ${normalized} `;
  const patterns = normalized.split(' ').filter(Boolean)
    .map(word => new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`));
  if (!patterns.length) return () => [];
  return (keywords = []) => keywords.filter((keyword) => {
    const phrase = normalizedKeyword(keyword);
    return patterns.every(pattern => pattern.test(phrase))
      || (includeContext && phrase.length > 0 && context.includes(` ${phrase} `));
  });
}
