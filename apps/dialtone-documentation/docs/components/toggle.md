---
title: Toggle
status: ready
thumb: true
image: assets/images/components/toggle.png
description: A toggle, or "switch", is a button control element that allows the user to make a binary selection.
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-toggle--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8919%3A21460&viewport=-359%2C250%2C0.49&t=xHutRjwo1o5zMTgT-11
---
<code-well-header>
  <div class="d-toggle-group d-d-flex d-ai-center">
    <dt-toggle label-class="d-mr6">Label</dt-toggle>
  </div>
</code-well-header>

<!-- <component-combinator component-name="DtToggle" /> -->

## Usage

The Toggle component acts as a way to allow the User to switch between two mutually exclusive options. While it technically mirrors a [Checkbox](checkbox.md) state, its effect on the system is immediate&mdash;much like a light switch immediately turns on or off the lights. In contrast, the checked state of a [Checkbox](checkbox.md) won't be applied until a separate action to confirm the selection is taken.

<dialtone-usage>
<template #do>

- When its action has an instantaneous effect.
</template>

<template #dont>

- When its action does not have an immediate effect on the application.
- Selecting between 2 options. Instead, utilize a [Checkbox](checkbox.md).
- As an alternative to a [Checkbox](checkbox.md) or [Radio](radio.md) within a Form.
</template>

</dialtone-usage>

### Best Practices

- A Toggle component should be used as a control within an application and provide a way to toggle between two states like a household light switch.
- An `indeterminate` Toggle convey a "mixed" state that neither qualifies as toggled or not toggled. An example use case is when a Toggle acts as a "parent" of a collection of child Toggle components:
  - Toggled: all children are toggled.
  - Not toggled: all children are not toggled.
  - `indeterminate`: children are a mix of toggled and not toggled.

## Variants and Examples

### Base Styles

<code-well-header>
  <dt-stack as="fieldset" gap="400">
    <dt-toggle label-class="d-mr6">Unchecked Toggle</dt-toggle>
    <dt-toggle checked label-class="d-mr6">Checked Toggle</dt-toggle>
    <dt-toggle disabled label-class="d-mr6">Unchecked Disabled</dt-toggle>
    <dt-toggle checked disabled label-class="d-mr6">Checked Disabled</dt-toggle>
    <dt-toggle checked="mixed" label-class="d-mr6">Indeterminate Toggle</dt-toggle>
    <dt-toggle checked="mixed" label-class="d-mr6" disabled>Indeterminate Disabled</dt-toggle>
    <dt-toggle label-class="d-mr6" :show-icon="false">Without icon</dt-toggle>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-toggle-wrapper">
  <label for="dt3"> Unchecked Toggle </label><button id="dt3" role="switch" type="button" aria-checked="false" aria-disabled="false" class="d-toggle"><span class="d-toggle__inner"></span></button>
</div>
<div class="d-toggle-wrapper">
  <label for="dt4"> Checked Toggle </label>
  <button id="dt4" role="switch" type="button" aria-checked="true" aria-disabled="false" class="d-toggle d-toggle--checked"><span class="d-toggle__inner"></span></button>
</div>
<div class="d-toggle-wrapper">
  <label for="dt5"> Unchecked Disabled </label>
  <button id="dt5" role="switch" type="button" aria-checked="false" aria-disabled="true" class="d-toggle d-toggle--disabled" disabled="disabled"><span class="d-toggle__inner"></span></button>
</div>
<div class="d-toggle-wrapper">
  <label for="dt6"> Checked Disabled </label>
  <button id="dt6" role="switch" type="button" aria-checked="true" disabled="disabled" aria-disabled="true" class="d-toggle d-toggle--checked d-toggle--disabled"><span class="d-toggle__inner"></span></button>
</div>
<div class="d-toggle-wrapper">
  <label for="dt7"> Indeterminate Toggle </label>
  <button id="dt7" role="checkbox" type="button" aria-checked="mixed" aria-disabled="false" class="d-toggle d-toggle--indeterminate"><span class="d-toggle__inner"></span></button>
</div>
<div class="d-toggle-wrapper">
  <label for="dt8"> Indeterminate Disabled </label>
  <button id="dt8" role="checkbox" type="button" aria-checked="mixed" disabled="disabled" aria-disabled="true" class="d-toggle d-toggle--disabled d-toggle--indeterminate"><span class="d-toggle__inner"></span></button>
</div>
<div class="d-toggle-wrapper">
  <label for="dt14">Without icon</label>
  <button id="dt14" role="switch" type="button" aria-checked="false" aria-disabled="false" class="d-toggle"></button>
</div>
'
vueCode='
<dt-toggle>
  Unchecked Toggle
</dt-toggle>
<dt-toggle :checked="true">
  Checked Toggle
</dt-toggle>
<dt-toggle :disabled="true">
  Unchecked Disabled
</dt-toggle>
<dt-toggle :checked="true" :disabled="true">
  Checked Disabled
</dt-toggle>
<dt-toggle checked="mixed">
  Indeterminate Toggle
</dt-toggle>
<dt-toggle checked="mixed" :disabled="true">
  Indeterminate Disabled
</dt-toggle>
<dt-toggle :show-icon="false">
  Without icon
</dt-toggle>
'
showHtmlWarning />

### Sizes

<code-well-header>
  <dt-stack as="fieldset" gap="400">
    <dt-toggle size="sm" label-class="d-mr6">Small size</dt-toggle>
    <dt-toggle label-class="d-mr6">Default size</dt-toggle>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-toggle-wrapper">
  <label for="dt3"> Default size </label><button id="dt3" role="switch" type="button" aria-checked="false" aria-disabled="false" class="d-toggle"><span class="d-toggle__inner"></span></button>
</div>
<div class="d-toggle-wrapper">
  <label for="dt14"> Small size </label><button id="dt14" role="switch" type="button" aria-checked="false" aria-disabled="false" class="d-toggle d-toggle--small"><span class="d-toggle__inner"></span></button>
</div>
'
vueCode='
<dt-toggle>
  Default size
</dt-toggle>
<dt-toggle size="sm">
  Small size
</dt-toggle>
'
showHtmlWarning />

### With v-model

<code-well-header>
  <dt-stack as="fieldset" gap="400">
    <dt-toggle v-model="checked" label-class="d-mr6" ref="vModelExample">Toggle</dt-toggle>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs.vModelExample"
vueCode='
<dt-toggle v-model="checked">
  Toggle
</dt-toggle>
'
/>

## Vue API

<component-vue-api component-name="toggle" />

## Classes

<component-class-table component-name="toggle" />

## Accessibility

This component uses a native button element under the hood that has a role `switch` and type `button` to improve accessibility.
[See W3C guidelines](https://www.w3.org/TR/2021/NOTE-wai-aria-practices-1.2-20211129/examples/switch/switch-button.html)
for more information.

The best accessibility is semantic HTML. Most screen readers understand how to parse buttons if they’re correctly formatted. When it comes to toggles, there are a few things to keep in mind:

- All toggle buttons should have an `id` attribute.
- Associate toggle labels with their buttons using the `for` attribute. This correlates with the toggle's `id`.
- If you have a group of related toggles, use a `fieldset` to group them and a `legend` to title the group. For further information, please visit Gov.UK’s article, ["Using the fieldset and legend elements"](https://accessibility.blog.gov.uk/2016/07/22/using-the-fieldset-and-legend-elements).

### Button

The button element should be fully accessible by keyboard. To accomplish this, the `DtToggle` component automatically
populates several ARIA attributes to the underlying `button` element depending on the checked and
disabled states. However, if a label default slot is not used with `DtToggle`
(without including an `aria-label`), a console warning error will be thrown indicating that this issue exists.

### Focus & Keyboard

The button element should capture keyboard focus as long as it is not disabled (`disabled` prop is `true`).
`ENTER` key will
emit a **change** event with the current value of the toggle and will change its internal `checked` state.

<script setup>
import { ref } from 'vue'

const checked = ref(false)
</script>
