---
title: Banner
description: A banner is a type of Notice, delivering system and engagement messaging. It is highly intrusive and should be used sparingly and appropriately.
status: ready
thumb: true
image: assets/images/components/banner.png
storybook: https://vue.dialpad.design/?path=/story/components-banner--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8922%3A20410&viewport=-178%2C151%2C0.23&t=xHutRjwo1o5zMTgT-11
---

<code-well-header class="d-p0">
    <dt-banner title="Example banner" kind="info" class="d-ps-relative d-zi-base" :close-button-props="{ariaLabel: 'Close button'}">
        Message body with a <dt-link kind="muted">Link</dt-link>
    </dt-banner>
</code-well-header>

## Usage

System banners are used for **system** messaging. They are full-width notices placed in one of two locations:

1. **Above everything else:** If the banner is related to the entire app (e.g. the user lost internet service), place the banner first. <em>These should not be dismissable until the issue is resolved.</em> To pin the banner to the top of the app, add the `.d-notice--pinned` class.
2. **Below the top bar:** This is the default location for system banners. Use these when it affects only a particular area of the product (e.g. when the user is in Do Not Disturb mode).

Banners are a type of notice and so you can use the following [Notice](notice.md) styles in conjunction with `.d-banner`.

## Variants and examples

<code-well-header>
    <div class="d-d-flex d-w100p d-flow8 d-ai-flex-end">
        <div class="d-fl-grow1">
            <dt-select-menu label="Style" :options="bannerOptions" @change="changeKind" />
        </div>
        <dt-checkbox value="important" @input="toggleImportant">Important</dt-checkbox>
        <dt-button @click="toggleBanner">Toggle Example</dt-button>
    </div>
</code-well-header>

<dt-banner
  :pinned="pinned"
  :important="important"
  :kind="selectedKind"
  :close-button-props="{ariaLabel: 'Close button'}"
  title="Optional banner title"
  v-show="showBanner"
  @close="showBanner = false"
>
  Message body
</dt-banner>

```html
<aside class="d-banner d-banner--base" role="alert" aria-hidden="false">
  <div class="d-banner__dialog" role="alertdialog" aria-labelledy="info-alert-title" aria-describedby="info-alert-desc">
    <div class="d-notice__icon">...</div>
    <div class="d-notice__content">
      <h2 class="d-notice__title" id="info-alert-title">...</h2>
      <p class="d-notice__message" id="info-alert-desc">...</p>
    </div>
    <div class="d-notice__actions">...</div>
</aside>

<aside class="d-banner d-banner--error" role="alert" aria-hidden="false">...</aside>
<aside class="d-banner d-banner--info" role="alert" aria-hidden="false">...</aside>
<aside class="d-banner d-banner--success" role="alert" aria-hidden="false">...</aside>
<aside class="d-banner d-banner--warning" role="alert" aria-hidden="false">...</aside>
```

## Vue API

<component-vue-api component-name="banner" />

## Classes

<component-class-table component-name="banner"></component-class-table>

## Accessibility

<component-accessible-table component-name="banner"></component-accessible-table>

<script setup>
import { ref } from 'vue';
import { accessible } from '@data/banner.json';

const bannerOptions = [
  { value: 'base', label: 'Base' },
  { value: 'error', label: 'Error' },
  { value: 'info', label: 'Info' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
];
const showBanner = ref(false);
const important = ref(false);
const pinned = ref(false);
const selectedKind = ref('base');

function toggleBanner () {
  showBanner.value = !showBanner.value;
}
function toggleImportant () {
  important.value = !important.value;
}
function togglePinned () {
  pinned.value = !pinned.value;
}
function changeKind (kind) {
  selectedKind.value = kind;
}
</script>
