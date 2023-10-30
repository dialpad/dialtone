---
title: Flex, Grow, & Shrink
description: Utilities for setting an object's flex, grow, and shrink flex properties.
---

## Flex

The `flex` property is a shorthand property for `flex-grow`, `flex-shrink`, and `flex-basis` properties. You can also
control the grow and shrink flex values separately with their own utility classes.

<table class="d-table dialtone-doc-table">
  <thead>
    <tr>
      <th scope="col" class="d-w20p">Class</th>
      <th scope="col" class="d-w30p">Output</th>
      <th scope="col">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="v in properties[0].values">
      <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-fl{{ v }}</th>
      <td class="d-ff-mono d-fs-100">flex: {{ v }} auto !important;</td>
      <td>{{ properties[0].description }} {{ v }}.</td>
    </tr>
    <tr>
      <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-fl-unset</th>
      <td class="d-ff-mono d-fs-100">flex: unset;</td>
      <td>Resets the flex value to the initial value (0 1 auto).</td>
    </tr>
  </tbody>
</table>

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn216 d-of-auto" custom>
  <div class="d-d-flex d-w100p d-bar8 d-bgc-magenta-100">
    <div class="d-fl-none d-p16 d-fs-200 d-lh-tight d-bgc-magenta-100 d-ps-relative">Content cannot flex</div>
    <div class="d-fl1 d-p16 d-fs-200 d-lh-tight d-bgc-magenta-100 d-ps-relative">Text that will flex</div>
    <div class="d-fl-none d-p16 d-fs-200 d-lh-tight d-bgc-magenta-100 d-ps-relative">Content cannot flex</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex">
  <div>...</div>
  <div class="d-fl1">...</div>
  <div>...</div>
</div>
```

## Flex grow

The `flex-grow` sets the flex container’s grow factor relative to the parent's main size. The default value is 0.

<table class="d-table dialtone-doc-table">
  <thead>
    <tr>
      <th scope="col" class="d-w20p">Class</th>
      <th scope="col" class="d-w30p">Output</th>
      <th scope="col">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="v in properties[1].values">
      <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-{{ properties[1].class }}{{ v }}</th>
      <td class="d-ff-mono d-fs-100">flex-grow: {{ v }} !important;</td>
      <td>{{ properties[1].description }} {{ v }}.</td>
    </tr>
    <tr>
      <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-fl-grow-unset</th>
      <td class="d-ff-mono d-fs-100">flex-grow: unset !important;</td>
      <td>Resets the flex-grow value to the initial value (0).</td>
    </tr>
  </tbody>
</table>

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn216 d-of-auto" custom>
  <div class="d-d-flex d-w100p d-bar8 d-bgc-purple-100">
    <div class="d-fl-none d-p16 d-fs-200 d-lh-tight d-bgc-purple-100">Content cannot flex</div>
    <div class="d-fl-grow1 d-p16 d-fs-200 d-lh-tight d-bgc-purple-200">Text that will grow</div>
    <div class="d-fl-none d-p16 d-fs-200 d-lh-tight d-bgc-purple-100">Content cannot flex</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex">
  <div>...</div>
  <div class="d-fl-grow1">...</div>
  <div>...</div>
</div>
```

## Flex shrink

The `flex-shrink` sets the flex container’s shrink factor relative to the parent's main size. The default value is 1.

<table class="d-table dialtone-doc-table">
  <thead>
    <tr>
      <th scope="col" class="d-w20p">Class</th>
      <th scope="col" class="d-w30p">Output</th>
      <th scope="col">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="v in properties[2].values">
      <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-{{ properties[2].class }}{{ v }}</th>
      <td class="d-ff-mono d-fs-100">flex-shrink: {{ v }} !important;</td>
      <td>{{ properties[2].description }} {{ v }}.</td>
    </tr>
    <tr>
      <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-fl-shrink-unset</th>
      <td class="d-ff-mono d-fs-100">flex-shrink: unset !important;</td>
      <td>Resets the flex-shrink value to the initial value (1).</td>
    </tr>
  </tbody>
</table>

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-red-100 d-bgo50 d-w100p d-hmn216 d-of-auto" custom>
  <div class="d-d-flex d-w5 d-bar8 d-bgc-red-100">
    <div class="d-fl-none d-p16 d-fs-200 d-lh-tight d-bgc-red-100">Longer text that cannot flex</div>
    <div class="d-fl-shrink1 d-p16 d-fs-200 d-lh-tight d-bgc-red-100">Text that will shrink even if it causes text to wrap</div>
    <div class="d-fl-none d-p16 d-fs-200 d-lh-tight d-bgc-red-100">Longer text that cannot flex</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex">
  <div>...</div>
  <div class="d-fl-shrink1">...</div>
  <div>...</div>
</div>
```

<script setup>
  import { properties } from '@data/flex.json';
</script>
