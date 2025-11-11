---
title: CSS Utilities
description: A utility-first CSS framework for building user interfaces.
---

## Introduction

Utilities – also known as “trumps,” “helper classes,” or “alterations” – are high-specificity selectors for making very targeted alterations to existing elements or components.

Each utility is a small, <a class="d-link" href="https://css-tricks.com/lets-define-exactly-atomic-css/" target="_blank">atomic style</a> declaration that, when chained together, should mitigate most situations in which custom CSS must be written. Just write these classes right in your mark-up and you're all set!

Most utilities come with responsive options, enabling alterations at targeted screen size ranges. For example, “small padding on smaller screens, larger padding on bigger screens.”

While an atomic CSS approach comes with many advantages, we recognize it also offers a notable disadvantage: reducing the CSS cascade. This is especially true for repeated UI elements, which can end up creating redundant mark-up. For these instances, Dialtone offers components.

## Example

### Border Top

`d-bt` applies a border (`b`) to the top (`t`) side. 1px is the default width, and the color is inherited from the foreground color (`currentColor`).

<code-well-header>
  <div class="d-bt">Box</div>
</code-well-header>

```html
<div class="d-bt">Box</div>
```

### Border Top Width

`d-btw4` applies a 4px (`4`) width (`w`) to the top (`t`).

<code-well-header>
  <div class="d-bt d-btw4">Box</div>
</code-well-header>

```html
<div class="d-bt d-btw4">Box</div>
```

### Border Color

`d-bc-critical` applies a [critical](/foundations/colors/usage/#borders) border (`b`) color (`c`).

<code-well-header>
  <div class="d-bt d-btw4 d-bc-critical">Box</div>
</code-well-header>

```html
<div class="d-bt d-btw4 d-bc-critical">Box</div>
```

## Tutorial

A basic example styling a container by combining Dialtone's CSS utilities. Follow each step with this [Codepen template.](https://codepen.io/pen?template=dyKvvZB)

### 1. Begin with an Unstyled Container

<code-well-header>
  <div>Box</div>
</code-well-header>

```html
<div>Box</div>
```

### 2. Apply a Dark Background Color

Apply a [**Primary Inverted** Surface Color](/utilities/backgrounds/color/index.md#classes).

<code-well-header>
  <div class="d-bgc-primary-inverted">Box</div>
</code-well-header>

```html
<div class="d-bgc-primary-inverted">Box</div>
```

### 3. Apply Color to the Foreground Text

Since this will be primary content on a dark surface, let's use `d-fc-primary-inverted` from the [font color utilities](/utilities/typography/color/index.md).

<code-well-header>
  <div class="d-bgc-primary-inverted d-fc-primary-inverted">Box</div>
</code-well-header>

```html
<div class="d-bgc-primary-inverted d-fc-primary-inverted">Box</div>
```

### 4. Apply Some Padding

Let's use `d-p8` padding for all four sides, from the list of [padding utility classes](/utilities/spacing/padding/index.md).

<code-well-header>
  <div class="d-bgc-primary-inverted d-fc-primary-inverted d-p8">Box</div>
</code-well-header>

```html
<div class="d-bgc-primary-inverted d-fc-primary-inverted d-p8">Box</div>
```

### 5. List a Bunch of Boxes

Let's repeat them in a [Stack](/components/stack.md) component. Note that I've moved the surface and foreground colors to the parent container so they may inherit.

<code-well-header>
  <dt-stack class="d-bgc-primary-inverted d-fc-primary-inverted">
    <div class="d-p8">Box 1</div>
    <div class="d-p8">Box the 2nd</div>
    <div class="d-p8">Box third</div>
    <div class="d-p8">Box IV</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack class="d-bgc-primary-inverted d-fc-primary-inverted">
  <div class="d-p8">Box 1</div>
  <div class="d-p8">Box the 2nd</div>
  <div class="d-p8">Box third</div>
  <div class="d-p8">Box IV</div>
</dt-stack>
```

### 6. Render Them Horizontally

Let's add the `direction` prop to make them flow horizontally.

<code-well-header>
  <dt-stack direction="row" class="d-bgc-primary-inverted d-fc-primary-inverted">
    <div class="d-p8">Box 1</div>
    <div class="d-p8">Box the 2nd</div>
    <div class="d-p8">Box third</div>
    <div class="d-p8">Box IV</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" class="d-bgc-primary-inverted d-fc-primary-inverted">
  <div class="d-p8">Box 1</div>
  <div class="d-p8">Box the 2nd</div>
  <div class="d-p8">Box third</div>
  <div class="d-p8">Box IV</div>
</dt-stack>
```

### 7. Add Borders to Segment Each

Add a border between each item with `d-divide-x`. Its default color is `currentColor`.

<code-well-header>
  <dt-stack direction="row" class="d-bgc-primary-inverted d-fc-primary-inverted d-divide-x">
    <div class="d-p8">Box 1</div>
    <div class="d-p8">Box the 2nd</div>
    <div class="d-p8">Box third</div>
    <div class="d-p8">Box IV</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" class="d-bgc-primary-inverted d-fc-primary-inverted d-divide-x">
  <div class="d-p8">Box 1</div>
  <div class="d-p8">Box the 2nd</div>
  <div class="d-p8">Box third</div>
  <div class="d-p8">Box IV</div>
</dt-stack>
```

### 8. And Change the Border Color

Since the border color inherits the color of the parent's foreground (implicitly `currentColor`), let's soften it with a bold inverted border color `d-divide-moderate-inverted`.

<code-well-header>
  <dt-stack direction="row" class="d-bgc-primary-inverted d-fc-primary-inverted d-divide-x d-divide-moderate-inverted">
    <div class="d-p8">Box 1</div>
    <div class="d-p8">Box the 2nd</div>
    <div class="d-p8">Box third</div>
    <div class="d-p8">Box IV</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" class="d-bgc-primary-inverted d-fc-primary-inverted d-divide-x d-divide-moderate-inverted">
  <div class="d-p8">Box 1</div>
  <div class="d-p8">Box the 2nd</div>
  <div class="d-p8">Box third</div>
  <div class="d-p8">Box IV</div>
</dt-stack>
```

### 9. How about some icons

Add some [icons](/foundations/icons/).

<code-well-header>
  <dt-stack direction="row" class="d-bgc-primary-inverted d-fc-primary-inverted d-divide-x d-divide-moderate-inverted">
    <dt-stack direction="row" gap="400" class="d-p8">
      <dt-icon name="alert-triangle" size="200" />
      Box 1
    </dt-stack>
    <dt-stack direction="row" gap="400" class="d-p8">
      <dt-icon name="info" size="200" />
      Box the 2nd
    </dt-stack>
    <dt-stack direction="row" gap="400" class="d-p8">
      <dt-icon name="alert-circle" size="200" />
      Box third
    </dt-stack>
    <dt-stack direction="row" gap="400" class="d-p8">
      <dt-icon name="check-circle" size="200" />
      Box IV
    </dt-stack>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" class="d-bgc-primary-inverted d-fc-primary-inverted d-divide-x d-divide-moderate-inverted">
  <dt-stack direction="row" gap="400" class="d-p8">
    <dt-icon name="alert-triangle" size="200" />
    Box 1
  </dt-stack>
  <dt-stack direction="row" gap="400" class="d-p8">
    <dt-icon name="info" size="200" />
    Box the 2nd
  </dt-stack>
  <dt-stack direction="row" gap="400" class="d-p8">
    <dt-icon name="alert-circle" size="200" />
    Box third
  </dt-stack>
  <dt-stack direction="row" gap="400" class="d-p8">
    <dt-icon name="check-circle" size="200" />
    Box IV
  </dt-stack>
</dt-stack>
```

### 10. Let's use some real color

Apply a [semantic surface color](/utilities/backgrounds/color.md) to convey some meaning to them, e.g. `d-bgc-critical-strong`.

<code-well-header>
  <dt-stack direction="row" gap="400" class="d-fc-primary-inverted">
    <dt-stack direction="row" gap="400" class="d-bgc-critical-strong d-p8">
      <dt-icon name="alert-triangle" size="200" />
      Critical
    </dt-stack>
    <dt-stack direction="row" gap="400" class="d-bgc-info-strong d-p8">
      <dt-icon name="alert-circle" size="200" />
      Info
    </dt-stack>
    <dt-stack direction="row" gap="400" class="d-bgc-success-strong d-p8">
      <dt-icon name="check-circle" size="200" />
      Success
    </dt-stack>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" gap="400" class="d-fc-primary-inverted">
  <dt-stack direction="row" gap="400" class="d-bgc-critical-strong d-p8">
    <dt-icon name="alert-triangle" size="200" />
    Critical
  </dt-stack>
  <dt-stack direction="row" gap="400" class="d-bgc-info-strong d-p8">
    <dt-icon name="alert-circle" size="200" />
    Info
  </dt-stack>
  <dt-stack direction="row" gap="400" class="d-bgc-success-strong d-p8">
    <dt-icon name="check-circle" size="200" />
    Success
  </dt-stack>
</dt-stack>
```

### 11. Apply an appropriate text style

Choose a [text style](/foundations/typography/). Text styles combine multiple text properties, i.e. `font size`, `font-family`, `font-weight`, etc.

<code-well-header>
  <dt-stack direction="row" gap="400" class="d-fc-primary-inverted">
    <dt-stack direction="row" gap="400" class="d-label--sm d-bgc-critical-strong d-p8">
      <dt-icon name="alert-triangle" size="200" />
      Critical
    </dt-stack>
    <dt-stack direction="row" gap="400" class="d-label--sm d-bgc-info-strong d-p8">
      <dt-icon name="alert-circle" size="200" />
      Info
    </dt-stack>
    <dt-stack direction="row" gap="400" class="d-label--sm d-bgc-success-strong d-p8">
      <dt-icon name="check-circle" size="200" />
      Success
    </dt-stack>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" gap="400" class="d-fc-primary-inverted">
  <dt-stack direction="row" gap="400" class="d-label--sm d-bgc-critical-strong d-p8">
    <dt-icon name="alert-triangle" size="200" />
    Critical
  </dt-stack>
  <dt-stack direction="row" gap="400" class="d-label--sm d-bgc-info-strong d-p8">
    <dt-icon name="alert-circle" size="200" />
    Info
  </dt-stack>
  <dt-stack direction="row" gap="400" class="d-label--sm d-bgc-success-strong d-p8">
    <dt-icon name="check-circle" size="200" />
    Success
  </dt-stack>
</dt-stack>
```

### 12. Tweak the spacing

Refine the spacing by adusting the [Stack](/components/stack.md) `gap` prop and padding utilities for horizontal and vertical padding.

<code-well-header>
  <dt-stack direction="row" gap="400" class="d-fc-primary-inverted">
    <dt-stack direction="row" gap="300" class="d-label--sm d-bgc-critical-strong d-py4 d-px8">
      <dt-icon name="alert-triangle" size="200" />
      Critical
    </dt-stack>
    <dt-stack direction="row" gap="300" class="d-label--sm d-bgc-info-strong d-py4 d-px8">
      <dt-icon name="alert-circle" size="200" />
      Info
    </dt-stack>
    <dt-stack direction="row" gap="300" class="d-label--sm d-bgc-success-strong d-py4 d-px8">
      <dt-icon name="check-circle" size="200" />
      Success
    </dt-stack>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" gap="400" class="d-fc-primary-inverted">
  <dt-stack direction="row" gap="300" class="d-label--sm d-bgc-critical-strong d-py4 d-px8">
    <dt-icon name="alert-triangle" size="200" />
    Critical
  </dt-stack>
  <dt-stack direction="row" gap="300" class="d-label--sm d-bgc-info-strong d-py4 d-px8">
    <dt-icon name="alert-circle" size="200" />
    Info
  </dt-stack>
  <dt-stack direction="row" gap="300" class="d-label--sm d-bgc-success-strong d-py4 d-px8">
    <dt-icon name="check-circle" size="200" />
    Success
  </dt-stack>
</dt-stack>
```

### 13. Round it out!

Add `d-bar4` to each item for subtle rounded corners.

<code-well-header>
  <dt-stack direction="row" gap="400" class="d-fc-primary-inverted">
    <dt-stack direction="row" gap="300" class="d-bar4 d-label--sm d-bgc-critical-strong d-py4 d-px8">
      <dt-icon name="alert-triangle" size="200" />
      Critical
    </dt-stack>
    <dt-stack direction="row" gap="300" class="d-bar4 d-label--sm d-bgc-info-strong d-py4 d-px8">
      <dt-icon name="alert-circle" size="200" />
      Info
    </dt-stack>
    <dt-stack direction="row" gap="300" class="d-bar4 d-label--sm d-bgc-success-strong d-py4 d-px8">
      <dt-icon name="check-circle" size="200" />
      Success
    </dt-stack>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" gap="400" class="d-fc-primary-inverted">
  <dt-stack direction="row" gap="300" class="d-bar4 d-label--sm d-bgc-critical-strong d-py4 d-px8">
    <dt-icon name="alert-triangle" size="200" />
    Critical
  </dt-stack>
  <dt-stack direction="row" gap="300" class="d-bar4 d-label--sm d-bgc-info-strong d-py4 d-px8">
    <dt-icon name="alert-circle" size="200" />
    Info
  </dt-stack>
  <dt-stack direction="row" gap="300" class="d-bar4 d-label--sm d-bgc-success-strong d-py4 d-px8">
    <dt-icon name="check-circle" size="200" />
    Success
  </dt-stack>
</dt-stack>
```

### Keep Exploring!

View the final result in this [Codepen template](https://codepen.io/pen?template=XWYMMRY). Continue to explore using the variety of CSS utilities listed here.
