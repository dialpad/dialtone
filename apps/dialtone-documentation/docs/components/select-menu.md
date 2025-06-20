---
title: Select menu
description: A select menu is an input control that allows users to choose one option from a list.
status: ready
thumb: true
image: assets/images/components/select-menu.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-select-menu--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=25737-2711
---

<code-well-header class="d-d-block">
  <example-select-menu label="Label" />
</code-well-header>

<!-- <component-combinator component-name="DtSelectMenu" /> -->

## Usage

<dialtone-usage>
<template #do>

- Use sparingly — only when a user needs to choose from about seven to 15 possible options, and you have limited space to display the options.
</template>

<template #dont>

- For site navigation.
- If the list of options is very short. Use [Radio](radio.md) instead.
- If the list of options is very long. Let users type the same information into an [Input](input.md) that suggests possible options instead (aka Combobox).
- Avoid using the `multiple` attribute. Users often don’t understand how to select multiple items from the select element (e.g. by holding down a modifier key).
- For selecting an action that takes immediate effect. A `select` is for selecting a choice that is only confirmed by a separate submit action (much like a [Checkbox](checkbox.md)). For immediate actions consider the [Dropdown](dropdown.md) component.
</template>

</dialtone-usage>

### Best Practices

- Selects should be considered the “UI of last resort,” as users often find them confusing and difficult to use. Consider testing thoroughly with members of your target audience.
- Avoid making options in one dropdown menu change based on the input to another. Users often don’t understand how selecting an item in one impacts another.
- When most users will (or should) pick a particular option, make it the default selection.
- Avoid auto-submission. Be wary of UI implications of automatically submitting upon selection or applying its value. Users may often change their choices multiple times, particularly if interacting with a form solely with keyboard. Auto-submission is also less accessible. For auto-submission consider the [Dropdown](dropdown.md) component.

## Variants

### Base

A select is normally paired with a label, but there are times when it can be used without a label. Don't rely on the placeholder text as a label.

<code-well-header bgclass="d-bgc-primary" class="d-d-block">
  <div class="d-stack16 d-w100p">
    <example-select-menu label="Default" />
    <example-select-menu label="Disabled" disabled />
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <label>
    <div class="d-select">
      <select class="d-select__input">
        <option value=""> Please select one </option>
        <option value="1"> Option 1 </option>
        <option value="2"> Option 2 </option>
        <option value="3"> Option 3 </option>
      </select>
    </div>
  </label>
</div>
<div>
  <label>
    <div class="d-label">Disabled</div>
    <div class="d-select d-select--disabled">
      <select disabled="disabled" class="d-select__input">
        <option class="" value=""> Please select one </option>
        <option class="" value="1"> Option 1 </option>
        <option class="" value="2"> Option 2 </option>
        <option class="" value="3"> Option 3 </option>
      </select>
    </div>
  </label>
</div>
'
vueCode='
<!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
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
'
showHtmlWarning />

### With Description Text

<code-well-header bgclass="d-bgc-primary" class="d-d-block">
  <example-select-menu label="Label" description="Optional description text" />
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <label>
    <div aria-details="select-dt0-description" class="d-label">Label</div>
    <div id="select-dt0-description" class="d-description">Optional description text</div>
    <div class="d-select">
      <select class="d-select__input">
        <option class="" value=""> Please select one </option>
        <option class="" value="1"> Option 1 </option>
        <option class="" value="2"> Option 2 </option>
        <option class="" value="3"> Option 3 </option>
      </select>
    </div>
  </label>
</div>
'
vueCode='
<!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
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
'
showHtmlWarning />

### With Validation States

Provides feedback to the user based on their interaction, or lack thereof, with a select.

<code-well-header bgclass="d-bgc-primary" class="d-d-block">
  <div class="d-stack16 d-w100p">
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
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <label>
    <div class="d-label">Label</div>
    <div class="d-select">
      <select class="d-select__input d-select__input--error">
        <option class="" value=""> Please select one </option>
        <option class="" value="1"> Option 1 </option>
        <option class="" value="2"> Option 2 </option>
        <option class="" value="3"> Option 3 </option>
      </select>
    </div>
  </label>
  <div class="base-input__messages d-validation-message__container">
    <div role="status" aria-live="polite" class="base-input__message d-validation-message base-input__message--error d-validation-message--error"><p>Error validation message</p></div>
  </div>
</div>
<div>
  <label>
    <div class="d-label">Label</div>
    <div class="d-select">
      <select class="d-select__input d-select__input--success">
        <option class="" value=""> Please select one </option>
        <option class="" value="1"> Option 1 </option>
        <option class="" value="2"> Option 2 </option>
        <option class="" value="3"> Option 3 </option>
      </select>
    </div>
  </label>
  <div class="base-input__messages d-validation-message__container">
    <div role="status" aria-live="polite" class="base-input__message d-validation-message base-input__message--success d-validation-message--success"><p>Success validation message</p></div>
  </div>
</div>
<div>
  <label>
    <div class="d-label">Label</div>
    <div class="d-select">
      <select class="d-select__input d-select__input--warning">
        <option class="" value=""> Please select one </option>
        <option class="" value="1"> Option 1 </option>
        <option class="" value="2"> Option 2 </option>
        <option class="" value="3"> Option 3 </option>
      </select>
    </div>
  </label>
  <div class="base-input__messages d-validation-message__container">
    <div role="status" aria-live="polite" class="base-input__message d-validation-message base-input__message--warning d-validation-message--warning"><p>Warning validation message</p></div>
  </div>
</div>
'
vueCode='
<!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
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
'
showHtmlWarning />

### With Validation States Hidden

<code-well-header bgclass="d-bgc-primary" class="d-d-block">
  <div class="d-stack16 d-w100p" ref="messagesHidden">
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
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.messagesHidden"
vueCode='
<!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
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
'
/>

### With Slotted Label

<code-well-header class="d-d-block">
  <example-select-menu ref="slottedLabel">
    <template #label>
      <div>Slotted label</div>
    </template>
  </example-select-menu>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.slottedLabel"
vueCode='
<!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
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
'
/>

### With Slotted Description

<code-well-header class="d-d-block">
  <example-select-menu ref="slottedDescription">
    <template #description>
      <div>Slotted description</div>
    </template>
  </example-select-menu>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.slottedDescription"
vueCode='
<!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
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
'
/>

### With Slotted Options

<code-well-header class="d-d-block">
  <dt-select-menu
    label="With Slotted Options"
    ref="slottedOptions"
  >
    <option value="">Slotted options</option>
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
  </dt-select-menu>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.slottedOptions"
vueCode='
<!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
<dt-select-menu
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
>
  <template #options>
    <option
      v-for="option in options"
      :key="`with-slotted-options-${option.value}`"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </template>
</dt-select-menu>
'
/>

## Sizes

We offer different sizes for instances in which the interface requires a smaller or larger select. In general, though, use the base (medium) size select as much as possible, especially in forms.

<code-well-header bgclass="d-bgc-primary" class="d-d-block">
  <div class="d-stack16 d-w100p">
    <example-select-menu label="Label" size="xs" />
    <example-select-menu label="Label" size="sm" />
    <example-select-menu label="Label" size="md" />
    <example-select-menu label="Label" size="lg" />
    <example-select-menu label="Label" size="xl" />
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <label>
    <div class="d-label d-label--xs">Label</div>
    <div class="d-select d-select--xs">
      <select class="d-select__input">
        <option class="" value=""> Please select one </option>
        <option class="" value="1"> Option 1 </option>
        <option class="" value="2"> Option 2 </option>
        <option class="" value="3"> Option 3 </option>
      </select>
    </div>
  </label>
</div>
<div>
  <label>
    <div class="d-label d-label--sm">Label</div>
    <div class="d-select d-select--sm">
      <select class="d-select__input">
        <option class="" value=""> Please select one </option>
        <option class="" value="1"> Option 1 </option>
        <option class="" value="2"> Option 2 </option>
        <option class="" value="3"> Option 3 </option>
      </select>
    </div>
  </label>
</div>
<div>
  <label>
    <div class="d-label d-label--md">Label</div>
    <div class="d-select d-select--md">
      <select class="d-select__input">
        <option class="" value=""> Please select one </option>
        <option class="" value="1"> Option 1 </option>
        <option class="" value="2"> Option 2 </option>
        <option class="" value="3"> Option 3 </option>
      </select>
    </div>
  </label>
</div>
<div>
  <label>
    <div class="d-label d-label--lg">Label</div>
    <div class="d-select d-select--lg">
      <select class="d-select__input">
        <option class="" value=""> Please select one </option>
        <option class="" value="1"> Option 1 </option>
        <option class="" value="2"> Option 2 </option>
        <option class="" value="3"> Option 3 </option>
      </select>
    </div>
  </label>
</div>
<div>
  <label>
    <div class="d-label d-label--xl">Label</div>
    <div class="d-select d-select--xl">
      <select class="" value=""> Please select one </option>
        <option class="" value="1"> Option 1 </option>
        <option class="" value="2"> Option 2 </option>
        <option class="" value="3"> Option 3 </option>
      </select>
    </div>
  </label>
</div>
'
vueCode='
<!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
<dt-select-menu
  :options="[
    { value: ``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  label="Label"
  size="xs"
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
  label="Label"
  size="sm"
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
  label="Label"
  size="md"
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
  label="Label"
  size="lg"
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
  label="Label"
  size="xl"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
/>
'
showHtmlWarning />

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
