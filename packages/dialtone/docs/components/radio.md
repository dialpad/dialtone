---
title: Radio
description: A radio is an input control that allows users to select only one option from a number of choices.
status: ready
thumb: true
image: assets/images/components/radio.png
storybook: https://vue.dialpad.design/?path=/story/components-radio--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8919%3A22042&viewport=-451%2C205%2C0.6&t=xHutRjwo1o5zMTgT-11
---

<code-well-header>
  <div class="d-radio-group">
    <div class="d-radio__input">
      <input class="d-radio" type="radio" name="Dialtone-RadioGroup0" id="Dialtone-RadioExample0" />
    </div>
    <div class="d-radio__copy">
      <label class="d-radio__label" for="Dialtone-RadioExample0">Radio label</label>
    </div>
  </div>
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
    <div class="d-radio-group">
      <div class="d-radio__input">
        <input class="d-radio" type="radio" name="Dialtone-RadioGroup1" id="Dialtone-RadioExample1" />
      </div>
      <div class="d-radio__copy">
        <label class="d-radio__label" for="Dialtone-RadioExample1">Radio label</label>
      </div>
    </div>
    <div class="d-radio-group">
      <div class="d-radio__input">
        <input class="d-radio" type="radio" name="Dialtone-RadioGroup1" id="Dialtone-RadioExample2" checked />
      </div>
      <div class="d-radio__copy">
        <label class="d-radio__label" for="Dialtone-RadioExample2">Radio label</label>
      </div>
    </div>
    <div class="d-radio-group d-radio-group--disabled">
      <div class="d-radio__input">
        <input class="d-radio" type="radio" name="Dialtone-RadioGroup1" id="Dialtone-RadioExample3" disabled />
      </div>
      <div class="d-radio__copy">
        <label class="d-radio__label" for="Dialtone-RadioExample3">Radio label that's been disabled</label>
      </div>
    </div>
    <div class="d-radio-group d-radio-group--disabled">
      <div class="d-radio__input">
        <input class="d-radio" type="radio" name="Dialtone-RadioGroup1" id="Dialtone-RadioExample4" disabled checked />
      </div>
      <div class="d-radio__copy">
        <label class="d-radio__label" for="Dialtone-RadioExample4">Radio label that's been disabled</label>
      </div>
    </div>
    <div class="d-radio-group d-radio-group--disabled">
      <div class="d-radio__input">
        <input class="d-radio d-radio--disabled" type="radio" name="Dialtone-RadioGroup1" id="Dialtone-RadioExample5" />
      </div>
      <div class="d-radio__copy">
        <label class="d-radio__label" for="Dialtone-RadioExample5">Radio label that's been disabled (but without the `disabled` attribute)</label>
      </div>
    </div>
  </fieldset>
</code-well-header>

```html
<fieldset class="d-input-group__fieldset d-stack8">
  <div class="d-radio-group">
    <div class="d-radio__input">
      <input class="d-radio" type="radio" name="Dialtone-RadioGroup1" id="Dialtone-RadioExample1" />
    </div>
    <div class="d-radio__copy">
      <label class="d-radio__label" for="Dialtone-RadioExample1">Radio label</label>
    </div>
  </div>
  <div class="d-radio-group">
    <div class="d-radio__input">
      <input class="d-radio" type="radio" name="Dialtone-RadioGroup1" id="Dialtone-RadioExample2" checked />
    </div>
    <div class="d-radio__copy">
      <label class="d-radio__label" for="Dialtone-RadioExample2">Radio label</label>
    </div>
  </div>
  <div class="d-radio-group d-radio-group--disabled">
    <div class="d-radio__input">
      <input class="d-radio" type="radio" name="Dialtone-RadioGroup1" id="Dialtone-RadioExample3" disabled />
    </div>
    <div class="d-radio__copy">
      <label class="d-radio__label" for="Dialtone-RadioExample3">Radio label that's been disabled</label>
    </div>
  </div>
  <div class="d-radio-group d-radio-group--disabled">
    <div class="d-radio__input">
      <input class="d-radio" type="radio" name="Dialtone-RadioGroup1" id="Dialtone-RadioExample4" disabled checked />
    </div>
    <div class="d-radio__copy">
      <label class="d-radio__label" for="Dialtone-RadioExample4">Radio label that's been disabled</label>
    </div>
  </div>
  <div class="d-radio-group d-radio-group--disabled">
    <div class="d-radio__input">
      <input class="d-radio d-radio--disabled" type="radio" name="Dialtone-RadioGroup1" id="Dialtone-RadioExample5" />
    </div>
    <div class="d-radio__copy">
      <label class="d-radio__label" for="Dialtone-RadioExample5">Radio label that's been disabled (but without the `disabled` attribute)</label>
    </div>
  </div>
</fieldset>
```

### Stacked Group

<code-well-header>
  <fieldset class="d-input-group__fieldset d-stack8">
    <legend class="d-label">Advanced missed call routing</legend>
    <div class="d-radio-group">
      <div class="d-radio__input">
        <input class="d-radio" type="radio" name="Dialtone-RadioGroup2" id="Dialtone-RadioGroupAExample1" />
      </div>
      <div class="d-radio__copy">
        <label class="d-radio__label" for="Dialtone-RadioGroupAExample1" checked>To voicemail</label>
      </div>
    </div>
    <div class="d-radio-group">
      <div class="d-radio__input">
        <input class="d-radio" type="radio" name="Dialtone-RadioGroup2" id="Dialtone-RadioGroupAExample2" />
      </div>
      <div class="d-radio__copy">
        <label class="d-radio__label" for="Dialtone-RadioGroupAExample2">To a message (no voicemail)</label>
      </div>
    </div>
    <div class="d-radio-group">
      <div class="d-radio__input">
        <input class="d-radio" type="radio" name="Dialtone-RadioGroup2" id="Dialtone-RadioGroupAExample3" />
      </div>
      <div class="d-radio__copy">
        <label class="d-radio__label" for="Dialtone-RadioGroupAExample3">To a team member or room phone</label>
      </div>
    </div>
  </fieldset>
</code-well-header>

```html
<fieldset class="d-input-group__fieldset d-stack8">
  <legend class="d-label">Advanced missed call routing</legend>
  <div class="d-radio-group">
    <div class="d-radio__input">
      <input class="d-radio" type="radio" name="Dialtone-RadioGroup2" id="Dialtone-RadioGroupAExample1" />
    </div>
    <div class="d-radio__copy">
      <label class="d-radio__label" for="Dialtone-RadioGroupAExample1" checked>To voicemail</label>
    </div>
  </div>
  <div class="d-radio-group">
    <div class="d-radio__input">
      <input class="d-radio" type="radio" name="Dialtone-RadioGroup2" id="Dialtone-RadioGroupAExample2" />
    </div>
    <div class="d-radio__copy">
      <label class="d-radio__label" for="Dialtone-RadioGroupAExample2">To a message (no voicemail)</label>
    </div>
  </div>
  <div class="d-radio-group">
    <div class="d-radio__input">
      <input class="d-radio" type="radio" name="Dialtone-RadioGroup2" id="Dialtone-RadioGroupAExample3" />
    </div>
    <div class="d-radio__copy">
      <label class="d-radio__label" for="Dialtone-RadioGroupAExample3">To a team member or room phone</label>
    </div>
  </div>
</fieldset>
```

### With Description Text

<code-well-header>
  <fieldset class="d-input-group__fieldset d-stack8">
    <legend class="d-label">Advanced missed call routing</legend>
    <div class="d-radio-group">
      <div class="d-radio__input">
        <input class="d-radio" type="radio" name="Dialtone-RadioGroup3" id="Dialtone-RadioGroupBExample1" />
      </div>
      <div class="d-radio__copy">
        <label class="d-radio__label" for="Dialtone-RadioGroupBExample1" checked>To voicemail</label>
        <div class="d-description">So they can hear your voice</div>
      </div>
    </div>
    <div class="d-radio-group">
      <div class="d-radio__input">
        <input class="d-radio" type="radio" name="Dialtone-RadioGroup3" id="Dialtone-RadioGroupBExample2" />
      </div>
      <div class="d-radio__copy">
        <label class="d-radio__label" for="Dialtone-RadioGroupBExample2">To a message (no voicemail)</label>
        <div class="d-description">Because they probably don't need to leave a message anyway.</div>
      </div>
    </div>
    <div class="d-radio-group">
      <div class="d-radio__input">
        <input class="d-radio" type="radio" name="Dialtone-RadioGroup3" id="Dialtone-RadioGroupBExample3" />
      </div>
      <div class="d-radio__copy">
        <label class="d-radio__label" for="Dialtone-RadioGroupBExample3">To a team member or room phone</label>
        <div class="d-description">Because someone else might be able to talk to them.</div>
      </div>
    </div>
  </fieldset>
</code-well-header>

```html
<fieldset class="d-input-group__fieldset d-stack8">
  <legend class="d-label">Advanced missed call routing</legend>
  <div class="d-radio-group">
    <div class="d-radio__input">
      <input class="d-radio" type="radio" name="Dialtone-RadioGroup3" id="Dialtone-RadioGroupBExample1" />
    </div>
    <div class="d-radio__copy">
      <label class="d-radio__label" for="Dialtone-RadioGroupBExample1" checked>To voicemail</label>
      <div class="d-description">So they can hear your voice</div>
    </div>
  </div>
  <div class="d-radio-group">
    <div class="d-radio__input">
      <input class="d-radio" type="radio" name="Dialtone-RadioGroup3" id="Dialtone-RadioGroupBExample2" />
    </div>
    <div class="d-radio__copy">
      <label class="d-radio__label" for="Dialtone-RadioGroupBExample2">To a message (no voicemail)</label>
      <div class="d-description">Because they probably don't need to leave a message anyway.</div>
    </div>
  </div>
  <div class="d-radio-group">
    <div class="d-radio__input">
      <input class="d-radio" type="radio" name="Dialtone-RadioGroup3" id="Dialtone-RadioGroupBExample3" />
    </div>
    <div class="d-radio__copy">
      <label class="d-radio__label" for="Dialtone-RadioGroupBExample3">To a team member or room phone</label>
      <div class="d-description">Because someone else might be able to talk to them.</div>
    </div>
  </div>
</fieldset>
```

### With validation states

<code-well-header>
  <fieldset class="d-input-group__fieldset d-stack8">
    <legend class="d-label">Advanced missed call routing</legend>
    <div class="d-radio-group">
      <div class="d-radio__input">
        <input class="d-radio d-radio--warning" type="radio" name="Dialtone-RadioGroup4" id="Dialtone-RadioGroupCExample1" />
      </div>
      <div class="d-radio__copy">
        <label class="d-radio__label" for="Dialtone-RadioGroupCExample1">To voicemail</label>
        <div class="d-validation-message d-validation-message--warning">So they can hear your voice</div>
      </div>
    </div>
    <div class="d-radio-group">
      <div class="d-radio__input">
        <input class="d-radio d-radio--error" type="radio" name="Dialtone-RadioGroup4" id="Dialtone-RadioGroupCExample2" />
      </div>
      <div class="d-radio__copy">
        <label class="d-radio__label" for="Dialtone-RadioGroupCExample2">To a message (no voicemail)</label>
        <div class="d-validation-message d-validation-message--error">Because they probably don't need to leave a message anyway.</div>
      </div>
    </div>
    <div class="d-radio-group">
      <div class="d-radio__input">
        <input class="d-radio d-radio--success" type="radio" name="Dialtone-RadioGroup4" id="Dialtone-RadioGroupCExample3" />
      </div>
      <div class="d-radio__copy">
        <label class="d-radio__label" for="Dialtone-RadioGroupCExample3">To a team member or room phone</label>
        <div class="d-validation-message d-validation-message--success">Because someone else might be able to talk to them.</div>
      </div>
    </div>
  </fieldset>
</code-well-header>

```html
<fieldset class="d-input-group__fieldset d-stack8">
  <legend class="d-label">Advanced missed call routing</legend>
  <div class="d-radio-group">
    <div class="d-radio__input">
      <input class="d-radio d-radio--warning" type="radio" name="Dialtone-RadioGroup4" id="Dialtone-RadioGroupCExample1" />
    </div>
    <div class="d-radio__copy">
      <label class="d-radio__label" for="Dialtone-RadioGroupCExample1">To voicemail</label>
      <div class="d-validation-message d-validation-message--warning">So they can hear your voice</div>
    </div>
  </div>
  <div class="d-radio-group">
    <div class="d-radio__input">
      <input class="d-radio d-radio--error" type="radio" name="Dialtone-RadioGroup4" id="Dialtone-RadioGroupCExample2" />
    </div>
    <div class="d-radio__copy">
      <label class="d-radio__label" for="Dialtone-RadioGroupCExample2">To a message (no voicemail)</label>
      <div class="d-validation-message d-validation-message--error">Because they probably don't need to leave a message anyway.</div>
    </div>
  </div>
  <div class="d-radio-group">
    <div class="d-radio__input">
      <input class="d-radio d-radio--success" type="radio" name="Dialtone-RadioGroup4" id="Dialtone-RadioGroupCExample3" />
    </div>
    <div class="d-radio__copy">
      <label class="d-radio__label" for="Dialtone-RadioGroupCExample3">To a team member or room phone</label>
      <div class="d-validation-message d-validation-message--success">Because someone else might be able to talk to them.</div>
    </div>
  </div>
</fieldset>
```

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

<script setup>
  import DialtoneUsage from '@baseComponents/DialtoneUsage.vue';
</script>

## Vue API

<component-vue-api component-name="radio" />
