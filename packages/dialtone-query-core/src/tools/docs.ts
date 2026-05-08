// ============================================================================
// DOCUMENTATION SEARCH TOOL
// ============================================================================

import type { DocumentationRecord, SearchResult } from '../types.js';

const CONTENT_EXCERPT_MAX = 500;

// Common English words that add no signal when matching docs.
// Filtering them prevents AND-logic from requiring "how", "I", "difference" etc.
// to appear in every matching section.
const STOP_WORDS = new Set([
  // Articles / conjunctions / prepositions
  'a', 'an', 'the', 'and', 'or', 'but', 'nor', 'for', 'yet', 'so',
  'in', 'on', 'at', 'by', 'to', 'of', 'up', 'as', 'if', 'is',
  'into', 'onto', 'from', 'with', 'about', 'above', 'below', 'between',
  'through', 'during', 'before', 'after', 'against', 'among', 'around',
  // Auxiliaries
  'be', 'been', 'being', 'are', 'was', 'were', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may',
  'might', 'shall', 'can', 'cannot',
  // Pronouns
  'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she', 'it',
  'its', 'they', 'their', 'this', 'that', 'these', 'those',
  // Question words
  'what', 'which', 'who', 'whom', 'whose', 'how', 'when', 'where', 'why',
  // Quantifiers / adverbs
  'all', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'not', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'then',
  // Query-structure words (appear in natural-language questions, not in docs)
  'difference', 'differences', 'correct', 'behavior', 'replacement',
  'async', 'during', 'wire', 'list', 'put', 'make', 'show', 'closing', 'opening',
  // Contraction fragments (apostrophe normalization produces "isn", "wasn", "don" etc.)
  'isn', 'wasn', 'hasn', 'didn', 'wouldn', 'shouldn', 'couldn', 'don',
  'haven', 'aren', 'weren', 'won', 'shan',
  // Too-generic domain words (not useful discriminators)
  'component', 'components', 'dialtone', 'support', 'supports', 'using',
  // Filler
  's', 't',
]);

/**
 * Search documentation sections using AND-logic word-boundary regex matching.
 * Mirrors the hand-rolled pattern used by the other 4 search tools.
 * Tier scoring: 1 = title/heading match, 2 = description match, 3 = content-only.
 */
export function searchDocumentation(
  query: string,
  data: DocumentationRecord[],
): { results: SearchResult[]; notes: string[] } {
  if (!query || typeof query !== 'string') return { results: [], notes: [] };

  // Normalize: lowercase, strip punctuation (keep alphanumerics + hyphens for v-model etc.)
  const normalized = query.toLowerCase()
    .replace(/[='"]/g, ' ')    // strip = ' " (from kind='primary')
    .replace(/[^\w\s-]/g, ' ') // strip remaining punctuation except hyphens
    .trim();

  const allWords = normalized.split(/\s+/).filter(w => w.length > 1);
  // Remove stop words, but keep all words if the entire query is stop words
  const meaningful = allWords.filter(w => !STOP_WORDS.has(w));
  const words = meaningful.length > 0 ? meaningful : allWords.filter(w => w.length > 0);
  if (words.length === 0) return { results: [], notes: [] };

  const regexes = words.map(w => {
    const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i');
  });

  const results: SearchResult[] = [];

  for (const record of data) {
    const titleAndHeading = [record.docTitle, ...record.headingPath].join(' ');
    const description = record.frontmatter.description ?? '';
    const fullBlob = [titleAndHeading, description, record.content].join(' ');

    // AND logic: every word must appear somewhere in the record
    if (!regexes.every(r => r.test(fullBlob))) continue;

    // Tier scoring based on WHERE the match concentrates
    const tier = regexes.every(r => r.test(titleAndHeading))
      ? 1
      : regexes.every(r => r.test(description))
        ? 2
        : 3;

    const headingLabel = record.headingPath.length > 0
      ? ` > ${record.headingPath.join(' > ')}`
      : '';

    results.push({
      type: 'documentation',
      name: `${record.docTitle}${headingLabel}`,
      details: record,
      metadata: null,
      tier,
    });
  }

  // Sort tier ascending (1 before 2 before 3), preserve corpus order within tier
  results.sort((a, b) => (a.tier ?? 3) - (b.tier ?? 3));

  return { results, notes: [] };
}

/**
 * Format documentation search results as a markdown string for AI client consumption.
 * Each result: heading line + content excerpt + optional Figma/Storybook links.
 */
export function formatDocumentationResults(
  results: SearchResult[],
  _query: string,
): string {
  if (results.length === 0) return '';

  return results.map(result => {
    const record = result.details as DocumentationRecord;
    const heading = record.headingPath.length > 0
      ? `### ${record.docTitle} — ${record.headingPath.join(' > ')}`
      : `### ${record.docTitle}`;

    const excerpt = record.content.length > CONTENT_EXCERPT_MAX
      ? `${record.content.slice(0, CONTENT_EXCERPT_MAX).trimEnd()}...`
      : record.content;

    const links: string[] = [];
    if (record.frontmatter.storybook) links.push(`[Storybook](${record.frontmatter.storybook})`);
    if (record.frontmatter.figmaUrl) links.push(`[Figma](${record.frontmatter.figmaUrl})`);

    const linkLine = links.length > 0 ? `\n${links.join(' · ')}` : '';
    return `${heading}\n\n${excerpt}${linkLine}`;
  }).join('\n\n---\n\n');
}
