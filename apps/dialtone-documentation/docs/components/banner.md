---
title: Banner
description: A banner is a type of Notice, delivering system and engagement messaging. It is highly intrusive and should be used sparingly and appropriately.
status: ready
thumb: true
image: assets/images/components/banner.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-banner--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=4516-0
keywords: ["alert","notification","message","d-banner","DtBanner","dt-banner"]
---

<code-example only-show="demo" class="d-p0">
  <dt-stack gap="500" class="d-w100p" align="center">
    <dt-banner title="Example banner" kind="info" class="d-ps-relative d-zi-base">
      Message body with a <dt-link kind="muted">Link</dt-link>
      <template #action>
        <dt-button size="sm" kind="muted" importance="outlined">Action</dt-button>
      </template>
    </dt-banner>
    <dt-stack direction="row">
      <dt-button @click="toggleBanner('example-pinned')">Pin to top</dt-button>
    </dt-stack>
  </dt-stack>
</code-example>

<!-- <component-combinator component-name="DtBanner" /> -->

## Usage

System banners are used for **system** messaging. They are full-width notices placed in one of two locations:

1. **Above everything else:** If the banner is related to the entire app (e.g. the user lost internet service), place the banner first. <em>These should not be dismissable until the issue is resolved.</em> To pin the banner to the top of the app, add the `.d-notice--pinned` class.
2. **Below the top bar:** This is the default location for system banners. Use these when it affects only a particular area of the product (e.g. when the user is in Do Not Disturb mode).

Banners are a type of notice and so you can use the following [Notice](notice.md) styles in conjunction with `.d-banner`.

## Variants and Examples

### Kind

<code-example only-show="demo">
  <dt-stack direction="row" gap="500">
    <dt-select-menu :label-visible="false" label="Style" :options="bannerOptions" v-model="selectedKind" />
    <dt-checkbox value="important" @input="toggleImportant">Important</dt-checkbox>
    <dt-button @click="toggleBanner('example-kind')">Toggle Example</dt-button>
  </dt-stack>
</code-example>

<dt-banner
  :pinned="pinned"
  :important="important"
  :kind="selectedKind"
  title="Optional banner title"
  v-show="shownBanner === 'example-kind'"
  @close="closeBanner"
>
  Message body
</dt-banner>

<code-example only-show="code">
  <dt-banner kind="base" title="Optional banner title"> Message body </dt-banner>
  <dt-banner kind="error" title="Optional banner title"> Message body </dt-banner>
  <dt-banner kind="info" title="Optional banner title"> Message body </dt-banner>
  <dt-banner kind="success" title="Optional banner title"> Message body </dt-banner>
  <dt-banner kind="warning" title="Optional banner title"> Message body </dt-banner>
  <dt-banner background-image="{$background-image}" background-size="contain"> Message body </dt-banner>
  <dt-banner pinned="true" kind="warning" title="Optional banner title"> Message body </dt-banner>
  <dt-banner important="true" kind="warning" title="Optional banner title"> Message body </dt-banner>
</code-example>

### Pinned

Pins the banner to the top of the window.

<code-example only-show="demo">
  <dt-stack direction="row">
    <dt-button @click="toggleBanner('example-pinned')">Toggle Example</dt-button>
  </dt-stack>
</code-example>

<dt-banner
  :pinned="true"
  title="Optional banner title"
  v-show="shownBanner === 'example-pinned'"
  @close="closeBanner"
>
  Detailed description goes here.
  <template #action>
    <dt-button size="sm" kind="muted" importance="outlined">Action</dt-button>
  </template>
</dt-banner>

<code-example only-show="code">
  <dt-banner
    :pinned="true"
    title="Optional banner title"
  >
    Detailed description goes here.
    <template #action>
      <dt-button size="sm" kind="muted" importance="outlined">Action</dt-button>
    </template>
  </dt-banner>
</code-example>

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

const shownBanner = ref(null);
const important = ref(false);
const pinned = ref(false);
const selectedKind = ref('base');

function toggleBanner (id) {
  if (shownBanner.value === id) {
    shownBanner.value = null;
  } else {
    shownBanner.value = id;
  }
}

function toggleImportant () {
  important.value = !important.value;
}

function closeBanner () {
  shownBanner.value = null;
}
</script>
