---
paths:
  - "apps/dialtone-documentation/**"
---

# Documentation Site Rules

## Structure
VuePress 2 site at `apps/dialtone-documentation/docs/`. Pages organized under `components/`, `utilities/`, `tokens/`, `design/`.

## Sidebar Navigation
`docs/_data/site-nav.json` (~784 lines). Path-keyed objects (`"/components/"`, `"/utilities/"`, etc.) with `text`/`children`/`link` keys. Page links use `.html` suffix (e.g., `/components/avatar.html`); index pages use trailing slash (e.g., `/components/`). Items alphabetically ordered within groups. `"planned": true` marks upcoming items.

## Required Frontmatter
Every page needs: `title`, `description`, `status` (ready | new | beta | planned | deprecated). Optional: `thumb`, `storybook`, `figma_url`, `keywords`.

`status: new` and `status: beta` render a badge in both the sidebar (`SidebarItemRow.vue`) and the page header (`PageHeader.vue`) — see `docs/.vuepress/theme/constants/statusBadges.js` for the badge type/text mapping. `planned` shows in the sidebar only (the page itself isn't written yet) and disables the sidebar link. `deprecated` gets no badge from this mechanism; it's a plain status value only.

Set `combinator: DtComponentName` (not an inline `<component-combinator component-name="..." />` tag in the body) to embed the live component playground. `combinator` drives `LayoutBody.vue`'s layout: on narrower viewports it renders inline before the page content; at the `xxxl` breakpoint it docks into a sticky sidebar next to the docs, matching every other component page. An inline `<component-combinator>` tag still renders (the component is globally registered) but bypasses this layout entirely and never gets the sticky sidebar — always use the frontmatter key instead.

## Global Components
Components registered in `docs/.vuepress/client.js` are available in all markdown pages without imports. Check that file for the current list.

## Build & Verify
- Build: `pnpm nx run dialtone-documentation:build`
- Lint: `pnpm nx run dialtone-documentation:lint`
- After adding a page, add its sidebar entry in `site-nav.json` in correct alphabetical position
