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

const CONTEXT_FILLER = new Set([
  'a', 'an', 'the', 'and', 'or', 'to', 'for', 'of', 'in', 'on', 'with', 'how',
  'component', 'components', 'directive', 'directives',
]);

/** Opt-in discovery accepts a regular plural of a known token, without stemming. */
export function matchesDiscoveryWord(actual: string | undefined, expected: string): boolean {
  return actual === expected || (expected.length >= 3 && !expected.endsWith('s') && actual === `${expected}s`);
}

export function matchesDiscoveryPhrase(words: readonly string[], phrase: readonly string[]): boolean {
  return phrase.length > 0 && words.some((_, index) =>
    phrase.every((part, offset) => matchesDiscoveryWord(words[index + offset], part)));
}

/** Separate authored phrases cannot combine into a stronger complete phrase. */
export function discoveryPhraseCoverage(words: readonly string[], phrases: readonly string[]): number {
  return Math.max(0, ...phrases.map(phrase => {
    const parts = normalizedKeyword(phrase).split(' ');
    return words.filter(word => parts.some(part => matchesDiscoveryWord(word, part))).length;
  }));
}

/** Match one authored phrase; discovery may also recognize that complete phrase inside a request. */
export function keywordMatcher(query: string, { includeContext = false, includePartialContext = true }: { includeContext?: boolean; includePartialContext?: boolean } = {}): (keywords?: readonly string[]) => string[] {
  const normalized = normalizeKeywordText(query);
  const words = normalized.split(' ').filter(Boolean);
  const patterns = words
    .map(word => new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`));
  if (!patterns.length) return () => [];
  return (keywords = []) => keywords.filter((keyword) => {
    const phrase = normalizedKeyword(keyword);
    const parts = phrase.split(' ').filter(Boolean);
    return patterns.every(pattern => pattern.test(phrase))
      || (includeContext && parts.some(part => !CONTEXT_FILLER.has(part))
        && (words.every(word => parts.some(part => matchesDiscoveryWord(word, part)))
          || (includePartialContext && matchesDiscoveryPhrase(words, parts))));
  });
}
