// ============================================================================
// DOCUMENTATION SEARCH TOOL
// ============================================================================

import type { DocumentationRecord, SearchResult } from '../types.js';

const CONTENT_EXCERPT_MAX = 500;
const MAX_QUERY_CHARS = 256;
const MAX_QUERY_TERMS = 12;

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
  'no', 'not', 'than', 'too', 'very', 'just', 'also', 'now', 'then',
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

// Suffix rules ordered longest-first so "ation" is tried before "ion", "ion" before "ed", etc.
// Each entry is [suffix, minimumStemLength]. The minimum prevents over-stemming short words
// (e.g. "danger" → "dang" is rejected because 4 < 5 for the -er rule).
const STEM_RULES: [string, number][] = [
  ['ation', 4], ['ing', 4], ['ion', 4], ['ment', 4],
  ['ness', 4], ['ed', 4], ['er', 5], ['es', 4], ['ly', 4], ['e', 4], ['s', 5],
];

/**
 * Reduce a query term to its morphological stem using a lightweight suffix-stripping pass.
 * Both the query term and the corpus word will independently produce the same stem, letting
 * prefix-matching `\bstem\w*` catch all inflected forms without hardcoding word pairs.
 *
 * Examples: migrate → migrat, migration → migrat, loading → load, disabled → disabl
 */
function stemTerm(word: string): string {
  if (word.length < 5) return word;
  for (const [suffix, minStem] of STEM_RULES) {
    if (word.endsWith(suffix)) {
      const stem = word.slice(0, word.length - suffix.length);
      if (stem.length >= minStem) return stem;
    }
  }
  return word;
}

/**
 * Search documentation sections using OR-logic word-boundary regex matching.
 * Each query term independently scores sections; results ranked by match count descending.
 * Whats-new posts are ranked after all other content regardless of match count.
 */
export function searchDocumentation(
  query: string,
  data: DocumentationRecord[],
): { results: SearchResult[]; notes: string[] } {
  if (!query || typeof query !== 'string') return { results: [], notes: [] };

  // Bound input to prevent expensive worst-case scans on very long queries.
  const truncated = query.length > MAX_QUERY_CHARS;
  const bounded = truncated ? query.slice(0, MAX_QUERY_CHARS) : query;

  // Normalize: lowercase, strip punctuation (keep alphanumerics + hyphens for v-model etc.)
  const normalized = bounded.toLowerCase()
    .replace(/[='"]/g, ' ')    // strip = ' " (from kind='primary')
    .replace(/[^\w\s-]/g, ' ') // strip remaining punctuation except hyphens
    .trim();

  const allWords = normalized.split(/\s+/).filter(w => w.length > 1);
  // Remove stop words, but keep all words if the entire query is stop words
  const meaningful = allWords.filter(w => !STOP_WORDS.has(w));
  const baseWords = meaningful.length > 0 ? meaningful : allWords.filter(w => w.length > 0);
  if (baseWords.length === 0) return { results: [], notes: [] };
  const wordsTruncated = baseWords.length > MAX_QUERY_TERMS;
  const words = wordsTruncated ? baseWords.slice(0, MAX_QUERY_TERMS) : baseWords;

  const regexes = words.map(w => {
    const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const stem = stemTerm(escaped);
    // Use prefix matching (\bstem\w*) when the stem is ≥ 4 chars — this catches inflected
    // forms without needing a separate rule per suffix:
    //   migrate/migration/migrating → stem "migrat"   → \bmigrat\w*
    //   disable/disabled/disabling  → stem "disabl"   → \bdisabl\w*
    //   load/loading/loaded         → stem "load"     → \bload\w*
    //   tooltip/tooltips            → stem "tooltip"  → \btooltip\w*
    // Exact matching for very short stems (< 4 chars) to prevent noise (e.g. "ui" → \bui\b).
    const pattern = stem.length >= 4 ? `\\b${stem}\\w*` : `\\b${escaped}\\b`;
    return new RegExp(pattern, 'i');
  });

  // Determine whether a record's docTitle matches a query term.
  // Extracted before the scoring loop so title-matching sections are included even when
  // matchCount === 0 (e.g. searching "DtCombobox" when corpus sections say "Combobox").
  // Two checks:
  //   1. Direct:    query word === full docTitle  ("toast" → "Toast")
  //   2. Dt-prefix: strip leading "dt" and compare ("dtinput" → "Input" title)
  // Multi-word titles (e.g. "Select menu"): all title words must appear in query words.
  const checkTitleMatch = (record: DocumentationRecord): boolean => {
    const titleLower = record.docTitle.toLowerCase();
    if (words.some(w => {
      if (w === titleLower) return true;
      if (w.startsWith('dt') && w.length > 2 && w.slice(2) === titleLower) return true;
      return false;
    })) return true;
    // Multi-word title: every word in the title must appear in the query terms.
    const titleWords = titleLower.split(/\s+/).filter(t => t.length >= 2);
    return titleWords.length > 1 && titleWords.every(tw => words.includes(tw));
  };

  const scored: Array<{ result: SearchResult; matchCount: number; titleMatch: boolean }> = [];

  for (const record of data) {
    const fullBlob = [record.docTitle, ...record.headingPath, record.frontmatter.description ?? '', record.content].join(' ');
    const matchCount = regexes.filter(r => r.test(fullBlob)).length;
    const titleMatch = checkTitleMatch(record);
    // Include if content matched OR the document is specifically named in the query.
    if (matchCount === 0 && !titleMatch) continue;

    const headingLabel = record.headingPath.length > 0
      ? ` > ${record.headingPath.join(' > ')}`
      : '';

    scored.push({
      result: {
        type: 'documentation',
        name: `${record.docTitle}${headingLabel}`,
        details: record,
        metadata: null,
      },
      matchCount,
      titleMatch,
    });
  }

  // Sort priority (highest to lowest):
  //   1. Non-whats-new before whats-new (burial)
  //   2. Title match before non-title-match (named component beats incidental mention)
  //   3. Match count descending (more query terms matched = more relevant)
  //   4. Sections with headings before intro stubs (non-empty headingPath wins ties)
  scored.sort((a, b) => {
    const aIsNews = (a.result.details as DocumentationRecord).docId.startsWith('about/whats-new');
    const bIsNews = (b.result.details as DocumentationRecord).docId.startsWith('about/whats-new');
    if (aIsNews !== bIsNews) return aIsNews ? 1 : -1;
    if (a.titleMatch !== b.titleMatch) return a.titleMatch ? -1 : 1;
    if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
    // Prefer sections with actual headings over intro stubs (headingPath: [])
    const aIsIntro = (a.result.details as DocumentationRecord).headingPath.length === 0;
    const bIsIntro = (b.result.details as DocumentationRecord).headingPath.length === 0;
    if (aIsIntro !== bIsIntro) return aIsIntro ? 1 : -1;
    return 0;
  });
  // Deduplicate by docId — keep only the highest-scoring section per document.
  // The sort guarantees the best section per doc is first, so the first occurrence wins.
  const seenDocIds = new Set<string>();
  const results = scored
    .map(s => s.result)
    .filter(r => {
      const docId = (r.details as DocumentationRecord).docId;
      if (seenDocIds.has(docId)) return false;
      seenDocIds.add(docId);
      return true;
    });

  const notes: string[] = [];
  if (truncated) notes.push(`Query truncated to ${MAX_QUERY_CHARS} characters.`);
  if (wordsTruncated) notes.push(`Query truncated to ${MAX_QUERY_TERMS} terms.`);

  return { results, notes };
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
