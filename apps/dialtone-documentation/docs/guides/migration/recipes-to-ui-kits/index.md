---
title: Migrating Recipes to UI Kits
description: Dialtone recipes have been deprecated and moved to the UI-Kits repository. Includes migration mappings and automated script.
---

## TLDR

- All `DtRecipe*` components are deprecated and moved to standalone UI-Kit packages.
- A few recipes have been upgraded to core Dialtone components.
- An automated migration script handles import rewrites, component renames, and CSS class changes.
- `DtRecipe*` components will remain until the next major Dialtone release but **will no longer receive updates**.

## New Packages

Each kit is individually published to npm and can be installed independently:

```bash
npm install @dialpad/callbarkit
npm install @dialpad/chatkit
npm install @dialpad/formkit
npm install @dialpad/navigationkit
npm install @dialpad/workflowkit
```

Storybook for UI-Kits: <https://uikits.dialpad.com/>

## Migration Mapping

| Old (DtRecipe) | New | Package |
|----------------|-----|---------|
| `DtRecipeComboboxMultiSelect` | `DtComboboxMultiSelect` | `@dialpad/dialtone` |
| `DtRecipeComboboxWithPopover` | `DtComboboxWithPopover` | `@dialpad/dialtone` |
| `DtRecipeMotionText` | `DtMotionText` | `@dialpad/dialtone` |
| `DtRecipeCallbarButton` | `DpCallbarButton` | `@dialpad/callbarkit` |
| `DtRecipeCallbarButtonWithPopover` | `DpCallbarButtonWithPopover` | `@dialpad/callbarkit` |
| `DtRecipeCallbarButtonWithDropdown` | `DpCallbarButtonWithDropdown` | `@dialpad/callbarkit` |
| `DtRecipeGroupedChip` | `DpGroupedChip` | `@dialpad/callbarkit` |
| `DtRecipeTopBannerInfo` | `DpTopBannerInfo` | `@dialpad/callbarkit` |
| `DtRecipeAttachmentCarousel` | `DpAttachmentCarousel` | `@dialpad/chatkit` |
| `DtRecipeMessageInput` | `DpMessageInput` | `@dialpad/chatkit` |
| `DtRecipeContactInfo` | `DpContactInfo` | `@dialpad/chatkit` |
| `DtRecipeEditor` | `DpEditor` | `@dialpad/chatkit` |
| `DtRecipeEmojiRow` | `DpEmojiRow` | `@dialpad/chatkit` |
| `DtRecipeFeedItemPill` | `DpFeedItemPill` | `@dialpad/chatkit` |
| `DtRecipeFeedItemRow` | `DpFeedItemRow` | `@dialpad/chatkit` |
| `DtRecipeContactCentersRow` | `DtContactCentersRow` | `@dialpad/navigationkit` |
| `DtRecipeContactRow` | `DtContactRow` | `@dialpad/navigationkit` |
| `DtRecipeGeneralRow` | `DtGeneralRow` | `@dialpad/navigationkit` |
| `DtRecipeGroupRow` | `DtGroupRow` | `@dialpad/navigationkit` |
| `DtRecipeUnreadPill` | `DtUnreadPill` | `@dialpad/navigationkit` |
| `DtRecipeCallbox` | `DtCallbox` | `@dialpad/navigationkit` |
| `DtRecipeSettingsMenuButton` | `DtSettingsMenuButton` | `@dialpad/navigationkit` |
| `DtRecipeIvrNode` | `DtIvrNode` | `@dialpad/workflowkit` |

CSS classes also change: `dt-recipe-*` → `dp-*`

## CSS Imports

Import the CSS for each kit you install:

```css
@import '@dialpad/callbarkit/vue3/css';
@import '@dialpad/chatkit/vue3/css';
@import '@dialpad/formkit/vue3/css';
@import '@dialpad/navigationkit/vue3/css';
@import '@dialpad/workflowkit/vue3/css';
```

## Timeline

- `DtRecipe*` components will remain available until the next major Dialtone release (Q2 2026), but **will no longer receive updates**
- Migrate before then to stay current with improvements and bug fixes

## Automated Migration Script

The Node.js script automatically updates your codebase — no manual find-and-replace needed. It handles:

- Import statement rewrites (splits `@dialpad/dialtone/vue3` imports into the correct new packages)
- PascalCase component name replacements in JS/TS/Vue script blocks
- Kebab-case component name replacements in Vue templates
- CSS class prefix changes (`dt-recipe-*` → `dp-*` / `dt-*`)

Download and run:

```sh
# Preview changes without writing files
curl -s https://raw.githubusercontent.com/dialpad/dialtone/staging/scripts/migrate-recipes-to-uikits.mjs | node - /path/to/your/project --dry-run

# Apply changes
curl -s https://raw.githubusercontent.com/dialpad/dialtone/staging/scripts/migrate-recipes-to-uikits.mjs | node - /path/to/your/project
```

After running, install the new packages your project needs and verify with your lint + test suite.

## What You Need to Do

1. `npm install` whichever UI Kit packages you need
2. Import the CSS for whichever packages you need
3. Run the migration script to migrate your project to the new components
4. Any changes you wish to make to `DtRecipe*` components should now be made in [dialpad-uikits](https://github.com/dialpad/dialpad-uikits) instead.
