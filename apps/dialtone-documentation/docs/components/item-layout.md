---
title: Item layout
description: An item layout provides a standardized group of containers to enable developer to use list-item like stack. It is used as base for `dt-list-item` component
status: ready
thumb: true
image: assets/images/components/item-layout.png
storybook: https://vue.dialpad.design/?path=/story/components-item-layout--default
---

<code-well-header>
<dt-item-layout>
  <template #left>
      <dt-icon name="lock" />
    </template>
    Layout title
    <template #subtitle>
      Subtitle
    </template>
    <template #bottom>
      <dt-badge>Content</dt-badge>
    </template>
    <template #right>
      <dt-icon name="share" />
    </template>
    <template #selected>
      <dt-icon name="check" />
    </template>
</dt-item-layout>
</code-well-header>

## Vue API

<component-vue-api component-name="itemLayout" />
