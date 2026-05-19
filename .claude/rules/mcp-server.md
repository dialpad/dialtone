---
paths:
  - "packages/dialtone-mcp-server/**"
---

# MCP Server Rules

The MCP server is a thin transport layer over `@dialpad/dialtone-query-core`. All search logic, types, data loading, and formatting live in the core package.

## Architecture

```text
dialtone-query-core (search engine)
├── dialtone-mcp-server (MCP transport — this package)
└── dialtone-cli (terminal interface)
```

- **Search logic**: `packages/dialtone-query-core/src/tools/`
- **Types**: `packages/dialtone-query-core/src/types.ts`
- **Data loading**: `packages/dialtone-query-core/src/data.ts`
- **MCP transport**: `packages/dialtone-mcp-server/src/index.ts` (only file in this package)
- **Client rules**: `packages/dialtone-mcp-server/client-rules.json` (MCP-specific, not in core)

## Modifying Search Behavior

Edit the core package, not this one. Changes to search algorithms, filters, or formatting propagate to both the MCP server and CLI automatically.

After changes: rebuild core first, then this package.

```bash
pnpm nx run dialtone-query-core:build
pnpm nx run dialtone-mcp-server:build
```

## Provides

5 search tools: `search_components`, `search_utility_classes`, `search_tokens`, `search_icons`, `search_documentation`
6 resources: utility-classes, tokens, components, icons, client-rules, documentation
