# CSS Utilities

A utility-first CSS framework for building user interfaces.

- **Keywords**: utility classes, helper classes, css helpers

## Introduction

Utilities – also known as “trumps,” “helper classes,” or “alterations” – are high-specificity selectors for making very targeted alterations to existing elements or components.

Each utility is a small, <a class="d-link" href="https://css-tricks.com/lets-define-exactly-atomic-css/" target="_blank">atomic style</a> declaration that, when chained together, should mitigate most situations in which custom CSS must be written. Just write these classes right in your mark-up and you're all set!

Most utilities come with responsive options, enabling alterations at targeted screen size ranges. For example, “small padding on smaller screens, larger padding on bigger screens.”

While an atomic CSS approach comes with many advantages, we recognize it also offers a notable disadvantage: reducing the CSS cascade. This is especially true for repeated UI elements, which can end up creating redundant mark-up. For these instances, Dialtone offers components.

## Example

### Border Top

`d-bt` applies a border (`b`) to the top (`t`) side. 1px is the default width, and the color is inherited from the foreground color (`currentColor`).

```html
<div class="d-bt">
  <dt-text>Box</dt-text>
</div>
```

### Border Top Width

`d-btw4` applies a 4px (`4`) width (`w`) to the top (`t`).

```html
<div class="d-bt d-btw4">
  <dt-text>Box</dt-text>
</div>
```

### Border Color

`d-bc-critical` applies a [critical](/design/colors/index.md#borders) border (`b`) color (`c`).

```html
<div class="d-bt d-btw4 d-bc-critical">
  <dt-text>Box</dt-text>
</div>
```

## Tutorial

A basic example styling a container by combining Dialtone's CSS utilities. Follow each step with this [Codepen template.](https://codepen.io/pen?template=dyKvvZB)

### 1. Begin with an Unstyled Container

```html
<div>
  <dt-text>Box</dt-text>
</div>
```

### 2. Apply an Inverted Background Color

Apply a [**Primary Inverted** Surface Color](./backgrounds/color.md#classes).

```html
<div class="d-bgc-primary-inverted">
  <dt-text>Box</dt-text>
</div>
```

### 3. Apply Color to the Foreground Text

Since this will be primary content on a dark surface, let's use `d-fc-primary-inverted` from the [font color utilities](./typography/color.md).

```html
<div class="d-bgc-primary-inverted d-fc-primary-inverted">
  <dt-text>Box</dt-text>
</div>
```

### 4. Apply Some Padding

Let's use `d-p8` padding for all four sides, from the list of [padding utility classes](./spacing/padding.md).

```html
<div class="d-bgc-primary-inverted d-fc-primary-inverted d-p8">
  <dt-text>Box</dt-text>
</div>
```

### 5. List a Bunch of Boxes

Let's repeat them in a [Stack](../components/stack.md) component. Note that I've moved the surface and foreground colors to the parent container so they may inherit.

```html
<dt-stack class="d-bgc-primary-inverted d-fc-primary-inverted">
  <div class="d-p8">
    <dt-text>Box 1</dt-text>
  </div>
  <div class="d-p8">
    <dt-text>Box the 2nd</dt-text>
  </div>
  <div class="d-p8">
    <dt-text>Box third</dt-text>
  </div>
  <div class="d-p8">
    <dt-text>Box IV</dt-text>
  </div>
</dt-stack>
```

### 6. Render Them Horizontally

Let's add the `direction` prop to make them flow horizontally.

```html
<dt-stack direction="row" class="d-bgc-primary-inverted d-fc-primary-inverted">
  <div class="d-p8">
    <dt-text>Box 1</dt-text>
  </div>
  <div class="d-p8">
    <dt-text>Box the 2nd</dt-text>
  </div>
  <div class="d-p8">
    <dt-text>Box third</dt-text>
  </div>
  <div class="d-p8">
    <dt-text>Box IV</dt-text>
  </div>
</dt-stack>
```

### 7. Add Borders to Segment Each

Add a border between each item with `d-divide-x`. Its default color is `currentColor`.

```html
<dt-stack direction="row" class="d-bgc-primary-inverted d-fc-primary-inverted d-divide-x">
  <div class="d-p8">
    <dt-text>Box 1</dt-text>
  </div>
  <div class="d-p8">
    <dt-text>Box the 2nd</dt-text>
  </div>
  <div class="d-p8">
    <dt-text>Box third</dt-text>
  </div>
  <div class="d-p8">
    <dt-text>Box IV</dt-text>
  </div>
</dt-stack>
```

### 8. And Change the Border Color

Since the border color inherits the color of the parent's foreground (implicitly `currentColor`), let's soften it with a bold inverted border color `d-divide-moderate-inverted`.

```html
<dt-stack direction="row" class="d-bgc-primary-inverted d-fc-primary-inverted d-divide-x d-divide-moderate-inverted">
  <div class="d-p8">
    <dt-text>Box 1</dt-text>
  </div>
  <div class="d-p8">
    <dt-text>Box the 2nd</dt-text>
  </div>
  <div class="d-p8">
    <dt-text>Box third</dt-text>
  </div>
  <div class="d-p8">
    <dt-text>Box IV</dt-text>
  </div>
</dt-stack>
```

### 9. How about some icons

Add some [icons](/design/icons/index.md).

```html
<dt-stack direction="row" class="d-bgc-primary-inverted d-fc-primary-inverted d-divide-x d-divide-moderate-inverted">
  <dt-stack direction="row" gap="400" class="d-p8">
    <dt-icon name="alert-triangle" size="200" />
    <dt-text>Box 1</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="400" class="d-p8">
    <dt-icon name="info" size="200" />
    <dt-text>Box the 2nd</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="400" class="d-p8">
    <dt-icon name="alert-circle" size="200" />
    <dt-text>Box third</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="400" class="d-p8">
    <dt-icon name="check-circle" size="200" />
    <dt-text>Box IV</dt-text>
  </dt-stack>
</dt-stack>
```

### 10. Let's use some real color

Apply a [semantic surface color](./backgrounds/color.md) to convey some meaning to them, e.g. `d-bgc-critical-strong`.

```html
<dt-stack direction="row" gap="400" class="d-fc-primary-inverted">
  <dt-stack direction="row" gap="400" class="d-bgc-critical-strong d-p8">
    <dt-icon name="alert-triangle" size="200" />
    <dt-text>Critical</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="400" class="d-bgc-info-strong d-p8">
    <dt-icon name="alert-circle" size="200" />
    <dt-text>Info</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="400" class="d-bgc-success-strong d-p8">
    <dt-icon name="check-circle" size="200" />
    <dt-text>Success</dt-text>
  </dt-stack>
</dt-stack>
```

### 11. Apply a text style

Use the [DtText](../components/text.md) component for text styling. It provides a semantic, prop-driven API for typography.

```html
<dt-stack direction="row" gap="400" class="d-fc-primary-inverted">
  <dt-stack direction="row" gap="400" class="d-bgc-critical-strong d-p8">
    <dt-icon name="alert-triangle" size="200" />
    <dt-text kind="label" size="sm">Critical</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="400" class="d-bgc-info-strong d-p8">
    <dt-icon name="alert-circle" size="200" />
    <dt-text kind="label" size="sm">Info</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="400" class="d-bgc-success-strong d-p8">
    <dt-icon name="check-circle" size="200" />
    <dt-text kind="label" size="sm">Success</dt-text>
  </dt-stack>
</dt-stack>
```

### 12. Tweak the spacing

Refine the spacing by adjusting the [Stack](../components/stack.md) `gap` prop and padding utilities for horizontal and vertical padding.

```html
<dt-stack direction="row" gap="400" class="d-fc-primary-inverted">
  <dt-stack direction="row" gap="300" class="d-bgc-critical-strong d-py4 d-px8">
    <dt-icon name="alert-triangle" size="200" />
    <dt-text kind="label" size="sm">Critical</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="300" class="d-bgc-info-strong d-py4 d-px8">
    <dt-icon name="alert-circle" size="200" />
    <dt-text kind="label" size="sm">Info</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="300" class="d-bgc-success-strong d-py4 d-px8">
    <dt-icon name="check-circle" size="200" />
    <dt-text kind="label" size="sm">Success</dt-text>
  </dt-stack>
</dt-stack>
```

### 13. Round it out!

Add `d-bar4` to each item for subtle rounded corners.

```html
<dt-stack direction="row" gap="400" class="d-fc-primary-inverted">
  <dt-stack direction="row" gap="300" class="d-bar4 d-bgc-critical-strong d-py4 d-px8">
    <dt-icon name="alert-triangle" size="200" />
    <dt-text kind="label" size="sm">Critical</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="300" class="d-bar4 d-bgc-info-strong d-py4 d-px8">
    <dt-icon name="alert-circle" size="200" />
    <dt-text kind="label" size="sm">Info</dt-text>
  </dt-stack>
  <dt-stack direction="row" gap="300" class="d-bar4 d-bgc-success-strong d-py4 d-px8">
    <dt-icon name="check-circle" size="200" />
    <dt-text kind="label" size="sm">Success</dt-text>
  </dt-stack>
</dt-stack>
```

### Keep Exploring!

View the final result in this [Codepen template](https://codepen.io/pen?template=XWYMMRY). Continue to explore using the variety of CSS utilities listed here.

## Pages

### Backgrounds
- [Background Attachment](./backgrounds/attachment.md)
- [Background Clip](./backgrounds/clip.md)
- [Background Color](./backgrounds/color.md)
- [Background Position](./backgrounds/position.md)
- [Background Repeat](./backgrounds/repeat.md)
- [Background Size](./backgrounds/size.md)
- [Gradients](./backgrounds/gradients.md)
- [Patterns](./backgrounds/patterns.md)

### Borders
- [Border Color](./borders/color.md)
- [Border Direction](./borders/direction.md)
- [Border Radius](./borders/radius.md)
- [Border Style](./borders/style.md)
- [Border Width](./borders/width.md)
- [Divide Color](./borders/divide-color.md)
- [Divide Width](./borders/divide-width.md)

### Effects & Transitions
- [Box Shadow](./effects/box-shadow.md)
- [Opacity](./effects/opacity.md)
- [Transition](./effects/transition.md)

### Flex
- [Align Content](./flex/align-content.md)
- [Align Items](./flex/align-items.md)
- [Align Self](./flex/align-self.md)
- [Columns and Gaps](./flex/columns-layouts.md)
- [Direction, Wrap, and Flow](./flex/direction-wrap-flow.md)
- [Flex, Grow, and Shrink](./flex/flex-grow-shrink.md)
- [Gap](./flex/gap.md)
- [Justify Content](./flex/justify.md)
- [Order](./flex/order.md)

### Grid
- [Columns](./grid/column-start-end-span.md)
- [Gap](./grid/gap.md)
- [Justify Items](./grid/justify-items.md)
- [Justify Self](./grid/justify-self.md)
- [Layouts](./grid/layouts.md)
- [Place Content](./grid/place-content.md)
- [Place Items](./grid/place-items.md)
- [Place Self](./grid/place-self.md)
- [Rows](./grid/row-start-end-span.md)

### Interactivity
- [Cursor](./interactivity/cursor.md)
- [Outline](./interactivity/outline.md)
- [Pointer Events](./interactivity/pointer-events.md)
- [Resize](./interactivity/resize.md)

### Layout
- [Box Sizing](./layout/box-sizing.md)
- [Coordinates](./layout/coordinates.md)
- [Display](./layout/display.md)
- [Overflow](./layout/overflow.md)
- [Position](./layout/position.md)
- [Visibility](./layout/visibility.md)
- [Z-Index](./layout/z-index.md)

### Responsive
- [Breakpoints](./responsive/breakpoints.md)

### Sizing
- [Height](./sizing/height.md)
- [Max Height](./sizing/max-height.md)
- [Min Height](./sizing/min-height.md)
- [Width](./sizing/width.md)
- [Max Width](./sizing/max-width.md)
- [Min Width](./sizing/min-width.md)

### Spacing
- [Auto Spacing](./spacing/auto-spacing.md)
- [Margin](./spacing/margin.md)
- [Padding](./spacing/padding.md)

### Typography
- [Styles](./typography/styles.md)
- [Font Color](./typography/font-color.md)
- [Font Family](./typography/font-family.md)
- [Font Size](./typography/font-size.md)
- [Font Style](./typography/font-style.md)
- [Font Variant Numeric](./typography/font-variant-numeric.md)
- [Font Weight](./typography/font-weight.md)
- [Line Height](./typography/line-height.md)
- [Line Clamp](./typography/line-clamp.md)
- [Lists](./typography/lists.md)
- [Text Alignment](./typography/text-align.md)
- [Text Decoration](./typography/text-decoration.md)
- [Text Opacity](./typography/text-opacity.md)
- [Text Overflow](./typography/text-overflow.md)
- [Text Transform](./typography/text-transform.md)
- [Vertical Alignment](./typography/vertical-align.md)
- [Whitespace](./typography/whitespace.md)
- [Word Break](./typography/word-break.md)
- [Word Wrap](./typography/word-wrap.md)
