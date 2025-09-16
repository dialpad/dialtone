import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
      resources: [
        {
          uri: "dialtone://utility-classes",
          name: "Dialtone Utility Classes",
          description: "Complete documentation of Dialtone CSS utility classes",
          mimeType: "application/json"
        },
        {
          uri: "dialtone://tokens",
          name: "Dialtone Design Tokens",
          description: "Complete documentation of Dialtone design tokens",
          mimeType: "application/json"
        },
        {
          uri: "dialtone://components",
          name: "Dialtone Vue Components",
          description: "Complete documentation of Dialtone Vue components",
          mimeType: "application/json"
        },
        {
          uri: "dialtone://client-rules",
          name: "Dialtone Client Rules",
          description: "Guidelines and rules for AI clients when working with Dialtone",
          mimeType: "application/json"
        }
      ]
    };
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;

    try {
      switch (uri) {
        case "dialtone://utility-classes": {
          const filePath = join(__dirname, "../../dialtone-css/lib/dist/dialtone-docs.json");
          const content = await readFile(filePath, "utf-8");
          return {
            contents: [
              {
                uri,
                mimeType: "application/json",
                text: content
              }
            ]
          };
        }

        case "dialtone://tokens": {
          const filePath = join(__dirname, "../../dialtone-css/lib/dist/tokens-docs.json");
          const content = await readFile(filePath, "utf-8");
          return {
            contents: [
              {
                uri,
                mimeType: "application/json",
                text: content
              }
            ]
          };
        }

        case "dialtone://components": {
          const filePath = join(__dirname, "../../dialtone-vue3/dist/component-documentation.json");
          const content = await readFile(filePath, "utf-8");
          return {
            contents: [
              {
                uri,
                mimeType: "application/json",
                text: content
              }
            ]
          };
        }

        case "dialtone://client-rules": {
          const filePath = join(__dirname, "../client-rules.json");
          const content = await readFile(filePath, "utf-8");
          return {
            contents: [
              {
                uri,
                mimeType: "application/json",
                text: content
              }
            ]
          };
        }

        default:
          throw new Error(`Resource not found: ${uri}`);
      }
    } catch (error) {
      throw new Error(`Failed to read resource ${uri}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: [] }; // no tools for now
  });

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Dialtone MCP Server running on stdio");
}

main().catch(console.error);
