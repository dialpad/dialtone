# Icon Rules

Apply to `packages/dialtone-icons/**`.

## Source SVGs

- Add or update source SVGs under the correct `src/svg/icons/<category>/` location.
- Standard icons use the expected viewBox and inherit foreground color via generated `currentColor`.
- Preserve brand/full-color icon fills and gradients when appropriate.

## Keywords

- Update `packages/dialtone-icons/src/keywords-icons.json` when adding icons.
- Keep keywords useful for search and sorted with the existing structure.

## Generated Files

- Do not hand-edit generated icon components or platform resources.
- Build icons after source SVG or keyword changes.
