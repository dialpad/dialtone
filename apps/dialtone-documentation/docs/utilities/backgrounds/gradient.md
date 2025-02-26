---
title: Background Gradient
description: Utilities for creating an background gradient and controlling its stops.
---

## Starting Color

Use `d-bgg-from-{color}` to declare the gradient starting color stop.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-black-200 d-w100p d-hmn102" custom>
  <div class="d-w100p d-h128 d-bar8 d-bgg-to-br d-bgg-from-purple-500"></div>
</code-well-header>

```html
<div class="d-bgg-to-br d-bgg-from-purple-500">...</div>
```

## Ending Color

Use `d-bgg-to-{color}` to declare the gradient ending color stop.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-black-200 d-w100p d-hmn102" custom>
  <div class="d-w100p d-h128 d-bar8 d-bgg-to-br d-bgg-from-magenta-300 d-bgg-to-purple-400"></div>
</code-well-header>

```html
<div class="d-bgg-to-br d-bgg-from-purple-400 d-bgg-to-magenta-300">...</div>
```

## Changing Opacities

Use `d-bgg-(from|to)-o{n}` to change the opacity values of each gradient color stop. You can also change the opacity values of each gradient color stop on `:hover`, `:focus`, `:focus-visible` by using the respective `h:d-bgg-(from|to)-o{n}`, `f:d-bgg-(from|to)-o{n}`, `fv:d-bgg-(from|to)-o{n}` prefixes.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-black-200 d-w100p d-hmn102 d-stack8" custom>
  <div class="d-d-flex d-jc-space-between d-ai-center d-p8 d-w100p d-h48 d-bar8 d-bgg-to-r d-bgg-from-purple-300 d-bgg-to-magenta-100 d-bgg-to-o0 d-fs-300 d-fw-bold d-fc-primary-inverted"><span>100%</span><span>0%</span></div>
  <div class="d-d-flex d-jc-space-between d-ai-center d-p8 d-w100p d-h48 d-bar8 d-bgg-to-r d-bgg-from-purple-300 d-bgg-from-o99 d-bgg-to-magenta-100 d-bgg-to-o10 d-fs-300 d-fw-bold d-fc-primary-inverted"><span>99%</span><span>10%</span></div>
  <div class="d-d-flex d-jc-space-between d-ai-center d-p8 d-w100p d-h48 d-bar8 d-bgg-to-r d-bgg-from-purple-300 d-bgg-from-o95 d-bgg-to-magenta-100 d-bgg-to-o25 d-fs-300 d-fw-bold d-fc-primary-inverted"><span>95%</span><span>25%</span></div>
  <div class="d-d-flex d-jc-space-between d-ai-center d-p8 d-w100p d-h48 d-bar8 d-bgg-to-r d-bgg-from-purple-300 d-bgg-from-o90 d-bgg-to-magenta-100 d-bgg-to-o50 d-fs-300 d-fw-bold d-fc-primary-inverted"><span>90%</span><span>50%</span></div>
  <div class="d-d-flex d-jc-space-between d-ai-center d-p8 d-w100p d-h48 d-bar8 d-bgg-to-r d-bgg-from-purple-300 d-bgg-from-o75 d-bgg-to-magenta-100 d-bgg-to-o75 d-fs-300 d-fw-bold d-fc-primary-inverted"><span>75%</span><span>75%</span></div>
  <div class="d-d-flex d-jc-space-between d-ai-center d-p8 d-w100p d-h48 d-bar8 d-bgg-to-r d-bgg-from-purple-300 d-bgg-from-o50 d-bgg-to-magenta-100 d-bgg-to-o90 d-fs-300 d-fw-bold d-fc-primary-inverted"><span>50%</span><span>90%</span></div>
  <div class="d-d-flex d-jc-space-between d-ai-center d-p8 d-w100p d-h48 d-bar8 d-bgg-to-r d-bgg-from-purple-300 d-bgg-from-o25 d-bgg-to-magenta-100 d-bgg-to-o95 d-fs-300 d-fw-bold d-fc-primary-inverted"><span>25%</span><span>95%</span></div>
  <div class="d-d-flex d-jc-space-between d-ai-center d-p8 d-w100p d-h48 d-bar8 d-bgg-to-r d-bgg-from-purple-300 d-bgg-from-o10 d-bgg-to-magenta-100 d-bgg-to-o99 d-fs-300 d-fw-bold d-fc-primary-inverted"><span>10%</span><span>99%</span></div>
  <div class="d-d-flex d-jc-space-between d-ai-center d-p8 d-w100p d-h48 d-bar8 d-bgg-to-r d-bgg-from-purple-300 d-bgg-from-o0 d-bgg-to-magenta-100 d-fs-300 d-fw-bold d-fc-primary-inverted"><span>0%</span><span>100%</span></div>
</code-well-header>

```html
<div class="d-bgg-from-purple-300 d-bgg-to-magenta-100 d-bgg-to-o0">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o99 d-bgg-to-magenta-100 d-bgg-to-o10">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o95 d-bgg-to-magenta-100 d-bgg-to-o25">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o90 d-bgg-to-magenta-100 d-bgg-to-o50">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o75 d-bgg-to-magenta-100 d-bgg-to-o75">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o50 d-bgg-to-magenta-100 d-bgg-to-o90">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o25 d-bgg-to-magenta-100 d-bgg-to-o95">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o10 d-bgg-to-magenta-100 d-bgg-to-o99">...</div>
<div class="d-bgg-from-purple-300 d-bgg-from-o0 d-bgg-to-magenta-100">...</div>
```

## Hover

Use `h:d-bgg-{from|to}-{color}` to change an element's background gradient color spot when in an `:hover` state.

<code-well-header class="d-fl-center d-p24 d-bgc-black-200 d-w100p d-hmn102" custom>
  <button class="d-p16 d-bar4 d-fs-200 d-fc-primary-inverted d-bgg-to-r d-bgg-from-purple-300 h:d-bgg-from-purple-300 d-bgg-to-magenta-100 h:d-bgg-to-magenta-300 d-baw0">Hover over me</button>
</code-well-header>

```html
<button class="d-bgg-from-purple-300 h:d-bgg-from-purple-300 d-bgg-to-magenta-100 h:d-bgg-to-magenta-300">...</button>
```

## Focus

Use `f:d-bgg-{from|to}-{color}` to change an element's background gradient starting and ending stops in `:focus` and `:focus-within` states.

<code-well-header class="d-fl-center d-p24 d-bgc-black-200 d-w100p d-hmn102" custom>
  <button class="d-p16 d-bar4 d-fs-200 d-fc-primary-inverted d-bgg-to-r d-bgg-from-purple-300 f:d-bgg-from-purple-300 d-bgg-to-magenta-100 f:d-bgg-to-purple-500 d-baw0">Click on me</button>
</code-well-header>

```html
<button class="d-bgg-from-purple-300 f:d-bgg-from-purple-300 d-bgg-to-magenta-100 f:d-bgg-to-purple-500">...</button>
```

## Focus Visible

Use `fv:d-bgg-{from|to}-{color}` to change an element's background gradient starting and ending stops in `:focus-visible` state [only when focused by keyboard].

<code-well-header class="d-fl-center d-p24 d-bgc-black-200 d-w100p d-hmn102" custom>
  <button class="d-p16 d-bar4 d-fs-200 d-fc-primary-inverted d-bgg-to-r d-bgg-from-purple-300 fv:d-bgg-from-purple-300 d-bgg-to-magenta-100 fv:d-bgg-to-purple-500 d-baw0">Focus on me</button>
</code-well-header>

```html
<button class="d-bgg-from-purple-300 fv:d-bgg-from-purple-300 d-bgg-to-magenta-100 fv:d-bgg-to-purple-500">...</button>
```

## Directions

To create a background gradient, first declare the desired gradient and, if applicable, the direction. All classes with directions are linear gradients. Radial gradients start from the center and work out to the edge. Conic gradients progressively work around a circle.

<new-utility-class-table :classes="directions"/>

## Color Stops

The starting stop (`d-bgg-from-{color}`) should be declared. Optionally an ending stop (`d-bgg-to-{color}`) can also be declared.

<new-utility-class-table :classes="colors">
  <template #example="{ className }">
    <div
      class="d-fl-shrink0 d-m4 d-ml16 d-h32 d-w64 d-bar4 d-bgg-to-r d-bgg-from-black-100"
      :class="className"
    >
    </div>
  </template>
</new-utility-class-table>

<script setup>
  import { inject } from 'vue';
  import { extractUtilityClasses } from '@utilities';

  const utilityClassDocs = inject('utilityClassDocs');
  const gradients = extractUtilityClasses(utilityClassDocs, 'd-bgg');

  const allowedDirections = ['to-t', 'to-b', 'to-l', 'to-r', 'to-tl', 'to-tr', 'to-bl', 'to-br', 'radial', 'conic', 'none', 'unset'];
  const allowedColors = ['black', 'purple', 'magenta', 'gold', 'red', 'green', 'blue', 'tan', 'white'];

  const directions = Object.keys(gradients)
    .filter(className => allowedDirections.some(direction => className.endsWith(direction)))
    .reduce((obj, key) => {
      obj[key] = gradients[key];
      return obj;
    }, {});
  
  const colors = Object.keys(gradients)
    .filter(className => allowedColors.some(color => className.includes(color)))
    .reduce((obj, key) => {
      obj[key] = gradients[key];
      return obj;
    }, {});
</script>
