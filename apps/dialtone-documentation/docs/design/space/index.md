---
title: Space
description: Define paddings, gaps, and margins around elements.
figma_url: https://www.figma.com/design/VjrRh4vvfONSmBQxnZrL3u/DT9-Design-Tokens--Rebrand-2025-?node-id=3746-13427&t=D8g6K4TrMGXNsvLT-11
---

<svg-loader name="space-img" />

## Choosing Space vs. Size

### Space

Spacing design tokens focus on controlling **spatial relationships**; that is, the space between and around elements. Example CSS properties they correspond to: `padding`, `margin`, `gap`

### Size

[Size](/design/size/index.md) design tokens define intrinsic **dimensions** of UI components. Example CSS properties they correspond to: `width`, `height`, `border-radius`, `border-width`, positioning properties, i.e. `top`, `left`, etc.

## Usage

Use spacing units, when [stacking elements](#stacking) or when adding [padding](#padding) or margin.

When setting the scale of an element, use [Size](/design/size/index.md) units.

### Setting a Specific Spacing

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3">

<div>

When setting the gap between elements, utilize [Space Tokens](#tokens) for the gap value.

👍 `gap: var(--dt-space-400)`

👎 `gap: var(--dt-size-400)`
</div>
<div class="d-gc2">
<code-well-header>
  <div class="d-d-grid d-g24 d-g-cols2 md:d-g-cols1 d-w100p">
    <div class="d-d-flex d-fd-row" :style="{ gap: selectedSpace }">
      <div class="d-fl-center d-ba d-bc-default d-w100p">
        Element A
      </div>
      <div class="d-fl-center d-ba d-bc-default d-w100p">
        Element B
      </div>
    </div>
    <dt-select-menu label="Gap" :options="spaceValues" @change="changeSpace" />
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

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3">
<div>

When adding space between elements, both vertically and horizontally, we can use either `space-between` or `gap` to define the space that separates each element. The value is set as a variable in Figma and as a token in code.

- For gaps inside a box/container, such as between headings, text, and buttons, use values like `var(--dt-space-0)` to `var(--dt-space-550)`
- For spaces between different boxes/containers on a page, choose values from `var(--dt-space-600)` to `var(--dt-space-700)`

</div>
 <dt-stack direction="column" gap="500">
  <iframe class="d-bgc-contrast" style="border: 0px; border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-15958&viewport=702%2C117%2C0.97&t=LxszUdOGsEU9l3I5-8&scaling=min-zoom&starting-point-node-id=5%3A15958&hotspot-hints=0&hide-ui=1"></iframe>
<div>
<p class="d-fw-bold">Vertical stacking</p>
<p class="d-body--md d-fc-tertiary">Set the space-between/gap groups vertically.</p>
</div>
  </dt-stack>
  <dt-stack direction="column" gap="500">
  <iframe class="d-bgc-contrast" style="border: 0px; border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-15997&viewport=702%2C117%2C0.97&t=LxszUdOGsEU9l3I5-8&scaling=min-zoom&starting-point-node-id=5%3A15997&hotspot-hints=0&hide-ui=1"></iframe>
  <div>
  <p class="d-fw-bold">Horizontal stacking</p>
  <p class="d-body--md d-fc-tertiary">Set the space-between/gap groups horizontally.</p>
  </div>
  </dt-stack>
</div>

### Padding

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3">
<div>

When adding space around an element, use `padding` to create breathing room.

Avoid using `margin`, which adds space outside the element and can affect the layout, in that case, follow the [stacking](#stacking) approach.

</div>
<dt-stack class="d-gc2" direction="column" gap="500">

 <iframe class="d-bgc-contrast" style="border: 0px; border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-16168&viewport=702%2C117%2C0.97&t=LxszUdOGsEU9l3I5-8&scaling=min-zoom&starting-point-node-id=5%3A16168&hotspot-hints=0&hide-ui=1"></iframe>
<div>
<p class="d-body--md d-fc-tertiary">Padding can be measured vertically and horizontally.</p>
</div>
</dt-stack>
</div>

## Visual Guides

### Grouping

<div class="d-d-grid d-g16 d-g-cols1 md:d-g-cols3" >
  <div>
<dt-stack direction="column" gap="400">
<p>Group and adjust the distance between elements to guide users understanding of their relationships. Closer elements appear more connected, while larger gaps indicate less association.</p>
<p class="d-body--md">Consistent and intentional spacing decisions across pages create a predictable layout, reducing cognitive load and allowing users to focus on the content rather than the layout.</p>
    </dt-stack>
  </div>
  <dt-stack class="d-gc2" direction="column" gap="500">
    <iframe class="d-bgc-contrast" style="border: 0px; border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-16175&viewport=702%2C117%2C0.97&t=LxszUdOGsEU9l3I5-8&scaling=min-zoom&starting-point-node-id=5%3A16175&hotspot-hints=0&hide-ui=1"></iframe>
    <p class="d-body--md d-fc-tertiary">
    <strong>Proximity groups</strong> are formed by placing elements close together. <strong>Delimited groups,</strong> on the other hand, are defined by clear visual boundaries, such as borders.
    </p>
    </dt-stack>
</div>

### Guiding the Eye

<div class="d-d-grid d-g16 d-g-cols1 md:d-g-cols3" >
  <div>
    <dt-stack direction="column" gap="400">
      <div>
        <p>Control the amount of space around an element to affect its visual importance. Use larger spaces for more prominent elements and smaller for those of lower importance. Keep in mind the position of the elements will benefit the order of reading.
      </p>
      </div>
      <div>
        <p class="d-body--md">The empty areas around elements provide visual breathing room, enhancing readability and contrast.</p>
      </div>
    </dt-stack>
  </div>
  <div class="d-gc2">
    <iframe class="d-bgc-contrast" style="border: 0px; border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FQe6cz41vPBozP4PhgGqFin/Docs-Protos?page-id=0%3A1&type=design&node-id=5-16225&viewport=702%2C117%2C0.97&t=LxszUdOGsEU9l3I5-8&scaling=min-zoom&starting-point-node-id=5%3A16225&hotspot-hints=0&hide-ui=1"></iframe>
    </div>
</div>

## Tokens

Here are some frequently used tokens, don't use values outside the recommended range for specific types of spacing. For a complete list, visit the [Spacing Tokens](/tokens/index.md#space) section.

<token-table category="space" :tokenList="true" :tokens="tokens" theme="light" />

## Key Takeaways

- Use predefined tokens, they help maintain consistency and make it easier to update designs.
- Consider the overall composition and whitespace to create well-proportioned layouts.
- Ensure consistent spacing across various screen sizes and breakpoints.
- Keep spacing consistent: This ensures a polished look across all devices.

**🌟 Design Tip:** Optimize your workflow in Figma by setting the nudge amount to 4px or 8px. It's a small change that can make a big difference in ease of use!

<script setup>
import { ref } from 'vue';
import tokensJson from '@dialpad/dialtone-tokens/dist/doc.json';
import SvgLoader from '../../../../baseComponents/SvgLoader.vue';

const spaces = {
  "space/0": { description: 'Default space between elements.' },
  "space/200": { description: 'Horizontal stack Icon + Text, Vertical stack List group.' },
  "space/300": {},
  "space/400": {},
  "space/450": {},
  "space/500": {},
  "space/550": {},
  "space/600": {},
  "space/650": {}
};
const theme = "base-light";
const tokens = Object.keys(tokensJson[theme] ?? {}).reduce((acc, curr) => {
  if (Object.keys(spaces).includes(curr)) {
    const { name, value, description } = tokensJson[theme][curr]["css/variables"];
    acc.push({
      name,
      tokenValue: value,
      description: spaces[curr].description || description,
      exampleValue: value,
      exampleName: name,
    });
  }
  return acc;
}, []);

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
