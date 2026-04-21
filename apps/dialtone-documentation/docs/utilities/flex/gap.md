---
title: Gap
description: Utilities to control the spacing between columns, rows, or both.
keywords: ["flexbox","flex gap","spacing","gutter"]
---

> [!WARNING] Use DtStack in favor of Flex CSS Utilities
> Use the [DtStack](/components/stack) component for most Flex-based layout implementations. View [Migrating from Flex CSS Utilities to DtStack](/about/whats-new/posts/2025-12-2) for more details.

Use `d-g-{stop}` to set gap using spacing token stops. The number references the spacing token (`d-g-100` = `--dt-spacing-100` = 8px). These classes work with both flex and grid layouts.

## Adding Universal Row and Column Gaps

Use `d-g-{stop}` to universally change the row and column gap space.

```vue demo
<dt-stack direction="row" class="d-fl-col2 d-fw-wrap d-g-200 d-bar-400 d-w100p d-bgc-bold">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">4</dt-stack>
</dt-stack>
```

## Row Gap

Use `d-rg-{stop}` to change the row gap space.

```vue demo
<dt-stack class="d-rg-200 d-bar-400 d-w100p d-bgc-bold">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">4</dt-stack>
</dt-stack>
```

## Column Gap

Use `d-cg-{stop}` to change the column gap space.

```vue demo
<dt-stack direction="row" class="d-fl-col4 d-cg-200 d-bar-400 d-w100p d-bgc-bold">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">4</dt-stack>
</dt-stack>
```

## Independently Changing Row and Column Gaps

```vue demo
<dt-stack direction="row" class="d-fl-col2 d-fw-wrap d-rg-400 d-cg-100 d-bar-400 d-w100p d-bgc-bold">
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">3</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar-300">4</dt-stack>
</dt-stack>
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
