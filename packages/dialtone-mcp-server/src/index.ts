import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

async function loadJsonData() {
  const [utilityClasses, tokens, components, clientRules] = await Promise.all([
    import('@dialpad/dialtone-css/lib/dist/dialtone-docs.json', { with: { type: 'json' } }),
    import('@dialpad/dialtone-css/lib/dist/tokens-docs.json', { with: { type: 'json' } }),
    import('@dialpad/dialtone-vue/component-documentation.json', { with: { type: 'json' } }),
    import('../client-rules.json', { with: { type: 'json' } })
  ]);

  return {
    utilityClasses: utilityClasses.default,
    tokens: tokens.default,
    components: components.default,
    clientRules: clientRules.default
  };
}

async function main() {
  // Load JSON data
  const data = await loadJsonData();

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
        text: JSON.stringify(data.utilityClasses, null, 2)
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
        text: JSON.stringify(data.tokens, null, 2)
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
        text: JSON.stringify(data.components, null, 2)
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
        text: JSON.stringify(data.clientRules, null, 2)
      }]
    };
  });

  // Add a search tool
  // This is a placeholder tool, there was an error if not present
  server.tool("search_dialtone", {
    description: "Search Dialtone design system documentation",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query for Dialtone components, utility classes, or design tokens"
        }
      },
      required: ["query"]
    }
  }, async (args) => {
    return {
      content: [{
        type: "text",
        text: `Search functionality not yet implemented for query: ${args.query}`
      }]
    };
  });

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Dialtone MCP Server running on stdio");
}

main().catch(console.error);
