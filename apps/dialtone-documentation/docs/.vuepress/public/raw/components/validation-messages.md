# Validation messages

Validation messages are used to convey information to the user about the current state of the input element. These messages can have an error, warning or success type.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-validation-messages--default
- **Keywords**: error message, form validation, field error, d-validation-messages, DtValidationMessages, dt-validation-messages, inline validation, form errors

## Usage

Validation messages are typically paired with an input element. They are currently built in to some of our shared input components such as `dt-input` and `dt-radio-group`.

## Variants

### Success / Positive

```vue
<dt-validation-messages
  id="sample--02"
  :validationMessages=`[{"message":"Positive validation message","type":"success"}]`
/>
```

### Critical / Error

```vue
<dt-validation-messages
  id="sample--03"
  :validationMessages=`[{"message":"Critical validation message","type":"error"}]`
/>
```

### Warning

```vue
<dt-validation-messages
  id="sample--04"
  :validationMessages=`[{"message":"Warning validation message","type":"warning"}]`
/>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `id` | The id of the validation message | `string` | `(function)` |
| `validationMessages` | Array of validation messages. Each message has the following structure: `{ message: "Some informative message", type: "error\|warning\|success"}` | `array` | `[]` |
| `showMessages` | Show Validation messages | `boolean` | `true` |
