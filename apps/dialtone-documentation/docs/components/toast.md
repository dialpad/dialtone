---
title: Toast
status: ready
thumb: true
description: A toast notice, sometimes called a snackbar, is a time-based message that appears based on users' actions. It contains at-a-glance information about outcomes and can be paired with actions.
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-toast--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=233-3758
keywords: ["notification", "snackbar", "alert", "message", "d-toast", "DtToast", "dt-toast", "flash message"]
---

<component-combinator component-name="DtToast" />

## Variants and Examples

```vue demo
<dt-stack direction="row" gap="200" class="d-w100p">
  <div class="d-fl-grow1">
    <dt-select-menu :show-label="false" label="Style" :options="toastOptions" v-model="selectedKind" />
  </div>
  <dt-checkbox value="important" @update:model-value="toggleImportant">Important</dt-checkbox>
  <dt-button @click="toggleToast">Toggle Example</dt-button>
</dt-stack>
<!-- @code -->
<dt-toast
  header-text="Title"
  :open="showToast"
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
      :size="200"
      importance="outlined"
      kind="muted"
    >
      Action
    </dt-button>
  </template>
</dt-toast>
```

<example-toast
  class="d-zi-notification"
  :open="showToast"
  title="Title"
  :important="important"
  :kind="selectedKind"
  @close="toggleToast"
/>

### With Duration

It's recommended to use a time of at least 6000 ms (minimum duration validated in the component) to give users enough time to read the toast. Take into account that the time necessary to read and comprehend the message could vary in users. For instance, users using assistive technology, or users with language barriers could potentially need more time to read and understand the message.
If the duration is not provided the toast won't disappear automatically.

```vue demo
<dt-button @click="toggleDurationToast(true)">Show Example</dt-button>
<example-toast
  class="d-zi-notification"
  :open="showDurationToast"
  title="Title"
  @close="toggleDurationToast(false)"
  @update:open="updateOpen"
  :duration="6000"
/>
<!-- @code -->
<dt-toast
  header-text="Title"
  :open="showDurationToast"
  @close="closeEvent"
  :duration="7500"
>
  Message body with
  <dt-link>
    a link
  </dt-link>
  <template #action>
    <dt-button
      :size="200"
      importance="outlined"
      kind="muted"
    >
      Action
    </dt-button>
  </template>
</dt-toast>
```

### With Self-Positioning

If you need to self-position the toast at the top center, use the `d-toast-wrapper` Dialtone class:

```vue code-only
<aside class="d-toast-wrapper">
  <dt-toast
    :header-text="title"
    :message="message"
    :open="isShown"
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
  { value: 'critical', label: 'Critical' },
  { value: 'info', label: 'Info' },
  { value: 'positive', label: 'Positive' },
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
const updateOpen = (value) => {
  if (!value) showDurationToast.value = false;
};

function toggleImportant (checked) {
  important.value = checked;
}
function togglePinned () {
  pinned.value = !pinned.value;
}
</script>
