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

<code-well-header class="d-d-block">
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
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-item-layout">
  <section class="d-item-layout--left">
    <svg>...</svg>
  </section>
  <section class="d-item-layout--content">
    <div class="d-item-layout--title">
      Layout title
    </div>
    <div class="d-item-layout--subtitle d-item-layout--subtitle--with-title">
      Subtitle
    </div>
    <div class="d-item-layout--bottom">
      <span class="d-badge">
        <span class="d-badge__label">Content</span>
      </span>
    </div>
  </section>
  <section class="d-item-layout--right">
    <svg>...</svg>
  </section>
  <section class="d-item-layout--selected">
    <svg>...</svg>
  </section>
</div>
'
vueCode='
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
'
showHtmlWarning />

## Without Styling

Setting the `unstyled` property will add `d-item-layout--custom` class. This will change the item-layout from flexbox to grid, removing all the custom styling while maintaining the slots positions.

This way you can utilize the layout and customize your own styling using utility classes.

<code-well-header class="d-d-block">
  <dt-item-layout unstyled ref="exampleUnstyled">
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
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.exampleUnstyled"
vueCode='
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
'
/>

## Vue API

<component-vue-api component-name="itemLayout" />
