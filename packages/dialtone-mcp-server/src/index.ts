import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

async function main() {
  // Create server instance
  const server = new Server({
    name: "dialtone-mcp-server",
    version: "0.1.0",
  }, {
    capabilities: {
      resources: {},
      tools: {},
    },
  });

  // Set up request handlers
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: []
    };
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    throw new Error(`Resource not found: ${request.params.uri}`);
  });

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: []
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    throw new Error(`Tool not found: ${request.params.name}`);
  });

  // Connect to transport (stdio for MCP)
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Dialtone MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
