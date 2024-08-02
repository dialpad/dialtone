---
title: Input Group
description: Input Groups are convenience components for a grouping of related inputs. While each input within the group could be independent, the v-model on the group provides a convenient interface for determining the current state of the group.
status: ready
thumb: true
image: assets/images/components/input.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-input-group--default
---

<code-well-header>
  <dt-input-group
    name="fruits-input-group"
    legend="Fruits"
  >
    <dt-radio value="apple"><span>Apple</span></dt-radio>
    <dt-radio value="banana"><span>Banana</span></dt-radio>
    <dt-radio value="other"><span>Other</span></dt-radio>
  </dt-input-group>
</code-well-header>

## Default

Input Groups are typically paired with a legend which identifies the group. If no legend is provided then it is expected that an `aria-label` will be given in order to provide an invisible label to screen readers. Each Input Group should contain one or more inputs which users can interact with.

<code-well-header>
  <dt-input-group
    ref="baseExample"
    name="fruits-input-group"
  >
    <dt-radio value="apple"><span>Apple</span></dt-radio>
    <dt-radio value="banana"><span>Banana</span></dt-radio>
    <dt-radio value="other"><span>Other</span></dt-radio>
  </dt-input-group>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.baseExample'
vueCode='
<dt-input-group
  name="fruits-input-group"
>
  <dt-radio value="apple"><span>Apple</span></dt-radio>
  <dt-radio value="banana"><span>Banana</span></dt-radio>
  <dt-radio value="other"><span>Other</span></dt-radio>
</dt-input-group>
'
/>

## Model

The Vue model can have one of the following types `[String, Number, Boolean, Object]`:

```js
// default = null
const value = 'some value';
```

The Vue model is dependant on the child component(s) implementing the provided `groupContext` and calling the provided `setGroupValue` method which will handle updating the provided `groupContext` and Vue model in the parent.

```vue
import {
  DtInputMixin,
  DtGroupableInputMixin,
} from '@dialpad/dialtone-vue';

export default {
  name: 'MyInputElement',

  mixins: [DtInputMixin, DtGroupableInputMixin],

  computed: {
    groupValue () {
      return this.groupContext?.value;
    },

    inputListeners () {
      return {
        change: event => this.emitValue(event.target.value),
      };
    },
  },

  watch: {
    groupValue: {
      immediate: true,
      handler (newGroupValue) {
        if (this.hasGroup) {
          // update internal value when the input group value changes
          this.internalChecked = newGroupValue === this.value;
        }
      },
    },
  },

  methods: {
    emitValue (value) {
      if (value !== this.groupValue) {
        // update provided value if injected
        this.setGroupValue(value);

        this.$emit('input', value);
      }
    },
  },
};
```

## Variants

### With legend

<code-well-header>
  <dt-input-group
    name="input-group-with-legend"
    legend="With Legend"
  >
    <dt-radio value="apple"><span>Apple</span></dt-radio>
    <dt-radio value="banana"><span>Banana</span></dt-radio>
    <dt-radio value="other"><span>Other</span></dt-radio>
  </dt-input-group>
</code-well-header>

<code-example-tabs
vueCode='
<dt-input-group
  name="input-group-with-legend"
  legend="With Legend"
>
  <!-- Input Elements -->
</dt-input-group>
'
/>

### With slotted legend

<code-well-header>
  <dt-input-group name="input-group-with-slotted-legend">
    <dt-radio value="apple"><span>Apple</span></dt-radio>
    <dt-radio value="banana"><span>Banana</span></dt-radio>
    <dt-radio value="other"><span>Other</span></dt-radio>
    <template #legend>
      With Slotted Legend
    </template>
  </dt-input-group>
</code-well-header>

<code-example-tabs
vueCode='
<dt-input-group
  name="input-group-with-legend"
>
  <!-- Input Elements -->
  <template #legend>
    With Slotted Legend
  </template>
</dt-input-group>
'
/>

### Disabled

<code-well-header>
  <dt-input-group
    name="input-group-disabled"
    legend="Disabled"
    disabled
  >
    <dt-radio value="apple"><span>Apple</span></dt-radio>
    <dt-radio value="banana"><span>Banana</span></dt-radio>
    <dt-radio value="other"><span>Other</span></dt-radio>
  </dt-input-group>
</code-well-header>

<code-example-tabs
vueCode='
<dt-input-group
  name="input-group-disabled"
  legend="Disabled"
  disabled
>
  <!-- Input Elements -->
</dt-input-group>
'
/>

### With validation messages

<code-well-header>
  <div class="d-stack16">
    <dt-input-group
      name="input-group-with-success-message"
      legend="With Success Message"
      :messages="[{ message: 'Success validation message', type: 'success' }]"
    >
      <dt-radio value="apple"><span>Apple</span></dt-radio>
      <dt-radio value="banana"><span>Banana</span></dt-radio>
      <dt-radio value="other"><span>Other</span></dt-radio>
    </dt-input-group>
    <dt-input-group
      name="input-group-with-warning-message"
      legend="With Warning Message"
      :messages="[{ message: 'Warning', type: 'warning' }]"
    >
      <dt-radio value="apple"><span>Apple</span></dt-radio>
      <dt-radio value="banana"><span>Banana</span></dt-radio>
      <dt-radio value="other"><span>Other</span></dt-radio>
    </dt-input-group>
    <dt-input-group
      name="input-group-with-error-message"
      legend="With Error Message"
      :messages="[{ message: 'Error', type: 'error' }]"
    >
      <dt-radio value="apple"><span>Apple</span></dt-radio>
      <dt-radio value="banana"><span>Banana</span></dt-radio>
      <dt-radio value="other"><span>Other</span></dt-radio>
    </dt-input-group>
  </div>
</code-well-header>

<code-example-tabs
vueCode='
<dt-input-group
  name="input-group-with-success-message"
  legend="With Success Message"
  :messages="[{ message: `Success validation message`, type: VALIDATION_MESSAGE_TYPES.SUCCESS }]"
>
  <!-- Input Elements -->
</dt-input-group>
<dt-input-group
  name="input-group-with-warning-message"
  legend="With Warning Message"
  :messages="[{ message: `Warning`, type: VALIDATION_MESSAGE_TYPES.WARNING }]"
>
  <!-- Input Elements -->
</dt-input-group>
<dt-input-group
  name="input-group-with-error-message"
  legend="With Error Message"
  :messages="[{ message: `Error`, type: VALIDATION_MESSAGE_TYPES.ERROR }]"
>
  <!-- Input Elements -->
</dt-input-group>
'
/>

### With validation messages hidden

<code-well-header>
  <dt-input-group
    name="input-group-with-error-messages-hidden"
    legend="With Error Messages Hidden"
    :messages="[{ message: 'Error', type: 'error' }]"
    :show-messages="false"
  >
    <dt-radio value="apple"><span>Apple</span></dt-radio>
    <dt-radio value="banana"><span>Banana</span></dt-radio>
    <dt-radio value="other"><span>Other</span></dt-radio>
  </dt-input-group>
</code-well-header>

<code-example-tabs
vueCode='
<dt-input-group
  name="input-group-with-error-messages-hidden"
  legend="With Error Messages Hidden"
  :messages="[{ message: `Error`, type: VALIDATION_MESSAGE_TYPES.ERROR }]"
  :show-messages="false"
>
  <!-- Input Elements -->
</dt-input-group>
'
/>

## Extending

If your input(s) require additional logic in order to be grouped then you can extend the Input Group using [extends](https://vuejs.org/api/options-composition.html#extends) in your Vue SFC.

### Example

```vue
<script>
import { DtInputGroup } from '@dialpad/dialtone-vue';

export default {
  name: "MyComponent",
  extends: DtInputGroup,
  ...
};
</script>
```

## Vue API

<component-vue-api component-name="inputgroup" />
