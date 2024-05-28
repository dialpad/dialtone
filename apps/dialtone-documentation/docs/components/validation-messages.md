---
title: Validation messages
status: ready
thumb: true
image: assets/images/components/validation-messages.png
description: Validation messages are used to convey information to the user about the current state of the input element. These messages can have an error, warning or success type.
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-validation-messages--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=11399%3A76354&t=LqzEvQfr3DMHh7Og-11
---

<code-well-header>
  <dt-validation-messages
    id="sample--01"
    :validationMessages='[{"message":"Positive validation message","type":"success"}]'
  />
</code-well-header>

## Variants

### Success / Positive

<code-well-header>
  <dt-validation-messages
    id="sample--02"
    :validationMessages='[{"message":"Positive validation message","type":"success"}]'
  />
</code-well-header>

<code-example-tabs
htmlCode='
<div class="base-input__messages d-validation-message__container">
  <div role="status" aria-live="polite" class="base-input__message d-validation-message base-input__message--success d-validation-message--success">
    <p>Positive validation message</p>
  </div>
</div>
'
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
    id="sample--03"
    :validationMessages='[{"message":"Critical validation message","type":"error"}]'
  />
</code-well-header>

<code-example-tabs
htmlCode='
<div class="base-input__messages d-validation-message__container">
  <div role="status" aria-live="polite" class="base-input__message d-validation-message base-input__message--error d-validation-message--error">
    <p>Critical validation message</p>
  </div>
</div>
'
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
    id="sample--04"
    :validationMessages='[{"message":"Critical validation message","type":"warning"}]'
  />
</code-well-header>

<code-example-tabs
htmlCode='
<div class="base-input__messages d-validation-message__container">
  <div role="status" aria-live="polite" class="base-input__message d-validation-message base-input__message--warning d-validation-message--warning">
    <p>Critical validation message</p>
  </div>
</div>
'
vueCode='
<dt-validation-messages
  id="sample--04"
  :validationMessages=`[{"message":"Critical validation message","type":"warning"}]`
/>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="validationmessages" />
