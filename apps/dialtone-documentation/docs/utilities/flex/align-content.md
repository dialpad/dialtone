---
title: Align Content
description: Utilities for setting how rows are distributed along its cross axis. This property only works when a parent container has more than one line.
---

<FlexStackNotice />

## Flex Start

Use `d-ac-flex-start` to pack multiple rows against the start of the element's cross axis. This is the default value.

<code-well-header>
  <div class="d-fl-col3 d-g16 d-fw-wrap d-ac-flex-start d-p8 d-w100p d-bar8 d-bgc-moderate d-hmn332">
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">4</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">5</dt-stack>
  </div>
</code-well-header>

```html
<dt-stack class="d-ac-flex-start">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Center

Use `d-ac-center` to pack rows along the center of the element's cross axis.

<code-well-header>
  <div class="d-fl-col3 d-g16 d-fw-wrap d-ac-center d-p8 d-w100p d-bar8 d-bgc-moderate d-hmn332">
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">4</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">5</dt-stack>
  </div>
</code-well-header>

```html
<dt-stack class="d-ac-center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Flex End

Use `d-ac-flex-end` to rack rows against the end of the element's main axis.

<code-well-header >
  <div class="d-fl-col3 d-fw-wrap d-g16 d-ac-flex-end d-p8 d-w100p d-bar8 d-bgc-moderate d-hmn332">
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">4</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">5</dt-stack>
  </div>
</code-well-header>

```html
<dt-stack class="d-ac-flex-end">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Space Around

Use `d-ac-space-around` to pack rows along the element's cross axis so that there is an equal amount of space on each side of the item. This effectively takes all available space, divides it for each row, placing half of alotted space on either side of the row. This is why the space appears doubled for interior rows versus end rows.

<code-well-header>
  <div class="d-fl-col3 d-fw-wrap d-g16 d-ac-space-around d-bgc-red-100 d-p8 d-w100p d-bar8 d-bgc-moderate d-hmn332">
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">4</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">5</dt-stack>
  </div>
</code-well-header>

```html
<dt-stack class="d-ac-space-around">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
</dt-stack>
```

## Space Between

Use `d-ac-space-between` to distribute rows along the element's cross axis so that there is an equal amount of space between each row without inserting any space between the first or last object.

<code-well-header>
  <div class="d-fl-col3 d-fw-wrap d-g16 d-ac-space-between d-p8 d-w100p d-bar8 d-bgc-moderate d-hmn332">
    <dt-stack direction="row" align="center" justify="center" class="d-m8 d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-m8 d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-m8 d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-m8 d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">4</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-m8 d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">5</dt-stack>
  </div>
</code-well-header>

```html
<dt-stack class="d-ac-space-between">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
</dt-stack>
```

## Space Evenly

Use `d-ac-space-evenly` to distribute rows along the element's cross axis so that there is an equal amount of space on each side of the rows, but unlike `d-ac-space-around` the space visually looks evenly distributed between objects.

<code-well-header>
  <div class="d-fl-col3 d-fw-wrap d-g16 d-ac-space-evenly d-p8 d-w100p d-bar8 d-bgc-moderate d-hmn332">
    <dt-stack direction="row" align="center" justify="center" class="d-m8 d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-m8 d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-m8 d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-m8 d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">4</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-m8 d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">5</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-m8 d-p16 d-h64 d-bgc-moderate-opaque d-bar4" style="--migrate-outline-color: orangered; outline: 2px solid var(--migrate-outline-color); outline-off-set: -2px">6</dt-stack>
  </div>
</code-well-header>

```html
<dt-stack class="d-ac-space-evenly">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
  <div>7</div>
  <div>8</div>
</dt-stack>
```

<script setup>
import { alignContent } from '@data/flex.json';
</script>

## Classes

<utility-class-table>
 <template #content>
    <tbody>
      <tr v-for="{ class: className, output } in alignContent">
        <th scope="row" class="d-code--sm d-docsite-code">.d-{{ className }}</th>
        <td class="d-code--sm">{{ output }}</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
