import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

import utilityClasses from '@dialpad/dialtone-css/lib/dist/dialtone-docs.json';
import tokens from '@dialpad/dialtone-css/lib/dist/tokens-docs.json';
import components from '@dialpad/dialtone-vue/component-documentation.json';
import clientRules from '../client-rules.json';

// ============================================================================
// SEARCH FUNCTIONS
// ============================================================================

// Maximum number of results to return (prevents overwhelming responses)
const MAX_RESULTS = 15;

/**
 * Build a set of all compound properties that exist in the data
 * This is called once when the server starts
 */
function buildCompoundPropertiesSet(data) {
  const compoundProps = new Set();

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
function extractKeywords(query, compoundProperties) {
  const normalized = query.toLowerCase();
  const words = normalized.split(/\s+/).filter(w => w.length > 0);

  // Convert px values to rem for Dialtone's 10-based scale
  const convertedWords = words.flatMap(word => {
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
function isValueKeyword(word) {
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
function valueMatchesKeyword(value, description, word) {
  // For numeric values with units (8px, 0.8rem, 50%), use token-based matching
  if (word.match(/^\d+(\.\d+)?(px|rem|%|em)$/)) {
    const valueTokens = value.split(/\s+/);
    const descTokens = (description || '').split(/\s+/);
    return valueTokens.includes(word) || descTokens.includes(word);
  }
  // For other keywords, use word boundary matching
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const wordBoundaryRegex = new RegExp(`\\b${escapedWord}\\b`, 'i');
  return wordBoundaryRegex.test(value) || wordBoundaryRegex.test(description);
}

/**
 * Smart filter to handle deprecated and discouraged items
 * - Deprecated: Remove completely
 * - Discouraged: Show alternatives from metadata with note
 * - Clean: Keep as-is
 */
function applySmartFilter(results, data) {
  const filtered = [];
  const notes = [];
  const swapped = [];
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

          for (const [name, itemData] of Object.entries(data)) {
            if (name.startsWith(prefix)) {
              // Don't add if already in results or if it's also discouraged/deprecated
              const alreadyAdded = filtered.some(f => f.name === name) || swapped.includes(name);
              const isProblematic = itemData.metadata?.deprecated || itemData.metadata?.discouraged;

              if (!alreadyAdded && !isProblematic) {
                filtered.push({
                  ...result,
                  name: name,
                  details: { properties: itemData.values },
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
            const alreadyAdded = filtered.some(f => f.name === altPattern) || swapped.includes(altPattern);
            const isProblematic = data[altPattern].metadata?.deprecated || data[altPattern].metadata?.discouraged;

            if (!alreadyAdded && !isProblematic) {
              filtered.push({
                ...result,
                name: altPattern,
                details: { properties: data[altPattern].values },
                metadata: data[altPattern].metadata || null
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

/**
 * Search utility classes using simple AND-logic (like Dialtone docs site)
 */
function searchUtilityClasses(query, data) {
  console.error(`\n[CLASS SEARCH DEBUG] Query: "${query}"`);

  // Normalize query: lowercase, replace hyphens/slashes with spaces
  const normalized = query.toLowerCase().replace(/[/-]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 0);

  // Create regex for each word (handle px/rem conversion)
  const regexArray = words.map(word => {
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

  const results = [];

  // Check each class: ALL words must match somewhere
  for (const [className, classData] of Object.entries(data)) {
    // Gather all searchable text for this class
    const searchableTexts = [className.toLowerCase()];

    for (const valueObj of classData.values) {
      searchableTexts.push(valueObj.prop?.toLowerCase() || '');
      searchableTexts.push(valueObj.value?.toLowerCase() || '');
      searchableTexts.push(valueObj.description?.toLowerCase() || '');
    }

    const combinedText = searchableTexts.join(' ');

    // Check if ALL regexes match somewhere in the combined text
    const allWordsMatch = regexArray.every(regex => regex.test(combinedText));

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
function formatResults(results, query) {
  if (results.length === 0) {
    return `No results found for "${query}".\n\nTry searching with:\n- Property + value (e.g., "padding right 8px", "display flex")\n- Full property name (e.g., "overflow hidden", "position relative")`;
  }

  let output = `Found ${results.length} result${results.length > 1 ? 's' : ''} for "${query}":\n\n`;

  results.forEach((result, index) => {
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
    result.details.properties.forEach(prop => {
      const desc = prop.description ? ` (${prop.description})` : '';
      output += `   - ${prop.prop}: ${prop.value}${desc}\n`;
    });

    // Show usage example
    output += `   Usage: <div class="${result.name}">...</div>\n\n`;
  });

  return output;
}

// ============================================================================
// TOKEN SEARCH FUNCTIONS
// ============================================================================

/**
 * Search design tokens using simple AND-logic (like Dialtone docs site)
 */
function searchTokens(query, data) {
  console.error(`\n[TOKEN SEARCH DEBUG] Query: "${query}"`);

  // Normalize query: lowercase, replace hyphens/slashes with spaces
  const normalized = query.toLowerCase().replace(/[/-]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 0);

  // Create regex for each word (handle px/rem conversion)
  const regexArray = words.map(word => {
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

  const results = [];

  // Check each token: ALL words must match somewhere
  for (const [tokenName, themeVariants] of Object.entries(data)) {
    // Skip component-specific tokens (not general design tokens)
    // Only include tokens that start with --dt- or --base-- (like the docs site does)
    if (!tokenName.startsWith('--dt-') && !tokenName.startsWith('--base--')) {
      continue;
    }

    // Gather searchable text: token name + all theme values + descriptions
    const searchableTexts = [tokenName.toLowerCase()];

    for (const [themeName, themeData] of Object.entries(themeVariants)) {
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
    const allWordsMatch = regexArray.every(regex => regex.test(combinedText));

    if (allWordsMatch) {
      results.push({
        type: 'design-token',
        name: tokenName,
        details: {
          allThemes: themeVariants
        },
        metadata: themeVariants.metadata || null
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
function formatTokenResults(results, query) {
  if (results.length === 0) {
    return `No token results found for "${query}".\n\nTry searching with:\n- Token category (e.g., "color", "spacing", "border")\n- Specific value (e.g., "#1C1C1C", "0.8rem")\n- Semantic name (e.g., "primary", "success", "danger")`;
  }

  let output = `Found ${results.length} design token${results.length > 1 ? 's' : ''} for "${query}":\n\n`;
  output += `ℹ️  **Note:** Design token values change based on the active theme (light/dark mode, brand variant).\n\n`;

  results.forEach((result, index) => {
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
    const themes = Object.entries(result.details.allThemes);

    // Show first few themes as examples
    const themesToShow = themes.slice(0, 3);
    themesToShow.forEach(([themeName, themeData]) => {
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

// ============================================================================
// COMPONENT SEARCH FUNCTIONS
// ============================================================================

/**
 * Search Vue components by name, description, or props
 */
function searchComponents(query, components) {
  console.error(`\n[COMPONENT SEARCH DEBUG] Query: "${query}"`);

  // Normalize query: lowercase, replace hyphens/slashes with spaces
  const normalized = query.toLowerCase().replace(/[/-]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 0);

  // Create regex for each word
  const regexArray = words.map(word => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(escaped, 'i');
  });

  console.error(`[COMPONENT SEARCH DEBUG] Words:`, words);

  const results = [];

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
    const allWordsMatch = regexArray.every(regex => regex.test(combinedText));

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
  const componentsData = {};
  components.forEach(c => { componentsData[c.displayName] = c; });
  const { results: filtered, notes } = applySmartFilter(results, componentsData);

  console.error(`[COMPONENT SEARCH DEBUG] After filter: ${filtered.length} results\n`);

  return { results: filtered, notes };
}

/**
 * Format component search results
 */
function formatComponentResults(results, query) {
  if (results.length === 0) {
    return `No components found for "${query}".\n\nTry searching with:\n- Component name (e.g., "button", "modal", "avatar")\n- Partial name (e.g., "badge", "card")\n- Component feature (e.g., "dropdown", "tooltip")`;
  }

  let output = `Found ${results.length} component${results.length > 1 ? 's' : ''} for "${query}":\n\n`;

  results.forEach((result, index) => {
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
      propsToShow.forEach(prop => {
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
      output += `   **Events:** ${result.details.events.map(e => e.name).slice(0, 3).join(', ')}`;
      if (result.details.events.length > 3) {
        output += ` (${result.details.events.length - 3} more)`;
      }
      output += `\n\n`;
    }

    // Show slots if any
    if (result.details.slots && result.details.slots.length > 0) {
      output += `   **Slots:** ${result.details.slots.map(s => s.name).slice(0, 3).join(', ')}`;
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
function sortUnifiedResults(results) {
  return results.sort((a, b) => {
    // First sort by tier (1 comes before 2)
    if (a.tier !== b.tier) {
      return a.tier - b.tier;
    }

    // Within same tier, sort by metadata status
    const getMetadataScore = (result) => {
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
function formatUnifiedResults(results, query) {
  if (results.length === 0) {
    return `No results found for "${query}".\n\nTry searching with:\n- CSS properties (e.g., "padding", "display", "flex")\n- Values (e.g., "8px", "0.8rem", "100%")\n- Token names (e.g., "color", "spacing", "border")\n- Component names (e.g., "button", "modal", "avatar")\n- Hex colors (e.g., "#1C1C1C")`;
  }

  let output = `Found ${results.length} result${results.length > 1 ? 's' : ''} for "${query}":\n\n`;

  // Format all results in order
  results.forEach((result, index) => {
    output += formatSingleResult(result, index + 1);
  });

  return output;
}

/**
 * Format a single result (utility class, token, or component)
 */
function formatSingleResult(result, index) {
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
      result.details.properties.forEach(prop => {
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
      output += propsToShow.map(p => `\`${p.name}\``).join(', ');
      if (result.details.props.length > 3) {
        output += ` (+${result.details.props.length - 3} more)`;
      }
      output += `\n\n`;
    }
  }

  return output;
}

async function main() {
  // Build compound properties set from utility classes data (done once at startup)
  const compoundProperties = buildCompoundPropertiesSet(utilityClasses);
  console.error(`[INIT] Built compound properties set: ${compoundProperties.size} properties`);

  // Create server instance
  const server = new McpServer({
    name: "dialtone-mcp-server",
    version: "0.1.0",
  }, {
    capabilities: {
      resources: {},
      tools: {},
    },
  });

  // Register resources
  server.resource("utility-classes", "dialtone://utility-classes", {
    name: "Dialtone Utility Classes",
    description: "Complete documentation of Dialtone CSS utility classes",
    mimeType: "application/json",
  }, async () => {
    return {
      contents: [{
        uri: "dialtone://utility-classes",
        mimeType: "application/json",
        text: JSON.stringify(utilityClasses, null, 2)
      }]
    };
  });

  server.resource("tokens", "dialtone://tokens", {
    name: "Dialtone Design Tokens",
    description: "Complete documentation of Dialtone design tokens",
    mimeType: "application/json",
  }, async () => {
    return {
      contents: [{
        uri: "dialtone://tokens",
        mimeType: "application/json",
        text: JSON.stringify(tokens, null, 2)
      }]
    };
  });

  server.resource("components", "dialtone://components", {
    name: "Dialtone Vue Components",
    description: "Complete documentation of Dialtone Vue components",
    mimeType: "application/json",
  }, async () => {
    return {
      contents: [{
        uri: "dialtone://components",
        mimeType: "application/json",
        text: JSON.stringify(components, null, 2)
      }]
    };
  });

  server.resource("client-rules", "dialtone://client-rules", {
    name: "Dialtone Client Rules",
    description: "Guidelines and rules for AI clients when working with Dialtone",
    mimeType: "application/json",
  }, async () => {
    return {
      contents: [{
        uri: "dialtone://client-rules",
        mimeType: "application/json",
        text: JSON.stringify(clientRules, null, 2)
      }]
    };
  });

  // Handle tool discovery - tell clients what tools are available
  server.server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "search_utility_classes",
          description: "Search for CSS utility classes to style HTML elements. Use when query mentions CSS properties (padding, margin, display, flex, width, border, color) or CSS values (8px, 100%, center, auto, bold). Returns classes like d-p8, d-d-flex, d-w100p, d-mt-auto.",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "CSS property and/or value (e.g., 'padding 8px', 'display flex', 'width 100%', 'margin top auto')"
              },
              limit: {
                type: "number",
                description: "Maximum number of results to return (1-50, default 15)",
                default: 15,
                minimum: 1,
                maximum: 50
              }
            },
            required: ["query"]
          }
        },
        {
          name: "search_tokens",
          description: "Search for design tokens (CSS variables) from Dialtone's design system. Use when query mentions token categories (color, space, font, size, shadow) or semantic names (primary, success, critical, foreground, background). Returns tokens like --dt-color-foreground-primary, --dt-space-400.",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Token category, name, or value (e.g., 'color primary', 'space 400', 'font family', '#1C1C1C')"
              },
              limit: {
                type: "number",
                description: "Maximum number of results to return (1-50, default 15)",
                default: 15,
                minimum: 1,
                maximum: 50
              }
            },
            required: ["query"]
          }
        },
        {
          name: "search_components",
          description: "Search for Vue components from Dialtone's component library. Use when query mentions UI elements or component names (button, modal, input, dropdown, checkbox, avatar, badge, card, tooltip). Returns components like DtButton, DtModal with props and usage info.",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Component name or UI element (e.g., 'button', 'modal', 'checkbox', 'DtDropdown')"
              },
              limit: {
                type: "number",
                description: "Maximum number of results to return (1-30, default 10)",
                default: 10,
                minimum: 1,
                maximum: 30
              }
            },
            required: ["query"]
          }
        }
      ]
    };
  });

  // Handle tool execution - route to correct search function
  server.server.setRequestHandler(CallToolRequestSchema, async (request) => {
    console.error('[MCP] Tool call received:', request.params.name);

    const toolName = request.params.name;
    const args = request.params.arguments || {};
    const query = args.query;
    const limit = args.limit || 15;

    // Validate query
    if (!query || typeof query !== 'string') {
      return {
        content: [{ type: "text", text: "Error: 'query' parameter is required and must be a string" }],
        isError: true
      };
    }

    try {
      let searchResult;
      let formatterFunction;

      // Route to correct search function
      if (toolName === "search_utility_classes") {
        searchResult = searchUtilityClasses(query, utilityClasses);
        formatterFunction = formatResults;
      } else if (toolName === "search_tokens") {
        searchResult = searchTokens(query, tokens);
        formatterFunction = formatTokenResults;
      } else if (toolName === "search_components") {
        searchResult = searchComponents(query, components);
        formatterFunction = formatComponentResults;
      } else {
        throw new Error(`Unknown tool: ${toolName}`);
      }

      // Apply limit
      const limitedResults = searchResult.results.slice(0, limit);

      console.error(`[${toolName}] Found ${searchResult.results.length} results, limited to ${limitedResults.length}`);

      // Format results
      let formatted = formatterFunction(limitedResults, query);

      // Add notes if any
      if (searchResult.notes.length > 0) {
        formatted += `\n\n**Notes:**\n${searchResult.notes.map(n => `- ${n}`).join('\n')}`;
      }

      return {
        content: [{
          type: "text",
          text: formatted
        }]
      };
    } catch (error) {
      console.error(`[${toolName}] Error:`, error);
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  });

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Dialtone MCP Server running on stdio");
}

main().catch(console.error);
