---
title: Migrating Border-Radius Utility Classes to Logical Names
description: Physical directional border-radius utility classes (d-btr*, d-bbr*, d-blr*, d-brr*) are replaced by logical equivalents (d-bbsr*, d-bber*, d-bisr*, d-bier*). Numeric stop values are also standardized. ESLint auto-fix and migration script included.
---

## TLDR

- Physical directional border-radius utility classes (`d-btr*`, `d-bbr*`, `d-blr*`, `d-brr*`) are **removed**.
- Replaced by logical equivalents: `d-bbsr*` (block-start), `d-bber*` (block-end), `d-bisr*` (inline-start), `d-bier*` (inline-end).
- All-corners numeric classes (`d-bar6`, `d-bar8`, etc.) are replaced by token-stop-indexed names (`d-bar-350`, `d-bar-400`, etc.).
- Use the [ESLint rule](#eslint-rule) or [migration script](#migration-script) to update your code.

## Why Logical?

- **RTL and internationalization.** Logical names respect writing direction: `inline-start` means the start edge regardless of locale.
- **CSS alignment.** Matches CSS logical properties (`border-start-start-radius`, `border-end-end-radius`) that Dialtone already uses internally.
- **Consistency.** One naming convention across tokens, CSS utilities, and Vue components.

## Pair-Prefix Mapping

| Physical prefix | Logical prefix | Direction |
| --- | --- | --- |
| `btr` (top) | `bbsr` (block-start) | Top corners in LTR |
| `bbr` (bottom) | `bber` (block-end) | Bottom corners in LTR |
| `blr` (left) | `bisr` (inline-start) | Left corners in LTR |
| `brr` (right) | `bier` (inline-end) | Right corners in LTR |

## Numeric Stop Mapping

All-corners (`d-bar*`) and pair classes use the same stop scale:

| Old suffix | New stop | px value |
| --- | --- | --- |
| `0` | `0` | 0px |
| `1` | `100` | 1px |
| `2` | `200` | 2px |
| `4` | `300` | 4px |
| `6` | `350` | 6px |
| `8` | `400` | 8px |
| `12` | `450` | 12px |
| `16` | `500` | 16px |
| `24` | `550` | 24px |
| `32` | `600` | 32px |

## Examples

### All-corners numeric

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```html
<div class="d-bar6">...</div>
<div class="d-bar8">...</div>
<div class="d-bar12">...</div>
```

</div>
<div>

**After**

```html
<div class="d-bar-350">...</div>
<div class="d-bar-400">...</div>
<div class="d-bar-450">...</div>
```

</div>
</div>

### Top (block-start) pair

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```html
<div class="d-btr6">...</div>
<div class="d-btr-pill">...</div>
<div class="d-btr-circle">...</div>
```

</div>
<div>

**After**

```html
<div class="d-bbsr-350">...</div>
<div class="d-bbsr-pill">...</div>
<div class="d-bbsr-circle">...</div>
```

</div>
</div>

### Bottom (block-end) pair

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```html
<div class="d-bbr8">...</div>
<div class="d-bbr-pill">...</div>
<div class="d-bbr-circle">...</div>
```

</div>
<div>

**After**

```html
<div class="d-bber-400">...</div>
<div class="d-bber-pill">...</div>
<div class="d-bber-circle">...</div>
```

</div>
</div>

### Left (inline-start) pair

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```html
<div class="d-blr12">...</div>
<div class="d-blr-pill">...</div>
<div class="d-blr-circle">...</div>
```

</div>
<div>

**After**

```html
<div class="d-bisr-450">...</div>
<div class="d-bisr-pill">...</div>
<div class="d-bisr-circle">...</div>
```

</div>
</div>

### Right (inline-end) pair

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```html
<div class="d-brr16">...</div>
<div class="d-brr-pill">...</div>
<div class="d-brr-circle">...</div>
```

</div>
<div>

**After**

```html
<div class="d-bier-500">...</div>
<div class="d-bier-pill">...</div>
<div class="d-bier-circle">...</div>
```

</div>
</div>

### Mixed usage

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```html
<div class="d-p-200 d-bgc-primary d-bar8 d-bs-sm">
  <div class="d-btr6 d-bgc-moderate">Header</div>
  <div class="d-bbr-pill">Footer</div>
</div>
```

</div>
<div>

**After**

```html
<div class="d-p-200 d-bgc-primary d-bar-400 d-bs-sm">
  <div class="d-bbsr-350 d-bgc-moderate">Header</div>
  <div class="d-bber-pill">Footer</div>
</div>
```

</div>
</div>

## What's NOT Affected

- **All-corners keyword classes** (`d-bar-pill`, `d-bar-circle`, `d-bar-unset`) — unchanged.
- **Single-corner logical classes** (`d-bssr-*`, `d-bser-*`, `d-besr-*`, `d-beer-*`) — already logical, unchanged.
- **CSS custom properties** — no token renames in this migration.

## ESLint Rule

`deprecated-radius-utility-classes` flags all deprecated border-radius utility classes and auto-fixes them to their logical equivalents.

Add to your ESLint config:

```js
// eslint.config.js (flat config)
import dialtone from '@dialpad/eslint-plugin-dialtone';

export default [
  {
    plugins: { dialtone },
    rules: {
      'dialtone/deprecated-radius-utility-classes': 'warn',
    },
  },
];
```

Then run:

```bash
npx eslint --fix "src/**/*.vue"
```

**The rule handles:** `class="..."` static attributes, unquoted and single-quoted class attributes.

**Skipped:** Dynamic class bindings (`:class="..."`), class names built via string concatenation.

## Migration Script

`dialtone-migrate-border-radius` batch-transforms deprecated border-radius utility classes across your codebase.

### Preview Changes

```bash
npx dialtone-migrate-border-radius --dry-run --cwd ./src
```

### Apply Changes

```bash
npx dialtone-migrate-border-radius --cwd ./src
```

### Apply All Without Prompting

```bash
npx dialtone-migrate-border-radius --yes --cwd ./src
```

**The script handles:**

- `.vue`, `.md`, `.html`, `.js`, `.ts`, `.jsx`, `.tsx` files
- All-corners numeric renames (`d-bar6` → `d-bar-350`)
- Pair numeric renames (`d-btr8` → `d-bbsr-400`)
- Pair keyword renames (`d-btr-pill` → `d-bbsr-pill`)

**Skipped:**

- Already-migrated classes (e.g. `d-bar-350`, `d-bbsr-pill`)
- Classes embedded inside other class names (e.g. `foo-d-bar6`)
- Dynamic class bindings and string concatenation

## What Requires Manual Review

- **Dynamic class bindings.** Computed class names like `:class="{ ['d-btr-' + keyword]: true }"` or `:class="['d-blr-' + variant]"` cannot be rewritten by a static text replacement. Update the source data instead.
- **String concatenation.** Expressions like `` `d-btr-${rounded ? 'pill' : 'circle'}` `` are skipped. Replace with the new logical prefix (e.g. `d-bbsr-pill`, `d-bbsr-circle`).
