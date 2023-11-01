---
title: Checkbox
description: A checkbox is an input control that allows users to select zero, one, or more options from a number of choices.
status: ready
thumb: true
image: assets/images/components/checkbox.png
storybook: https://vue.dialpad.design/?path=/story/components-checkbox--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8921%3A21160&viewport=-351%2C484%2C0.54&t=xHutRjwo1o5zMTgT-11
---
<code-well-header>
  <div class="d-checkbox-group">
    <div class="d-checkbox__input">
      <input class="d-checkbox" type="checkbox" name="Dialtone-CheckExample1" id="Dialtone-CheckExample1" />
    </div>
    <div class="d-checkbox__copy">
      <label class="d-checkbox__label" for="Dialtone-CheckExample1">Checkbox label</label>
    </div>
  </div>
</code-well-header>

<!-- <component-combinator component-name="DtCheckbox" /> -->

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

### Best practices

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

## Variants and examples

### Base Styles

<code-well-header>
  <fieldset class="d-input-group__fieldset d-stack8">
    <div class="d-checkbox-group">
      <div class="d-checkbox__input">
        <input class="d-checkbox" type="checkbox" name="Dialtone-CheckExample1" id="Dialtone-CheckExample1" />
      </div>
      <div class="d-checkbox__copy">
        <label class="d-checkbox__label" for="Dialtone-CheckExample1">Checkbox label</label>
      </div>
    </div>
    <div class="d-checkbox-group">
      <div class="d-checkbox__input">
        <input class="d-checkbox" type="checkbox" name="Dialtone-CheckExample2" id="Dialtone-CheckExample2" checked />
      </div>
      <div class="d-checkbox__copy">
        <label class="d-checkbox__label" for="Dialtone-CheckExample2">Checkbox label</label>
      </div>
    </div>
    <div class="d-checkbox-group d-checkbox-group--disabled">
      <div class="d-checkbox__input">
        <input class="d-checkbox" type="checkbox" name="Dialtone-CheckExample3" id="Dialtone-CheckExample3" disabled />
      </div>
      <div class="d-checkbox__copy">
        <label class="d-checkbox__label" for="Dialtone-CheckExample3">Disabled checkbox label</label>
      </div>
    </div>
    <div class="d-checkbox-group d-checkbox-group--disabled">
      <div class="d-checkbox__input">
        <input class="d-checkbox" type="checkbox" name="Dialtone-CheckExample4" id="Dialtone-CheckExample4" disabled checked />
      </div>
      <div class="d-checkbox__copy">
        <label class="d-checkbox__label" for="Dialtone-CheckExample4">Disabled checkbox label</label>
      </div>
    </div>
    <div class="d-checkbox-group d-checkbox-group--disabled">
      <div class="d-checkbox__input">
        <input class="d-checkbox d-checkbox--disabled" type="checkbox" name="Dialtone-CheckExample5" id="Dialtone-CheckExample5" />
      </div>
      <div class="d-checkbox__copy">
        <label class="d-checkbox__label" for="Dialtone-CheckExample5">Unchecked Checkbox that has disabled styling applied (but doesn't have `disabled` attribute)</label>
      </div>
    </div>
    <div class="d-checkbox-group d-checkbox-group--disabled">
      <div class="d-checkbox__input">
        <input class="d-checkbox d-checkbox--disabled" type="checkbox" name="Dialtone-CheckExample6" id="Dialtone-CheckExample6" checked />
      </div>
      <div class="d-checkbox__copy">
        <label class="d-checkbox__label" for="Dialtone-CheckExample6">Checked Checkbox that has disabled styling applied (but doesn't have `disabled` attribute)</label>
      </div>
    </div>
  </fieldset>
</code-well-header>

```html
<fieldset class="d-input-group__fieldset d-stack8">
  <div class="d-checkbox-group">
    <div class="d-checkbox__input">
      <input class="d-checkbox" type="checkbox" name="Dialtone-CheckExample1" id="Dialtone-CheckExample1" />
    </div>
    <div class="d-checkbox__copy">
      <label class="d-checkbox__label" for="Dialtone-CheckExample1">Checkbox label</label>
    </div>
  </div>
  <div class="d-checkbox-group">
    <div class="d-checkbox__input">
      <input class="d-checkbox" type="checkbox" name="Dialtone-CheckExample2" id="Dialtone-CheckExample2" checked />
    </div>
    <div class="d-checkbox__copy">
      <label class="d-checkbox__label" for="Dialtone-CheckExample2">Checkbox label</label>
    </div>
  </div>
  <div class="d-checkbox-group d-checkbox-group--disabled">
    <div class="d-checkbox__input">
      <input class="d-checkbox" type="checkbox" name="Dialtone-CheckExample3" id="Dialtone-CheckExample3" disabled />
    </div>
    <div class="d-checkbox__copy">
      <label class="d-checkbox__label" for="Dialtone-CheckExample3">Disabled checkbox label</label>
    </div>
  </div>
  <div class="d-checkbox-group d-checkbox-group--disabled">
    <div class="d-checkbox__input">
      <input class="d-checkbox" type="checkbox" name="Dialtone-CheckExample4" id="Dialtone-CheckExample4" disabled checked />
    </div>
    <div class="d-checkbox__copy">
      <label class="d-checkbox__label" for="Dialtone-CheckExample4">Disabled checkbox label</label>
    </div>
  </div>
  <div class="d-checkbox-group d-checkbox-group--disabled">
    <div class="d-checkbox__input">
      <input class="d-checkbox d-checkbox--disabled" type="checkbox" name="Dialtone-CheckExample5" id="Dialtone-CheckExample5" />
    </div>
    <div class="d-checkbox__copy">
      <label class="d-checkbox__label" for="Dialtone-CheckExample5">Unchecked Checkbox that has disabled styling applied (but doesn't have `disabled` attribute)</label>
    </div>
  </div>
  <div class="d-checkbox-group d-checkbox-group--disabled">
    <div class="d-checkbox__input">
      <input class="d-checkbox d-checkbox--disabled" type="checkbox" name="Dialtone-CheckExample6" id="Dialtone-CheckExample6" checked />
    </div>
    <div class="d-checkbox__copy">
      <label class="d-checkbox__label" for="Dialtone-CheckExample6">Checked Checkbox that has disabled styling applied (but doesn't have `disabled` attribute)</label>
    </div>
  </div>
</fieldset>
```

### Indeterminate

<code-well-header>
  <fieldset class="d-input-group__fieldset d-stack8">
    <div class="d-checkbox-group">
      <div class="d-checkbox__input">
        <input class="d-checkbox d-checkbox--indeterminate" type="checkbox" name="Checkbox-IndeterminateExample1" id="Checkbox-IndeterminateExample1" />
      </div>
      <div class="d-checkbox__copy">
        <label class="d-checkbox__label" for="Checkbox-IndeterminateExample1">Indeterminate checkbox using custom class</label>
      </div>
    </div>
    <div class="d-checkbox-group">
      <div class="d-checkbox__input">
        <input class="d-checkbox d-checkbox--indeterminate" type="checkbox" name="Checkbox-IndeterminateExample2" id="Checkbox-IndeterminateExample2" disabled />
      </div>
      <div class="d-checkbox__copy">
        <label class="d-checkbox__label" for="Checkbox-IndeterminateExample2">Indeterminate disabled checkbox</label>
      </div>
    </div>
  </fieldset>
</code-well-header>

```html
<fieldset class="d-input-group__fieldset d-stack8">
  <div class="d-checkbox-group">
    <div class="d-checkbox__input">
      <input class="d-checkbox d-checkbox--indeterminate" type="checkbox" name="Checkbox-IndeterminateExample1" id="Checkbox-IndeterminateExample1" />
    </div>
    <div class="d-checkbox__copy">
      <label class="d-checkbox__label" for="Checkbox-IndeterminateExample1">Indeterminate checkbox using custom class</label>
    </div>
  </div>
  <div class="d-checkbox-group">
    <div class="d-checkbox__input">
      <input class="d-checkbox d-checkbox--indeterminate" type="checkbox" name="Checkbox-IndeterminateExample2" id="Checkbox-IndeterminateExample2" disabled />
    </div>
    <div class="d-checkbox__copy">
      <label class="d-checkbox__label" for="Checkbox-IndeterminateExample2">Indeterminate disabled checkbox</label>
    </div>
  </div>
</fieldset>
```

### Stacked Group

<code-well-header>
  <fieldset class="d-input-group__fieldset d-stack8">
    <legend class="d-label">Call Blocking & Spam Protection</legend>
    <div class="d-checkbox-group">
      <div class="d-checkbox__input">
        <input class="d-checkbox" type="checkbox" name="Dialtone-CheckGroupAExample1" id="Dialtone-CheckGroupAExample1" />
      </div>
      <div class="d-checkbox__copy">
        <label class="d-checkbox__label" for="Dialtone-CheckGroupAExample1">Anonymous callers</label>
      </div>
    </div>
    <div class="d-checkbox-group">
      <div class="d-checkbox__input">
        <input class="d-checkbox" type="checkbox" name="Dialtone-CheckGroupAExample2" id="Dialtone-CheckGroupAExample2" />
      </div>
      <div class="d-checkbox__copy">
        <label class="d-checkbox__label" for="Dialtone-CheckGroupAExample2">Block callers not already in contacts list</label>
      </div>
    </div>
    <div class="d-checkbox-group">
      <div class="d-checkbox__input">
        <input class="d-checkbox" type="checkbox" name="Dialtone-CheckGroupAExample3" id="Dialtone-CheckGroupAExample3" />
      </div>
      <div class="d-checkbox__copy">
        <label class="d-checkbox__label" for="Dialtone-CheckGroupAExample3">Block callers with a high spam score</label>
      </div>
    </div>
  </fieldset>
</code-well-header>

```html
<fieldset class="d-input-group__fieldset d-stack8">
  <legend class="d-label">Call Blocking & Spam Protection</legend>
  <div class="d-checkbox-group">
    <div class="d-checkbox__input">
      <input class="d-checkbox" type="checkbox" name="Dialtone-CheckGroupAExample1" id="Dialtone-CheckGroupAExample1" />
    </div>
    <div class="d-checkbox__copy">
      <label class="d-checkbox__label" for="Dialtone-CheckGroupAExample1">Anonymous callers</label>
    </div>
  </div>
  <div class="d-checkbox-group">
    <div class="d-checkbox__input">
      <input class="d-checkbox" type="checkbox" name="Dialtone-CheckGroupAExample2" id="Dialtone-CheckGroupAExample2" />
    </div>
    <div class="d-checkbox__copy">
      <label class="d-checkbox__label" for="Dialtone-CheckGroupAExample2">Block callers not already in contacts list</label>
    </div>
  </div>
  <div class="d-checkbox-group">
    <div class="d-checkbox__input">
      <input class="d-checkbox" type="checkbox" name="Dialtone-CheckGroupAExample3" id="Dialtone-CheckGroupAExample3" />
    </div>
    <div class="d-checkbox__copy">
      <label class="d-checkbox__label" for="Dialtone-CheckGroupAExample3">Block callers with a high spam score</label>
    </div>
  </div>
</fieldset>
```

### With Description Text

<code-well-header>
  <fieldset class="d-input-group__fieldset d-stack8">
    <legend class="d-label">Call Blocking & Spam Protection</legend>
    <div class="d-checkbox-group">
      <div class="d-checkbox__input">
        <input class="d-checkbox" type="checkbox" name="Dialtone-CheckGroupBExample1" id="Dialtone-CheckGroupBExample1" />
      </div>
      <div class="d-checkbox__copy">
        <label class="d-checkbox__label" for="Dialtone-CheckGroupBExample1">Anonymous callers
          <div class="d-description">Select how phone numbers you don't know should be handled.</div>
        </label>
      </div>
    </div>
    <div class="d-checkbox-group">
      <div class="d-checkbox__input">
        <input class="d-checkbox" type="checkbox" name="Dialtone-CheckGroupBExample2" id="Dialtone-CheckGroupBExample2" />
      </div>
      <div class="d-checkbox__copy">
        <label class="d-checkbox__label" for="Dialtone-CheckGroupBExample2">Block callers not already in contacts list
          <div class="d-description">You get enough calls. Free up some of your time.</div>
        </label>
      </div>
    </div>
    <div class="d-checkbox-group">
      <div class="d-checkbox__input">
        <input class="d-checkbox" type="checkbox" name="Dialtone-CheckGroupBExample3" id="Dialtone-CheckGroupBExample3" />
      </div>
      <div class="d-checkbox__copy">
        <label class="d-checkbox__label" for="Dialtone-CheckGroupBExample3">Block callers with a high spam score
          <div class="d-description">We'll only let the legitimate callers through to bother you.</div>
        </label>
      </div>
    </div>
  </fieldset>
</code-well-header>

```html
<fieldset class="d-input-group__fieldset d-stack8">
  <legend class="d-label">Call Blocking & Spam Protection</legend>
  <div class="d-checkbox-group">
    <div class="d-checkbox__input">
      <input class="d-checkbox" type="checkbox" name="Dialtone-CheckGroupBExample1" id="Dialtone-CheckGroupBExample1" />
    </div>
    <div class="d-checkbox__copy">
      <label class="d-checkbox__label" for="Dialtone-CheckGroupBExample1">Anonymous callers
        <div class="d-description">Select how phone numbers you don't know should be handled.</div>
      </label>
    </div>
  </div>
  <div class="d-checkbox-group">
    <div class="d-checkbox__input">
      <input class="d-checkbox" type="checkbox" name="Dialtone-CheckGroupBExample2" id="Dialtone-CheckGroupBExample2" />
    </div>
    <div class="d-checkbox__copy">
      <label class="d-checkbox__label" for="Dialtone-CheckGroupBExample2">Block callers not already in contacts list
        <div class="d-description">You get enough calls. Free up some of your time.</div>
      </label>
    </div>
  </div>
  <div class="d-checkbox-group">
    <div class="d-checkbox__input">
      <input class="d-checkbox" type="checkbox" name="Dialtone-CheckGroupBExample3" id="Dialtone-CheckGroupBExample3" />
    </div>
    <div class="d-checkbox__copy">
      <label class="d-checkbox__label" for="Dialtone-CheckGroupBExample3">Block callers with a high spam score
        <div class="d-description">We'll only let the legitimate callers through to bother you.</div>
      </label>
    </div>
  </div>
</fieldset>
```

### With validation states

<code-well-header>
  <fieldset class="d-input-group__fieldset d-stack8">
    <legend class="d-label">Call Blocking & Spam Protection</legend>
    <div class="d-checkbox-group">
      <div class="d-checkbox__input">
        <input class="d-checkbox d-checkbox--warning" type="checkbox" name="Dialtone-CheckGroupBExample1" id="Dialtone-CheckGroupCExample1" />
      </div>
      <div class="d-checkbox__copy">
        <label class="d-checkbox__label" for="Dialtone-CheckGroupCExample1">Anonymous callers
          <div class="d-validation-message d-validation-message--warning">Select how phone numbers you don't know should be handled.</div>
        </label>
      </div>
    </div>
    <div class="d-checkbox-group">
      <div class="d-checkbox__input">
        <input class="d-checkbox d-checkbox--error" type="checkbox" name="Dialtone-CheckGroupCExample2" id="Dialtone-CheckGroupCExample2" />
      </div>
      <div class="d-checkbox__copy">
        <label class="d-checkbox__label" for="Dialtone-CheckGroupCExample2">Block callers not already in contacts list
          <div class="d-validation-message d-validation-message--error">You get enough calls. Free up some of your time.</div>
        </label>
      </div>
    </div>
    <div class="d-checkbox-group">
      <div class="d-checkbox__input">
        <input class="d-checkbox d-checkbox--success" type="checkbox" name="Dialtone-CheckGroupCExample3" id="Dialtone-CheckGroupCExample3" />
      </div>
      <div class="d-checkbox__copy">
        <label class="d-checkbox__label" for="Dialtone-CheckGroupCExample3">Block callers with a high spam score
          <div class="d-validation-message d-validation-message--success">We'll only let the legitimate callers through to bother you.</div>
        </label>
      </div>
    </div>
  </fieldset>
</code-well-header>

```html
<fieldset class="d-input-group__fieldset d-stack8">
  <legend class="d-label">Call Blocking & Spam Protection</legend>
  <div class="d-checkbox-group">
    <div class="d-checkbox__input">
      <input class="d-checkbox d-checkbox--warning" type="checkbox" name="Dialtone-CheckGroupBExample1" id="Dialtone-CheckGroupCExample1" />
    </div>
    <div class="d-checkbox__copy">
      <label class="d-checkbox__label" for="Dialtone-CheckGroupCExample1">Anonymous callers
        <div class="d-validation-message d-validation-message--warning">Select how phone numbers you don't know should be handled.</div>
      </label>
    </div>
  </div>
  <div class="d-checkbox-group">
    <div class="d-checkbox__input">
      <input class="d-checkbox d-checkbox--error" type="checkbox" name="Dialtone-CheckGroupCExample2" id="Dialtone-CheckGroupCExample2" />
    </div>
    <div class="d-checkbox__copy">
      <label class="d-checkbox__label" for="Dialtone-CheckGroupCExample2">Block callers not already in contacts list
        <div class="d-validation-message d-validation-message--error">You get enough calls. Free up some of your time.</div>
      </label>
    </div>
  </div>
  <div class="d-checkbox-group">
    <div class="d-checkbox__input">
      <input class="d-checkbox d-checkbox--success" type="checkbox" name="Dialtone-CheckGroupCExample3" id="Dialtone-CheckGroupCExample3" />
    </div>
    <div class="d-checkbox__copy">
      <label class="d-checkbox__label" for="Dialtone-CheckGroupCExample3">Block callers with a high spam score
        <div class="d-validation-message d-validation-message--success">We'll only let the legitimate callers through to bother you.</div>
      </label>
    </div>
  </div>
</fieldset>
```

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

<script setup>
  import DialtoneUsage from '@baseComponents/DialtoneUsage.vue';
</script>
