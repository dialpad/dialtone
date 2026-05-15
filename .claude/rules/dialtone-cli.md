---
paths:
  - "packages/dialtone-cli/**"
---

# Dialtone CLI Rules

The CLI is a terminal interface over `@dialpad/dialtone-query-core`. It shares the same search engine as the MCP server.

## Architecture

- **Entry point**: `src/index.ts` — citty command router + version check
- **Commands**: `src/commands/` — one file per command (search, component, token, utility, prompt)
- **Formatters**: `src/formatters.ts` — output rendering (minimal, markdown, json)
- **Debug suppression**: `src/silence-debug.ts` — filters core's stderr debug logging

## Modifying Search Behavior

Edit the core package (`packages/dialtone-query-core/`), not the CLI. The CLI only handles argument parsing, output formatting, and the `prompt` command's LLM context generation.

## Build

```
pnpm nx run dialtone-query-core:build   # core first
pnpm nx run dialtone-cli:build          # then CLI
```

Rollup bundles everything (core + JSON data) into a single self-contained `build/index.js`.

## Adding a New Command

1. Create `src/commands/<name>.ts` with `defineCommand` from citty
2. Import search functions from `@dialpad/dialtone-query-core`
3. Register in `src/index.ts` under `subCommands`
4. Rebuild: `pnpm exec rollup -c`

## Argument Validation

- Numeric args (e.g., `--limit`) must use a strict integer check — `Number.parseInt` accepts floats (`1.5`), hex (`0x10`), and trailing chars (`10abc`). Use a regex guard: `/^(0|[1-9]\d*)$/.test(value)` before parsing.
- Invalid args must print a human-readable error to stderr and call `process.exit(1)`.
- The `--format` flag only accepts `minimal`, `markdown`, or `json` — reject any other value explicitly.
