# CSS Utility Rules

Apply to `packages/dialtone-css/**`, especially `lib/build/less/utilities/**`.

## Location And Naming

- Utilities live in the established utility Less files: backgrounds, borders, colors, effects, flex, grid, interactivity, layout, sizing, spacing, typography.
- Use `d-<property-shorthand><value>` naming such as `d-p8`, `d-d-flex`, or `d-w100p`.
- Search existing utilities before adding a new one.

## Token Usage

- Use `var(--dt-*)` custom properties. Do not hardcode raw colors, spacing, radius, z-index, typography, or sizing values.
- Prefer semantic tokens where they exist.

## Responsive Variants

- `postcss-responsive-variations` generates responsive variants such as `sm:d-d-flex`.
- Add responsive behavior only when there is a clear use case.

## Verification

- Build CSS when utilities or component styles change.
- Verify new classes appear in generated output and are documented/discoverable when required.
