---
title: Direction, Wrap, & Flow
description: Utilities for setting an object's flex direction, wrap, and flow directions.
---

## Flex direction

The `flex-direction` property declares a flex container’s main axis direction. The default value is row.

<table class="d-table dialtone-doc-table">
  <thead>
    <tr>
      <th scope="col" class="d-w20p">Class</th>
      <th scope="col" class="d-w30p">Output</th>
      <th scope="col">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="{ class: className, output, description } in direction">
      <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-{{ className }}</th>
      <td class="d-ff-mono d-fs-100">{{ output }}</td>
      <td>{{ description }}</td>
    </tr>
  </tbody>
</table>

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn216">
  <div class="d-d-flex d-fd-row-reverse d-w100p d-bar8 d-bgc-purple-100">
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-purple-500 d-bar4 d-fs-300 d-fc-primary-inverted d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-purple-500 d-bar4 d-fs-300 d-fc-primary-inverted d-fw-bold">2</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-purple-500 d-bar4 d-fs-300 d-fc-primary-inverted d-fw-bold">3</div>
  </div>
  <div class="d-d-flex d-fd-row d-w100p d-mt16 d-bar8 d-bgc-purple-100">
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-purple-500 d-bar4 d-fs-300 d-fc-primary-inverted d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-purple-500 d-bar4 d-fs-300 d-fc-primary-inverted d-fw-bold">2</div>
    <div class="d-fl-center d-m8 d-p16 d-w64 d-h64 d-bgc-purple-500 d-bar4 d-fs-300 d-fc-primary-inverted d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-fd-row-reverse">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
<div class="d-d-flex d-fd-row">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Flex wrap

The `flex-wrap` property declares a flex container’s wrapping status. The default value is nowrap.

<table class="d-table dialtone-doc-table">
  <thead>
    <tr>
      <th scope="col" class="d-w20p">Class</th>
      <th scope="col" class="d-w30p">Output</th>
      <th scope="col">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="{ class: className, output, description } in wrap">
      <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-{{ className }}</th>
      <td class="d-ff-mono d-fs-100">{{ output }}</td>
      <td>{{ description }}</td>
    </tr>
    </tbody>
</table>

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-magenta-100 d-bgo50 d-w100p d-hmn216">
  <div class="d-d-flex d-fw-wrap d-w100p d-bar8 d-bgc-magenta-100">
    <div class="d-fl-center d-m8 d-p16 d-w25p d-h64 d-bgc-magenta-200 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-w50p d-h64 d-bgc-magenta-200 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-m8 d-p16 d-w75p d-h64 d-bgc-magenta-200 d-bar4 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-fw-wrap">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Flex flow

The `flex-flow` property is a shorthand property that sets allows you to quickly set the above `flex-direction` and `flex-wrap` properties. By default all flex containers are set to `row` and `nowrap`.

<table class="d-table dialtone-doc-table">
  <thead>
    <tr>
      <th scope="col" class="d-w20p">Class</th>
      <th scope="col" class="d-w30p">Output</th>
      <th scope="col">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="{class: className, output, description} in flow">
      <th scope="row" class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100">.d-{{ className }}</th>
      <td class="d-ff-mono d-fs-100">{{ output }}</td>
      <td>{{ description }}</td>
    </tr>
  </tbody>
</table>

<code-well-header class="d-fl-center d-fd-column d-p24 d-bgc-blue-100 d-bgo50 d-w100p d-hmn216">
  <div class="d-d-flex d-ff-row-reverse-wrap d-w100p d-bar8 d-bgc-blue-200">
    <div class="d-fl-center d-m8 d-p16 d-w25p d-h64 d-bgc-blue-400 d-bar4 d-fs-300 d-fw-bold">1</div>
    <div class="d-fl-center d-m8 d-p16 d-w50p d-h64 d-bgc-blue-400 d-bar4 d-fs-300 d-fw-bold">2</div>
    <div class="d-fl-center d-m8 d-p16 d-w75p d-h64 d-bgc-blue-400 d-bar4 d-fs-300 d-fw-bold">3</div>
  </div>
</code-well-header>

```html
<div class="d-d-flex d-ff-row-reverse-wrap">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

<script setup>
  import { direction, wrap, flow } from '@data/flex.json';
</script>
