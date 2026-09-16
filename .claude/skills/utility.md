---
description: 'CSS utility class creation and updates. Use when adding, modifying, or checking Dialtone CSS utilities (d-* classes). Covers Less file structure, token references, and verification.'
---

# CSS Utility Skill

## Utility File Structure

- Utilities live in `packages/dialtone-css/lib/build/less/utilities/`
- Each `.less` file groups related utilities by CSS property type
- Built with gulp: `packages/dialtone-css/gulpfile.cjs`
- The output is a single monolithic CSS file (not tree-shakeable by default)

## Creating or Updating a Utility

Before adding or recommending a utility, check whether a primitive component already exposes the same concern. For example, use DtBox for token-backed container surface, spacing, sizing, positioning, logical insets, and z-index. Keep utilities for non-DtBox elements, responsive variants, calc coordinates, reset values, arbitrary coordinates, and local escape hatches.

### 1. Determine the Correct File

Match the CSS property to an existing `.less` file:

| Property Type                                                         | File                 |
| --------------------------------------------------------------------- | -------------------- |
| `display`, `position`, `overflow`, `opacity`, `visibility`, `z-index` | `layout.less`        |
| `margin`, `padding`                                                   | `spacing.less`       |
| `flex-*` properties                                                   | `flex.less`          |
| `grid-*` properties                                                   | `grid.less`          |
| `width`, `height`, `max-*`, `min-*`                                   | `sizing.less`        |
| `font-*`, `text-*`, `line-height`                                     | `typography.less`    |
| `color`                                                               | `colors.less`        |
| `background-*`                                                        | `backgrounds.less`   |
| `border`, `border-radius`                                             | `borders.less`       |
| `box-shadow`, `transform`, `transition`                               | `effects.less`       |
| `cursor`, `pointer-events`, `user-select`                             | `interactivity.less` |

All 11 files: `backgrounds.less`, `borders.less`, `colors.less`, `effects.less`, `flex.less`, `grid.less`, `interactivity.less`, `layout.less`, `sizing.less`, `spacing.less`, `typography.less`. Only create a new file if truly needed, and add it to the gulp build pipeline.

### 2. Follow Conventions

Naming conventions and token reference rules are in the path-scoped rules (auto-loaded when editing CSS files). Key pattern: `d-<property-shorthand><value>`. Always use `var(--dt-*)` tokens — never raw values.

Use the Dialtone MCP search tools (`search_tokens`, `search_utility_classes`) to find correct token names and check for existing utilities.

### 3. Check for Duplicates

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
- Color utilities are generated using OKLCH relative color syntax (`oklch(from var(...) l c h / var(--opacity-var, alpha))`). When debugging color utility output, expect this format rather than raw `var()` references. See `postcss/dialtone-generators.cjs` for the generation logic.
