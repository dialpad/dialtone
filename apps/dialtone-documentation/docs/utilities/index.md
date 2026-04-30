---
title: CSS Utilities
description: A utility-first CSS framework for building user interfaces.
keywords: ["utility classes", "helper classes", "css helpers"]
thumb: true
---

## Introduction

Utilities – also known as "trumps," "helper classes," or "alterations" – are high-specificity selectors for making very targeted alterations to existing elements or components.

Each utility is a small, <a class="d-link" href="https://css-tricks.com/lets-define-exactly-atomic-css/" target="_blank">atomic style</a> declaration that, when chained together, should mitigate most situations in which custom CSS must be written. Just write these classes right in your mark-up and you're all set!

Most utilities come with responsive options, enabling alterations at targeted screen size ranges. For example, "small padding on smaller screens, larger padding on bigger screens."

While an atomic CSS approach comes with many advantages, we recognize it also offers a notable disadvantage: reducing the CSS cascade. This is especially true for repeated UI elements, which can end up creating redundant mark-up. For these instances, Dialtone offers components.

## Example

### Border Top

`d-bt` applies a border (`b`) to the top (`t`) side. 1px is the default width, and the color is inherited from the foreground color (`currentColor`).

```vue demo
<div class="d-bt">
  <dt-text>Box</dt-text>
</div>
```

### Border Top Width

`d-btw4` applies a 4px (`4`) width (`w`) to the top (`t`).

```vue demo
<div class="d-bt d-btw4">
  <dt-text>Box</dt-text>
</div>
```

### Border Color

`d-bc-critical` applies a [critical](/design/colors/index.md#borders) border (`b`) color (`c`).

```vue demo
<div class="d-bt d-btw4 d-bc-critical">
  <dt-text>Box</dt-text>
</div>
```

## Tutorial

A basic example styling a container by combining Dialtone's CSS utilities. Follow each step with this [Codepen template.](https://codepen.io/pen?template=dyKvvZB)

### 1. Begin with an Unstyled Container

```vue demo
<div>
  <dt-text>Box</dt-text>
</div>
```

### 2. Apply an Inverted Background Color

Apply a [**Primary Inverted** Surface Color](/utilities/backgrounds/color/index.md#classes).

```vue demo
<div class="d-bgc-primary-inverted">
  <dt-text>Box</dt-text>
</div>
```

### 3. Apply Color to the Foreground Text

Since this will be primary content on a dark surface, let's use `d-fc-primary-inverted` from the [font color utilities](/utilities/typography/color/index.md).

```vue demo
<div class="d-bgc-primary-inverted d-fc-primary-inverted">
  <dt-text>Box</dt-text>
</div>
```

### 4. Apply Some Padding

Let's use `d-p-100` padding for all four sides, from the list of [padding utility classes](/utilities/spacing/padding/index.md).

```vue demo
<div class="d-bgc-primary-inverted d-fc-primary-inverted d-p-100">
  <dt-text>Box</dt-text>
</div>
```

### 5. List a Bunch of Boxes

Let's repeat them in a [Stack](/components/stack.md) component. Note that I've moved the surface and foreground colors to the parent container so they may inherit.

```vue demo
<!-- @wrapper -->
<dt-stack class="d-bgc-primary-inverted d-fc-primary-inverted">
  <div class="d-p-100">
    <dt-text>Box 1</dt-text>
  </div>
  <div class="d-p-100">
    <dt-text>Box the 2nd</dt-text>
  </div>
  <div class="d-p-100">
    <dt-text>Box third</dt-text>
  </div>
  <div class="d-p-100">
    <dt-text>Box IV</dt-text>
  </div>
</dt-stack>
```

### 6. Render Them Horizontally

Let's add the `direction` prop to make them flow horizontally.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" class="d-bgc-primary-inverted d-fc-primary-inverted">
  <div class="d-p-100">
    <dt-text>Box 1</dt-text>
  </div>
  <div class="d-p-100">
    <dt-text>Box the 2nd</dt-text>
  </div>
  <div class="d-p-100">
    <dt-text>Box third</dt-text>
  </div>
  <div class="d-p-100">
    <dt-text>Box IV</dt-text>
  </div>
</dt-stack>
```

### 7. Add Borders to Segment Each

Add a border between each item with `d-divide-x`. Its default color is `currentColor`.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" class="d-bgc-primary-inverted d-fc-primary-inverted d-divide-x">
  <div class="d-p-100">
    <dt-text>Box 1</dt-text>
  </div>
  <div class="d-p-100">
    <dt-text>Box the 2nd</dt-text>
  </div>
  <div class="d-p-100">
    <dt-text>Box third</dt-text>
  </div>
  <div class="d-p-100">
    <dt-text>Box IV</dt-text>
  </div>
</dt-stack>
```

### 8. And Change the Border Color

Since the border color inherits the color of the parent's foreground (implicitly `currentColor`), let's soften it with a bold inverted border color `d-divide-moderate-inverted`.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" class="d-bgc-primary-inverted d-fc-primary-inverted d-divide-x d-divide-moderate-inverted">
  <div class="d-p-100">
    <dt-text>Box 1</dt-text>
  </div>
  <div class="d-p-100">
    <dt-text>Box the 2nd</dt-text>
  </div>
  <div class="d-p-100">
    <dt-text>Box third</dt-text>
  </div>
  <div class="d-p-100">
    <dt-text>Box IV</dt-text>
  </div>
</dt-stack>
```

### 9. How about some icons

Add some [icons](/design/icons/index.md).

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" class="d-bgc-primary-inverted d-fc-primary-inverted d-divide-x d-divide-moderate-inverted">
  <dt-stack direction="row" gap="100" class="d-p-100">
    <dt-icon name="alert-triangle" size="200" />
    <dt-text>Box 1</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="100" class="d-p-100">
    <dt-icon name="info" size="200" />
    <dt-text>Box the 2nd</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="100" class="d-p-100">
    <dt-icon name="alert-circle" size="200" />
    <dt-text>Box third</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="100" class="d-p-100">
    <dt-icon name="check-circle" size="200" />
    <dt-text>Box IV</dt-text>
  </dt-stack>
</dt-stack>
```

### 10. Let's use some real color

Apply a [semantic surface color](/utilities/backgrounds/color.md) to convey some meaning to them, e.g. `d-bgc-critical-strong`.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100" class="d-fc-primary-inverted">
  <dt-stack direction="row" gap="100" class="d-bgc-critical-strong d-p-100">
    <dt-icon name="alert-triangle" size="200" />
    <dt-text>Critical</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="100" class="d-bgc-info-strong d-p-100">
    <dt-icon name="alert-circle" size="200" />
    <dt-text>Info</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="100" class="d-bgc-positive-strong d-p-100">
    <dt-icon name="check-circle" size="200" />
    <dt-text>Positive</dt-text>
  </dt-stack>
</dt-stack>
```

### 11. Apply a text style

Use the [DtText](/components/text.html) component for text styling. It provides a semantic, prop-driven API for typography.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100" class="d-fc-primary-inverted">
  <dt-stack direction="row" gap="100" class="d-bgc-critical-strong d-p-100">
    <dt-icon name="alert-triangle" size="200" />
    <dt-text kind="label" :size="200">Critical</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="100" class="d-bgc-info-strong d-p-100">
    <dt-icon name="alert-circle" size="200" />
    <dt-text kind="label" :size="200">Info</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="100" class="d-bgc-positive-strong d-p-100">
    <dt-icon name="check-circle" size="200" />
    <dt-text kind="label" :size="200">Positive</dt-text>
  </dt-stack>
</dt-stack>
```

### 12. Tweak the spacing

Refine the spacing by adjusting the [Stack](/components/stack.md) `gap` prop and padding utilities for horizontal and vertical padding.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100" class="d-fc-primary-inverted">
  <dt-stack direction="row" gap="50" class="d-bgc-critical-strong d-py-50 d-px-100">
    <dt-icon name="alert-triangle" size="200" />
    <dt-text kind="label" :size="200">Critical</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="50" class="d-bgc-info-strong d-py-50 d-px-100">
    <dt-icon name="alert-circle" size="200" />
    <dt-text kind="label" :size="200">Info</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="50" class="d-bgc-positive-strong d-py-50 d-px-100">
    <dt-icon name="check-circle" size="200" />
    <dt-text kind="label" :size="200">Positive</dt-text>
  </dt-stack>
</dt-stack>
```

### 13. Round it out!

Add `d-bar-300` to each item for subtle rounded corners.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100" class="d-fc-primary-inverted">
  <dt-stack direction="row" gap="50" class="d-bar-300 d-bgc-critical-strong d-py-50 d-px-100">
    <dt-icon name="alert-triangle" size="200" />
    <dt-text kind="label" :size="200">Critical</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="50" class="d-bar-300 d-bgc-info-strong d-py-50 d-px-100">
    <dt-icon name="alert-circle" size="200" />
    <dt-text kind="label" :size="200">Info</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="50" class="d-bar-300 d-bgc-positive-strong d-py-50 d-px-100">
    <dt-icon name="check-circle" size="200" />
    <dt-text kind="label" :size="200">Positive</dt-text>
  </dt-stack>
</dt-stack>
```

### Keep Exploring!

View the final result in this [Codepen template](https://codepen.io/pen?template=XWYMMRY). Continue to explore using the variety of CSS utilities listed here.
