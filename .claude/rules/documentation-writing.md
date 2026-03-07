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

## HTML Code Examples Must Use Refs

In `<code-example-tabs>`, always use the ref-based pattern for `htmlCode`:

```html
<code-well-header>
  <dt-notice ref="baseExample" kind="base" title="Base title" />
</code-well-header>

<code-example-tabs
  :htmlCode='() => $refs.baseExample'
  vueCode='<dt-notice kind="base" title="Base title" />'
  showHtmlWarning />
```

- Add `ref="descriptiveName"` to the outermost rendered element inside `<code-well-header>`
- Bind `:htmlCode='() => $refs.refName'` — never use static inline HTML strings (`htmlCode='<div>...'`)
- Always include `showHtmlWarning` when using the ref pattern
- If a `<dt-stack>` or other wrapper surrounds multiple items, put the `ref` on the wrapper
- If there is no `<code-well-header>` (code-only snippet), omit `htmlCode` entirely

## Component Doc Pages (VuePress)

Required sections in order: overview, usage example, variants, props table, events table, slots table, accessibility notes. See `rules/documentation-site.md` for frontmatter and sidebar conventions.
