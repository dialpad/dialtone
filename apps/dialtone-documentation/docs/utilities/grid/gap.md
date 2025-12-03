---
title: Gap
description: Utilities to control the spacing between columns, rows, or both in grids.
---

## Adding Universal Row and Column Gaps

Use `d-g{#}` to universally change the row and column gap space in grid layouts.

<code-well-header>
  <div class="d-d-grid d-g16 d-g-cols2 d-w100p d-bar8 d-bgc-bold">
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-bar4">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-bar4">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-bar4">3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-bar4">4</dt-stack>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-g16 d-g-cols2">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Independently Changing Row and Column Gaps

Use `d-cg{#}` or `d-rg{#}` to independently change the row and column gap space in grid layouts.

<code-well-header>
  <div class="d-d-grid d-cg24 d-rg8 d-g-cols3 d-w100p d-bar8 d-bgc-bold">
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-bar4">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-bar4">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-bar4">3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-bar4">4</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-bar4">5</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-bar4">6</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-bar4">7</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-bar4">8</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p16 d-bgc-moderate d-bar4">9</dt-stack>
  </div>
</code-well-header>

```html
<div class="d-d-grid d-cg24 d-rg8 d-g-cols3">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
  <div>7</div>
  <div>8</div>
  <div>9</div>
</div>
```

<script setup>
  import { directions, values } from '@data/gap.json';
</script>

## Classes

<utility-class-table>
  <template #content>
    <tbody v-for="dir in directions">
      <tr v-for="{ output: rem, value: px } in values">
        <th scope="row" class="d-code--sm d-docsite-code">
          <span v-if="dir === 'both'">.d-g{{ px }}</span>
          <span v-else-if="dir === 'column'">.d-cg{{ px }}</span>
          <span v-else-if="dir === 'row'">.d-rg{{ px }}</span>
        </th>
        <td class="d-code--sm">
          <span v-if="dir !== 'both'">{{ dir }}-gap: {{ rem }}</span>
          <span v-else>gap: {{ rem }}</span>
        </td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
