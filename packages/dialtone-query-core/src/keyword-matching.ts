function normalizePhrase(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
    .replace(/[-_/]/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Every query word must belong to one authored phrase, not unrelated keywords. */
export function matchingKeywords(query: string, keywords: readonly string[] = []): string[] {
  const words = normalizePhrase(query).split(' ').filter(Boolean);
  if (!words.length) return [];
  const patterns = words.map(word => new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'));
  return keywords.filter(keyword => patterns.every(pattern => pattern.test(normalizePhrase(keyword))));
}
