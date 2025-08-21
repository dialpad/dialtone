---
title: Divide Color
description: Utilities for controlling the border color between an element's child items.
---

## Vertical Dividers

Use `d-divide-y{n}` to create a divider between an element's child items.

<code-well-header>
  <dt-stack class="d-divide-y d-divide-default d-w100p">
    <div class="d-fl-center d-p16">1</div>
    <div class="d-fl-center d-p16">2</div>
    <div class="d-fl-center d-p16">3</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack class="d-divide-y d-divide-default d-w100p">
  <div class="d-fl-center d-w100p d-p16">1</div>
  <div class="d-fl-center d-w100p d-p16">2</div>
  <div class="d-fl-center d-w100p d-p16">3</div>
</dt-stack>
```

## Horizontal Dividers

Use `d-divide-x{n}` to create a divider between an element's child items.

<code-well-header>
  <dt-stack direction="row" class="d-divide-x d-divide-default d-w100p">
    <div class="d-fl-center d-w100p d-p16">1</div>
    <div class="d-fl-center d-w100p d-p16">2</div>
    <div class="d-fl-center d-w100p d-p16">3</div>
  </dt-stack>
</code-well-header>

```html
<dt-stack direction="row" class="d-divide-x d-divide-default d-w100p">
  <div class="d-fl-center d-w100p d-p16">1</div>
  <div class="d-fl-center d-w100p d-p16">2</div>
  <div class="d-fl-center d-w100p d-p16">3</div>
</dt-stack>
```

## Classes

<new-utility-class-table :classes="divideColors">
  <template #example="{ className }">
    <div
      class="d-d-flex d-fl-shrink0 d-w42 d-h42 d-w24 d-ta-center"
      :class="[
        className.startsWith('d-divide-x') ? 'd-divide-x d-fl-col2' : 'd-divide-y d-fd-column',
        className
      ]"
    >
      <div class="d-fl-center">1</div>
      <div class="d-fl-center">2</div>
    </div>
  </template>
</new-utility-class-table>

<script setup>
  import { inject } from 'vue';
  import { extractUtilityClasses } from '@utilities';

  const utilityClassDocs = inject('utilityClassDocs');
  const divideColors = extractUtilityClasses(utilityClassDocs, 'd-divide-');
</script>
