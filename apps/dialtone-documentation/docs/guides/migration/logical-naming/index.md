---
title: Migrating to Logical Naming for Slots, Props, and Events
description: Vue component APIs now use logical direction names (start/end/blockStart/blockEnd) instead of physical names (left/right/top/bottom/alpha/omega). Backward-compatible, with ESLint rule and migration script.
---

## TLDR

- Slots, props, prop values, and events now use **logical direction names**: `start`, `end`, `blockStart`, `blockEnd`.
- Physical names (`left`, `right`, `top`, `bottom`, `alpha`, `omega`) still work. This is **not a breaking change**.
- Use the [ESLint rule](#eslint-rule) or [migration script](#migration-script) to update your code.
- **Manual migration required**: The `#icon` slot on `dt-button`. See [below](#manual-migration-dt-button-icon-slot).

## Why Logical?

- **RTL and internationalization.** Logical names respect writing direction: `start` means the inline-start edge regardless of locale.
- **CSS alignment.** Matches CSS logical properties (`margin-inline-start`, `padding-block-end`) that Dialtone already uses internally.
- **Consistency.** One naming convention across tokens, CSS utilities, and Vue components.

## Examples

### Slots

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<dt-badge>
  <template #leftIcon>...</template>
</dt-badge>

<dt-item-layout>
  <template #left>...</template>
  <template #right>...</template>
  <template #bottom>...</template>
</dt-item-layout>

<dt-split-button>
  <template #alphaIcon>...</template>
  <template #omegaIcon>...</template>
</dt-split-button>
```

</div>
<div>

**After**

```vue
<dt-badge>
  <template #startIcon>...</template>
</dt-badge>

<dt-item-layout>
  <template #start>...</template>
  <template #end>...</template>
  <template #blockEnd>...</template>
</dt-item-layout>

<dt-split-button>
  <template #startIcon>...</template>
  <template #endIcon>...</template>
</dt-split-button>
```

</div>
</div>

### Props

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<dt-item-layout
  left-class="d-bgc-critical"
  right-class="d-bgc-warning"
  bottom-class="d-bgc-info"
/>

<dt-split-button
  alpha-active
  alpha-aria-label="Call"
  omega-disabled
/>
```

</div>
<div>

**After**

```vue
<dt-item-layout
  start-class="d-bgc-critical"
  end-class="d-bgc-warning"
  block-end-class="d-bgc-info"
/>

<dt-split-button
  start-active
  start-aria-label="Call"
  end-disabled
/>
```

</div>
</div>

### Prop Values

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<dt-button icon-position="left">
  ...
</dt-button>

<dt-root-layout sidebar-position="right" />
```

</div>
<div>

**After**

```vue
<dt-button icon-position="start">
  ...
</dt-button>

<dt-root-layout sidebar-position="end" />
```

</div>
</div>

### Events

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<dt-split-button
  @alpha-clicked="onPrimary"
  @omega-clicked="onSecondary"
/>
```

</div>
<div>

**After**

```vue
<dt-split-button
  @start-clicked="onPrimary"
  @end-clicked="onSecondary"
/>
```

</div>
</div>

## Manual Migration: dt-button #icon Slot

The `#icon` slot on `dt-button` is ambiguous: its position depends on the `iconPosition` prop. The migration tools skip this case. Replace `#icon` with the slot matching your intended position:

| iconPosition value | Replacement slot |
| --- | --- |
| `start` (default) | `#startIcon` |
| `end` | `#endIcon` |
| `blockStart` | `#blockStartIcon` |
| `blockEnd` | `#blockEndIcon` |

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<dt-button icon-position="start">
  <template #icon>
    <dt-icon name="phone" />
  </template>
  Call
</dt-button>
```

</div>
<div>

**After**

```vue
<dt-button icon-position="start">
  <template #startIcon>
    <dt-icon name="phone" />
  </template>
  Call
</dt-button>
```

</div>
</div>

## What's Affected

**Components:** [DtBadge](/components/badge.html), [DtButton](/components/button.html), [DtInput](/components/input.html), [DtTab](/components/tab-group.html), [DtSplitButton](/components/split-button.html), [DtItemLayout](/components/item-layout.html), [DtRootLayout](/components/root-layout.html)

**Recipes:** Callbox, Contact Centers Row, General Row, Top Banner Info, Grouped Chip

## ESLint Rule

`deprecated-physical-naming` flags all deprecated physical slot, prop, prop value, and event usage on Dialtone components.

Add to your ESLint config:

```js
// eslint.config.js (flat config)
import dialtone from '@dialpad/eslint-plugin-dialtone';

export default [
  {
    plugins: { dialtone },
    rules: {
      'dialtone/deprecated-physical-naming': 'warn',
    },
  },
];
```

## Migration Script

Run the migration helper from your project root:

```bash
npx dialtone-migration-helper --cwd ./src
```

Select **"physical-to-logical"** from the config list. This renames all unambiguous physical names to their logical equivalents across `.vue`, `.md`, `.html`, `.js`, `.ts`, `.jsx`, and `.tsx` files.

To apply changes without interactive confirmation:

```bash
npx dialtone-migration-helper --cwd ./src --force
```

**The script handles:** slot directives, prop names, prop values, and event listeners for all affected components.

**Skipped:** The `#icon` slot on `dt-button` (ambiguous), dynamic bindings, and script-block references.
