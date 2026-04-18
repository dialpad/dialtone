---
title: Gap
description: Utilities to control the spacing between columns, rows, or both in grids.
keywords: ["css grid","grid gap","gutter","spacing"]
---

Use `d-g-{stop}` to set gap using spacing token stops. The number references the spacing token (`d-g-100` = `--dt-spacing-100` = 8px). These classes work with both flex and grid layouts.

## Adding Universal Row and Column Gaps

Use `d-g-{stop}` to universally change the row and column gap space in grid layouts.

```vue demo
<div class="d-d-grid d-g-200 d-g-cols2 d-w100p d-bar-400 d-bgc-bold">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">4</dt-stack>
</div>
```

## Independently Changing Row and Column Gaps

Use `d-cg-{stop}` or `d-rg-{stop}` to independently change the row and column gap space in grid layouts.

```vue demo
<div class="d-d-grid d-cg-300 d-rg-100 d-g-cols3 d-w100p d-bar-400 d-bgc-bold">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">4</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">5</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">6</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">7</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">8</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">9</dt-stack>
</div>
```

<script setup>
  import { directions, values } from '@data/gap.json';
</script>

## Classes

<utility-class-table show-rendered>
  <template #content>
    <tbody v-for="dir in directions">
      <tr v-for="{ stop, px } in values">
        <th scope="row" class="d-code--sm d-docsite-code">
          <span v-if="dir === 'both'">.d-g-{{ stop }}</span>
          <span v-else-if="dir === 'column'">.d-cg-{{ stop }}</span>
          <span v-else-if="dir === 'row'">.d-rg-{{ stop }}</span>
        </th>
        <td class="d-code--sm">
          <span v-if="dir !== 'both'">{{ dir }}-gap: var(--dt-spacing-{{ stop }}) !important;</span>
          <span v-else>gap: var(--dt-spacing-{{ stop }}) !important;</span>
        </td>
        <td class="d-code--sm d-fc-tertiary d-ta-right">{{ parseFloat(px) / 10 }}rem</td>
        <td class="d-code--sm d-fc-tertiary d-ta-right">{{ px }}</td>
      </tr>
    </tbody>
    <tbody>
      <tr>
        <th scope="row" class="d-code--sm d-docsite-code">.d-g-unset</th>
        <td class="d-code--sm">gap: unset !important;</td>
        <td class="d-fc-muted d-fs-100 d-ta-center">N/A</td>
        <td class="d-fc-muted d-fs-100 d-ta-center">N/A</td>
      </tr>
      <tr>
        <th scope="row" class="d-code--sm d-docsite-code">.d-cg-unset</th>
        <td class="d-code--sm">column-gap: unset !important;</td>
        <td class="d-fc-muted d-fs-100 d-ta-center">N/A</td>
        <td class="d-fc-muted d-fs-100 d-ta-center">N/A</td>
      </tr>
      <tr>
        <th scope="row" class="d-code--sm d-docsite-code">.d-rg-unset</th>
        <td class="d-code--sm">row-gap: unset !important;</td>
        <td class="d-fc-muted d-fs-100 d-ta-center">N/A</td>
        <td class="d-fc-muted d-fs-100 d-ta-center">N/A</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
