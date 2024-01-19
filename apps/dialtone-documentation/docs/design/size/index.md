---
title: Size
description: A system to maintain consistent size and scale.
---

<svg-loader name="size-img" />

## Choosing Size vs Space

### Size

Size design tokens define intrinsic **dimensions** of UI components. Example CSS properties they correspond to: `width`, `height`, `border-radius`, `border-width`, positioning properties, i.e. `top`, `left`, etc.

### Space

[Space](/design/space/) design tokens focus on controlling **spatial relationships**; that is, the space between and around elements. Example CSS properties they correspond to: `padding`, `margin`, `gap`

## Usage

### Setting a specific size

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">
<div>

When assigning a size to an element, utilize [Size Tokens](#tokens) for the value.

👍
`width: var(--dt-size-400)`

👎
`width: var(--dt-space-400)`
</div>
<div class="d-gc2">
<code-well-header>
  <div class="d-d-grid d-gg24 d-g-cols2 md:d-g-cols1 d-w100p">
    <div class="d-fl-center d-ba d-bc-purple-400 d-js-center" :style="{ width: 'fit-content', minWidth: selectedSize }">
      Box
    </div>
    <dt-select-menu label="min-width" :options="sizeValues" @change="changeBoxSize" />
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

### Widths and Heights

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">
<dt-stack direction="column" gap="100">
<p>

For optimal layout flexibility and responsiveness, generally avoid using fixed `widths` or `heights` when defining element sizes. Instead, use percentages values or set `min-width` or `min-height`. This allows the elements to adjust naturally to different screen sizes.

</p>
<p class="d-body-base d-fc-tertiary">
Exceptions exist for select elements like Avatars, Icons, and Toggles. These elements require fixed dimensions to maintain consistent scale across devices within flexible layouts.
</p>
</dt-stack>

<dt-stack class="d-gc2" direction="column" gap="500">
<iframe style="border: 0px solid rgba(0, 0, 0, 0.1); border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-25635&viewport=-1055%2C122%2C0.69&t=iCwsUiY6dBufHiTQ-8&scaling=min-zoom&starting-point-node-id=5%3A25635&hotspot-hints=0&hide-ui=1"></iframe>
<div>
<p class="d-body-base d-fc-tertiary">Text elements, typically occupy 100% of their allocated space, allowing text to flow freely within the designated area or until trucated.</p>
</div>
</dt-stack>
</div>

### Variable sizing

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">
<div>

The size of some components is determined by their content. Most expand vertically, while a select few expand horizontally.

</div>
<dt-stack direction="column" gap="500">
<iframe style="border: 0px solid rgba(0, 0, 0, 0.1); border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-25749&viewport=-1055%2C122%2C0.69&t=iCwsUiY6dBufHiTQ-8&scaling=min-zoom&starting-point-node-id=5%3A25739&hotspot-hints=0&hide-ui=1"></iframe>
<p class="d-body-base d-fc-tertiary">This tooltip has a `min-width`, and its height depends on its content.</p>
</dt-stack>
<dt-stack direction="column" gap="500">
<iframe style="border: 0px solid rgba(0, 0, 0, 0.1); border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-25744&viewport=-1055%2C122%2C0.69&t=iCwsUiY6dBufHiTQ-8&scaling=min-zoom&starting-point-node-id=5%3A25744&hotspot-hints=0&hide-ui=1"></iframe>
<p class="d-body-base d-fc-tertiary">This button has a fixed `height`, a `min-width` and grows horizontally depending on its content.</p>
</dt-stack>
</div>

### Responsiveness

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">
<div>

Adapting to different devices, sizes should be fluid across breakpoints. While most Dialtone components are responsive, their fluidity depends on the layout they live within.

</div>
<dt-stack class="d-gc2" direction="column" gap="500">
<div>
<iframe style="border: 0px solid rgba(0, 0, 0, 0.1); border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-25679&viewport=-722%2C-310%2C0.54&t=rVgNK5NwIXaPxkHq-8&scaling=min-zoom&starting-point-node-id=5%3A25663&hotspot-hints=0&hide-ui=1"></iframe>
</div>
</dt-stack>
</div>

### Accessibility

<div class="d-d-grid d-gg24 d-g-cols1 md:d-g-cols1">

To ensure clickable and interactive areas are easily accessible, we recommend a minimum area of `var(--dt-size-300)`, except for links within text. In Dialtone we've applied these to components such as buttons, toggles, checkboxes, radio buttons, dropdowns, and inputs.

</div>

## Tokens

Here are some frequently used tokens. For a complete list, visit the [Size Tokens](/tokens/sizing/) section.

<token-table category="size" :tokenList="tokenList" />

WIP: Tokens decriptions/usage in progress.

**Note:** By Feb 2024, we aim to integrate **sizing** units into Figma Variables. This will simplify the process of setting these tokens on width, min-width, height, min-height in your Figma files, making it easier for engineers to obtain the correct variable for each case.

## Key Takeaways

- Use predefined tokens, they help maintain consistency and make it easier to update designs.
- Keep sizes and spacing consistent: This ensures a polished look across all devices.

<script setup>
import { ref } from 'vue';
const tokenList = {
  'var(--dt-size-300)': { description: '' },
  'var(--dt-size-450)': { description: '' },
  'var(--dt-size-400)': { description: '' },
  'var(--dt-size-500)': { description: '' },
  'var(--dt-size-550)': { description: '' },
  'var(--dt-size-600)': { description: '' },
};

  const sizeValues = [
    { value: 'var(--dt-size-720)', label: 'var(--dt-size-720)' },
    { value: 'var(--dt-size-800)', label: 'var(--dt-size-800)' },
    { value: 'var(--dt-size-825)', label: 'var(--dt-size-825)' },
  ];

  const selectedSize = ref('var(--dt-size-720)');

  const changeBoxSize = (newSize) => {
    selectedSize.value = newSize;
  };
</script>
