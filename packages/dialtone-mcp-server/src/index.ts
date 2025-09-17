import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    const filePath = join(__dirname, "../../dialtone-css/lib/dist/dialtone-docs.json");
    const content = await readFile(filePath, "utf-8");
    return {
      contents: [{
        uri: "dialtone://utility-classes",
        mimeType: "application/json",
        text: content
      }]
    };
  });

  server.resource("tokens", "dialtone://tokens", {
    name: "Dialtone Design Tokens",
    description: "Complete documentation of Dialtone design tokens",
    mimeType: "application/json",
  }, async () => {
    const filePath = join(__dirname, "../../dialtone-css/lib/dist/tokens-docs.json");
    const content = await readFile(filePath, "utf-8");
    return {
      contents: [{
        uri: "dialtone://tokens",
        mimeType: "application/json",
        text: content
      }]
    };
  });

  server.resource("components", "dialtone://components", {
    name: "Dialtone Vue Components",
    description: "Complete documentation of Dialtone Vue components",
    mimeType: "application/json",
  }, async () => {
    const filePath = join(__dirname, "../../dialtone-vue3/dist/component-documentation.json");
    const content = await readFile(filePath, "utf-8");
    return {
      contents: [{
        uri: "dialtone://components",
        mimeType: "application/json",
        text: content
      }]
    };
  });

  server.resource("client-rules", "dialtone://client-rules", {
    name: "Dialtone Client Rules",
    description: "Guidelines and rules for AI clients when working with Dialtone",
    mimeType: "application/json",
  }, async () => {
    const filePath = join(__dirname, "../client-rules.json");
    const content = await readFile(filePath, "utf-8");
    return {
      contents: [{
        uri: "dialtone://client-rules",
        mimeType: "application/json",
        text: content
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
