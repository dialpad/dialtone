---
title: Progress Circle
description: A circular SVG progress indicator for determinate upload or processing progress.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-progress-circle--default
---

<code-well-header>
  <dt-progress-circle aria-label="Upload progress" :progress="50" />
</code-well-header>

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

## Variants

### Progress states

<code-well-header>
  <dt-stack direction="row" gap="500" align="center">
    <dt-stack v-for="v in [0, 25, 50, 75, 100]" :key="v" gap="200" align="center">
      <span class="d-fs-100">{{ v }}%</span>
      <dt-progress-circle :progress="v" :aria-label="`${v}% complete`" />
    </dt-stack>
  </dt-stack>
</code-well-header>

<code-example-tabs
vueCode='
<dt-progress-circle :progress="0" aria-label="0% complete" />
<dt-progress-circle :progress="25" aria-label="25% complete" />
<dt-progress-circle :progress="50" aria-label="50% complete" />
<dt-progress-circle :progress="75" aria-label="75% complete" />
<dt-progress-circle :progress="100" aria-label="100% complete" />
'
showHtmlWarning />

### Sizes

The `size` prop controls the diameter of the progress circle, aligning to Dialtone icon sizes.

<code-well-header>
  <dt-stack direction="row" gap="500" align="start">
    <dt-stack v-for="s in ['100', '200', '300', '400', '500', '600', '700', '800']" :key="s" gap="200" align="center">
      <span class="d-fs-100">{{ s }}</span>
      <dt-progress-circle :size="s" :progress="66" :aria-label="`size ${s}`" />
    </dt-stack>
  </dt-stack>
</code-well-header>

<code-example-tabs
vueCode='
<dt-progress-circle size="100" :progress="66" aria-label="size 100" />
<dt-progress-circle size="300" :progress="66" aria-label="size 300" />
<dt-progress-circle size="500" :progress="66" aria-label="size 500" />
<dt-progress-circle size="800" :progress="66" aria-label="size 800" />
'
showHtmlWarning />

### Kinds

The `kind` prop sets the color variant of the progress circle.

<code-well-header>
  <dt-stack direction="row" gap="500" align="center">
    <dt-stack v-for="k in ['default', 'brand', 'critical', 'positive', 'warning', 'info', 'ai']" :key="k" gap="200" align="center">
      <span class="d-fs-100">{{ k }}</span>
      <dt-progress-circle :kind="k" :progress="66" :aria-label="`kind ${k}`" />
    </dt-stack>
  </dt-stack>
</code-well-header>

<code-example-tabs
vueCode='
<dt-progress-circle kind="default" :progress="66" aria-label="default" />
<dt-progress-circle kind="brand" :progress="66" aria-label="brand" />
<dt-progress-circle kind="critical" :progress="66" aria-label="critical" />
<dt-progress-circle kind="positive" :progress="66" aria-label="positive" />
<dt-progress-circle kind="warning" :progress="66" aria-label="warning" />
<dt-progress-circle kind="info" :progress="66" aria-label="info" />
<dt-progress-circle kind="ai" :progress="66" aria-label="ai" />
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="progressCircle" />

## Classes

<component-class-table component-name="progress-circle" />

## Accessibility

- The root element has `role="progressbar"` with `aria-valuemin="0"`, `aria-valuemax="100"`, and `:aria-valuenow` bound to the current progress value.
- Always provide an `aria-label` that describes the ongoing operation (e.g., `"Uploading photo"`).
- The element has `tabindex="-1"` so it is not in the natural tab order, but can receive programmatic focus if needed.
