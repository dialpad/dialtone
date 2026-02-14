# Sidebar Keyword Search Enhancement

## Overview

**Status:** Complete
**Created:** 2025-11-14
**Last Updated:** 2026-02-06

Add keyword search functionality to the sidebar navigation filter to improve discoverability. Users can find pages using alternative terms (e.g., searching "font" returns Type/Typography pages, searching "dialog" returns Modal).

## Goals

- Enable keyword-based search in sidebar navigation
- Improve page discoverability through alternative search terms
- Maintain backward compatibility with existing navigation structure
- Preserve current performance and user experience

## Non-Goals

- Full-text search across page content (only sidebar navigation)
- Search result ranking or relevance scoring
- Search analytics or tracking
- Multi-language keyword support

## Architecture

Keywords live in **page frontmatter**, not site-nav.json. A build-time bridge injects them into the sidebar config.

### Data flow

1. **Frontmatter** (authoring) — `keywords: [...]` arrays in each `.md` file
2. **Build-time bridge** — `_injectKeywordsFromFrontmatter()` in `theme/index.js` (line 139) reads all pages' frontmatter keywords and injects them into the sidebar config via `onInitialized` hook
3. **Runtime filtering** — `Sidebar.vue` (line 96-100) checks `item.keywords` alongside `item.text` during search

### Key files

- `apps/dialtone-documentation/docs/.vuepress/theme/index.js` — `_injectKeywordsFromFrontmatter()` build-time bridge
- `apps/dialtone-documentation/docs/.vuepress/theme/components/Sidebar.vue` — runtime filter (lines 87-116)
- Individual `.md` files — frontmatter `keywords` arrays

### Filter logic

```javascript
const itemMatches = item.text.toLowerCase().includes(term) ||
  (item.keywords?.some(keyword =>
    keyword.toLowerCase().includes(term)
  ) ?? false);
```

## Phase Completion Summaries

### Phase 1: Core Infrastructure — Complete

- Filter logic in `Sidebar.vue` updated to check `item.keywords` alongside `item.text`
- Build-time bridge in `theme/index.js` reads frontmatter keywords and injects into sidebar config
- No changes to site-nav.json required — keywords authored in frontmatter

### Phase 2: Keyword Population — Complete

**165 pages** now have keywords across all sections:

| Section | Coverage | Notes |
|---------|----------|-------|
| Components | 53/58 | Cross-design-system "also known as" names included |
| Foundations | 20/24 | Includes alternate spellings (e.g., "colour") |
| Guides | 10/15 | Content, accessibility, contributing |
| Tokens | 3/3 | |
| Utilities | 78/78 | Full coverage, per-page specific keywords |
| Dialtone (about) | 1/25 | Blog posts intentionally excluded |

### Phase 3: Quality Pass — Complete

- **Fixed 6 incorrect keyword entries** — removed terms stamped from category-level batch generation onto wrong pages (e.g., "border radius" on border color page, "opacity" on box-shadow page)
- **Removed ~80 redundant keywords** — terms that already match the sidebar display text and add no search value (e.g., "border color" on the "Border Colors" page)
- **Added cross-design-system names to 36 components** — terms from MUI, Ant Design, Chakra, Carbon, Fluent UI, iOS (e.g., "callout" for Notice, "disclosure" for Collapsible, "persona" for Avatar, "auto layout" for Stack)

## Keyword Selection Strategy

When adding keywords to pages, follow these principles:

1. **Don't repeat the title.** The filter already searches `item.text`. Keywords like "border color" on the "Border Colors" page are redundant.
2. **Cross-design-system names.** What other systems call this concept (e.g., "dialog" for Modal, "switch" for Toggle, "callout" for Notice).
3. **Alternative terms.** What a user might search when looking for this (e.g., "notification" for Toast, "popup" for Modal).
4. **Technical terms.** CSS property names, ARIA roles, HTML element names (e.g., "listbox" for Select Menu, "kbd" for Keyboard Shortcut).
5. **Alternate spellings.** British English variants (e.g., "colour" for Color pages).
6. **Component identifiers.** Vue component names and CSS class names (e.g., "DtButton", "dt-button", "d-button") — these don't appear in sidebar text so they add search value.
7. **Keep focused.** Aim for 3-8 highly relevant keywords per page.

## Open Questions — Resolved

- **Common misspellings?** Yes — include them (e.g., "colour"). Low cost, high value.
- **Keyword maintenance?** New pages should include keywords in the same PR. The frontmatter co-location makes this natural.
- **Case sensitivity?** The filter lowercases everything at runtime. Store keywords in whatever casing is readable.

## Remaining Gaps

These pages intentionally have no keywords:

- **Blog posts** (`dialtone/whats-new/posts/`) — not typically searched by keyword in sidebar
- **A few landing/index pages** (`components/index.md`, `guides/index.md`, etc.) — already discoverable by section name
- **5 components without keywords** — minor components or those where the name is self-descriptive enough
