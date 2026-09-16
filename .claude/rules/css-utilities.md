---
paths:
  - 'packages/dialtone-css/**'
---

# CSS Utility Rules

## File Location

Utilities live in `packages/dialtone-css/lib/build/less/utilities/`. The 11 files: `backgrounds.less`, `borders.less`, `colors.less`, `effects.less`, `flex.less`, `grid.less`, `interactivity.less`, `layout.less`, `sizing.less`, `spacing.less`, `typography.less`.

## Naming Convention

Pattern: `d-<property-shorthand><value>` (e.g., `d-p8`, `d-d-flex`, `d-w100p`, `d-mt-auto`, `d-fs-200`).

Common shorthands: `d`=display, `p`=padding, `m`=margin (with `t/r/b/l/x/y`), `w`=width, `h`=height, `fw`=font-weight, `fs`=font-size, `c`=color, `bgc`=background-color.

Before adding or recommending utilities, check whether a primitive component already exposes the same concern. Use DtBox for token-backed container surface, spacing, sizing, positioning, logical insets, and z-index. Keep utilities for non-DtBox elements, responsive variants, calc coordinates, reset values, arbitrary coordinates, and local escape hatches.

## Color Utilities

Color utilities use semantic tokens, not base palette stops:

- `d-fc-*` (foreground) → `var(--dt-color-foreground-*)`
- `d-bgc-*` (surface) → `var(--dt-color-surface-*)`
- `d-bc-*` (border) → `var(--dt-color-border-*)`

Prefer semantic equivalents over base color utilities (e.g., `d-fc-critical` instead of `d-fc-red-600`). The ESLint rule `deprecated-base-color-classes` flags base color utility usage.

Generated color utilities use OKLCH relative color syntax for opacity support:

```css
.d-fc-primary {
  color: oklch(
    from var(--dt-color-foreground-primary) l c h / var(--fco, alpha)
  ) !important;
}
```

The `alpha` keyword preserves the source color's opacity when no opacity utility is applied. Opacity utilities (e.g., `d-fco50`) set the `--fco` / `--bgo` / `--bco` custom property to override it.

HSL channel variables (`--dt-color-*-h`, `-s`, `-l`, `-hsl`, `-hsla`) no longer exist.

## Token References — Mandatory

ALWAYS use `var(--dt-*)` custom properties. Never hardcode raw values.

```less
// CORRECT
.d-p8 {
  padding: var(--dt-space-400);
}
// WRONG
.d-p8 {
  padding: 8px;
}
```

## Responsive Variants

The `postcss-responsive-variations` plugin generates responsive variants (e.g., `sm:d-d-flex`). Breakpoints: `sm:480px`, `md:640px`, `lg:960px`, `xl:1264px`.

## Build & Verify

- Build: `pnpm nx run dialtone-css:build`
- Lint: `pnpm nx run dialtone-css:lint`
- Use `search_utility_classes` MCP tool to check for duplicates before adding new utilities.
