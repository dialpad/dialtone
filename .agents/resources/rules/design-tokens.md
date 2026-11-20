# Design Token Rules

Apply to `packages/dialtone-tokens/**`.

## Hierarchy

- Base tokens define primitive values.
- Semantic tokens express purpose.
- Component tokens should reference semantic tokens rather than base palette values.

## Naming And Themes

- Base colours use `oklch(L C H)`. The `-h`, `-s`, `-l` and `-hsl` variables no longer exist; do not reference them.
- Colour scale stops are 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 and 1000. Do not reference irregular stops such as 250 or 350.
- Use established `dtColor*`, `dtSpace*`, `dtFont*`, `dtShadow*`, `dtRadius*`, `dtSize*`, and related naming.
- New color/theme tokens need light and dark coverage for supported themes.
- Do not modify token build order without understanding `$metadata.json`.

## References

- Token references use curly-brace syntax such as `{color.black.900}`, `{size.400}` or `{spacing.base}`.
- Check for circular or missing references.

## Verification

- Build tokens after token source changes.
- Check generated CSS and platform outputs when token changes affect shipped packages.
