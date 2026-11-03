# Dialtone CLI

A command-line tool for searching and exploring the [Dialtone Design System](https://dialtone.dialpad.com). Look up components, design tokens, CSS utility classes, and icons from your terminal.

## Installation

For a project-local installation, run in the application directory:

```bash
npm install --save-dev --save-exact @dialpad/dialtone-cli
npm exec --no -- dialtone --help
```

Commit the manifest and lockfile. The command blocks below use the shorter `dialtone` form and require a global installation (`npm install -g @dialpad/dialtone-cli`). For a project-local install, replace bare `dialtone` with `npm exec --no -- dialtone` and run it from the application directory. A bare local bin is not guaranteed to be on an assistant's PATH. See [installation and data selection](https://dialtone.dialpad.com/guides/cli/#installation).

## Commands

### `dialtone search <query>`

Search across all domains — components, tokens, utilities, and icons.

```bash
dialtone search button
dialtone search "padding 8px"
dialtone search "input|select|menu"   # OR search
```

### `dialtone component <name>`

Show full component documentation. The name must match exactly, ignoring case, separators, and the `Dt` prefix, so `button`, `dt-button`, and `DtButton` all work. Other names exit with an error, listing close matches when available. Directive identifiers such as `v-dt-tooltip` or `DtTooltipDirective` are not component names; use documentation search for their contracts.

```bash
dialtone component button
dialtone component DtModal
dialtone component button --props              # props table
dialtone component button --props --describe   # props with descriptions
dialtone component button --prop kind          # single prop detail
dialtone component button --events             # events only
dialtone component button --slots              # slots only
dialtone component button --examples           # usage example
```

### `dialtone docs [query]`

Search bundled reference documentation, including directive imports, registration and behavior.

```bash
dialtone docs "v-dt-tooltip"
dialtone docs "DtModeDirective registration"
dialtone docs --id examples/button-default
dialtone docs --id examples/button-disabled-tooltip --format json
```

Use `--id <id>` instead of a query to retrieve a complete documentation record. Minimal and Markdown formats print its content; JSON returns a one-record array with its metadata. Missing IDs, an empty ID, or combining a query with `--id` exit with an error. `--limit` controls search results or context-reference pages, not ordinary exact-ID content.

Use `dialtone docs --id <id> --context` to list related source sections, page guidance, APIs, directives, declared utilities and authored links without copying their content. Follow the returned commands for the context you need. Context accepts `--limit` 1–50 (default 20) and `--offset` (default 0); follow `Continue` for remaining references. Context JSON is a retrieval envelope; ordinary exact/search JSON remains an array. Page links are latest references, not installed-compatibility guarantees.

```sh
dialtone docs --id examples/toggle-base-styles --context
dialtone docs --id examples/utility-word-wrap-normal --context --format json
```

Ready public component-page Vue demos are included automatically when public imports and supported source state resolve and the source API check passes. Default IDs use `examples/docs/<docId>/<section-slug>`; source identity overrides preserve the earlier exact IDs or distinguish demos under the same heading. Removed or renamed IDs return no-match unless an explicit ID is retained.

Vue documentation and curated Combinator preset examples include complete application files and pinned dependencies; static utility examples contain standalone HTML. Other source forms remain outside this automatic rule, so this is not full coverage. Their pinned profile does not establish installed-project compatibility; read each record's build/API and manual-review status and environment. `component --examples` text output lists available example IDs; complete example records stay out of documentation search. See [Retrieve a selected example](https://dialtone.dialpad.com/guides/cli/#retrieve-a-selected-example) for setup and qualification.

### `dialtone token [query]`

Look up design tokens. Use `--name=--dt-*` for canonical CSS names so the leading dashes are parsed as a value. Exact legacy names retain their values and qualified migration guidance; add `--values --format json` to inspect that metadata.

```bash
dialtone token "color foreground"
dialtone token "spacing 100"
dialtone token "color foreground" --values     # show theme values
dialtone token "color foreground" --all        # include HSL tokens
dialtone token "color foreground" --limit 0    # show all results
dialtone token --name=--dt-spacing-100 --values # canonical CSS token identifier
```

### `dialtone utility <query>`

Search CSS utility classes. General searches filter deprecated utilities; exact legacy names retain their contract and migration metadata in `--format json` output.

```bash
dialtone utility "padding 8px"
dialtone utility "display flex"
dialtone utility "margin auto"
```

### `dialtone prompt <name>`

Emit a compact, LLM-optimized context block for a component. Designed for piping into AI tools.

```bash
dialtone prompt button
dialtone prompt modal | pbcopy
dialtone prompt tooltip --format json
```

## Output Formats

All commands support `--format`:

| Flag | Output |
|------|--------|
| `--format minimal` | Plain text (default) |
| `--format markdown` | Markdown |
| `--format json` | Structured JSON |

## Debug Output

Set `DIALTONE_DEBUG=1` to print the search engine's debug output to stderr:

```bash
DIALTONE_DEBUG=1 dialtone search button
```

## Updating

Update a project-local dependency from the application directory:

```bash
npm install --save-dev --save-exact @dialpad/dialtone-cli@latest
```

Review and commit the manifest/lockfile change. For global installations, use `npm install -g @dialpad/dialtone-cli@latest`. If your CLI notice prints a global command, choose the update command matching your installation. Restart a long-lived client after changing its PATH or environment.

The CLI selects data from its invocation directory; updating the CLI refreshes bundled documentation and fallback data, not the application's Dialtone dependencies. Check the reported sources and versions. See [data sources](https://dialtone.dialpad.com/guides/cli/#data-sources).

## Assistant integration

A coding assistant can invoke the CLI through its shell tool when the command is available and permitted. For project-local installs, use the runner described above from the application directory.

Merge the [shared lookup instruction](https://dialtone.dialpad.com/guides/getting-started/#ai-assisted-development) into a project file your client loads. It covers Codex and Claude Code loading routes, CLI-only access, selected-version checks and unavailable-tool behavior. Preserve existing project guidance and permission settings. A dependency README does not load itself into the assistant's context; confirm an actual CLI call and returned source/version in the consuming session.

### CLI vs MCP Server

Use the CLI for explicit terminal queries and scripts. Use the MCP server when a compatible client should call Dialtone tools. Both use the same search engine; neither interface guarantees lower token use, better reasoning or installed compatibility.

| Use case | Recommended |
|----------|-------------|
| Quick lookups (props, tokens, classes) | CLI |
| Client-managed tool calls | MCP server |
| Shell scripts and automation | CLI |
| Piping context into AI tools | CLI (`dialtone prompt`) |
| Other MCP clients | Check the client's stdio support and configuration |
