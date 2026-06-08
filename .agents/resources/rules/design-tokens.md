# Design Token Rules

Apply to `packages/dialtone-tokens/**`.

## Hierarchy

- Base tokens define primitive values.
- Semantic tokens express purpose.
- Component tokens should reference semantic tokens rather than base palette values.

## Naming And Themes

- Use established `dtColor*`, `dtSpace*`, `dtFont*`, `dtShadow*`, `dtRadius*`, `dtSize*`, and related naming.
- New color/theme tokens need light and dark coverage for supported themes.
- Do not modify token build order without understanding `$metadata.json`.

## References

- Token references use curly-brace syntax such as `{dtColor.neutral.900}`.
- Check for circular or missing references.

## Verification

- Build tokens after token source changes.
- Check generated CSS and platform outputs when token changes affect shipped packages.
