---
title: Progress Circle
description: A circular SVG progress indicator for determinate upload or processing progress.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-progress-circle--default
---

<component-combinator component-name="DtProgressCircle" />

## Usage

Use a progress circle to communicate deterministic progress to the user — for example, a file upload or media processing operation that reports a percentage complete.

<dialtone-usage>
<template #do>

- Use when you have a concrete progress value (0–100) to display
- Always provide a meaningful `aria-label` describing the operation
- Show the progress indicator only while an operation is active; remove it once complete

</template>
<template #dont>

- Don't use for indeterminate loading states — use [Loader](/components/loader.html) instead
- Don't omit the `aria-label`; it is required for screen reader accessibility

</template>
</dialtone-usage>

## Demo

```vue demo-only
<dt-stack gap="200" align="center">
  <dt-progress-circle size="800" :progress="demoProgress" :aria-label="`${demoProgress}% complete`" />
  <dt-stack direction="row" gap="100">
    <dt-button :size="200" kind="muted" importance="outlined" :disabled="atMin" @click="setProgress(0)">0%</dt-button>
    <dt-button :size="200" kind="muted" importance="outlined" :disabled="atMin" @click="setProgress(demoProgress - 10)">-10</dt-button>
    <dt-button :size="200" kind="muted" importance="outlined" :disabled="atMax" @click="setProgress(demoProgress + 10)">+10</dt-button>
    <dt-button :size="200" kind="muted" importance="outlined" :disabled="atMax" @click="setProgress(100)">100%</dt-button>
  </dt-stack>
</dt-stack>
```

## Variants

### Progress

```vue demo
<dt-stack direction="row" gap="200">
  <dt-stack v-for="v in [0, 25, 50, 75, 100]" :key="v" gap="200">
    <dt-progress-circle :progress="v" :aria-label="`${v}% complete`" />
  </dt-stack>
</dt-stack>
<!-- @code -->
<dt-progress-circle :progress="{value}" aria-label="{value} complete" />
```

### Sizes

The `size` prop controls the diameter of the progress circle, aligning to Dialtone icon sizes.

```vue demo
<dt-stack direction="row" gap="200">
  <dt-stack v-for="s in ['100', '200', '300', '400', '500', '600', '700', '800']" :key="s" gap="100">
    <dt-progress-circle :size="s" :progress="66" :aria-label="`size ${s}`" />
  </dt-stack>
</dt-stack>
<!-- @code -->
<dt-progress-circle size="{size}" :progress="66" aria-label="value" />
```

### Kinds

The `kind` prop sets the color variant of the progress circle.

```vue demo
<dt-stack direction="row" gap="200">
  <dt-stack v-for="k in ['default', 'brand', 'critical', 'positive', 'warning', 'info', 'ai']" :key="k" gap="100">
    <dt-progress-circle :kind="k" :progress="66" :aria-label="`kind ${k}`" />
  </dt-stack>
</dt-stack>
<!-- @code -->
<dt-progress-circle kind="{kind}" :progress="66" aria-label="value" />
```

## Vue API

<component-vue-api component-name="progressCircle" />

## Classes

<component-class-table component-name="progress-circle" />

## Accessibility

- The root element has `role="progressbar"` with `aria-valuemin="0"`, `aria-valuemax="100"`, and `:aria-valuenow` bound to the current progress value.
- Always provide an `aria-label` that describes the ongoing operation (e.g., `"Uploading photo"`).
- The element has `tabindex="-1"` so it is not in the natural tab order, but can receive programmatic focus if needed.

<script setup>
import { ref, computed } from 'vue';
const demoProgress = ref(25);
const atMin = computed(() => demoProgress.value <= 0);
const atMax = computed(() => demoProgress.value >= 100);
const setProgress = (v) => { demoProgress.value = Math.max(0, Math.min(100, v)); };
</script>
