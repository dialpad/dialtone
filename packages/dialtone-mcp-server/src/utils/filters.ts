// ============================================================================
// SMART FILTER UTILITIES
// ============================================================================

import type {
  SearchResult,
  UtilityClassesData,
  TokensData,
  Component
} from '../types.js';

/**
 * Smart filter to handle deprecated and discouraged items
 * - Deprecated: Remove completely
 * - Discouraged: Show alternatives from metadata with note
 * - Clean: Keep as-is
 */
export function applySmartFilter(results: SearchResult[], data: UtilityClassesData | TokensData | { [key: string]: Component }): { results: SearchResult[]; notes: string[] } {
  const filtered: SearchResult[] = [];
  const notes: string[] = [];
  const swapped: string[] = [];
  let deprecatedCount = 0;

  for (const result of results) {
    // Remove deprecated items completely
    if (result.metadata?.deprecated) {
      console.error(`[FILTER] Removing deprecated: ${result.name}`);
      deprecatedCount++;
      continue;
    }

    // Swap discouraged items with alternatives
    if (result.metadata?.discouraged && result.metadata?.alternatives && result.metadata.alternatives.length > 0) {
      console.error(`[FILTER] Swapping discouraged: ${result.name} with alternatives: ${result.metadata.alternatives.join(', ')}`);

      // For each alternative pattern
      for (const altPattern of result.metadata.alternatives) {
        // Handle wildcard patterns like "d-headline-*"
        const isWildcard = altPattern.includes('*');

        if (isWildcard) {
          // Remove wildcard and find matching items
          const prefix = altPattern.replace(/\*/g, '');

          for (const [name, itemData] of Object.entries(data) as [string, any][]) {
            if (name.startsWith(prefix)) {
              // Don't add if already in results or if it's also discouraged/deprecated
              const alreadyAdded = filtered.some(f => f.name === name) || swapped.includes(name);
              const isProblematic = itemData.metadata?.deprecated || itemData.metadata?.discouraged;

              if (!alreadyAdded && !isProblematic) {
                const details = 'values' in itemData
                  ? { properties: itemData.values }
                  : result.details;
                filtered.push({
                  ...result,
                  name: name,
                  details: details,
                  metadata: itemData.metadata || null
                });
                swapped.push(name);

                // Limit alternatives per discouraged item
                if (swapped.length >= 5) break;
              }
            }
          }
        } else {
          // Exact alternative name
          if (data[altPattern]) {
            const altData = data[altPattern] as any;
            const alreadyAdded = filtered.some(f => f.name === altPattern) || swapped.includes(altPattern);
            const isProblematic = altData.metadata?.deprecated || altData.metadata?.discouraged;

            if (!alreadyAdded && !isProblematic) {
              const details = 'values' in altData
                ? { properties: altData.values }
                : result.details;
              filtered.push({
                ...result,
                name: altPattern,
                details: details,
                metadata: altData.metadata || null
              });
              swapped.push(altPattern);
            }
          }
        }
      }

      if (swapped.length > 0) {
        notes.push(`Replaced discouraged "${result.name}" with recommended alternatives`);
      }
      continue;
    }

    // Keep clean items and discouraged without alternatives
    filtered.push(result);
  }

  if (deprecatedCount > 0) {
    notes.push(`Filtered out ${deprecatedCount} deprecated item${deprecatedCount > 1 ? 's' : ''}`);
  }

  return { results: filtered, notes };
}
