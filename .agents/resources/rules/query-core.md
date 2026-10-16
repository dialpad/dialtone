# Query Core Rules

Apply to `packages/dialtone-query-core/**` and shared search/data behavior.

## Architecture

- Query-core is the shared data/search layer for MCP server, CLI, and language-server consumers.
- The root barrel exposes shared APIs; `@dialpad/dialtone-query-core/node` exposes the Node-only installed-data resolver. Keep filesystem imports out of the root runtime barrel.
- The `./*` package export preserves existing deep-import compatibility. New callers use the root or `./node`, not build-file paths.
- `data.ts` wires generated JSON data sources; edit it when adding a new data source.
- Tool implementations should return stable, documented result shapes.

## Data Sources

- Generated JSON files come from their owning packages. Prefer regenerating at the source over hand-editing generated output.
- Search changes should be tested with representative user queries.

## Logging

- Keep library output quiet by default. Do not write noisy logs from reusable query functions.

## Verification

- Search tests use in-memory fixtures. Node resolver boundary tests use temporary C5 filesystem fixtures; distinguish lookup-only, installed and built evidence.
- Run query-core tests and build after search/data changes.
- Run MCP acceptance scenarios when documentation search behavior changes.
