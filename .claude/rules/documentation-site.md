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
Every page needs: `title`, `description`, `status` (ready | planned | deprecated). Optional: `thumb`, `image`, `storybook`, `figma_url`.

## Global Components
Components registered in `docs/.vuepress/client.js` are available in all markdown pages without imports. Check that file for the current list.

## Build & Verify
- Build: `pnpm nx run dialtone-documentation:build`
- Lint: `pnpm nx run dialtone-documentation:lint`
- After adding a page, add its sidebar entry in `site-nav.json` in correct alphabetical position
