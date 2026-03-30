---
title: Input
description: An input field is an input control that allows users to enter alphanumeric information. It can have a range of options and supports single line and multi-line lengths, as well as varying formats, including numbers, masked passwords, etc.
status: ready
thumb: true
image: assets/images/components/input.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-input--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=25665-5366
keywords: ["text field", "form field", "textbox", "d-input", "DtInput", "dt-input", "text input", "form input"]
---

<component-combinator component-name="DtInput" />

## Usage

This component combines both the `input` and `textarea` elements as options within a single component. Its default presentation includes a paired text `label`.

<dialtone-usage>
<template #do>

- If you can't reasonably predict a user's answer to a prompt and there might be wide variability in users' answers.
- When using another type of input will make answering more difficult. For example, birthdays and other known dates are easier to type in than they are to select from a calendar picker.
- When users want to be able to paste in a response.
</template>

<template #dont>

- When users are choosing from a specific set of options. Consider [Select](select-menu.md), [Radio](radio.md), or [Checkbox](checkbox.md).
</template>

</dialtone-usage>

### Best Practices

- The length of the text input provides a hint to users as to how much text to enter.
- Only show error validation messages or stylings after a user has interacted with a particular field.
- Do not use placeholder text (i.e. `placeholder` attribute) in place of an accessible `label`.
- Consider the type of content a user may enter to aid mobile device entry; mobile devices typically surface a keyboard UI attuned to the type. For example, type="tel" will surface a [phone keyboard](http://html5doctor.com/html5-forms-input-types/#input-tel).

## Sizes

We offer different sizes for instances in which the interface requires a smaller or larger input. In general, though, use the base `300` (medium) size input as much as possible, especially in forms.

<code-example>
  <div class="d-d-grid d-g-200 d-g-cols2" data-demo-wrapper>
    <dt-input :size="100" type="text" label="Extra Small" placeholder="Placeholder" />
    <dt-input :size="100" type="textarea" label="Extra Small" placeholder="Placeholder" />
    <dt-input :size="200" type="text" label="Small" placeholder="Placeholder" />
    <dt-input :size="200" type="textarea" label="Small" placeholder="Placeholder" />
    <dt-input :size="300" type="text" label="Medium" placeholder="Placeholder" />
    <dt-input :size="300" type="textarea" label="Medium" placeholder="Placeholder" />
    <dt-input :size="400" type="text" label="Large" placeholder="Placeholder" />
    <dt-input :size="400" type="textarea" label="Large" placeholder="Placeholder" />
    <dt-input :size="500" type="text" label="Extra large" placeholder="Placeholder" />
    <dt-input :size="500" type="textarea" label="Extra large" placeholder="Placeholder" />
  </div>
</code-example>

## Examples

### Base Styles

An input is normally paired with a label, but there are times when it can be used without a label.  Placeholder text should primarily be used as a content prompt and only provided when needed.

<code-example>
  <div class="d-d-grid d-g-200 d-g-cols3" data-demo-wrapper>
    <dt-input label="Label" placeholder="Placeholder" />
    <dt-input label="Label" model-value="Value" />
    <dt-input label="Label" placeholder="Placeholder" disabled />
    <dt-input label="Label" placeholder="Placeholder" type="textarea" />
    <dt-input label="Label" type="textarea" model-value="Value" />
    <dt-input label="Label" placeholder="Placeholder" type="textarea" disabled />
  </div>
</code-example>

### With Description Text

<code-example>
  <div class="d-d-grid d-g-200 d-g-cols2" data-demo-wrapper>
    <dt-input label="Label" description="Helpful description text" placeholder="Placeholder"/>
    <dt-input label="Label" description="Helpful description text" type="textarea" placeholder="Placeholder"/>
  </div>
</code-example>

### With Validation States

Provides feedback to the user based on their interaction, or lack thereof, with an input.

<code-example>
  <div class="d-d-grid d-g-200 d-g-cols3" data-demo-wrapper>
    <dt-input label="Label" type="email" model-value="Value" :messages="[messages.error]"/>
    <dt-input label="Label" type="email" model-value="Value" :messages="[messages.success]"/>
    <dt-input label="Label" type="email" model-value="Value" :messages="[messages.warning]"/>
    <dt-input label="Label" type="textarea" model-value="Value" :messages="[messages.error]"/>
    <dt-input label="Label" type="textarea" model-value="Value" :messages="[messages.success]"/>
    <dt-input label="Label" type="textarea" model-value="Value" :messages="[messages.warning]"/>
  </div>
</code-example>

### With Multiple Validation Messages

<code-example>
  <dt-input label="Label" type="email" model-value="Value" :messages="multipleMessages" />
</code-example>

### With Maximum Length Validation

Adds validation for the input length. Make sure to provide the following props:

- `currentLength`: the current character length that the user has entered into the input. This must be input manually as sometimes characters do not count as 1 character. For example an emoji could take up many characters in the input, but should only count as 1 character. If you don't pass `currentLength`, the component will use a built-in length calculation.
- `validate`: should be an object with the validation rules to apply to the input. Maximum length validation is supported with the following configuration:

```js
length: {
  // describes the maximum length allowed and shown in the label
  description: string,        // Required
  // maximum length allowed to enter
  max: number,                // Required
  // message to show in the warning or error validation message
  message: string,            // Required
  // length from which the validation message will be shown as a warning,
  // when the maximum length is reached, the validation message will be shown as an error
  warn: number,               // Optional
  // set maxlength attribute, defaults to false
  limitMaxLength: boolean,    // Optional
},
```

If the input is invalid due to the validation, the validation message will be shown even when the input lost focus, otherwise the validation message will be hidden when the user unfocuses the input.

<code-example>
  <dt-input
    model-value="Value"
    label="Label"
    placeholder="placeholder"
    :validate="{
      length: {
        description: 'Max 25 characters.',
        message: 'Max 25 characters allowed.',
        max: 25,
        warn: 15,
        limitMaxLength: false,
      }
    }"
  />
</code-example>

### With Custom Maximum Length Validation Message

<code-example>
  <dt-input
    model-value="Value"
    label="Label"
    placeholder="placeholder"
    :validate="validate()"
  />
</code-example>

```js
const validateData = {
  length: {
    description: 'Max 25 characters.',
    max: 25,
    warn: 15,
    limitMaxLength: false,
  }
};

const validationMessage = () => {
  const remainingCharacters = validateData.length.max - currentLength.value.length;

  if (remainingCharacters < 0) {
    return `${Math.abs(remainingCharacters)} characters over limit`;
  } else {
    return `${remainingCharacters} characters left`;
  }
};

const validate = () => {
  return {
    length: {
      ...validateData.length,
      message: validationMessage(),
    }
  };
};
```

### Search

Use `type="search"` with a clear button in the `icon` slot. When the input is not empty, the clear button will render and will clear the input field when triggered.

<code-example>
  <dt-input
    aria-label="Search items"
    placeholder="Search Items"
    type="search"
    model-value="Search Value"
  >
    <template #startIcon="{ iconSize }">
      <dt-icon name="search" :size="iconSize" />
    </template>
    <template v-if="inputSearchValue.length !== 0" #endIcon="{ clear }">
      <dt-stack class="d-pie-25">
        <dt-button
          v-dt-tooltip="'Clear search'"
          kind="muted"
          importance="clear"
          :size="100"
          aria-label="Clear search"
          @click="clear"
        >
          <template #startIcon="{ iconSize }">
            <dt-icon name="close" :size="iconSize" />
          </template>
        </dt-button>
      </dt-stack>
    </template>
  </dt-input>
</code-example>

## Icon Support

<code-example>
  <div class="d-d-grid d-g-200 d-g-cols3" data-demo-wrapper>
    <dt-input label="Start icon" type="text" placeholder="Placeholder">
      <template #startIcon="{ iconSize }">
        <dt-icon name="send" :size="iconSize" />
      </template>
    </dt-input>
    <dt-input label="End icon" type="text" placeholder="Placeholder">
      <template #endIcon="{ iconSize }">
        <dt-icon name="lock" :size="iconSize" />
      </template>
    </dt-input>
    <dt-input label="Start and End icon" type="text" placeholder="Placeholder">
      <template #startIcon="{ iconSize }">
        <dt-icon name="send" :size="iconSize" />
      </template>
      <template #endIcon="{ iconSize }">
        <dt-icon name="lock" :size="iconSize" />
      </template>
    </dt-input>
    <dt-input label="Start icon" type="textarea" placeholder="Placeholder">
      <template #startIcon="{ iconSize }">
        <dt-icon name="send" :size="iconSize" />
      </template>
    </dt-input>
    <dt-input label="End icon" type="textarea" placeholder="Placeholder">
      <template #endIcon="{ iconSize }">
        <dt-icon name="lock" :size="iconSize" />
      </template>
    </dt-input>
    <dt-input label="Start and End icon" type="textarea" placeholder="Placeholder">
      <template #startIcon="{ iconSize }">
        <dt-icon name="send" :size="iconSize" />
      </template>
      <template #endIcon="{ iconSize }">
        <dt-icon name="lock" :size="iconSize" />
      </template>
    </dt-input>
  </div>
</code-example>

### Icon Sizes

Each Text Input size has a default icon size, keeping it proportional. While rare, customizing the icon size is possible.

<code-example>
  <dt-stack gap="500" class="d-w100p" data-demo-wrapper>
    <dt-input label="Medium input with smallest icon" type="text" placeholder="Placeholder" :size="300">
      <template #startIcon>
        <dt-icon name="box-select" size="100" />
      </template>
      <template #endIcon>
        <dt-icon name="box-select" size="100" />
      </template>
    </dt-input>
    <dt-input label="Extra large input with medium icon" type="text" placeholder="Placeholder" :size="500">
      <template #startIcon>
        <dt-icon name="box-select" size="200" />
      </template>
      <template #endIcon>
        <dt-icon name="box-select" size="200" />
      </template>
    </dt-input>
    <dt-input label="Medium textarea with large icon" type="textarea" placeholder="Placeholder" :icon-size="300" :size="400">
      <template #startIcon>
        <dt-icon name="box-select" size="500" />
      </template>
    </dt-input>
  </dt-stack>
</code-example>

## Label size

The label text size is automatically derived from the component's `size` prop. Use the `label-size` prop to override this when you need a different label size independent of the input size. For example, the default label size for a `:size="300"` input is `300`, but you can override it from `100` to `400`.

<code-example vueCode='
<dt-input label="Extra small label" placeholder="Placeholder" :label-size="100" />
'>
  <dt-stack gap="500" class="d-w100p" data-demo-wrapper>
    <dt-input label="Extra small label" placeholder="Placeholder" :label-size="100" />
    <dt-input label="Small label" placeholder="Placeholder" :label-size="200" />
    <dt-input label="Medium label (default)" placeholder="Placeholder" :label-size="300" />
    <dt-input label="Large label" placeholder="Placeholder" :label-size="400" />
  </dt-stack>
</code-example>

## Label strength

Override the label font weight independently of the label size. Valid values are `bold`, `semibold`, `medium`, and `normal`.

<code-example vueCode='
<dt-input label="Label" placeholder="Placeholder" label-strength="bold|semibold|medium|normal" />
'>
  <dt-stack gap="500" class="d-w100p" data-demo-wrapper>
    <dt-input label="Bold label" placeholder="Placeholder" label-strength="bold" />
    <dt-input label="Semibold label" placeholder="Placeholder" label-strength="semibold" />
    <dt-input label="Medium label" placeholder="Placeholder" label-strength="medium" />
    <dt-input label="Normal label" placeholder="Placeholder" label-strength="normal" />
  </dt-stack>
</code-example>

## Vue API

<component-vue-api component-name="input" />

## Classes

<component-class-table component-name="input"></component-class-table>

## Accessibility

- Make sure the `label` `for` attribute match the input `id`.
- Avoiding removing `labels`. Labelled inputs are user-friendly.
- Avoid relying on placeholder text as a substitute for a `label`.
- If the input is a required field, use the `aria-required` property and use the validation message for input errors.
- Input with validation errors should have `aria-describedby` with the `id` of the validation message.
- Placeholder text should not include critical information. Use description text for any information that helps the user successfully interact with the input.

<script setup>
import { ref } from 'vue';

const inputValue = ref('');
const inputSearchValue = ref('Some text');

const messages = {
  warning: { "message": "Warning validation message", "type": "warning" },
  error: { "message": "Error validation message", "type": "error" },
  success: { "message": "Success validation message", "type": "success" },
};

const multipleMessages = [
  { message: 'This is the first message', type: 'error' },
  { message: 'This is the second message', type: 'error' },
  { message: 'This is the third message', type: 'error' },
];

const validateData = {
  length: {
    description: 'Max 25 characters.',
    max: 25,
    warn: 15,
    limitMaxLength: false,
  }
};

const validationMessage = () => {
  const remainingCharacters = validateData.length.max - inputValue.value.length;

  if (remainingCharacters < 0) {
    return `${Math.abs(remainingCharacters)} characters over limit`;
  } else {
    return `${remainingCharacters} characters left`;
  }
};

const validate = () => {
  return {
    length: {
      ...validateData.length,
      message: validationMessage(),
    }
  };
};
</script>
