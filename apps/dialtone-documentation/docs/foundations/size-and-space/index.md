---
title: Layout and Spacing
description: A unified system for dimensions, spacing, and scale.
thumb: true
keywords: ["padding","gap","spacing","dimensions","scale","layout"]
---

## Overview

Dialtone uses a unified set of `layout` and `spacing` design tokens for all dimensional values. These tokens define both the intrinsic dimensions of UI surfaces (e.g. `width`, `height`) and the spatial relationships between them (e.g. `padding`, `gap`, positioning).

### Layout and Spacing Tokens

Layout and spacing tokens are CSS custom properties (a.k.a. CSS variables) generated from two base units:

- **Spacing**: base `8px`
- **Layout**: base `64px`

#### Samples:

| Token | Math | Value |
| --- | --- | --- |
| `--dt-spacing-100` | 1 × 8px | 8px |
| `--dt-spacing-400` | 4 × 8px | 32px |
| `--dt-layout-100` | 1 × 64px | 64px |
| `--dt-layout-400` | 4 × 64px | 256px |

Because the formula is deterministic, tools and code-generation assistants (including LLMs) can resolve any stop without needing the full reference table in context.

For the complete set, view [Spacing Tokens](/tokens/#spacing) and [Layout Tokens](/tokens/#layout). For the story behind why layout and spacing live in separate families, see [New Layout and Spacing Token Systems](/guides/migration/layout-and-spacing-tokens/).

### The Primitive Triad

You rarely need these tokens directly. The **primitive triad** exposes them through three components:

- **[DtBox](/components/box.md)**: what a container *is* (e.g. surface, border, padding, sizing, positioning)
- **[DtStack](/components/stack.md)**: how children are *arranged* (e.g. direction, gap, alignment)
- **[DtText](/components/text.md)**: what the content *looks* like (e.g. font, size, tone)

Compose the triad; reach for raw [design tokens](/tokens/) or [CSS utilities](#related-css-utilities) as an escape hatch.

## Usage

The primitive triad handles layout and spacing declaratively. For example:

- DtBox's `padding`: space *inside* a container, uses `--dt-spacing-*` design tokens
- DtBox's `min-inline-size`: container *width*, uses `--dt-layout-*` design tokens
- DtBox's `inset-block-start`: positioned container offset, uses documented coordinate values such as `--dt-spacing-*`, negative spacing tokens, and side-specific percentage coordinates
- DtStack's `gap`: space *between* boxes, uses `--dt-spacing-*` design tokens

```vue demo
<dt-stack gap="400" align="center">
  <dt-stack direction="row" :gap="selectedGap">
    <dt-box :min-inline-size="selectedSize" :padding="selectedPadding" surface="moderate" border-width="100" border-radius="300"><dt-text as="p" kind="body" size="200" tone="tertiary" align="center">Box 1</dt-text></dt-box>
    <dt-box :min-inline-size="selectedSize" :padding="selectedPadding" surface="moderate" border-width="100" border-radius="300"><dt-text as="p" kind="body" size="200" tone="tertiary" align="center">Box 2</dt-text></dt-box>
    <dt-box :min-inline-size="selectedSize" :padding="selectedPadding" surface="moderate" border-width="100" border-radius="300"><dt-text as="p" kind="body" size="200" tone="tertiary" align="center">Box 3</dt-text></dt-box>
  </dt-stack>
  <dt-stack direction="row" gap="200">
    <dt-select-menu size="200" label="Box's Padding" :options="paddingOptions" v-model="selectedPadding" />
    <dt-select-menu size="200" label="Box's Width" :options="sizeOptions" v-model="selectedSize" />
    <dt-select-menu size="200" label="Stack's Gap" :options="gapOptions" v-model="selectedGap" />
  </dt-stack>
</dt-stack>
<!-- @code -->
<dt-stack direction="row" gap="200">
  <dt-box min-inline-size="300" padding="200" surface="moderate" border-width="100" border-radius="300">
    <dt-text as="p" kind="body" size="200" tone="tertiary" align="center">Box 1</dt-text>
  </dt-box>
  <dt-box min-inline-size="300" padding="200" surface="moderate" border-width="100" border-radius="300">
    <dt-text as="p" kind="body" size="200" tone="tertiary" align="center">Box 2</dt-text>
  </dt-box>
  <dt-box min-inline-size="300" padding="200" surface="moderate" border-width="100" border-radius="300">
    <dt-text as="p" kind="body" size="200" tone="tertiary" align="center">Box 3</dt-text>
  </dt-box>
</dt-stack>
```

### Layout

<dialtone-usage>
<template #do>

- Prefer percentages, `min-inline-size`, or `min-block-size` so containers adapt to their context.
- Use [DtBox](/components/box.md)'s sizing props (`inline-size`, `min-inline-size`, `max-inline-size`, plus their block-axis equivalents) over raw `width` and `height`.
- Use fixed dimensions on elements that require them: avatars, icons, toggles.

</template>
<template #dont>

- Avoid setting explicit dimensions (e.g. `width` or `height`) when a layout can flex.

</template>
</dialtone-usage>

### Padding

<dialtone-usage>
<template #do>

- Use [DtBox](/components/box.md)'s `padding` prop (or its directional variants `padding-inline` and `padding-block`) for space *inside* a container.
- Use [DtStack](/components/stack.md)'s `gap` for space *between* sibling elements.

</template>
<template #dont>

- Avoid using `margin` for layout. It lives outside the element, collapses in surprising ways, and may not scale well since it assumes a sibling element's presence. You might likely can achieve the same result with DtStack's `gap` or careful use of `padding`.

</template>
</dialtone-usage>

### Arrangement

<dialtone-usage>
<template #do>

- Use [DtStack](/components/stack.md)'s `gap` to space siblings apart, vertically or horizontally.
- Pick smaller `--dt-spacing-*` values for gaps inside a container (between headings, text, buttons) and larger values for gaps between regions of a page.

</template>
<template #dont>

- Avoid hand-rolling flex containers (`d-d-flex` + `d-ai-*` + `d-jc-*` + `d-g-*`) for layouts DtStack already expresses as props.

</template>
</dialtone-usage>

### Grouping

<dialtone-usage>
<template #do>

- Group related elements tightly; separate unrelated ones widely. Proximity communicates relationship.
- Keep spacing decisions consistent across pages. Predictability reduces cognitive load.

</template>
<template #dont>

- Don't vary gap sizes within a single UI pattern. Readers interpret inconsistent spacing as noise.

</template>
</dialtone-usage>

### Guiding the Eye

<dialtone-usage>
<template #do>

- Give prominent elements more space around them; give supporting content less.
- Use empty space on purpose. Breathing room improves readability and contrast.
- Keep reading order in mind when deciding what to emphasize.

</template>
<template #dont>

- Don't pack elements edge-to-edge. Crowded layouts bury hierarchy and fight reading order.

</template>
</dialtone-usage>

### Text Rhythm

Typography is the third leg of the triad.

<dialtone-usage>
<template #do>

- Use [DtText](/components/text.md) for all text. Its `density` prop controls line-height, so it governs rhythm *within* text.
- Pair DtText's `density` (within-text rhythm) with [DtStack](/components/stack.md)'s `gap` (between-element rhythm).

</template>
<template #dont>

- Avoid combining typography utility classes (`d-fs-*`, `d-lh-*`, `d-fw-*`) when [DtText](/components/text.md) already exposes the right props.

</template>
</dialtone-usage>

## Related CSS Utilities

The triad covers most size and space needs. These utility classes remain available for cases the components don't cover.

| Purpose | Utility | Prefer |
| --- | --- | --- |
| [Padding](/utilities/spacing/padding.html) | `d-p-*` | [DtBox](/components/box.md) `padding` / `padding-inline` / `padding-block` |
| [Margin](/utilities/spacing/margin.html) | `d-m-*` | [DtStack](/components/stack.md) `gap` for between-element spacing |
| [Flex / grid gap](/utilities/flex/gap.html) | `d-g-*` | [DtStack](/components/stack.md) `gap` |
| [Width / height](/utilities/sizing/width.html) | `d-w*` / `d-h*` | [DtBox](/components/box.md) `inline-size` / `block-size` |
| [Min / max width](/utilities/sizing/min-width.html) | `d-wmn-*` / `d-wmx-*` | [DtBox](/components/box.md) `min-inline-size` / `max-inline-size` |
| [Position](/utilities/layout/position.html) | `d-ps-*` | [DtBox](/components/box.md) `position` |
| [Coordinates](/utilities/layout/coordinates.html) | `d-ibs-*` / `d-iie-*` | [DtBox](/components/box.md) `inset-block-start` / `inset-inline-end` |
| [Z-index](/utilities/layout/z-index.html) | `d-zi-*` | [DtBox](/components/box.md) `z-index` |
| [Enable flex container](/utilities/flex/direction-wrap-flow.html) | `d-d-flex` | [DtStack](/components/stack.md) |
| [Cross-axis alignment](/utilities/flex/align-items.html) | `d-ai-*` | [DtStack](/components/stack.md) `align` |
| [Main-axis distribution](/utilities/flex/justify.html) | `d-jc-*` | [DtStack](/components/stack.md) `justify` |

For the full set, view [Spacing Tokens](/tokens/#spacing), [Layout Tokens](/tokens/#layout), and [CSS Utilities](/utilities/).

## Key Takeaways

- Let the triad do the work: [DtBox](/components/box.md) for the container, [DtStack](/components/stack.md) for arrangement, [DtText](/components/text.md) for content.
- Reach for tokens, not magic numbers. `--dt-layout-*` and `--dt-spacing-*` keep sizing and spacing consistent without manual pixel math.
- Use `padding` inside containers and `gap` between them. Avoid `margin` for layout wherever possible.
- Avoid fixed dimensions when a layout can flex; `min-*` constraints respond better across screen sizes.
- CSS utilities remain available for cases the triad doesn't cover, but start with the triad.

<script setup>
import { ref } from 'vue';

const paddingOptions = [
  { value: '100', label: 'padding="100"' },
  { value: '200', label: 'padding="200"' },
  { value: '300', label: 'padding="300"' },
  { value: '500', label: 'padding="500"' },
];

const sizeOptions = [
  { value: '100', label: 'min-inline-size="100"' },
  { value: '200', label: 'min-inline-size="200"' },
  { value: '300', label: 'min-inline-size="300"' },
];

const gapOptions = [
  { value: '100', label: 'gap="100"' },
  { value: '200', label: 'gap="200"' },
  { value: '300', label: 'gap="300"' },
  { value: '500', label: 'gap="500"' },
];

const selectedPadding = ref('200');
const selectedSize = ref('200');
const selectedGap = ref('200');
</script>
