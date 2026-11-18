---
title: Item Layout
description: Reusable layout foundation for list-style rows.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-item-layout--default
keywords: ["list layout","item structure","d-item-layout","DtItemLayout","dt-item-layout"]
combinator: DtItemLayout
---

## With Default Styling

By default, item layout includes custom styling, like paddings, sizes, colors, etc.

```vue demo
<!-- @wrapper -->
<div class="d-d-block d-w-500">
  <dt-item-layout>
    <template #start>
      <dt-icon-lock size="300" />
    </template>
    Layout title
    <template #subtitle>
      Subtitle
    </template>
    <template #blockEnd>
      <dt-badge>Content</dt-badge>
    </template>
    <template #end>
      <dt-icon-share size="300" />
    </template>
    <template #selected>
      <dt-icon-check size="300" />
    </template>
  </dt-item-layout>
</div>
```

## Without Styling

Setting the `unstyled` property will add `d-item-layout--custom` class. This will change the item-layout from flexbox to grid, removing all the custom styling while maintaining the slots positions.

This way you can utilize the layout and customize your own styling using utility classes.

```vue demo
<!-- @wrapper -->
<div class="d-d-block d-w-500">
  <dt-item-layout unstyled>
    <template #start>
      <dt-icon-lock size="300" />
    </template>
    Layout title
    <template #subtitle>
      Subtitle
    </template>
    <template #blockEnd>
      <dt-badge>Content</dt-badge>
    </template>
    <template #end>
      <dt-icon-share size="300" />
    </template>
    <template #selected>
      <dt-icon-check size="300" />
    </template>
  </dt-item-layout>
</div>
```

## Vue API

<component-vue-api component-name="itemLayout" />

<script setup>
import { DtIconLock, DtIconShare, DtIconCheck } from '@dialpad/dialtone-icons/vue';
</script>
