import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import pkg from '../package.json' assert { type: 'json' };

import { utilityClasses, tokens, components, clientRules } from './data.js';
import { searchUtilityClasses, formatResults, buildCompoundPropertiesSet } from './tools/utility-classes.js';
import { searchTokens, formatTokenResults } from './tools/tokens.js';
import { searchComponents, formatComponentResults } from './tools/components.js';

import type {
  ValueObject,
  Metadata,
  ClassData,
  UtilityClassesData,
  ThemeData,
  TokenData,
  TokensData,
  ComponentProp,
  ComponentEvent,
  ComponentSlot,
  Component,
  SearchResult
} from './types.js';

/**
 * Check if a newer version of the package is available on npm
 * Logs a warning with update instructions if outdated
 * Fails silently if offline or registry unavailable
 */
async function checkVersion() {
  try {
    const packageName = pkg.name;
    const currentVersion = pkg.version;

    const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
    const data = await response.json();
    const latestVersion = data.version;

    if (currentVersion !== latestVersion) {
      console.error('');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('⚠️  Dialtone MCP Server Update Available');
      console.error(`   Current: v${currentVersion}`);
      console.error(`   Latest:  v${latestVersion}`);
      console.error('');
      console.error('   To update:');
      console.error('   1. npm install -D @dialpad/dialtone-mcp-server@latest');
      console.error('   2. Restart this conversation');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('');
    } else {
      console.error(`✓ Dialtone MCP Server v${currentVersion} (up to date)`);
    }
  } catch (error) {
    // Fail silently if offline or registry unavailable
    // This ensures the server still starts even without network access
  }
}

async function main() {
  // Check for updates on startup
  await checkVersion();
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
        searchResult = searchTokens(query, tokens as TokensData);
        formatterFunction = formatTokenResults;
      } else if (toolName === "search_components") {
        searchResult = searchComponents(query, components);
        formatterFunction = formatComponentResults;
      } else {
        throw new Error(`Unknown tool: ${toolName}`);
      }

      // Apply limit
      const limitedResults = searchResult.results.slice(0, Number(limit));

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
