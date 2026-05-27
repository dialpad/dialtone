---
title: Typography Utilities to DtText
description: Guide and migration tool for replacing legacy typography utility classes (d-headline--*, d-body--*, d-label--*, d-code--md, d-fw-*, d-fc-*, d-lh-*, d-truncate, d-ta-*) with the DtText component. Covers automatic migration, edge cases, and class-to-prop mapping.
status: ready
---

## TLDR

> [!WARNING] Deprecation
> Legacy typography utility classes on text elements are deprecated in favor of the [`<dt-text>` component](/components/text.html). Use the migration tool to convert them automatically.

- Replace `d-headline--*`, `d-body--*`, `d-label--*`, `d-code--md`, `d-helper--*` on `<p>`, `<span>`, `<div>`, `<h1>`–`<h6>`, and `<label>` with `<dt-text kind="…" size="…">`.
- Override utilities like `d-fw-*`, `d-fc-*`, `d-lh-*`, `d-truncate`, and `d-ta-*` map to `strength`, `tone`, `density`, `truncate`, and `align` props.
- One command does the migration: `npx dialtone-migrate-typography`.

## Overview

[DtText](/components/text.html) is Dialtone's semantic text component. It exposes typography intent through props (`kind`, `size`, `density`, `strength`, `tone`, `truncate`, `align`) rather than utility classes, making typography decisions explicit and easier to validate at build time.

A [migration tool](#migration-tool) is available to replace typography utility classes with `<dt-text>` automatically, or you may do so [manually](#manual-migration).

## Why Use the Migration Tool?

The migration tool automates the conversion process with several key benefits:

- **Speed**: Migrate entire projects in minutes instead of hours
- **Consistency**: Ensures uniform conversion patterns across all files
- **Safety**: Flags patterns it cannot safely auto-migrate (dynamic `:class` bindings, unsupported tag types, font-size utilities)
- **Accuracy**: No manual transcription errors or missed conversions
- **Visibility**: Color-coded diffs and review markers help you spot cases that need a second look

The tool is ideal for projects with many text elements using utility classes. For small, one-off changes, manual migration may be faster.

## Examples

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```html
<p class="d-headline--md">Welcome back</p>

<span class="d-body--sm d-fc-secondary d-truncate">
  you@example.com
</span>

<label class="d-label--md d-fw-bold">
  Display name
</label>
```

</div>
<div>

**After**

```html
<dt-text as="p" kind="headline" size="300">Welcome back</dt-text>

<dt-text kind="body" size="100" tone="secondary" truncate>
  you@example.com
</dt-text>

<dt-text as="label" kind="label" size="300" strength="bold">
  Display name
</dt-text>
```

</div>
</div>

> [!INFO] The `as` prop
> The script omits `as="…"` when the original tag is `<span>` — that is DtText's default rendered element. For all other tags (`p`, `div`, `h1`–`h6`, `label`) it emits `as="…"` to preserve semantic meaning.

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```html
<h2 class="d-headline--lg-compact">
  Recent calls
</h2>

<div class="d-body--md-compact d-ta-right d-fc-muted">
  Last updated just now
</div>
```

</div>
<div>

**After**

```html
<dt-text as="h2" kind="headline" size="500" density="200">
  Recent calls
</dt-text>

<dt-text as="div" kind="body" size="300" density="300" align="end" tone="muted">
  Last updated just now
</dt-text>
```

</div>
</div>

> [!INFO] Logical alignment
> `d-ta-left` → `align="start"` and `d-ta-right` → `align="end"` follow Dialtone's [logical naming convention](/guides/migration/logical-naming/). Physical direction names are not used in props.

## Migration Tool

`dialtone-migrate-typography` scans `.vue` and `.html` files for legacy typography utility classes and converts them to `<dt-text>`. It is included with `@dialpad/dialtone-css`.

### What the Tool Migrates

**Composed typography classes** on `<p>`, `<span>`, `<div>`, `<h1>`–`<h6>`, and `<label>` elements:

- `d-headline--*` (and legacy aliases like `d-headline-medium`) → `kind="headline"` + `size`
- `d-body--*` / `d-body-*` → `kind="body"` + `size`
- `d-label--*` / `d-label-*` → `kind="label"` + `size`
- `d-code--md` / `d-code-base` → `kind="code" size="200"`
- `d-helper--*` → approximated as `kind="body"` + `density` (flagged for review — see below)

**Override utility classes** on any element being migrated, or on existing `<dt-text>` elements carrying residual utilities:

- `d-fw-bold/semibold/medium/normal` → `strength="…"`
- `d-lh-100` – `d-lh-600` → `density="…"`
- `d-fc-*` (15 tone values) → `tone="…"`
- `d-truncate` → `truncate` (boolean prop)
- `d-ta-left/right/center/justify` → `align="start/end/center/justify"`
- `d-ff-mono` → `kind="code"`

**Non-rewriteable tags** (`<a>`, `<button>`, `<li>`, `<td>`, custom Vue components, etc.) carrying only override utilities are left untouched silently. These tags carry semantic behavior beyond text and have no clean DtText receiver.

### What the Tool Flags for Review

The following patterns cannot be safely auto-migrated. The script emits a `<!-- dt-text-migrate: review … -->` comment and leaves the element unchanged (or approximated, in the case of `d-helper--*`). Run `--remove-markers` to strip all comments after manual review.

| Marker comment | What triggered it | What to do |
| --- | --- | --- |
| `<!-- dt-text-migrate: review -->` | `d-headline--eyebrow` / `d-headline-eyebrow` (uses `text-transform: uppercase` — no DtText prop); `d-code--sm` / `d-code-small` (below DtText minimum code size) | Check whether uppercase or small code is genuinely required; implement a custom solution or leave as-is |
| `<!-- dt-text-migrate: review helper -->` | `d-helper--*` — approximated as `kind="body"` + appropriate `density`; element IS rewritten | Verify the approximation is visually correct; adjust `density` or `size` if needed |
| `<!-- dt-text-migrate: review nested span -->` | A child `<span>` with directives, events, or extra attributes that can't be safely collapsed into a nested `<dt-text>` | Migrate the child manually, or keep it as a plain `<span>` inside the parent `<dt-text>` |
| `<!-- dt-text-migrate: review dynamic class -->` | `:class` / `v-bind:class` bindings containing typography utilities | Convert conditionally bound utilities to conditional props (e.g., `:strength="isBold ? 'bold' : 'normal'"`) |
| `<!-- dt-text-migrate: review d-fs-* -->` | Raw `d-fs-*` font-size classes — no DtText prop equivalent | Remove the class, or use a CSS custom property override if a non-standard size is needed |
| `<!-- dt-text-migrate: review conflicting class -->` | A utility class clashes with an explicit prop already on the element (e.g., `<dt-text strength="bold" class="d-fw-normal">`) | Remove the redundant class; keep the explicit prop |

### How the Tool Works

#### Composed Class Rewriting

The script matches the full composed class name (e.g., `d-headline--md`) to the mapping table and emits the correct `kind`, `size`, and optional `density`/`strength` props. Unrecognized classes are kept on the element's `class` attribute unchanged.

**Non-span tags get an `as` prop:**

```html
<!-- span: no as prop (DtText default) -->
<span class="d-body--sm">Help text</span>
→ <dt-text kind="body" size="100">Help text</dt-text>

<!-- p: as="p" to preserve semantic element -->
<p class="d-body--md">Body copy</p>
→ <dt-text as="p" kind="body" size="300">Body copy</dt-text>
```

#### Override Extraction

Override utilities are extracted from the class list and written as props on the rewritten element. Any class not recognized as a typography utility is kept on the `class` attribute.

```html
<!-- Before: mixed composed + override + other class -->
<p class="d-body--md d-fc-tertiary d-truncate d-mb-300">...</p>

<!-- After: typography→props, other class retained -->
<dt-text as="p" kind="body" size="300" tone="tertiary" truncate class="d-mb-300">...</dt-text>
```

#### Nested Span Collapse

When a direct child `<span>` of a migrated element carries only recognized typography classes (no extra attributes, directives, or events), the script collapses it into a nested `<dt-text>`:

```html
<!-- Before -->
<p class="d-headline--md">
  <span class="d-fw-bold">Hello</span>
</p>

<!-- After: safe to collapse — span has only recognized classes -->
<dt-text as="p" kind="headline" size="300">
  <dt-text strength="bold">Hello</dt-text>
</dt-text>
```

#### Already-DtText Residual Lift

The script also scans `<dt-text>` elements that carry residual utility classes from a previous partial migration, and lifts those classes into props:

```html
<!-- Before: already DtText but with leftover utility classes -->
<dt-text kind="body" class="d-fw-bold d-fc-secondary">...</dt-text>

<!-- After -->
<dt-text kind="body" strength="bold" tone="secondary">...</dt-text>
```

### Usage

#### Preview Changes

```bash
npx dialtone-migrate-typography --dry-run --cwd ./src
```

#### Target a Directory

```bash
npx dialtone-migrate-typography --cwd ./src/components
```

#### Apply All Changes

```bash
npx dialtone-migrate-typography --yes
```

#### Interactive Mode

```bash
npx dialtone-migrate-typography
```

Interactive mode displays each change with a color-coded diff (red = before, green = after) and prompts for each file. For each match, respond with:

- `y` or `yes`: Apply this change
- `n` or `no`: Skip this change
- `a` or `all`: Apply all remaining changes without further prompts
- `q` or `quit`: Stop and save

#### Target Specific Files

```bash
# Single file
npx dialtone-migrate-typography --file src/components/Header.vue --dry-run

# Multiple files
npx dialtone-migrate-typography --file Header.vue --file Footer.vue --yes
```

When using `--file`, the `--cwd` option is ignored.

#### Validate Existing DtText Elements

```bash
npx dialtone-migrate-typography --validate --cwd ./src
```

`--validate` runs read-only and scans existing `<dt-text>` elements for prop bugs: object syntax (`:kind="{ … }"`), invalid prop values, and mixed CSS classes. Useful as a post-migration audit.

#### Remove Review Markers

```bash
npx dialtone-migrate-typography --remove-markers --cwd ./src
```

Strips all `<!-- dt-text-migrate: review … -->` comments after you have reviewed and resolved each flagged pattern. Add `--dry-run` to preview which files would be cleaned.

**All options:**

| Option | Description |
| --- | --- |
| `--cwd <path>` | Working directory (default: current directory) |
| `--file <path>` | Specific file to process (repeatable; ignores `--cwd`) |
| `--dry-run` | Show changes without writing files |
| `--yes`, `-y` | Apply all changes without prompting |
| `--remove-markers` | Strip all `dt-text-migrate` review comments |
| `--validate` | Read-only: scan existing `<dt-text>` for prop bugs |
| `--help`, `-h` | Show help |

Files processed: `.vue` and `.html`.

## Post-Migration

### Add DtText Imports

When a file gains its first `<dt-text>`, the script prints a per-file notice on stdout if `DtText` is not already imported or registered. Follow the printed instructions:

**Options API (registered globally in your app):**

```js
import { DtText } from '@dialpad/dialtone-vue';

export default {
  components: { DtText },
  // …
};
```

**Composition API:**

```vue
<script setup>
import { DtText } from '@dialpad/dialtone-vue';
</script>
```

### Remove Review Markers

After resolving all flagged patterns, strip the marker comments:

```bash
npx dialtone-migrate-typography --remove-markers --cwd ./src
```

### ESLint Auto-Fix

Run ESLint after migration to fix Vue attribute ordering:

```bash
npx eslint --fix "./src/**/*.vue"
```

## Manual Migration

### Native HTML Elements

1. Find elements with a `d-headline--*`, `d-body--*`, `d-label--*`, or `d-code--md` class
2. Change the tag to `<dt-text>`
3. Change the closing tag to `</dt-text>`
4. Convert classes to props using the [Class-to-Prop Reference](#class-to-prop-reference) below
5. Add `as="…"` if the original tag is not `<span>`
6. Keep non-typography classes on the component's `class` attribute

### Custom Components

> [!WARNING]
> Custom Vue components require manual migration.

**Option 1: Wrap the component**

```html
<!-- Before -->
<my-component class="d-body--md d-fc-secondary" />

<!-- After -->
<dt-text kind="body" size="300" tone="secondary">
  <my-component />
</dt-text>
```

**Option 2: Update the component internally**

If you own the component, apply the prop directly to the root text element.

### Dynamic Class Bindings

> [!WARNING]
> Dynamic bindings like `:class="{ 'd-body--md': active }"` cannot be auto-migrated. The migration tool emits a `<!-- dt-text-migrate: review dynamic class -->` comment.

**Before:**

```html
<p :class="{ 'd-fc-secondary': isDimmed }">Copy</p>
```

**After:**

```html
<dt-text as="p" :tone="isDimmed ? 'secondary' : undefined">Copy</dt-text>
```

## Class-to-Prop Reference

### Composed Typography Classes

| Old class | `kind` | `size` | `density` | `strength` | Notes |
| --- | --- | --- | --- | --- | --- |
| `d-headline--sm` / `d-headline-small` | `headline` | `100` | — | — | |
| `d-headline--md` / `d-headline-medium` | `headline` | `300` | — | — | |
| `d-headline--lg` / `d-headline-large` | `headline` | `500` | — | — | |
| `d-headline--xl` / `d-headline-extra-large` | `headline` | `600` | — | — | |
| `d-headline--xxl` / `d-headline-extra-extra-large` | `headline` | `700` | — | — | |
| `d-headline--eyebrow` / `d-headline-eyebrow` | — | — | — | — | **Flagged** — no DtText prop for `text-transform: uppercase` |
| `d-headline--sm-soft` / `d-headline-soft-small` | `headline` | `100` | — | `medium` | |
| `d-headline--lg-soft` | `headline` | `500` | — | `medium` | |
| `d-headline--sm-compact` / `d-headline-compact-small` | `headline` | `100` | `200` | — | |
| `d-headline--md-compact` / `d-headline-compact-medium` | `headline` | `300` | `300` | — | |
| `d-headline--lg-compact` / `d-headline-compact-large` | `headline` | `500` | `200` | — | |
| `d-headline--xl-compact` | `headline` | `600` | `100` | — | |
| `d-headline--xxl-compact` | `headline` | `700` | — | — | Same line-height as base |
| `d-headline--sm-soft-compact` / `d-headline-compact-soft-small` | `headline` | `100` | `200` | `medium` | |
| `d-headline--lg-soft-compact` | `headline` | `500` | `200` | `medium` | |
| `d-body--md` / `d-body-base` | `body` | `300` | — | — | |
| `d-body--sm` / `d-body-small` | `body` | `100` | — | — | |
| `d-body--md-compact` / `d-body-compact` | `body` | `300` | `300` | — | |
| `d-body--sm-compact` / `d-body-compact-small` | `body` | `100` | `200` | — | |
| `d-label--md` / `d-label-base` | `label` | `300` | — | — | |
| `d-label--sm` / `d-label-small` | `label` | `100` | — | — | |
| `d-label--md-compact` / `d-label-compact` | `label` | `300` | `300` | — | |
| `d-label--sm-compact` / `d-label-compact-small` | `label` | `100` | `200` | — | |
| `d-label--md-plain` / `d-label-plain` | `label` | `300` | — | `normal` | |
| `d-label--md-plain-compact` / `d-label-compact-plain` | `label` | `300` | `300` | `normal` | |
| `d-label--sm-plain` / `d-label-plain-small` | `label` | `100` | — | `normal` | |
| `d-label--sm-plain-compact` / `d-label-compact-plain-small` | `label` | `100` | `200` | `normal` | |
| `d-code--md` / `d-code-base` | `code` | `200` | — | — | |
| `d-code--sm` / `d-code-small` | — | — | — | — | **Flagged** — below DtText minimum code size |
| `d-helper--md` / `d-helper-base` | `body` | `300` | `300` | — | **Flagged for review** — approximated |
| `d-helper--sm` / `d-helper-small` | `body` | `100` | `200` | — | **Flagged for review** — approximated |

### Override Utility Classes

| Old class | DtText prop | Value |
| --- | --- | --- |
| `d-fw-bold` | `strength` | `"bold"` |
| `d-fw-semibold` | `strength` | `"semibold"` |
| `d-fw-medium` | `strength` | `"medium"` |
| `d-fw-normal` | `strength` | `"normal"` |
| `d-lh-100` | `density` | `"100"` |
| `d-lh-200` | `density` | `"200"` |
| `d-lh-300` | `density` | `"300"` |
| `d-lh-400` | `density` | `"400"` |
| `d-lh-500` | `density` | `"500"` |
| `d-lh-600` | `density` | `"600"` |
| `d-fc-primary` | `tone` | `"primary"` |
| `d-fc-secondary` | `tone` | `"secondary"` |
| `d-fc-tertiary` | `tone` | `"tertiary"` |
| `d-fc-muted` | `tone` | `"muted"` |
| `d-fc-disabled` | `tone` | `"disabled"` |
| `d-fc-placeholder` | `tone` | `"placeholder"` |
| `d-fc-critical` | `tone` | `"critical"` |
| `d-fc-critical-strong` | `tone` | `"critical-strong"` |
| `d-fc-positive` | `tone` | `"positive"` |
| `d-fc-positive-strong` | `tone` | `"positive-strong"` |
| `d-fc-warning` | `tone` | `"warning"` |
| `d-fc-info` | `tone` | `"info"` |
| `d-fc-info-strong` | `tone` | `"info-strong"` |
| `d-fc-neutral-black` | `tone` | `"neutral-black"` |
| `d-fc-neutral-white` | `tone` | `"neutral-white"` |
| `d-truncate` | `truncate` | _(boolean prop — no value)_ |
| `d-ta-left` | `align` | `"start"` |
| `d-ta-right` | `align` | `"end"` |
| `d-ta-center` | `align` | `"center"` |
| `d-ta-justify` | `align` | `"justify"` |
| `d-ff-mono` | `kind` | `"code"` |
