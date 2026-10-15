---
title: Slider
description: A slider lets users select a numeric value — or a range of values — by dragging a thumb along a track. It is appropriate when approximate selection is more important than precision.
status: new
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-slider--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-
keywords: ["range", "track", "thumb", "input range", "d-slider", "DtSlider", "dt-slider"]
combinator: DtSlider
---

## Usage

A slider is appropriate when the exact value is less important than the relative position within a range — volume, brightness, a budget cap, or a price filter. Users can drag the thumb or use keyboard navigation to adjust the value.

<dialtone-usage>
<template #do>

- Selecting an approximate value from a continuous range (volume, brightness, percentage).
- Filtering results by a numeric range where exact precision isn't critical (price, date offset).
</template>

<template #dont>

- When precise numeric input is required — use `DtInput` instead, or pair a slider with a companion input.
- For a small set of discrete choices, use `DtRadio` or `DtSelectMenu` instead.
</template>

</dialtone-usage>

### Best Practices

- Give the slider a clear label and distinguish the start and end values of a range.
- Keep `min` and `max` values meaningful to the context. Label the scale so users understand what the numbers represent.
- Pair the slider with a number input when users need precise entry, especially on touch devices.
- Space ticks and marks far enough apart to remain readable at the available width.
- Use a layout gap, such as `dt-stack`, when stacking sliders with other content.

## Variants and Examples

### Single thumb

```vue demo
<dt-slider :model-value="50" label="Volume" />
```

### Range slider

```vue demo
<dt-slider
  :model-value="[20, 70]"
  label="Price range"
  :show-marks="[{ value: 0, text: 'Min $0' }, { value: 100, text: 'Max $100' }]"
  :get-value-text="(value, index) => index === 0 ? `Minimum: $${value}` : `Maximum: $${value}`"
/>
```

Set `min-gap-steps` to keep a minimum separation between range values. The value gap is `minGapSteps * step`; for example, 5 steps of size 10 require a gap of 50:

```vue demo
<dt-slider
  :model-value="[20, 70]"
  label="Price range with a minimum gap"
  :min-gap-steps="10"
/>
```

### With companion inputs

Pair a range slider with number inputs for precise entry. Bind the slider to an array and each input to its corresponding start or end value.

```vue demo
<!-- @wrapper -->
<dt-stack gap="100" class="d-w100p" align="center">
  <dt-slider
    v-model="meetingHours"
    label="Meeting hours"
    :min="8"
    :max="18"
    :show-ticks="1"
    :min-gap-steps="1"
    :get-value-text="(value, index) => `${index === 0 ? 'Start' : 'End'}: ${value}:00`"
  />
  <dt-stack direction="row" gap="100" align="center">
    <dt-input
      v-model.number="meetingHours[0]"
      label-strength="medium"
      label-size="200"
      label="Start"
      type="number"
      :min="8"
      :max="meetingHours[1] - 1"
    />
    <dt-input
      v-model.number="meetingHours[1]"
      label-strength="medium"
      label-size="200"
      label="End"
      type="number"
      :min="meetingHours[0] + 1"
      :max="18"
    />
  </dt-stack>
</dt-stack>
```

> [!INFO] Form submission
> Set `name` to include the slider value in a form submission. In range mode, both values use the same name; retrieve them with `FormData.getAll(name)` in `[low, high]` order.

### With start and end slots (aka left/right)

```vue demo
<!-- @wrapper -->
<dt-slider :model-value="60" label="Brightness">
  <template #start>
    <dt-text variant="body-sm" aria-hidden="true">0%</dt-text>
  </template>
  <template #end>
    <dt-text variant="body-sm" aria-hidden="true">100%</dt-text>
  </template>
</dt-slider>
```

Emoji or icon-only content works the same way — give it an `aria-label` so the meaning still reaches screen readers:

```vue demo
<!-- @wrapper -->
<dt-slider :model-value="50" label="Mood">
  <template #start>
    <span role="img" aria-label="sad">😞</span>
  </template>
  <template #end>
    <span role="img" aria-label="happy">😄</span>
  </template>
</dt-slider>
```

### With ticks

A numeric `showTicks` value sets the tick interval. Ticks are visual guides; `step` determines the selectable increments.

Use `show-ticks` for a tick at every step, or pass a matching interval:

```vue demo
<dt-slider
  :model-value="3"
  label="Rating"
  :min="0"
  :max="10"
  :step="1"
  :show-ticks="1"
/>
```

Use a larger tick interval to highlight checkpoints while allowing finer adjustments:

```vue demo
<dt-slider
  :model-value="42"
  label="Volume"
  :min="0"
  :max="100"
  :step="1"
  :show-ticks="25"
/>
```

### Magnetic snapping

`snapPoints` attracts a dragged thumb to nearby values without restricting selection to those points. Snapping applies only to pointer dragging; keyboard changes follow `step` and `largeStep`. Formatters should handle values between snap points too.

Pass a number for an evenly spaced interval:

```vue demo
<dt-slider
  :model-value="62"
  label="Budget cap"
  :min="0"
  :max="100"
  :snap-points="25"
  :show-ticks="25"
  suffix="%"
/>
```

Pass an array for specific snap values:

```vue demo
<dt-slider
  :model-value="60"
  label="Zoom level"
  :min="10"
  :max="400"
  :snap-points="[25, 50, 75, 100, 150, 200, 300]"
  suffix="%"
/>
```

### Marks

Marks label positions below the track. Pass `true` to label the endpoints or an array of numbers to label specific values. Ticks can be added independently:

```vue demo
<dt-slider
  :model-value="10"
  label="Temperature"
  :min="-20"
  :max="40"
  :show-marks="[-20, 0, 40]"
  :show-ticks="10"
/>
```

Pass `{ value, text }` objects for custom labels. Use `getValueText` separately to format the readout and screen reader values:

```vue demo
<dt-slider
  :model-value="2"
  label="Noise cancellation"
  :min="0"
  :max="4"
  :step="1"
  :show-marks="[{ value: 0, text: 'Off' }, { value: 1, text: 'Low' }, { value: 2, text: 'Medium' }, { value: 3, text: 'High' }, { value: 4, text: 'Max' }]"
  :get-value-text="(value) => ['Off', 'Low', 'Medium', 'High', 'Max'][value]"
/>
```

### Value readout

Choose how to display each thumb's current value:

- `tooltip` (default) — shown on hover, drag, or focus. Useful in compact layouts.
- `always` — always visible below the track. Use when users need to see the value at a glance.
- `never` — hidden. Use when displaying the value elsewhere.

Tooltip readouts remain visible inside clipping containers and adjust near viewport edges. Keep formatted values brief to avoid clipping or overlap. In range mode, `always` readouts merge when the two values are close together.

```vue demo
<!-- @wrapper -->
<dt-stack gap="300" class="d-w100p">
  <dt-slider :model-value="48" label="Volume" />
  <dt-slider :model-value="48" label="Volume" readout="always" />
  <dt-slider :model-value="48" label="Volume" readout="never" />
</dt-stack>
```

Use `prefix` and `suffix` to add units to numeric marks, readouts, and screen reader values:

```vue demo
<dt-slider :model-value="58" label="Traffic split" suffix="%" />
```

For custom readout text, use `getValueText`; it overrides `prefix` and `suffix` for readouts and screen reader values, but does not format marks. See the [range slider](#range-slider) and [custom marks](#marks) examples.

To render the value somewhere custom outside the component instead, set `readout="never"` and drive your own display off the same `v-model`:

```vue demo
<!-- @wrapper -->
<dt-stack gap="200" class="d-w100p" align="center">
  <dt-slider v-model="externalReadoutValue" label="Zoom" :show-label="false" readout="never" />
  <dt-box border-width="100" padding="100" padding-inline="150" border-radius="400" border-color="subtle">
    <dt-text variant="body-sm" density="100" tone="tertiary">
      Zoom level is set to
      <dt-text strength="bold" tone="primary" numeric>{{ externalReadoutValue }}%</dt-text>
    </dt-text>
  </dt-box>
</dt-stack>
```

### Fill direction

Set `fill-origin` to `end` (aka right) to fill from the max end toward the thumb instead of the default `start` (aka left).

```vue demo
<dt-slider :model-value="40" label="Download limit" fill-origin="end" />
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
    :show-marks="[{ value: -100, text: '−100' }, { value: 0, text: '0' }, { value: 100, text: '100' }]"
  />
</dt-stack>
```

### Disabled

```vue demo
<dt-slider :model-value="30" label="Volume (disabled)" disabled />
```

### Vertical orientation

Set `orientation="vertical"` and use a height utility to customize the track length:

```vue demo
<!-- @class d-hmn-600 -->
<dt-slider
  :model-value="60"
  label="Height"
  orientation="vertical"
  class="d-h-600"
/>
```

### Visually hidden label

Use `:show-label="false"` when you have a visually obvious context but still need accessible text for screen readers.

```vue demo
<dt-slider :model-value="50" label="Volume" :show-label="false" />
```

### Custom label content

The `label` slot receives the current `value`: a number for a single thumb or a `[low, high]` array for a range.

```vue demo
<dt-slider :model-value="0" :min="-100" :max="100" :fill-origin="0">
  <template #label="{ value }">
    Balance &middot; {{ value }}
  </template>
</dt-slider>
```

## Accessibility

### Keyboard support

| Key | Action |
| --- | --- |
| Arrow Right / Arrow Up | Increase value by `step` |
| Arrow Left / Arrow Down | Decrease value by `step` |
| Home | Jump to `min` |
| End | Jump to `max` |
| Page Up / Shift + Arrow Right / Shift + Arrow Up | Increase by `largeStep` (default 10), adjusted to the step size |
| Page Down / Shift + Arrow Left / Shift + Arrow Down | Decrease by `largeStep` (default 10), adjusted to the step size |

> [!INFO] RTL support
> Set `dir="rtl"` on the slider or a parent to mirror the layout and horizontal keyboard navigation.

```vue demo
<dt-slider
  dir="rtl"
  :model-value="[20, 70]"
  label="Price range"
  :show-marks="[{ value: 0, text: 'Min $0' }, { value: 100, text: 'Max $100' }]"
  :get-value-text="(value, index) => index === 0 ? `Minimum: $${value}` : `Maximum: $${value}`"
/>
```

### Screen reader behavior

- Provide a `label`, `aria-label`, or `aria-labelledby` for an accessible name.
- With `show-label="false"`, keep the `label` prop for screen readers. A hidden custom `#label` slot requires an explicit `aria-label` or `aria-labelledby` instead.
- For range sliders, use `getValueText` to distinguish each thumb with localized text, such as “Minimum: $20” and “Maximum: $70”. See the [range slider example](#range-slider).
- Formatted readout values remain available to screen readers when the visual readout is hidden.
- When the `start` or `end` slots contain icon-only content, add `aria-label` to each icon so the surrounding context is communicated to screen readers.

## Vue API

<component-vue-api component-name="slider" />

<script setup>
import { ref } from 'vue';

const externalReadoutValue = ref(50);
const meetingHours = ref([9, 17]);
</script>
