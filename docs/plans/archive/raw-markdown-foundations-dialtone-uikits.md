# Raw Markdown Generation for Foundations, Dialtone, and UI-Kits

## Status: Complete

## Summary

Extended the raw markdown generation pipeline from components-only (56 pages) to also cover foundations (24 pages), dialtone (25 pages including blog posts), and ui-kits (4 pages) — 109 total files.

## Changes Made

### 1. `generate-raw-markdown.mjs` — multi-section recursive processing

- Added `SECTIONS` config array with four sections (components, foundations, dialtone, ui-kits)
- Added `walkDir()` recursive file discovery for nested directory structures
- Added `mapOutputPath()` to map `colors/index.md` → `colors.md` for nested sections
- Components section uses `flat: true` to preserve existing behavior (flat directory, skip index.md)

### 2. `parse-source-markdown.mjs` — new patterns

- Added `STYLE_BLOCK` state to strip `<style>` blocks (used in typography, size-and-space, themes pages)
- Added `heading:` frontmatter extraction as fallback for `title:` (used by blog posts)
- Added `author:` and `posted:` frontmatter extraction for blog posts
- Strip quotes from frontmatter values

### 3. `utils.mjs` — broader Vue component detection

- Changed `isStandaloneVueComponentLine` to treat any tag not in `KNOWN_HTML_TAGS` or `HANDLED_COMPONENTS` as a Vue component
- This catches `<overview>`, `<token-table>`, `<iframe>` (Figma embeds), `<svg-loader>`, `<BlogPost>`, etc.

### 4. `PageHeader.vue` — extend rawMarkdownUrl

- Replaced components-only regex with `RAW_SECTIONS` array matching all four sections
- URL mapping: strips trailing `/`, `/index.html`, or `.html`, prepends `/raw`, appends `.md`
