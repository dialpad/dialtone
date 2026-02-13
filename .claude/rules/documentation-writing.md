---
paths:
  - "docs/**"
  - "apps/dialtone-documentation/docs/**"
  - "*.md"
---

# Documentation Writing Rules

## Use Exact Names — Never Generic Terms
- Package names: `@dialpad/dialtone-vue`, `dialtone-css`, `dialtone-tokens` — never "our library" or "the package"
- Component names: `DtButton`, `DtModal`, `DtInput` — never "the button component"
- Tool names: VuePress, pnpm, Nx, vue-docgen-api, Vitest — never "our build tool" or "the test framework"
- File paths: `packages/dialtone-vue/components/` — never "the components folder"

## Code Examples Must Be Complete
- Include imports, setup, and realistic variable names
- Show runnable code, not pseudo-code
- Add language identifier to all fenced code blocks

## No Placeholder Content
- Never write TODO, TBD, "Coming soon", or empty sections
- If content isn't ready, omit the section entirely

## Component Doc Pages (VuePress)
Required sections in order: overview, usage example, variants, props table, events table, slots table, accessibility notes. See `rules/documentation-site.md` for frontmatter and sidebar conventions.
