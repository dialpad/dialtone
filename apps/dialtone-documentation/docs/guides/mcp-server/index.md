---
title: Dialtone MCP Server
description: Search Dialtone's design system with AI assistants using the Model Context Protocol
keywords:
  [
    "model context protocol",
    "ai assistant",
    "documentation search",
    "agent",
    "tools",
  ]
---

The Dialtone MCP Server lets compatible AI clients search Dialtone through Model Context Protocol (MCP) tools. Use the [Dialtone CLI](/guides/cli/) for direct terminal queries or shell scripts. MCP can select installed lookup data when configured with an explicit dependency root; otherwise it uses bundled data.

## What It Does

Search across:

- **CSS utility classes** - Find classes like `d-p-100`, `d-d-flex`, `d-w100p`
- **Design tokens** - Find tokens like `--dt-color-foreground-primary`, `--dt-spacing-100`
- **Vue components** - Discover `DtButton` and `DtModal` with sampled API summaries, then use `get_component` for complete available records
- **Icons** - Find icons like `bell-ring`, `arrow-up`, `calendar-plus`
- **Public documentation** - `search_documentation`: Search usage prose, recipes, accessibility rules, migration guides, and design principles. Use for "how-to" and "why" questions that go beyond component/token/icon lookups.

### Smart Features

- **Filters deprecated discovery results** - Exact legacy utility and token names retain their contract and migration guidance
- **Recommends alternatives** - Suggests better patterns when discouraged classes are found
- **AI-optimized results** - Smart scoring provides the most relevant matches first
- **Design system aware** - Understands Dialtone's conventions and patterns

## Installation

There are three ways to install the Dialtone MCP Server. **Project-scoped installation takes priority** over user-scoped when both exist.

### Project-Scoped (Recommended for Teams)

Best for team collaboration - everyone uses the same version via version control.

```bash
npm install -D @dialpad/dialtone-mcp-server
```

Create or update `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "dialtone": {
      "command": "dialtone-mcp-server"
    }
  }
}
```

Commit `.mcp.json` to version control. Restart Claude Code to connect.

> [!INFO] Priority
> Project-scoped configuration overrides user-scoped. The `dialtone-mcp-server` command resolves from `node_modules/.bin/` first.

### User-Scoped (Personal Use)

Available across all your projects. Choose one method:

#### Option A: Install in dedicated directory

```bash
# Install in a dedicated directory
mkdir -p ~/.mcp-servers
cd ~/.mcp-servers
npm install @dialpad/dialtone-mcp-server

# Add to Claude Code
claude mcp add dialtone --scope user dialtone-mcp-server
```

#### Option B: Install globally

```bash
npm install -g @dialpad/dialtone-mcp-server
claude mcp add dialtone --scope user dialtone-mcp-server
```

#### Option C: Use npx (no installation)

```bash
claude mcp add dialtone --scope user -- npx -y @dialpad/dialtone-mcp-server
```

This stores configuration in `~/.claude/mcp.json`.

### Transport

The packaged server uses stdio. Configure your MCP client to launch the server process, as shown above.

> [!INFO] Version Checking
> Startup does not wait for the update check. A successful check writes a version or update notice to stderr; failed or malformed responses are ignored. The check is cancelled after two seconds or during shutdown.

<a id="select-installed-project-data"></a>

## Configure MCP to use your installed Dialtone version

The project root setting, `DIALTONE_PROJECT_ROOT`, tells the MCP server which installed Dialtone version to use. Set it to the absolute directory containing your application's `package.json` and dependency installation. The server does not infer this directory from its launch location, scan for nested applications, or request client workspace roots.

For a nested application, point at the application rather than the repository root:

```json
{
  "mcpServers": {
    "dialtone": {
      "command": "dialtone-mcp-server",
      "env": {
        "DIALTONE_PROJECT_ROOT": "/absolute/path/repo/apps/web"
      }
    }
  }
}
```

For dependencies hoisted into an ancestor workspace, also set `DIALTONE_LOOKUP_ROOT` to that absolute workspace directory. Package and data realpaths must stay inside the authorized boundary; lookup does not cross a separate Git repository. Symlinks into that boundary are supported. Dependencies linked outside it remain unverified. Use separate named server configurations for separate applications.

In pnpm workspaces, and other layouts where package symlinks resolve outside the application folder, also set `DIALTONE_LOOKUP_ROOT` to the workspace root.

A declared `@dialpad/dialtone` takes precedence over standalone packages. Otherwise, declared standalone Vue, CSS and icon packages supply installed data. With an explicit lookup root, declarations can come from the nearest ancestor workspace manifest inside that boundary; the closest manifest declaring Dialtone packages wins. Missing or malformed domains fall back separately to bundled data with a reason. Documentation, component-page links and client rules remain bundled references. Without configuration, existing bundled lookups continue; invalid configuration never silently falls back to the launch directory.

Search replies remain Markdown, with actual source package versions, hashes and fallback reasons. Structured detail reports per-domain installed or bundled sources. Resource JSON uses the same selected data, with source information in the result's `_meta.dialtone`. A statically verified entry can establish that a component is not exported; absent metadata alone cannot. Bundled fallback retains its source-verified component names and import hints; it does not verify your installation. Startup stderr and search/detail replies report fallback and version-mismatch warnings. Bundled documentation is an expected latest reference, so it is not labelled as a failed installed-data lookup. These checks do not run application imports or verify peers, runtime behavior or the active theme.

Restart the server after changing configuration or dependencies. It captures one context at startup and does not watch installations for changes. This feature requires a server package version containing it; a source merge does not update an existing installed server. Check a component detail response after setup: its selected source should name the installed package/version, or explain the bundled fallback. A server version that predates this feature can ignore the new environment settings.

## Search Tools

### Utility Classes

**Tool:** `search_utility_classes`

Find CSS utility classes to style HTML elements. Use when your query mentions CSS properties (padding, margin, display, flex) or values (8px, 100%, center, auto).

**Example queries:**

```text
"padding 8px"       → d-p-100, d-pbs-100, d-pbe-100, d-pis-100, d-pie-100 d-px-100, d-py-100
"display flex"      → d-d-flex, d-d-inline-flex
"width 100%"        → d-w100p
"margin top auto"   → d-mbs-auto
"text align center" → d-ta-center
```

**Parameters:**

- `query` (required): CSS property and/or value
- `limit` (optional): Maximum returned classes (default 15)
- `offset` (optional): Integer record offset (0–100000, default 0)

Readable Markdown results retain every available property and usage example for each returned class, together with search notes and source provenance. Follow the text continuation call for more classes.

### Design Tokens

**Tool:** `search_tokens`

Find design tokens (CSS variables) from Dialtone's design system. Use when your query mentions token categories (color, space, font, size) or semantic names (primary, positive, foreground, background).

**Example queries:**

```text
"color foreground primary" → --dt-color-foreground-primary
"spacing 100"              → --dt-spacing-100, --dt-spacing-100-negative
"font family"              → --dt-font-family-body, --dt-font-family-expressive
"font weight bold"         → --dt-font-weight-bold
```

**Parameters:**

- `query` (required): Token category, name, or value; an exact returned token name for theme detail
- `projection` (optional): `summary` (default) or `themes`
- `limit` (optional): Maximum returned tokens or theme records (default 15)
- `offset` (optional): Record offset (default 0)

Readable Markdown results preserve three named theme samples and token usage, label the sample as incomplete, and supply an exact `projection: "themes"` call. The theme projection returns complete available named source records and migration metadata as text, with limit/offset continuations. Samples and detail values do not identify your active installed theme.

### Components

**Tool:** `search_components`

Discover Vue component candidates by UI element or name. Select a canonical component and use `get_component` to retrieve its available API contract.

Component and documentation discovery reuse curated page keywords. `spinner` leads with `DtLoader`, `blank slate` with `DtEmptyState`, and `text field`, `text-field`, or `textbox` with `DtInput`. `autocomplete` and `typeahead` find the supported Combobox candidates. `notification` exposes `DtBanner`, `DtNotice`, and `DtToast` as distinct choices. Canonical component name and family matches keep their existing priority. Longer requests recognize complete keyword phrases and public names, including regular plurals. Complete name, keyword and API-text matches lead before partial contextual candidates; separate keywords do not combine into a complete phrase. Text notes identify the matched keywords or names. Unrecognized context is not a supported feature claim. Documentation preserves named subjects and selects sections using their source evidence; keywords help discover pages.

For a longer request:

```json
{ "query": "add a loader to the settings page" }
```

For example, call `search_components` with `{ "query": "spinner" }`, then `get_component` with `{ "component": "DtLoader" }`. Use `search_documentation` with `{ "query": "blank slate" }` for Empty State guidance. Keywords never become component export aliases: `get_component` with `{ "component": "spinner" }` returns no match.

Keyword associations come from bundled latest documentation and apply only to public components present in the selected data. They do not establish availability or compatibility with your installed Dialtone version.

Directive identifiers such as `v-dt-tooltip` or `DtTooltipDirective` are not component names. Component search returns no components for them; use `search_documentation` for directive contracts.

**Example queries:**

```text
"button"   → DtButton, DtButtonGroup, DtBanner (29 results)
"modal"    → DtModal, DtBanner, DtDropdown (6 results)
"checkbox" → DtCheckbox, DtCheckboxGroup, DtRadio
```

**Returns:**

- Component names, descriptions, the first five props and sampled event/slot names
- Deprecation metadata and verified export hints where available
- Exact detail and pagination continuation calls
- Selected data package versions and hashes; installed runtime compatibility is not checked

**Parameters:**

- `query` (required): Component name or UI element
- `limit` (optional): Maximum returned components (default 15)
- `offset` (optional): Integer record offset (0–100000, default 0)

### Selected component API

**Tool:** `get_component`

Retrieve the selected component's complete available generated records. For Button's full `kind` values, default and deprecation contract, call:

```json
{ "component": "DtButton", "projection": "props", "field": "kind" }
```

`projection` accepts `all` (default), `props`, `events`, `slots`, `methods` and `expose`. `field` is optional and stays within that component. Records preserve available types, values, defaults, required inputs, tags, event payloads and scoped-slot bindings. Missing metadata is unknown. Import hints state export verification only; documentation links are latest production references with readiness and API-content qualification.

`limit` accepts integers 1–50 (default 20); `offset` defaults to zero. Follow the returned continuation for remaining records. Selected detail has a rough budget of 12000 estimated tokens, counted as compact envelope JSON UTF-8 bytes divided by four and rounded up. Readable searches are not cut by this budget. Oversized atomic contracts report their omission instead of silently truncating values or payloads.

### Complete documentation prose

**Tools:** `search_documentation`, then `get_documentation`

Search returns exact section IDs, 500-character excerpts and detail calls. Pass an exact ID to retrieve the available prose, for example:

```json
{ "id": "components/checkbox#accessibility" }
```

`textLimit` defaults to 6000 Unicode code points (1–10000); `textOffset` defaults to zero (0–1000000). Follow the returned continuation to read remaining content. Prose retrieval does not verify example code or consumer compatibility.

Directive documentation includes source code snippets and registration guidance. Component documentation can omit code fences or page-level scripts, so retrieving a complete record does not necessarily return a complete working example. Check required imports, CSS/theme setup, state, and behavior against your application before using a snippet.

The five search tools return readable Markdown only, with selected package/version/hash provenance and text continuation calls. All execute and advertise a default limit of 15. They accept plain string queries, fractional numeric limits, harmless numeric-string limits and extra arguments. Whitespace-only queries return a clear no-match message; long inputs follow the existing domain search rules. Only `get_component` and `get_documentation` return structured envelopes and matching JSON text fallbacks; their selected detail schemas remain strict. Installed compatibility is not checked.

### Retrieve a selected example

Use the existing exact-ID tool for complete source-derived examples:

```json
{"id":"examples/button-default"}
```

Pass this object to `get_documentation`; `examples/button-disabled-tooltip` retrieves the existing disabled Button Tooltip pattern. For a longer request, use `search_documentation`, for example `{"query":"button with a tooltip"}`. Matching source sections supply example IDs and fetch calls. Component search also supplies hints for the requested subject; assembly imports alone do not make an example relevant. Discovery shows at most three IDs and the total; the matching source or component detail exposes its full `exampleIds` list. Complete example records stay out of ordinary search rankings.

Vue-app records contain all five application files, dependency pins and setup instructions. Static-HTML records contain authored HTML with CSS/theme prerequisites, without Vue application files or page scripts. Follow every `textOffset` continuation and concatenate content in order before copying it; a continued fragment is not a runnable application. Unknown example IDs retain `no-match`, list available IDs and offer documentation-search recovery.

Initial coverage retains the two Button examples and adds Loader, Toggle and one static Word Wrap utility example. Vue apps use the `dt10-pinned` profile (umbrella 10.5.1, icons 5.2.0, Vue 3.5.18); other installations remain unverified. Source package/version, section and hash remain separate. Delivered-file or runtime/tooling tuple changes invalidate affected validation until rechecked; whole-page hashes identify source provenance. Read the delivered state/event responsibilities and manual-review status. Consumers must prevent disabled actions in their handlers and verify interaction/accessibility in their own application; a successful build establishes compilation only. The Toggle v-model example includes authored local state; application side effects remain consumer responsibilities. Source fieldset fixtures retain their missing-legend qualification. Check the record's browser, keyboard and screen-reader evidence separately.

`search_utility_classes` with `{"query":"d-ww-normal"}` supplies the static utility example ID; retrieve it with `get_documentation`. Hints use actual selected utility results and bundled documentation. Check each representation and validation status; this first batch is not full coverage.

Example generation runs in `dialtone-docs:build`; query-core and adapter builds bundle that output into packed packages. Documentation deployment and source merges do not update an installed server: the existing release selection, publication and package-update path still applies. Packed candidates are separate from published packages and verified consumer delivery.

### Icons

**Tool:** `search_icons`

Find icons from Dialtone's icon library and learn how to use icon components. Icons are imported from `@dialpad/dialtone-icons/vue`, not `@dialpad/dialtone-vue`.

**Example queries:**

```text
"notification" → bell, bell-ring, bell-off, bell-plus
"arrow up"     → arrow-up, arrow-up-down, arrow-up-left
"profile"      → user
"calendar"     → calendar, calendar-plus, calendar-event
```

**Returns:**

- Icon name
- Categories
- Keywords
- Tree-shakable import path
- Usage example

**Parameters:**

- `query` (required): Icon name, category, or keyword
- `limit` (optional): Maximum returned icons (default 15)
- `offset` (optional): Integer record offset (0–100000, default 0)

### Documentation

**Tool:** `search_documentation`

Search usage guidance, accessibility responsibilities and directive contracts, including imports, registration, arguments and modifiers.

```text
"v-dt-tooltip"
"DtModeDirective registration"
```

Directive replies identify the source package and version and link to the Storybook reference. Documentation uses bundled data; compatibility with the project's installed packages is not checked.

## Usage Examples

### Finding Styling Classes

When working on a component and need specific styling:

```text
User: "What class adds padding 8px to all sides?"
Claude: [Uses search_utility_classes tool]
Result: d-p-100 (padding: var(--dt-spacing-100) which equals 8px)
```

### Discovering Components

When building UI and unsure what components exist:

```text
User: "What button components are available in Dialtone?"
Claude: [Uses search_components tool]
Result: Component descriptions, sampled props/events/slots, imports and detail routes.
Claude: [Uses get_component for the selected DtButton API]
```

### Looking Up Tokens

When implementing designs and need exact token values:

```text
User: "What's the primary foreground color token?"
Claude: [Uses search_tokens tool]
Result: --dt-color-foreground-primary
        Value: #1C1C1C (in light theme)
        Available in: dp-light, dp-dark themes
```

### Finding Icons

When adding icons to your interface:

```text
User: "Show me all notification-related icons"
Claude: [Uses search_icons tool]
Result: bell, bell-ring, bell-off, bell-plus, bell-minus
        Import: import { IconBell } from '@dialpad/dialtone-icons/vue'
```

## CLI or MCP Server

The MCP server and [Dialtone CLI](/guides/cli/) use the same Dialtone search engine. Choose the interface that fits the task:

- Use the MCP server when you want an AI client to choose and run Dialtone searches during a conversation.
- Use the CLI when you want to run an explicit terminal query, use Dialtone data in a script, or inspect the version installed in your project.

You can install both. The MCP server handles tool calls from an AI client, while the CLI handles commands that you run directly.

## Configuration

### Updating the Server

Changes to the component, utility, token, icon and documentation sources bundled by the server are eligible for an MCP server release through the normal release process. A source change or documentation-site deployment does not update an installed server.

The server checks for updates after connecting. If the registry check succeeds and a different version is available, it writes this notice to stderr:

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  Dialtone MCP Server Update Available
   Current: v1.2.0
   Latest:  v1.2.1

   To update:
   1. npm install -D @dialpad/dialtone-mcp-server@latest
   2. Restart the server or MCP client
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**To update:**

**Project-scoped:**

```bash
npm install -D @dialpad/dialtone-mcp-server@latest
```

**User-scoped (local directory):**

```bash
cd ~/.mcp-servers
npm update @dialpad/dialtone-mcp-server
```

**User-scoped (global):**

```bash
npm update -g @dialpad/dialtone-mcp-server
```

**User-scoped (npx):**

To request the latest published package when the server starts, use `npx -y @dialpad/dialtone-mcp-server@latest` in your client configuration.

After updating the package and any version pin in your client configuration, restart the server or MCP client. A running server keeps the data it loaded at startup.

Replies identify installed or bundled sources and versions. Updating the server refreshes its bundled data; it does not update your application's Dialtone packages or verify runtime or example behavior. Bundled source and keyword changes reach an installed server only after package publication, an update and a server restart. Changes to data selected from your installed project can be loaded by restarting the server; those local changes do not require publishing or updating the MCP package. Local generation, builds and source merge do not publish bundled updates.

### Managing Connections

**List configured servers:**

```bash
claude mcp list
```

**View specific server:**

```bash
claude mcp get dialtone
```

**Remove server:**

```bash
claude mcp remove dialtone
```

## Compatible Platforms

The Dialtone MCP Server works with any MCP-compatible AI assistant:

- ✅ **Claude Code CLI** - Primary integration
- ✅ **Claude Desktop** - Via configuration file
- ✅ **VS Code** - With GitHub Copilot
- ✅ **Cursor** - Native MCP support
- ✅ **Windsurf** - Native MCP support
- ✅ **Cline** - MCP integration
- ✅ **Continue** - MCP support
- ✅ **Any MCP-compatible client**

### Platform-Specific Setup

**Claude Desktop:**

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%/Claude/claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "dialtone": {
      "command": "npx",
      "args": ["-y", "@dialpad/dialtone-mcp-server"]
    }
  }
}
```

Restart Claude Desktop and look for the 🔌 icon to confirm connection.

## Troubleshooting

### Server Not Connecting

**For project-scoped installation:**

1. Verify `.mcp.json` exists in your project root with correct format
2. Check package is installed:

   ```bash
   npm list @dialpad/dialtone-mcp-server
   ```

3. Verify bin command exists:

   ```bash
   ls node_modules/.bin/dialtone-mcp-server
   ```

4. Restart Claude Code completely

**For user-scoped installation:**

1. List configured servers:

   ```bash
   claude mcp list
   ```

2. Check if dialtone is listed and enabled
3. Test the server:

   ```bash
   claude mcp get dialtone
   ```

4. Check configuration:

   ```bash
   cat ~/.claude/mcp.json
   ```

> [!WARNING] Important
> Project-scoped configuration overrides user-scoped. If you have both, the project-level `.mcp.json` takes precedence.

### Version Shows Old After Updating

The server loads once at conversation start. You must restart your conversation after updating to see the new version.

### No Search Results

- **Use keywords, not questions** - Try "button" instead of "What button components exist?"
- **Try broader terms first** - Search "padding" before "padding left 16px"
- **Check example queries** - Review the examples in each tool section above
- **Verify installation** - Ensure the server is running: `claude mcp list`

### Build Issues

If you're developing or testing locally:

1. Ensure workspace dependencies are built first
2. Run from monorepo root: `pnpm install`
3. Build the server: `pnpm nx run dialtone-mcp-server:build`
4. Check for TypeScript errors in the console

## Resources

- **Dialtone Documentation** - [dialtone.dialpad.com](https://dialtone.dialpad.com)
- **npm Package** - [@dialpad/dialtone-mcp-server](https://www.npmjs.com/package/@dialpad/dialtone-mcp-server)
- **GitHub Repository** - [github.com/dialpad/dialtone](https://github.com/dialpad/dialtone)
- **MCP Protocol** - [modelcontextprotocol.io](https://modelcontextprotocol.io)
- **Report Issues** - [GitHub Issues](https://github.com/dialpad/dialtone/issues)

## Next Steps

Now that you have the MCP server installed, explore these resources:

- [Dialtone CLI](/guides/cli/) - Search Dialtone from your terminal or a script
- [Getting Started with Dialtone](/guides/getting-started/) - Learn Dialtone basics
- [Utility Classes](/utilities/) - Browse all utility classes
- [Design Tokens](/tokens/) - Explore design tokens
- [Components](/components/) - Discover Vue components
- [Icons](/design/icons/) - View the icon library

> [!INFO] Developer Tip
> The MCP server is perfect for discovering Dialtone patterns while coding. Instead of searching documentation manually, simply ask your AI assistant about components, tokens, or utilities, and it will search for you in real-time.
