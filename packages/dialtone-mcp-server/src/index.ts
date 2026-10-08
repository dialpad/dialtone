import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerQueryTools, ROUTING_INSTRUCTIONS } from "./query-tools.js";
import pkg from '../package.json' with { type: 'json' };
import clientRules from '../client-rules.json' with { type: 'json' };

import {
  utilityClasses, tokens, components, icons, documentation,
  buildCompoundPropertiesSet,
} from '@dialpad/dialtone-query-core';

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
    version: pkg.version,
  }, {
    instructions: ROUTING_INSTRUCTIONS,
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

  server.resource("icons", "dialtone://icons", {
    name: "Dialtone Icons",
    description: "Complete documentation of Dialtone icon library",
    mimeType: "application/json",
  }, async () => {
    return {
      contents: [{
        uri: "dialtone://icons",
        mimeType: "application/json",
        text: JSON.stringify(icons, null, 2)
      }]
    };
  });

  server.resource("documentation", "dialtone://documentation", {
    name: "Dialtone Documentation",
    description: "Public docs site corpus — sections of usage prose, recipes, accessibility, migrations, and design principles",
    mimeType: "application/json",
  }, async () => {
    return {
      contents: [{
        uri: "dialtone://documentation",
        mimeType: "application/json",
        text: JSON.stringify(documentation)
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

  registerQueryTools(server);

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Dialtone MCP Server running on stdio");
}

main().catch(console.error);
