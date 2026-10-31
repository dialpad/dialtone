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

Use `--id <id>` instead of a query to retrieve a complete documentation record. Minimal and Markdown formats print its content; JSON returns a one-record array with its metadata. Missing IDs, an empty ID, or combining a query with `--id` exit with an error. `--limit` controls search results, not exact-ID content.

Selected documentation and Combinator preset examples include complete application files and pinned dependencies; static utility examples contain standalone HTML. This selection is not full coverage. Their pinned profile does not establish installed-project compatibility; read each record's build/API and manual-review status and environment. `component --examples` text output lists available example IDs; complete example records stay out of documentation search. See [Retrieve a selected example](https://dialtone.dialpad.com/guides/cli/#retrieve-a-selected-example) for setup and qualification.

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

Search CSS utility classes.

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

## Claude Code Integration

A coding assistant can invoke the CLI through its shell tool when that command is available and permitted. The following Claude Code examples are optional integrations; loading guidance does not establish that a session called the CLI. For project-local installs, use the runner described above from the application directory.

### Rules

Add a rule to your project's `.claude/rules/` that teaches Claude about the CLI:

```markdown
---
description: "Dialtone design system lookups"
---

# Dialtone Design System

Run these commands from the application directory. When working with Dialtone components, tokens, or utility classes, use the `dialtone` CLI for lookups:

- Component API: `npm exec --no -- dialtone component <name> --props`
- Single prop: `npm exec --no -- dialtone component <name> --prop <prop>`
- Token lookup: `npm exec --no -- dialtone token "<query>"`
- Utility classes: `npm exec --no -- dialtone utility "<query>"`
- Structured data: add `--format json` to any command

Prefer the CLI over reading source files for design system information. It searches
the generated API and leaves deprecated items out of general discovery. Exact
legacy component, utility or token names retain their contract. Use `--format json`
to inspect utility migration metadata. Token lookups print migration notes to stderr
in all formats; add `--values --format json` for structured metadata.
```

### Skills

Wrap CLI commands in a skill for common workflows:

```markdown
---
description: "Look up a Dialtone component. Use when referencing component props, events, or slots."
---

# Dialtone Lookup

Run these commands from the application directory.

1. Run `npm exec --no -- dialtone component <name> --format json` to get full component data
2. If you need specific prop values, run `npm exec --no -- dialtone component <name> --prop <prop>`
3. For LLM-optimized context, run `npm exec --no -- dialtone prompt <name>`
```

### Agents

An agent can call the CLI via Bash to research design system questions:

```markdown
---
description: "Research Dialtone design system components, tokens, and utilities."
---

Run these commands from the application directory. Use the `dialtone` CLI to look up design system information:

- `npm exec --no -- dialtone search "<query>"` — broad search across all domains
- `npm exec --no -- dialtone search "<term1>|<term2>"` — OR search across multiple terms
- `npm exec --no -- dialtone component <name> --format json` — full component data
- `npm exec --no -- dialtone token "<query>" --format json` — token data
- `npm exec --no -- dialtone utility "<query>" --format json` — utility class data

Always use `--format json` when processing results programmatically.
```

### CLI vs MCP Server

Use the CLI for explicit terminal queries and scripts. Use the MCP server when a compatible client should call Dialtone tools. Both use the same search engine; neither interface guarantees lower token use, better reasoning or installed compatibility.

| Use case | Recommended |
|----------|-------------|
| Quick lookups (props, tokens, classes) | CLI |
| Client-managed tool calls | MCP server |
| Shell scripts and automation | CLI |
| Piping context into AI tools | CLI (`dialtone prompt`) |
| Other MCP clients | Check the client's stdio support and configuration |
