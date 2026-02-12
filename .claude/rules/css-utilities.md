---
paths:
  - "packages/dialtone-css/**"
---

# CSS Utility Rules

## File Location
Utilities live in `packages/dialtone-css/lib/build/less/utilities/`. Each `.less` file groups related utilities by CSS property type (display.less, spacing.less, flex.less, sizing.less, typography.less, color.less, borders.less, position.less, overflow.less, visibility.less, z-index.less).

## Naming Convention
Pattern: `d-<property-shorthand><value>` (e.g., `d-p8`, `d-d-flex`, `d-w100p`, `d-mt-auto`, `d-fs-200`).

Common shorthands: `d`=display, `p`=padding, `m`=margin (with `t/r/b/l/x/y`), `w`=width, `h`=height, `fw`=font-weight, `fs`=font-size, `c`=color, `bgc`=background-color.

## Token References — Mandatory
ALWAYS use `var(--dt-*)` custom properties. Never hardcode raw values.

```less
// CORRECT
.d-p8 { padding: var(--dt-space-400); }
// WRONG
.d-p8 { padding: 8px; }
```

## Responsive Variants
The `postcss-responsive-variations` plugin generates responsive variants (e.g., `sm:d-d-flex`). Breakpoints: `sm:480px`, `md:640px`, `lg:960px`, `xl:1264px`.

## Build & Verify
- Build: `pnpm nx run dialtone-css:build`
- Lint: `pnpm nx run dialtone-css:lint`
- Use `search_utility_classes` MCP tool to check for duplicates before adding new utilities.
