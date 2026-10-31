# Dialtone MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that provides AI assistants with search access to Dialtone's design system: utility classes, design tokens, Vue components, and icons.

Filters deprecated items from general discovery, retains exact legacy-name matches with migration guidance, swaps discouraged patterns with recommended alternatives, and provides AI-optimized search results.

See [the retrieval contract](./RETRIEVAL.md) for readable searches, structured component/API and prose detail, compatible search inputs, provenance and continuation. Searches return Markdown text; only the two selected detail tools advertise structured output.

Set `DIALTONE_PROJECT_ROOT` to an absolute application dependency directory to select installed lookup data. Without configuration, lookups stay bundled. See [installed project selection](./RETRIEVAL.md#installed-project-selection) for lookup boundaries, hoisting and restart behavior.

## Installation

Install a locked project dependency from the application directory:

```bash
npm install --save-dev --save-exact @dialpad/dialtone-mcp-server
```

Installation does not register a client connection. Follow the [MCP setup guide](https://dialtone.dialpad.com/guides/mcp-server/#installation) for Claude Code's `.mcp.json`/local/user scopes and Codex's complete user `config.toml` entry. It includes a package-manager runner and a resolved-entry alternative that handles hoisted installations. A bare local bin is not guaranteed to be on the client's PATH.

A launcher's cwd or prefix does not select installed data. Check a detail response's selected source/version and fallback reason after connecting.

Keep existing trust, approvals and tool allowlists. Connection, raw server inventory, client-filtered exposure and actual tool calls are separate checks. Other clients, including the Claude Desktop development recipe below, need their own verification; no all-client compatibility claim is made here.

## Updating

From the project installation directory:

```bash
npm install --save-dev --save-exact @dialpad/dialtone-mcp-server@latest
```

Review and commit the manifest/lockfile change. Update a dedicated personal installation in its directory; use `npm install -g @dialpad/dialtone-mcp-server@latest` for a global one. `npx` can use a local or cached package or download one; it does not guarantee the latest release. Update any configured version pin deliberately.

If your startup notice suggests a project-dev install without `--save-exact`, use the command for your installation mode above to preserve the intended pin and installation directory.

Restart the server or reconnect/restart the client after package, configuration or Dialtone dependency changes. A new conversation alone may reuse the old process. The advisory startup check does not install updates and writes notices to stderr, preserving MCP stdout. See [updates and connection checks](https://dialtone.dialpad.com/guides/mcp-server/#configuration).

## What You Can Search

### 1. Utility Classes

Find CSS utility classes for styling HTML elements.

**Example queries:**
- `padding 8px` → d-p-100, d-pt-100, d-pr-100, d-pb-100, d-pl-100, d-px-100, d-py-100
- `display flex` → d-d-flex, d-d-inline-flex
- `width 100%` → d-w100p
- `margin top auto` → d-mt-auto
- `text align center` → d-ta-center

### 2. Design Tokens

Search for design tokens (CSS variables).

**Example queries:**
- `color foreground primary` → --dt-color-foreground-primary
- `spacing 100` → --dt-spacing-100, --dt-spacing-100-negative
- `font family` → --dt-font-family-body, --dt-font-family-expressive
- `font weight bold` → --dt-font-weight-bold

### 3. Components

Discover Vue components with props, events, and slots.

**Example queries:**
- `button` → DtButton, DtButtonGroup, DtBanner
- `modal` → DtModal, DtBanner, DtDropdown
- `checkbox` → DtCheckbox, DtCheckboxGroup, DtRadio

### 4. Icons

Find icons from Dialtone's icon library.

**Example queries:**
- `notification` → bell, bell-ring, bell-off, bell-plus
- `arrow up` → arrow-up, arrow-up-down, arrow-up-left
- `profile` → user
- `calendar` → calendar, calendar-plus, calendar-event

## Troubleshooting

**Version check shows an old version:**
- Check the actual package selected by the configured runner or entry path.
- Restart the server/client after updating; a new conversation may reuse a process.

**MCP server not connecting:**
1. Check the client-specific configuration and its selected scope. Claude Code uses project `.mcp.json` or local/user entries in `~/.claude.json`; Codex uses its TOML configuration.
2. For a project or dedicated installation, run `npm ls @dialpad/dialtone-mcp-server` from its installation directory; use `npm ls -g @dialpad/dialtone-mcp-server` for a global installation. For `npx`, check the connected server version; `npm ls` does not identify a cached selection. A workspace may hoist the package outside the application's own `node_modules`.
3. Inspect client status/logs and available tools. `claude mcp list` and `claude mcp get dialtone` inspect registration and can health-check a server; Codex has its own MCP status. Neither proves model tool selection.
4. Check absolute installed-data roots and the selected source/fallback in a detail reply. Preserve existing trust, permission and exposure settings.

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [Dialtone Docs](https://dialtone.dialpad.com)

---

## Development

For contributors working in the Dialtone monorepo.

### Build

From the monorepo root:

```bash
pnpm install
pnpm nx run dialtone-mcp-server:build
```

### Test Interactively

Try out search queries (must be run from the package directory):

```bash
cd packages/dialtone-mcp-server
pnpm run interactive
```

Or use tsx directly from anywhere:
```bash
npx tsx packages/dialtone-mcp-server/interactive-search.ts
```

**Query Format:** Use keywords only, not questions.
- ✓ Good: `padding 8px`, `color primary`, `button`
- ✗ Bad: `how do I add padding?`, `what button component exists?`

### Run Tests

Startup and shutdown regressions build the server and its prerequisites first:

```bash
pnpm nx run dialtone-mcp-server:test-startup
```

From the package directory, `pnpm run test:startup` invokes `node --test` directly
and requires an existing server build. Use the Nx target above to build first.
Protocol checks likewise build first with `pnpm nx run dialtone-mcp-server:test-protocol`.
The package-level `pnpm run test:protocol` is a direct Node/tsx runner and requires
a current build; CI builds both adapters before invoking it.
Release-path regressions run with `pnpm run test:release-paths`.
Both regression suites run in the path-filtered Unit Tests workflow.

From the package directory:
```bash
cd packages/dialtone-mcp-server
pnpm run test
```

Or from monorepo root:
```bash
node packages/dialtone-mcp-server/test-search.js
```

Expected: `Overall Success Rate: 100%` (77/77 tests)

### Configure with Claude Desktop (development reference)

This recipe has not been verified in a Claude Desktop session. For the repository build, build the server first and use its actual absolute entry path. Follow the client's current setup instructions; the locations below are client-specific, not Claude Code configuration.

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%/Claude/claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "dialtone": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/dialtone/packages/dialtone-mcp-server/build/index.js"
      ]
    }
  }
}
```

**Important:**
- Use the absolute path to your dialtone repo
- Restart Claude Desktop completely after updating the config
- Check client status and available tools after restarting

**Finding your absolute path:**
```bash
cd /path/to/dialtone
pwd
# Use the output + /packages/dialtone-mcp-server/build/index.js
```

### Project Structure

```
packages/dialtone-mcp-server/
├── src/
│   ├── index.ts              # MCP server setup
│   ├── types.ts              # TypeScript interfaces
│   ├── data.ts               # Data imports
│   ├── utils/filters.ts      # Smart filtering
│   └── tools/                # Search implementations
│       ├── utility-classes.ts
│       ├── tokens.ts
│       ├── components.ts
│       └── icons.ts
├── build/                    # Compiled output
├── test-search.js           # Automated tests
├── interactive-search.ts    # Interactive CLI tool
└── README.md
```

### Additional Documentation

- [Search Implementation Details](./MCP_CONTEXT.md)
- [Icon Search Summary](./ICON_SEARCH_SUMMARY.md)
