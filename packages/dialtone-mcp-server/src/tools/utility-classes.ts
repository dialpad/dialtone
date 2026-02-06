// ============================================================================
// UTILITY CLASSES SEARCH TOOL
// ============================================================================

import { applySmartFilter } from '../utils/filters.js';
import type {
  UtilityClassesData,
  ClassData,
  ValueObject,
  SearchResult
} from '../types.js';

/**
 * Build a set of all compound properties that exist in the data
 * This is called once when the server starts
 */
export function buildCompoundPropertiesSet(data: UtilityClassesData): Set<string> {
  const compoundProps = new Set<string>();

  for (const classData of Object.values(data)) {
    for (const valueObj of classData.values) {
      const prop = valueObj.prop?.toLowerCase();
      if (prop && prop.includes('-')) {
        // Store compound properties like "padding-right", "text-align", etc.
        compoundProps.add(prop);
      }
    }
  }

  return compoundProps;
}

/**
 * Extract keywords from a search query
 * Detects compound properties (padding-right) from adjacent words (padding right)
 */
export function extractKeywords(query: string, compoundProperties: Set<string>): { words: string[]; compoundProperties: string[] } {
  const normalized = query.toLowerCase();
  const words = normalized.split(/\s+/).filter(w => w.length > 0);

  // Convert px values to rem for Dialtone's 10-based scale
  const convertedWords = words.flatMap((word: string) => {
    if (word.endsWith('px')) {
      const px = parseFloat(word);
      const rem = `${px / 10}rem`;
      return [word, rem];
    }
    return [word];
  });

  // Detect compound properties from adjacent words
  const compoundProps = [];
  for (let i = 0; i < convertedWords.length - 1; i++) {
    const word1 = convertedWords[i];
    const word2 = convertedWords[i + 1];

    // Skip if either word is a number/value
    if (word1.match(/^\d/) || word2.match(/^\d/)) continue;
    if (word1.endsWith('px') || word1.endsWith('rem') || word1.endsWith('%')) continue;
    if (word2.endsWith('px') || word2.endsWith('rem') || word2.endsWith('%')) continue;

    // Check if these two words form a compound property in EITHER order
    // e.g., "padding right" could be "padding-right" OR "right-padding"
    const potential1 = `${word1}-${word2}`;
    const potential2 = `${word2}-${word1}`;

    if (compoundProperties.has(potential1)) {
      compoundProps.push(potential1);
    } else if (compoundProperties.has(potential2)) {
      compoundProps.push(potential2);
    }
  }

  return {
    words: convertedWords,
    compoundProperties: compoundProps
  };
}

/**
 * Check if a keyword is a pure value (not a property name)
 */
export function isValueKeyword(word: string): boolean {
  // Numeric values with units: 8px, 0.8rem, 50%, 1em
  if (word.match(/^\d+(\.\d+)?(px|rem|%|em)$/)) return true;
  // Hex colors: #1C1C1C, #fff
  if (word.match(/^#[0-9a-f]+$/i)) return true;
  // Numbers without units: 8, 16, 100
  if (word.match(/^\d+(\.\d+)?$/)) return true;
  return false;
}

/**
 * Helper: Check if a value matches a keyword
 */
export function valueMatchesKeyword(value: string, description: string | undefined, word: string): boolean {
  // For numeric values with units (8px, 0.8rem, 50%), use token-based matching
  if (word.match(/^\d+(\.\d+)?(px|rem|%|em)$/)) {
    const valueTokens = value.split(/\s+/);
    const descTokens = (description || '').split(/\s+/);
    return valueTokens.includes(word) || descTokens.includes(word);
  }
  // For other keywords, use word boundary matching
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const wordBoundaryRegex = new RegExp(`\\b${escapedWord}\\b`, 'i');
  return wordBoundaryRegex.test(value) || wordBoundaryRegex.test(description || '');
}

/**
 * Search utility classes using simple AND-logic (like Dialtone docs site)
 */
export function searchUtilityClasses(query: string, data: UtilityClassesData): { results: SearchResult[]; notes: string[] } {
  console.error(`\n[CLASS SEARCH DEBUG] Query: "${query}"`);

  // Normalize query: lowercase, replace hyphens/slashes with spaces
  const normalized = query.toLowerCase().replace(/[/-]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 0);

  // Create regex for each word (handle px/rem conversion)
  const regexArray = words.map((word: string) => {
    // For px values, create regex that matches EITHER px OR rem
    if (word.endsWith('px')) {
      const px = parseFloat(word);
      const rem = `${px / 10}rem`;
      const escapedPx = word.replace(/\./g, '\\.');
      const escapedRem = rem.replace(/\./g, '\\.');
      return new RegExp(`(${escapedPx}|${escapedRem})`, 'i');
    }

    // For rem values, create regex that matches EITHER rem OR px
    if (word.endsWith('rem')) {
      const remValue = parseFloat(word);
      const px = `${remValue * 10}px`;
      const escapedRem = word.replace(/\./g, '\\.');
      const escapedPx = px.replace(/\./g, '\\.');
      return new RegExp(`(${escapedRem}|${escapedPx})`, 'i');
    }

    // For other words, simple regex
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(escaped, 'i');
  });

  console.error(`[CLASS SEARCH DEBUG] Words:`, words);

  const results: SearchResult[] = [];

  // Check each class: ALL words must match somewhere
  for (const [className, classData] of Object.entries(data) as [string, ClassData][]) {
    // Gather all searchable text for this class
    const searchableTexts = [className.toLowerCase()];

    for (const valueObj of classData.values) {
      searchableTexts.push(valueObj.prop?.toLowerCase() || '');
      searchableTexts.push(valueObj.value?.toLowerCase() || '');
      searchableTexts.push(valueObj.description?.toLowerCase() || '');
    }

    const combinedText = searchableTexts.join(' ');

    // Check if ALL regexes match somewhere in the combined text
    const allWordsMatch = regexArray.every((regex: RegExp) => regex.test(combinedText));

    if (allWordsMatch) {
      results.push({
        type: 'utility-class',
        name: className,
        details: {
          properties: classData.values
        },
        metadata: classData.metadata || null
      });
    }
  }

  console.error(`[CLASS SEARCH DEBUG] Found ${results.length} raw matches`);

  // Apply smart filter (remove deprecated, swap discouraged with alternatives)
  const { results: filtered, notes } = applySmartFilter(results, data);

  console.error(`[CLASS SEARCH DEBUG] After filter: ${filtered.length} results\n`);

  return { results: filtered, notes };
}

/**
 * Format search results as readable text
 */
export function formatResults(results: SearchResult[], query: string): string {
  if (results.length === 0) {
    return `No results found for "${query}".\n\nTry searching with:\n- Property + value (e.g., "padding right 8px", "display flex")\n- Full property name (e.g., "overflow hidden", "position relative")`;
  }

  let output = `Found ${results.length} result${results.length > 1 ? 's' : ''} for "${query}":\n\n`;

  results.forEach((result: SearchResult, index: number) => {
    output += `${index + 1}. **${result.name}**\n`;

    // Show metadata warnings if present
    if (result.metadata) {
      if (result.metadata.deprecated) {
        output += `   ⚠️  **DEPRECATED:** ${result.metadata.reason}\n`;
      } else if (result.metadata.discouraged) {
        output += `   ⚠️  **DISCOURAGED:** ${result.metadata.reason}\n`;
      }

      if (result.metadata.alternatives && result.metadata.alternatives.length > 0) {
        output += `   📝 **Use instead:** ${result.metadata.alternatives.join(', ')}\n`;
      }

      if (result.metadata.docs) {
        output += `   📖 **Docs:** ${result.metadata.docs}\n`;
      }

      output += `\n`;
    }

    // Show properties
    result.details.properties.forEach((prop: ValueObject) => {
      const desc = prop.description ? ` (${prop.description})` : '';
      output += `   - ${prop.prop}: ${prop.value}${desc}\n`;
    });

    // Show usage example
    output += `   Usage: <div class="${result.name}">...</div>\n\n`;
  });

  return output;
}
