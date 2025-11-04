// ============================================================================
// COMPONENTS SEARCH TOOL
// ============================================================================

import { applySmartFilter } from '../utils/filters.js';
import type {
  Component,
  ComponentProp,
  ComponentEvent,
  ComponentSlot,
  SearchResult,
  ValueObject
} from '../types.js';

/**
 * Search Vue components by name, description, or props
 */
export function searchComponents(query: string, components: Component[]): { results: SearchResult[]; notes: string[] } {
  console.error(`\n[COMPONENT SEARCH DEBUG] Query: "${query}"`);

  // Normalize query: lowercase, replace hyphens/slashes with spaces
  const normalized = query.toLowerCase().replace(/[/-]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 0);

  // Create regex for each word
  const regexArray = words.map((word: string) => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(escaped, 'i');
  });

  console.error(`[COMPONENT SEARCH DEBUG] Words:`, words);

  const results: SearchResult[] = [];

  // Check each component: ALL words must match somewhere
  for (const component of components) {
    // Gather searchable text: name + description + prop names + prop descriptions
    const searchableTexts = [
      (component.displayName || '').toLowerCase(),
      (component.description || '').toLowerCase()
    ];

    for (const prop of component.props || []) {
      searchableTexts.push((prop.name || '').toLowerCase());
      searchableTexts.push((prop.description || '').toLowerCase());
    }

    const combinedText = searchableTexts.join(' ');

    // Check if ALL regexes match somewhere
    const allWordsMatch = regexArray.every((regex: RegExp) => regex.test(combinedText));

    if (allWordsMatch) {
      results.push({
        type: 'component',
        name: component.displayName,
        details: {
          description: component.description,
          props: component.props || [],
          events: component.events || [],
          slots: component.slots || []
        },
        metadata: component.metadata || null
      });
    }
  }

  console.error(`[COMPONENT SEARCH DEBUG] Found ${results.length} raw matches`);

  // Apply smart filter (remove deprecated, swap discouraged with alternatives)
  // Note: Pass components array as data source for potential alternatives
  const componentsData: { [key: string]: Component } = {};
  components.forEach((c: Component) => { componentsData[c.displayName] = c; });
  const { results: filtered, notes } = applySmartFilter(results, componentsData);

  console.error(`[COMPONENT SEARCH DEBUG] After filter: ${filtered.length} results\n`);

  return { results: filtered, notes };
}

/**
 * Format component search results
 */
export function formatComponentResults(results: SearchResult[], query: string): string {
  if (results.length === 0) {
    return `No components found for "${query}".\n\nTry searching with:\n- Component name (e.g., "button", "modal", "avatar")\n- Partial name (e.g., "badge", "card")\n- Component feature (e.g., "dropdown", "tooltip")`;
  }

  let output = `Found ${results.length} component${results.length > 1 ? 's' : ''} for "${query}":\n\n`;

  results.forEach((result: SearchResult, index: number) => {
    output += `${index + 1}. **${result.name}**\n`;

    // Show metadata warnings if present
    if (result.metadata) {
      if (result.metadata.deprecated) {
        output += `   ⚠️  **DEPRECATED:** ${result.metadata.reason}\n`;
      }

      if (result.metadata.replacement) {
        output += `   📝 **Use instead:** ${result.metadata.replacement}\n`;
      }

      if (result.metadata.docs) {
        output += `   📖 **Docs:** ${result.metadata.docs}\n`;
      }

      output += `\n`;
    }

    // Show description
    if (result.details.description) {
      output += `   ${result.details.description}\n\n`;
    }

    // Show key props (up to 5)
    if (result.details.props && result.details.props.length > 0) {
      output += `   **Key Props:**\n`;
      const propsToShow = result.details.props.slice(0, 5);
      propsToShow.forEach((prop: ComponentProp) => {
        const typeName = prop.type?.name || 'unknown';
        const values = prop.values ? ` Options: ${prop.values.slice(0, 3).join(', ')}${prop.values.length > 3 ? '...' : ''}` : '';
        output += `   • \`${prop.name}\` (${typeName})${values}\n`;
        if (prop.description) {
          output += `     ${prop.description}\n`;
        }
      });

      if (result.details.props.length > 5) {
        output += `   • ... and ${result.details.props.length - 5} more props\n`;
      }
      output += `\n`;
    }

    // Show events if any
    if (result.details.events && result.details.events.length > 0) {
      output += `   **Events:** ${result.details.events.map((e: ComponentEvent) => e.name).slice(0, 3).join(', ')}`;
      if (result.details.events.length > 3) {
        output += ` (${result.details.events.length - 3} more)`;
      }
      output += `\n\n`;
    }

    // Show slots if any
    if (result.details.slots && result.details.slots.length > 0) {
      output += `   **Slots:** ${result.details.slots.map((s: ComponentSlot) => s.name).slice(0, 3).join(', ')}`;
      if (result.details.slots.length > 3) {
        output += ` (${result.details.slots.length - 3} more)`;
      }
      output += `\n\n`;
    }

    // Usage example
    output += `   **Usage:**\n`;
    output += `   \`\`\`vue\n`;
    output += `   import { ${result.name} } from '@dialpad/dialtone-vue'\n`;
    output += `   \`\`\`\n\n`;
  });

  return output;
}

/**
 * Sort unified results by tier, then metadata status, then name
 * Priority: Tier 1 > Tier 2, Clean > Discouraged > Deprecated
 */
export function sortUnifiedResults(results: SearchResult[]): SearchResult[] {
  return results.sort((a: SearchResult, b: SearchResult) => {
    // First sort by tier (1 comes before 2)
    if ((a.tier || 0) !== (b.tier || 0)) {
      return (a.tier || 0) - (b.tier || 0);
    }

    // Within same tier, sort by metadata status
    const getMetadataScore = (result: SearchResult): number => {
      if (!result.metadata) return 0; // Clean (no metadata) = highest priority
      if (result.metadata.deprecated) return 2; // Deprecated = lowest priority
      if (result.metadata.discouraged) return 1; // Discouraged = middle priority
      return 0; // Clean
    };

    const aScore = getMetadataScore(a);
    const bScore = getMetadataScore(b);

    if (aScore !== bScore) {
      return aScore - bScore;
    }

    // Finally sort alphabetically by name
    return a.name.localeCompare(b.name);
  });
}

/**
 * Format unified results (all types in one list, no tiers)
 */
export function formatUnifiedResults(results: SearchResult[], query: string): string {
  if (results.length === 0) {
    return `No results found for "${query}".\n\nTry searching with:\n- CSS properties (e.g., "padding", "display", "flex")\n- Values (e.g., "8px", "0.8rem", "100%")\n- Token names (e.g., "color", "spacing", "border")\n- Component names (e.g., "button", "modal", "avatar")\n- Hex colors (e.g., "#1C1C1C")`;
  }

  let output = `Found ${results.length} result${results.length > 1 ? 's' : ''} for "${query}":\n\n`;

  // Format all results in order
  results.forEach((result: SearchResult, index: number) => {
    output += formatSingleResult(result, index + 1);
  });

  return output;
}

/**
 * Format a single result (utility class, token, or component)
 */
export function formatSingleResult(result: SearchResult, index: number): string {
  let output = `${index}. **${result.name}** _(${result.type})_\n`;

  // Show metadata warnings if present
  if (result.metadata) {
    if (result.metadata.deprecated) {
      output += `   ⚠️  **DEPRECATED:** ${result.metadata.reason}\n`;
    }
    if (result.metadata.discouraged) {
      output += `   ⚠️  **DISCOURAGED:** ${result.metadata.reason || 'Consider alternatives'}\n`;
    }
    if (result.metadata.replacement) {
      output += `   📝 **Use instead:** ${result.metadata.replacement}\n`;
    }
    if (result.metadata.docs) {
      output += `   📖 **Docs:** ${result.metadata.docs}\n`;
    }
    output += `\n`;
  }

  // Format based on type
  if (result.type === 'utility-class') {
    // Show properties
    if (result.details.properties && result.details.properties.length > 0) {
      result.details.properties.forEach((prop: ValueObject) => {
        output += `   • \`${prop.prop}\`: \`${prop.value}\``;
        if (prop.description) {
          output += ` (${prop.description})`;
        }
        output += `\n`;
      });
    }
    output += `\n`;
  } else if (result.type === 'design-token') {
    // Show token values (first theme only for brevity)
    if (result.details.allThemes) {
      const themes = Object.keys(result.details.allThemes);
      if (themes.length > 0) {
        const firstTheme = themes[0];
        const themeData = result.details.allThemes[firstTheme];
        output += `   • Value: \`${themeData.value}\``;
        if (themeData.description) {
          output += ` (${themeData.description})`;
        }
        output += `\n`;
        if (themes.length > 1) {
          output += `   • Available in ${themes.length} theme${themes.length > 1 ? 's' : ''}\n`;
        }
      }
    }
    output += `\n`;
  } else if (result.type === 'component') {
    // Show description
    if (result.details.description) {
      output += `   ${result.details.description}\n\n`;
    }

    // Show key props (up to 3 for brevity in unified view)
    if (result.details.props && result.details.props.length > 0) {
      output += `   **Key Props:** `;
      const propsToShow = result.details.props.slice(0, 3);
      output += propsToShow.map((p: ComponentProp) => `\`${p.name}\``).join(', ');
      if (result.details.props.length > 3) {
        output += ` (+${result.details.props.length - 3} more)`;
      }
      output += `\n\n`;
    }
  }

  return output;
}
