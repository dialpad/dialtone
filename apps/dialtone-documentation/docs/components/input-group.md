---
title: Input Group
description: Related inputs grouped with shared state or context.
status: deprecated
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-input-group--default
keywords: ["input addon", "input prefix", "input suffix", "d-input-group", "DtInputGroup", "dt-input-group", "compound input", "prepend append"]
combinator: DtInputGroup
---

```vue demo-only
<dt-input-group
  name="fruits-input-group"
  legend="Fruits"
>
  <dt-radio value="apple"><span>Apple</span></dt-radio>
  <dt-radio value="banana"><span>Banana</span></dt-radio>
  <dt-radio value="other"><span>Other</span></dt-radio>
</dt-input-group>
```

## Default

Input Groups are typically paired with a legend which identifies the group. If no legend is provided then it is expected that an `aria-label` will be given in order to provide an invisible label to screen readers. Each Input Group should contain one or more inputs which users can interact with.

```vue demo
<dt-input-group
  name="fruits-input-group"
>
  <dt-radio value="apple"><span>Apple</span></dt-radio>
  <dt-radio value="banana"><span>Banana</span></dt-radio>
  <dt-radio value="other"><span>Other</span></dt-radio>
</dt-input-group>
```

## Model

The Vue model can have one of the following types `[String, Number, Boolean, Object]`:

```js
// default = null
const value = 'some value';
```

The Vue model is dependant on the child component(s) implementing the provided `groupContext` and calling the provided `setGroupValue` method which will handle updating the provided `groupContext` and Vue model in the parent.

```js
import {
  DtInputMixin,
  DtGroupableInputMixin,
} from '@dialpad/dialtone/vue';

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

        this.$emit('update:modelValue', value);
      }
    },
  },
};
```

## Variants

### With Legend

```vue demo
<dt-input-group
  name="input-group-with-legend"
  legend="With Legend"
>
  <dt-radio value="apple"><span>Apple</span></dt-radio>
  <dt-radio value="banana"><span>Banana</span></dt-radio>
  <dt-radio value="other"><span>Other</span></dt-radio>
</dt-input-group>
<!-- @code -->
<dt-input-group
  name="input-group-with-legend"
  legend="With Legend"
>
  <!-- Input Elements -->
</dt-input-group>
```

### With Slotted Legend

```vue demo
<dt-input-group name="input-group-with-slotted-legend">
  <dt-radio value="apple"><span>Apple</span></dt-radio>
  <dt-radio value="banana"><span>Banana</span></dt-radio>
  <dt-radio value="other"><span>Other</span></dt-radio>
  <template #legend>
    With Slotted Legend
  </template>
</dt-input-group>
<!-- @code -->
<dt-input-group
  name="input-group-with-legend"
>
  <!-- Input Elements -->
  <template #legend>
    With Slotted Legend
  </template>
</dt-input-group>
```

### Disabled

```vue demo
<dt-input-group
  name="input-group-disabled"
  legend="Disabled"
  disabled
>
  <dt-radio value="apple"><span>Apple</span></dt-radio>
  <dt-radio value="banana"><span>Banana</span></dt-radio>
  <dt-radio value="other"><span>Other</span></dt-radio>
</dt-input-group>
<!-- @code -->
<dt-input-group
  name="input-group-disabled"
  legend="Disabled"
  disabled
>
  <!-- Input Elements -->
</dt-input-group>
```

### With Validation Messages

```vue demo
<dt-stack gap="500">
  <dt-input-group
    name="input-group-with-positive-message"
    legend="With Positive Message"
    :messages="[{ message: 'Positive validation message', type: 'positive' }]"
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
    legend="With Critical Message"
    :messages="[{ message: 'Critical', type: 'critical' }]"
  >
    <dt-radio value="apple"><span>Apple</span></dt-radio>
    <dt-radio value="banana"><span>Banana</span></dt-radio>
    <dt-radio value="other"><span>Other</span></dt-radio>
  </dt-input-group>
</dt-stack>
<!-- @code -->
<dt-input-group
  name="input-group-with-positive-message"
  legend="With Positive Message"
  :messages="[{ message: `Positive validation message`, type: VALIDATION_MESSAGE_TYPES.POSITIVE }]"
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
  name="input-group-with-critical-message"
  legend="With Critical Message"
  :messages="[{ message: `Critical`, type: VALIDATION_MESSAGE_TYPES.CRITICAL }]"
>
  <!-- Input Elements -->
</dt-input-group>
```

### With Validation Messages Hidden

```vue demo
<dt-input-group
  name="input-group-with-critical-messages-hidden"
  legend="With Critical Messages Hidden"
  :messages="[{ message: 'Critical', type: 'critical' }]"
  :show-messages="false"
>
  <dt-radio value="apple"><span>Apple</span></dt-radio>
  <dt-radio value="banana"><span>Banana</span></dt-radio>
  <dt-radio value="other"><span>Other</span></dt-radio>
</dt-input-group>
<!-- @code -->
<dt-input-group
  name="input-group-with-critical-messages-hidden"
  legend="With Critical Messages Hidden"
  :messages="[{ message: `Critical`, type: VALIDATION_MESSAGE_TYPES.CRITICAL }]"
  :show-messages="false"
>
  <!-- Input Elements -->
</dt-input-group>
```

## Extending

If your input(s) require additional logic in order to be grouped then you can extend the Input Group using [extends](https://vuejs.org/api/options-composition.html#extends) in your Vue SFC.

### Example

```vue
<script>
import { DtInputGroup } from '@dialpad/dialtone/vue';

export default {
  name: "MyComponent",
  extends: DtInputGroup,
  ...
};
</script>
```

## Vue API

<component-vue-api component-name="inputgroup" />
