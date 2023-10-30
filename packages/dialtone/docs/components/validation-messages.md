---
title: Validation messages
status: ready
thumb: true
image: assets/images/components/validation-messages.png
description: Validation messages are used to convey information to the user about the current state of the input element. These messages can have an error, warning or success type.
storybook: https://vue.dialpad.design/?path=/story/components-validation-messages--default
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

```html
<dt-validation-messages
  id="sample--02"
  :validationMessages='[{"message":"Positive validation message","type":"success"}]'
/>
```

### Critical / Error

<code-well-header>
  <dt-validation-messages
    id="sample--03"
    :validationMessages='[{"message":"Critical validation message","type":"error"}]'
  />
</code-well-header>

```html
<dt-validation-messages
  id="sample--03"
  :validationMessages='[{"message":"Critical validation message","type":"error"}]'
/>
```

### Warning

<code-well-header>
  <dt-validation-messages
    id="sample--04"
    :validationMessages='[{"message":"Critical validation message","type":"warning"}]'
  />
</code-well-header>

```html
<dt-validation-messages
  id="sample--04"
  :validationMessages='[{"message":"Critical validation message","type":"warning"}]'
/>
```

## Vue API

<component-vue-api component-name="validationmessages" />
