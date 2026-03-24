---
title: Gap
description: Utilities to control the spacing between columns, rows, or both.
keywords: ["flexbox","flex gap","spacing","gutter"]
---

<FlexStackNotice />

Use `d-g-{stop}` to set gap using spacing token stops. The number references the spacing token (`d-g-100` = `--dt-spacing-100` = 8px). These classes work with both flex and grid layouts.

## Adding Universal Row and Column Gaps

Use `d-g-{stop}` to universally change the row and column gap space.

<code-well-header>
  <dt-stack direction="row" class="d-fl-col2 d-fw-wrap d-g-200 d-bar8 d-w100p d-bgc-bold">
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar4">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar4">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar4">3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar4">4</dt-stack>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" class="d-fl-col2 d-fw-wrap d-g-200">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</dt-stack>
```

## Row Gap

Use `d-rg-{stop}` to change the row gap space.

<code-well-header>
  <dt-stack class="d-rg-200 d-bar8 d-w100p d-bgc-bold">
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar4">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar4">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar4">3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar4">4</dt-stack>
  </dt-stack>
</code-well-header>

```html
<dt-stack class="d-rg-200">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</dt-stack>
```

## Column Gap

Use `d-cg-{stop}` to change the column gap space.

<code-well-header>
  <dt-stack direction="row" class="d-fl-col4 d-cg-200 d-bar8 d-w100p d-bgc-bold">
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar4">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar4">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar4">3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar4">4</dt-stack>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" class="d-fl-col4 d-cg-200">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</dt-stack>
```

## Independently Changing Row and Column Gaps

<code-well-header>
  <dt-stack direction="row" class="d-fl-col2 d-fw-wrap d-rg-400 d-cg-100 d-bar8 d-w100p d-bgc-bold">
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar4">1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar4">2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar4">3</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-p-200 d-bgc-moderate d-bar4">4</dt-stack>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" class="d-rg-400 d-cg-100">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</dt-stack>
```

<script setup>
  import { directions, values } from '@data/gap.json';
</script>

## Classes

<utility-class-table>
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
          <span class="d-fc-tertiary"> /* {{ px }} */</span>
        </td>
      </tr>
    </tbody>
    <tbody>
      <tr>
        <th scope="row" class="d-code--sm d-docsite-code">.d-g-unset</th>
        <td class="d-code--sm">gap: unset !important;</td>
      </tr>
      <tr>
        <th scope="row" class="d-code--sm d-docsite-code">.d-cg-unset</th>
        <td class="d-code--sm">column-gap: unset !important;</td>
      </tr>
      <tr>
        <th scope="row" class="d-code--sm d-docsite-code">.d-rg-unset</th>
        <td class="d-code--sm">row-gap: unset !important;</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
