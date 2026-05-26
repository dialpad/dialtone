---
paths:
  - "packages/language-server/**"
---

# Language Server Rules

The Dialtone language server provides IDE completions for utility classes, design tokens, and Vue components. Built on Volar; consumed via the VSCode extension and any LSP-aware editor.

## Subpackages

```text
packages/language-server/
├── server/          # The LSP itself — @volar/language-server
└── vscode/          # VSCode extension wrapper
```

Both have their own `package.json`, `tsconfig.json`, and `CHANGELOG.md`. They version independently.

## Server Architecture

- Built on `@volar/language-server` and `@volar/language-service`
- `src/index.ts` is the connection entry — wires services and the language plugin
- `src/services/` — one file per Dialtone domain (`dialtone-tokens`, `dialtone-classes`, `dialtone-components`)
- `src/resolvers/` — completion item builders that pull from data sources
- `src/language-plugin.ts` — the Volar language plugin

Each service is a factory: `export function create() { ... }` returning a Volar `LanguageServicePlugin`. Wire new services in `src/index.ts`.

## Data Sources

The server consumes generated JSON from sibling workspace packages. Imports go through `require` of the package's `lib/dist` JSON:

```typescript
const DialtoneDocs = require('../../node_modules/@dialpad/dialtone-css/lib/dist/dialtone-docs.json');
```

- Source of truth: the same `dialtone-docs.json` / `tokens-docs.json` / `component-documentation.json` that `dialtone-query-core` consumes
- Do NOT parse or generate documentation here — read the published JSON
- If a new data type is needed, add it upstream (in `dialtone-css`, `dialtone-tokens`, etc.) and consume here

## stdout Discipline

**LSP servers communicate over stdio.** Any stray `console.log` corrupts the JSON-RPC frame and breaks the client.

- Debug logging → `console.error` (stderr is safe)
- Protocol messages → handled by `@volar/language-server` automatically
- Existing `console.log` calls in resolvers are a known bug — do not propagate the pattern

## VSCode Extension

`packages/language-server/vscode/`:
- Activates the server on the file types Dialtone targets (`.vue`, `.less`, `.css`, `.html`)
- `src/extension.ts` is the entry — `activate(context)` / `deactivate()`
- Published via `vsce` — release workflow in `.github/workflows/publish-vscode.yml`

## Build

- `pnpm nx run language-server:build` runs `tsc` for both server and vscode
- TypeScript source compiles to `out/` (server) and `dist/` (vscode)
- Each subpackage has its own `tsconfig.json` that extends `packages/language-server/tsconfig.base.json`

## Testing

- No automated tests currently in this package (acknowledged gap)
- Manual verification: open a `.vue` or `.less` file in VSCode with the extension installed; trigger completion (Ctrl+Space) on a utility class prefix (`d-p`, `d-bgc-`, etc.); confirm Dialtone classes appear with token-aware descriptions
- When adding new services, include a manual verification step in the PR description

## Anti-Patterns

- `console.log` in server code — corrupts LSP protocol
- Importing JSON via `import` instead of `require` — Volar's runtime expects CommonJS resolution for these data files
- Duplicating documentation data here — always pull from the published JSON in the source package
- Adding business logic to services that should live in `dialtone-query-core` — keep services thin, delegate search to the query core when overlap arises
- Editing `vscode/` and `server/` in lockstep without bumping both `CHANGELOG.md` files — they ship independently (semantic-release regenerates the sibling `CHANGELOG.json` automatically)
