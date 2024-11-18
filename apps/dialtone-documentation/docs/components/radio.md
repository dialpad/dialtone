---
title: Radio
description: A radio is an input control that allows users to select only one option from a number of choices.
status: ready
thumb: true
image: assets/images/components/radio.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-radio--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8919%3A22042&viewport=-451%2C205%2C0.6&t=xHutRjwo1o5zMTgT-11
---

<code-well-header>
  <dt-radio
    value="optionValue"
    label="Radio label"
  />
</code-well-header>

<!-- <component-combinator component-name="DtRadio" /> -->

## Usage

Radio buttons are a common way to allow users to make a single selection from a list of options. Since only one radio button can be selected at a time (within the same group), each available choice must be its own item and label. Upon selection of a radio item in a group, the group cannot be easily reset to zero selections.

<dialtone-usage>
<template #do>

- When users may only choose a single option out of a set of mutually exclusive choices.
- If the number of available options can fit onto a mobile screen.
- In place of [Select](select-menu.md) element if there are few enough options (e.g. =7) and the design can support it.
</template>

<template #dont>

- Consider [Checkbox](checkbox.md) if users may have the option to select more than one.
- Consider a [Select](select-menu.md) if you don’t have enough space to list out all available options.
- If users should be able to select zero of the options; radio elements are not “uncheckable.” A [Checkbox](checkbox.md) may be warranted.
- If there are too many options to display on a single view; consider a [Select](select-menu.md) instead.
</template>

</dialtone-usage>

### Best practices

- Users should be able to tap on or click either the text `label` or the radio element itself to select an option.
- Options that are listed vertically are easier to read than those listed horizontally. Horizontal listings can make it difficult to tell which label pertains to which radio button.
- Make sure selections are adequately spaced for touch screens.
- Use caution if you decide to set a default value as they cannot be unchecked. Setting a default value can discourage users from making conscious decisions, seem pushy, or alienate users who don’t fit into your assumptions. If you are unsure, leave nothing selected by default.

## Variants and examples

### Base Styles

<code-well-header>
  <fieldset class="d-input-group__fieldset d-stack8">
    <dt-radio name="Value" value="Value" label="Radio label"/>
    <dt-radio name="Disabled" value="Disabled" label="Radio label thats been disabled" disabled/>
    <dt-radio name="CheckedDisabled" value="Checked" label="Radio label thats been disabled & checked" checked disabled />
  </fieldset>
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <label>
    <div class="d-radio-group">
      <div class="d-radio__input"><input name="Value" type="radio" class="d-radio" value="Value" /></div>
      <div class="d-radio__copy d-radio__label">
        <div>Radio label</div>
      </div>
    </div>
  </label>
</div>
<div>
  <label>
    <div class="d-radio-group d-radio-group--disabled">
      <div class="d-radio__input"><input name="Disabled" disabled="disabled" type="radio" class="d-radio" value="Disabled" /></div>
      <div class="d-radio__copy d-radio__label">
        <div>Radio label thats been disabled</div>
      </div>
    </div>
  </label>
</div>
<div>
  <label>
    <div class="d-radio-group d-radio-group--disabled">
      <div class="d-radio__input"><input name="CheckedDisabled" disabled="disabled" type="radio" class="d-radio" value="Checked" /></div>
      <div class="d-radio__copy d-radio__label">
        <div>Radio label thats been disabled &amp; checked</div>
      </div>
    </div>
  </label>
</div>
'
vueCode='
<dt-radio name="Value" value="Value" label="Radio label"/>
<dt-radio name="Disabled" value="Disabled" label="Radio label thats been disabled" disabled/>
<dt-radio name="CheckedDisabled" value="Checked" label="Radio label thats been disabled & checked" checked disabled />
'
showHtmlWarning />

### With Description Text

<code-well-header>
  <fieldset class="d-input-group__fieldset d-stack8">
    <legend class="d-label">Advanced missed call routing</legend>
    <dt-radio name="ValueWDesc" value="Value" label="To voicemail" description="So they can hear your voice"/>
    <dt-radio name="DisabledWDesc" value="Disabled" label="Disabled" description="With Description" disabled />
  </fieldset>
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <label>
    <div class="d-radio-group">
      <div class="d-radio__input"><input name="ValueWDesc" type="radio" class="d-radio" value="Value" /></div>
      <div class="d-radio__copy d-radio__label">
        <div>To voicemail</div>
        <div class="d-description">So they can hear your voice</div>
      </div>
    </div>
  </label>
</div>
<div>
  <label>
    <div class="d-radio-group d-radio-group--disabled">
      <div class="d-radio__input"><input name="DisabledWDesc" type="radio" class="d-radio" value="Disabled" disabled="disabled" /></div>
      <div class="d-radio__copy d-radio__label">
        <div>Disabled</div>
        <div class="d-description">With Description</div>
      </div>
    </div>
  </label>
</div>
'
vueCode='
<dt-radio name="ValueWDesc" value="Value" label="To voicemail" description="So they can hear your voice"/>
<dt-radio name="DisabledWDesc" value="Disabled" label="Disabled" description="With Description" disabled />
'
showHtmlWarning />

### With validation states

<code-well-header>
  <fieldset class="d-input-group__fieldset d-stack8">
    <legend class="d-label">Advanced missed call routing</legend>
    <dt-radio
      name="ValidationMessages"
      value="Validation Message Warning"
      label="To voicemail"
      validation-state="warning"
      :messages="[{ message: `So they can hear your voice`, type: `warning` }]"
    />
    <dt-radio
      name="ValidationMessages"
      value="Validation Message Error"
      label="To a message (no voicemail)"
      validation-state="error"
      :messages="[{ message: `Because they probably don't need to leave a message anyway.`, type: `error` }]"
    />
    <dt-radio
      name="ValidationMessages"
      value="Validation Message Success"
      label="To a team member or room phone"
      validation-state="success"
      :messages="[{ message: `Because someone else might be able to talk to them.`, type: `success` }]"
    />
  </fieldset>
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <label>
    <div class="d-radio-group">
      <div class="d-radio__input"><input name="ValidationMessageWarning" type="radio" class="d-radio d-radio--warning" value="Validation Message Warning" /></div>
      <div class="d-radio__copy d-radio__label">
        <div>To voicemail</div>
        <div class="base-input__messages d-validation-message__container">
          <div role="status" aria-live="polite" class="base-input__message d-validation-message base-input__message--warning d-validation-message--warning"><p>So they can hear your voice</p></div>
        </div>
      </div>
    </div>
  </label>
</div>
<div>
  <label>
    <div class="d-radio-group">
      <div class="d-radio__input"><input name="ValidationMessageError" type="radio" class="d-radio d-radio--error" value="Validation Message Error" /></div>
      <div class="d-radio__copy d-radio__label">
        <div>To a message (no voicemail)</div>
        <div class="base-input__messages d-validation-message__container">
          <div role="status" aria-live="polite" class="base-input__message d-validation-message base-input__message--error d-validation-message--error">
            <p>Because they probably dont need to leave a message anyway.</p>
          </div>
        </div>
      </div>
    </div>
  </label>
</div>
<div>
  <label>
    <div class="d-radio-group">
      <div class="d-radio__input"><input name="ValidationMessageSuccess" type="radio" class="d-radio d-radio--success" value="Validation Message Success" /></div>
      <div class="d-radio__copy d-radio__label">
        <div>To a team member or room phone</div>
        <div class="base-input__messages d-validation-message__container">
          <div role="status" aria-live="polite" class="base-input__message d-validation-message base-input__message--success d-validation-message--success">
            <p>Because someone else might be able to talk to them.</p>
          </div>
        </div>
      </div>
    </div>
  </label>
</div>
'
vueCode='
<dt-radio
  name="ValidationMessageWarning"
  value="Validation Message Warning"
  label="To voicemail"
  validation-state="warning"
  :messages="[{ message: `So they can hear your voice`, type: `warning` }]"
/>
<dt-radio
  name="ValidationMessageError"
  value="Validation Message Error"
  label="To a message (no voicemail)"
  validation-state="error"
/>
<dt-radio
  name="ValidationMessageSuccess"
  value="Validation Message Success"
  label="To a team member or room phone"
  validation-state="success"
  :messages="[{ message: `Because someone else might be able to talk to them.`, type: `success` }]"
/>
'
showHtmlWarning />

### With slotted label

<code-well-header>
  <dt-radio
    ref="slottedLabel"
    name="ValueWSlot"
    value="Value"
  >
    With Slotted Label
  </dt-radio>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.slottedLabel'
vueCode='
<dt-radio
  name="ValueWSlot"
  value="Value"
>
  With Slotted Label
</dt-radio>
'
/>

### With slotted description

<code-well-header>
  <dt-radio
    ref="slottedDescription"
    name="ValueWSlottedDescription"
    value="Value"
    label="With"
  >
    <template #description>
      Slotted Description
    </template>
  </dt-radio>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.slottedDescription'
vueCode='
<dt-radio
  name="ValueWSlottedDescription"
  value="Value"
  label="With"
>
  <template #description>
    Slotted Description
  </template>
</dt-radio>
'
/>

## Classes

<component-class-table component-name="radio" />

## Accessibility

The best accessibility is semantic HTML. Most screen readers understand how to parse inputs if they’re correctly formatted. When it comes to radio input, there are a few things to keep in mind:

- All inputs should have an `id` attribute.
- Associate radio labels with their inputs using the `for` attribute. This correlates with the radio's `id`.
- If you have a group of related radios, use a `fieldset` to group them and a `legend` to title the group. For further information, please visit Gov.UK’s article, ["Using the fieldset and legend elements"](https://accessibility.blog.gov.uk/2016/07/22/using-the-fieldset-and-legend-elements).
- If the input is a required field, use the `aria-required` property and use the validation message for input errors.
- Input with validation errors should have `aria-describedby` with the `id` of the validation message.
- Input with validation errors should have `aria-describedby` with the `id` of the validation message.

## Vue API

<component-vue-api component-name="radio" />
