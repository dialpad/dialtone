---
name: use-dialtone
description: Build or change UI in an app that uses Dialtone, Dialpad's design system. Use before choosing or changing Dialtone components, tokens, CSS utility classes, icons or usage patterns, and before writing custom CSS in a Dialtone app. Look things up with the Dialtone MCP server or CLI first, prefer existing components, utilities and tokens, and say when a lookup failed.
---

# Use Dialtone

## Look up before you write

Before choosing or changing Dialtone components, tokens, CSS utilities, icons or usage patterns, consult the available Dialtone lookup tools. Do not guess a component, prop, slot, event, token or class name.

With the Dialtone MCP server connected, follow the routing instructions it sends when it connects. In short:

| Need                         | Tool                                             |
| ---------------------------- | ------------------------------------------------ |
| A component and its full API | `search_components`, then `get_component`        |
| A design token               | `search_tokens`                                  |
| A utility class              | `search_utility_classes`                         |
| An icon                      | `search_icons`                                   |
| Guides and longer examples   | `search_documentation`, then `get_documentation` |

Search results are summaries and can leave details out. Fetch the selected component or documentation section before using it, and follow a result's continuation when it says there is more.

With CLI-only access, use the installed CLI from the application directory: start with `npm exec --no -- dialtone --help`, then the relevant command.

## Prefer what Dialtone already has

Pick the first of these that fits:

1. A component made for the job, such as `DtButton` instead of a styled `<button>`.
2. The primitives: `DtBox` for surface, padding, border, shadow and sizing; `DtStack` for direction, gap and alignment; `DtText` for typography.
3. Utility classes, for what the primitives do not cover: display, grid, flex children, positioning outside `DtBox`, or one small adjustment.
4. Custom CSS, only when none of the above fit, and then with design tokens (`var(--dt-*)`), never raw colors, sizes or spacing.

- **Color:** use semantic tokens such as `--dt-color-foreground-tertiary` or `--dt-color-surface-positive`. Base color tokens such as `--dt-color-purple-600` are deprecated: they don't follow brand or contrast modes.
- **Text:** use `DtText` with `variant` and `tone`, for example `<dt-text as="p" variant="body-sm" tone="tertiary">`. Avoid pairing separate font-size and line-height classes.
- **Direction:** use logical properties and classes (`padding-inline-end`, `d-pie-*`), not left and right.
- **Icons:** search with `search_icons` before deciding an icon is missing.

The Dialtone MCP server serves these rules, with more examples, as the `dialtone://client-rules` resource. Read it when your client can read MCP resources.

## Check your result

- The source and version a lookup returned match the project's installed Dialtone packages. Bundled documentation does not prove the installed version behaves the same.
- Every component, prop, token and class you used came from a lookup, not from memory.
- Any custom CSS uses tokens, and your summary says why no component, primitive or utility fit.
- The project's own linters pass, including the Dialtone ESLint and Stylelint plugins where the project has them.

## When lookup is unavailable

If the lookup tools are unavailable or fail, say so. Use the project's existing guidance and the public Dialtone documentation at <https://dialtone.dialpad.com>, mark details you could not verify, and do not invent Dialtone APIs or claim a lookup succeeded.
