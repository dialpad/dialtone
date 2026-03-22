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

## Code Examples: Use `<code-example>`

Prefer the unified `<code-example>` component. The slot content is the single source of truth — a build-time plugin auto-extracts it as the Vue code tab.

```html
<!-- Default: demo + code tabs, auto-extracted -->
<code-example>
  <dt-notice kind="base" title="Base title" />
</code-example>

<!-- Demo only -->
<code-example only-show="demo">
  <dt-notice kind="base" title="Base title" />
</code-example>

<!-- Code only -->
<code-example only-show="code">
  <dt-notice kind="base" title="Base title" />
</code-example>

<!-- Override vueCode ONLY when the code tab genuinely differs -->
<code-example vueCode='<dt-button disabled>Click</dt-button>'>
  <dt-toggle v-model="isDisabled" />
  <dt-button :disabled="isDisabled">Click</dt-button>
</code-example>

<!-- Strip a demo-only layout wrapper from the code tab -->
<code-example>
  <dt-stack direction="row" gap="400" data-demo-wrapper>
    <dt-button> Place Call </dt-button>
    <dt-button importance="outlined"> Place Call </dt-button>
  </dt-stack>
</code-example>
```

### When to use `vueCode` override

Only add `vueCode` when the code tab must show something **genuinely different** from the slot:

**Valid reasons for override:**

- Slot uses a **custom example wrapper** (`<example-modal>`, `<example-popover>`, `<ExampleProfileCard>`) — code expands to real component markup
- Slot has **interactive page state** (v-model, toggles, event handlers) — code shows simplified static version
- Slot uses **v-for with page data** — code shows single static example
- Code uses **placeholder syntax** (`{{props}}`, `....`) for API reference
- Slot has **demo-only styling on child elements** (e.g., `d-bgc-moderate-opaque d-p16 d-bar8` on each child to make items visible) — code shows clean API

**NOT valid reasons (remove the vueCode):**

- Slot is wrapped in a clean `<dt-stack>` / `<div>` with layout props — the wrapper IS useful context
- Only difference is `class="d-w100p"` or similar layout constraint on the wrapper
- Only difference is formatting, whitespace, or self-closing style
- vueCode strips the wrapper but the inner components are identical

**Never:**

- Use `vueCode` with an empty slot — slot must always have content
- Self-close `<code-example />` — always use `</code-example>`
- Put empty lines inside `<code-example>` — markdown-it splits the block at blank lines, breaking source extraction

### Demo-only wrappers (`data-demo-wrapper`)

When a `<code-example>` slot needs a layout wrapper (e.g., `<dt-stack direction="row">`) purely for the demo but users shouldn't copy it, add `data-demo-wrapper` to that element. The build plugin strips the wrapper from the code tab, showing only its children.

- Use when the wrapper is purely for demo layout (direction, gap, alignment)
- Do NOT use when the wrapper is meaningful structure users should copy (e.g., stack.md's own examples, nested layout patterns)

### Rules

- Never use raw HTML with component CSS classes (e.g., `<div class="d-card">`) — always use the Vue component (`<dt-card>`)
- Use `<dt-stack>` for spacing wrappers — never `<div class="d-stack*">` or `<div class="d-flow*">` (deprecated)
- Layout utility classes like `d-w100p` and `d-d-grid` on wrapper `<div>` elements are fine
- Use `bgclass` prop for custom background: `<code-example bgclass="d-bgc-primary">`

### Legacy pattern (still supported)

The old `<code-well-header>` + `<code-example-tabs>` pattern still works. When using it:

- Add `ref="descriptiveName"` to the outermost element in `<code-well-header>`
- Bind `:htmlCode='() => $refs.refName'` — never static inline HTML strings
- Always include `showHtmlWarning`

### Pre-submission checklist

1. No static inline HTML strings (`htmlCode='<...`)
2. No raw HTML component classes in demo areas
3. `vueCode` override only used when genuinely needed
4. Run: `node scripts/lint-doc-examples.mjs` — should pass with 0 violations

## Component Doc Pages (VuePress)

Required sections in order: overview, usage example, variants, props table, events table, slots table, accessibility notes. See `rules/documentation-site.md` for frontmatter and sidebar conventions.
