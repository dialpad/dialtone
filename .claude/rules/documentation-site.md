---
paths:
  - "apps/dialtone-documentation/**"
---

# Documentation Site Rules

## Structure
VuePress 2 site at `apps/dialtone-documentation/docs/`. Pages organized under `components/`, `utilities/`, `tokens/`, `design/`.

## Sidebar Navigation
`docs/_data/site-nav.json` (~784 lines). Items are alphabetically ordered within sections. URLs must end with trailing slash. `"planned": true` marks upcoming items.

## Required Frontmatter
Every page needs: `title`, `description`, `status` (ready | planned | deprecated). Optional: `thumb`, `image`, `storybook`, `figma_url`.

## Global Components
Components registered in `docs/.vuepress/client.js` are available in all markdown pages without imports. Check that file for the current list.

## Build & Verify
- Build: `pnpm nx run dialtone-documentation:build`
- Lint: `pnpm nx run dialtone-documentation:lint`
- After adding a page, add its sidebar entry in `site-nav.json` in correct alphabetical position
