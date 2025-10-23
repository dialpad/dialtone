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

    // Check if these two words form a compound property
    const potential = `${word1}-${word2}`;
    if (compoundProperties.has(potential)) {
      compoundProps.push(potential);
    }
  }

  return {
    words: convertedWords,
    compoundProperties: compoundProps
  };
}

/**
 * Search utility classes using exact word matching (no scoring)
 */
function searchUtilityClasses(query, data, compoundProperties) {
  const keywords = extractKeywords(query, compoundProperties);
  const results = [];

  // Debug logging
  console.error(`\n[SEARCH DEBUG] Query: "${query}"`);
  console.error(`[SEARCH DEBUG] Words:`, JSON.stringify(keywords.words));
  console.error(`[SEARCH DEBUG] Compound properties detected:`, JSON.stringify(keywords.compoundProperties));

  // Search through all utility classes
  for (const [className, classData] of Object.entries(data)) {
    // Check if property matches
    const propertyMatch = classData.values.some(v => {
      const prop = v.prop?.toLowerCase() || '';

      // Priority 1: Check if property matches any detected compound property
      if (keywords.compoundProperties.length > 0) {
        if (keywords.compoundProperties.some(compound => prop === compound)) {
          return true;
        }
      }

      // Priority 2: Check if property contains any individual word
      return keywords.words.some(word => prop.includes(word));
    });

    // Check if ANY value/description contains ANY query word
    const valueMatch = classData.values.some(v => {
      const value = v.value?.toLowerCase() || '';
      const description = v.description?.toLowerCase() || '';
      return keywords.words.some(word =>
        value.includes(word) || description.includes(word)
      );
    });

    // Include if BOTH property and value matched
    if (propertyMatch && valueMatch) {
      results.push({
        type: 'utility-class',
        className,
        properties: classData.values
      });
    }
  }

  // Debug logging - show results count
  console.error(`[SEARCH DEBUG] Found ${results.length} matches (limiting to ${MAX_RESULTS})`);
  console.error(`[SEARCH DEBUG] First 10 results:`);
  results.slice(0, 10).forEach((r, i) => {
    const prop = r.properties[0];
    console.error(`  ${i + 1}. ${r.className} - ${prop.prop}: ${prop.description || prop.value}`);
  });
  console.error(`\n`);

  // Limit results to prevent overwhelming responses
  return results.slice(0, MAX_RESULTS);
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
        // For numeric values with units (8px, 0.8rem, 50%), use exact matching
        if (word.match(/^\d+(\.\d+)?(px|rem|%|em)$/)) {
          return value === word || description === word;
        }
        // For other keywords (color names, semantic terms), use substring matching
        return value.includes(word) || description.includes(word);
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
          description: "Search Dialtone design system for utility classes, components, and tokens. Examples: 'right padding 8px', 'button', 'd-flex', 'center text'",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query for Dialtone - CSS properties, class names, values, or component names"
              }
            },
            required: ["query"]
          }
        },
        {
          name: "search_tokens",
          description: "Search Dialtone design tokens by name, hex value, or semantic meaning. Tokens are theme-aware CSS variables. Examples: 'primary color', '#1C1C1C', 'spacing 8px', 'border focus'",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query for design tokens - token names, hex/color values, sizes, or semantic terms"
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

        // TEMPORARY: Search tokens only (for testing Phase 2)
        // TODO: Switch back to utility classes or merge both
        const results = searchTokens(query, tokens);
        console.error('[search_dialtone] Found token results:', results.length);

        // Format and return results
        const formatted = formatTokenResults(results, query);

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

    if (request.params.name === "search_tokens") {
      try {
        // Extract query from arguments
        const args = request.params.arguments || {};
        console.error('[search_tokens] Raw arguments:', JSON.stringify(args, null, 2));

        const query = args.query;

        console.error('[search_tokens] Extracted query:', query);

        // Validate query
        if (!query || typeof query !== 'string') {
          console.error('[search_tokens] Invalid query:', typeof query);
          return {
            content: [{
              type: "text",
              text: "Error: 'query' parameter is required and must be a string"
            }],
            isError: true
          };
        }

        // Perform token search
        const results = searchTokens(query, tokens);
        console.error('[search_tokens] Found results:', results.length);

        // Format and return results
        const formatted = formatTokenResults(results, query);

        return {
          content: [{
            type: "text",
            text: formatted
          }]
        };
      } catch (error) {
        console.error('[search_tokens] Error:', error);
        return {
          content: [{
            type: "text",
            text: `Error searching tokens: ${error instanceof Error ? error.message : String(error)}`
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
