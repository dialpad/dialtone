---
title: Checkbox
description: A checkbox is an input control that allows users to select zero, one, or more options from a number of choices.
status: ready
thumb: true
image: assets/images/components/checkbox.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-checkbox--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=24943-2447
keywords: ["tick", "select", "form field", "d-checkbox", "DtCheckbox", "dt-checkbox"]
---

<!-- <code-well-header>
  <dt-checkbox
    name="default"
    value="Value"
    label="Checkbox label"
  />
</code-well-header> -->

<component-combinator component-name="DtCheckbox" />

## Usage

Checkboxes are an easily understandable way to indicate that users can select one or more answers to a question or items from a list. They visibly show users what’s been selected and makes it easy for them to “uncheck” an option, which can be difficult with other selection methods on a form (such as radio buttons or select menus).

<dialtone-usage>
<template #do>

- Selecting any number of choices from a set list.
- Binary selections that convey opposite states, such as check=“on” and unchecked=“off”, paired with a label that conveys the choice.
- When users need to see all the available options at a glance.
</template>

<template #dont>

- If a user can only select one option from a list; consider using [Radio](radio.md) or [Select](select-menu.md).
- If there are too many options to reasonably display in its context.
</template>

</dialtone-usage>

### Best Practices

- Users should be able to tap on or click on either the text `label` or the checkbox element itself to toggle an option, aiding accessibility.
- Options that are listed vertically are easier to read than those listed horizontally. Horizontal listings can make it difficult to tell which label pertains to which checkbox.
- Negative language in labels can be counterintuitive. For example, use "I want to receive a promotional email" instead of "I don’t want to receive promotional email".
- Make sure that the label makes both states — checked and unchecked — clear to the user. If that’s not possible, consider using a [Radio](radio.md) button with two individual options instead. Then both states can have their own clearly marked label.
- Make sure selections are adequately spaced for touch screens.
- Multiple checkbox options should be organized in a meaningful way, like alphabetical or most-frequent to least-frequent. This helps users easily find the option they’re looking for.
- `indeterminate` checkboxes convey a "mixed" state that neither qualifies as checked or unchecked. An example use case is when a checkbox acts as a "parent" of a collection of child checkboxes:
  - `checked`: all children are checked.
  - `unchecked`: all children are not checked.
  - `indeterminate`: children are a mix of checked and unchecked.

## Variants and Examples

### Base Styles

<code-well-header>
  <dt-stack ref="baseStylesExample" gap="400">
    <!-- Default -->
    <dt-checkbox
      name="default"
      value="Value"
      label="Checkbox label"
    />
    <!-- Checked -->
    <dt-checkbox
      name="checked"
      value="Value"
      label="Checkbox label"
      checked
    />
    <!-- Disabled -->
    <dt-checkbox
      name="disabled"
      value="Value"
      label="Disabled Checkbox label"
      disabled
    />
    <!-- Disabled Checked -->
    <dt-checkbox
      name="disabled-checked"
      value="Value"
      label="Disabled Checkbox label"
      checked
      disabled
    />
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.baseStylesExample'
vueCode='
<!-- Default -->
<dt-checkbox
  name="default"
  value="Value"
  label="Checkbox label"
/>
<!-- Checked -->
<dt-checkbox
  name="checked"
  value="Value"
  label="Checkbox label"
  :model-value="true"
/>
<!-- Disabled -->
<dt-checkbox
  name="disabled"
  value="Value"
  label="Checkbox label"
  disabled
/>
<!-- Disabled Checked -->
<dt-checkbox
  name="disabled-checked"
  value="Value"
  label="Checkbox label"
  :model-value="true"
  disabled
/>
'
showHtmlWarning />

### Indeterminate

<code-well-header>
  <dt-stack ref="indeterminateExample" gap="400">
    <dt-checkbox
      name="indeterminate"
      value="Value"
      label="Indeterminate checkbox"
      indeterminate
    />
    <!-- Indeterminate disabled -->
    <dt-checkbox
      name="indeterminate-disabled"
      value="Value"
      label="Indeterminate checkbox disabled"
      checked
      disabled
      indeterminate
    />
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.indeterminateExample'
vueCode='
<!-- Indeterminate -->
<dt-checkbox
  name="indeterminate"
  value="Value"
  label="Indeterminate checkbox"
  indeterminate
/>
<!-- Indeterminate disabled -->
<dt-checkbox
  name="indeterminate-disabled"
  value="Value"
  label="Indeterminate checkbox disabled"
  :model-value="true"
  disabled
  indeterminate
/>
'
showHtmlWarning />

### Stacked Group

<code-well-header>
  <dt-checkbox-group ref="stackedGroupExample" legend="Call Blocking & Spam Protection" :selectedValues="[]">
    <dt-checkbox
      name="option1"
      value="Value"
      label="Anonymous callers"
    />
    <dt-checkbox
      name="option2"
      value="Value"
      label="Block callers not already in contacts list"
    />
    <dt-checkbox
      name="option3"
      value="Value"
      label="Block callers with a high spam score"
    />
  </dt-checkbox-group>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.stackedGroupExample'
vueCode='
<dt-checkbox-group legend="Call Blocking & Spam Protection" :selectedValues="[]">
  <dt-checkbox
    name="option1"
    value="Value"
    label="Anonymous callers"
  />
  <dt-checkbox
    name="option2"
    value="Value"
    label="Block callers not already in contacts list"
  />
  <dt-checkbox
    name="option3"
    value="Value"
    label="Block callers with a high spam score"
  />
</dt-checkbox-group>
'
showHtmlWarning />

### With Description Text

<code-well-header>
  <dt-checkbox-group ref="withDescriptionExample" legend="Call Blocking & Spam Protection" :selectedValues="[]">
    <dt-checkbox
      name="option1"
      value="Value"
      label="Anonymous callers"
      description="Select how phone numbers you dont know should be handled."
    />
    <dt-checkbox
      name="option2"
      value="Value"
      label="Block callers not already in contacts list"
      description="You get enough calls. Free up some of your time."
    />
    <dt-checkbox
      name="option3"
      value="Value"
      label="Block callers with a high spam score"
      description="We will only let the legitimate callers through to bother you."
    />
  </dt-checkbox-group>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.withDescriptionExample'
vueCode='
<dt-checkbox-group legend="Call Blocking & Spam Protection" :selectedValues="[]">
  <dt-checkbox
    name="option1"
    value="Value"
    label="Anonymous callers"
    description="Select how phone numbers you dont know should be handled."
  />
  <dt-checkbox
    name="option2"
    value="Value"
    label="Block callers not already in contacts list"
    description="You get enough calls. Free up some of your time."
  />
  <dt-checkbox
    name="option3"
    value="Value"
    label="Block callers with a high spam score"
    description="We will only let the legitimate callers through to bother you."
  />
</dt-checkbox-group>
'
showHtmlWarning />

### With Validation States

<code-well-header>
  <dt-checkbox-group ref="validationStatesExample" legend="Call Blocking & Spam Protection" :selectedValues="[]">
    <dt-checkbox
      name="option1"
      value="Value"
      label="Anonymous callers"
      validation-state="warning"
      :messages="[{ message: `Select how phone numbers you dont know should be handled.`, type: `warning` }]"
    />
    <dt-checkbox
      name="option2"
      value="Value"
      label="Block callers not already in contacts list"
      validation-state="error"
      :messages="[{ message: `You get enough calls. Free up some of your time.`, type: `error` }]"
    />
    <dt-checkbox
      name="option3"
      value="Value"
      label="Block callers with a high spam score"
      validation-state="success"
      :messages="[{ message: `We will only let the legitimate callers through to bother you.`, type: `success` }]"
    />
  </dt-checkbox-group>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.validationStatesExample'
vueCode='
<dt-checkbox-group legend="Call Blocking & Spam Protection" :selectedValues="[]">
  <dt-checkbox
    name="option1"
    value="Value"
    label="Anonymous callers"
    validation-state="warning"
    :messages="[{ message: `Select how phone numbers you dont know should be handled.`, type: `warning` }]"
  />
  <dt-checkbox
    name="option2"
    value="Value"
    label="Block callers not already in contacts list"
    validation-state="error"
    :messages="[{ message: `You get enough calls. Free up some of your time.`, type: `error` }]"
  />
  <dt-checkbox
    name="option3"
    value="Value"
    label="Block callers with a high spam score"
    validation-state="success"
    :messages="[{ message: `We will only let the legitimate callers through to bother you.`, type: `success` }]"
  />
</dt-checkbox-group>
'
showHtmlWarning />

## Label size

Use the `label-size` prop to override the default label size.

<code-well-header>
  <dt-stack ref="labelSizeExample" gap="400">
    <dt-checkbox name="sizeXs" value="Value" label="Extra small label" label-size="xs" />
    <dt-checkbox name="sizeSm" value="Value" label="Small label" label-size="sm" />
    <dt-checkbox name="sizeMd" value="Value" label="Medium label (default)" label-size="md" />
    <dt-checkbox name="sizeLg" value="Value" label="Large label" label-size="lg" />
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.labelSizeExample'
vueCode='
<dt-checkbox name="sizeXs" value="Value" label="Extra small label" label-size="xs" />
<dt-checkbox name="sizeSm" value="Value" label="Small label" label-size="sm" />
<dt-checkbox name="sizeMd" value="Value" label="Medium label (default)" label-size="md" />
<dt-checkbox name="sizeLg" value="Value" label="Large label" label-size="lg" />
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="checkbox" />

## Classes

<component-class-table component-name="checkbox"></component-class-table>

## Accessibility

The best accessibility is semantic HTML. Most screen readers understand how to parse inputs if they’re correctly formatted. When it comes to checkboxes, there are a few things to keep in mind:

- All inputs should have an `id` attribute.
- Associate checkbox labels with their inputs using the `for` attribute. This correlates with the checkbox's `id`.
- If you have a group of related checkboxes, use a `fieldset` to group them and a `legend` to title the group. For further information, please visit Gov.UK’s article, ["Using the fieldset and legend elements"](https://accessibility.blog.gov.uk/2016/07/22/using-the-fieldset-and-legend-elements).
- Input with description text should have `aria-describedby` with the `id` of the description text.
- If the input is a required field, use the `aria-required` property and use the validation message for input errors.
- Input with validation errors should have `aria-describedby` with the `id` of the validation message.
