---
title: Slider
description: Control for selecting a value or range along a scale
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

- Give the slider a clear label; for range sliders, pass `getValueText` so each thumb's start/end value is distinguishable (e.g. `"Minimum: 20"` / `"Maximum: 70"`).
- Keep `min` and `max` values meaningful to the context. Label the scale so users understand what the numbers represent.
- Pair the slider with a number input when users need precise entry, especially on touch devices (see [With companion inputs](#with-companion-inputs)).
- Space ticks and marks far enough apart to remain readable at the available width — avoid more than ~20 ticks on a single track.
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

Set `min-gap-steps` to keep a minimum separation between range values. It's a number of steps, not a raw value gap — the actual minimum gap enforced between the thumbs' values is `minGapSteps * step`; for example, 5 steps of size 10 require a gap of 50:

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

A numeric `showTicks` interval is independent of `step` — ticks are purely a visual overlay along the track and don't constrain where the thumb can actually stop. The two often match, but they don't have to.

When the `showTicks` interval equals `step`, every value the thumb can land on gets its own tick — same as passing `show-ticks="true"`:

```vue demo
<dt-slider
  :model-value="7"
  label="Rating"
  :min="0"
  :max="10"
  :step="1"
  :show-ticks="1"
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
  :show-ticks="25"
/>
```

### Magnetic snapping

`step` is a hard restriction — the thumb can only ever land on a value in its grid. `snapPoints` is different: it pulls a dragged thumb toward nearby values, like the snapping in Figma or Photoshop, but a value just outside a fixed 10px radius along the track stays freely reachable. The pull is also sticky — once a thumb snaps onto a point, dragging away from it takes noticeably more distance than dragging onto it did, so it resists small jitter right at the boundary. It only affects pointer dragging — keyboard stepping via `step`/`largeStep` is unaffected.

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

Pass an array for arbitrary snap values — unlike an interval, they don't need to be evenly spaced:

```vue demo
<dt-slider
  :model-value="60"
  label="Zoom level"
  :min="10"
  :max="400"
  :snap-points="[25, 50, 75, 100, 150, 200, 300]"
  :get-value-text="(value) => `${value}%`"
  suffix="%"
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
  :show-marks="[-20, 0, 40]"
>
  <template #start>
    <span role="img" aria-label="cold">❄️</span>
  </template>
  <template #end>
    <span role="img" aria-label="hot">🔥</span>
  </template>
</dt-slider>
```

Pass `{ value, text }` objects when the label at a position isn't just the number itself — `value` still positions the mark on the track, but `text` can be any string. The readout doesn't read from `marks`, so pair it with `getValueText` or `suffix` to keep it consistent with what the marks say:

```vue demo
<!-- @wrapper -->
<dt-stack gap="300" class="d-w100p">
  <dt-slider
    :model-value="2"
    label="Noise cancellation"
    :min="0"
    :max="4"
    :step="1"
    :show-marks="[{ value: 0, text: 'Off' }, { value: 1, text: 'Low' }, { value: 2, text: 'Medium' }, { value: 3, text: 'High' }, { value: 4, text: 'Max' }]"
    :get-value-text="(value) => ['Off', 'Low', 'Medium', 'High', 'Max'][value]"
  />
  <dt-slider
    :model-value="45"
    label="Trial length"
    :min="0"
    :max="90"
    :step="1"
    :show-marks="[{ value: 0, text: 'No trial' }, { value: 30, text: '30 days' }, { value: 60, text: '60 days' }, { value: 90, text: '90 days' }]"
    :get-value-text="(value) => value === 1 ? '1 day' : `${value} days`"
  />
</dt-stack>
```

Marks and ticks are independent — a mark doesn't need a tick at the same position and vice versa, so dense ticks pair well with sparser marks:

```vue demo
<!-- @wrapper -->
<dt-stack gap="300" class="d-w100p">
  <dt-slider
    :model-value="0"
    label="Balance"
    :min="-100"
    :max="100"
    :show-marks="[{ value: -100, text: '−100' }, { value: 0, text: '0' }, { value: 100, text: '100' }]"
    :show-ticks="25"
  />
  <dt-slider
    :model-value="7"
    label="Rating"
    :min="0"
    :max="10"
    :step="1"
    :show-ticks="1"
    :show-marks="true"
  />
</dt-stack>
```

### Value readout

Set `readout` to show each thumb's current value. Useful when the track context alone isn't enough to communicate the exact value.

- `tooltip` (default) — a tooltip-styled bubble above the thumb, shown only while that thumb is hovered, dragged, or focused. It renders in the browser's top layer so ancestor overflow, clipping paths, and masks cannot cut it off. It shifts or flips near viewport edges and follows the thumb during dragging, scrolling, and resizing. Prefer it in space-constrained or dense layouts — it never reserves space below the slider the way `always` does, making it the right default for toolbars, side panels, and anywhere several sliders stack tightly.
- `always` — a readout below the track, always visible. Reach for this when the value needs to stay legible without any interaction — dashboards, read-mostly summaries, or sliders a user might glance at rather than operate.
- `never` — no readout. Use this when you're rendering the value yourself elsewhere on the page (see below).

> [!INFO] Floating readout
> The floating readout requires the native Popover API (Chrome/Edge 114+, Firefox 125+, Safari 17+). Browsers without this API do not display the floating readout; use `always` when a visible value is needed there. Each native range input still exposes the formatted value through `aria-valuetext`. The tooltip remains within its document's viewport and cannot escape an embedding iframe.
>
> Long values wrap and are clipped to the space available beside the thumb. The full formatted value remains available through `aria-valuetext`. The decorative bubble is noninteractive and never receives keyboard focus. It opens and closes immediately.
>
> Top-layer rendering is independent of ancestor opacity, filters, and stacking contexts. A readout can therefore appear above a sticky header or another overlay covering its thumb; ancestor opacity and filter effects do not apply to it.

In range mode with `always`, the two thumbs' readouts merge into a single centered `low–high` pill once they'd otherwise overlap as the thumbs converge.

```vue demo
<!-- @wrapper -->
<dt-stack gap="300" class="d-w100p">
  <dt-slider :model-value="48" label="Volume" />
  <dt-slider :model-value="48" label="Volume" readout="always" />
  <dt-slider :model-value="48" label="Volume" readout="never" />
</dt-stack>
```

Use `prefix`/`suffix` to decorate the raw number wherever it's displayed — the readout, marks, and each thumb's `aria-valuetext` all pick it up:

```vue demo
<dt-slider :model-value="58" label="Traffic split" suffix="%" />
```

For anything beyond a fixed prefix/suffix, pass `getValueText` — it takes precedence and receives the thumb index too, so range sliders can give each thumb distinct text:

```vue demo
<dt-slider
  :model-value="[20, 70]"
  label="Price range"
  :show-marks="[{ value: 0, text: 'Min $0' }, { value: 100, text: 'Max $100' }]"
  :get-value-text="(value, index) => index === 0 ? `Min $${value}` : `Max $${value}`"
/>
```

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
<!-- @wrapper -->
<dt-stack gap="300" class="d-w100p">
  <dt-slider :model-value="30" label="Volume (disabled)" disabled />
  <dt-slider
    :model-value="[20, 80]"
    label="Price range (disabled)"
    :get-value-text="(value, index) => index === 0 ? `Minimum: $${value}` : `Maximum: $${value}`"
    disabled
  />
</dt-stack>
```

### Vertical orientation

```vue demo
<!-- @wrapper -->
<!-- @class d-hmn-600 -->
<div class="d-d-flex d-g-600 d-hmn200">
  <dt-slider
    :model-value="60"
    label="Height"
    orientation="vertical"
  />
  <dt-slider
    :model-value="[30, 70]"
    label="Range vertical"
    orientation="vertical"
    :get-value-text="(value, index) => index === 0 ? `Min: ${value}` : `Max: ${value}`"
  />
</div>
```

Customize the track length with a CSS utility class directly on the component:

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

The `label` slot replaces the plain text label entirely — scoped with `value` (the live value, or `[low, high]` in range mode) so the label itself can echo the current value or any derived text:

```vue demo
<dt-slider :model-value="0" :min="-100" :max="100" :fill-origin="0">
  <template #label="{ value }">
    Balance &middot; {{ value }}
  </template>
</dt-slider>
```

```vue demo
<dt-slider
  :model-value="100"
  :min="25"
  :max="200"
  :step="25"
  :show-ticks="25"
>
  <template #label="{ value }">
    Playback speed &middot; {{ (value / 100).toFixed(2) }}×
  </template>
  <template #start>
    🐢
  </template>
  <template #end>
    🐇
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
| Page Up / Shift + Arrow Right / Shift + Arrow Up | Increase value by roughly `largeStep` (default 10), rounded to the nearest whole number of `step`s — always at least one |
| Page Down / Shift + Arrow Left / Shift + Arrow Down | Decrease value by roughly `largeStep` (default 10), rounded to the nearest whole number of `step`s — always at least one |

> [!INFO] RTL support
> The track, thumb, and indicator position with logical (inset-inline-start) values, so they mirror automatically under `dir="rtl"`. Pointer dragging and the Shift+Arrow/Page Up/Page Down keys are direction-aware too, matching the native `<input type="range">`'s own RTL-flipped Arrow key behavior.

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

- Each thumb is a native `<input type="range">` which carries `role="slider"` implicitly, along with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`.
- The component label is associated with each thumb via `aria-labelledby`. When `show-label` is `false`, the label is removed and the `label` prop's text is promoted to `aria-label` instead — the same pattern `DtInput`, `DtCheckbox`, `DtRadio`, and `DtSelectMenu` use. A slotted (non-string) `#label` can't be promoted this way, so pair a hidden `#label` slot with an explicit `aria-label` on the component.
- For **range sliders**, provide the `getValueText` prop to give each thumb a distinct, localized description:

```vue code-only
<dt-slider
  :model-value="[20, 70]"
  label="Price range"
  :get-value-text="(value, index) => index === 0 ? `Minimum: $${value}` : `Maximum: $${value}`"
/>
```

- When the `start` or `end` slots contain icon-only content, add `aria-label` to each icon so the surrounding context is communicated to screen readers.
- Formatted values remain available via `aria-valuetext` even when `readout="never"` hides the visual readout.

## Vue API

<component-vue-api component-name="slider" />

<script setup>
import { ref } from 'vue';

const externalReadoutValue = ref(50);
const meetingHours = ref([9, 17]);
</script>
