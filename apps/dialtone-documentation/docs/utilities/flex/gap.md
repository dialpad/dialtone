---
title: Gap
description: Utilities to control the spacing between columns, rows, or both.
---

<FlexStackNotice />

## Adding Universal Row and Column Gaps

Use `d-g{#}` to universally change the row and column gap space.

<code-well-header>
  <dt-stack direction="row" class="d-fl-col2 d-fw-wrap d-g16 d-bar8 d-w100p d-bgc-bold">
    <div class="d-fl-center d-p16 d-bgc-moderate d-bar4">1</div>
    <div class="d-fl-center d-p16 d-bgc-moderate d-bar4">2</div>
    <div class="d-fl-center d-p16 d-bgc-moderate d-bar4">3</div>
    <div class="d-fl-center d-p16 d-bgc-moderate d-bar4">4</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" class="d-fl-col2 d-fw-wrap d-g16">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</dt-stack>
```

## Row Gap

Use `d-rg{#}` to change the row gap space.

<code-well-header>
  <dt-stack class="d-rg16 d-bar8 d-w100p d-bgc-bold">
    <div class="d-fl-center d-p16 d-bgc-moderate d-bar4">1</div>
    <div class="d-fl-center d-p16 d-bgc-moderate d-bar4">2</div>
    <div class="d-fl-center d-p16 d-bgc-moderate d-bar4">3</div>
    <div class="d-fl-center d-p16 d-bgc-moderate d-bar4">4</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack class="d-rg16">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</dt-stack>
```

## Column Gap

Use `d-cg{#}` to change the column gap space.

<code-well-header>
  <dt-stack direction="row" class="d-fl-col4 d-cg16 d-bar8 d-w100p d-bgc-bold">
    <div class="d-fl-center d-p16 d-bgc-moderate d-bar4">1</div>
    <div class="d-fl-center d-p16 d-bgc-moderate d-bar4">2</div>
    <div class="d-fl-center d-p16 d-bgc-moderate d-bar4">3</div>
    <div class="d-fl-center d-p16 d-bgc-moderate d-bar4">4</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" class="d-fl-col4 d-cg16">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</dt-stack>
```

## Independently Changing Row and Column Gaps

<code-well-header>
  <dt-stack direction="row" class="d-fl-col2 d-fw-wrap d-rg32 d-cg8 d-bar8 d-w100p d-bgc-bold">
    <div class="d-fl-center d-p16 d-bgc-moderate d-bar4">1</div>
    <div class="d-fl-center d-p16 d-bgc-moderate d-bar4">2</div>
    <div class="d-fl-center d-p16 d-bgc-moderate d-bar4">3</div>
    <div class="d-fl-center d-p16 d-bgc-moderate d-bar4">4</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" class="d-rg32 d-cg8">
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
