# Dialtone CLI

A command-line tool for searching and exploring the [Dialtone Design System](https://dialtone.dialpad.com). Look up components, design tokens, CSS utility classes, and icons from your terminal.

## Installation

```bash
npm install -g @dialpad/dialtone-cli
```

## Commands

### `dialtone search <query>`

Search across all domains — components, tokens, utilities, and icons.

```bash
dialtone search button
dialtone search "padding 8px"
dialtone search "input|select|menu"   # OR search
```

### `dialtone component <name>`

Show full component documentation.

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

### `dialtone token <query>`

Look up design tokens.

```bash
dialtone token "color foreground"
dialtone token "space 400"
dialtone token "color foreground" --values     # show theme values
dialtone token "color foreground" --all        # include HSL tokens
dialtone token "color foreground" --limit 0    # show all results
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

## Updating

The CLI checks for updates automatically. To update:

```bash
npm install -g @dialpad/dialtone-cli@latest
```

The data (components, tokens, utilities, icons) is bundled at build time. Update the CLI to get the latest design system data.

## Claude Code Integration

The CLI can be used by Claude Code skills, hooks, and agents in any Dialpad repo. This is the recommended way to give Claude access to Dialtone when the MCP server isn't configured.

### Rules

Add a rule to your project's `.claude/rules/` that teaches Claude about the CLI:

```markdown
---
description: "Dialtone design system lookups"
---

# Dialtone Design System

When working with Dialtone components, tokens, or utility classes, use the `dialtone` CLI for lookups:

- Component API: `dialtone component <name> --props`
- Single prop: `dialtone component <name> --prop <prop>`
- Token lookup: `dialtone token "<query>"`
- Utility classes: `dialtone utility "<query>"`
- Structured data: add `--format json` to any command

Prefer the CLI over reading source files for design system information. It searches
the full published API and filters deprecated items automatically.
```

### Skills

Wrap CLI commands in a skill for common workflows:

```markdown
---
description: "Look up a Dialtone component. Use when referencing component props, events, or slots."
---

# Dialtone Lookup

1. Run `dialtone component <name> --format json` to get full component data
2. If you need specific prop values, run `dialtone component <name> --prop <prop>`
3. For LLM-optimized context, run `dialtone prompt <name>`
```

### Hooks

Use a `UserPromptSubmit` hook to auto-inject Dialtone context when a user mentions a component:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "(?:Dt[A-Z]\\w+|dialtone\\s+component)",
        "command": "dialtone prompt \"$MATCH\" --format json 2>/dev/null || true"
      }
    ]
  }
}
```

### Agents

An agent can call the CLI via Bash to research design system questions:

```markdown
---
description: "Research Dialtone design system components, tokens, and utilities."
---

Use the `dialtone` CLI to look up design system information:

- `dialtone search "<query>"` — broad search across all domains
- `dialtone search "<term1>|<term2>"` — OR search across multiple terms
- `dialtone component <name> --format json` — full component data
- `dialtone token "<query>" --format json` — token data
- `dialtone utility "<query>" --format json` — utility class data

Always use `--format json` when processing results programmatically.
```

### CLI vs MCP Server

Install both. They're complementary — the CLI for fast lookups, the MCP server for deep exploration.

**CLI** — token-efficient plain text. Best for direct lookups: "what props does this component have?", "what tokens match this query?" Returns compact output that costs minimal context window tokens.

**MCP server** — structured data + resources protocol. Best when the LLM needs to pull full datasets, cross-reference components with tokens, or reason through complex design system questions. The resources (`dialtone://components`, `dialtone://tokens`) give access to the complete data.

| Use case | Recommended |
|----------|-------------|
| Quick lookups (props, tokens, classes) | CLI |
| Deep reasoning across the design system | MCP server |
| Shell scripts and automation | CLI |
| Piping context into AI tools | CLI (`dialtone prompt`) |
| Non-Claude MCP clients (Cursor, Windsurf) | MCP server |
