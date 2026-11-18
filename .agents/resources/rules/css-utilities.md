# CSS Utility Rules

Apply to `packages/dialtone-css/**`, especially `lib/build/less/utilities/**`.

## Location And Naming

- Utilities live in the established utility Less files: backgrounds, borders, colors, effects, flex, grid, interactivity, layout, sizing, spacing, typography.
- Use token-stop naming such as `d-p-100`; other utilities include `d-d-flex` and `d-w100p`.
- Search existing utilities before adding a new one.
- Prefer primitive component props before utilities when a primitive already covers the concern. For example, use DtBox for token-backed container surface, spacing, sizing, positioning, logical insets, and z-index; keep utilities for non-DtBox elements, responsive variants, calc coordinates, resets, arbitrary coordinates, and local escape hatches.

## Selectors

- Prefer a single flat selector when it preserves behavior and compatibility. Check whether the owning element or an existing component custom property can express the state more directly.
- Use `:where()` when a necessary condition should add zero specificity. Count the selector parts outside it and verify what wins in the compiled CSS, including affected states and consumer overrides.

## Token Usage

- Use `var(--dt-*)` custom properties. Do not hardcode raw colors, spacing, radius, z-index, typography, or sizing values.
- Prefer semantic tokens where they exist.

## Responsive Variants

- `postcss-responsive-variations` generates responsive variants such as `sm:d-d-flex`.
- Add responsive behavior only when there is a clear use case.

## Verification

- Build CSS when utilities or component styles change.
- Verify new classes appear in generated output and are documented/discoverable when required.
