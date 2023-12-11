---
title: Spacing
status: In progress
description: The spacing units defines the paddings, gaps, and margins around interface elements.
---

## Usage

Use spacing units, when [stacking elements](#stacking) or when adding [padding](#padding) or margin.

When setting the scale of an element, use [Size](/design/sizing/) units.

### Stacking

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">

When adding space between elements, both vertically and horizontally, we can use either `space-between` or `gap` to define the space that separates each element. The value is set as a variable in Figma and as a token in code.

 <dt-stack direction="column" gap="500">
  <iframe style="border: 0px solid rgba(0, 0, 0, 0.1); border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FKun0him7tdf4i7oR9wjnH9/Dialtone-Web?page-id=915%3A8033&type=design&node-id=915-8431&viewport=398%2C188%2C0.69&t=6vK8RL1nGPsb99Nc-8&scaling=min-zoom&starting-point-node-id=915%3A8431&hotspot-hints=0&hide-ui=1"></iframe>
<div>
<p class="d-fw-bold">Vertical stacking</p>
<p class="d-body-base d-fc-tertiary">Set the space-between/gap groups vertically.</p>
</div>
  </dt-stack>
  <dt-stack direction="column" gap="500">
  <iframe style="border: 0px solid rgba(0, 0, 0, 0.1); border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FKun0him7tdf4i7oR9wjnH9/Dialtone-Web?page-id=915%3A8033&type=design&node-id=967-20985&viewport=506%2C417%2C0.64&t=JQtYzRgn0vnxMb00-8&scaling=min-zoom&starting-point-node-id=967%3A20985&hotspot-hints=0&hide-ui=1"></iframe>
  <div>
  <p class="d-fw-bold">Horizontal stacking</p>
  <p class="d-body-base d-fc-tertiary">Set the space-between/gap groups horizontally.</p>
  </div>
  </dt-stack>
</div>

### Padding

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">
<div>

When adding space around an element, use `padding` to create some breathing room.

Avoid using `margin`, which adds space outside the element and can affect the layout, in that case, follow the [stacking](#stacking) approach.

</div>
<dt-stack class="d-gc2" direction="column" gap="500">

 <iframe style="border: 0px solid rgba(0, 0, 0, 0.1); border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FKun0him7tdf4i7oR9wjnH9/Dialtone-Web?page-id=915%3A8033&type=design&node-id=1296-18759&viewport=363%2C11%2C0.59&t=Mz4eVpwafboXN0Vl-8&scaling=min-zoom&starting-point-node-id=1296%3A18759&hotspot-hints=0&hide-ui=1"></iframe>
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
<p class="d-body-base d-fc-tertiary">Consistent and intentional spacing decisions across pages create a predictable layout, reducing cognitive load and allowing users to focus on the content rather than the layout.</p>
    </dt-stack>
  </div>
  <dt-stack class="d-gc2" direction="column" gap="500">
    <iframe style="border: 0px solid rgba(0, 0, 0, 0.1); border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FKun0him7tdf4i7oR9wjnH9/Dialtone-Web?page-id=915%3A8033&type=design&node-id=1296-22361&viewport=363%2C11%2C0.59&t=Mz4eVpwafboXN0Vl-8&scaling=min-zoom&starting-point-node-id=1296%3A22361&hotspot-hints=0&hide-ui=1"></iframe>
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
        <p class="d-body-base d-fc-tertiary">The empty areas around elements provide visual breathing room, enhancing readability and contrast.</p>
      </div>
    </dt-stack>
  </div>
  <div class="d-gc2">
    <iframe style="border: 0px solid rgba(0, 0, 0, 0.1); border-radius: 8px" width="100%" height="320" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FKun0him7tdf4i7oR9wjnH9/Dialtone-Web?page-id=915%3A8033&type=design&node-id=1348-89968&viewport=566%2C-51%2C0.52&t=wUB7MrK2Vd0ojWxj-8&scaling=min-zoom&starting-point-node-id=1348%3A89968&hotspot-hints=0&hide-ui=1"></iframe>
    </div>
</div>

## Tokens

Here are some frequently used tokens. For a complete list, visit the [Spacing Tokens](/tokens/spacing) section.

<token-table category="space" :tokenList="tokenList" />

WIP: Tokens decriptions/usage in progress.

**Note:** By Feb 2024, we aim to integrate **spacing** units into Figma Variables. This will simplify the process of setting these tokens on space-between and paddings within your elements in your Figma files, making it easier for engineers to obtain the correct variable for each case.

## Key Takeaways

- Use predefined tokens, they help maintain consistency and make it easier to update designs.
- Keep sizes and spacing consistent: This ensures a polished look across all devices.
- Maintain a balanced visual hierarchy by using the modular scale for font, sizes and spacing.
- Consider the overall composition and whitespace to create well-proportioned layouts.
- Ensure consistent spacing across various screen sizes and breakpoints.

**🌟 Design Tip:** Optimize your workflow in Figma by setting the nudge amount to 4px or 8px. It's a small change that can make a big difference in ease of use!

<script setup>
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
</script>
