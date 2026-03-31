---
title: Size and Space
description: A unified system for dimensions, spacing, and scale.
figma_url: https://www.figma.com/design/VjrRh4vvfONSmBQxnZrL3u/DT9-Design-Tokens--Rebrand-2025-?node-id=3746-13427&t=D8g6K4TrMGXNsvLT-11
thumb: true
keywords: ["padding","gap","spacing","dimensions","scale"]
---

<svg-loader name="size-img" />

## Overview

Dialtone uses a unified set of **size tokens** (`--dt-size-*`) for all dimensional values. These tokens define both the intrinsic dimensions of UI components (width, height) and the spatial relationships between elements (padding, margin, gap).

### CSS Properties

Size tokens can be used with any CSS property that accepts a dimensional value:

- **Dimensions**: `width`, `height`, `min-width`, `max-height`
- **Spacing**: `padding`, `margin`, `gap`
- **Positioning**: `top`, `left`, `right`, `bottom`
- **Borders**: `border-width`, `border-radius`

## Usage

### Setting a Specific Size

<div class="d-d-grid d-g-300 d-g-cols1 md:d-g-cols3">
<div>

When assigning a size or spacing to an element, use [Size Tokens](#tokens).

```css
width: var(--dt-size-400);
padding: var(--dt-spacing-200);
gap: var(--dt-spacing-100);
```

</div>
<div class="d-gc2">
<code-well-header>
  <div class="d-d-grid d-g-300 d-g-cols2 md:d-g-cols1 d-w100p">
    <dt-stack direction="row" align="center" justify="center" class="d-ba d-bc-default d-js-center" :style="{ width: 'fit-content', minWidth: selectedSize }">
      Box
    </dt-stack>
    <dt-select-menu label="min-width" :options="sizeValues" v-model="selectedSize" />
  </div>
</code-well-header>

```html
<style>
.box {
  min-width: var(--dt-size-720);
}
</style>
<div class="box">Box</div>
```

</div>
</div>

### Setting Gaps Between Elements

<div class="d-d-grid d-g-300 d-g-cols1 md:d-g-cols3">

<div>

When setting the gap between elements, use size tokens for the gap value.

```css
gap: var(--dt-spacing-100);
```

</div>
<div class="d-gc2">
<code-well-header>
  <div class="d-d-grid d-g-300 d-g-cols2 md:d-g-cols1 d-w100p">
    <dt-stack direction="row" :style="{ gap: selectedGap }">
      <dt-stack direction="row" align="center" justify="center" class="d-ba d-bc-default d-w100p">
        Element A
      </dt-stack>
      <dt-stack direction="row" align="center" justify="center" class="d-ba d-bc-default d-w100p">
        Element B
      </dt-stack>
    </dt-stack>
    <dt-select-menu label="Gap" :options="gapValues" v-model="selectedGap" />
  </div>
</code-well-header>

```html
<style>
.wrapper {
  gap: var(--dt-spacing-100);
}
</style>
<div class="wrapper">
  <div>
    Element A
  </div>
  <div>
    Element B
  </div>
</div>
```

</div>
</div>

### Stacking

<div class="d-d-grid d-g-300 d-g-cols1 md:d-g-cols3">
<div>

When adding space between elements, both vertically and horizontally, use either `space-between` or `gap` to define the space that separates each element.

- For gaps inside a box/container, such as between headings, text, and buttons, use values like `var(--dt-size-0)` to `var(--dt-size-550)`
- For spaces between different boxes/containers on a page, choose values from `var(--dt-layout-50)` to `var(--dt-layout-100)`

</div>
 <dt-stack direction="column" gap="200">
  <iframe class="d-bgc-contrast" style="border: 0px; border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-15958&viewport=702%2C117%2C0.97&t=LxszUdOGsEU9l3I5-8&scaling=min-zoom&starting-point-node-id=5%3A15958&hotspot-hints=0&hide-ui=1"></iframe>
<div>
<strong>Vertical stacking</strong>
<dt-text as="p" kind="body" tone="tertiary">Set the space-between/gap groups vertically.</dt-text>
</div>
  </dt-stack>
  <dt-stack direction="column" gap="200">
  <iframe class="d-bgc-contrast" style="border: 0px; border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-15997&viewport=702%2C117%2C0.97&t=LxszUdOGsEU9l3I5-8&scaling=min-zoom&starting-point-node-id=5%3A15997&hotspot-hints=0&hide-ui=1"></iframe>
  <div>
  <strong>Horizontal stacking</strong>
  <dt-text as="p" kind="body" tone="tertiary">Set the space-between/gap groups horizontally.</dt-text>
  </div>
  </dt-stack>
</div>

### Padding

<div class="d-d-grid d-g-300 d-g-cols1 md:d-g-cols3">
<div>

When adding space around an element, use `padding` to create breathing room.

Avoid using `margin`, which adds space outside the element and can affect the layout. In that case, follow the [stacking](#stacking) approach.

</div>
<dt-stack class="d-gc2" direction="column" gap="200">

 <iframe class="d-bgc-contrast" style="border: 0px; border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-16168&viewport=702%2C117%2C0.97&t=LxszUdOGsEU9l3I5-8&scaling=min-zoom&starting-point-node-id=5%3A16168&hotspot-hints=0&hide-ui=1"></iframe>
<div>
<dt-text as="p" kind="body" tone="tertiary">Padding can be measured vertically and horizontally.</dt-text>
</div>
</dt-stack>
</div>

### Widths and Heights

<div class="d-d-grid d-g-300 d-g-cols1 md:d-g-cols3">
<dt-stack direction="column" gap="1">
<p>

For optimal layout flexibility and responsiveness, generally avoid using fixed `widths` or `heights` when defining element sizes. Instead, use percentages values or set `min-width` or `min-height`. This allows the elements to adjust naturally to different screen sizes.

</p>
<dt-text as="p" kind="body" tone="tertiary">
Exceptions exist for select elements like Avatars, Icons, and Toggles. These elements require fixed dimensions to maintain consistent scale across devices within flexible layouts.
</dt-text>
</dt-stack>

<dt-stack class="d-gc2" direction="column" gap="200">
<iframe class="d-bgc-contrast" style="border: 0px solid rgba(0, 0, 0, 0.1); border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-25635&viewport=-1055%2C122%2C0.69&t=iCwsUiY6dBufHiTQ-8&scaling=min-zoom&starting-point-node-id=5%3A25635&hotspot-hints=0&hide-ui=1"></iframe>
<div>
<dt-text as="p" kind="body" tone="tertiary">Text elements typically occupy 100% of their allocated space, allowing text to flow freely within the designated area or until truncated.</dt-text>
</div>
</dt-stack>
</div>

### Variable Sizing

<div class="d-d-grid d-g-300 d-g-cols1 md:d-g-cols3">
<div>

The size of some components is determined by their content. Most expand vertically, while a select few expand horizontally.

</div>
<dt-stack direction="column" gap="200">
<iframe class="d-bgc-contrast" style="border: 0px solid rgba(0, 0, 0, 0.1); border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-25749&viewport=-1055%2C122%2C0.69&t=iCwsUiY6dBufHiTQ-8&scaling=min-zoom&starting-point-node-id=5%3A25739&hotspot-hints=0&hide-ui=1"></iframe>
<dt-text as="p" kind="body" tone="tertiary">This tooltip has a `min-width`, and its height depends on its content.</dt-text>
</dt-stack>
<dt-stack direction="column" gap="200">
<iframe class="d-bgc-contrast" style="border: 0px solid rgba(0, 0, 0, 0.1); border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-25744&viewport=-1055%2C122%2C0.69&t=iCwsUiY6dBufHiTQ-8&scaling=min-zoom&starting-point-node-id=5%3A25744&hotspot-hints=0&hide-ui=1"></iframe>
<dt-text as="p" kind="body" tone="tertiary">This button has a fixed `height`, a `min-width` and grows horizontally depending on its content.</dt-text>
</dt-stack>
</div>

### Responsiveness

<div class="d-d-grid d-g-300 d-g-cols1 md:d-g-cols3">
<div>

Adapting to different devices, sizes should be fluid across breakpoints. While most Dialtone components are responsive, their fluidity depends on the layout they live within.

</div>
<dt-stack class="d-gc2" direction="column" gap="200">
<div>
<iframe class="d-bgc-contrast" style="border: 0px solid rgba(0, 0, 0, 0.1); border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-25679&viewport=-722%2C-310%2C0.54&t=rVgNK5NwIXaPxkHq-8&scaling=min-zoom&starting-point-node-id=5%3A25663&hotspot-hints=0&hide-ui=1"></iframe>
</div>
</dt-stack>
</div>

### Accessibility

<div class="d-d-grid d-g-300 d-g-cols1 md:d-g-cols1">

To ensure clickable and interactive areas are easily accessible, we recommend a minimum area of `var(--dt-size-radius-300)`, except for links within text. In Dialtone we've applied these to components such as buttons, toggles, checkboxes, radio buttons, dropdowns, and inputs.

</div>

## Visual Guides

### Grouping

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols3" >
  <div>
<dt-stack direction="column" gap="100">
<p>Group and adjust the distance between elements to guide users understanding of their relationships. Closer elements appear more connected, while larger gaps indicate less association.</p>
<dt-text as="p" kind="body">Consistent and intentional spacing decisions across pages create a predictable layout, reducing cognitive load and allowing users to focus on the content rather than the layout.</dt-text>
    </dt-stack>
  </div>
  <dt-stack class="d-gc2" direction="column" gap="200">
    <iframe class="d-bgc-contrast" style="border: 0px; border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-16175&viewport=702%2C117%2C0.97&t=LxszUdOGsEU9l3I5-8&scaling=min-zoom&starting-point-node-id=5%3A16175&hotspot-hints=0&hide-ui=1"></iframe>
    <dt-text as="p" kind="body" tone="tertiary">
    <dt-text strength="strong">Proximity groups</dt-text> are formed by placing elements close together. <dt-text strength="strong">Delimited groups,</dt-text> on the other hand, are defined by clear visual boundaries, such as borders.
    </dt-text>
    </dt-stack>
</div>

### Guiding the Eye

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols3" >
  <div>
    <dt-stack direction="column" gap="100">
      <div>
        <p>Control the amount of space around an element to affect its visual importance. Use larger spaces for more prominent elements and smaller for those of lower importance. Keep in mind the position of the elements will benefit the order of reading.
      </p>
      </div>
      <div>
        <dt-text as="p" kind="body">The empty areas around elements provide visual breathing room, enhancing readability and contrast.</dt-text>
      </div>
    </dt-stack>
  </div>
  <div class="d-gc2">
    <iframe class="d-bgc-contrast" style="border: 0px; border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-16225&viewport=702%2C117%2C0.97&t=LxszUdOGsEU9l3I5-8&scaling=min-zoom&starting-point-node-id=5%3A16225&hotspot-hints=0&hide-ui=1"></iframe>
    </div>
</div>

## Tokens

Here are some frequently used tokens. For a complete list, visit the [Size Tokens](/tokens/index.md#size) section.

<token-table category="size" :tokenList="true" :tokens="tokens" :mode="resolvedMode" />

## Key Takeaways

- Use predefined tokens for all dimensional values to maintain consistency and make it easier to update designs.
- Consider the overall composition and whitespace to create well-proportioned layouts.
- Ensure consistent sizing and spacing across various screen sizes and breakpoints.
- Keep sizes and spacing consistent: This ensures a polished look across all devices.

**Design Tip:** Optimize your workflow in Figma by setting the nudge amount to 4px or 8px. It's a small change that can make a big difference in ease of use!

<script setup>
import { ref } from 'vue';
import tokensJson from '@dialpad/dialtone-tokens/dist/doc.json';
import { useThemeManager } from '@composables/useThemeManager';

const { resolvedMode } = useThemeManager();

const sizes = ["size/300", "size/400", "size/450", "size/500", "size/550", "size/600", "size/650", "size/700"];
const theme = "base-light";
const tokens = Object.keys(tokensJson[theme] ?? {}).reduce((acc, curr) => {
  if (sizes.includes(curr)) {
    const { name, value, description } = tokensJson[theme][curr]["css/variables"];
    acc.push({
      name,
      tokenValue: value,
      description,
      exampleValue: value,
      exampleName: name,
    });
  }
  return acc;
}, []);

const sizeValues = [
  { value: 'var(--dt-size-720)', label: 'var(--dt-size-720)' },
  { value: 'var(--dt-layout-200)', label: 'var(--dt-layout-200)' },
  { value: 'var(--dt-layout-250)', label: 'var(--dt-layout-250)' },
];

const gapValues = [
  { value: 'var(--dt-size-300)', label: 'var(--dt-size-300)' },
  { value: 'var(--dt-size-400)', label: 'var(--dt-size-400)' },
  { value: 'var(--dt-layout-25)', label: 'var(--dt-layout-25)' },
  { value: 'var(--dt-layout-50)', label: 'var(--dt-layout-50)' },
];

const selectedSize = ref('var(--dt-size-720)');
const selectedGap = ref('var(--dt-size-400)');
</script>
