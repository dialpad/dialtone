# Dialtone Lookup

Use Dialtone lookup tools before guessing about public component APIs, tokens, utility classes, icons, or documentation patterns.

## First Choice

Use the local Dialtone CLI first for version-sensitive work. Run it from the project directory that owns Dialtone. Inspect the reported source and version: lookup can use installed data or fall back to bundled data, which matters on forward branches such as Dialtone Next.

- `./node_modules/.bin/dialtone search "<query>" --format json`
- `./node_modules/.bin/dialtone component <name> --format json`
- `./node_modules/.bin/dialtone component <name> --prop <prop>`
- `./node_modules/.bin/dialtone token "<query>" --format json`
- `./node_modules/.bin/dialtone utility "<query>" --format json`
- `./node_modules/.bin/dialtone prompt <name> --format json`

Prefer `--format json` when processing results programmatically. Prefer `prompt` for a compact component context block.

## MCP Supplement

Use the project-scoped Dialtone MCP server configured in `.codex/config.toml` when CLI output is insufficient or when MCP tools are already available in the session.

With a normal workspace install, this repository's configured executable runs the local MCP build. If its reported version is stale or expected tools are missing, run `pnpm nx run dialtone-mcp-server:build` from the repository root and restart the Codex session.

- `search_documentation`: usage guidance, recipes, accessibility, migration notes, design principles, and how-to questions.
- `search_components`: discover candidate components; API summaries can be incomplete.
- `get_component`: retrieve the selected component's available API using its canonical name, for example `{ "component": "DtToggle" }`. Keywords and fuzzy candidates are not exact selections.
- `get_documentation`: retrieve exact section prose or a source example using its returned `id`. Do not invent section IDs.
- `search_tokens`: design token lookup.
- `search_utility_classes`: CSS utility lookup.
- `search_icons`: icon lookup.

Follow returned continuation tool calls and arguments when results are incomplete. Component details page by `offset`/`limit` within the selected `projection`; narrow requests with `projection` or `field`. An incomplete result without a continuation cannot be paged further. Documentation uses `textOffset` and `textLimit` in Unicode code points. Missing metadata is unknown, not proof that an API is absent.

MCP reports installed or bundled source selection per domain when project roots are configured. Documentation and source examples remain bundled; their tested profile does not verify the project's installed compatibility. Inspect source versions, hashes and missing-metadata notes. Documentation links are latest references, not version-matched guarantees. Verify code examples and required setup against local source.

## Constraints

- Do not use lookup output as a substitute for reading changed source files.
- Verify local source when implementing behavior changes.
- Treat lookup results as public design-system context; do not add private Dialpad context to prompts, commits, or PRs.
- If CLI and MCP results disagree, check their reported sources. Prefer CLI evidence from installed data for version-sensitive work, and verify local source before editing.
- If the CLI fails, use MCP as a fallback and report the CLI failure in the validation or handoff.
