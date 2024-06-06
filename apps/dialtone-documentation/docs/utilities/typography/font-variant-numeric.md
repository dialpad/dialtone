---
title: Font variant numeric
description: Utilities to change an element's font variant numeric.
---

The `font-variant-numeric` CSS property controls the usage of alternate glyphs for numbers, fractions, and ordinal markers.

## Normal (default)

Use `d-fvn-normal` to deactivate any alternate glyphs.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-purple-100 d-w100p d-hmn102" custom>
  <p class="d-fs-300 d-fc-purple-400 d-fvn-normal">1234567890</p>
</code-well-header>

```html
<p class="d-fs-300 d-fvn-normal">...</p>
```

## Ordinal

The class `d-fvn-ordinal` forces the use of special glyphs for ordinal markers, like 1st, 2nd, 3rd.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-purple-100 d-w100p d-hmn102" custom>
  <p class="d-fs-300 d-fc-purple-400 d-fvn-ordinal">1st, 2nd, 3rd, 4th</p>
</code-well-header>

```html
<p class="d-fs-300 d-fvn-ordinal">1st, 2nd, 3rd, 4th</p>
```

## Proportional-nums

Use `d-fvn-proportional` to set different sizes for each number.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-purple-100 d-w100p d-hmn102" custom>
  <div class="d-fs-300 d-fc-purple-400 d-fvn-proportional">
    <table class="numbers-table">
      <tbody>
      <tr>
        <td><span>21.0</span></td>
        <td><span>160</span></td>
        <td><span>3.90</span></td>
        <td><span>2.875</span></td>
        <td><span>17.02</span></td>
      </tr>
      <tr>
        <td><span>22.8</span></td>
        <td><span>108</span></td>
        <td><span>3.85</span></td>
        <td><span>2.320</span></td>
        <td><span>18.61</span></td>
      </tr>
      <tr>
        <td><span>21.4</span></td>
        <td><span>258</span></td>
        <td><span>3.08</span></td>
        <td><span>3.215</span></td>
        <td><span>19.44</span></td>
      </tr>
    </tbody></table>
  </div>
</code-well-header>

```html
<div class="d-fs-300 d-fvn-proportional"><table>...</table></div>
```

## Tabular-nums

Use `d-fvn-tabular` for aligning tabular data and preventing layout shifts of dynamically-changing content. For example, a timer counting down.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-purple-100 d-w100p d-hmn102" custom>
  <div class="d-fs-300 d-fc-purple-400 d-fvn-tabular">
    <table class="numbers-table">
      <tbody>
      <tr>
        <td><span>21.0</span></td>
        <td><span>160</span></td>
        <td><span>3.90</span></td>
        <td><span>2.875</span></td>
        <td><span>17.02</span></td>
      </tr>
      <tr>
        <td><span>22.8</span></td>
        <td><span>108</span></td>
        <td><span>3.85</span></td>
        <td><span>2.320</span></td>
        <td><span>18.61</span></td>
      </tr>
      <tr>
        <td><span>21.4</span></td>
        <td><span>258</span></td>
        <td><span>3.08</span></td>
        <td><span>3.215</span></td>
        <td><span>19.44</span></td>
      </tr>
    </tbody></table>
  </div>
</code-well-header>

```html
<div class="d-fs-300 d-fvn-tabular"><table>...</table></div>
```

## Diagonal-fractions

Use `d-fvn-diagonal` to display numerator and denominator smaller and separated by a slash.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-purple-100 d-w100p d-hmn102" custom>
  <p class="d-fs-300 d-fc-purple-400 d-fvn-diagonal">1/2 3/4 5/6</p>
</code-well-header>

```html
<p class="d-fs-300 d-fvn-diagonal">1/2 3/4 5/6</p>
```

## Unset

Use `d-fvn-unset` to deactivate other value previously set to `font-variant-numeric`.

<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-purple-100 d-w100p d-hmn102" custom>
  <p class="d-fs-300 d-fc-purple-400 d-fvn-unset">1234567890</p>
</code-well-header>

```html
<p class="d-fs-300 d-fvn-unset">...</p>
```

<script setup>
  import { fontVariantNumeric } from '@data/type.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="item in fontVariantNumeric">
        <th scope="row" class="d-code--sm d-fc-purple-400">.d-fvn-{{ item.class }}</th>
        <td class="d-code--sm">font-variant-numeric: {{ item.output }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>

<style lang="less" scoped>
  .numbers-table {
    border-collapse: collapse;
  }
  .numbers-table td {
    border: 1px solid var(--dt-color-border-moderate);
  }
</style>
