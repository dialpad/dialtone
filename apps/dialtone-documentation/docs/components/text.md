---
title: Text
description: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
status: beta
---

<code-well-header>
  <dt-text kind="headline" size="md" as="h2">Typography primitive</dt-text>
</code-well-header>

<!-- <component-combinator component-name="DtText" /> -->

## Usage

- Prefer `DtText` over individual typography utility classes to keep implementations aligned with token updates.
- Use the default slot for rich content. The `text` prop provides a simple fallback string when no slot content is present.
- Choose the `as` prop to match the semantic HTML element (e.g., `h1`, `label`, `p`).
- Match responsive layout needs by combining `DtText` with layout primitives like [`DtStack`](stack.md).

<dialtone-usage>
<template #do>

- Replace multiple `d-` typography classes with a single `dt-text` instance.
- Pick the smallest `kind`/`size` combination that conveys the desired hierarchy.
- Use `tone` for semantic color tokens instead of standalone `d-fc-*` classes.

</template>
<template #dont>

- Mix `DtText` with conflicting typography utilities (e.g., `d-fs-*`, `d-fw-*`, `d-lh-*`).
- Render headings with non-heading tags (e.g., avoid `as="div"` for top-level titles).
- Depend on the `text` prop when the content requires inline formatting; slot it instead.

</template>
</dialtone-usage>

## Variant Matrix

Validated against `apps/dialtone-documentation/docs/_data/type.json` and represented in Storybook (`text_variants.story.vue`).

| Kind | Size | Strength | Density | Utility Tokens |
| --- | --- | --- | --- | --- |
| headline | eyebrow | – | – | `d-headline--eyebrow` |
| headline | sm | soft | compact | `d-headline--sm`, `d-headline--sm-soft`, `d-headline--sm-compact`, `d-headline--sm-soft-compact` |
| headline | md | – | compact | `d-headline--md`, `d-headline--md-compact` |
| headline | lg | soft | compact | `d-headline--lg`, `d-headline--lg-soft`, `d-headline--lg-compact`, `d-headline--lg-soft-compact` |
| headline | xl | – | compact | `d-headline--xl`, `d-headline--xl-compact` |
| headline | xxl | – | compact | `d-headline--xxl`, `d-headline--xxl-compact` |
| body | sm | – | compact | `d-body--sm`, `d-body--sm-compact` |
| body | md | – | compact | `d-body--md`, `d-body--md-compact` |
| label | sm | plain | compact | `d-label--sm`, `d-label--sm-plain`, `d-label--sm-compact`, `d-label--sm-plain-compact` |
| label | md | plain | compact | `d-label--md`, `d-label--md-plain`, `d-label--md-compact`, `d-label--md-plain-compact` |
| helper | sm | – | – | `d-helper--sm` |
| helper | md | – | – | `d-helper--md` |
| code | sm | – | – | `d-code--sm` |
| code | md | – | – | `d-code--md` |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string` | `"span"` | HTML tag or component used for rendering. |
| `kind` | `"headline" \| "body" \| "label" \| "helper" \| "code"` | `undefined` | Typography family that drives token selection. |
| `size` | `string` | `undefined` | Size within the selected `kind`. When omitted, defaults to `md` internally. |
| `strength` | `"soft" \| "plain"` | `undefined` | Applies supported strength modifiers for specific `kind`/`size` permutations. |
| `density` | `"compact"` | `undefined` | Enables compact line-height where supported. |
| `tone` | `string` | `undefined` | Dialtone foreground color token suffix (e.g., `primary`, `muted`). |
| `align` | `"start" \| "center" \| "end" \| "justify"` | `undefined` | Adds matching alignment utility classes. |
| `truncate` | `boolean` | `false` | Applies single-line truncation (`d-truncate`). |
| `maxLines` | `number` | `undefined` | Uses `d-text--clamp` for multi-line clamping. |
| `numeric` | `boolean` | `false` | Switches to tabular-number typography. |
| `text` | `string` | `undefined` | Fallback text when no default slot content is provided. |

## Accessibility

- Maintain semantic structure via `as` (e.g., screen readers expect heading levels to be sequential).
- When using `truncate`, provide another way to access the full content (tooltip, detail view, or explicit `aria-label`). `DtText` does not apply a `title` attribute automatically, so consuming applications should opt in.
- Allow numeric content to remain readable by enabling the `numeric` prop when aligning tables or counters.

## Examples

### Headings and body copy

<code-well-header>
  <dt-stack gap="300">
    <dt-text kind="headline" size="lg" as="h1">Account overview</dt-text>
    <dt-text kind="body" size="md">Latest activity appears below.</dt-text>
  </dt-stack>
</code-well-header>

### Inline status with tone

<code-well-header>
  <dt-text kind="body" tone="success">All systems operational</dt-text>
</code-well-header>

### Tabular numbers

<code-well-header>
  <dt-text kind="code" size="md" numeric>0021 4456 7881</dt-text>
</code-well-header>

### Multi-line clamp

<code-well-header>
  <dt-text kind="body" size="md" :max-lines="3">
    Dialtone typography primitives ensure consistent spacing and hierarchy across pages. Use `maxLines` for controlled truncation while preserving semantic HTML structure.
  </dt-text>
</code-well-header>

## Vue API

<component-vue-api component-name="text" />

## Classes

<component-class-table component-name="text"></component-class-table>
