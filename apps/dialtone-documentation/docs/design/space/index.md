---
title: Space
description: Define paddings, gaps, and margins around elements.
---

<svg-loader name="space-img" />

## Choosing Space vs Size

### Space

Spacing design tokens focus on controlling **spatial relationships**; that is, the space between and around elements. Example CSS properties they correspond to: `padding`, `margin`, `gap`

### Size

[Size](/design/size/) design tokens define intrinsic **dimensions** of UI components. Example CSS properties they correspond to: `width`, `height`, `border-radius`, `border-width`, positioning properties, i.e. `top`, `left`, etc.

## Usage

Use spacing units, when [stacking elements](#stacking) or when adding [padding](#padding) or margin.

When setting the scale of an element, use [Size](/design/sizing/) units.

### Setting a specific spacing

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">

<div>

When setting the gap between elements, utilize [Space Tokens](#tokens) for the gap value.

👍
`gap: var(--dt-space-400)`

👎
`gap: var(--dt-size-400)`
</div>
<div class="d-gc2">
<code-well-header>
  <div class="d-d-grid d-gg24 d-g-cols2 md:d-g-cols1 d-w100p">
    <div class="d-d-flex d-fd-row" :style="{ gap: selectedSpace }">
      <div class="d-fl-center d-ba d-bc-purple-400 d-w100p">
        Element A
      </div>
      <div class="d-fl-center d-ba d-bc-purple-400 d-w100p">
        Element B
      </div>
    </div>
    <dt-select-menu label="gap" :options="spaceValues" @change="changeSpace" />
  </div>
</code-well-header>

```html
<style>
.wrapper {
  gap: var(--dt-size-400);
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

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">
<div>

When adding space between elements, both vertically and horizontally, we can use either `space-between` or `gap` to define the space that separates each element. The value is set as a variable in Figma and as a token in code.

- For gaps inside a box/container, such as between headings, text, and buttons, use values like `var(--dt-space-0)` to `var(--dt-space-550)`
- For spaces between different boxes/containers on a page, choose values from `var(--dt-space-600)` to `var(--dt-space-700)`

</div>
 <dt-stack direction="column" gap="500">
  <iframe style="border: 0px; border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-15958&viewport=702%2C117%2C0.97&t=LxszUdOGsEU9l3I5-8&scaling=min-zoom&starting-point-node-id=5%3A15958&hotspot-hints=0&hide-ui=1"></iframe>
<div>
<p class="d-fw-bold">Vertical stacking</p>
<p class="d-body-base d-fc-tertiary">Set the space-between/gap groups vertically.</p>
</div>
  </dt-stack>
  <dt-stack direction="column" gap="500">
  <iframe style="border: 0px; border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-15997&viewport=702%2C117%2C0.97&t=LxszUdOGsEU9l3I5-8&scaling=min-zoom&starting-point-node-id=5%3A15997&hotspot-hints=0&hide-ui=1"></iframe>
  <div>
  <p class="d-fw-bold">Horizontal stacking</p>
  <p class="d-body-base d-fc-tertiary">Set the space-between/gap groups horizontally.</p>
  </div>
  </dt-stack>
</div>

### Padding

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">
<div>

When adding space around an element, use `padding` to create breathing room.

Avoid using `margin`, which adds space outside the element and can affect the layout, in that case, follow the [stacking](#stacking) approach.

</div>
<dt-stack class="d-gc2" direction="column" gap="500">

 <iframe style="border: 0px; border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-16168&viewport=702%2C117%2C0.97&t=LxszUdOGsEU9l3I5-8&scaling=min-zoom&starting-point-node-id=5%3A16168&hotspot-hints=0&hide-ui=1"></iframe>
<div>
<p class="d-body-base d-fc-tertiary">Padding can be measured vertically and horizontally.</p>
</div>
</dt-stack>
</div>

## Visual guides

### Grouping

<div class="d-d-grid d-gg16 d-g-cols3 md:d-g-cols1" >
  <div>
<dt-stack direction="column" gap="400">
<p>Group and adjust the distance between elements to guide users understanding of their relationships. Closer elements appear more connected, while larger gaps indicate less association.</p>
<p class="d-body-base">Consistent and intentional spacing decisions across pages create a predictable layout, reducing cognitive load and allowing users to focus on the content rather than the layout.</p>
    </dt-stack>
  </div>
  <dt-stack class="d-gc2" direction="column" gap="500">
    <iframe style="border: 0px; border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-16175&viewport=702%2C117%2C0.97&t=LxszUdOGsEU9l3I5-8&scaling=min-zoom&starting-point-node-id=5%3A16175&hotspot-hints=0&hide-ui=1"></iframe>
    <p class="d-body-base d-fc-tertiary">
    <strong>Proximity groups</strong> are formed by placing elements close together. <strong>Delimited groups,</strong> on the other hand, are defined by clear visual boundaries, such as borders.
    </p>
    </dt-stack>
</div>

### Guiding the eye

<div class="d-d-grid d-gg16 d-g-cols3 md:d-g-cols1" >
  <div>
    <dt-stack direction="column" gap="400">
      <div>
        <p>Control the amount of space around an element to affect its visual importance. Use larger spaces for more prominent elements and smaller for those of lower importance. Keep in mind the position of the elements will benefit the order of reading.
      </p>
      </div>
      <div>
        <p class="d-body-base">The empty areas around elements provide visual breathing room, enhancing readability and contrast.</p>
      </div>
    </dt-stack>
  </div>
  <div class="d-gc2">
    <iframe style="border: 0px; border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-16225&viewport=702%2C117%2C0.97&t=LxszUdOGsEU9l3I5-8&scaling=min-zoom&starting-point-node-id=5%3A16225&hotspot-hints=0&hide-ui=1"></iframe>
    </div>
</div>

## Tokens

Here are some frequently used tokens, don't use values outside the recommended range for specific types of spacing. For a complete list, visit the [Spacing Tokens](/tokens/spacing) section.

<token-table category="space" :tokenList="tokenList" />

WIP: Tokens decriptions/usage.

<DtNotice
  kind="info"
  title="Note"
  hideClose="true"
>
By Feb 2024, we aim to integrate spacing units into Figma Variables. This will simplify the process of setting these tokens on space-between and paddings within your elements in your Figma files, making it easier for engineers to obtain the correct variable for each case.
</DtNotice>

## Key Takeaways

- Use predefined tokens, they help maintain consistency and make it easier to update designs.
- Consider the overall composition and whitespace to create well-proportioned layouts.
- Ensure consistent spacing across various screen sizes and breakpoints.
- Keep spacing consistent: This ensures a polished look across all devices.

**🌟 Design Tip:** Optimize your workflow in Figma by setting the nudge amount to 4px or 8px. It's a small change that can make a big difference in ease of use!

<script setup>
import { ref } from 'vue';
import SvgLoader from '../../../../baseComponents/SvgLoader.vue';

const tokenList = {
  'var(--dt-space-0)': { description: 'Default space between elements.' },
  'var(--dt-space-200)': { description: 'Horizontal stack Icon + Text, Vertical stack List group.' },
  'var(--dt-space-300)': { },
  'var(--dt-space-400)': { },
  'var(--dt-space-450)': { },
  'var(--dt-space-500)': { },
  'var(--dt-space-550)': { },
  'var(--dt-space-600)': { },
  'var(--dt-space-650)': { },
};

const spaceValues = [
  { value: 'var(--dt-space-300)', label: 'var(--dt-space-300)' },
  { value: 'var(--dt-space-400)', label: 'var(--dt-space-400)' },
  { value: 'var(--dt-space-500)', label: 'var(--dt-space-500)' },
  { value: 'var(--dt-space-600)', label: 'var(--dt-space-600)' },
];

const selectedSpace = ref('var(--dt-space-200)');

const changeSpace = (newSpace) => {
  selectedSpace.value = newSpace;
};
</script>
