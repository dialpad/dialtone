---
title: Notice
description: A notice is an informational and assistive message that appears inline with content.
status: ready
thumb: true
image: assets/images/components/notice.png
storybook: https://vue.dialpad.design/?path=/story/components-notice--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8921%3A23341&viewport=145%2C-209%2C0.31&t=xHutRjwo1o5zMTgT-11
---

<code-well-header bgclass="d-bgc-primary">
  <example-notice kind="base" title="Base title (optional)" />
</code-well-header>

<!-- <component-combinator component-name="DtNotice" /> -->

## Usage

A notice delivers informational and assistive messages that inform the user about product or account statuses and related actions. It can suggest an action or dismissed by the user, though neither are required. For time-based notifications, see [Toast](toast.md).

## Variants and examples

### Base Styles

Used in most scenarios when the message should be noticeable but not dominate.

<code-well-header bgclass="d-bgc-primary">
  <example-notice kind="base" title="Base title (optional)" />
  <example-notice kind="error" title="Error title (optional)" />
  <example-notice kind="info" title="Info title (optional)" />
  <example-notice kind="success" title="Success title (optional)" />
  <example-notice kind="warning" title="Warning title (optional)" />
</code-well-header>

```html
<aside class="d-notice d-notice--base" role="status" aria-hidden="false">
  <div class="d-notice__icon">...</div>
  <div class="d-notice__content">
    <h2 class="d-notice__title">...</h2>
    <p class="d-notice__message">...</p>
  </div>
  <div class="d-notice__actions">...</div>
</aside>

<aside class="d-notice d-notice--error" role="status" aria-hidden="false">...</aside>
<aside class="d-notice d-notice--info" role="status" aria-hidden="false">...</aside>
<aside class="d-notice d-notice--success" role="status" aria-hidden="false">...</aside>
<aside class="d-notice d-notice--warning" role="status" aria-hidden="false">...</aside>
```

### Important

Used occasionally in scenarios when the message needs to dominate.

<code-well-header>
  <example-notice important kind="base" title="Base title (optional)" />
  <example-notice important kind="error" title="Error title (optional)" />
  <example-notice important kind="info" title="Info title (optional)" />
  <example-notice important kind="success" title="Success title (optional)" />
  <example-notice important kind="warning" title="Warning title (optional)" />
</code-well-header>

```html
<aside class="d-notice d-notice--base d-notice--important" role="alert" aria-hidden="false">
  <div class="d-notice__icon">...</div>
  <div class="d-notice__content">
    <h2 class="d-notice__title">...</h2>
    <p class="d-notice__message">...</p>
  </div>
  <div class="d-notice__actions">...</div>
</aside>

<aside class="d-notice d-notice--error d-notice--important" role="alert" aria-hidden="false">…</aside>
<aside class="d-notice d-notice--info d-notice--important" role="alert" aria-hidden="false">…</aside>
<aside class="d-notice d-notice--success d-notice--important" role="alert" aria-hidden="false">…</aside>
<aside class="d-notice d-notice--warning d-notice--important" role="alert" aria-hidden="false">…</aside>
```

## Vue API

<component-vue-api component-name="notice" />

## Classes

<component-class-table component-name="notice" />

## Accessibility

<component-accessible-table component-name="notice" />

<script setup>
  import ExampleNotice from '@exampleComponents/ExampleNotice.vue';
</script>
