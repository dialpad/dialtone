# How Documentation Works in Dialtone

This document explains the complete documentation architecture, generation process, and structure of the Dialtone design system monorepo.

## Repository Structure

Dialtone is a **pnpm + NX monorepo** with the following high-level structure:

```
dialtone/
├── apps/                    # Deployable applications
│   └── dialtone-documentation/   # Public documentation site
├── packages/                # NPM publishable packages
│   ├── dialtone-css/       # CSS utility classes
│   ├── dialtone-vue/       # Vue 3 component library
│   ├── dialtone-tokens/    # Design tokens
│   ├── dialtone-icons/     # Icon library
│   ├── dialtone-emojis/    # Emoji assets
│   ├── dialtone-mcp-server/# MCP server for AI assistants
│   ├── eslint-plugin-dialtone/
│   ├── stylelint-plugin-dialtone/
│   ├── postcss-responsive-variations/
│   ├── language-server/    # Volar-based language tools
│   └── combinator/         # Component combinator tool
├── generator-dialtone/     # Yeoman generator for new packages
└── scripts/                # Shared build scripts
```

## Documentation Site Architecture

### Tech Stack

- **Static Site Generator:** VuePress 2.0
- **Bundler:** Vite
- **Framework:** Vue 3
- **Location:** `apps/dialtone-documentation/`
- **Output:** Static HTML/CSS/JS deployed to https://dialtone.dialpad.com

### Site Structure

```
apps/dialtone-documentation/docs/
├── .vuepress/
│   ├── config.js           # VuePress configuration
│   ├── theme/              # Custom Dialtone theme
│   ├── baseComponents/     # Base Vue components for docs
│   ├── exampleComponents/  # Component examples
│   ├── composables/        # Composables (e.g., useComponentTableData)
│   └── public/             # Static assets
├── _data/                  # JSON data files (47 files)
│   ├── button.json         # Button CSS classes, accessibility info
│   ├── avatar.json
│   └── ...
├── about/                  # About pages, What's New
├── components/             # Component documentation (57 MD files)
│   ├── button.md
│   ├── modal.md
│   └── ...
├── design/                 # Design guidelines
│   ├── colors/
│   ├── typography/
│   ├── icons/
│   └── ...
├── guides/                 # Usage guides
│   ├── accessibility/
│   ├── content/
│   └── contributing/
├── tokens/                 # Design token documentation
└── utilities/              # CSS utility class documentation
```

### Navigation & Sidebar

Navigation is configured in:
- **Top navbar:** `apps/dialtone-documentation/docs/.vuepress/config.js`
- **Sidebar:** `apps/dialtone-documentation/docs/_data/site-nav.json`

## Documentation Types & Generation Process

### 1. Manual Markdown Documentation (Human-Written)

**What:** Component guides, design principles, usage guidelines

**Location:** `apps/dialtone-documentation/docs/components/*.md`, `docs/design/*.md`, etc.

**Process:** 100% manually written by designers and engineers

**Example Structure:**
```markdown
---
title: Button
description: A button is an UI element which signals...
status: ready
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-button--default
figma_url: https://www.figma.com/design/...
---

<code-well-header>
  <dt-button> Place Call </dt-button>
</code-well-header>

## Usage
...

## Variants
...
```

**Frontmatter Fields:**
- `title`: Page title
- `description`: Meta description
- `status`: Component status (ready, wip, deprecated)
- `thumb`: Whether to show thumbnail
- `image`: Preview image path
- `storybook`: Link to Storybook example
- `figma_url`: Link to Figma design

**Custom Components Available in MD:**
- `<code-well-header>` - Interactive code examples
- `<code-example-tabs>` - HTML/Vue code tabs
- `<dialtone-usage>` - Do/Don't sections
- `<ComponentClassTable>` - Auto-loaded CSS class tables
- `<ComponentAccessibleTable>` - Accessibility info tables

### 2. Semi-Automatic: Data JSON Files

**What:** Structured data for CSS classes, accessibility information, component metadata

**Location:** `apps/dialtone-documentation/docs/_data/`

**Count:** 47 JSON files

**Process:** Currently **manually maintained**

**Example:** `button.json`
```json
{
  "classes": [
    {
      "class": "d-btn",
      "applies": "N/A",
      "description": "Base button style."
    },
    {
      "class": "d-btn--primary",
      "applies": ".d-btn",
      "description": "Primary button style."
    }
  ],
  "accessible": [
    {
      "item": "aria-label",
      "description": "Provides an accessible name when button has no text"
    }
  ]
}
```

**Usage in Documentation:**
```javascript
// Composable loads data dynamically
import { useComponentTableData } from '@composables';

// In component:
const { data } = useComponentTableData('button', 'classes');
// Renders table from button.json['classes']
```

**Components that use this data:**
- `ComponentClassTable.vue` - Renders CSS class tables
- `ComponentAccessibleTable.vue` - Renders accessibility tables

### 3. Automatic: Vue Component API Documentation

**What:** Props, events, slots, and method signatures extracted from Vue components

**Location:** Generated to `packages/dialtone-vue/dist/component-documentation.json`

**Process:** Fully automated using `vue-docgen-api`

**Trigger:** Runs automatically during Vue package build:
```bash
nx run dialtone-vue:build
```

**Build Configuration:**
```javascript
// packages/dialtone-vue/project.json
"build": {
  "commands": [
    "pnpm exec vite build",                        // Build Vue library
    "node ../../scripts/build-dialtone-vue-docs.mjs"  // Generate API docs
  ]
}
```

**Generation Script:** `scripts/build-dialtone-vue-docs.mjs`
```javascript
import { parse } from 'vue-docgen-api';

// Scans all Vue components
const fileList = [
  ...getValidFileList(dialtoneVueRootFolder + '/components'),
  ...getValidFileList(dialtoneVueRootFolder + '/recipes'),
];

// Parses each component's API
fileList.forEach(filePath => {
  parsedDocumentationPromises.push(parse(filePath, config));
});

// Writes to dist/component-documentation.json
```

**What Gets Extracted:**
- Component name and display name
- Props (name, type, default, description from JSDoc)
- Events (name, arguments, description)
- Slots (name, scoped props, description)
- Methods (public methods with JSDoc)
- Deprecation metadata

**Source of Information:**
The parser reads JSDoc comments in Vue components:
```vue
<script>
export default {
  name: 'DtButton',
  props: {
    /**
     * The button importance style
     * @values primary, outlined, clear
     */
    importance: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'outlined', 'clear'].includes(value),
    }
  }
}
</script>
```

## Build Process & Commands

### Development

**Start Documentation Site:**
```bash
nx run dialtone-documentation:start
```

This:
1. Builds dependencies (CSS, tokens, Vue, icons, combinator)
2. Watches for changes in those packages
3. Starts VuePress dev server at `http://localhost:4000`

**Start Vue Storybook:**
```bash
nx run dialtone-vue:start
```
Runs at `http://localhost:9011/`

### Production Build

**Build Documentation Site:**
```bash
nx run dialtone-documentation:build
```

Output: `apps/dialtone-documentation/docs/.vuepress/dist/`

**Build Root Dialtone Package:**
```bash
nx run dialtone:build
```

This runs Gulp to copy built packages into `dist/` for publishing.

### Dependency Graph

```
dialtone-documentation:build
├── dialtone-css:build
├── dialtone-icons:build
├── dialtone-tokens:build
├── dialtone-vue:build
│   ├── dialtone-icons:build
│   └── build-dialtone-vue-docs.mjs (auto-generates API docs)
└── dialtone-combinator:build
```

NX handles this automatically - you just run the top-level command.

## AI-Specific Documentation & Tooling

### MCP Server (Model Context Protocol)

**Package:** `packages/dialtone-mcp-server/`

**Purpose:** Provides AI assistants (Claude, etc.) with searchable access to Dialtone

**Installation:**
```bash
npm install -D @dialpad/dialtone-mcp-server
```

**Configuration:** `.mcp.json` (root or project-level)
```json
{
  "mcpServers": {
    "dialtone": {
      "command": "dialtone-mcp-server"
    }
  }
}
```

**What It Provides:**
1. **Utility Class Search** - 3,315 CSS utility classes
2. **Design Token Search** - 5,691 design tokens (CSS variables)
3. **Component Search** - 87 Vue components with props/events/slots
4. **Icon Search** - 594 icons

**Example Queries:**
- `padding 8px` → d-p8, d-pt8, d-pr8, d-pb8, d-pl8
- `color foreground primary` → --dt-color-foreground-primary
- `button` → DtButton, DtButtonGroup, DtBanner
- `notification` → bell, bell-ring, bell-off icons

### Current State of AI Context Docs

**What Exists:**
- `.claude/` directory with custom commands
- `.mcp.json` configuration
- MCP server package with extensive search capabilities

**What's Missing:**
- No `CLAUDE.md` or `AI_CONTEXT.md` files
- No structured AI-friendly context documentation
- No package-specific AI guidance

## Package Management & Monorepo Tools

### PNPM

Used for all package management (installing, adding, removing packages).

**Install dependencies:**
```bash
pnpm install
```

**Add dependency to specific package:**
```bash
pnpm add <package> --filter <package-name>
pnpm add @dialpad/dialtone-tokens --filter dialtone-vue --workspace
```

### NX

Manages task execution, caching, and dependency orchestration.

**Run package script:**
```bash
nx run <package>:<target>
nx run dialtone-vue:build
nx run dialtone-documentation:start
```

**Benefits:**
- Automatic dependency detection and ordering
- Build caching (local and remote)
- Only rebuilds what changed
- Parallel execution where possible

**Important:** Always use `nx run` instead of `pnpm run` to get caching benefits.

### Clean Commands

```bash
pnpm clean           # Clean dist folders + NX cache
pnpm clean:dist      # Clean only dist folders
pnpm clean:cache     # Clean only NX cache
```

Use when:
- Switching branches
- Build behaves unexpectedly
- Recovering from interrupted builds

## Testing

### Vue Component Tests
```bash
nx run dialtone-vue:test              # Run tests
nx run dialtone-vue:test:coverage     # With coverage
```

### Visual Regression Tests
```bash
nx run dialtone-vue:test:visual       # Percy visual tests
```

### Accessibility Tests
```bash
nx run dialtone-vue:test:a11y         # Storybook a11y tests
```

## Publishing & Release

### Automated Release (Scheduled)

Every Tuesday at 10:00 AM UTC, the release workflow automatically:
1. Runs `semantic-release` on all packages
2. Creates release commits
3. Merges `staging` → `production`
4. Publishes to NPM with appropriate tags

### Manual Release

Trigger via GitHub Actions: https://github.com/dialpad/dialtone/actions/workflows/release.yml

**Production:**
1. Select `staging` branch
2. Select package to release (or leave empty for all)
3. Workflow runs release → merge → publish

**Alpha/Beta:**
1. Select `alpha` or `beta` branch
2. Select package to release
3. Workflow runs release → publish (no merge to production)

## Documentation Workflow for Contributors

### Adding a New Component

1. **Create Vue component** in `packages/dialtone-vue/components/`
   - Add comprehensive JSDoc comments for props/events/slots
   - Write unit tests

2. **Build generates API docs automatically** (props, events, slots)
   - Runs on `nx run dialtone-vue:build`
   - Output: `dist/component-documentation.json`

3. **Manually create documentation page** in `apps/dialtone-documentation/docs/components/`
   - Write `component-name.md` with usage examples
   - Add frontmatter (title, description, storybook link, etc.)
   - Include code examples with `<code-well-header>` and `<code-example-tabs>`

4. **Manually create data file** (if needed) in `apps/dialtone-documentation/docs/_data/`
   - Create `component-name.json` with CSS classes and accessibility info
   - Follow existing JSON structure

5. **Update navigation** in `apps/dialtone-documentation/docs/_data/site-nav.json`

6. **Test locally:**
   ```bash
   nx run dialtone-documentation:start
   ```

### Updating Existing Documentation

**For content changes:**
- Edit the `.md` file directly in `docs/components/`
- Changes are hot-reloaded in dev server

**For CSS classes or accessibility info:**
- Edit the corresponding JSON file in `docs/_data/`

**For component API (props/events/slots):**
- Update JSDoc comments in the Vue component source
- Rebuild: `nx run dialtone-vue:build`
- API docs regenerate automatically

## Key Files Reference

| File | Purpose |
|------|---------|
| `pnpm-workspace.yaml` | Defines workspace packages |
| `nx.json` | NX configuration |
| `project.json` (multiple) | Package-specific build targets |
| `apps/dialtone-documentation/docs/.vuepress/config.js` | VuePress config |
| `apps/dialtone-documentation/docs/_data/site-nav.json` | Site navigation |
| `scripts/build-dialtone-vue-docs.mjs` | Auto-generates Vue API docs |
| `gulpfile.cjs` | Root package bundling |
| `.mcp.json` | MCP server configuration |

## Common Issues & Solutions

### Documentation not updating
- Clear VuePress cache: `pnpm clean:dist`
- Restart dev server

### Component API not showing latest changes
- Rebuild Vue package: `nx run dialtone-vue:build`
- Check JSDoc comments are properly formatted

### CSS classes not showing in tables
- Verify JSON file exists in `docs/_data/`
- Check JSON structure matches expected format
- Ensure `ComponentClassTable` component is used correctly in MD

### Build failing
- Clean and rebuild: `pnpm clean && pnpm install`
- Check NX cache: `pnpm clean:cache`
- Verify dependencies are up to date

## Future Improvements Needed

### 1. Automate JSON Data File Generation
Currently manual. Need to extract CSS classes and accessibility info automatically from:
- CSS source files (for class lists)
- Vue component source (for accessibility attributes)

### 2. Add Comprehensive AI Context Documentation
Create structured docs for AI assistants working on this repo:
- Architecture overview
- Component development patterns
- CSS system documentation
- Token system documentation

### 3. Enhance MCP Server
Add general documentation search capability beyond the 4 existing specialized searches.

### 4. Prompt Library
Add prompt library section to documentation site for AI usage examples.

## Resources

- **Live Site:** https://dialtone.dialpad.com
- **Storybook:** https://dialtone.dialpad.com/vue/
- **GitHub:** https://github.com/dialpad/dialtone
- **NPM:** https://www.npmjs.com/package/@dialpad/dialtone
- **Contributing:** `.github/CONTRIBUTING.md`
