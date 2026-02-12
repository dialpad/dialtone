# Raw Markdown Generation Pipeline for Component Docs

## Overview

**Status:** Complete
**Created:** 2026-02-06

Pre-build Node.js script that transforms component `.md` source files into clean GFM, output to `public/raw/` so VuePress serves them as static assets. Works in both dev server and production.

## Goals

- Generate fully-compliant GFM markdown for each component doc page
- Transform Vue components (`<code-example-tabs>`, `<component-vue-api>`, etc.) into static markdown equivalents
- Integrate as a pre-build step in the existing NX build pipeline
- Wire up the existing "View as Markdown" dropdown item in PageHeader.vue

## Non-Goals

- Non-component pages (guides, foundations, blog) — future work
- "Copy as Markdown" clipboard functionality — separate task
- "Open in Claude.ai" / "Open in ChatGPT" links — separate task

## Architecture

Source `.md` files → **Node.js transform script** → GFM `.md` files in `public/raw/`

A line-by-line state-machine parser reads each source file. Custom Vue components are detected and replaced with markdown equivalents using data loaded from JSON at build time. Standard markdown passes through untouched.

### Data flow

1. **Source** — `docs/components/*.md` (mixed markdown + Vue template syntax)
2. **Data** — `component-documentation.json` (Vue API) + `docs/_data/*.json` (CSS classes)
3. **Transform** — State machine replaces each Vue component pattern with GFM
4. **Output** — `docs/.vuepress/public/raw/components/*.md` → served at `/raw/components/{slug}.md`

### Key files

```
apps/dialtone-documentation/
  scripts/
    generate-raw-markdown.mjs           # Main entry point
    lib/
      parse-source-markdown.mjs         # State machine parser
      transform-code-example-tabs.mjs   # <code-example-tabs> → fenced code
      transform-vue-api.mjs             # <component-vue-api> → props/slots/events tables
      transform-class-table.mjs         # <component-class-table> → CSS class table
      transform-usage.mjs               # <dialtone-usage> → Do/Don't sections
      transform-html-table.mjs          # <table> → markdown table
      utils.mjs                         # Helpers (escape, cleanup, detection)
  docs/.vuepress/public/raw/components/ # Generated output (gitignored)
```

### Modified files

- `apps/dialtone-documentation/project.json` — pre-build step added to both `build` and `start` targets
- `apps/dialtone-documentation/docs/.vuepress/theme/components/PageHeader.vue` — `rawMarkdownUrl` computed property + `onViewAsMarkdown()` handler wired to "View as Markdown" list item
- `.gitignore` — `apps/dialtone-documentation/docs/.vuepress/public/raw/`

## Transformation Rules

| Source Pattern | Output |
| --- | --- |
| YAML frontmatter | Keep `title` + `description`, emit `# Title` heading |
| `<code-well-header>...</code-well-header>` | Remove (visual demo only) |
| `<code-example-tabs vueCode='...' />` | Fenced ` ```vue ` block (vueCode only, skip htmlCode) |
| `<component-vue-api component-name="X" />` | Markdown tables for Props, Slots, Events from `component-documentation.json` |
| `<component-class-table component-name="X">` | Markdown table from `_data/X.json` classes |
| `<dialtone-usage>` with `#do`/`#dont` slots | **Do:** / **Don't:** markdown sections |
| HTML `<table>` | GFM markdown table |
| `<script setup>` | Remove |
| HTML comments `<!-- -->` | Remove |
| Standalone Vue components (`<dt-*>`, `<ButtonVariantsTable>`, etc.) | Remove |
| Standard markdown (headings, lists, links, prose) | Pass through |
| Existing fenced code blocks | Pass through unchanged |

## Technical Details

### State machine parser

The parser processes line-by-line with these priority rules:
1. **Fenced code blocks** have highest priority — when inside `` ``` ``, all content passes through unchanged
2. State transitions are detected by line prefixes (e.g., `<code-well-header`, `<code-example-tabs`, `<script setup>`)
3. Multi-line components (`<code-example-tabs>`) accumulate lines until `/>` is found outside single-quoted attributes, then process as a single block

### `<code-example-tabs>` attribute extraction

The `vueCode='...'` values use single-quote delimiters. Vue template code inside always uses double quotes, so the parser tracks single-quote state to avoid false `/>` termination matches inside attribute values. Dynamic bindings (`:htmlCode="() => $refs[...]"`) are detected by the `:` prefix and skipped.

### Component name resolution

For `<component-vue-api component-name="avatar">`:
- Resolve `avatar` → `DtAvatar` via PascalCase conversion with `Dt` prefix
- Handle hyphenated names: `select-menu` → `DtSelectMenu`
- Match case-insensitively against `displayName` in `component-documentation.json`

### HTML table parsing

Uses depth-tracking approach to handle nested tags within `<td>` cells (common since source tables often contain Vue component demos inside cells). Strips all HTML tags from cell content, preserving text only.

### PageHeader.vue changes

```js
const rawMarkdownUrl = computed(() => {
  const match = page.value.path.match(/^\/components\/([^/.]+)/);
  if (!match) return null;
  return `/raw/components/${match[1]}.md`;
});
```

The "View as Markdown" list item uses `v-if="rawMarkdownUrl"` to only show on component pages, and `@click="onViewAsMarkdown(close)"` to open the raw file in a new tab.

## Results

- **56 component doc files** successfully transformed to clean GFM markdown
- **0 errors** during generation
- No Vue component tags outside fenced code blocks in output
- Output served at `/raw/components/{slug}.md` as static assets

## Verification

1. Run the script manually: `cd apps/dialtone-documentation && node scripts/generate-raw-markdown.mjs`
2. Inspect output files in `docs/.vuepress/public/raw/components/` — confirm clean GFM with no Vue tags
3. Start dev server (`vuepress dev docs`) — navigate to `/raw/components/avatar.md` directly in browser
4. Navigate to a component page, click "View as Markdown" — confirm it opens the raw `.md` file in a new tab
5. Spot-check `avatar.md`, `badge.md`, `button.md` output for correctness of tables, code blocks, and prose
