# Size and Space

A unified system for dimensions, spacing, and scale.

- **Keywords**: padding,gap,spacing,dimensions,scale

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

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3">
<div>

When assigning a size or spacing to an element, use [Size Tokens](#tokens).

```css
width: var(--dt-size-400);
padding: var(--dt-size-500);
gap: var(--dt-size-400);
```

</div>
<div class="d-gc2">

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

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3">

<div>

When setting the gap between elements, use size tokens for the gap value.

```css
gap: var(--dt-size-400);
```

</div>
<div class="d-gc2">

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

When adding space between elements, both vertically and horizontally, use either `space-between` or `gap` to define the space that separates each element.

- For gaps inside a box/container, such as between headings, text, and buttons, use values like `var(--dt-size-0)` to `var(--dt-size-550)`
- For spaces between different boxes/containers on a page, choose values from `var(--dt-size-600)` to `var(--dt-size-700)`

</div>
<div>
<strong>Vertical stacking</strong>
</div>
  <div>
  <strong>Horizontal stacking</strong>
  </div>
</div>

### Padding

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3">
<div>

When adding space around an element, use `padding` to create breathing room.

Avoid using `margin`, which adds space outside the element and can affect the layout. In that case, follow the [stacking](#stacking) approach.

</div>

<div>
</div>
</div>

### Widths and Heights

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3">
<p>

For optimal layout flexibility and responsiveness, generally avoid using fixed `widths` or `heights` when defining element sizes. Instead, use percentages values or set `min-width` or `min-height`. This allows the elements to adjust naturally to different screen sizes.

</p>
Exceptions exist for select elements like Avatars, Icons, and Toggles. These elements require fixed dimensions to maintain consistent scale across devices within flexible layouts.

<div>
</div>
</div>

### Variable Sizing

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3">
<div>

The size of some components is determined by their content. Most expand vertically, while a select few expand horizontally.

</div>
</div>

### Responsiveness

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols3">
<div>

Adapting to different devices, sizes should be fluid across breakpoints. While most Dialtone components are responsive, their fluidity depends on the layout they live within.

</div>
<div>
</div>
</div>

### Accessibility

<div class="d-d-grid d-g24 d-g-cols1 md:d-g-cols1">

To ensure clickable and interactive areas are easily accessible, we recommend a minimum area of `var(--dt-size-300)`, except for links within text. In Dialtone we've applied these to components such as buttons, toggles, checkboxes, radio buttons, dropdowns, and inputs.

</div>

## Visual Guides

### Grouping

<div class="d-d-grid d-g16 d-g-cols1 md:d-g-cols3" >
  <div>
<p>Group and adjust the distance between elements to guide users understanding of their relationships. Closer elements appear more connected, while larger gaps indicate less association.</p>
  </div>
</div>

### Guiding the Eye

<div class="d-d-grid d-g16 d-g-cols1 md:d-g-cols3" >
  <div>
      <div>
        <p>Control the amount of space around an element to affect its visual importance. Use larger spaces for more prominent elements and smaller for those of lower importance. Keep in mind the position of the elements will benefit the order of reading.
      </p>
      </div>
      <div>
      </div>
  </div>
  <div class="d-gc2">
    </div>
</div>

## Tokens

Here are some frequently used tokens. For a complete list, visit the [Size Tokens](../tokens/index.md#size) section.

## Key Takeaways

- Use predefined tokens for all dimensional values to maintain consistency and make it easier to update designs.
- Consider the overall composition and whitespace to create well-proportioned layouts.
- Ensure consistent sizing and spacing across various screen sizes and breakpoints.
- Keep sizes and spacing consistent: This ensures a polished look across all devices.

**Design Tip:** Optimize your workflow in Figma by setting the nudge amount to 4px or 8px. It's a small change that can make a big difference in ease of use!
