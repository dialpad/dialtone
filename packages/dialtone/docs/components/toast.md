---
title: Toast
status: ready
thumb: true
image: assets/images/components/toast.png
description: A toast notice, sometimes called a snackbar, is a time-based message that appears based on users' actions. It contains at-a-glance information about outcomes and can be paired with actions.
storybook: https://vue.dialpad.design/?path=/story/components-toast--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8919%3A21834&viewport=-496%2C632%2C0.48&t=xHutRjwo1o5zMTgT-11
---

<code-well-header>
  <div class="d-d-flex d-jc-center">
    <example-toast show title="Title" class="d-ps-relative d-zi-base d-t0" />
  </div>
</code-well-header>

<!-- <component-combinator component-name="DtToast" /> -->

## Variants and examples

<code-well-header>
    <div class="d-d-flex d-w100p d-flow8 d-ai-flex-end">
        <div class="d-fl-grow1">
            <dt-select-menu label="Style" :options="toastOptions" @change="changeKind" />
        </div>
        <dt-checkbox value="important" @input="toggleImportant">Important</dt-checkbox>
        <dt-button @click="toggleToast">Toggle Example</dt-button>
    </div>
</code-well-header>

<example-toast
  class="d-zi-notification"
  :show="showToast"
  title="Title"
  :important="important"
  :kind="selectedKind"
  @close="toggleToast"
/>

```html
<aside class="d-toast-wrapper">
  <div class="d-toast d-toast--base" role="status" aria-hidden="true">
    <div class="d-toast__dialog">
      <div class="d-notice__icon">...</div>
      <div class="d-notice__content">
        <h2 class="d-notice__title">...</h2>
        <p class="d-notice__message">...</p>
      </div>
      <div class="d-notice__actions">...</div>
    </div>
  </div>
</aside>

<aside class="d-toast-wrapper">
  <div class="d-toast d-toast--error" role="status" aria-hidden="true">...</div>
</aside>
<aside class="d-toast-wrapper">
  <div class="d-toast d-toast--info" role="status" aria-hidden="true">...</div>
</aside>
<aside class="d-toast-wrapper">
  <div class="d-toast d-toast--success" role="status" aria-hidden="true">...</div>
</aside>
<aside class="d-toast-wrapper">
  <div class="d-toast d-toast--warning" role="status" aria-hidden="true">...</div>
</aside>
```

## Vue API

<component-vue-api component-name="toast" />

## Classes

<component-class-table component-name="toast" />

## Accessibility

Avoid using toast for critical information since toast disappears automatically and make sure
to provide enough time to read the message and act consequently. For best accessible user experience, the amount of
time a toast displays for should be user configurable.

Using `role="alert"`, it sets `aria-live="assertive"` which
means it will immediately interrupt anything currently being read by the screen reader, so use it for things
that require immediate attention such as:

- An invalid value was entered into a form field
- The user's login session is about to expire
- The connection to the server was lost, local changes will not be saved

Meanwhile `role="status"` implies `aria-live="polite"` which
means the toast will be read out after what's currently being has finished.

<component-accessible-table component-name="toast" />

<script setup>
import ExampleToast from '@exampleComponents/ExampleToast.vue';
import { ref } from 'vue';

const toastOptions = [
  { value: 'base', label: 'Base' },
  { value: 'error', label: 'Error' },
  { value: 'info', label: 'Info' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
];
const showToast = ref(false);
const important = ref(false);
const pinned = ref(false);
const selectedKind = ref('base');

function toggleToast () {
  showToast.value = !showToast.value;
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
