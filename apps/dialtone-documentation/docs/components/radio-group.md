---
title: Radio Group
description: Radio groups are control elements that allow the user to make a single selection from a list of options.
status: ready
thumb: true
image: assets/images/components/radio-group.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-radio-group--default
keywords: ["radio buttons","radio options","form fields","d-radio-group","DtRadioGroup","dt-radio-group"]
---

<component-combinator component-name="DtRadioGroup" />

## Variants

### Default

```vue demo
<dt-radio-group
  model-value=""
  name="fruits-radio-group-01"
  legend="Fruits"
>
  <dt-radio value="apple"><span >Apple</span></dt-radio>
  <dt-radio value="banana"><span >Banana</span></dt-radio>
  <dt-radio value="other"><span >Other</span></dt-radio>
</dt-radio-group>
```

### With Options

Passing in Radio components programmatically using an options object.

```vue demo
<dt-radio-group
  v-model="selectedFruits"
  name="fruits-radio-group"
  legend="Fruits"
>
  <dt-radio
    v-for="option in options"
    :key="option.value"
    :value="option.value"
  >
    <span>{{ option.label }}</span>
  </dt-radio>
</dt-radio-group>
```

### Without Legend

When no legend is provided it is expected that an `aria-label` is passed into the component.

```vue demo
<dt-radio-group
  name="fruits-radio-group"
  aria-label="Fruits"
>
  <dt-radio value="pear">Pear</dt-radio>
  <dt-radio value="kiwi">Kiwi</dt-radio>
</dt-radio-group>
```

### With Slotted Legend

The legend can also be passed by slot.

```vue demo
<dt-radio-group
  name="fruits-radio-group"
>
  <dt-radio value="pear">Pear</dt-radio>
  <dt-radio value="kiwi">Kiwi</dt-radio>
  <template #legend>
    Fruits
  </template>
</dt-radio-group>
```

### With Event Hander

The event handler is only needed if you need to do additional processing. The v-model is automatically updated.

```vue demo
<dt-radio-group
  v-model="selectedFruits"
  name="fruits-radio-group"
  legend="Fruits"
  @update:model-value="onInput"
>
  <dt-radio value="pear">Pear</dt-radio>
  <dt-radio value="kiwi">Kiwi</dt-radio>
</dt-radio-group>
```

### With Validation States

```vue demo
<!-- @wrapper -->
<dt-stack gap="200">
  <div>
    <dt-radio-group
      name="radio-group-with-positive-message"
      legend="With Positive Message"
      :messages='[{"message":"Positive validation message","type":"positive"}]'
    >
      <dt-radio value="apple"><span >Apple</span></dt-radio>
      <dt-radio value="banana"><span >Banana</span></dt-radio>
      <dt-radio value="other"><span >Other</span></dt-radio>
    </dt-radio-group>
  </div>
  <div>
    <dt-radio-group
      name="radio-group-with-warning-message"
      legend="With Warning Message"
      :messages='[{"message":"Warning validation message","type":"warning"}]'
    >
      <dt-radio value="apple"><span >Apple</span></dt-radio>
      <dt-radio value="banana"><span >Banana</span></dt-radio>
      <dt-radio value="other"><span >Other</span></dt-radio>
    </dt-radio-group>
  </div>
  <div>
    <dt-radio-group
      name="radio-group-with-critical-message"
      legend="With Critical Message"
      :messages='[{"message":"Critical validation message","type":"critical"}]'
    >
      <dt-radio value="apple"><span >Apple</span></dt-radio>
      <dt-radio value="banana"><span >Banana</span></dt-radio>
      <dt-radio value="other"><span >Other</span></dt-radio>
    </dt-radio-group>
  </div>
</dt-stack>
```

## Vue API

<component-vue-api component-name="radiogroup" />

## Accessibility

Radio Groups are typically paired with a legend which identifies the group. If no legend is provided then it is expected
that an `aria-label` will be given in order to provide an invisible label to screen readers.

<script setup>
import { ref } from 'vue';
const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Other', value: 'other' }
];
const selectedFruits = ref('apple');

const onInput = () => {};

</script>
