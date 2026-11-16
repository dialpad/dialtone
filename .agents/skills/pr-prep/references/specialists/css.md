# CSS

Run when the diff changes `.less`, `.css` or `<style>` content. Dialtone's specificity rule is `.claude/rules/css-specificity.md`: aim for one class per selector.

- Compound modifiers and qualifying conditions go in `:where()`; the BEM class stays outside it. Element-type descendants are wrapped in `:where()`. Modifier overrides change custom properties, not specificity.
- Literal sizes or colours where a token exists. Use `--dt-layout-*`, `--dt-size-*`, `--dt-spacing-*` and `calc()`.
- Layout: content after the component overlapping it, end labels clipped, `overflow-wrap: anywhere` inside flex or grid, `position: absolute` without a positioned parent, `line-height` used as a height without `white-space: nowrap`.
- Repeated selector lists use Less variables.
- Utility classes: no new class whose output duplicates an existing one.
- Mechanical: no literal `&` in compiled CSS. If CSS was built from the reviewed head, `rg -n '&' <built css>`; any hit is a bug. Otherwise flag candidates in the scope diff (in review mode, the PR's diff, not the local checkout):
  `<scope diff> | awk '/^diff --git/{keep=/\.less$/} keep' | rg -n '^\+.*:(not|is|where)\([^)]*&[^)]*,'`
