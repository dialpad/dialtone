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
 * Search utility classes using priority-based filtering
 */
function searchUtilityClasses(query, data, compoundProperties) {
  const keywords = extractKeywords(query, compoundProperties);

  // Debug logging
  console.error(`\n[SEARCH DEBUG] Query: "${query}"`);
  console.error(`[SEARCH DEBUG] Words:`, JSON.stringify(keywords.words));
  console.error(`[SEARCH DEBUG] Compound properties detected:`, JSON.stringify(keywords.compoundProperties));

  // Detect if query contains only values (no property keywords)
  const hasPropertyKeywords = keywords.words.some(word => !isValueKeyword(word));
  console.error(`[SEARCH DEBUG] Has property keywords:`, hasPropertyKeywords);

  // Tier 1: Exact compound property match + value match
  if (keywords.compoundProperties.length > 0) {
    const tier1Results = [];
    for (const [className, classData] of Object.entries(data)) {
      const exactCompoundMatch = classData.values.some(v => {
        const prop = v.prop?.toLowerCase() || '';
        return keywords.compoundProperties.some(compound => prop === compound);
      });

      // Also check if value matches (if we have value keywords)
      const valueMatch = classData.values.some(v => {
        const value = v.value?.toLowerCase() || '';
        const description = v.description?.toLowerCase() || '';
        return keywords.words.some(word =>
          valueMatchesKeyword(value, description, word)
        );
      });

      // Include if compound matches AND (no value keywords OR value matches)
      const shouldInclude = exactCompoundMatch && (keywords.words.length === keywords.compoundProperties.length || valueMatch);

      if (shouldInclude) {
        tier1Results.push({
          type: 'utility-class',
          className,
          properties: classData.values,
          tier: 1
        });
      }
    }

    if (tier1Results.length > 0) {
      console.error(`[SEARCH DEBUG] Tier 1: Found ${tier1Results.length} exact compound + value matches`);
      return tier1Results.slice(0, MAX_RESULTS);
    }
  }

  // Tier 2: Exact property + value match (for queries like "width 100%")
  const tier2Results = [];
  for (const [className, classData] of Object.entries(data)) {
    const exactPropertyMatch = classData.values.some(v => {
      const prop = v.prop?.toLowerCase() || '';
      const value = v.value?.toLowerCase() || '';
      const description = v.description?.toLowerCase() || '';

      // Check if ANY keyword is an exact property match
      const propMatchesExactly = keywords.words.some(word => prop === word);

      // Check if value matches
      const valueMatches = keywords.words.some(word =>
        valueMatchesKeyword(value, description, word)
      );

      return propMatchesExactly && valueMatches;
    });

    if (exactPropertyMatch) {
      tier2Results.push({
        type: 'utility-class',
        className,
        properties: classData.values,
        tier: 2
      });
    }
  }

  if (tier2Results.length > 0) {
    console.error(`[SEARCH DEBUG] Tier 2: Found ${tier2Results.length} exact property + value matches`);
    return tier2Results.slice(0, MAX_RESULTS);
  }

  // Tier 3: Property contains keyword + value match (original behavior)
  const tier3Results = [];
  for (const [className, classData] of Object.entries(data)) {
    const propertyMatch = classData.values.some(v => {
      const prop = v.prop?.toLowerCase() || '';
      return keywords.words.some(word => !isValueKeyword(word) && prop.includes(word));
    });

    const valueMatch = classData.values.some(v => {
      const value = v.value?.toLowerCase() || '';
      const description = v.description?.toLowerCase() || '';
      return keywords.words.some(word =>
        valueMatchesKeyword(value, description, word)
      );
    });

    const shouldInclude = hasPropertyKeywords
      ? (propertyMatch && valueMatch)
      : valueMatch;

    if (shouldInclude) {
      tier3Results.push({
        type: 'utility-class',
        className,
        properties: classData.values,
        tier: 3
      });
    }
  }

  console.error(`[SEARCH DEBUG] Tier 3: Found ${tier3Results.length} partial matches`);
  console.error(`[SEARCH DEBUG] First 10 results:`);
  tier3Results.slice(0, 10).forEach((r, i) => {
    const prop = r.properties[0];
    console.error(`  ${i + 1}. ${r.className} - ${prop.prop}: ${prop.description || prop.value}`);
  });
  console.error(`\n`);

  return tier3Results.slice(0, MAX_RESULTS);
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
    output += `${index + 1}. **${result.className}**\n`;

    // Show properties
    result.properties.forEach(prop => {
      const desc = prop.description ? ` (${prop.description})` : '';
      output += `   - ${prop.prop}: ${prop.value}${desc}\n`;
    });

    // Show usage example
    output += `   Usage: <div class="${result.className}">...</div>\n\n`;
  });

  return output;
}

// ============================================================================
// TOKEN SEARCH FUNCTIONS
// ============================================================================

/**
 * Search design tokens by name, value, or description across all theme variants
 */
function searchTokens(query, data) {
  const keywords = extractKeywords(query, new Set()); // Tokens don't have compound properties
  const results = [];

  console.error(`\n[TOKEN SEARCH DEBUG] Query: "${query}"`);
  console.error(`[TOKEN SEARCH DEBUG] Words:`, JSON.stringify(keywords.words));

  // Search through all tokens
  for (const [tokenName, themeVariants] of Object.entries(data)) {
    const normalizedTokenName = tokenName.toLowerCase();
    let nameMatch = false;
    let valueMatch = false;
    const matchedThemes = [];

    // Check if token name matches any query word
    nameMatch = keywords.words.some(word => normalizedTokenName.includes(word));

    // Check if any theme variant's value or description matches
    for (const [themeName, themeData] of Object.entries(themeVariants)) {
      // Safely convert value to string
      const valueStr = themeData && themeData.value ? String(themeData.value) : '';
      const descStr = themeData && themeData.description ? String(themeData.description) : '';

      const value = valueStr.toLowerCase();
      const description = descStr.toLowerCase();

      const themeMatches = keywords.words.some(word => {
        // For numeric values with units (8px, 0.8rem, 50%), use token-based matching
        if (word.match(/^\d+(\.\d+)?(px|rem|%|em)$/)) {
          const valueTokens = value.split(/\s+/);
          const descTokens = (description || '').split(/\s+/);
          return valueTokens.includes(word) || descTokens.includes(word);
        }
        // For other keywords (color names, semantic terms), use word boundary matching
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const wordBoundaryRegex = new RegExp(`\\b${escapedWord}\\b`, 'i');
        return wordBoundaryRegex.test(value) || wordBoundaryRegex.test(description);
      });

      if (themeMatches) {
        valueMatch = true;
        matchedThemes.push({
          theme: themeName,
          value: themeData.value,
          description: themeData.description
        });
      }
    }

    // Include if name OR value matched (tokens have semantic names, unlike utility classes)
    if (nameMatch || valueMatch) {
      results.push({
        type: 'design-token',
        tokenName,
        allThemes: themeVariants,
        matchedThemes: matchedThemes.length > 0 ? matchedThemes : null,
        matchType: nameMatch ? 'name' : 'value'
      });
    }
  }

  console.error(`[TOKEN SEARCH DEBUG] Found ${results.length} token matches (limiting to ${MAX_RESULTS})\n`);

  // Limit results to prevent overwhelming responses
  return results.slice(0, MAX_RESULTS);
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
    output += `${index + 1}. **${result.tokenName}**\n`;

    // Show theme variants
    output += `   Theme Variants:\n`;
    const themes = Object.entries(result.allThemes);

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
    output += `   Usage: style="color: var(${result.tokenName})"\n`;
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
  const normalized = query.toLowerCase();
  const results = [];

  console.error(`\n[COMPONENT SEARCH DEBUG] Query: "${query}"`);

  for (const component of components) {
    const displayName = (component.displayName || '').toLowerCase();
    const description = (component.description || '').toLowerCase();

    // Priority 1: Exact name match (with or without "Dt" prefix)
    if (displayName === normalized || displayName === `dt${normalized}`) {
      console.error(`[COMPONENT SEARCH DEBUG] Exact match: ${component.displayName}`);
      return [{
        ...component,
        matchType: 'exact-name'
      }];
    }

    // Priority 2: Name contains query
    if (displayName.includes(normalized)) {
      results.push({ ...component, matchType: 'name', priority: 2 });
      continue;
    }

    // Priority 3: Description contains query
    if (description.includes(normalized)) {
      results.push({ ...component, matchType: 'description', priority: 3 });
      continue;
    }

    // Priority 4: Props match
    const matchingProps = [];
    for (const prop of component.props || []) {
      const propName = (prop.name || '').toLowerCase();
      const propDesc = (prop.description || '').toLowerCase();
      if (propName.includes(normalized) || propDesc.includes(normalized)) {
        matchingProps.push(prop.name);
      }
    }

    if (matchingProps.length > 0) {
      results.push({
        ...component,
        matchType: 'prop',
        matchedProps: matchingProps,
        priority: 4
      });
    }
  }

  // Sort by priority (lower number = higher priority)
  results.sort((a, b) => (a.priority || 5) - (b.priority || 5));

  console.error(`[COMPONENT SEARCH DEBUG] Found ${results.length} matches\n`);

  return results.slice(0, MAX_RESULTS);
}

/**
 * Format component search results
 */
function formatComponentResults(results, query) {
  if (results.length === 0) {
    return `No components found for "${query}".\n\nTry searching with:\n- Component name (e.g., "button", "modal", "avatar")\n- Partial name (e.g., "badge", "card")\n- Component feature (e.g., "dropdown", "tooltip")`;
  }

  let output = `Found ${results.length} component${results.length > 1 ? 's' : ''} for "${query}":\n\n`;

  results.forEach((component, index) => {
    output += `${index + 1}. **${component.displayName}**\n`;

    // Show description
    if (component.description) {
      output += `   ${component.description}\n\n`;
    }

    // Show key props (up to 5)
    if (component.props && component.props.length > 0) {
      output += `   **Key Props:**\n`;
      const propsToShow = component.props.slice(0, 5);
      propsToShow.forEach(prop => {
        const typeName = prop.type?.name || 'unknown';
        const values = prop.values ? ` Options: ${prop.values.slice(0, 3).join(', ')}${prop.values.length > 3 ? '...' : ''}` : '';
        output += `   • \`${prop.name}\` (${typeName})${values}\n`;
        if (prop.description) {
          output += `     ${prop.description}\n`;
        }
      });

      if (component.props.length > 5) {
        output += `   • ... and ${component.props.length - 5} more props\n`;
      }
      output += `\n`;
    }

    // Show events if any
    if (component.events && component.events.length > 0) {
      output += `   **Events:** ${component.events.map(e => e.name).slice(0, 3).join(', ')}`;
      if (component.events.length > 3) {
        output += ` (${component.events.length - 3} more)`;
      }
      output += `\n\n`;
    }

    // Show slots if any
    if (component.slots && component.slots.length > 0) {
      output += `   **Slots:** ${component.slots.map(s => s.name).slice(0, 3).join(', ')}`;
      if (component.slots.length > 3) {
        output += ` (${component.slots.length - 3} more)`;
      }
      output += `\n\n`;
    }

    // Usage example
    output += `   **Usage:**\n`;
    output += `   \`\`\`vue\n`;
    output += `   import { ${component.displayName} } from '@dialpad/dialtone-vue'\n`;
    output += `   \`\`\`\n\n`;
  });

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
          name: "search_dialtone",
          description: "Search Dialtone design system for utility classes, design tokens, and Vue components. Examples: 'right padding 8px', 'primary color', '#1C1C1C', 'd-flex', 'border focus', 'button component', 'modal'",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query for Dialtone - CSS properties, class names, values, token names, component names, hex colors, or semantic terms"
              }
            },
            required: ["query"]
          }
        }
      ]
    };
  });

  // Handle tool execution with actual search implementation
  server.server.setRequestHandler(CallToolRequestSchema, async (request) => {
    console.error('[MCP] Tool call received:', JSON.stringify(request.params, null, 2));

    if (request.params.name === "search_dialtone") {
      try {
        // Extract query from arguments
        const args = request.params.arguments || {};
        console.error('[search_dialtone] Raw arguments:', JSON.stringify(args, null, 2));

        const query = args.query;

        console.error('[search_dialtone] Extracted query:', query);

        // Validate query
        if (!query || typeof query !== 'string') {
          console.error('[search_dialtone] Invalid query:', typeof query);
          return {
            content: [{
              type: "text",
              text: "Error: 'query' parameter is required and must be a string"
            }],
            isError: true
          };
        }

        // Search utility classes, tokens, and components
        const utilityResults = searchUtilityClasses(query, utilityClasses, compoundProperties);
        const tokenResults = searchTokens(query, tokens);
        const componentResults = searchComponents(query, components);

        console.error('[search_dialtone] Found utility class results:', utilityResults.length);
        console.error('[search_dialtone] Found token results:', tokenResults.length);
        console.error('[search_dialtone] Found component results:', componentResults.length);

        // Combine and format results
        let formatted = '';

        if (utilityResults.length === 0 && tokenResults.length === 0 && componentResults.length === 0) {
          formatted = `No results found for "${query}".\n\nTry searching with:\n- CSS properties (e.g., "padding", "display", "flex")\n- Values (e.g., "8px", "0.8rem", "100%")\n- Token names (e.g., "color", "spacing", "border")\n- Component names (e.g., "button", "modal", "avatar")\n- Hex colors (e.g., "#1C1C1C")`;
        } else {
          // Show utility classes
          if (utilityResults.length > 0) {
            formatted += `## Utility Classes\n\n${formatResults(utilityResults, query)}`;
          }

          // Show tokens
          if (tokenResults.length > 0) {
            if (utilityResults.length > 0) {
              formatted += `\n---\n\n`;
            }
            formatted += `## Design Tokens\n\n${formatTokenResults(tokenResults, query)}`;
          }

          // Show components
          if (componentResults.length > 0) {
            if (utilityResults.length > 0 || tokenResults.length > 0) {
              formatted += `\n---\n\n`;
            }
            formatted += `## Vue Components\n\n${formatComponentResults(componentResults, query)}`;
          }
        }

        return {
          content: [{
            type: "text",
            text: formatted
          }]
        };
      } catch (error) {
        console.error('[search_dialtone] Error:', error);
        return {
          content: [{
            type: "text",
            text: `Error searching Dialtone: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true
        };
      }
    }

    // For any other tool, throw error (let SDK handle it normally)
    throw new Error(`Unknown tool: ${request.params.name}`);
  });

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Dialtone MCP Server running on stdio");
}

main().catch(console.error);
