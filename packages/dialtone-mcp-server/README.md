# Dialtone MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that provides AI assistants with search access to Dialtone's design system: utility classes, design tokens, and Vue components.

## Quick Start

### 1. Build

From the monorepo root:

```bash
pnpm install
pnpm nx run dialtone-mcp-server:build
```

### 2. Test Interactively

Try out search queries (must be run from the package directory):

```bash
# Navigate to the package directory first!
cd packages/dialtone-mcp-server

# Then run the interactive tool
pnpm run interactive
```

Or use tsx directly from anywhere:
```bash
npx tsx packages/dialtone-mcp-server/interactive-search.ts
```

**Query Format:** Use keywords only, not questions.
- ✓ Good: `padding 8px`, `color primary`, `button`
- ✗ Bad: `how do I add padding?`, `what button component exists?`

Example session:
```
Select a search tool:
  1. Utility Classes
  2. Design Tokens
  3. Components

Enter 1, 2, or 3: 1

> padding 8px
Found 8 results:
  1. d-p8
  2. d-pt8
  3. d-pr8
  4. d-pb8
  ...
```

Type `help` for more examples, `switch` to change tools, `quit` to exit.

### 3. Configure with Claude Desktop

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

## Development

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
│       └── components.ts
├── build/                    # Compiled output
├── test-search.js           # Automated tests
├── interactive-search.js    # Interactive CLI tool
└── README.md
```

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

### Rebuild After Changes

```bash
pnpm nx run dialtone-mcp-server:build
```

## Troubleshooting

**MCP server not connecting:**
1. Verify `build/index.js` exists
2. Check the path in config is absolute (not relative)
3. Restart Claude Desktop completely
4. Check Claude Desktop logs for errors

**Test the server manually:**
```bash
node build/index.js
# Should print: "Dialtone MCP Server running on stdio"
# Press Ctrl+C to exit
```

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [Dialtone Docs](https://dialtone.dialpad.com)
- [Search Implementation Details](./SEARCH_REFERENCE.md)
