---
title: Migration Guide
description: Step-by-step guides for migrating to the latest Dialtone major version. Each guide covers what changed, why it changed, and how to update your code — including automated migration tools.
---

This guide walks you through every breaking and deprecation change in the upcoming Dialtone major release. Work through each section that applies to your codebase, run the provided migration tools, and verify the results.

> [!INFO] Automated tooling available
> Most migrations ship with CLI tools or ESLint auto-fix rules. Run them first, then handle the manual cases flagged in each guide.

## Migration Checklist

Work through each applicable guide in order. Guides earlier in the list are prerequisites for later ones (e.g. color stop renames before base-to-semantic).

### CSS and Design Tokens

| # | Guide | Breaking? | Tool | Summary |
| --- | --- | --- | --- | --- |
| 1 | [CSS Cascade Layers](./css-cascade-layers/) | No | — | All Dialtone CSS now uses `@layer`. No consumer changes required, but learn how to write overrides. |
| 2 | [Color Stops](./color-stops/) | **Yes** | `dialtone-migration-helper` | Base color ramps standardized to a 12-stop scale. Old stops removed. |
| 3 | [HSL to OKLCH](./hsl-to-oklch/) | **Yes** | `dialtone-migration-helper` | Color tokens moved from HSL to OKLCH. Per-channel breakout variables removed (~3,200 CSS vars). |
| 4 | [Base to Semantic Colors](./color-stops/#adopting-semantic-color-tokens) | Deprecation | `dialtone-migration-helper` | Upgrade base color utilities/tokens to theme-aware semantic equivalents. |
| 5 | [Layout & Spacing Tokens](./layout-and-spacing-tokens/) | **Yes** | `dialtone-migration-helper` | `--dt-size-*` becomes `--dt-layout-*`, `--dt-space-*` becomes `--dt-spacing-*`. |
| 6 | [Success to Positive](./success-to-positive/) | Deprecation | `dialtone-migration-helper` | `success*` design tokens and `d-fc-success*` / `d-bgc-success*` / `d-bc-success*` utility classes deprecated in favor of `positive*`. Includes ESLint and Stylelint rules. |

### Components

| # | Guide | Breaking? | Tool | Summary |
| --- | --- | --- | --- | --- |
| 7 | [Flex to DtStack](./flex-to-stack/) | Deprecation | `dialtone-migrate-flex-to-stack` | Replace `d-d-flex` utilities with the `<dt-stack>` component. |
| 8 | [Link and Button Navigation](./link-and-button-navigation/) | Deprecation | `dialtone-migrate-link-rendering` | DtButton and DtLink gain `to`/`href` props; `<a class="d-btn">` and `<router-link class="d-link">` workarounds replaced with components. DtLink `d-td-*` classes replaced by the `:underline` prop. |
| 9 | [Component Sizes to Numeric](./component-sizes/) | Deprecation | ESLint + `dialtone-migrate-tshirt-to-numeric` | `size="sm"` becomes `:size="200"` across all components. |
| 10 | [Avatar Updates](./avatar-updates/) | **Yes** | Manual (grep) | `DtAvatar` size prop moves to numeric, `iconSize` removed, group avatar behavior changed. |
| 11 | [Logical Naming](./logical-naming/) | Deprecation | `dialtone-migration-helper` | Slots, props, events: `left`/`right` becomes `start`/`end`. |
| 12 | [Recipes to UI Kits](./recipes-to-ui-kits/) | **Yes** | Migration script | `DtRecipe*` components move to standalone `@dialpad/` UI Kit packages. |
| 13 | [Component Props & Events](./component-props/) | **Yes** | `dialtone-migrate-props` | Value renames (including DtBox `surface`/`bc`, DtText `tone-strong`, DtButton `link-kind`), `show` becomes `open`, `hide-*` inversion, `title` becomes `header-text`, event/slot renames, `rootClass` removal. |

### Framework

| # | Guide | Breaking? | Tool | Summary |
| --- | --- | --- | --- | --- |
| 14 | [Vue 2 Removal](./vue2-removal/) | **Yes** | — | Vue 2 support dropped. Last Vue 2 version: `9.154.0`. |

## Quick Start

For most projects, run the automated tools in sequence. Each tool runs interactively by default — it will show you the files to be modified and ask for confirmation before applying changes. Add `--force` (migration-helper) or `--yes` (other scripts) to skip prompts.

```bash
# 1. Color stops (renames old stop numbers)
npx dialtone-migration-helper --cwd ./src
# Select "color stops"

# 2. HSL to OKLCH (removes channel breakout vars)
npx dialtone-migration-helper --cwd ./src
# Select "hsl-to-oklch"

# 3. Base to semantic colors
npx dialtone-migration-helper --cwd ./src
# Select "base to semantic"

# 4. Space to spacing tokens
npx dialtone-migration-helper --cwd ./src
# Select "space-to-spacing"

# 5. Size to layout tokens
npx dialtone-migration-helper --cwd ./src
# Select "size-to-layout"

# 6. Success to positive (tokens + utility classes)
npx dialtone-migration-helper --cwd ./src
# Select "success-to-positive"

# 7. Flex to Stack
npx dialtone-migrate-flex-to-stack --cwd ./src

# 8. Link and Button navigation (anchor/router-link to DtButton/DtLink)
npx dialtone-migrate-link-rendering --cwd ./src

# 9. T-shirt sizes to numeric
npx dialtone-migrate-tshirt-to-numeric --cwd ./src

# 10. Physical to logical naming
npx dialtone-migration-helper --cwd ./src
# Select "physical-to-logical"

# 11. Component props, events, and slots
npx dialtone-migrate-props --cwd ./src

# 12. ESLint auto-fix pass
npx eslint --fix "src/**/*.vue"
```

After running all tools, review terminal output for warnings about skipped cases that need manual attention. The size-to-layout migration also leaves inline `/* TODO: no --dt-layout-* … */` comments for tokens that exceed the layout scale.

## Need Help?

Reach out in the **#dialtone** Dialpad channel with any questions or issues.
