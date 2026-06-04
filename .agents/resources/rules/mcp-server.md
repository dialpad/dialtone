# MCP Server Rules

Apply to `packages/dialtone-mcp-server/**`.

## Scope

- The MCP server exposes Dialtone data through tools backed by query-core.
- Search behavior and data shape changes usually belong in `dialtone-query-core`; server changes should focus on transport, tool registration, and schemas.

## Public Interface

- Tool names, parameter schemas, and response shapes are public integration surfaces.
- Version or document public tool interface changes when behavior changes.

## Verification

- Build the MCP server after server changes.
- Run acceptance scenarios when documentation search behavior or query data changes.
