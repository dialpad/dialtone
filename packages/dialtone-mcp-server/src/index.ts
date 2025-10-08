import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

import utilityClasses from '@dialpad/dialtone-css/lib/dist/dialtone-docs.json';
import tokens from '@dialpad/dialtone-css/lib/dist/tokens-docs.json';
import components from '@dialpad/dialtone-vue/component-documentation.json';
import clientRules from '../client-rules.json';

// ============================================================================
// SEARCH FUNCTIONS
// ============================================================================

/**
 * Extract keywords from a search query
 */
function extractKeywords(query) {
  const normalized = query.toLowerCase();

  // CSS properties
  const properties = [
    'padding', 'margin', 'color', 'background', 'border',
    'display', 'flex', 'grid', 'width', 'height', 'font',
    'text', 'align', 'justify', 'position', 'top', 'right',
    'bottom', 'left', 'gap', 'space', 'radius'
  ].filter(prop => normalized.includes(prop));

  // Directions
  const directions = [
    'top', 'right', 'bottom', 'left',
    'horizontal', 'vertical', 'x', 'y'
  ].filter(dir => normalized.includes(dir));

  // Values (numbers followed by units or standalone)
  const valueMatches = normalized.match(/\d+(\.\d+)?(px|rem|em|%)?/g) || [];
  const values = valueMatches.flatMap(v => {
    // Convert px to rem (8px = 0.8rem)
    if (v.endsWith('px')) {
      const px = parseFloat(v);
      return [`${px}px`, `${px / 10}rem`];
    }
    return [v];
  });

  return {
    properties,
    directions,
    values,
    raw: normalized
  };
}

/**
 * Search utility classes
 */
function searchUtilityClasses(query, data) {
  const results = [];
  const normalizedQuery = query.toLowerCase();
  const keywords = extractKeywords(normalizedQuery);

  // Search through all utility classes
  for (const [className, classData] of Object.entries(data)) {
    let score = 0;
    const matchReasons = [];

    // 1. Exact class name match (highest priority)
    if (className.toLowerCase() === normalizedQuery) {
      score += 100;
      matchReasons.push('exact class name match');
    }
    // 2. Partial class name match
    else if (className.toLowerCase().includes(normalizedQuery)) {
      score += 50;
      matchReasons.push('class name contains query');
    }

    // 3. Check CSS properties and values
    for (const valueObj of classData.values) {
      const prop = valueObj.prop?.toLowerCase() || '';
      const value = valueObj.value?.toLowerCase() || '';
      const description = valueObj.description?.toLowerCase() || '';

      // Match on CSS property
      if (keywords.properties.some(p => prop.includes(p))) {
        score += 30;
        matchReasons.push(`matches property: ${valueObj.prop}`);
      }

      // Match on direction
      if (keywords.directions.some(d => prop.includes(d))) {
        score += 20;
        matchReasons.push(`matches direction in property`);
      }

      // Match on value
      if (keywords.values.some(v =>
        value.includes(v) || description.includes(v)
      )) {
        score += 25;
        matchReasons.push(`matches value: ${valueObj.description || valueObj.value}`);
      }

      // General property match
      if (prop.includes(normalizedQuery)) {
        score += 15;
        matchReasons.push('property contains query');
      }
    }

    if (score > 0) {
      results.push({
        type: 'utility-class',
        className,
        properties: classData.values,
        score,
        matchReasons
      });
    }
  }

  // Sort by score (descending) and return top 10
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

/**
 * Format search results as readable text
 */
function formatResults(results, query) {
  if (results.length === 0) {
    return `No results found for "${query}".\n\nTry searching for:\n- CSS properties (padding, margin, flex)\n- Class names (d-pr2, d-flex)\n- Values (8px, 1rem)`;
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
    output += `   Usage: <div class="${result.className}">...</div>\n`;

    // Show match reason for debugging (first reason only)
    if (result.matchReasons.length > 0) {
      output += `   Match: ${result.matchReasons[0]}\n`;
    }

    output += '\n';
  });

  return output;
}

async function main() {
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

  // Add a search tool - register metadata only (no callback needed)
  // The actual implementation is in setRequestHandler below
  server.tool("search_dialtone", async () => {
    // This callback won't be called - setRequestHandler handles it
    return {
      content: [{
        type: "text",
        text: "Handled by setRequestHandler"
      }]
    };
  });

  // Handle tool calls with actual search implementation
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

        // Perform search
        const results = searchUtilityClasses(query, utilityClasses);
        console.error('[search_dialtone] Found results:', results.length);

        // Format and return results
        const formatted = formatResults(results, query);

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
