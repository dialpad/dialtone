---
title: Align Items
description: Utilities for setting how an element's is aligned along an element's cross axis.
---

<FlexStackNotice />

## Stretch

Use `d-ai-stretch` to stretch items across the element's cross axis. This is the default value.

<code-well-header>
  <dt-stack direction="row" class="d-ai-stretch d-p8 d-w100p d-hmn216 d-bar8 d-bgc-moderate">
    <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m8 d-px16 d-py8 d-bgc-moderate-opaque d-bar4" data-migrate-outline>1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m8 d-px16 d-py16 d-bgc-moderate-opaque d-bar4" data-migrate-outline>2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m8 d-px16 d-py4 d-bgc-moderate-opaque d-bar4" data-migrate-outline>3</dt-stack>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" class="d-ai-stretch">
  <div class="d-py8">1</div>
  <div class="d-py16">2</div>
  <div class="d-py4">3</div>
</dt-stack>
```

## Flex Start

Use `d-ai-flex-start` to align items to the start of the element's cross axis.

<code-well-header>
  <dt-stack direction="row" class="d-ai-flex-start d-p8 d-w100p d-hmn216 d-bar8 d-bgc-moderate">
    <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m8 d-px16 d-py4 d-bgc-moderate-opaque d-bar4" data-migrate-outline>1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m8 d-px16 d-py24 d-bgc-moderate-opaque d-bar4" data-migrate-outline>2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m8 d-px16 d-py16 d-bgc-moderate-opaque d-bar4" data-migrate-outline>3</dt-stack>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" class="d-ai-flex-start">
  <div class="d-h32">1</div>
  <div class="d-h64">2</div>
  <div class="d-h16">3</div>
</dt-stack>
```

## Center

Use `d-ai-center` to distribute items along the center of the element's cross axis.

<code-well-header>
  <dt-stack direction="row" class="d-ai-center d-p8 d-w100p d-hmn216 d-bar8 d-bgc-moderate">
    <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m8 d-px16 d-py4 d-bgc-moderate-opaque d-bar4" data-migrate-outline>1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m8 d-px16 d-py24 d-bgc-moderate-opaque d-bar4" data-migrate-outline>2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m8 d-px16 d-py16 d-bgc-moderate-opaque d-bar4" data-migrate-outline>3</dt-stack>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" class="d-ai-center">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

## Flex End

Use `d-ai-flex-end` to distribute items from the end of the element's cross axis.

<code-well-header>
  <dt-stack direction="row" class="d-ai-flex-end d-p8 d-w100p d-hmn216 d-bar8 d-bgc-moderate">
    <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m8 d-px16 d-py4 d-bgc-moderate-opaque d-bar4" data-migrate-outline>1</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m8 d-px16 d-py24 d-bgc-moderate-opaque d-bar4" data-migrate-outline>2</dt-stack>
    <dt-stack direction="row" align="center" justify="center" class="d-fl1 d-m8 d-px16 d-py16 d-bgc-moderate-opaque d-bar4" data-migrate-outline>3</dt-stack>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" class="d-ai-flex-end">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
</dt-stack>
```

<script setup>
  import { alignItems } from '@data/flex.json';
</script>

## Classes

<utility-class-table>
 <template #content>
    <tbody>
      <tr v-for="{ class: className, output } in alignItems">
        <th scope="row" class="d-code--sm d-docsite-code">.d-{{ className }}</th>
        <td class="d-code--sm">{{ output }}</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
