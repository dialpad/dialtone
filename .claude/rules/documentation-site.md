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

Every page needs: `title`, `description`, `status` (ready | planned | deprecated | new | beta). `new` and `beta` render a badge (see `docs/.vuepress/theme/constants/statusBadges.js`) — use `new` for a recently-shipped component, `ready` once it's no longer newsworthy. Optional: `thumb`, `image`, `storybook`, `figma_url`.

## Global Components

Components registered in `docs/.vuepress/client.js` are available in all markdown pages without imports. Check that file for the current list.

## Build & Verify

- Build: `pnpm nx run dialtone-documentation:build`
- Lint: `pnpm nx run dialtone-documentation:lint`
- After adding a page, add its sidebar entry in `site-nav.json` in correct alphabetical position

## Curated discovery keywords

Use page frontmatter `keywords` as the maintained source for alternate names or interaction phrases. Add a nonempty string array only when likely searches are not already covered; do not copy synonyms into component descriptions, export aliases, or agent API inventories. The site search and CLI/MCP discovery reuse these terms. CLI/MCP also recognize complete keyword phrases inside longer requests. Regular plural discovery does not require repeated keywords. Generic filler is not contextual evidence, and separate entries do not form a new phrase. Prefer distinctive, useful concepts; avoid uninformative generic words or another component's name when that would mislead. Related concepts can remain when they help distinguish legitimate choices.

A public component page needs its normal exported identity and a live `<component-vue-api component-name="..." />` association. Keywords apply to the page's documented API components, including separately documented parts; companion-only imports do not inherit them. CSS patterns and directives must use their real identifiers and must not imply a nonexistent Vue component. Update associations when renaming, splitting, or removing components.

Run `pnpm nx run-many -t build -p dialtone-cli dialtone-mcp-server` to regenerate public docs, page associations and bundled lookup data. For a meaningful new synonym, record a representative `dialtone search "<term>" --bundled` and `dialtone docs "<term>" --bundled` against the rebuilt candidate, checking the leading supported subjects and any legitimate ambiguity. Selected API lookup still needs a canonical component name.

Documentation keywords are bundled latest references. Joining them to installed component data does not establish installed API compatibility or add absent components. A docs-only edit can reach the site before the adapters: their release commit selection watches adapters and query-core. Explicitly arrange CLI/MCP publication through the existing release process, then update the installed tools; a source merge or local build does not publish keywords.
