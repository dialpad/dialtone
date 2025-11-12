# Dialtone MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that provides AI assistants with search access to Dialtone's design system: utility classes, design tokens, Vue components, and icons.

Automatically filters deprecated items, swaps discouraged patterns with recommended alternatives, and provides AI-optimized search results.

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

**Priority:** Project-scoped beats user-scoped. The `dialtone-mcp-server` command resolves from `node_modules/.bin/` first.

### User-Scoped (Personal, All Projects)

Available across all your projects. Choose one method:

**Option A: Install locally in your user directory**

```bash
# Install in a dedicated directory
mkdir -p ~/.mcp-servers
cd ~/.mcp-servers
npm install @dialpad/dialtone-mcp-server

# Add to Claude Code
claude mcp add dialtone --scope user dialtone-mcp-server
```

**Option B: Install globally**

```bash
npm install -g @dialpad/dialtone-mcp-server
claude mcp add dialtone --scope user dialtone-mcp-server
```

**Option C: Use npx (no installation)**

```bash
claude mcp add dialtone --scope user -- npx -y @dialpad/dialtone-mcp-server
```

This stores configuration in `~/.claude/mcp.json`.

**Version checking:** When the server starts, you'll see the current version. If outdated, follow the instructions shown.

## Updating

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

No action needed - npx always uses the latest version.

After updating, restart your Claude Code conversation to pick up the new version.

## What You Can Search

### 1. Utility Classes (3,315 classes)
Find CSS utility classes for styling HTML elements.

**Example queries:**
- `padding 8px` → d-p8, d-pt8, d-pr8, d-pb8, d-pl8, d-px8, d-py8
- `display flex` → d-d-flex, d-d-inline-flex
- `width 100%` → d-w100p
- `margin top auto` → d-mt-auto
- `text align center` → d-ta-center

### 2. Design Tokens (5,691 tokens)
Search for design tokens (CSS variables).

**Example queries:**
- `color foreground primary` → --dt-color-foreground-primary
- `space 400` → --dt-space-400, --dt-space-400-negative
- `font family` → --dt-font-family-body, --dt-font-family-expressive
- `font weight bold` → --dt-font-weight-bold

### 3. Components (87 components)
Discover Vue components with props, events, and slots.

**Example queries:**
- `button` → DtButton, DtButtonGroup, DtBanner (29 results)
- `modal` → DtModal, DtBanner, DtDropdown (6 results)
- `checkbox` → DtCheckbox, DtCheckboxGroup, DtRadio

### 4. Icons (594 icons)
Find icons from Dialtone's icon library.

**Example queries:**
- `notification` → bell, bell-ring, bell-off, bell-plus
- `arrow up` → arrow-up, arrow-up-down, arrow-up-left
- `profile` → user
- `calendar` → calendar, calendar-plus, calendar-event

## Troubleshooting

**Version check shows old version:**
- Restart your Claude Code conversation after updating
- The server loads once at conversation start

**MCP server not connecting:**

For project-scoped:
1. Verify `.mcp.json` is in your project root with correct format
2. Check package is installed: `npm list @dialpad/dialtone-mcp-server`
3. Verify bin command exists: `ls node_modules/.bin/dialtone-mcp-server`
4. Restart Claude Code completely

For user-scoped:
1. List configured servers: `claude mcp list`
2. Check if dialtone is listed and enabled
3. Test the server: `claude mcp get dialtone`
4. Check configuration: `cat ~/.claude/mcp.json`

General:
- Check Claude Code logs for connection errors
- Remember: Project-scoped configuration overrides user-scoped

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

### Configure with Claude Desktop (for testing)

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (MacOS) or `%APPDATA%/Claude/claude_desktop_config.json` (Windows):

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
- Look for the 🔌 icon to confirm connection

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
