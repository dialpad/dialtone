---
title: Migrating Component Sizes to Numeric Scale
description: Component size props move from t-shirt labels (xs, sm, md) to a numeric ordinal scale (100, 200, 300). Extensible, predictable for humans and LLMs, backward-compatible. Migration tools included.
---

## TLDR

- Component `size` props now favor numeric values, e.g. `100` (xs), `200` (sm), `300` (md), `400` (lg), `500` (xl).
- T-shirt aliases still work — this is **not a breaking change**, and are marked to be sunset.
- Use the [ESLint rule](#eslint-rule) or [migration script](#migration-script) to update your code.
- **Unchanged**: Icon sizes.

## Why Numeric?

- **Extensible.** Need a size between `sm` and `md`? Use `250`. No naming gymnastics like "smedium."
- **Consistent.** Same 100-unit convention as `dt-spacing-*`, `dt-layout-*`, `dt-icon-size-*`, and color scales.
- **Predictable for humans, engineers, and LLMs.** Bigger number = bigger size. LLMs will have an easier time reasoning about ordinal relationships without needing a lookup table. T-shirt labels can't be consistently interpolated or composed by humans or AI.

## Examples

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<dt-button size="sm">
  ...
</dt-button>

<dt-text kind="headline" size="xl">
  ...
</dt-text>

<dt-input size="lg" label="Name" />
```

</div>
<div>

**After**

```vue
<dt-button :size="200">
  ...
</dt-button>

<dt-text kind="headline" :size="500">
  ...
</dt-text>

<dt-input :size="400" label="Name" />
```

</div>
</div>

## Size Mapping

| T-shirt | Numeric | Description |
| --- | --- | --- |
| `xs` | `100` | Extra small |
| `sm` | `200` | Small |
| `md` | `300` | Medium (default) |
| `lg` | `400` | Large |
| `xl` | `500` | Extra large |
| `2xl` | `600` | Text headline only |
| `3xl` | `700` | Text headline only |

## What's Affected

[DtButton](/components/button.html), [DtInput](/components/input.html), [DtSelectMenu](/components/select-menu.html), [DtSegmentedControl](/components/segmented-control.html), [DtText](/components/text.html), [DtToggle](/components/toggle.html), [DtChip](/components/chip.html), [DtCodeblock](/components/codeblock.html), [DtEmptyState](/components/empty-state.html), [DtSkeleton](/components/skeleton.html), [DtSplitButton](/components/split-button.html), [DtFilterPill](/components/filter-pill.html), [DtCombobox](/components/combobox.html), [DtComboboxMultiSelect](/components/combobox-multi-select.html), [DtComboboxWithPopover](/components/combobox-with-popover.html), [DtTabGroup](/components/tab-group.html)

## What's NOT Affected

- **Icon sizes** (`dt-icon`, `dt-loader`, `dt-emoji`, `dt-progress-circle`) — already numeric, unchanged.
- **DtAvatar** — already migrated to numeric in a prior release.
- **CSS utility classes** — no changes. Numeric prop values map to the same CSS classes as before.

## ESLint Rule

`deprecated-tshirt-sizes` flags t-shirt size usage on Dialtone components and auto-fixes to numeric.

Add to your ESLint config:

```js
// eslint.config.js (flat config)
import dialtone from '@dialpad/eslint-plugin-dialtone';

export default [
  {
    plugins: { dialtone },
    rules: {
      'dialtone/deprecated-tshirt-sizes': 'warn',
    },
  },
];
```

Then run:

```bash
npx eslint --fix "src/**/*.vue"
```

**The rule handles:** `size`, `label-size`, `labelSize`, and `speed` props on `dt-*` and `Dt*` components.

**Skipped:** Dynamic bindings (`:size="computedValue"`), non-Dialtone components.

## Migration Script

`dialtone-migrate-tshirt-to-numeric` batch-transforms t-shirt sizes to numeric across your codebase.

### Preview Changes

```bash
npx dialtone-migrate-tshirt-to-numeric --dry-run --cwd ./src
```

### Apply Changes

```bash
npx dialtone-migrate-tshirt-to-numeric --cwd ./src
```

### Apply All Without Prompting

```bash
npx dialtone-migrate-tshirt-to-numeric --yes --cwd ./src
```

**The script handles:**

- `.vue`, `.md`, `.html`, `.js`, `.ts`, `.jsx`, `.tsx` files
- Multiline component tags
- Any prop ending in `size`, `Size`, `speed`, or `Speed` (future-proof)

**Skipped:**

- Already v-bound props (`:size="..."`)
- Non-Dialtone components
- Non-scale size props (`button-width-size`, `background-size`, `font-size`)

## Dynamic Bindings

The ESLint rule flags t-shirt literals inside dynamic bindings (`:size="'sm'"`, `:size="condition ? 'sm' : 'md'"`), but cannot auto-fix them. The migration script skips dynamic bindings entirely. Both require manual review.

### Ternary expressions

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<dt-button :size="isCompact ? 'sm' : 'md'" />
```

</div>
<div>

**After**

```vue
<dt-button :size="isCompact ? 200 : 300" />
```

</div>
</div>

### Computed properties

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```js
computed: {
  buttonSize () {
    return this.isLarge ? 'lg' : 'md';
  },
}
```

</div>
<div>

**After**

```js
computed: {
  buttonSize () {
    return this.isLarge ? 400 : 300;
  },
}
```

</div>
</div>

### Lookup maps

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```js
const sizeMap = {
  compact: 'sm',
  default: 'md',
  spacious: 'lg',
};
```

</div>
<div>

**After**

```js
const sizeMap = {
  compact: 200,
  default: 300,
  spacious: 400,
};
```

</div>
</div>

### Props from parent

If a parent component passes a t-shirt string to a child's `size` prop, update the parent — the child already accepts numeric.
