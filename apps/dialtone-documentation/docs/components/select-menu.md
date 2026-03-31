---
title: Select menu
description: A select menu is an input control that allows users to choose one option from a list.
status: ready
thumb: true
image: assets/images/components/select-menu.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-select-menu--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=25737-2711
keywords: ["dropdown", "picker", "d-select-menu", "DtSelectMenu", "dt-select-menu", "native select", "listbox"]
---

<component-combinator component-name="DtSelectMenu" />

## Usage

<dialtone-usage>
<template #do>

- Use sparingly — only when a user needs to choose from about seven to 15 possible options, and you have limited space to display the options.
</template>

<template #dont>

- For site navigation.
- If the list of options is very short. Use [Radio](radio.md) instead.
- If the list of options is very long. Let users type the same information into an [Input](input.md) that suggests possible options instead (aka Combobox).
- Avoid using the `multiple` attribute. Users often don't understand how to select multiple items from the select element (e.g. by holding down a modifier key).
- For selecting an action that takes immediate effect. A `select` is for selecting a choice that is only confirmed by a separate submit action (much like a [Checkbox](checkbox.md)). For immediate actions consider the [Dropdown](dropdown.md) component.
</template>

</dialtone-usage>

### Best Practices

- Selects should be considered the "UI of last resort," as users often find them confusing and difficult to use. Consider testing thoroughly with members of your target audience.
- Avoid making options in one dropdown menu change based on the input to another. Users often don't understand how selecting an item in one impacts another.
- When most users will (or should) pick a particular option, make it the default selection.
- Avoid auto-submission. Be wary of UI implications of automatically submitting upon selection or applying its value. Users may often change their choices multiple times, particularly if interacting with a form solely with keyboard. Auto-submission is also less accessible. For auto-submission consider the [Dropdown](dropdown.md) component.

## Variants

### Base

A select is normally paired with a label, but there are times when it can be used without a label. Don't rely on the placeholder text as a label.

<code-example vueCode='
<dt-select-menu
  :options="[
        { value: ``, label: `Please select one` },
        { value: `1`, label: `Option 1` },
        { value: `2`, label: `Option 2` },
        { value: `3`, label: `Option 3` },
      ]"
  label="Default"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
/>
<dt-select-menu
  :options="[
        { value: ``, label: `Please select one` },
        { value: `1`, label: `Option 1` },
        { value: `2`, label: `Option 2` },
        { value: `3`, label: `Option 3` },
      ]"
  label="Disabled"
  disabled
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
/>
'>
  <div class="d-d-grid d-g-200 d-g-cols2">
    <example-select-menu label="Default" />
    <example-select-menu label="Disabled" disabled />
  </div>
</code-example>

### With Description Text

<code-example vueCode='
<dt-select-menu
  :options="[
        { value: ``, label: `Please select one` },
        { value: `1`, label: `Option 1` },
        { value: `2`, label: `Option 2` },
        { value: `3`, label: `Option 3` },
      ]"
  label="Label"
  description="Optional description text"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
/>
'>
  <example-select-menu label="Label" description="Optional description text" />
</code-example>

### With Validation States

Provides feedback to the user based on their interaction, or lack thereof, with a select.

<code-example vueCode='
<dt-select-menu
  :options="[
    { value: ``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  :messages="[{ message: `Error validation message`, type: `error` }]"
  label="Label"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
/>
<dt-select-menu
  :options="[
    { value: ``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  :messages="[{ message: `Success validation message`, type: `success` }]"
  label="Label"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
/>
<dt-select-menu
  :options="[
    { value: ``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  :messages="[{ message: `Warning validation message`, type: `warning` }]"
  label="Label"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
/>
'>
  <div class="d-d-grid d-g-200 d-g-cols3">
    <example-select-menu
      label="Label"
      :messages='[{"message":"Error validation message","type":"error"}]'
    />
    <example-select-menu
      label="Label"
      :messages='[{"message":"Success validation message","type":"success"}]'
    />
    <example-select-menu
      label="Label"
      :messages='[{"message":"Warning validation message","type":"warning"}]'
    />
  </div>
</code-example>

### With Validation States Hidden

<code-example vueCode='
<dt-select-menu
  :options="[
    { value: ``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  :messages="[{ message: `Error validation message`, type: `error` }]"
  label="Label"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
  :show-messages="false"
/>
<dt-select-menu
  :options="[
    { value:``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  :messages="[{ message: `Success validation message`, type: `success` }]"
  label="Label"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
  :show-messages="false"
/>
<dt-select-menu
  :options="[
    { value: ``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  :messages="[{ message: `Warning validation message`, type: `warning` }]"
  label="Label"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
  :show-messages="false"
/>
'>
  <div class="d-d-grid d-g-200 d-g-cols3">
    <example-select-menu
      label="Label"
      :messages='[{"message":"Error validation message","type":"error"}]'
      :show-messages="false"
    />
    <example-select-menu
      label="Label"
      :messages='[{"message":"Success validation message","type":"success"}]'
      :show-messages="false"
    />
    <example-select-menu
      label="Label"
      :messages='[{"message":"Warning validation message","type":"warning"}]'
      :show-messages="false"
    />
  </div>
</code-example>

### With Slotted Label

<code-example vueCode='
<dt-select-menu
  :options="[
    { value: ``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
>
  <template #label>
    <div>Slotted label</div>
  </template>
</dt-select-menu>
'>
  <example-select-menu>
    <template #label>
      <div>Slotted label</div>
    </template>
  </example-select-menu>
</code-example>

### With Slotted Description

<code-example vueCode='
<dt-select-menu
  :options="[
    { value: ``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
>
  <template #description>
    <div>Slotted description</div>
  </template>
</dt-select-menu>
'>
  <example-select-menu>
    <template #description>
      <div>Slotted description</div>
    </template>
  </example-select-menu>
</code-example>

### With Slotted Options

<code-example vueCode='
<dt-select-menu
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
>
  <template #default>
    <option
      v-for="option in options"
      :key="`with-slotted-options-${option.value}`"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </template>
</dt-select-menu>
'>
  <dt-select-menu
    label="With Slotted Options"
  >
    <option value="">Slotted options</option>
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
  </dt-select-menu>
</code-example>

## Sizes

We offer different sizes for instances in which the interface requires a smaller or larger select. In general, though, use the base `300` (medium) size select as much as possible, especially in forms.

<code-example vueCode='
<dt-select-menu
  :options="[
    { value: ``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  label="Label"
  :size="100|200|300|400|500"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
/>
'>
  <dt-stack gap="200">
    <example-select-menu label="Label" :size="100" />
    <example-select-menu label="Label" :size="200" />
    <example-select-menu label="Label" :size="300" />
    <example-select-menu label="Label" :size="400" />
    <example-select-menu label="Label" :size="500" />
  </dt-stack>
</code-example>

## Label size

The label text size is automatically derived from the component's `size` prop. Use the `label-size` prop to override this when you need a different label size independent of the select size. For example, the default label size for a `:size="300"` select menu is `300`, but you can override it from `100` to `400`.

<code-example vueCode='
<dt-select-menu
  :options="options"
  label="Label"
  :size="100"
  :label-size="100"
/>
'>
  <dt-stack gap="200">
    <example-select-menu label="Extra small label" :label-size="100" />
    <example-select-menu label="Small label" :label-size="200" />
    <example-select-menu label="Medium label (default)" :label-size="300" />
    <example-select-menu label="Large label" :label-size="400" />
  </dt-stack>
</code-example>

## Label strength

Override the label font weight independently of the label size. Valid values are `bold`, `semibold`, `medium`, and `normal`.

<code-example vueCode='
<dt-select-menu
  :options="options"
  label="Label"
  label-strength="bold|semibold|medium|normal"
/>
'>
  <dt-stack gap="200">
    <example-select-menu label="Bold label" label-strength="bold" />
    <example-select-menu label="Semibold label" label-strength="semibold" />
    <example-select-menu label="Medium label" label-strength="medium" />
    <example-select-menu label="Normal label" label-strength="normal" />
  </dt-stack>
</code-example>

## Accessibility

- Make sure the `label` `for` attribute match the select `id`.
- Avoiding removing `labels`. Labelled selects are user-friendly.
- Avoid relying on placeholder text as a substitute for a label.
- Avoid customizing the placeholder text.
- If the select is a required field, use the `aria-required` property and use the validation message for input errors.
- Select with validation errors should have `aria-describedby` with the `id` of the validation message.

## Vue API

<component-vue-api component-name="selectmenu" />

## Classes

<component-class-table component-name="select" />

<script setup>
  import ExampleSelectMenu from '@exampleComponents/ExampleSelectMenu.vue';
</script>
