// ============================================================================
// TOKENS SEARCH TOOL
// ============================================================================

import { applySmartFilter } from '../utils/filters.js';
import type {
  TokensData,
  TokenData,
  ThemeData,
  Metadata,
  SearchResult
} from '../types.js';

/**
 * Search design tokens using simple AND-logic (like Dialtone docs site)
 */
export function searchTokens(query: string, data: TokensData): { results: SearchResult[]; notes: string[] } {
  console.error(`\n[TOKEN SEARCH DEBUG] Query: "${query}"`);

  // Normalize query: lowercase, replace hyphens/slashes with spaces
  const normalized = query.toLowerCase().replace(/[/-]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 0);

  // Create regex for each word (handle px/rem conversion)
  const regexArray = words.map((word: string) => {
    // For px values, match EITHER px OR rem
    if (word.endsWith('px')) {
      const px = parseFloat(word);
      const rem = `${px / 10}rem`;
      const escapedPx = word.replace(/\./g, '\\.');
      const escapedRem = rem.replace(/\./g, '\\.');
      return new RegExp(`(${escapedPx}|${escapedRem})`, 'i');
    }

    // For rem values, match EITHER rem OR px
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

  console.error(`[TOKEN SEARCH DEBUG] Words:`, words);

  const results: SearchResult[] = [];

  // Check each token: ALL words must match somewhere
  for (const [tokenName, themeVariants] of Object.entries(data) as [string, TokenData][]) {
    // Skip component-specific tokens (not general design tokens)
    // Only include tokens that start with --dt- or --base-- (like the docs site does)
    if (!tokenName.startsWith('--dt-') && !tokenName.startsWith('--base--')) {
      continue;
    }

    // Gather searchable text: token name + all theme values + descriptions
    const searchableTexts = [tokenName.toLowerCase()];

    for (const [themeName, themeData] of Object.entries(themeVariants) as [string, ThemeData][]) {
      if (themeName === 'metadata') continue;
      if (themeData && themeData.value) {
        searchableTexts.push(String(themeData.value).toLowerCase());
      }
      if (themeData && themeData.description) {
        searchableTexts.push(String(themeData.description).toLowerCase());
      }
    }

    const combinedText = searchableTexts.join(' ');

    // Check if ALL regexes match somewhere
    const allWordsMatch = regexArray.every((regex: RegExp) => regex.test(combinedText));

    if (allWordsMatch) {
      const metadata = themeVariants['metadata'] as Metadata | undefined;
      results.push({
        type: 'design-token',
        name: tokenName,
        details: {
          allThemes: themeVariants
        },
        metadata: metadata || null
      });
    }
  }

  console.error(`[TOKEN SEARCH DEBUG] Found ${results.length} raw matches`);

  // Apply smart filter (remove deprecated, swap discouraged with alternatives)
  const { results: filtered, notes } = applySmartFilter(results, data);

  console.error(`[TOKEN SEARCH DEBUG] After filter: ${filtered.length} results\n`);

  return { results: filtered, notes };
}

/**
 * Format token search results with theme variant information
 */
export function formatTokenResults(results: SearchResult[], query: string): string {
  if (results.length === 0) {
    return `No token results found for "${query}".\n\nTry searching with:\n- Token category (e.g., "color", "spacing", "border")\n- Specific value (e.g., "#1C1C1C", "0.8rem")\n- Semantic name (e.g., "primary", "success", "danger")`;
  }

  let output = `Found ${results.length} design token${results.length > 1 ? 's' : ''} for "${query}":\n\n`;
  output += `ℹ️  **Note:** Design token values change based on the active theme (light/dark mode, brand variant).\n\n`;

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

    // Show theme variants
    output += `   Theme Variants:\n`;
    const themes = Object.entries(result.details.allThemes) as [string, ThemeData][];

    // Show first few themes as examples
    const themesToShow = themes.slice(0, 3);
    themesToShow.forEach(([themeName, themeData]: [string, ThemeData]) => {
      const valueStr = themeData && themeData.value ? String(themeData.value) : 'N/A';
      const descStr = themeData && themeData.description ? String(themeData.description) : '';
      const desc = descStr ? ` - ${descStr}` : '';
      output += `   - ${themeName}: ${valueStr}${desc}\n`;
    });

    if (themes.length > 3) {
      output += `   - ... and ${themes.length - 3} more theme variants\n`;
    }

    // Show usage example
    output += `   Usage: style="color: var(${result.name})"\n`;
    output += `   Note: This will automatically use the correct value for the active theme.\n\n`;
  });

  return output;
}
