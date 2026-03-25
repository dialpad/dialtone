---
paths:
  - "packages/dialtone-icons/**"
---

# Icons Package Rules

## Source SVG Location

Source SVGs live in `packages/dialtone-icons/src/svg/icons/<category>/`. The 18 categories are: alerts, arrows, brand, brand-full-color, communication, controls, data, devices, editing, general, os, people, places, time, weather.

Standard icons use `12x12` viewBox. Full-color gradient icons in `brand-full-color/` may use `24x24`.

## SVG Preparation (Figma Export Cleanup)

Always source from the Figma component's **12px size** (size 100).

### Fill color normalization

The build pipeline only replaces these fill values with `currentColor`: `black`, `#000`, `#000000`, `#0D0C0F`, `#222`, `#222222`. Figma commonly exports `fill="#1C1C1C"` or other near-black hex values that will NOT be converted, causing icons to render as hardcoded colors instead of inheriting CSS color. **Normalize any non-standard dark fill to `fill="black"`.**

Full-color icons with gradient fills (`fill="url(#...)"`) are preserved as-is — do not normalize these.

### Fill-based only (no strokes)

Icons must use fills, not strokes. In Figma, run **"Outline Stroke"** before exporting to convert strokes to filled paths. Confirm no undesirable mangling occurred.

### Remove no-op clipPath wrappers

Figma adds `<g clip-path="url(#...)">` with a `<clipPath><rect width="12" height="12">` when "Clip content" is enabled on the frame. This clips to the full viewBox — a no-op. Strip the `<g>` wrapper, the `<defs>`, and the `<clipPath>`. This also avoids unnecessary `uniqueID` handling in the generated Vue component.

### Combine path elements

Multiple `<path>` elements with the same `fill` attribute should be combined into a single `<path>` by concatenating their `d` values (space-separated). **Exception:** paths with different gradient fills must remain separate.

### Required SVG attributes

The root `<svg>` must have: `width`, `height`, `viewBox`, `fill="none"`, `xmlns="http://www.w3.org/2000/svg"`.

## Build Pipeline

The gulp build (`gulpfile.cjs`) transforms source SVGs:

1. Strips `fill="none"` from `<svg>` tag
2. Replaces recognized fill colors with `fill="currentColor"`
3. Strips `width` and `height` from `<svg>` tag
4. Injects accessibility attributes: `aria-hidden`, `focusable`, `role`, `data-name`, `class`
5. Optimizes via svgmin (multipass)
6. Flattens category directories in dist output

Then `transformSVGtoVue.cjs` wraps processed SVGs into Vue components, adding `uniqueID` prefixing for gradient/clipPath IDs (SSR safety).

Build command: `pnpm nx run dialtone-icons:build`

## Generated Files (Never Edit Manually)

- `dist/svg/icons/*.svg` — processed SVGs
- `src/icons/*.vue` — Vue component sources
- `vue3/dist/`, `vue2/dist/` — compiled Vue 2/3 components
- `dist/icons.js` — icon name list
- `index.js` — barrel exports

Icon sizing uses the numeric scale: `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`.

## Keywords

Each icon needs keywords in `src/keywords-icons.json` for discoverability. Structure:

```json
{
  "categories": {
    "<category>": {
      "<icon-name>": ["keyword1", "keyword2"]
    }
  }
}
```

## Verification

After adding or updating icons:

1. Run `pnpm nx run dialtone-icons:build`
2. Check dist SVGs: mono icons have `fill="currentColor"`, gradient icons preserve gradients
3. Spot-check a generated `.vue` file in `src/icons/`
4. Validate rendering at `http://localhost:4000/design/icons/`
