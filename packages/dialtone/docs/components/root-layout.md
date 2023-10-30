---
title: Root layout
description: A root layout provides a standardized group of containers to display content at the root level.
status: ready
thumb: true
image: assets/images/components/root-layout.png
storybook: https://vue.dialpad.design/?path=/story/components-root-layout--default
---

<code-well-header>
<dt-root-layout
  :fixed="false"
  class="d-w100p d-h332"
>
  <template
    #header
  >
    <div class="d-h64 d-bgc-purple-100">Header</div>
  </template>
  <template
    #sidebar
  >
    <div class="d-w128 d-h100p d-bgc-black-100"><div>Sidebar item 1</div><div>Sidebar item 2</div><div>Sidebar item 3</div></div>
  </template>
  <div class="d-bgc-green-100 d-w100p d-h100p">Content</div>
  <template
    #footer
  >
    <div class="d-h64 d-bgc-gold-100">Footer</div>
  </template>
</dt-root-layout>
</code-well-header>

## Variants and examples

### Header Sticky

<div
  class="d-h332 d-of-scroll"
>
  <dt-root-layout
    header-sticky
    class="d-w100p d-h332"
  >
    <template
      #header
    >
      <div class="d-h64 d-bgc-purple-100">Header</div>
    </template>
    <template
      #sidebar
    >
      <div class="d-w128 d-h100p d-bgc-black-100"><div>Sidebar item 1</div><div>Sidebar item 2</div><div>Sidebar item 3</div></div>
    </template>
      <div class="d-bgc-green-100 d-w100p d-h100p">Content</div>
    <template
      #footer
    >
      <div class="d-h64 d-bgc-gold-100">Footer</div>
    </template>
  </dt-root-layout>
</div>

## Vue API

<component-vue-api component-name="rootlayout" />
