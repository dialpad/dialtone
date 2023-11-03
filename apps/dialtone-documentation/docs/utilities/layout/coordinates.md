---
title: Coordinates
description: Utility classes to assign an element’s top, right, bottom, or left position.
---

## Positive coordinates

### Examples

Use the `top|right|bottom|left|x|y|all` utility classes to absolutely position elements within the nearest positioned element.

<code-well-header class="d-p24 d-bgc-purple-100 d-bgo50 d-w100p d-hmn216 d-d-grid d-g-cols4 d-gg24 d-pi-center sm:d-fs-100 xl:d-fs-200 d-fs-300 d-fw-bold" custom>
  <div class="d-ps-relative xl:d-h48 xl:d-w48 d-h128 d-w128 d-bar8 d-bgc-purple-200"><div class="d-fl-center d-ps-absolute d-x0 d-t0 d-bgc-purple-300 d-bar4 d-h50p">1</div></div>
  <div class="d-ps-relative xl:d-h48 xl:d-w48 d-h128 d-w128 d-bar8 d-bgc-purple-200"><div class="d-fl-center d-ps-absolute d-y0 d-r0 d-bgc-purple-300 d-bar4 d-w50p">2</div></div>
  <div class="d-ps-relative xl:d-h48 xl:d-w48 d-h128 d-w128 d-bar8 d-bgc-purple-200"><div class="d-fl-center d-ps-absolute d-x0 d-b0 d-bgc-purple-300 d-bar4 d-h50p">3</div></div>
  <div class="d-ps-relative xl:d-h48 xl:d-w48 d-h128 d-w128 d-bar8 d-bgc-purple-200"><div class="d-fl-center d-ps-absolute d-y0 d-l0 d-bgc-purple-300 d-bar4 d-w50p">4</div></div>
  <div class="d-ps-relative xl:d-h48 xl:d-w48 d-h128 d-w128 d-bar8 d-bgc-purple-200"><div class="d-fl-center d-ps-absolute d-all0 d-bgc-purple-300 d-bar4">5</div></div>
  <div class="d-ps-relative xl:d-h48 xl:d-w48 d-h128 d-w128 d-bar8 d-bgc-purple-200"><div class="d-fl-center d-ps-absolute d-l0 d-t0 d-bgc-purple-300 d-bar4 d-w50p d-h50p">6</div></div>
  <div class="d-ps-relative xl:d-h48 xl:d-w48 d-h128 d-w128 d-bar8 d-bgc-purple-200"><div class="d-fl-center d-ps-absolute d-r0 d-t0 d-bgc-purple-300 d-bar4 d-w50p d-h50p">7</div></div>
  <div class="d-ps-relative xl:d-h48 xl:d-w48 d-h128 d-w128 d-bar8 d-bgc-purple-200"><div class="d-fl-center d-ps-absolute d-r0 d-b0 d-bgc-purple-300 d-bar4 d-w50p d-h50p">8</div></div>
  <div class="d-ps-relative xl:d-h48 xl:d-w48 d-h128 d-w128 d-bar8 d-bgc-purple-200"><div class="d-fl-center d-ps-absolute d-l0 d-b0 d-bgc-purple-300 d-bar4 d-w50p d-h50p">9</div></div>
  <div class="d-ps-relative xl:d-h48 xl:d-w48 d-h128 d-w128 d-bar8 d-bgc-purple-200"><div class="d-fl-center d-ps-absolute d-all8 d-bgc-purple-300 d-bar4">10</div></div>
</code-well-header>

```html
    <!-- Example 1 -->
    <div class="d-ps-relative d-h128 d-w128">
        <div class="d-ps-absolute d-x0 d-t0 d-h50p">1</div>
    </div>

    <!-- Example 2 -->
    <div class="d-ps-relative d-h128 d-w128">
        <div class="d-ps-absolute d-y0 d-r0 d-w50p">2</div>
    </div>

    <!-- Example 3 -->
    <div class="d-ps-relative d-h128 d-w128">
        <div class="d-ps-absolute d-x0 d-b0 d-h50p">3</div>
    </div>

    <!-- Example 4 -->
    <div class="d-ps-relative d-h128 d-w128">
        <div class="d-ps-absolute d-y0 d-l0 d-w50p">4</div>
    </div>

    <!-- Example 5 -->
    <div class="d-ps-relative d-h128 d-w128">
        <div class="d-ps-absolute d-all0">5</div>
    </div>

    <!-- Example 6 -->
    <div class="d-ps-relative d-h128 d-w128">
        <div class="d-ps-absolute d-t0 d-l0 d-w50p d-h50p">6</div>
    </div>

    <!-- Example 7 -->
    <div class="d-ps-relative d-h128 d-w128">
        <div class="d-ps-absolute d-t0 d-r0 d-w50p d-h50p">7</div>
    </div>

    <!-- Example 8 -->
    <div class="d-ps-relative d-h128 d-w128">
        <div class="d-ps-absolute d-b0 d-r0 d-w50p d-h50p">8</div>
    </div>

    <!-- Example 9 -->
    <div class="d-ps-relative d-h128 d-w128">
        <div class="d-ps-absolute d-b0 d-l0 d-w50p d-h50p">9</div>
    </div>

    <!-- Example 10 -->
    <div class="d-ps-relative d-h128 d-w128">
        <div class="d-ps-absolute d-all8">10</div>
    </div>
```

### Classes

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
        <div v-for="{direction: dir, prefix: pre, percent} in coordinateDirections" style="display: contents">
          <td v-if="percent === 'no' && combo === 'no'" class="d-o50 d-bgc-black-200 d-fc-black-400 d-fs-100 d-ta-center">
            <em>N/A</em>
          </td>
          <td v-else class="d-ff-mono d-fc-purple-400 d-fs-100">
            <span v-if="suffix === '-calc'">.d-{{ pre }}{{ coordinate }}{{ suffix }}</span>
            <span v-else>.d-{{ pre }}{{ coordinate }}</span>
          </td>
        </div>
      </tr>
    </tbody>
  </table>
</div>

## Negative coordinates

### Examples

Use the `top|right|bottom|left|x|y|all` utility classes to absolutely position elements within the nearest positioned element.

<code-well-header class="d-p24 d-bgc-gold-100 d-bgo50 d-w100p d-hmn216 d-d-grid d-g-cols4 d-gg24 d-pi-center sm:d-fs-100 xl:d-fs-200 d-fs-300 d-fw-bold" custom>
  <div class="d-ps-relative xl:d-h48 xl:d-w48 d-h128 d-w128 d-bar8 d-bgc-gold-100"><div class="d-fl-center d-ps-absolute d-xn2 d-tn2 d-bgc-gold-200 d-bar8 d-h50p">1</div></div>
  <div class="d-ps-relative xl:d-h48 xl:d-w48 d-h128 d-w128 d-bar8 d-bgc-gold-100"><div class="d-fl-center d-ps-absolute d-yn2 d-rn2 d-bgc-gold-200 d-bar8 d-w50p">2</div></div>
  <div class="d-ps-relative xl:d-h48 xl:d-w48 d-h128 d-w128 d-bar8 d-bgc-gold-100"><div class="d-fl-center d-ps-absolute d-xn2 d-bn2 d-bgc-gold-200 d-bar8 d-h50p">3</div></div>
  <div class="d-ps-relative xl:d-h48 xl:d-w48 d-h128 d-w128 d-bar8 d-bgc-gold-100"><div class="d-fl-center d-ps-absolute d-yn2 d-ln2 d-bgc-gold-200 d-bar8 d-w50p">4</div></div>
  <div class="d-ps-relative xl:d-h48 xl:d-w48 d-h128 d-w128 d-bar8 d-bgc-gold-100"><div class="d-fl-center d-ps-absolute d-alln2 d-bgc-gold-200 d-bar8">5</div></div>
  <div class="d-ps-relative xl:d-h48 xl:d-w48 d-h128 d-w128 d-bar8 d-bgc-gold-100"><div class="d-fl-center d-ps-absolute d-ln4 d-tn4 d-bgc-gold-200 d-bar8 d-w50p d-h50p">6</div></div>
  <div class="d-ps-relative xl:d-h48 xl:d-w48 d-h128 d-w128 d-bar8 d-bgc-gold-100"><div class="d-fl-center d-ps-absolute d-rn8 d-tn8 d-bgc-gold-200 d-bar8 d-w50p d-h50p">7</div></div>
  <div class="d-ps-relative xl:d-h48 xl:d-w48 d-h128 d-w128 d-bar8 d-bgc-gold-100"><div class="d-fl-center d-ps-absolute d-rn8 d-bn8 d-bgc-gold-200 d-bar8 d-w50p d-h50p">8</div></div>
  <div class="d-ps-relative xl:d-h48 xl:d-w48 d-h128 d-w128 d-bar8 d-bgc-gold-100"><div class="d-fl-center d-ps-absolute d-ln4 d-bn4 d-bgc-gold-200 d-bar8 d-w50p d-h50p">9</div></div>
</code-well-header>

```html
<!-- Example 1 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-xn2 d-tn2 d-h50p">1</div>
</div>

<!-- Example 2 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-yn2 d-rn2 d-w50p">2</div>
</div>

<!-- Example 3 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-xn2 d-bn2 d-h50p">3</div>
</div>

<!-- Example 4 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-yn2 d-ln2 d-w50p">4</div>
</div>

<!-- Example 5 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-alln2">5</div>
</div>

<!-- Example 6 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-tn4 d-ln4 d-w50p d-h50p">6</div>
</div>

<!-- Example 7 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-tn8 d-rn8 d-w50p d-h50p">7</div>
</div>

<!-- Example 8 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-bn8 d-rn8 d-w50p d-h50p">8</div>
</div>

<!-- Example 9 -->
<div class="d-ps-relative d-h128 d-w128">
  <div class="d-ps-absolute d-bn4 d-ln4 d-w50p d-h50p">9</div>
</div>
```

<script setup>
  import { coordinateDirections, coordinates } from '@data/spacing.json';
</script>

### Classes

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
        <div v-if="negative === 'yes'" v-for="{direction: dir, prefix: pre, percent} in coordinateDirections" style="display: contents">
          <td v-if="percent === 'no' && combo === 'no'" class="d-o50 d-bgc-black-200 d-fc-black-400 d-fs-100 d-ta-center">
            <em>N/A</em>
          </td>
          <td v-else class="d-ff-mono d-fc-purple-400 d-fs-100">
            <span v-if="suffix === '-calc'">.d-{{ pre }}n{{ coordinate }}{{ suffix }}</span>
            <span v-else>.d-{{ pre }}n{{ coordinate }}</span>
          </td>
        </div>
      </tr>
    </tbody>
  </table>
</div>
