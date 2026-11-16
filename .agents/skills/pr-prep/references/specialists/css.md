# CSS

Run when the diff changes `.less`, `.css`, `<style>` or class lists. Dialtone's specificity rule is `.claude/rules/css-specificity.md`: aim for one class per selector.

- Compound modifiers and qualifying conditions go in `:where()`; the BEM class stays outside it. Element-type descendants are wrapped in `:where()`. Modifier overrides change custom properties, not specificity.
- Literal sizes or colours where a token exists. Use `--dt-layout-*`, `--dt-size-*`, `--dt-spacing-*` and `calc()`.
- Layout: content after the component overlapping it, end labels clipped, `overflow-wrap: anywhere` inside flex or grid, `position: absolute` without a positioned parent, `line-height` used as a height without `white-space: nowrap`.
- Repeated selector lists use Less variables.
- Utility classes: no new class whose output duplicates an existing one.
- Mechanical: no literal `&` in compiled CSS. Build the package, then `rg -n '&' <built css>`; any hit is a bug. Without a build, flag candidates with:
  `git diff "$BASE" -- '*.less' | rg -n '^\+.*:(not|is|where)\([^)]*&[^)]*,'`
