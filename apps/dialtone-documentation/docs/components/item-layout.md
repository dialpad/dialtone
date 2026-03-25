---
title: Item Layout
description: An item layout provides a standardized group of containers to enable developer to use list-item like stack. It is used as base for `dt-list-item` component
status: ready
thumb: true
image: assets/images/components/item-layout.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-item-layout--default
keywords: ["list layout","item structure","d-item-layout","DtItemLayout","dt-item-layout"]
---

<component-combinator component-name="DtItemLayout" />

## With Default Styling

By default, item layout includes custom styling, like paddings, sizes, colors, etc.

<code-example>
  <div class="d-d-block d-w332" data-demo-wrapper>
    <dt-item-layout>
      <template #start>
        <dt-icon size="300" name="lock" />
      </template>
      Layout title
      <template #subtitle>
        Subtitle
      </template>
      <template #bottom>
        <dt-badge>Content</dt-badge>
      </template>
      <template #end>
        <dt-icon size="300" name="share" />
      </template>
      <template #selected>
        <dt-icon size="300" name="check" />
      </template>
    </dt-item-layout>
  </div>
</code-example>

## Without Styling

Setting the `unstyled` property will add `d-item-layout--custom` class. This will change the item-layout from flexbox to grid, removing all the custom styling while maintaining the slots positions.

This way you can utilize the layout and customize your own styling using utility classes.

<code-example>
  <div class="d-d-block d-w332" data-demo-wrapper>
    <dt-item-layout unstyled>
      <template #start>
        <dt-icon size="300" name="lock" />
      </template>
      Layout title
      <template #subtitle>
        Subtitle
      </template>
      <template #bottom>
        <dt-badge>Content</dt-badge>
      </template>
      <template #end>
        <dt-icon size="300" name="share" />
      </template>
      <template #selected>
        <dt-icon size="300" name="check" />
      </template>
    </dt-item-layout>
  </div>
</code-example>

## Vue API

<component-vue-api component-name="itemLayout" />
