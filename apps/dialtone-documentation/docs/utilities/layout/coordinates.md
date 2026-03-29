---
title: Coordinates
description: Utility classes to assign an element’s top, right, bottom, or left position.
keywords: ["top","right","bottom","left","inset","position offset"]
---

## Positive Coordinates

### Examples

Use `d-t-{stop}`, `d-r-{stop}`, `d-b-{stop}`, `d-l-{stop}`, `d-x-{stop}`, `d-y-{stop}`, `d-all-{stop}` to absolutely position elements. Logical property aliases are also available: `d-ibs-{stop}` (inset-block-start), `d-iie-{stop}` (inset-inline-end), `d-ibe-{stop}` (inset-block-end), `d-iis-{stop}` (inset-inline-start).

<code-well-header>
  <div class="d-w100p d-hmn216 d-d-grid d-g-cols4 d-g-200 d-pi-center">
    <div class="d-ps-relative d-h-200 d-bar8 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-x-0 d-ibs-0 d-bgc-moderate-opaque d-bar4 d-h50p">1</dt-stack></div>
    <div class="d-ps-relative d-h-200 d-bar8 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-y-0 d-iie-0 d-bgc-moderate-opaque d-bar4 d-w50p">2</dt-stack></div>
    <div class="d-ps-relative d-h-200 d-bar8 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-x-0 d-ibe-0 d-bgc-moderate-opaque d-bar4 d-h50p">3</dt-stack></div>
    <div class="d-ps-relative d-h-200 d-bar8 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-y-0 d-iis-0 d-bgc-moderate-opaque d-bar4 d-w50p">4</dt-stack></div>
    <div class="d-ps-relative d-h-200 d-bar8 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-all-0 d-bgc-moderate-opaque d-bar4">5</dt-stack></div>
    <div class="d-ps-relative d-h-200 d-bar8 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-iis-0 d-ibs-0 d-bgc-moderate-opaque d-bar4 d-size-50p">6</dt-stack></div>
    <div class="d-ps-relative d-h-200 d-bar8 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-iie-0 d-ibs-0 d-bgc-moderate-opaque d-bar4 d-size-50p">7</dt-stack></div>
    <div class="d-ps-relative d-h-200 d-bar8 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-iie-0 d-ibe-0 d-bgc-moderate-opaque d-bar4 d-size-50p">8</dt-stack></div>
    <div class="d-ps-relative d-h-200 d-bar8 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-iis-0 d-ibe-0 d-bgc-moderate-opaque d-bar4 d-size-50p">9</dt-stack></div>
    <div class="d-ps-relative d-h-200 d-bar8 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-all-100 d-bgc-moderate-opaque d-bar4">10</dt-stack></div>
  </div>
</code-well-header>

```html
<!-- Example 1 -->
<div class="d-ps-relative d-size-200">
  <div class="d-ps-absolute d-x-0 d-ibs-0 d-h50p">1</div>
</div>

<!-- Example 2 -->
<div class="d-ps-relative d-size-200">
  <div class="d-ps-absolute d-y-0 d-iie-0 d-w50p">2</div>
</div>

<!-- Example 3 -->
<div class="d-ps-relative d-size-200">
      <div class="d-ps-absolute d-x-0 d-ibe-0 d-h50p">3</div>
</div>

<!-- Example 4 -->
<div class="d-ps-relative d-size-200">
  <div class="d-ps-absolute d-y-0 d-iis-0 d-w50p">4</div>
</div>

<!-- Example 5 -->
<div class="d-ps-relative d-size-200">
  <div class="d-ps-absolute d-all-0">5</div>
</div>

<!-- Example 6 -->
<div class="d-ps-relative d-size-200">
  <div class="d-ps-absolute d-ibs-0 d-iis-0 d-size-50p">6</div>
</div>

<!-- Example 7 -->
<div class="d-ps-relative d-size-200">
  <div class="d-ps-absolute d-ibs-0 d-iie-0 d-size-50p">7</div>
</div>

<!-- Example 8 -->
<div class="d-ps-relative d-size-200">
  <div class="d-ps-absolute d-ibe-0 d-iie-0 d-size-50p">8</div>
</div>

<!-- Example 9 -->
<div class="d-ps-relative d-size-200">
  <div class="d-ps-absolute d-ibe-0 d-iis-0 d-size-50p">9</div>
</div>

<!-- Example 10 -->
<div class="d-ps-relative d-size-200">
  <div class="d-ps-absolute d-all-100">10</div>
</div>
```

### Classes

<div class="d-bar8 d-ba d-bc-subtle">
  <div class="d-w100p d-of-auto">
    <table class="d-table dialtone-doc-table">
      <thead>
        <tr>
          <th scope="col">Value</th>
          <th v-for="{ direction: dir } in coordinateDirections" scope="col">{{ dir }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{coordinate, suffix, combo, value } in coordinates">
          <th scope="row">{{ value }}</th>
          <template v-for="{direction: dir, prefix: pre, percent} in coordinateDirections">
            <td v-if="percent === 'no' && combo === 'no'" class="d-fc-muted d-fs-100 d-ta-center">
              N/A
            </td>
            <td v-else class="d-code--sm d-docsite-code">
              <span v-if="/^\d+$/.test(coordinate)">.d-{{ pre }}-{{ coordinate }}</span>
              <span v-else>.d-{{ pre }}{{ coordinate }}</span>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</div>

## Negative Coordinates

### Examples

Use `d-t-{stop}`, `d-r-{stop}`, `d-b-{stop}`, `d-l-{stop}`, `d-x-{stop}`, `d-y-{stop}`, `d-all-{stop}` to absolutely position elements. Logical property aliases are also available: `d-ibs-{stop}` (inset-block-start), `d-iie-{stop}` (inset-inline-end), `d-ibe-{stop}` (inset-block-end), `d-iis-{stop}` (inset-inline-start).

<code-well-header>
  <div class="d-w100p d-hmn216 d-d-grid d-g-cols4 d-g-200 d-pi-center">
    <div class="d-ps-relative d-h-200 d-bar8 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-x-n25 d-ibs-n25 d-bgc-moderate-opaque d-bar8 d-h50p">1</dt-stack></div>
    <div class="d-ps-relative d-h-200 d-bar8 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-y-n25 d-iie-n25 d-bgc-moderate-opaque d-bar8 d-w50p">2</dt-stack></div>
    <div class="d-ps-relative d-h-200 d-bar8 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-x-n25 d-ibe-n25 d-bgc-moderate-opaque d-bar8 d-h50p">3</dt-stack></div>
    <div class="d-ps-relative d-h-200 d-bar8 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-y-n25 d-iis-n25 d-bgc-moderate-opaque d-bar8 d-w50p">4</dt-stack></div>
    <div class="d-ps-relative d-h-200 d-bar8 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-all-n25 d-bgc-moderate-opaque d-bar8">5</dt-stack></div>
    <div class="d-ps-relative d-h-200 d-bar8 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-iis-n50 d-ibs-n50 d-bgc-moderate-opaque d-bar8 d-size-50p">6</dt-stack></div>
    <div class="d-ps-relative d-h-200 d-bar8 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-iie-n100 d-ibs-n100 d-bgc-moderate-opaque d-bar8 d-size-50p">7</dt-stack></div>
    <div class="d-ps-relative d-h-200 d-bar8 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-iie-n100 d-ibe-n100 d-bgc-moderate-opaque d-bar8 d-size-50p">8</dt-stack></div>
    <div class="d-ps-relative d-h-200 d-bar8 d-bgc-moderate"><dt-stack direction="row" align="center" justify="center" class="d-ps-absolute d-iis-n50 d-ibe-n50 d-bgc-moderate-opaque d-bar8 d-size-50p">9</dt-stack></div>
  </div>
</code-well-header>

```html
<!-- Example 1 -->
<div class="d-ps-relative d-size-200">
  <div class="d-ps-absolute d-x-n25 d-ibs-n25 d-h50p">1</div>
</div>

<!-- Example 2 -->
<div class="d-ps-relative d-size-200">
  <div class="d-ps-absolute d-y-n25 d-iie-n25 d-w50p">2</div>
</div>

<!-- Example 3 -->
<div class="d-ps-relative d-size-200">
  <div class="d-ps-absolute d-x-n25 d-ibe-n25 d-h50p">3</div>
</div>

<!-- Example 4 -->
<div class="d-ps-relative d-size-200">
  <div class="d-ps-absolute d-y-n25 d-iis-n25 d-w50p">4</div>
</div>

<!-- Example 5 -->
<div class="d-ps-relative d-size-200">
  <div class="d-ps-absolute d-all-n25">5</div>
</div>

<!-- Example 6 -->
<div class="d-ps-relative d-size-200">
  <div class="d-ps-absolute d-ibs-n50 d-iis-n50 d-size-50p">6</div>
</div>

<!-- Example 7 -->
<div class="d-ps-relative d-size-200">
  <div class="d-ps-absolute d-ibs-n100 d-iie-n100 d-size-50p">7</div>
</div>

<!-- Example 8 -->
<div class="d-ps-relative d-size-200">
  <div class="d-ps-absolute d-ibe-n100 d-iie-n100 d-size-50p">8</div>
</div>

<!-- Example 9 -->
<div class="d-ps-relative d-size-200">
  <div class="d-ps-absolute d-ibe-n50 d-iis-n50 d-size-50p">9</div>
</div>
```

<script setup>
  import { coordinateDirections, coordinates } from '@data/spacing.json';
</script>

### Classes

<div class="d-bar8 d-ba d-bc-subtle">
  <div class="d-w100p d-of-auto">
    <table class="d-table dialtone-doc-table">
      <thead>
        <tr>
          <th scope="col">Value</th>
          <th v-for="{ direction: dir } in coordinateDirections" scope="col">{{ dir }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{coordinate, suffix, combo, negative, value } in coordinates">
          <th v-if="negative === 'yes'" scope="row">{{ value }}</th>
          <template v-if="negative === 'yes'" v-for="{direction: dir, prefix: pre, percent} in coordinateDirections">
            <td v-if="percent === 'no' && combo === 'no'" class="d-fc-muted d-fs-100 d-ta-center">
              N/A
            </td>
            <td v-else class="d-code--sm d-docsite-code">
              <span v-if="/^\d+$/.test(coordinate)">.d-{{ pre }}-n{{ coordinate }}</span>
              <span v-else>.d-{{ pre }}n{{ coordinate }}</span>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</div>
