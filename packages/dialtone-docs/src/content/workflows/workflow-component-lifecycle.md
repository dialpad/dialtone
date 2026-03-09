---
type: workflow
category: workflows
keywords: [component-lifecycle, status, ready, beta, planned, deprecated, component-status, frontmatter, vuepress, dialtone-documentation]
ai_summary: How component status works in Dialtone — ready, beta, and planned values, where they are set, and how they appear on the doc site.
last_updated: 2026-03-04
related_packages: [dialtone-vue, dialtone-documentation]
---

# Component Lifecycle

Each component in the Dialtone documentation site has a `status` field in its frontmatter that reflects its implementation maturity. This status is surfaced on the public component status page and used by teams to decide whether a component is safe to adopt.

## Status Values

The `status` field in component markdown frontmatter (`apps/dialtone-documentation/docs/components/*.md`) accepts three values:

| Value | Meaning |
|-------|---------|
| `ready` | Stable and recommended for production use. Full CSS, Vue, and Figma implementations exist. |
| `beta` | In progress. Implementation exists but the API may still change. |
| `planned` | Not yet implemented. Appears in the status table to signal intent. |

There is currently no `deprecated` value in use — no components are formally deprecated in the current codebase.

## Where Status Is Set

Each component has a markdown file in `apps/dialtone-documentation/docs/components/`. The frontmatter controls status:

```yaml
---
title: Button
description: Buttons are interactive UI elements...
status: ready
thumb: true
image: assets/images/components/button.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-button--default
figma_url: https://www.figma.com/design/...
---
```

The fields that together determine full component readiness:

- `status` — CSS readiness: `ready`, `beta`, or `planned`
- `storybook` — Vue readiness: a valid URL means Vue is ready; the string `"planned"` means Vue is planned; absent means N/A
- `figma_url` or `figma` — Figma readiness: a URL means ready; absent or `"planned"` means planned or N/A

## Component Status Page

The `/components/status/` page in the documentation site displays a table of all components with their status across three platforms: CSS, Vue, and Figma.

The table is rendered by `ComponentHealthStatusTable.vue` using color-coded icons:

| Icon | Color | Meaning |
|------|-------|---------|
| Check circle | Green (`d-fc-success`) | Ready |
| Tools | Orange (`d-fc-warning`) | In progress / beta |
| Box select | Red (`d-fc-critical`) | Planned |
| Box | Gray (`d-fc-muted`) | N/A |

The status page is populated automatically from the frontmatter of all component markdown files during the VuePress build. No manual data entry is needed — updating the frontmatter is enough.

## Navigation: `planned: true`

In `apps/dialtone-documentation/docs/_data/site-nav.json`, some navigation entries have `"planned": true`:

```json
{
  "text": "Design Principles",
  "link": "/guides/design-principles/",
  "planned": true
}
```

This marks a **navigation item** (not a component) as not yet available. It is different from the component `status` field. The VuePress theme uses this flag to render the navigation entry in a disabled or visually distinct state in the sidebar.

## Lifecycle Stages in Practice

There is no formally documented promotion ceremony, but the implicit workflow is:

**Planned → Beta**

1. Component is scaffolded with the Yeoman generator (`pnpm exec yo dialtone`)
2. Initial Vue implementation and Storybook story added
3. CSS classes added to `dialtone-css`
4. Frontmatter updated: `status: beta`, `storybook:` URL added
5. PR merged to `staging`

**Beta → Ready**

1. Vue component API is stabilized (no more breaking prop changes expected)
2. Full Storybook coverage exists (default + variants stories)
3. Component documentation page is complete in VuePress
4. `figma_url` is populated
5. Accessibility tests pass
6. Frontmatter updated: `status: ready`
7. PR merged to `staging`

The transition to `ready` signals to consuming teams that the component API is stable and the component is safe to use in production.

## Current Counts (as of last updated)

- `ready` — 45 components
- `beta` — 6 components (Datepicker, Emoji Picker, Loader, Scrollbar, Scroller, Split Button)
- `planned` — 1 component

These counts reflect the state at last documentation update. The authoritative source is always the component status page at `dialtone.dialpad.com/components/status/`.

## The `new` Badge

Separate from `status`, component pages can show a "New" badge via `new: true` in frontmatter:

```yaml
---
title: Split Button
status: beta
new: true
---
```

This badge indicates the component was recently added. It is independent of lifecycle status — a component can be `ready` and also `new` immediately after graduating from beta.

## Recipes vs. Regular Components

Recipe components (compound components built from other Dialtone components) follow the same lifecycle model but live under `packages/dialtone-vue/recipes/` and have their own documentation pages. Their `status` field works identically.
