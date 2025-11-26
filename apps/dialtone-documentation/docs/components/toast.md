---
title: Toast
status: ready
thumb: true
image: assets/images/components/toast.png
description: A toast notice, sometimes called a snackbar, is a time-based message that appears based on users' actions. It contains at-a-glance information about outcomes and can be paired with actions.
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-toast--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=233-3758
---

<code-well-header>
  <dt-stack direction="row" justify="center" outline>
    <example-toast show title="Title" class="d-ps-relative d-zi-base d-t0" :fixed="false" />
  </dt-stack>
</code-well-header>

<!-- <component-combinator component-name="DtToast" /> -->

## Variants and Examples

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

<code-example-tabs
htmlCode='
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
'
vueCode='
<dt-toast
  title="Title"
  :show="showToast"
  :important="important"
  :kind="selectedKind"
  @close="closeEvent"
>
  Message body with
  <dt-link>
    a link
  </dt-link>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="muted"
    >
      Action
    </dt-button>
  </template>
</dt-toast>
'
showHtmlWarning />

### With Duration

It's recommended to use a time of at least 6000 ms (minimum duration validated in the component) to give users enough time to read the toast. Take into account that the time necessary to read and comprehend the message could vary in users. For instance, users using assistive technology, or users with language barriers could potentially need more time to read and understand the message.
If the duration is not provided the toast won't disappear automatically.

<code-well-header>
  <dt-button @click="toggleDurationToast(true)">Show Example</dt-button>
  <example-toast
    class="d-zi-notification"
    :show="showDurationToast"
    title="Title"
    @close="toggleDurationToast(false)"
    @update:show="updateShow"
    :duration="6000"
  />
</code-well-header>

<code-example-tabs
vueCode='
<dt-toast
  title="Title"
  :show="showDurationToast"
  @close="closeEvent"
  :duration="7500"
>
  Message body with
  <dt-link>
    a link
  </dt-link>
  <template #action>
    <dt-button
      size="sm"
      importance="outlined"
      kind="muted"
    >
      Action
    </dt-button>
  </template>
</dt-toast>
'
/>

### With Self-Positioning

If you need to self-position the toast at the top center, use the `d-toast-wrapper` Dialtone class:

```html
<aside class="d-toast-wrapper">
  <dt-toast
    :title="title"
    :message="message"
    :show="isShown"
  ></dt-toast>
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

A screen reader visible only close button is added by default.

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
const showDurationToast = ref(false);

function toggleToast () {
  showToast.value = !showToast.value;
}
function toggleDurationToast (value) {
  showDurationToast.value = value;
}
const updateShow = (value) => {
  if (!value) showDurationToast.value = false;
};

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
