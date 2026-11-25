---
name: use-dialtone
description: Build or change UI in an app that uses Dialtone, Dialpad's design system. Use before choosing or changing Dialtone components, tokens, CSS utility classes, icons or usage patterns, and before writing custom CSS in a Dialtone app. Look things up with the Dialtone MCP server or CLI first, prefer existing components, utilities and tokens, and say when a lookup failed.
---

# Use Dialtone

## Look up before you write

Before choosing or changing Dialtone components, tokens, CSS utilities, icons or usage patterns, consult the available Dialtone lookup tools. Do not guess a component, prop, slot, event, token or class name.

With the Dialtone MCP server connected, use its tools this way (its connection instructions add detail):

- **You know the component:** call `get_component` directly and ask for the one field you need, such as `{ "component": "DtBox", "field": "padding" }`.
- **You don't know the name:** search first. Use `search_components` for components, `search_tokens` for tokens, `search_utility_classes` for utility classes and `search_icons` for icons. For guides and longer examples, use `search_documentation`, then `get_documentation` for the section you pick. Search results are summaries; read the selected component or section before relying on details.
- **Continuations:** follow one only when the item you need is not on the page you already have.

With CLI-only access, use the installed CLI from the application directory: start with `npm exec --no -- dialtone --help`, then the relevant command.

## Prefer what Dialtone already has

Pick the first of these that fits:

1. A component made for the job, such as `DtButton` instead of a styled `<button>`.
2. The primitives: `DtBox` for surface, padding, border, shadow and sizing; `DtStack` for direction, gap and alignment; `DtText` for typography.
3. Utility classes, for what the primitives do not cover: display, grid, flex children, positioning outside `DtBox`, or one small adjustment.
4. Custom CSS, only when none of the above fit, and then with design tokens (`var(--dt-*)`), never raw colors, sizes or spacing.

- **Color:** use semantic tokens such as `--dt-color-foreground-tertiary` or `--dt-color-surface-positive`. Base color tokens such as `--dt-color-purple-600` are deprecated: they don't follow brand or contrast modes. If no semantic token fits, ask a product designer before using a base color.
- **Text:** in Vue, use `DtText` with `variant` and `tone`, for example `<dt-text as="p" variant="body-sm" tone="tertiary">`. Outside Vue, use typography classes such as `d-text-body--md` or tokens such as `--dt-text-body-md`. Avoid pairing separate font-size and line-height classes.
- **Direction:** use logical properties and classes (`padding-inline-end`, `d-pie-*`), not left and right.

## Read results carefully

- **No match** means Dialtone has no such name. Rephrase the search once; if it still finds nothing, say so and use the next option in the list above. Never use a near-miss name.
- **Deprecated:** use the replacement the result names, in its logical form. For example, if a result points to the physical class `d-ml-100`, use the logical `d-mis-100`.
- **Bundled data:** when a result's source says `bundled`, say once in your summary that results come from bundled data and may differ from the installed version.

## Check your result

- Imports match what the project installs (check `package.json`): `@dialpad/dialtone/vue` for an app on `@dialpad/dialtone` (`/vue3` before 9.173), `@dialpad/dialtone-vue` for an app on that package. Bundled lookup hints always name `@dialpad/dialtone-vue`.
- Any custom CSS uses tokens, and your summary says why no component, primitive or utility fit.
- The project's own linters pass, including the Dialtone ESLint and Stylelint plugins where the project has them.

## When lookup is unavailable

If the lookup tools are unavailable or fail, say so. Use the project's existing guidance and the public Dialtone documentation at <https://dialtone.dialpad.com>, mark details you could not verify, and do not invent Dialtone APIs or claim a lookup succeeded.
