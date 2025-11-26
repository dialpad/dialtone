---
title: Justify Items
description: Utilities for controlling how grid items align along their inline axis.
---

## Auto

Use `d-ji-auto` to justify grid items automatically along their inline axis. This is the default value.

<code-well-header>
  <div class="d-d-grid d-g16 d-g-cols2 d-ji-auto d-w100p d-bar8 d-bgc-moderate">
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" data-migrate-outline>1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" data-migrate-outline>2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" data-migrate-outline>3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" data-migrate-outline>4</dt-stack>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols2 d-ji-auto">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Start

Use `d-ji-start` to justify items against the start of their inline axis. Note that this does not work on flexed objects, only grid objects.

<code-well-header>
  <div class="d-d-grid d-g16 d-g-cols2 d-ji-start d-w100p d-bar8 d-bgc-moderate">
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" data-migrate-outline>1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" data-migrate-outline>2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" data-migrate-outline>3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" data-migrate-outline>4</dt-stack>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols2 d-ji-start">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## End

Use `d-ji-end` to justify items against the end of their inline axis. Note that this does not work on flexed objects, only grid objects.

<code-well-header>
  <div class="d-d-grid d-g16 d-g-cols2 d-ji-end d-w100p d-bar8 d-bgc-moderate">
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" data-migrate-outline>1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" data-migrate-outline>2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" data-migrate-outline>3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" data-migrate-outline>4</dt-stack>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols2 d-ji-end">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Center

Use `d-ji-center` to justify items to the center of their inline axis.

<code-well-header>
  <div class="d-d-grid d-g16 d-g-cols2 d-ji-center d-w100p d-bar8 d-bgc-moderate">
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" data-migrate-outline>1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" data-migrate-outline>2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" data-migrate-outline>3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-wmn64 d-bgc-moderate-opaque d-bar4" data-migrate-outline>4</dt-stack>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g-cols2 d-ji-center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Classes

<utility-class-table>
  <template #content>
    <tbody>
      <tr v-for="i in ['center', 'end', 'start', 'left', 'right', 'baseline', 'first-baseline', 'last-baseline', 'stretch', 'safe', 'unsafe', 'normal', 'legacy', 'auto', 'unset']">
        <th scope="row" class="d-code--sm d-docsite-code">.d-ji-{{ i }}</th>
        <td class="d-code--sm">justify-items: {{ i }} !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
