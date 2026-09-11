---
title: Slider
description: A slider lets users select a numeric value — or a range of values — by dragging a thumb along a track. It is appropriate when approximate selection is more important than precision.
status: ready
thumb: true
image: assets/images/components/slider.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-slider--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-
keywords: ["range", "track", "thumb", "input range", "d-slider", "DtSlider", "dt-slider"]
---

<component-combinator component-name="DtSlider" />

## Usage

A slider is appropriate when the exact value is less important than the relative position within a range — volume, brightness, a budget cap, or a price filter. Users can drag the thumb or use keyboard navigation to adjust the value.

<dialtone-usage>
<template #do>

- Selecting an approximate value from a continuous range (volume, brightness, percentage).
- Filtering results by a numeric range where exact precision isn't critical (price, date offset).
- Adjusting values where the relative position matters more than the specific number.
</template>

<template #dont>

- When precise numeric input is required — use `DtInput` instead, or pair a slider with a companion input.
- When there are fewer than ~5 discrete choices — use `DtRadio` or `DtSelectMenu` instead.
- When mobile drag accuracy would be a concern for precision-sensitive contexts — pair range sliders with companion inputs showing the current values.
</template>

</dialtone-usage>

### Best Practices

- Always provide a visible `label` or pass `label-hidden` to keep an accessible label in the DOM for screen readers.
- For range sliders with two thumbs, pass a `getAriaValueText` callback that returns localized text distinguishing each thumb (e.g. `"Minimum: 20"` / `"Maximum: 70"`).
- Keep `min` and `max` values meaningful to the context. Label the scale so users understand what the numbers represent.
- Use `showTicks` together with `tickInterval` to indicate discrete stops on the track; avoid rendering more than ~20 ticks to prevent visual noise.
- Use `marks` to annotate key positions below the track. Pass an array of `{ value, text }` objects for custom text, a plain number array to label positions without custom text, or `true` to auto-generate marks at every tick position.

## Variants and Examples

### Single thumb

```vue demo
<dt-slider :model-value="50" label="Volume" />
```

### Range slider

```vue demo
<dt-slider :model-value="[20, 70]" label="Price range" />
```

### With start and end slots (aka left/right in LTR)

```vue demo
<!-- @wrapper -->
<dt-slider :model-value="60" label="Brightness">
  <template #start>
    <span aria-hidden="true">0%</span>
  </template>
  <template #end>
    <span aria-hidden="true">100%</span>
  </template>
</dt-slider>
```

### With ticks

`tickInterval` is independent of `step` — ticks are purely a visual overlay along the track and don't constrain where the thumb can actually stop. The two often match, but they don't have to.

When `tickInterval` equals `step`, every value the thumb can land on gets its own tick:

```vue demo
<dt-slider
  :model-value="7"
  label="Rating"
  :min="0"
  :max="10"
  :step="1"
  :tick-interval="1"
  show-ticks
/>
```

When they differ, ticks become checkpoints along a finer scale rather than a mark for every stop — the thumb still moves by `step`, ticks just call out the notable positions:

```vue demo
<dt-slider
  :model-value="42"
  label="Volume"
  :min="0"
  :max="100"
  :step="1"
  :tick-interval="25"
  show-ticks
/>
```

### Marks

Marks are text annotations placed below the track at specific positions, independent of ticks — use them together or separately.

Pass an array of numbers to label positions automatically:

```vue demo
<dt-slider
  :model-value="10"
  label="Temperature"
  :min="-20"
  :max="40"
  :marks="[-20, 0, 40]"
>
  <template #start>
    <span aria-label="cold">❄️</span>
  </template>
  <template #end>
    <span aria-label="hot">🔥</span>
  </template>
</dt-slider>
```

Pass `{ value, text }` objects when the label at a position isn't just the number itself — `value` still positions the mark on the track, but `text` can be any string:

```vue demo
<!-- @wrapper -->
<dt-stack gap="300" class="d-w100p">
  <dt-slider
    :model-value="2"
    label="Noise cancellation"
    :min="0"
    :max="4"
    :step="1"
    :marks="[{ value: 0, text: 'Off' }, { value: 1, text: 'Low' }, { value: 2, text: 'Medium' }, { value: 3, text: 'High' }, { value: 4, text: 'Max' }]"
  />
  <dt-slider
    :model-value="45"
    label="Trial length"
    :min="0"
    :max="90"
    :step="1"
    :marks="[{ value: 0, text: 'No trial' }, { value: 30, text: '30 days' }, { value: 60, text: '60 days' }, { value: 90, text: '90 days' }]"
  />
</dt-stack>
```

Combine marks with ticks for fully annotated steps — the two are independent, so a mark doesn't need a tick at the same position and vice versa:

```vue demo
<!-- @wrapper -->
<dt-stack gap="300" class="d-w100p">
  <dt-slider
    :model-value="0"
    label="Balance"
    :min="-100"
    :max="100"
    :marks="[{ value: -100, text: '−100' }, { value: 0, text: '0' }, { value: 100, text: '100' }]"
    show-ticks
    :tick-interval="25"
  />
  <dt-slider
    :model-value="7"
    label="Rating"
    :min="0"
    :max="10"
    :step="1"
    show-ticks
    :tick-interval="1"
    :marks="true"
  />
</dt-stack>
```

### Value tooltip

Set `tooltip` to display a floating label above each thumb showing its current value. Useful when the track context alone isn't enough to communicate the exact value.

- `always` — the tooltip is always visible.
- `never` (default) — no tooltip.
- `interaction` — the tooltip appears only while that thumb is hovered, dragged, or focused.

```vue demo
<!-- @wrapper -->
<dt-stack gap="300" class="d-w100p">
  <dt-slider :model-value="48" label="Volume" tooltip="always" />
  <dt-slider :model-value="48" label="Volume" tooltip="interaction" />
</dt-stack>
```

### Inverted fill direction

```vue demo
<dt-slider :model-value="40" label="Download limit" inverted />
```

### Fill from origin

Set `fill-origin` to a value within `[min, max]` and the indicator grows outward from that point toward the thumb, in either direction. Useful for balance controls (fill from center) or deviation-from-setpoint displays (fill from a target value on a signed scale).

```vue demo
<!-- @wrapper -->
<dt-stack gap="300" class="d-w100p">
  <dt-slider :model-value="65" label="Audio pan" :fill-origin="50" />
  <dt-slider
    :model-value="20"
    label="Balance"
    :min="-100"
    :max="100"
    :fill-origin="0"
    :marks="[{ value: -100, text: '−100' }, { value: 0, text: '0' }, { value: 100, text: '100' }]"
  />
</dt-stack>
```

### Disabled

```vue demo
<!-- @wrapper -->
<dt-stack gap="300" class="d-w100p">
  <dt-slider :model-value="30" label="Volume (disabled)" disabled />
  <dt-slider :model-value="[20, 80]" label="Price range (disabled)" disabled />
</dt-stack>
```

### Vertical orientation

```vue demo
<!-- @wrapper -->
<div class="d-d-flex d-g-600 d-h200">
  <dt-slider
    :model-value="60"
    label="Height"
    orientation="vertical"
  />
  <dt-slider
    :model-value="[30, 70]"
    label="Range vertical"
    orientation="vertical"
  />
</div>
```

### Visually hidden label

Use `label-hidden` when you have a visually obvious context but still need accessible text for screen readers.

```vue demo
<dt-slider :model-value="50" label="Volume" label-hidden />
```

### Sizes

```vue demo
<!-- @wrapper -->
<dt-stack gap="300" class="d-w100p">
  <dt-slider :model-value="50" label="Extra small (100)" :size="100" />
  <dt-slider :model-value="50" label="Small (200)" :size="200" />
  <dt-slider :model-value="50" label="Medium / default (300)" :size="300" />
  <dt-slider :model-value="50" label="Large (400)" :size="400" />
  <dt-slider :model-value="50" label="Extra large (500)" :size="500" />
</dt-stack>
```

## Accessibility

### Keyboard support

| Key | Action |
| --- | --- |
| Arrow Right / Arrow Up | Increase value by `step` |
| Arrow Left / Arrow Down | Decrease value by `step` |
| Home | Jump to `min` |
| End | Jump to `max` |
| Page Up | Increase value by `largeStep` (default 10) |
| Page Down | Decrease value by `largeStep` (default 10) |

### Screen reader behavior

- Each thumb is a native `<input type="range">` which carries `role="slider"` implicitly, along with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`.
- The component label is associated with each thumb via `aria-labelledby`. When `label-hidden` is true, the label element remains in the DOM (only visually hidden via `.d-vi-visible-sr`).
- For **range sliders**, provide the `getAriaValueText` prop to give each thumb a distinct, localized description:

```vue code-only
<dt-slider
  :model-value="[20, 70]"
  label="Price range"
  :get-aria-value-text="(value, index) => index === 0 ? `Minimum: $${value}` : `Maximum: $${value}`"
/>
```

- When the `start` or `end` slots contain icon-only content, add `aria-label` to each icon so the surrounding context is communicated to screen readers.

> [!INFO] Form submission in range mode
> In range mode, both `<input>` elements share the same `name` attribute. Retrieve both values server-side using `FormData.getAll(name)`, which returns `[low, high]` in DOM order.
