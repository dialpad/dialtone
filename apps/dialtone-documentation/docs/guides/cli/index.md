---
title: Dialtone CLI
description: Search Dialtone APIs and documentation from the command line.
status: ready
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

The Dialtone CLI searches components, design tokens, CSS utility classes, icons, and documentation from your terminal. Run it from your project to use available installed package data. Missing data falls back to the CLI's bundled data; documentation always uses bundled content. Check the source line to see which data each lookup uses.

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

Run CLI commands from your project. The CLI prints one line on stderr naming the Dialtone data it uses:

```text
Using local Dialtone data: @dialpad/dialtone@10.4.0 (icons: @dialpad/dialtone-icons@5.2.0, docs: bundled)
```

Without local Dialtone data, the line reads `Using bundled Dialtone data (@dialpad/dialtone-cli@<version>)`.

### Keeping lookup data current

Changes to the component, utility, token, icon and documentation sources bundled by the CLI are eligible for a CLI release through the normal release process. A source change or documentation-site deployment does not immediately update an installed CLI.

Update `@dialpad/dialtone-cli` in the same location where you installed it to receive newer bundled data. Documentation always comes from that bundle. When a lookup uses your project's installed Dialtone packages, their versions still determine the available API; updating the CLI does not update those packages. Check the reported source and version before using an answer.

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
| `dialtone component <name>` | Read props, events, slots, and qualified import hints.                |
| `dialtone token [query]`    | Find design tokens by query or `--name` and inspect theme values.     |
| `dialtone utility <query>`  | Find CSS utility classes by property or value.                        |
| `dialtone docs <query>`     | Search usage guidance, recipes, accessibility guidance, and patterns. |
| `dialtone docs --id <id>` | Retrieve complete selected source examples and setup.                  |
| `dialtone prompt <name>`    | Generate compact component context for a coding agent.                |

Run `dialtone <command> --help` to see every option for a command.

### Search across Dialtone

Use `search` for broad discovery. Results are grouped across all available Dialtone data, including icons and documentation.

```bash
dialtone search "button"
dialtone search "padding 8px"
dialtone search "notification"
```

Component and documentation discovery reuse curated page keywords. Try familiar interaction terms, then inspect a returned canonical component:

```bash
dialtone search "spinner"
dialtone search "add a loader to the settings page"
dialtone docs "text-field"
dialtone component DtLoader
```

`spinner` leads with `DtLoader`; `blank slate` finds `DtEmptyState`; `text field`, `text-field`, and `textbox` find `DtInput`; `autocomplete` and `typeahead` find the supported Combobox candidates. `notification` presents `DtBanner`, `DtNotice`, and `DtToast` as distinct choices. Canonical component name and family matches keep their existing priority. Longer requests recognize complete keyword phrases and public names, including regular plurals. Complete name, keyword and API-text matches lead before partial contextual candidates; separate keywords do not combine into a complete phrase. Text notes identify the matched keywords or names. Unrecognized context is not a supported feature claim. Documentation preserves named subjects and selects sections using their source evidence; keywords help discover pages.

In broad CLI search, matching token or utility facts appear before partial component hints. All candidates remain available with `--limit 0`.

Keywords are discovery terms. `dialtone component spinner` still exits with no selected component; `component switch` rejects the name and suggests `DtToggle`. Use the canonical result for API lookup.

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

Broad searches share the 20-result limit across all result types. Include later icon matches with `--limit 0`; icon records in JSON have `type: "icon"`:

```bash
dialtone search "notification" --limit 0 --format json
```

### Inspect a component

Use `component` to inspect a component's public API. The name must match exactly, ignoring case, separators, and the `Dt` prefix, so `button`, `dt-button`, and `DtButton` all work. Other names exit with an error, listing close matches when available. A deprecated component still works by its full name, with a note naming its replacement.

Directive identifiers such as `v-dt-tooltip` or `DtTooltipDirective` are not component names and return no component match. Use `docs` for their imports, registration and behavior.

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

`--examples` currently returns an import hint when a public export route is verified, followed by a minimal component tag. It does not supply a complete working example with required props, slots, state, or application setup. Where selected source examples are available, readable output also lists their IDs and fetch commands. With `--format json`, it returns component metadata rather than example code.

### Find a design token

Use `token` to search by a token name, category, semantic purpose, or value:

```bash
dialtone token "color foreground primary"
dialtone token "spacing 400"
```

Use `--name` for a canonical CSS token identifier that begins with `--`. It takes precedence when both a name and a positional query are supplied:

```bash
dialtone token --name=--dt-spacing-100 --values
```

An exact legacy name remains available for migration inspection. The CLI reports its deprecation reason and qualified alternatives on stderr; add `--values --format json` to include metadata and theme values in JSON:

```bash
dialtone token --name=--dt-space-400 --values --format json
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

Search results include the class name and its CSS declaration. General searches filter deprecated utilities; exact legacy names retain their contract and migration metadata in JSON output.

### Search documentation

Use `docs` for questions about how or why to use Dialtone. It searches public guidance, component usage, accessibility guidance, and migration documentation.

```bash
dialtone docs "how to choose button importance"
dialtone docs "accessible tooltip labels"
dialtone docs "migrate physical properties to logical properties"
dialtone docs "v-dt-tooltip"
```

Documentation is bundled with the CLI rather than resolved from your project's installed Dialtone packages. Update the CLI to refresh this content.

Readable results from `dialtone docs` contain excerpts. `dialtone docs "v-dt-tooltip" --format json` returns the complete available documentation records, which can include directive code snippets. A complete record can still omit component examples or page-level scripts; neither format establishes that a snippet runs in your application.

### Retrieve a selected example

```sh
dialtone docs --id examples/button-default
dialtone docs --id examples/button-disabled-tooltip --format json
```

Vue-app exact-ID output contains all five source-derived application files, dependency pins, imports, styling/theme setup and any directive registration. Static-HTML records contain the authored HTML fragment and CSS/theme prerequisites, without a Vue application scaffold. Follow the setup instructions in that record. JSON retains the documentation command's array shape. Unknown example IDs fail with a no-match diagnostic and a bounded list of available IDs.

Initial coverage retains the two Button examples and adds Loader, Toggle and one Word Wrap utility example. Vue applications use the `dt10-pinned` profile (umbrella 10.5.1, icons 5.2.0, Vue 3.5.18); other installations remain unverified. Source package/version, section and hash remain separate. Delivered-file or runtime/tooling tuple changes invalidate affected validation until rechecked; whole-page hashes identify source provenance.

Use `dialtone docs "button with a tooltip"` to discover the source section and available example IDs. Discovery shows at most three IDs and the total; exact source-section retrieval lists all its examples. Complete example records stay out of ordinary search rankings. The delivered records state setup, state/event responsibilities and manual-review status. Consumers must prevent disabled actions in their handlers and verify interaction/accessibility in their own application; a successful build establishes compilation only. The Toggle v-model example retains its authored local state; application actions and persistence remain consumer responsibilities. Source fieldset fixtures retain their missing-legend qualification. Check the record's browser, keyboard and screen-reader evidence separately.

Use `dialtone utility d-ww-normal` for the selected static utility hint, then `dialtone docs --id examples/utility-word-wrap-normal`. Read each record’s representation and validation status. The initial batch is not full documentation-example coverage.

Example data is generated by `dialtone-docs:build`, bundled through query-core into the CLI/MCP builds, then included in their packed packages. Documentation deployment alone does not refresh an installed CLI. Source changes need the existing release selection and package publication/update path; a local packed candidate is not a published release.

### Generate context for a coding agent

Use `prompt` to produce a compact component summary with its props, slots, and events. It includes an import hint only when the CLI can verify a public export route for the component:

```bash
dialtone prompt button
```

Internal components show `Import unavailable` instead of an import. If the CLI cannot verify the installed package's exports, it shows `Import unverified` and advises upgrading component metadata or checking those exports. JSON output uses `import: null` when no verified route is available.

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

MCP uses [explicit project configuration](/guides/mcp-server/#select-installed-project-data). Its environment settings do not configure CLI commands, which resolve from their working directory or use `--bundled`.

The CLI looks for installed packages the way Node does, in the `node_modules` folders in and above the directory you run it from:

1. If a `package.json` at or above your directory, up to the repository root, depends on `@dialpad/dialtone`, the CLI uses that package's component, token, and utility data, and the icons package it depends on.
2. Otherwise, it uses installed `@dialpad/dialtone-vue`, `@dialpad/dialtone-css`, and `@dialpad/dialtone-icons` packages, and fills any gaps from an installed `@dialpad/dialtone`.
3. Anything it can't resolve comes from the data bundled with `@dialpad/dialtone-cli`. Documentation search always uses bundled content.

The source line lists any data that came from somewhere other than the main package. If `package.json` declares a caret, tilde, or exact version of `@dialpad/dialtone` (such as `^10.0.0`) and the installed copy has a different major version, the CLI prints a warning. If `package.json` declares `@dialpad/dialtone` but the CLI can't find an installed copy, it warns and uses bundled data. Yarn Plug'n'Play installs have no `node_modules`, so the CLI uses bundled data there.

Import hints in `component` and `prompt` output appear only for verified public exports. Installed `@dialpad/dialtone` data uses its verified `@dialpad/dialtone/vue` route, or `@dialpad/dialtone/vue3` for versions before 9.173 that expose that route. Installed `@dialpad/dialtone-vue` data and bundled component data use verified routes from `@dialpad/dialtone-vue`.

Curated component keywords also come from bundled documentation and join only to public components present in the selected component data. They are latest documentation references, not proof of installed API availability or behavior. An older or unverified component dataset can lack these associations.

Bundled import hints are verified against the bundled Vue source version. They do not establish that `@dialpad/dialtone-vue` is installed at that version or that the import is compatible with your project's dependencies.

Export verification checks the stated package entry. It does not establish that peer dependencies, application setup, or runtime behavior are correct. Validate code against your installed packages before using it.

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

The CLI checks npm for a newer version in the background, and gives up after 3 seconds. Update it globally when an update is available:

```bash
npm install -g @dialpad/dialtone-cli@latest
```

Updating refreshes bundled documentation, discovery keywords, and the fallback data used outside a Dialtone project. Docs-only keyword edits are eligible for a CLI release through the normal release process. They can reach the site before publication and a CLI update. Source merge and local builds do not update installed tools.

## Troubleshooting

### The command is not found

Install the package globally, then restart your terminal so it can resolve the `dialtone` executable:

```bash
npm install -g @dialpad/dialtone-cli
```

### Results do not match the project

Run the command from inside the project. The source line names the package and version each kind of data came from; `bundled` means the CLI couldn't find installed data for it. A version warning means the installed packages don't match `package.json`; reinstall dependencies.

### A search returns no useful results

Start with fewer keywords, then narrow the query. Use `|` when any of several terms is acceptable:

```bash
dialtone search "input|select|menu"
```

Use the focused `component`, `token`, `utility`, or `docs` command once you know which type of result you need.

### Show the search engine's debug output

Set `DIALTONE_DEBUG=1` to print the search engine's debug output to stderr, including the parsed query and how many results each step matched:

```bash
DIALTONE_DEBUG=1 dialtone component stack --prop gap
```

## Resources

- [Dialtone MCP Server](/guides/mcp-server/)
- [Components](/components/)
- [Design tokens](/tokens/)
- [CSS utilities](/utilities/)
- [Icons](/foundations/icons/)
- [@dialpad/dialtone-cli on npm](https://www.npmjs.com/package/@dialpad/dialtone-cli)
- [Dialtone on GitHub](https://github.com/dialpad/dialtone)
