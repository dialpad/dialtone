---
title: Input
description: An input field is an input control that allows users to enter alphanumeric information. It can have a range of options and supports single line and multi-line lengths, as well as varying formats, including numbers, masked passwords, etc.
status: ready
thumb: true
image: assets/images/components/input.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-input--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8923%3A21866&viewport=-983%2C83%2C0.16&t=xHutRjwo1o5zMTgT-11
---

<code-well-header>
  <div class="d-w100p">
    <dt-input label="Label" placeholder="Placeholder" />
  </div>
</code-well-header>

<!-- <component-combinator component-name="DtInput" /> -->

## Usage

This component combines both the `input` and `textarea` elements as options within a single component. Its default presentation includes a paired text `label`.

<dialtone-usage>
<template #do>

- If you can’t reasonably predict a user’s answer to a prompt and there might be wide variability in users’ answers.
- When using another type of input will make answering more difficult. For example, birthdays and other known dates are easier to type in than they are to select from a calendar picker.
- When users want to be able to paste in a response.
</template>

<template #dont>

- When users are choosing from a specific set of options. Consider [Select](select-menu.md), [Radio](radio.md), or [Checkbox](checkbox.md).
</template>

</dialtone-usage>

### Best practices

- The length of the text input provides a hint to users as to how much text to enter.
- Only show error validation messages or stylings after a user has interacted with a particular field.
- Do not use placeholder text (i.e. `placeholder` attribute) in place of an accessible `label`.
- Consider the type of content a user may enter to aid mobile device entry; mobile devices typically surface a keyboard UI attuned to the type. For example, type="tel" will surface a [phone keyboard](http://html5doctor.com/html5-forms-input-types/#input-tel).

## Variants and examples

### Base Styles

An input is normally paired with a label, but there are times when it can be used without a label.  Placeholder text should primarily be used as a content prompt and only provided when needed.

<code-well-header>
  <div class="d-stack16 d-w100p">
    <dt-input label="Label" placeholder="Placeholder" />
    <dt-input label="Label" value="Value" />
    <dt-input label="Label" placeholder="Placeholder" disabled />
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <label class="d-label" for="Dialtone--InputExample1a">...</label>
  <input class="d-input" id="Dialtone--InputExample1a" type="text" placeholder="..." />
</div>
<div>
  <label class="d-label" for="Dialtone--InputExample1c">Label</label>
  <input class="d-input" id="Dialtone--InputExample1c" type="text" value="Value" />
</div>
<div>
  <label class="d-label" for="Dialtone--InputExample1b">...</label>
  <input class="d-input" id="Dialtone--InputExample1b" type="text" placeholder="..." disabled />
</div>
'
vueCode='
<dt-input label="Label" placeholder="Placeholder" />
<dt-input label="Label" value="Value" />
<dt-input label="Label" placeholder="Placeholder" disabled />
'
showHtmlWarning />

<code-well-header>
  <div class="d-stack16 d-w100p">
    <dt-input label="Label" placeholder="Placeholder" type="textarea" />
    <dt-input label="Label" type="textarea" value="Value" />
    <dt-input label="Label" placeholder="Placeholder" type="textarea" disabled />
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <label class="d-label" for="Dialtone--TextareaExample1a">...</label>
  <textarea class="d-textarea" id="Dialtone--TextareaExample1a" type="text" placeholder="..."></textarea>
</div>
<div>
  <label class="d-label" for="Dialtone--TextareaExample1c">Label</label>
  <textarea class="d-textarea" id="Dialtone--TextareaExample1c" type="text">Value</textarea>
</div>
<div>
  <label class="d-label" for="Dialtone--TextareaExample1b">...</label>
  <textarea class="d-textarea" id="Dialtone--TextareaExample1b" type="text" placeholder="..." disabled></textarea>
</div>
'
vueCode='
<dt-input label="Label" placeholder="Placeholder" type="textarea" />
<dt-input label="Label" type="textarea" value="Value" />
<dt-input label="Label" placeholder="Placeholder" type="textarea" disabled />
'
showHtmlWarning />

### With Description Text

<code-well-header>
  <div class="d-w100p">
    <dt-input label="Label" description="Helpful description text" placeholder="Placeholder"/>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<label class="d-label" for="Dialtone--InputExample2">...</label>
<span class="d-description">...</span>
<input class="d-input" id="Dialtone--InputExample2" type="text" placeholder="..." />
'
vueCode='
<dt-input label="Label" description="Helpful description text" placeholder="Placeholder"/>
'
showHtmlWarning />

<code-well-header>
  <div class="d-w100p">
    <dt-input label="Label" description="Helpful description text" type="textarea" placeholder="Placeholder"/>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<label class="d-label" for="Dialtone--TextareaExample">...</label>
<span class="d-description">...</span>
<textarea class="d-textarea" id="Dialtone--TextareaExample" type="text" placeholder="..."></textarea>
'
vueCode='
<dt-input label="Label" description="Helpful description text" type="textarea" placeholder="Placeholder"/>
'
showHtmlWarning />

### With validation states

Provides feedback to the user based on their interaction, or lack thereof, with an input.

<code-well-header>
  <div class="d-stack16 d-w100p">
    <dt-input label="Label" type="email" value="Value" :messages="[messages.error]"/>
    <dt-input label="Label" type="email" value="Value" :messages="[messages.success]"/>
    <dt-input label="Label" type="email" value="Value" :messages="[messages.warning]"/>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <label class="d-label" for="Dialtone--InputExample3">...</label>
  <input class="d-input d-input--error" id="Dialtone--InputExample3" type="email" placeholder="..." value="..." />
  <span class="d-validation-message d-validation-message--error">...</span>
</div>
<div>
  <label class="d-label" for="Dialtone--InputExample4">...</label>
  <input class="d-input d-input--success" id="Dialtone--InputExample4" type="email" placeholder="..." value="..." />
  <span class="d-validation-message d-validation-message--success">...</span>
</div>
<div>
  <label class="d-label" for="Dialtone--InputExample5">...</label>
  <input class="d-input d-input--warning" id="Dialtone--InputExample5" type="email" placeholder="..." value="..." />
  <span class="d-validation-message d-validation-message--warning">...</span>
</div>
'
vueCode='
<dt-input label="Label" type="email" value="Value" :messages="[messages.error]"/>
<dt-input label="Label" type="email" value="Value" :messages="[messages.success]"/>
<dt-input label="Label" type="email" value="Value" :messages="[messages.warning]"/>
'
showHtmlWarning />

<code-well-header>
  <div class="d-stack16 d-w100p">
    <dt-input label="Label" type="textarea" value="Value" :messages="[messages.error]"/>
    <dt-input label="Label" type="textarea" value="Value" :messages="[messages.success]"/>
    <dt-input label="Label" type="textarea" value="Value" :messages="[messages.warning]"/>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <label class="d-label" for="Dialtone--TextareaExample3">...</label>
  <textarea class="d-textarea d-textarea--error" id="Dialtone--TextareaExample3" type="email" placeholder="..." value="..."></textarea>
  <span class="d-validation-message d-validation-message--error">...</span>
</div>
<div>
  <label class="d-label" for="Dialtone--TextareaExample4">...</label>
  <textarea class="d-textarea d-textarea--success" id="Dialtone--TextareaExample4" type="email" placeholder="..." value="..."></textarea>
  <span class="d-validation-message d-validation-message--success">...</span>
</div>
<div>
  <label class="d-label" for="Dialtone--TextareaExample5">...</label>
  <textarea class="d-textarea d-textarea--warning" id="Dialtone--TextareaExample5" type="email" placeholder="..." value="..."></textarea>
  <span class="d-validation-message d-validation-message--warning">...</span>
</div>
'
vueCode='
<dt-input label="Label" type="textarea" value="Value" :messages="[messages.error]"/>
<dt-input label="Label" type="textarea" value="Value" :messages="[messages.success]"/>
<dt-input label="Label" type="textarea" value="Value" :messages="[messages.warning]"/>
'
showHtmlWarning />

### With multiple validation messages

<code-well-header>
  <div class="d-w100p">
    <dt-input ref="multipleMessages" label="Label" type="email" value="Value" :messages="multipleMessages" />
  </div>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.multipleMessages'
vueCode='
<dt-input label="Label" type="email" value="Value" :messages="multipleMessages" />
'
/>

### With maximum length validation

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

<code-well-header>
  <div class="d-w100p">
    <dt-input
      v-model="inputValue"
      ref="maxLength"
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
  </div>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.maxLength'
vueCode='
<dt-input
  label="Label"
  placeholder="placeholder"
  :validate="{
    length: {
      description: `Max 25 characters.`,
      message: `Max 25 characters allowed.`,
      max: 25,
      warn: 15,
      limitMaxLength: false,
    }
  }"
/>
'
/>

### With custom maximum length validation message

<code-well-header>
  <div class="d-w100p">
    <dt-input
      v-model="inputValue"
      label="Label"
      placeholder="placeholder"
      :validate="validate()"
    />
  </div>
</code-well-header>

<code-example-tabs
vueCode='
<dt-input
  label="Label"
  placeholder="placeholder"
  :validate="validate()"
  v-model="inputValue"
/>
'
/>

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

### With icons

<code-well-header>
  <div class="d-stack16 d-w100p">
    <dt-input label="Left icon" type="text" placeholder="Placeholder">
      <template #leftIcon="{ iconSize }">
        <dt-icon name="send" :size="iconSize" />
      </template>
    </dt-input>
    <dt-input label="Right icon" type="text" placeholder="Placeholder">
      <template #rightIcon="{ iconSize }">
        <dt-icon name="lock" :size="iconSize" />
      </template>
    </dt-input>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <label class="d-label" for="Dialtone--InputExample--IconLeft">Label</label>
  <div class="d-input__wrapper">
    <span class="d-input-icon d-input-icon--left">
      <svg class="d-icon d-icon--size-200">...</svg>
    </span>
    <input class="d-input" id="Dialtone--InputExample--IconLeft" type="text" placeholder="Placeholder" />
  </div>
</div>
<div>
  <label class="d-label" for="Dialtone--InputExample--IconRight">Label</label>
  <div class="d-input__wrapper">
    <input class="d-input" id="Dialtone--InputExample--IconRight" type="text" placeholder="Placeholder" />
    <span class="d-input-icon d-input-icon--right">
      <svg class="d-icon d-icon--size-200">...</svg>
    </span>
  </div>
</div>
'
vueCode='
<dt-input label="Left icon" type="text" placeholder="Placeholder">
  <template #leftIcon="{ iconSize }">
    <dt-icon name="send" :size="iconSize" />
  </template>
</dt-input>
<dt-input label="Right icon" type="text" placeholder="Placeholder">
  <template #rightIcon="{ iconSize }">
    <dt-icon name="lock" :size="iconSize" />
  </template>
</dt-input>
'
showHtmlWarning />

<code-well-header>
  <div class="d-stack16 d-w100p">
    <dt-input label="Left icon" type="textarea" placeholder="Placeholder">
      <template #leftIcon="{ iconSize }">
        <dt-icon name="send" :size="iconSize" />
      </template>
    </dt-input>
    <dt-input label="Right icon" type="textarea" placeholder="Placeholder">
      <template #rightIcon="{ iconSize }">
        <dt-icon name="lock" :size="iconSize" />
      </template>
    </dt-input>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <label class="d-label" for="Dialtone--InputExample--IconLeft">...</label>
  <div class="d-input__wrapper">
    <span class="d-input-icon d-input-icon--left">
      <svg class="d-icon d-icon--size-200">...</svg>
    </span>
    <textarea class="d-textarea" id="Dialtone--InputExample--IconLeft" type="text" placeholder="..."></textarea>
  </div>
</div>
'
vueCode='
<dt-input label="Left icon" type="textarea" placeholder="Placeholder">
  <template #leftIcon="{ iconSize }">
    <dt-icon name="send" :size="iconSize" />
  </template>
</dt-input>
<dt-input label="Right icon" type="textarea" placeholder="Placeholder">
  <template #rightIcon="{ iconSize }">
    <dt-icon name="lock" :size="iconSize" />
  </template>
</dt-input>
'
showHtmlWarning />

### Search input

<dt-notice
  kind="warning"
  :hide-close="true"
  class="d-wmx100p d-mb24"
>
  <template #default>
  Note: The usage of <code>type="search"</code> is not recommended for this component as it may cause unintended styling issues in Chrome. Instead, refer to the provided example code if you need to implement a search input.
  </template>
</dt-notice>

In this example we show a search input with a clear button on the right side. The clear button is a button with a close icon that clears the input field when clicked. The clear button is only visible when the input field is not empty.

<code-well-header>
  <div class="d-w100p">
    <dt-input
      aria-label="Search items"
      placeholder="Search Items"
      type="text"
      v-model="inputValue"
    >
      <template #leftIcon="{ iconSize }">
        <dt-icon name="search" :size="iconSize" />
      </template>
      <template v-if="inputValue.length !== 0" #rightIcon="{ clear }">
        <dt-button
          kind="muted"
          importance="clear"
          size="xs"
          circle
          aria-label="Clear search"
          @click="clear"
        >
        <template #icon="{ iconSize }">
            <dt-icon name="close" :size="iconSize" />
          </template>
        </dt-button>
      </template>
    </dt-input>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-input__wrapper">
  <span class="base-input__icon--left d-input-icon--left d-input-icon">...</span>
  <input type="text" autocomplete="off" class="base-input__input d-input d-input-icon--left d-input-icon--right" placeholder="Search Items">
  <span class="base-input__icon--right d-input-icon--right d-input-icon undefined" data-qa="dt-input-right-icon-wrapper">
    <button class="base-button__button d-btn d-btn--muted d-btn--xs d-btn--circle d-btn--icon-only" data-qa="dt-button" type="button" aria-label="Clear search">
      <span class="base-button__icon d-btn__icon d-btn__icon--left">...</span>
    </button>
  </span>
</div>
'
vueCode='
<dt-input
  aria-label="Search items"
  placeholder="Search Items"
  type="text"
  v-model="inputValue"
>
  <template #leftIcon="{ iconSize }">
    <dt-icon name="search" :size="iconSize" />
  </template>
  <template v-if="inputValue.length !== 0" #rightIcon="{ clear }">
    <dt-button
      kind="muted"
      importance="clear"
      size="xs"
      circle
      aria-label="Clear search"
      @click="clear"
    >
      <template #icon="{ iconSize }">
        <dt-icon name="close" :size="iconSize" />
      </template>
    </dt-button>
  </template>
</dt-input>
'
showHtmlWarning />

### Input sizes

We offer different sizes for instances in which the interface requires a smaller or larger input. In general, though, use the base (medium) size input as much as possible, especially in forms.

<code-well-header>
  <div class="d-stack16 d-w100p">
    <dt-input label="Extra Small" type="text" placeholder="Placeholder" size="xs" />
    <dt-input label="Small" type="text" placeholder="Placeholder" size="sm" />
    <dt-input label="Medium" type="text" placeholder="Placeholder" size="md" />
    <dt-input label="Large" type="text" placeholder="Placeholder" size="lg" />
    <dt-input label="Extra large" type="text" placeholder="Placeholder" size="xl" />
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <label>
    <div class="d-label d-label--xs">Extra small</div>
    <div class="d-input__wrapper">
      <input type="text" class="d-input d-input--xs" placeholder="Placeholder">
    </div>
  </label>
</div>
<div>
  <label>
    <div class="d-label d-label--sm">Small</div>
    <div class="d-input__wrapper">
      <input type="text" class="d-input d-input--sm" placeholder="Placeholder">
    </div>
  </label>
</div>
<div>
  <label>
    <div class="d-label d-label--md">Medium</div>
    <div class="d-input__wrapper">
      <input type="text" class="d-input" placeholder="Placeholder">
    </div>
  </label>
</div>
<div>
  <label>
    <div class="d-label d-label--lg">Large</div>
    <div class="d-input__wrapper">
      <input type="text" class="d-input d-input--lg" placeholder="Placeholder">
    </div>
  </label>
</div>
<div>
  <label>
    <div class="d-label d-label--xl">Extra large</div>
    <div class="d-input__wrapper">
      <input type="text" class="d-input d-input--xl" placeholder="Placeholder">
    </div>
  </label>
</div>
'
vueCode='
<dt-input label="Extra Small" type="text" placeholder="Placeholder" size="xs" />
<dt-input label="Small" type="text" placeholder="Placeholder" size="sm" />
<dt-input label="Medium" type="text" placeholder="Placeholder" size="md" />
<dt-input label="Large" type="text" placeholder="Placeholder" size="lg" />
<dt-input label="Extra large" type="text" placeholder="Placeholder" size="xl" />
'
showHtmlWarning />

<code-well-header>
  <div class="d-stack16 d-w100p">
    <dt-input label="Extra Small" type="textarea" placeholder="Placeholder" size="xs" />
    <dt-input label="Small" type="textarea" placeholder="Placeholder" size="sm" />
    <dt-input label="Medium" type="textarea" placeholder="Placeholder" size="md" />
    <dt-input label="Large" type="textarea" placeholder="Placeholder" size="lg" />
    <dt-input label="Extra large" type="textarea" placeholder="Placeholder" size="xl" />
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <label>
    <div class="d-label d-label--xs">Extra small</div>
    <div class="d-input__wrapper">
      <textarea class="d-textarea d-textarea--xs" placeholder="Placeholder" />
    </div>
  </label>
</div>
<div>
  <label>
    <div class="d-label d-label--sm">Small</div>
    <div class="d-input__wrapper">
      <textarea class="d-textarea d-textarea--sm" placeholder="Placeholder" />
    </div>
  </label>
</div>
<div>
  <label>
    <div class="d-label d-label--md">Medium</div>
    <div class="d-input__wrapper">
      <textarea class="d-textarea" placeholder="Placeholder" />
    </div>
  </label>
</div>
<div>
  <label>
    <div class="d-label d-label--lg">Large</div>
    <div class="d-input__wrapper">
      <textarea class="d-textarea d-textarea--lg" placeholder="Placeholder" />
    </div>
  </label>
</div>
<div>
  <label>
    <div class="d-label d-label--xl">Extra large</div>
    <div class="d-input__wrapper">
      <textarea class="d-textarea d-textarea--xl" placeholder="Placeholder" />
    </div>
  </label>
</div>
'
vueCode='
<dt-input label="Extra Small" type="textarea" placeholder="Placeholder" size="xs" />
<dt-input label="Small" type="textarea" placeholder="Placeholder" size="sm" />
<dt-input label="Medium" type="textarea" placeholder="Placeholder" size="md" />
<dt-input label="Large" type="textarea" placeholder="Placeholder" size="lg" />
<dt-input label="Extra large" type="textarea" placeholder="Placeholder" size="xl" />
'
showHtmlWarning />

### Icon Sizes

You may use different icon sizes in different sized inputs

<code-well-header>
  <div class="d-stack16 d-w100p">
    <dt-input label="Small input with large icon" type="text" placeholder="Placeholder" size="sm">
      <template #leftIcon>
        <dt-icon name="send" size="400" />
      </template>
    </dt-input>
    <dt-input label="Medium input with extra large icon" type="text" placeholder="Placeholder">
      <template #leftIcon>
        <dt-icon name="send" size="500" />
      </template>
    </dt-input>
    <dt-input label="Extra large input with medium icon" type="text" placeholder="Placeholder" size="xl">
      <template #leftIcon>
        <dt-icon name="send" size="200" />
      </template>
    </dt-input>
    <dt-input label="Large textarea with medium icon" type="textarea" placeholder="Placeholder" icon-size="md" size="lg">
      <template #leftIcon>
        <dt-icon name="send" size="200" />
      </template>
    </dt-input>
  </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <div>
    <label class="d-label" for="Dialtone--InputExample--IconLeft">Input:sm Icon:lg</label>
  </div>
  <div class="d-input__wrapper">
    <span class="d-input-icon d-input-icon--left">
      <svg class="d-icon d-icon--size-400">...</svg>
    </span>
    <input class="d-input d-input--sm" id="Dialtone--InputExample--IconLeft-sm-lg" type="text" placeholder="Placeholder" />
  </div>
</div>
<div>
  <div>
    <label class="d-label" for="Dialtone--InputExample--IconLeft">Input:md(default), Icon:xl</label>
  </div>
  <div class="d-input__wrapper">
    <span class="d-input-icon d-input-icon--left">
      <svg class="d-icon d-icon--size-500">...</svg>
    </span>
    <input class="d-input" id="Dialtone--InputExample--IconLeft-md-xl" type="text" placeholder="Placeholder" />
  </div>
</div>
<div>
  <div>
    <label class="d-label" for="Dialtone--InputExample--IconLeft">Input:xl Icon:md(default)</label>
  </div>
  <div class="d-input__wrapper">
    <span class="d-input-icon d-input-icon--left">
      <svg class="d-icon d-icon--size-200">...</svg>
    </span>
    <input class="d-input d-input--xl" id="Dialtone--InputExample--IconLeft-xl-md" type="text" placeholder="Placeholder" />
  </div>
</div>
<div>
  <div>
    <label class="d-label" for="Dialtone--InputExample--IconLeft">Textarea:lg Icon:md(default)</label>
  </div>
  <div class="d-input__wrapper">
    <span class="d-input-icon d-input-icon--left">
      <svg class="d-icon d-icon--size-200">...</svg>
    </span>
    <textarea class="d-textarea d-textarea--lg" id="Dialtone--TextareaExample--IconLeft-lg-md" type="text" placeholder="Placeholder"></textarea>
  </div>
</div>
'
vueCode='
<dt-input label="Small input with large icon" type="text" placeholder="Placeholder" size="sm">
  <template #leftIcon>
    <dt-icon name="send" size="400" />
  </template>
</dt-input>
<dt-input label="Medium input with extra large icon" type="text" placeholder="Placeholder">
  <template #leftIcon>
    <dt-icon name="send" size="500" />
  </template>
</dt-input>
<dt-input label="Extra large input with medium icon" type="text" placeholder="Placeholder" size="xl">
  <template #leftIcon>
    <dt-icon name="send" size="200" />
  </template>
</dt-input>
<dt-input label="Large textarea with medium icon" type="textarea" placeholder="Placeholder" size="lg">
  <template #leftIcon>
    <dt-icon name="send" size="200" />
  </template>
</dt-input>
'
showHtmlWarning />

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
