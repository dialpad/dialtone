---
title: Progress
description: A circular SVG progress indicator for determinate upload or processing progress.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-progress--default
---

<code-well-header>
  <dt-progress aria-label="Upload progress" :progress="50" />
</code-well-header>

## Usage

Use a progress indicator to communicate deterministic progress to the user — for example, a file upload or media processing operation that reports a percentage complete.

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
      <dt-progress :progress="v" :aria-label="`${v}% complete`" />
    </dt-stack>
  </dt-stack>
</code-well-header>

<code-example-tabs
vueCode='
<dt-progress :progress="0" aria-label="0% complete" />
<dt-progress :progress="25" aria-label="25% complete" />
<dt-progress :progress="50" aria-label="50% complete" />
<dt-progress :progress="75" aria-label="75% complete" />
<dt-progress :progress="100" aria-label="100% complete" />
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="progress" />

## Classes

<component-class-table component-name="progress" />

## Accessibility

- The root element has `role="progressbar"` with `aria-valuemin="0"`, `aria-valuemax="100"`, and `:aria-valuenow` bound to the current progress value.
- Always provide an `aria-label` that describes the ongoing operation (e.g., `"Uploading photo"`).
- The element has `tabindex="-1"` so it is not in the natural tab order, but can receive programmatic focus if needed.
