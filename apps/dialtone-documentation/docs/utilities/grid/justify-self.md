---
title: Justify Self
description: Utilities for controlling how a grid item is aligned along its inline axis.
---

## Auto

Use `d-js-auto` to justify an item automatically along its inline axis. This is the default value.

<code-well-header>
  <div class="d-d-grid d-g16 d-g-cols3 d-w100p d-bar8 d-bgc-moderate">
    <dt-stack direction="row" align="center" justify="center" class="d-js-auto d-p16 d-wmn64 d-bgc-bold-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">3</dt-stack>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols3">
  <div class="d-js-auto">1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Start

Use `d-js-start` to justify an item to the start of its inline axis.

<code-well-header>
  <div class="d-d-grid d-g16 d-g-cols3 d-w100p d-bar8 d-bgc-moderate">
    <dt-stack direction="row" align="center" justify="center" class="d-js-start d-p16 d-wmn64 d-bgc-bold-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">3</dt-stack>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols3">
  <div class="d-js-start">1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## End

Use `d-js-end` to justify an item to the end of its inline axis.

<code-well-header>
  <div class="d-d-grid d-g16 d-g-cols3 d-w100p d-bar8 d-bgc-moderate">
    <dt-stack direction="row" align="center" justify="center" class="d-js-end d-p16 d-wmn64 d-bgc-bold-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">3</dt-stack>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols3">
  <div class="d-js-end">1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Center

Use `d-js-center` to justify an item to the center of its inline axis.

<code-well-header>
  <div class="d-d-grid d-g16 d-g-cols3 d-w100p d-bar8 d-bgc-moderate">
    <dt-stack direction="row" align="center" justify="center" class="d-js-center d-p16 d-wmn64 d-bgc-bold-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">3</dt-stack>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols3">
  <div class="d-js-center">1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in ['center', 'end', 'start', 'left', 'right', 'baseline', 'first-baseline', 'last-baseline', 'stretch', 'safe', 'unsafe', 'normal', 'legacy', 'auto', 'unset']">
        <th scope="row" class="d-code--sm d-docsite-code">.d-js-{{ i }}</th>
        <td class="d-code--sm">justify-self: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
