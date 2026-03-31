---
title: Place Self
description: Utilities for controlling a grid item's alignment along their block and inline axis directions.
keywords: ["css grid", "align", "justify"]
---

## Stretch

Use `d-pls-stretch{-n}` to stretch grid items along their block and inline axis.

<code-well-header>
  <div class="d-d-grid d-g-cols2 d-g-200 d-w100p d-hmn-350 d-bar8 d-bgc-moderate">
    <dt-stack direction="row" align="center" justify="center" class="d-pls-stretch d-p-200 d-bgc-bold-opaque d-bar4">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar4">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar4">3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-size-100 d-bgc-moderate-opaque d-bar4">4</dt-stack>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols2">
  <div class="d-pls-stretch">1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Start

Use `d-pls-start{-n}` to align a grid item along the start of their block and/or inline axis.

<code-well-header>
  <div class="d-d-grid d-g-cols2 d-g-200 d-w100p d-h-350 d-bar8 d-bgc-moderate">
    <dt-stack direction="row" align="center" justify="center" class="d-pls-start d-p-200 d-size-100 d-bgc-bold-opaque d-bar4">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">4</dt-stack>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols2">
  <div class="d-pls-start">1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## End

Use `d-pls-end{-n}` to align a grid item along the end of their block and/or inline axis.

<code-well-header>
  <div class="d-d-grid d-g-cols2 d-g-200 d-w100p d-h-350 d-bar8 d-bgc-moderate">
    <dt-stack direction="row" align="center" justify="center" class="d-pls-end d-p-200 d-size-100 d-bgc-bold-opaque d-bar4">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">4</dt-stack>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols2">
  <div class="d-pls-stretch">1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Center

Use `d-pls-center{-n}` to align a grid item along the center of their block and/or inline axis.

<code-well-header>
  <div class="d-d-grid d-g-cols2 d-g-200 d-w100p d-h-350 d-bar8 d-bgc-moderate">
    <dt-stack direction="row" align="center" justify="center" class="d-pls-center d-p-200 d-size-100 d-bgc-bold-opaque d-bar4">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate-opaque d-bar4">4</dt-stack>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols2">
  <div class="d-pls-center">1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

<script setup>
  const alignments = ['center', 'end', 'start', 'stretch'];
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <template v-for="c in alignments">
        <tr v-for="i in alignments">
          <th scope="row" class="d-code--sm d-docsite-code">
            <span v-if="i !== c">.d-pls-{{ c }}-{{ i }}</span>
            <span v-else>.d-pls-{{ c }}</span>
          </th>
          <td class="d-code--sm" outline>
            <span v-if="i !== c">place-self: {{ c }} {{ i }} !important;</span>
            <span v-else>place-self: {{ c }} !important;</span>
          </td>
        </tr>
      </template>
    </tbody>
  </template>
</utility-class-table>
