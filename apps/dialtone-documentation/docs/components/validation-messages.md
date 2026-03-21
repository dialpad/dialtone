---
title: Validation messages
status: ready
thumb: true
image: assets/images/components/validation-messages.png
description: Validation messages are used to convey information to the user about the current state of the input element. These messages can have an error, warning or success type.
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-validation-messages--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=11399-76353
keywords: ["error message", "form validation", "field error", "d-validation-messages", "DtValidationMessages", "dt-validation-messages", "inline validation", "form errors"]
---

<!-- <code-well-header>
  <dt-validation-messages
    id="sample--01"
    :validationMessages='[{"message":"Positive validation message","type":"success"}]'
  />
</code-well-header> -->

<component-combinator component-name="DtValidationMessages" />

## Usage

Validation messages are typically paired with an input element. They are currently built in to some of our shared input components such as `dt-input` and `dt-radio-group`.

## Variants

### Success / Positive

<code-well-header>
  <dt-validation-messages
    ref="successExample"
    id="sample--02"
    :validationMessages='[{"message":"Positive validation message","type":"success"}]'
  />
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.successExample'
vueCode='
<dt-validation-messages
  id="sample--02"
  :validationMessages=`[{"message":"Positive validation message","type":"success"}]`
/>
'
showHtmlWarning />

### Critical / Error

<code-well-header>
  <dt-validation-messages
    ref="errorExample"
    id="sample--03"
    :validationMessages='[{"message":"Critical validation message","type":"error"}]'
  />
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.errorExample'
vueCode='
<dt-validation-messages
  id="sample--03"
  :validationMessages=`[{"message":"Critical validation message","type":"error"}]`
/>
'
showHtmlWarning />

### Warning

<code-well-header>
  <dt-validation-messages
    ref="warningExample"
    id="sample--04"
    :validationMessages='[{"message":"Warning validation message","type":"warning"}]'
  />
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.warningExample'
vueCode='
<dt-validation-messages
  id="sample--04"
  :validationMessages=`[{"message":"Warning validation message","type":"warning"}]`
/>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="validationmessages" />
