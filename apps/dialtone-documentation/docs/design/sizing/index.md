---
title: Sizing
status: In progress
description: A system to maintain consistent size and scale.
---

## Usage

Use size units, when setting the scale of an element.

When adding space around on in between elements use [Spacing](/design/spacing/) units.

### Widths and Heights

<div class="d-d-grid d-gg24 d-g-cols3 md:d-g-cols1">
<dt-stack direction="column" gap="100">
<p>

For optimal responsiveness, we avoid using fixed `widths` or `heights` when defining element sizes. However, when setting a minimum dimensions, use `min-width` or `min-height`. This approach promotes flexibility and layout stability, key components of responsive design.

</p>
<p class="d-body-base d-fc-tertiary">
Some components that have fixed width/height: Avatar, Icon and Toggle.
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

To ensure clickable and interactive areas are easily accessible, we recommend a minimum area of `var(--dt-space-300)`, except for links within text. In Dialtone we've applied these to components such as buttons, toggles, checkboxes, radio buttons, dropdowns, and inputs.

</div>

## Tokens

Here are some frequently used tokens. For a complete list, visit the [Size Tokens](/tokens/sizing/) section.

<token-table category="size" :tokenList="tokenList" />

WIP: Tokens decriptions/usage in progress.

**Note:** By Feb 2024, we aim to integrate **sizing** units into Figma Variables. This will simplify the process of setting these tokens on width, min-width, height, min-height in your Figma files, making it easier for engineers to obtain the correct variable for each case.

## Key Takeaways

- Use predefined tokens, they help maintain consistency and make it easier to update designs.
- Keep sizes and spacing consistent: This ensures a polished look across all devices.
- Avoid using a fixed position for elements in your layouts. The more fluid your design, the better it will respond to different screen sizes.

<script setup>
const tokenList = {
  'var(--dt-size-300)': { description: '' },
  'var(--dt-size-450)': { description: '' },
  'var(--dt-size-400)': { description: '' },
  'var(--dt-size-500)': { description: '' },
  'var(--dt-size-550)': { description: '' },
  'var(--dt-size-600)': { description: '' },
};
</script>
