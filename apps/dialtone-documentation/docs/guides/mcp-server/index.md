---
title: Dialtone MCP Server
description: Search Dialtone's design system with AI assistants using the Model Context Protocol
---

## What It Does

The Dialtone MCP Server provides AI assistants with real-time search access to:

- **3,315 CSS utility classes** - Find classes like `d-p8`, `d-d-flex`, `d-w100p`
- **5,691 design tokens** - Find tokens like `--dt-color-foreground-primary`, `--dt-space-400`
- **87 Vue components** - Discover `DtButton`, `DtModal` with full API documentation
- **594 icons** - Find icons like `bell-ring`, `arrow-up`, `calendar-plus`

### Smart Features

- **Filters deprecated items** - Automatically removes outdated classes and components
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

<DtNotice kind="info" title="Priority" :hideClose="true">

Project-scoped configuration overrides user-scoped. The `dialtone-mcp-server` command resolves from `node_modules/.bin/` first.

</DtNotice>

### User-Scoped (Personal Use)

Available across all your projects. Choose one method:

**Option A: Install in dedicated directory**

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

### HTTP Transport (Coming Soon)

Remote server deployment for enterprise use.

```bash
claude mcp add dialtone-http --transport http --scope user https://mcp.dialtone.dialpad.com
```

<DtNotice kind="info" title="Version Checking" :hideClose="true">

When the server starts, you'll see the current version. If outdated, follow the instructions shown to update.

</DtNotice>

## Search Tools

### Utility Classes

**Tool:** `search_utility_classes`

Find CSS utility classes to style HTML elements. Use when your query mentions CSS properties (padding, margin, display, flex) or values (8px, 100%, center, auto).

**Example queries:**

```
"padding 8px"       → d-p8, d-pt8, d-pr8, d-pb8, d-pl8, d-px8, d-py8
"display flex"      → d-d-flex, d-d-inline-flex
"width 100%"        → d-w100p
"margin top auto"   → d-mt-auto
"text align center" → d-ta-center
```

**Parameters:**
- `query` (required): CSS property and/or value
- `limit` (optional): Maximum results (1-50, default 15)

### Design Tokens

**Tool:** `search_tokens`

Find design tokens (CSS variables) from Dialtone's design system. Use when your query mentions token categories (color, space, font, size) or semantic names (primary, success, foreground, background).

**Example queries:**

```
"color foreground primary" → --dt-color-foreground-primary
"space 400"                → --dt-space-400, --dt-space-400-negative
"font family"              → --dt-font-family-body, --dt-font-family-expressive
"font weight bold"         → --dt-font-weight-bold
```

**Parameters:**
- `query` (required): Token category, name, or value
- `limit` (optional): Maximum results (1-50, default 15)

### Components

**Tool:** `search_components`

Find Vue components from Dialtone's component library with props, events, and slots. Use when your query mentions UI elements (button, modal, input, dropdown) or component names.

**Example queries:**

```
"button"   → DtButton, DtButtonGroup, DtBanner (29 results)
"modal"    → DtModal, DtBanner, DtDropdown (6 results)
"checkbox" → DtCheckbox, DtCheckboxGroup, DtRadio
```

**Returns:**
- Component name
- Description
- Props (name, type, default, description)
- Events (name, description)
- Slots (name, description)
- Import path

**Parameters:**
- `query` (required): Component name or UI element
- `limit` (optional): Maximum results (1-30, default 10)

### Icons

**Tool:** `search_icons`

Find icons from Dialtone's icon library and learn how to use icon components. Icons are imported from `@dialpad/dialtone-icons/vue3`, not `@dialpad/dialtone-vue`.

**Example queries:**

```
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
- `limit` (optional): Maximum results (1-50, default 20)

## Usage Examples

### Finding Styling Classes

When working on a component and need specific styling:

```
User: "What class adds padding 8px to all sides?"
Claude: [Uses search_utility_classes tool]
Result: d-p8 (padding: var(--dt-space-400) which equals 8px)
```

### Discovering Components

When building UI and unsure what components exist:

```
User: "What button components are available in Dialtone?"
Claude: [Uses search_components tool]
Result: DtButton, DtButtonGroup, DtIconButton with complete
        prop documentation, events, and usage examples
```

### Looking Up Tokens

When implementing designs and need exact token values:

```
User: "What's the primary foreground color token?"
Claude: [Uses search_tokens tool]
Result: --dt-color-foreground-primary
        Value: #1C1C1C (in light theme)
        Available in: dp-light, dp-dark themes
```

### Finding Icons

When adding icons to your interface:

```
User: "Show me all notification-related icons"
Claude: [Uses search_icons tool]
Result: bell, bell-ring, bell-off, bell-plus, bell-minus
        Import: import { IconBell } from '@dialpad/dialtone-icons/vue3'
```

## Configuration

### Updating the Server

The server checks for updates automatically on startup. If a new version is available, you'll see:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  Dialtone MCP Server Update Available
   Current: v1.2.0
   Latest:  v1.2.1

   To update:
   1. npm install -D @dialpad/dialtone-mcp-server@latest
   2. Restart this conversation
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
No action needed - npx always uses the latest version.

After updating, restart your Claude Code conversation to load the new version.

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

<DtNotice kind="warning" title="Important" :hideClose="true">

Project-scoped configuration overrides user-scoped. If you have both, the project-level `.mcp.json` takes precedence.

</DtNotice>

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

- [Getting Started with Dialtone](/guides/getting-started/) - Learn Dialtone basics
- [Utility Classes](/utilities/) - Browse all utility classes
- [Design Tokens](/tokens/) - Explore design tokens
- [Components](/components/) - Discover Vue components
- [Icons](/design/icons/) - View the icon library

---

<DtNotice kind="info" title="Developer Tip" :hideClose="true">

The MCP server is perfect for discovering Dialtone patterns while coding. Instead of searching documentation manually, simply ask your AI assistant about components, tokens, or utilities, and it will search for you in real-time.

</DtNotice>
