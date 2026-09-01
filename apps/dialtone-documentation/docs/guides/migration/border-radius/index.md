---
title: Migrating Border-Radius Utility Classes to Logical Names
description: Physical-direction and legacy pixel-suffixed border-radius utilities are deprecated in favor of logical names. ESLint auto-fix and a migration script are available.
keywords: ["rounded corners", "logical radius", "start end", "css utilities", "eslint", "codemod"]
---

> [!INFO] Deprecated aliases still render
> The legacy selectors still compile as aliases for the new utilities, so this migration should not change the rendered border radius. Update to the canonical classes now so your code is ready when the aliases are removed.

## TLDR

- Legacy all-corners numeric classes (`d-bar6`, `d-bar8`, etc.) are deprecated in favor of token-stop-indexed names (`d-bar-350`, `d-bar-400`, etc.).
- Legacy physical side-pair classes (`d-btr*`, `d-bbr*`, `d-blr*`, `d-brr*`) are deprecated in favor of logical side-pair classes (`d-bbsr*`, `d-bber*`, `d-bisr*`, `d-bier*`).
- Pair keywords migrate too: `d-btr-pill` to `d-bbsr-pill`, `d-brr-circle` to `d-bier-circle`.
- Run [dialtone-migrate-border-radius](#migration-script) for a radius-only batch migration, then use the [ESLint rule](#eslint-rule) to catch reintroductions in Vue templates.
- If you're already running `dialtone-migration-helper`, its `utility-class-to-token-stops` config covers these rewrites.

## Why Logical?

- **RTL and internationalization.** Logical names respect writing direction: `inline-start` means the start edge regardless of locale. In other words, `left` becomes `inline-start` in LTR.
- **CSS alignment.** The class names align with CSS logical properties such as `border-start-start-radius` and `border-end-end-radius`.
- **Token consistency.** Numeric suffixes now reference the `--dt-size-radius-{stop}` token scale instead of legacy pixel suffixes.

## What Changed

Border-radius utilities now use token stops and logical class roots. The generated CSS co-selects the legacy and new selectors, so both currently resolve to the same declaration, e.g...

```css
.d-bbsr-350,
.d-btr6 {
  border-start-start-radius: var(--dt-size-radius-350) !important;
  border-start-end-radius: var(--dt-size-radius-350) !important;
}
```

Single-corner utilities (`d-bssr-*`, `d-bser-*`, `d-besr-*`, `d-beer-*`) are also available. They have no legacy physical equivalent.

## Pair-Prefix Mapping

| Legacy physical prefix | New logical prefix | CSS properties | Visible side in LTR |
| --- | --- | --- | --- |
| `btr` (top) | `bbsr` (block-start) | `border-start-start-radius`, `border-start-end-radius` | Top |
| `bbr` (bottom) | `bber` (block-end) | `border-end-start-radius`, `border-end-end-radius` | Bottom |
| `blr` (left) | `bisr` (inline-start) | `border-start-start-radius`, `border-end-start-radius` | Left |
| `brr` (right) | `bier` (inline-end) | `border-start-end-radius`, `border-end-end-radius` | Right |

## Numeric Stop Mapping

All-corners classes and side-pair classes use the same radius stop scale:

| Old suffix | New stop | Value |
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

### All-Corners Numeric

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```html
<div class="d-bar6">...</div>
<div class="d-bar8">...</div>
<div class="d-bar24">...</div>
```

</div>
<div>

**After**

```html
<div class="d-bar-350">...</div>
<div class="d-bar-400">...</div>
<div class="d-bar-550">...</div>
```

</div>
</div>

### Top Pair to Block-Start Pair

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

### Bottom Pair to Block-End Pair

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

### Left Pair to Inline-Start Pair

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

### Right Pair to Inline-End Pair

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

### Mixed Usage

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

## What's Not Affected

- **All-corners keyword classes** (`d-bar-pill`, `d-bar-circle`, `d-bar-unset`) keep their names.
- **Already-logical side-pair classes** (`d-bbsr-*`, `d-bber-*`, `d-bisr-*`, `d-bier-*`) are already canonical.
- **Single-corner logical classes** (`d-bssr-*`, `d-bser-*`, `d-besr-*`, `d-beer-*`) are canonical and have no old physical equivalent.
- **CSS custom properties** are not renamed by this border-radius migration. This page covers utility classes.

## Migration Script

For radius-only migrations:

```bash
npx dialtone-migrate-border-radius --dry-run --cwd ./src
```

Apply the changes after reviewing the file list:

```bash
npx dialtone-migrate-border-radius --cwd ./src
```

Skip the confirmation prompt:

```bash
npx dialtone-migrate-border-radius --yes --cwd ./src
```

The script scans `.vue`, `.md`, `.html`, `.js`, `.ts`, `.jsx`, and `.tsx` files and rewrites literal class names in static attributes, string literals, object/array class bindings, and simple template literals:

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<template>
  <div class="d-bar6 d-btr8" />
  <div :class="{ 'd-bbr-pill': rounded }" />
</template>

<script setup>
const headerClass = `d-btr6 ${extraClass}`;
</script>
```

</div>
<div>

**After**

```vue
<template>
  <div class="d-bar-350 d-bbsr-400" />
  <div :class="{ 'd-bber-pill': rounded }" />
</template>

<script setup>
const headerClass = `d-bbsr-350 ${extraClass}`;
</script>
```

</div>
</div>

### Broader Utility-Class Migration

The `dialtone-migration-helper` `utility-class-to-token-stops` config also includes these border-radius rewrites. Use it if you're already migrating sizing, spacing, gap, and position classes in the same pass:

```bash
npx dialtone-migration-helper --cwd ./src
# Select "utility-class-to-token-stops"
```

Unlike the radius-only script, it also scans `.mdx`, `.less`, and `.css` and covers other utility families.

## ESLint Rule

`deprecated-radius-utility-classes` flags deprecated radius classes in static Vue template `class` attributes and auto-fixes them to the canonical names.

Add it to your ESLint config:

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

The rule handles static `class` attributes in Vue templates and preserves double quotes, single quotes, or unquoted attributes. It's a Vue-template guardrail, not a codemod replacement: it skips `:class` bindings, JS/TS strings, Markdown, and stylesheet files.

## What Requires Manual Review

The tools are intentionally conservative. Search for the remaining patterns below after the automated pass.

| Pattern | Example | Why manual |
| --- | --- | --- |
| Constructed class names | `` `d-btr${size}` ``, `'d-' + side + radius` | No complete legacy class exists in source text. Update the source data or class-building logic. |
| Variant-prefixed utility classes | `sm:d-bar6`, `md:d-btr8`, `h:d-brr-pill` | The current radius codemod and ESLint rule match unprefixed utility classes only. |
| Custom wrappers around class names | `const topRadius = 'btr6'` | The tools only rewrite full Dialtone class names such as `d-btr6`. |
| Stylesheets with legacy class references | `.card { @apply d-bar6; }` | The radius-only script does not scan `.css` or `.less`. Use `utility-class-to-token-stops` or update manually. |

Final check:

```bash
rg -n "d-(bar(0|1|2|4|6|8|12|16|24|32)|(btr|bbr|blr|brr)(0|1|2|4|6|8|12|16|24|32)|(btr|bbr|blr|brr)-(pill|circle))" src
```

Migrate any matches to the canonical class.
