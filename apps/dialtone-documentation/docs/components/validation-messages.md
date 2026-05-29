---
title: Validation messages
status: ready
thumb: true
description: Validation messages are used to convey information to the user about the current state of the input element. These messages can have a critical, warning, positive, or info type.
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-validation-messages--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=11399-76353
keywords: ["error message", "form validation", "field error", "d-validation-messages", "DtValidationMessages", "dt-validation-messages", "inline validation", "form errors"]
---

<component-combinator component-name="DtValidationMessages" />

## Usage

Validation messages are typically paired with an input element. They are currently built in to some of our shared input components such as `dt-input` and `dt-radio-group`.

## Variants

### Positive

```vue demo
<dt-validation-messages
  id="sample--02"
  :validationMessages='[{"message":"Positive validation message","type":"positive"}]'
/>
```

### Critical

```vue demo
<dt-validation-messages
  id="sample--03"
  :validationMessages='[{"message":"Critical validation message","type":"critical"}]'
/>
```

### Warning

```vue demo
<dt-validation-messages
  id="sample--04"
  :validationMessages='[{"message":"Warning validation message","type":"warning"}]'
/>
```

### Info

```vue demo
<dt-validation-messages
  id="sample--05"
  :validationMessages='[{"message":"Info validation message","type":"info"}]'
/>
```

## Vue API

<component-vue-api component-name="validationmessages" />
