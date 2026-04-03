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

## Code Examples: Fenced Demo Blocks

Use fenced ` ```vue demo ` blocks for all new doc examples. A markdown-it plugin (`markdown-it-fenced-demo.js`) transforms them into `<code-example>` tags at build time, so the rendered output is identical — but the authoring experience is cleaner (no entity-encoding, no quote tracking).

### Info string variants

````md
<!-- Default: demo + code tabs -->
```vue demo
<dt-notice kind="base" title="Base title" />
```

<!-- Demo only (no code tab) -->
```vue demo-only
<dt-notice kind="base" title="Base title" />
```

<!-- Code only (no live preview) -->
```vue code-only
<dt-notice kind="base" title="Base title" />
```
````

### Directives (HTML comments inside the fenced block)

Directives configure the `<code-example>` output. Place them at the top of the block, before content.

| Directive | Purpose | Equivalent `<code-example>` prop |
| --- | --- | --- |
| `<!-- @wrapper -->` | Marks first element as demo-only layout wrapper | `data-demo-wrapper` on element |
| `<!-- @code -->` | Separator: above = live demo, below = code tab | `vueCode='...'` |
| `<!-- @bg classname -->` | Custom background class | `bgclass="classname"` |
| `<!-- @class name -->` | Custom CSS class on code-example | `class="name"` |
| `<!-- @demo-only -->` | Alias for `demo-only` info string | `only-show="demo"` |
| `<!-- @code-only -->` | Alias for `code-only` info string | `only-show="code"` |

Prefer the info string for `demo-only`/`code-only`. Use the directive form when combining with other directives.

### Common patterns

````md
<!-- Strip a layout wrapper from the code tab -->
```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="400">
  <dt-button> Place Call </dt-button>
  <dt-button importance="outlined"> Place Call </dt-button>
</dt-stack>
```

<!-- Show different code than what renders (interactive demo vs static code) -->
```vue demo
<dt-toggle v-model="isDisabled" />
<dt-button :disabled="isDisabled">Click</dt-button>
<!-- @code -->
<dt-button disabled>Click</dt-button>
```

<!-- Custom background -->
```vue demo
<!-- @bg d-bgc-primary -->
<dt-button>Click me</dt-button>
```
````

### When to use `<!-- @code -->` separator

Only use `<!-- @code -->` when the code tab must show something **genuinely different** from the demo:

**Valid reasons:**

- Demo uses a **custom example wrapper** (`<example-tabs>`, `<example-modal>`) — code shows real component markup
- Demo has **interactive page state** (v-model, toggles, event handlers) — code shows simplified static version
- Demo uses **v-for with page data** — code shows single static example
- Code uses **placeholder syntax** (`{props}`, `....`) for API reference
- Demo has **demo-only styling on child elements** — code shows clean API

**NOT valid reasons (drop the `<!-- @code -->`):**

- Demo is wrapped in a layout wrapper — use `<!-- @wrapper -->` instead
- Only difference is formatting, whitespace, or self-closing style

### Demo-only wrappers (`<!-- @wrapper -->`)

When a demo needs a layout wrapper (e.g., `<dt-stack direction="row">`) purely for visual arrangement but users shouldn't copy it, add `<!-- @wrapper -->`. The build plugin adds `data-demo-wrapper` to the first element, stripping it from the code tab.

- Use when the wrapper is purely for demo layout (direction, gap, alignment)
- Do NOT use when the wrapper is meaningful structure users should copy (e.g., stack.md's own examples, nested layout patterns)

### Rules

- Never use raw HTML with component CSS classes (e.g., `<div class="d-card">`) — always use the Vue component (`<dt-card>`)
- Use `<dt-stack>` for spacing wrappers — never `<div class="d-stack*">` or `<div class="d-flow*">` (deprecated)
- Layout utility classes like `d-w100p` and `d-d-grid` on wrapper `<div>` elements are fine
- Do NOT put empty lines inside fenced demo blocks — markdown-it splits the block at blank lines
- Use `<!-- @bg classname -->` for custom background

### Legacy patterns (still supported)

**`<code-example>` tag syntax** — the underlying component that fenced blocks compile to. Both syntaxes work and can coexist. Fenced blocks are preferred for new content. Run `node scripts/migrate-code-examples.mjs --dry-run` to preview migrating existing pages.

**`<code-well-header>` + `<code-example-tabs>`** — the oldest pattern. When using it:

- Add `ref="descriptiveName"` to the outermost element in `<code-well-header>`
- Bind `:htmlCode='() => $refs.refName'` — never static inline HTML strings
- Always include `showHtmlWarning`

### Pre-submission checklist

1. No static inline HTML strings (`htmlCode='<...`)
2. No raw HTML component classes in demo areas
3. `<!-- @code -->` separator only used when genuinely needed
4. Run: `node scripts/lint-doc-examples.mjs` — should pass with 0 violations

## Component Doc Pages (VuePress)

Required sections in order: overview, usage example, variants, props table, events table, slots table, accessibility notes. See `rules/documentation-site.md` for frontmatter and sidebar conventions.
