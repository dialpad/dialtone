---
title: Banner
description: A banner is a type of Notice, delivering system and engagement messaging. It is highly intrusive and should be used sparingly and appropriately.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-banner--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=4516-0
keywords: ["alert","notification","message","d-banner","DtBanner","dt-banner"]
---

```vue demo-only
<dt-stack gap="200" class="d-w100p" align="center">
  <dt-banner header-text="Example banner" kind="info" class="d-ps-relative d-zi-base">
    Message body with a <dt-link kind="muted">Link</dt-link>
    <template #action>
      <dt-button :size="200" kind="muted" importance="outlined">Action</dt-button>
    </template>
  </dt-banner>
  <dt-stack direction="row">
    <dt-button @click="toggleBanner('example-pinned')">Pin to top</dt-button>
  </dt-stack>
</dt-stack>
```

<!-- <component-combinator component-name="DtBanner" /> -->

## Usage

System banners are used for **system** messaging. They are full-width notices placed in one of two locations:

1. **Above everything else:** If the banner is related to the entire app (e.g. the user lost internet service), place the banner first. <em>These should not be dismissable until the issue is resolved.</em> To pin the banner to the top of the app, add the `.d-notice--pinned` class.
2. **Below the top bar:** This is the default location for system banners. Use these when it affects only a particular area of the product (e.g. when the user is in Do Not Disturb mode).

Banners are a type of notice and so you can use the following [Notice](notice.md) styles in conjunction with `.d-banner`.

## Variants and Examples

### Kind

```vue demo-only
<dt-stack direction="row" gap="200">
  <dt-select-menu :show-label="false" label="Style" :options="bannerOptions" v-model="selectedKind" />
  <dt-checkbox value="important" @update:model-value="toggleImportant">Important</dt-checkbox>
  <dt-button @click="toggleBanner('example-kind')">Toggle Example</dt-button>
</dt-stack>
```

<dt-banner
  v-if="shownBanner === 'example-kind'"
  :pinned="pinned"
  :important="important"
  :kind="selectedKind"
  header-text="Optional banner title"
  @close="closeBanner"
>
  Message body
</dt-banner>

```vue code-only
<dt-banner kind="base" header-text="Optional banner title"> Message body </dt-banner>
<dt-banner kind="critical" header-text="Optional banner title"> Message body </dt-banner>
<dt-banner kind="info" header-text="Optional banner title"> Message body </dt-banner>
<dt-banner kind="positive" header-text="Optional banner title"> Message body </dt-banner>
<dt-banner kind="warning" header-text="Optional banner title"> Message body </dt-banner>
<dt-banner background-image="{$background-image}" background-size="contain"> Message body </dt-banner>
<dt-banner pinned="true" kind="warning" header-text="Optional banner title"> Message body </dt-banner>
<dt-banner important="true" kind="warning" header-text="Optional banner title"> Message body </dt-banner>
```

### Pinned

Pins the banner to the top of the window.

```vue demo-only
<dt-stack direction="row">
  <dt-button @click="toggleBanner('example-pinned')">Toggle Example</dt-button>
</dt-stack>
```

<dt-banner
  :pinned="true"
  header-text="Optional banner title"
  v-show="shownBanner === 'example-pinned'"
  @close="closeBanner"
>
  Detailed description goes here.
  <template #action>
    <dt-button :size="200" kind="muted" importance="outlined">Action</dt-button>
  </template>
</dt-banner>

```vue code-only
<dt-banner
  :pinned="true"
  header-text="Optional banner title"
>
  Detailed description goes here.
  <template #action>
    <dt-button :size="200" kind="muted" importance="outlined">Action</dt-button>
  </template>
</dt-banner>
```

## Vue API

<component-vue-api component-name="banner" />

## Classes

<component-class-table component-name="banner"></component-class-table>

## Accessibility

### Focus management

When `important` is set, the banner is presented as a modal `alertdialog`: keyboard focus moves to the first focusable element when it appears, stays trapped within the banner while it is shown, and returns to the previously focused element when the banner is dismissed. Reserve `important` for messages that must block the rest of the page until they are addressed.

Non-important banners use the `status` role and do **not** trap focus — keyboard users can Tab straight through them.

<component-accessible-table component-name="banner"></component-accessible-table>

<script setup>
import { ref } from 'vue';
import { accessible } from '@data/banner.json';

const bannerOptions = [
  { value: 'base', label: 'Base' },
  { value: 'critical', label: 'Critical' },
  { value: 'info', label: 'Info' },
  { value: 'positive', label: 'Positive' },
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

function toggleImportant (checked) {
  important.value = checked;
}

function closeBanner () {
  shownBanner.value = null;
}
</script>
