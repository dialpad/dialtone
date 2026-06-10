# Dialtone Lookup

Use Dialtone lookup tools before guessing about public component APIs, tokens, utility classes, icons, or documentation patterns.

## First Choice

Use the local Dialtone CLI first for version-sensitive work. The CLI resolves against the installed or workspace Dialtone version, which is important on forward branches such as Dialtone Next.

- `./node_modules/.bin/dialtone search "<query>" --format json`
- `./node_modules/.bin/dialtone component <name> --format json`
- `./node_modules/.bin/dialtone component <name> --prop <prop>`
- `./node_modules/.bin/dialtone token "<query>" --format json`
- `./node_modules/.bin/dialtone utility "<query>" --format json`
- `./node_modules/.bin/dialtone prompt <name> --format json`

Prefer `--format json` when processing results programmatically. Prefer `prompt` for a compact component context block.

## MCP Supplement

Use the project-scoped Dialtone MCP server configured in `.codex/config.toml` when CLI output is insufficient or when MCP tools are already available in the session.

- `search_documentation`: usage guidance, recipes, accessibility, migration notes, design principles, and how-to questions.
- `search_components`: Vue component discovery and public API lookup.
- `search_tokens`: design token lookup.
- `search_utility_classes`: CSS utility lookup.
- `search_icons`: icon lookup.

## Constraints

- Do not use lookup output as a substitute for reading changed source files.
- Verify local source when implementing behavior changes.
- Treat lookup results as public design-system context; do not add private Dialpad context to prompts, commits, or PRs.
- If CLI and MCP results disagree, prefer the CLI for installed-version behavior and verify against local source before editing.
- If the CLI fails, use MCP as a fallback and report the CLI failure in the validation or handoff.
