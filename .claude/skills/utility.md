---
description: "CSS utility class creation and updates. Use when adding, modifying, or checking Dialtone CSS utilities (d-* classes). Covers Less file structure, token references, and verification."
---

# CSS Utility Skill

## Utility File Structure

- Utilities live in `packages/dialtone-css/lib/build/less/utilities/`
- Each `.less` file groups related utilities by CSS property type
- Built with gulp: `packages/dialtone-css/gulpfile.cjs`
- The output is a single monolithic CSS file (not tree-shakeable by default)

## Creating or Updating a Utility

### 1. Determine the Correct File

Match the CSS property to an existing `.less` file:

| Property Type | File |
|---|---|
| `display` | `display.less` |
| `margin`, `padding` | `spacing.less` |
| `flex-*` properties | `flex.less` |
| `width`, `height`, `max-*`, `min-*` | `sizing.less` |
| `font-*`, `text-*`, `line-height` | `typography.less` |
| `color`, `background-color` | `color.less` |
| `border`, `border-radius` | `borders.less` |
| `position`, `top/right/bottom/left` | `position.less` |
| `overflow` | `overflow.less` |
| `opacity`, `visibility` | `visibility.less` |
| `z-index` | `z-index.less` |

If no match exists among the 11 files, check all files first. Only create a new file if truly needed, and add it to the gulp build pipeline.

### 2. Follow the Naming Convention

Pattern: `d-<property-shorthand><value>`

Examples:
- `d-p8` = `padding: var(--dt-space-400)` (8px via token)
- `d-d-flex` = `display: flex`
- `d-w100p` = `width: 100%`
- `d-mt-auto` = `margin-top: auto`
- `d-fs-200` = `font-size: var(--dt-font-size-200)`

Common property shorthands:
- `d` = display
- `p` = padding, `m` = margin (with `t/r/b/l/x/y` directional suffixes)
- `w` = width, `h` = height
- `fw` = font-weight, `fs` = font-size
- `c` = color, `bgc` = background-color

### 3. Reference Tokens — Never Use Raw Values

ALWAYS use `var(--dt-*)` CSS custom properties. Never hardcode colors, spacing, or font values.

```less
// CORRECT
.d-p8 { padding: var(--dt-space-400); }
.d-c-primary { color: var(--dt-color-foreground-primary); }

// WRONG — never do this
.d-p8 { padding: 8px; }
.d-c-primary { color: #1C1C1C; }
```

Token categories for reference:
- **Colors**: `var(--dt-color-foreground-*)`, `var(--dt-color-surface-*)`, `var(--dt-color-border-*)`
- **Spacing**: `var(--dt-space-400)` (scale: 0, 100, 200, 300, 400, 450, 500, 550, 600, 650, 700, 750, 800)
- **Typography**: `var(--dt-font-size-*)`, `var(--dt-font-weight-*)`, `var(--dt-font-family-*)`
- **Shadows**: `var(--dt-shadow-*)`

Use the Dialtone MCP search tools (`search_tokens`, `search_utility_classes`) to find the correct token name.

### 4. Check for Duplicates

Before adding a new utility:
- Search the `.less` files for existing classes that serve the same purpose
- Use `search_utility_classes` MCP tool to verify no existing utility already covers the case
- Check for aliases or shorthand variants that may already exist

### 5. Consider Responsive Variants

If the utility should be responsive at different breakpoints:
- The `postcss-responsive-variations` plugin generates responsive variants (e.g., `sm:d-d-flex`)
- This is opt-in per project — the plugin must be configured for the utility pattern
- Default breakpoints (mobile-first, `min-width`): `sm:480px`, `md:640px`, `lg:960px`, `xl:1264px`
- Note: not all utilities need responsive variants. Only add if there is a clear use case.

## Verification

After creating or updating a utility:

1. **Build CSS**: `pnpm nx run dialtone-css:build`
2. **Check output**: Verify the class appears in the built CSS output file
3. **Check MCP discoverability**: Use `search_utility_classes` to confirm the new utility is findable
4. **Test in context**: If the utility is for a specific component or page, verify it applies correctly

## Important Notes

- The CSS package ships as one monolithic file — every utility is included regardless of usage
- PurgeCSS (shipped as a Dialtone PostCSS plugin) is the recommended approach for tree-shaking unused utilities in consuming projects
- When adding utilities that pair with component styles, coordinate with the component skill to ensure consistency
