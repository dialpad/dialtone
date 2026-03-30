---
description: "Icon add and update pipeline. Use '/icon add <name>' to add a new icon, or '/icon update <name>' to update an existing icon's SVG."
---

# Icon Skill

Icon rules (SVG conventions, fill normalization, build pipeline details) are defined in `.claude/rules/icons.md` and auto-loaded when editing files in `packages/dialtone-icons/**`.

## Adding a New Icon (`/icon add <name>`)

### 1. Gather Information

- Ask the user for the **category** (one of: alerts, arrows, brand, brand-full-color, communication, controls, data, devices, editing, general, os, people, places, time, weather)
- Ask for the **SVG content** (should be exported from the 12px / size 100 Figma component)
- **Suggest keywords** inferred from the icon name and propose them to the user for confirmation. Split the kebab-case name into individual words, then add synonyms and related terms. For example: `alert-circle` → suggest "alert, circle, warning, caution, error"; `arrow-left` → suggest "arrow, left, direction, back, previous". Let the user confirm, modify, or add to the suggestions.

### 2. Validate and Clean the SVG

Apply the SVG preparation rules from `.claude/rules/icons.md`. For standard icons (not `brand-full-color`), check:

- viewBox is correct (`0 0 12 12` standard, `0 0 24 24` full-color)
- Required root attributes present (`width`, `height`, `viewBox`, `fill="none"`, `xmlns`)
- No stroke attributes on visible paths
- Fill colors normalized to `black` (not `#1C1C1C` or other hex)
- No no-op clipPath wrappers (Figma artifact)
- Paths combined where they share all attributes

For `brand-full-color` icons, only check viewBox and required root attributes — preserve all fills, gradients, and structure as-is.

### 3. Write the SVG File

Write to: `packages/dialtone-icons/src/svg/icons/<category>/<name>.svg`

File name must be **kebab-case**.

### 4. Add Keywords

Add an entry to `packages/dialtone-icons/src/keywords-icons.json` under the correct category, keeping them alphabetically sorted:

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

Apply the same checks as "Add" step 2.

### 3. Replace the SVG

Overwrite the source SVG file with the cleaned version.

### 4. Build

```bash
pnpm nx run dialtone-icons:build
```

### 5. Verify

Same as "Add" step 6. Additionally, compare the old and new dist SVGs to confirm the intended changes took effect.
