# CSS

Run when a diff changes styles or changes markup those styles depend on. Shared guidance: the Selectors section of `.agents/resources/rules/css-utilities.md`.

- Prefer a single flat selector when it preserves behavior and compatibility. Check whether the owning element or an existing component custom property can express the state more directly.
- Use `:where()` when a necessary condition should add zero specificity. Count selector parts outside it and verify what wins in the compiled CSS, including affected states and consumer overrides.
- When nesting or interpolation makes a selector ambiguous, check what the compiled selector actually matches. Less 4.6.4 can emit the wrong selector from `&` inside `:where()` under a selector-list parent, with no `&` left in the output.
- Literal sizes or colours where a token exists. Use `--dt-layout-*`, `--dt-size-*`, `--dt-spacing-*` and `calc()`.
- Layout: content after the component overlapping it, end labels clipped, `overflow-wrap: anywhere` inside flex or grid, `position: absolute` without a positioned parent, `line-height` used as a height without `white-space: nowrap`.
- Utility classes: no new class whose output duplicates an existing one.
