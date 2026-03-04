---
type: architecture
category: architecture
keywords: [vuepress, documentation, vue-docgen-api, component-documentation, json-data, frontmatter, useComponentTableData, dialtone-documentation, manual-docs, auto-generated]
ai_summary: How the Dialtone documentation system works across three layers: manual markdown, semi-auto JSON data files, and auto-generated Vue API docs.
last_updated: 2026-03-04
related_packages: [dialtone-vue, dialtone-css, dialtone-tokens, dialtone-icons, dialtone-documentation]
---

# Documentation System

The Dialtone documentation system at `apps/dialtone-documentation/` is a **VuePress 2** static site deployed to [dialtone.dialpad.com](https://dialtone.dialpad.com). It is built from three distinct documentation layers that serve different purposes and have different maintenance requirements.

## Three Documentation Layers

### Layer 1 — Manual Markdown

**Location:** `apps/dialtone-documentation/docs/`

Human-written markdown files organized into sections:

```
docs/
├── components/     # 57 component documentation pages
├── design/         # Colors, typography, icons, spacing
├── guides/         # Accessibility, contributing, content guidelines
├── utilities/      # CSS utility class documentation (12 categories)
├── tokens/         # Design token documentation
└── about/          # About pages and What's New
```

Each markdown file uses VuePress-specific frontmatter — these fields are **different** from the AI context frontmatter used in `packages/dialtone-docs/src/content/`:

```yaml
---
title: Button
description: Buttons are interactive UI elements...
status: ready          # ready | wip | deprecated
thumb: true            # show thumbnail in component listings
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-button
figma_url: https://www.figma.com/...
---
```

The `status` field drives the component status page. Pages marked `wip` or `deprecated` display a banner automatically via the custom theme.

Inside markdown files, authors use custom Vue components directly — VuePress renders them as interactive elements. See [Custom Base Components](#custom-base-components) below for the full list.

### Layer 2 — Semi-Automatic JSON Data Files

**Location:** `apps/dialtone-documentation/docs/_data/` (47 files)

Each component has a corresponding JSON file that holds its CSS classes and accessibility attributes:

```
_data/
├── button.json
├── avatar.json
├── checkbox.json
├── colors.json
└── ... (47 total)
```

A typical file structure:

```json
{
  "classes": [
    {
      "class": "d-btn",
      "applies": "Root element",
      "description": "Base button style."
    },
    {
      "class": "d-btn--primary",
      "applies": "Root element",
      "description": "Primary importance style."
    }
  ],
  "accessible": [
    {
      "item": "aria-label",
      "applies": "button element",
      "description": "Provides an accessible name when button has no visible text."
    }
  ]
}
```

These files are currently **hand-maintained**. They are not auto-generated from source. When a new CSS class or ARIA attribute is added to a component, the corresponding JSON file must be updated manually.

Data files are loaded at runtime by the `useComponentTableData` composable:

```javascript
// apps/dialtone-documentation/docs/.vuepress/composables/useComponentTableData.js
const { data, loading, error } = useComponentTableData('button', 'classes');
// Dynamically imports: docs/_data/button.json and returns the 'classes' array
```

The `ComponentClassTable` and `ComponentAccessibleTable` base components use this composable internally, so markdown authors only need to write:

```markdown
<ComponentClassTable componentName="button" />
<ComponentAccessibleTable componentName="button" />
```

### Layer 3 — Auto-Generated Vue API Documentation

**Location:** Generated to `packages/dialtone-vue/dist/component-documentation.json`

During every `nx run dialtone-vue:build`, the script `scripts/build-dialtone-vue-docs.mjs` runs `vue-docgen-api` against all Vue components and outputs a JSON file containing every component's props, events, slots, and methods extracted from JSDoc comments.

Source in a Vue component:

```javascript
export default {
  name: 'DtButton',
  props: {
    /**
     * The button importance style.
     * @values primary, outlined, clear, plain
     */
    importance: {
      type: String,
      default: 'primary',
    },
    /**
     * @deprecated Use `importance` instead.
     */
    type: String,
  },
}
```

The generator extracts this into `component-documentation.json`, which the VuePress theme loads globally on the client via Vue's `provide` / `inject` pattern:

```javascript
// apps/dialtone-documentation/docs/.vuepress/theme/client.js
const documentation = await import('@dialpad/dialtone-vue/component-documentation.json');
app.provide('dialtoneComponentsDocumentation', documentation.default);
```

Markdown authors then render the full API table with one line:

```markdown
<ComponentVueApi componentName="button" />
```

`ComponentVueApi` injects the provided documentation, finds the matching component by name, and renders props, events, and slots as formatted tables via `ComponentVueApiTable`.

**Deprecation handling:** Props marked `@deprecated` in JSDoc appear in the API table with a deprecation notice and the suggested alternative automatically.

## Custom Base Components

29 Vue components are registered globally in the VuePress client and can be used directly inside any markdown file. Key ones:

| Component | Purpose |
|-----------|---------|
| `<ComponentVueApi>` | Renders props, events, slots from auto-generated JSON |
| `<ComponentClassTable>` | Renders CSS classes from `_data/*.json` |
| `<ComponentAccessibleTable>` | Renders ARIA attributes from `_data/*.json` |
| `<code-well-header>` | Interactive live component preview with code |
| `<code-example-tabs>` | Tabbed HTML / Vue code display |
| `<dialtone-usage>` | Do / Don't usage sections |
| `<TokenTable>` | Design token display with live preview |
| `<UtilityClassTable>` | CSS utility class documentation |
| `<BaseColor>` | Color swatch display |
| `<CopyButton>` | Copy-to-clipboard for code samples |

## Navigation

**Navbar** — hardcoded in `apps/dialtone-documentation/docs/.vuepress/config.js`. To add a top-level nav item, edit that file.

**Sidebar** — driven by `apps/dialtone-documentation/docs/_data/site-nav.json`. Each entry maps a path to a label and optional children. Pages can be marked `"planned": true` to appear in the nav without a live page.

## VuePress Configuration

**File:** `apps/dialtone-documentation/docs/.vuepress/config.js`

Key settings:
- Dev server runs on port **4000** via `nx run dialtone-documentation:start`
- Bundler: Vite (via `@vuepress/bundler-vite`)
- SVG files loaded via `vite-svg-loader` (SVGO disabled to preserve SVG structure)
- Markdown anchors generated for `h1`–`h3` headings
- Path aliases: `@data` → `_data/`, `@baseComponents`, `@exampleComponents`, `@workspaceRoot`

## Build Flow

```
nx run dialtone-documentation:build

1. Parallel dependency builds (NX-orchestrated):
   ├── dialtone-tokens:build      → packages/dialtone-tokens/dist/
   ├── dialtone-css:build         → packages/dialtone-css/lib/dist/
   ├── dialtone-icons:build       → packages/dialtone-icons/dist/
   ├── dialtone-vue:build
   │   └── build-dialtone-vue-docs.mjs
   │       └── component-documentation.json
   └── combinator:build           → packages/combinator/dist/

2. VuePress build:
   ├── Parses all .md files in docs/
   ├── Extracts frontmatter (title, status, storybook, figma_url)
   ├── Loads _data/*.json for navigation and component data
   ├── Bundles with Vite
   └── Output: docs/.vuepress/dist/ (static HTML/CSS/JS)
```

The static output at `docs/.vuepress/dist/` is what gets deployed to [dialtone.dialpad.com](https://dialtone.dialpad.com).

## What This System Does Not Cover

This documentation system serves the **public-facing** site. It does not:

- Generate AI-context documentation for assistants working in the repository (that is `dialtone-docs`'s job)
- Provide structured search for AI tools (that is `dialtone-mcp-server`'s job)
- Document internal architecture, workflows, or development processes (this content directory)

For AI assistant context, see `packages/dialtone-docs/src/content/`. For MCP-based search, see `packages/dialtone-mcp-server/`.
