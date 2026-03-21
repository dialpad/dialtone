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

### Rules

- Add `ref="descriptiveName"` to the outermost rendered element inside `<code-well-header>`
- Bind `:htmlCode='() => $refs.refName'` — never use static inline HTML strings (`htmlCode='<div>...'`)
- Always include `showHtmlWarning` when using the ref pattern
- If a `<dt-stack>` or other wrapper surrounds multiple items, put the `ref` on the wrapper
- If there is no `<code-well-header>` (code-only snippet), omit `htmlCode` entirely
- Never use raw HTML with component CSS classes (e.g., `<div class="d-card">`) inside `<code-well-header>` — always use the Vue component (`<dt-card>`)
- Use `<dt-stack>` for spacing wrappers — never `<div class="d-stack*">` or `<div class="d-flow*">` (these CSS utilities are deprecated)
- Layout utility classes like `d-w100p` and `d-d-grid` on wrapper `<div>` elements are fine (no Vue equivalent exists)

### Anti-patterns (DO NOT)

```html
<!-- BAD: static inline HTML string -->
<code-example-tabs
  htmlCode='<aside class="d-notice">...</aside>'
  vueCode='<dt-notice />'
  showHtmlWarning />

<!-- BAD: raw HTML component in code-well-header -->
<code-well-header>
  <div class="d-card d-w264">
    <div class="d-card__content">...</div>
  </div>
</code-well-header>

<!-- BAD: missing htmlCode when code-well-header exists -->
<code-well-header>
  <dt-notice kind="base" title="Base title" />
</code-well-header>
<code-example-tabs
  vueCode='<dt-notice kind="base" title="Base title" />' />
```

### Edge cases

- `text.md` intentionally omits htmlCode to discourage manual CSS — this is allowlisted
- `table.md` is CSS-only with fenced code blocks — no code-example-tabs
- When `vueCode` intentionally differs from `code-well-header` (simplified for copy-paste), keep vueCode as-is — the ref captures the actual rendered output
- Custom example wrappers (`<example-modal>`, `<example-toast>`) — put ref on the custom component
- Interactive state headers (toggles, v-model controls) — put ref on the inner content, not controls

### Pre-submission checklist

Before considering doc changes complete, verify:

1. Every `<code-example-tabs>` following a `</code-well-header>` has `:htmlCode='() => $refs.refName'`
2. The matching `<code-well-header>` contains `ref="refName"` on the outermost rendered element
3. No static inline HTML strings exist (`htmlCode='<...`)
4. `showHtmlWarning` is present on all ref-based blocks
5. No raw HTML component classes in `<code-well-header>` bodies
6. Run: `node scripts/lint-doc-examples.mjs` — should pass with 0 violations

## Component Doc Pages (VuePress)

Required sections in order: overview, usage example, variants, props table, events table, slots table, accessibility notes. See `rules/documentation-site.md` for frontmatter and sidebar conventions.
