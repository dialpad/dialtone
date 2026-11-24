# Design Token Rules

Apply to `packages/dialtone-tokens/**`.

## Hierarchy

- Base tokens define primitive values.
- Semantic tokens express purpose.
- Component tokens should reference semantic tokens rather than base palette values.

## Naming And Themes

- Base colors use `oklch(L C H)`. The `-h`, `-s`, `-l`, `-hsl` and `-hsla` variables no longer exist; do not reference them.
- Chromatic `color.*` palettes use 12 stops: 50, 100, 200 to 900 in hundreds, 950 and 1000. `color.black` and the `material.*` palettes in `tokens/base/refs/` keep 50-step stops (50 to 1000); `color.black` references them, for example `{material.sandstone.250}`.
- Use established `dtColor*`, `dtSpace*`, `dtFont*`, `dtShadow*`, `dtRadius*`, `dtSize*`, and related naming.
- New color/theme tokens need light and dark coverage for supported themes: check dark mode and add a `dark.json` override wherever the dark value differs.
- Do not modify token build order without understanding `$metadata.json`.

## References

- Token references use curly-brace syntax such as `{color.black.900}`, `{size.400}` or `{spacing.base}`.
- Check for circular or missing references.

## Verification

- Build tokens after token source changes.
- Check generated CSS and platform outputs when token changes affect shipped packages.
