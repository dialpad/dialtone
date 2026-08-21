---
title: Dialtone CLI
description: Search the Dialtone version installed in your project from the command line.
keywords:
  [
    "command line",
    "cli",
    "documentation search",
    "component api",
    "design tokens",
    "utility classes",
    "agent",
  ]
---

The Dialtone CLI searches components, design tokens, CSS utility classes, icons, and documentation from your terminal. Run it from your project to get results that match the version of Dialtone you have installed.

Use the CLI for direct lookups, shell scripts, and compact context for coding agents. Use the [Dialtone MCP Server](/guides/mcp-server/) when you want an AI assistant to search Dialtone through Model Context Protocol (MCP) tools.

## Installation

Install the CLI globally:

```bash
npm install -g @dialpad/dialtone-cli
```

Confirm the installation:

```bash
dialtone --help
```

Run CLI commands from the root of your project. When the CLI finds installed Dialtone packages, it prints the version it is using:

```text
Using local Dialtone data (v8.81.0)
```

Without local Dialtone data, the CLI uses the data bundled with `@dialpad/dialtone-cli`.

## Quick start

Search across Dialtone when you do not know which command to use:

```bash
dialtone search "button"
```

Then narrow the lookup to the relevant part of the system:

```bash
dialtone component button --props --describe
dialtone token "color foreground primary"
dialtone utility "padding 8px"
dialtone docs "how to choose button importance"
```

Add `--format json` when a script or coding agent needs structured output:

```bash
dialtone component button --format json
```

## Commands

| Command                     | Use it to                                                             |
| --------------------------- | --------------------------------------------------------------------- |
| `dialtone search <query>`   | Search components, documentation, tokens, utility classes, and icons. |
| `dialtone component <name>` | Read a component's API, including props, events, slots, and examples. |
| `dialtone token <query>`    | Find design tokens and inspect theme values.                          |
| `dialtone utility <query>`  | Find CSS utility classes by property or value.                        |
| `dialtone docs <query>`     | Search usage guidance, recipes, accessibility guidance, and patterns. |
| `dialtone prompt <name>`    | Generate compact component context for a coding agent.                |

Run `dialtone <command> --help` to see every option for a command.

### Search across Dialtone

Use `search` for broad discovery. Results are grouped across all available Dialtone data, including icons and documentation.

```bash
dialtone search "button"
dialtone search "padding 8px"
dialtone search "notification"
```

Separate terms with `|` to search for any of them:

```bash
dialtone search "input|select|menu"
```

The CLI returns 20 results by default. Set a different limit, or use `--limit 0` to return all matches:

```bash
dialtone search "button" --limit 5
dialtone search "button" --limit 0
```

The CLI does not have a separate icon command. Search by an icon's name, category, or keyword instead:

```bash
dialtone search "calendar" --format json
```

### Inspect a component

Use `component` to inspect the public API for the closest component match:

```bash
dialtone component button
dialtone component DtModal
```

Filter the output when you only need one part of the API:

```bash
dialtone component button --props
dialtone component button --props --describe
dialtone component button --prop kind
dialtone component button --events
dialtone component button --slots
dialtone component button --examples
```

`--prop` returns the prop type, description, and accepted values. If the prop does not exist, the CLI lists the available prop names.

### Find a design token

Use `token` to search by a token name, category, semantic purpose, or value:

```bash
dialtone token "color foreground primary"
dialtone token "spacing 400"
```

Use `--values` to show theme values for the first match:

```bash
dialtone token "color foreground primary" --values
```

HSL decomposition tokens are excluded by default. Include them with `--all`:

```bash
dialtone token "color foreground" --all
```

### Find a utility class

Use `utility` to search by a CSS property, value, or both:

```bash
dialtone utility "padding 8px"
dialtone utility "display flex"
dialtone utility "margin auto"
```

Search results include the class name and its CSS declaration. Deprecated utilities are filtered from the results.

### Search documentation

Use `docs` for questions about how or why to use Dialtone. It searches public guidance, component usage, accessibility guidance, and migration documentation.

```bash
dialtone docs "how to choose button importance"
dialtone docs "accessible tooltip labels"
dialtone docs "migrate physical properties to logical properties"
```

Documentation is bundled with the CLI rather than resolved from your project's installed Dialtone packages. Update the CLI to refresh this content.

### Generate context for a coding agent

Use `prompt` to produce a compact component summary with its props, slots, events, and import path:

```bash
dialtone prompt button
```

Copy the result to your clipboard on macOS:

```bash
dialtone prompt modal | pbcopy
```

Use JSON when the receiving tool needs structured data:

```bash
dialtone prompt tooltip --format json
```

## Output formats

Every command accepts `--format`:

| Format     | Output                                   | Use it for                                  |
| ---------- | ---------------------------------------- | ------------------------------------------- |
| `minimal`  | Compact plain text. This is the default. | Terminal lookups and copying small results. |
| `markdown` | Markdown-formatted text.                 | Documentation and text-based prompts.       |
| `json`     | Structured JSON.                         | Scripts, editor tooling, and coding agents. |

For programmatic use, prefer `--format json` instead of parsing the default terminal output.

## Data sources

The CLI resolves data from the directory where you run it. It checks these sources in order:

1. Installed `@dialpad/dialtone-css`, `@dialpad/dialtone-vue`, and `@dialpad/dialtone-icons` packages.
2. The installed `@dialpad/dialtone` package.
3. Data bundled with `@dialpad/dialtone-cli`.

The CLI uses local component APIs, tokens, utility classes, and icons when their generated data is available. It falls back to bundled data for anything it cannot resolve. Documentation search always uses the content bundled with the CLI.

Use `--bundled` when you want to ignore installed packages and query the CLI's bundled data:

```bash
dialtone --bundled search "button"
```

## CLI or MCP Server

The CLI and MCP server use the same Dialtone search engine. Choose the interface that fits the task.

| Task                                                          | Recommended interface             |
| ------------------------------------------------------------- | --------------------------------- |
| Check the Dialtone version installed in a project             | CLI                               |
| Look up a prop, token, utility class, or icon from a terminal | CLI                               |
| Use Dialtone data in a shell script                           | CLI with `--format json`          |
| Add compact component context to a coding prompt              | CLI with `prompt`                 |
| Let an MCP-compatible AI client choose and run searches       | [MCP Server](/guides/mcp-server/) |

You can install both. The CLI handles explicit terminal queries; the MCP server lets an AI client call Dialtone search tools directly.

## Update the CLI

The CLI checks npm for a newer version without blocking a command. Update it globally when an update is available:

```bash
npm install -g @dialpad/dialtone-cli@latest
```

Updating refreshes bundled documentation and the fallback data used outside a Dialtone project.

## Troubleshooting

### The command is not found

Install the package globally, then restart your terminal so it can resolve the `dialtone` executable:

```bash
npm install -g @dialpad/dialtone-cli
```

### Results do not match the project

Run the command from the project root. The `Using local Dialtone data` message confirms that the CLI found installed Dialtone package data. If the message is absent, the CLI is using its bundled data.

### A search returns no useful results

Start with fewer keywords, then narrow the query. Use `|` when any of several terms is acceptable:

```bash
dialtone search "input|select|menu"
```

Use the focused `component`, `token`, `utility`, or `docs` command once you know which type of result you need.

## Resources

- [Dialtone MCP Server](/guides/mcp-server/)
- [Components](/components/)
- [Design tokens](/tokens/)
- [CSS utilities](/utilities/)
- [Icons](/foundations/icons/)
- [@dialpad/dialtone-cli on npm](https://www.npmjs.com/package/@dialpad/dialtone-cli)
- [Dialtone on GitHub](https://github.com/dialpad/dialtone)
