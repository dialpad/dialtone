// Authored keywords come from a fixed dataset, so each phrase is normalized once.
const normalizedPhrases = new Map<string, string>();

function normalizePhrase(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ').replace(/\s+/g, ' ').trim();
}

function normalizedKeyword(keyword: string): string {
  let phrase = normalizedPhrases.get(keyword);
  if (phrase === undefined) normalizedPhrases.set(keyword, phrase = normalizePhrase(keyword));
  return phrase;
}

/** Every query word must belong to one authored phrase, not unrelated keywords. Build once per query. */
export function keywordMatcher(query: string): (keywords?: readonly string[]) => string[] {
  const patterns = normalizePhrase(query).split(' ').filter(Boolean)
    .map(word => new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`));
  if (!patterns.length) return () => [];
  return (keywords = []) => keywords.filter((keyword) => {
    const phrase = normalizedKeyword(keyword);
    return patterns.every(pattern => pattern.test(phrase));
  });
}
