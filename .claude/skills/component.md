---
description: "Component creation and update pipeline. Use '/component create <name>' to scaffold a new component, or '/component update <name>' when modifying existing components. Also auto-activated when working on Vue components."
---

# Component Skill

## Creating a New Component (`/component create <name>`)

### 1. Check for Conflicts

Before scaffolding, verify the component name is available:

- Search `common/components_list.js` for existing entries with the same or similar name
- Search `packages/dialtone-vue/components/` for directory name collisions
- If a similar component exists, confirm with the user whether to extend it or create a new one

### 2. Scaffold Component Files

Read `.agents/resources/rules/vue-components.md` for the maintained API conventions,
file layout, constants naming and optional artifacts before scaffolding. The
component-local CLAUDE import supplies the same policy during component work.
Include appropriate ARIA attributes, keyboard behavior, observable Vitest tests
and interactive Storybook stories. Follow an existing component's `index.js`
for its barrel export pattern; do not create mandatory MDX or rename existing
files merely to match an example.

### 3. Update Barrel Exports

- Add export to `packages/dialtone-vue/index.js`
- Add component entry to `common/components_list.js`

### 4. CSS Styles

If the component needs custom styles:

- Create styles in `packages/dialtone-css/` using design tokens (`var(--dt-*)`)
- Never use raw color/spacing values

### 5. Documentation

- Create a VuePress documentation page under `apps/dialtone-documentation/docs/components/<name>.md`
- Keep the normal canonical export and live `<component-vue-api>` association on the public page. Add useful missing alternate names or interaction phrases in its frontmatter `keywords`; follow `.claude/rules/documentation-site.md` for keyword quality, compound pages and source/version qualification. Keywords are discovery evidence, never export aliases.
- Update sidebar navigation in `apps/dialtone-documentation/docs/_data/site-nav.json`
- Create `packages/combinator/src/variants/variants_<name>.js` and register it in `packages/combinator/src/variants/variants.js` when the component is supported in the playground. Follow `.claude/rules/combinator-variants.md`.

### 6. Verification

- Run tests: `pnpm nx run dialtone-vue:test -- --filter <name>`
- Build Vue package: `pnpm nx run dialtone-vue:build`
- Rebuild docs JSON: run `scripts/build-dialtone-vue-docs.mjs`
- Rebuild lookup data: `pnpm nx run-many -t build -p dialtone-cli dialtone-mcp-server`
- For a meaningful new keyword, record an alternate-term lookup and arrange adapter publication as `.claude/rules/documentation-site.md` describes.

---

## Updating an Existing Component (`/component update <name>`)

Follow steps 2-6 from create flow above, with these additions:

- Read the existing component **before** making changes
- Update JSDoc comments and constants file for any changed/added props, events, or sizes
- Add test cases for new/changed behavior; run existing tests for regressions
- Update Storybook stories/MDX and VuePress docs if API surface changed
- Update `packages/combinator/src/variants/variants_<component>.js` when props, slots, valid values, or visual defaults changed

---

## Common Checks

Path-scoped rules auto-load when editing component files. Key verification points:

- Props use `validator` not `validate`
- Constants exported and imported (no hardcoded strings)
- ARIA attributes, keyboard navigation, focus management
- Combinator variants stay in sync with public component API changes
