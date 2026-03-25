---
description: "Icon add and update pipeline. Use '/icon add <name>' to add a new icon, or '/icon update <name>' to update an existing icon's SVG."
---

# Icon Skill

## Adding a New Icon (`/icon add <name>`)

### 1. Gather Information

- Ask the user for the **category** (one of: alerts, arrows, brand, brand-full-color, communication, controls, data, devices, editing, general, os, people, places, time, weather)
- Ask for the **SVG content** (should be exported from the 12px / size 100 Figma component)
- **Suggest keywords** inferred from the icon name and propose them to the user for confirmation. Split the kebab-case name into individual words, then add synonyms and related terms. For example: `alert-circle` → suggest "alert, circle, warning, caution, error"; `arrow-left` → suggest "arrow, left, direction, back, previous". Let the user confirm, modify, or add to the suggestions.

### 2. Validate the SVG

Run these checks on the provided SVG before writing:

- **viewBox**: Must be `0 0 12 12` (standard) or `0 0 24 24` (full-color only)
- **No strokes**: Check for `stroke` attributes on visible path elements — icons must be fill-based. If strokes are found, stop and tell the user to run "Outline Stroke" in Figma first
- **Fill colors**: Flag any fill value that is not `black` or `url(#...)`. Common Figma exports use `#1C1C1C` — normalize to `fill="black"`
- **No no-op clipPath**: If there is a `<clipPath>` containing a `<rect>` matching the viewBox dimensions (e.g., `width="12" height="12"` for a 12x12 icon), strip the `<g clip-path>` wrapper and the `<defs><clipPath>` block entirely
- **Combine paths**: If multiple `<path>` elements share the same `fill` attribute, combine them into a single `<path>` by concatenating `d` values. Exception: paths with different gradient fills must stay separate
- **Clean artifacts**: Remove unnecessary `<g>` wrappers, empty `<defs>`, redundant attributes
- **Required attributes**: Ensure root `<svg>` has `width`, `height`, `viewBox`, `fill="none"`, `xmlns`

### 3. Write the SVG File

Write the cleaned SVG to: `packages/dialtone-icons/src/svg/icons/<category>/<name>.svg`

File name must be **kebab-case**.

### 4. Add Keywords

Add an entry to `packages/dialtone-icons/src/keywords-icons.json` under the correct category:

```json
"<category>": {
  "<name>": ["keyword1", "keyword2"]
}
```

### 5. Build

```bash
pnpm nx run dialtone-icons:build
```

### 6. Verify

- Read the dist SVG at `dist/svg/icons/<name>.svg`
  - Mono icons: must have `fill="currentColor"` (not a hardcoded hex)
  - Gradient icons: gradient definitions must be preserved
- Spot-check the generated Vue component at `src/icons/<name>.vue`
- Remind the user to validate rendering at `http://localhost:4000/design/icons/`

---

## Updating an Existing Icon (`/icon update <name>`)

### 1. Locate the Existing Icon

Search for the icon in `packages/dialtone-icons/src/svg/icons/**/<name>.svg` to find its category directory. Read the current SVG to understand what's changing.

### 2. Validate and Clean

Apply the same validation and cleaning steps as "Add" step 2.

### 3. Replace the SVG

Overwrite the source SVG file with the cleaned version.

### 4. Build

```bash
pnpm nx run dialtone-icons:build
```

### 5. Verify

Same verification as "Add" step 6. Additionally, compare the old and new dist SVGs to confirm the intended changes took effect.

---

## Common Gotchas

- **`fill="#1C1C1C"`**: Figma's default near-black export color. NOT in the build pipeline's replacement list — will pass through as a hardcoded color. Always normalize to `fill="black"`.
- **No-op clipPath**: Figma adds `<clipPath><rect width="12" height="12">` when "Clip content" is enabled. This clips to the full canvas (a no-op) and adds unnecessary complexity to the Vue component build. Strip it.
- **Gradient paths can't be combined**: Each path referencing a different `fill="url(#...)"` must remain separate, even if the gradients are visually identical.
- **Full-color icons**: Go in `brand-full-color/` category. Gradient fills are preserved by the build pipeline, not replaced with `currentColor`.
