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
| `<!-- @custom -->` | Bypasses default demo wrapper styles (padding, width, bg) | `custom` prop |
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

### Default: let auto-extraction handle the code tab

The build plugin automatically extracts the demo content as the code snippet. **Most blocks should not need `<!-- @code -->`** — if the demo IS what users should copy, just write the demo and the code tab takes care of itself.

Prefer static, copyable markup over dynamic Vue features (`v-for`, `:class` interpolation) in demos. Users see the code tab and expect to copy it. A `v-for` loop is not useful to copy. Expand loops into static elements instead.

### When to use `<!-- @code -->` separator

Only use `<!-- @code -->` when the code tab must show something **genuinely different** from the demo. Minimize its use — every `@code` block is a second source of truth that can drift.

**Valid reasons:**

- Demo uses a **custom example wrapper** (`<example-tabs>`, `<example-modal>`) — code shows real component markup
- Demo has **interactive page state** (v-model, toggles, event handlers) — code shows simplified static version
- Demo has `v-for` that **cannot be expanded** (data-driven visualizations with many entries, e.g., sizing stops) — code shows representative static examples
- Code uses **placeholder syntax** (`{props}`, `....`) for API reference
- Demo has **demo-only styling on child elements** (scaffolding colors, padding) — code shows clean API

**NOT valid reasons (drop the `<!-- @code -->`):**

- Demo content and code content are identical or nearly identical — let auto-extraction handle it
- Demo is wrapped in a layout wrapper — use `<!-- @wrapper -->` instead
- Only difference is formatting, whitespace, or self-closing style
- Demo has a `v-for` that could be expanded to static elements — expand it instead

### `<!-- @wrapper -->` — stripping layout scaffolding

When a demo needs a layout wrapper (e.g., `<dt-stack direction="row">`) purely for visual arrangement but users shouldn't copy it, add `<!-- @wrapper -->`. The build plugin strips the wrapper from the code tab, showing only its children.

- Use when the wrapper is purely for demo layout (direction, gap, alignment)
- Do NOT use when the wrapper carries the utility class being demonstrated (e.g., `<dt-stack class="d-ai-stretch">` in an align-items demo — the wrapper IS the demo)
- Do NOT use when the wrapper is meaningful structure users should copy (e.g., stack.md's own examples)

### `<!-- @custom -->` — bypassing default demo styles

Use `<!-- @custom -->` when the default demo wrapper styles (padding, width, background) interfere with the demo. Common in utility pages where the demo needs precise control over its container. Pair with `<!-- @class -->` to set explicit styles.

````md
```vue demo
<!-- @custom -->
<!-- @class d-d-block -->
<div v-dt-scrollbar:never class="d-bar8 d-bgc-secondary d-hmx-500">
  ...
</div>
```
````

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

## Notice Blocks (GFM Alerts → DtNotice)

Use GFM-style blockquote alerts to render `<dt-notice>` components. A markdown-it plugin (`markdown-it-notice.js`) transforms them at build time.

### Syntax

```md
> [!KIND] Optional title text
> Body text with **markdown** and [links](/path).
```

**KIND** must be one of: `BASE`, `INFO`, `SUCCESS`, `WARNING`, `ERROR` (case-insensitive, but uppercase is the convention — maps to DtNotice's `kind` prop).

The plugin always adds `hide-close` and `class="d-wmx100p d-my-200 dialtone-doc-notice"`. Links in the body automatically get `d-link` styling.

### Choosing a kind

| Kind | Use for | Example |
| --- | --- | --- |
| `INFO` | Supplementary context, tips, notes, browser support | "DtStack also accepts responsive props" |
| `WARNING` | Deprecations, migration nudges, "prefer X over Y" | "Use DtText over CSS utilities" |
| `ERROR` | Breaking changes, removed APIs, things that will fail | "The `leftIcon` prop is removed in v10" |
| `SUCCESS` | Confirmation of completion, positive outcomes | Rare in docs — use sparingly |
| `BASE` | Neutral notices that don't fit other kinds | Rare — prefer `INFO` in most cases |

### Examples

```md
> [!WARNING] Use DtText over CSS Utilities
> Reach for the [DtText](/components/text) component before considering any typography utility.

> [!INFO] Accessibility
> Always provide an `aria-label` when using icon-only buttons.

> [!ERROR] Breaking change
> The `leftIcon` prop is removed in v10. Use `startIcon` instead.
> See [migration guide](/guides/migration) for details.

> [!SUCCESS]
> A notice with no custom title — DtNotice uses its default for the kind.
```

### When to use

- **Prefer notice blocks** for deprecation warnings, breaking changes, migration guidance, prerequisites, and browser support notes
- **Use inline `<dt-notice>`** only when you need props not supported by the syntax (e.g., `important`, custom `role`, `action` slot), though this should be extremely rare if ever
- **Do not create shared notice wrapper components** (e.g., `<SomeFeatureNotice />`) — use the markdown syntax directly so the content is visible and editable in the markdown file
- Normal blockquotes (without `[!KIND]`) are unaffected and render as regular blockquotes

### When NOT to use

- **Don't use notices for ordinary prose.** If the information flows naturally in the surrounding text, it doesn't need a callout. Notices are for content that interrupts the flow — warnings, deprecations, prerequisites, breaking changes.
- **Don't stack multiple notices.** Two or more consecutive notices create visual clutter. Combine related information into a single notice, or restructure so only the most critical point gets a callout.
- **Don't use notices inside code example sections.** Place them before or after the example block, not between related examples.
- **Don't use `[!INFO]` as a default.** Choose the kind that matches the intent — most doc callouts are `WARNING` (deprecations, migration) or `ERROR` (breaking changes), not `INFO`.

## Component Doc Pages (VuePress)

Required sections in order: overview, usage example, variants, props table, events table, slots table, accessibility notes. See `rules/documentation-site.md` for frontmatter and sidebar conventions.
