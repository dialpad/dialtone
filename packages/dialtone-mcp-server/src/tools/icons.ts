// ============================================================================
// ICONS SEARCH TOOL
// ============================================================================

import type { IconsData, SearchResult } from '../types.js';

/**
 * Search icons by name, category, and keywords using AND-logic
 * Simple single-bucket approach: all words must match somewhere in (name + category + keywords)
 */
export function searchIcons(query: string, data: IconsData): { results: SearchResult[]; notes: string[] } {
  console.error(`\n[ICON SEARCH DEBUG] Query: "${query}"`);

  // Normalize query: lowercase, replace hyphens/slashes with spaces
  const normalized = query.toLowerCase().replace(/[/-]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 0);

  // Create regex for each word
  const regexArray = words.map((word: string) => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(escaped, 'i');
  });

  console.error(`[ICON SEARCH DEBUG] Words:`, words);

  const results: SearchResult[] = [];

  // Iterate through all categories and icons
  for (const [categoryName, icons] of Object.entries(data.categories)) {
    for (const [iconName, keywords] of Object.entries(icons)) {
      // Gather searchable text: icon name + category + keywords
      const searchableTexts = [
        iconName.toLowerCase(),
        categoryName.toLowerCase(),
        ...keywords.map(k => k.toLowerCase())
      ];

      const combinedText = searchableTexts.join(' ');

      // Check if ALL regexes match somewhere (AND logic)
      const allWordsMatch = regexArray.every((regex: RegExp) => regex.test(combinedText));

      if (allWordsMatch) {
        results.push({
          type: 'icon',
          name: iconName,
          details: {
            category: categoryName,
            keywords: keywords
          },
          metadata: null  // Icons don't have metadata
        });
      }
    }
  }

  console.error(`[ICON SEARCH DEBUG] Found ${results.length} matches\n`);

  return { results, notes: [] };
}

/**
 * Format icon search results
 */
export function formatIconResults(results: SearchResult[], query: string): string {
  if (results.length === 0) {
    return `No icons found for "${query}".\n\nTry searching with:\n- Icon name (e.g., "bell", "arrow", "calendar")\n- Category (e.g., "alerts", "communication", "time")\n- Keyword (e.g., "notification", "email", "warning")`;
  }

  let output = `Found ${results.length} icon${results.length > 1 ? 's' : ''} for "${query}":\n\n`;

  // Group by category for better organization
  const byCategory: { [category: string]: SearchResult[] } = {};
  results.forEach((result: SearchResult) => {
    const cat = result.details.category;
    if (!byCategory[cat]) {
      byCategory[cat] = [];
    }
    byCategory[cat].push(result);
  });

  // Show results grouped by category
  Object.entries(byCategory).forEach(([category, icons]) => {
    output += `**${category}:**\n`;
    icons.forEach((icon: SearchResult) => {
      output += `  • **${icon.name}**`;
      if (icon.details.keywords && icon.details.keywords.length > 0) {
        output += ` - ${icon.details.keywords.join(', ')}`;
      }
      output += `\n`;
    });
    output += `\n`;
  });

  // Usage example - convert kebab-case icon name to PascalCase component name
  const firstIconName = results[0].name;
  const pascalCaseName = firstIconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  const componentName = `DtIcon${pascalCaseName}`;

  output += `**Usage:**\n`;
  output += `\`\`\`vue\n`;
  output += `import { ${componentName} } from '@dialpad/dialtone-icons/vue3'\n`;
  output += `\`\`\`\n`;

  return output;
}
