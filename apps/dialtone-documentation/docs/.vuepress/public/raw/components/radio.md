# Radio

A radio is an input control that allows users to select only one option from a number of choices.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-radio--default
- **Keywords**: radio button, option, form field, d-radio, DtRadio, dt-radio, option selector

## Usage

Radio buttons are a common way to allow users to make a single selection from a list of options. Since only one radio button can be selected at a time (within the same group), each available choice must be its own item and label. Upon selection of a radio item in a group, the group cannot be easily reset to zero selections.

**Do:**

- When users may only choose a single option out of a set of mutually exclusive choices.
- If the number of available options can fit onto a mobile screen.
- In place of [Select](select-menu.md) element if there are few enough options (e.g. =7) and the design can support it.

**Don't:**

- Consider [Checkbox](checkbox.md) if users may have the option to select more than one.
- Consider a [Select](select-menu.md) if you don’t have enough space to list out all available options.
- If users should be able to select zero of the options; radio elements are not “uncheckable.” A [Checkbox](checkbox.md) may be warranted.
- If there are too many options to display on a single view; consider a [Select](select-menu.md) instead.

### Best Practices

- Users should be able to tap on or click either the text `label` or the radio element itself to select an option.
- Options that are listed vertically are easier to read than those listed horizontally. Horizontal listings can make it difficult to tell which label pertains to which radio button.
- Make sure selections are adequately spaced for touch screens.
- Use caution if you decide to set a default value as they cannot be unchecked. Setting a default value can discourage users from making conscious decisions, seem pushy, or alienate users who don’t fit into your assumptions. If you are unsure, leave nothing selected by default.

## Variants and Examples

### Base Styles

```vue
<dt-radio name="Value" value="Value" label="Radio label"/>
<dt-radio name="Disabled" value="Disabled" label="Radio label thats been disabled" disabled/>
<dt-radio name="CheckedDisabled" value="Checked" label="Radio label thats been disabled & checked" :model-value="true" disabled />
```

### With Description Text

```vue
<dt-radio name="ValueWDesc" value="Value" label="To voicemail" description="So they can hear your voice"/>
<dt-radio name="DisabledWDesc" value="Disabled" label="Disabled" description="With Description" disabled />
```

### With Validation States

```vue
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
```

### With Slotted Label

```vue
<dt-radio
  name="ValueWSlot"
  value="Value"
>
  With Slotted Label
</dt-radio>
```

### With Slotted Description

```vue
<dt-radio
  name="ValueWSlottedDescription"
  value="Value"
  label="With"
>
  <template #description>
    Slotted Description
  </template>
</dt-radio>
```

## Classes

| Class | Applies to | Description |
| --- | --- | --- |
| `d-radio-group` | N/A | Radio's parent wrapper. |
| `d-radio__input` | N/A | Wraps radio's input. |
| `d-radio` | N/A | Styles radio's input. |
| `d-radio__copy` | N/A | Wraps radio's label. |
| `d-radio__label` | N/A | Styles radio's label. |
| `d-radio-group--disabled` | .d-radio-group | Styles radio group in a disabled state. |
| `d-radio--error` | .d-radio | Styles radio's input in an error state. |
| `d-radio--success` | .d-radio | Styles radio's input in a success state. |
| `d-radio--warning` | .d-radio | Styles radio's input in a warning state. |
| `d-validation-message` | N/A | Applies base styles to radio's validation message. |
| `d-validation-message--error` | .d-validation-message | Styles radio's validation message in an error state. |
| `d-validation-message--success` | .d-validation-message | Styles radio's validation message in a success state. |
| `d-validation-message--warning` | .d-validation-message | Styles radio's validation message in a warning state. |

## Accessibility

The best accessibility is semantic HTML. Most screen readers understand how to parse inputs if they’re correctly formatted. When it comes to radio input, there are a few things to keep in mind:

- All inputs should have an `id` attribute.
- Associate radio labels with their inputs using the `for` attribute. This correlates with the radio's `id`.
- If you have a group of related radios, use a `fieldset` to group them and a `legend` to title the group. For further information, please visit Gov.UK’s article, ["Using the fieldset and legend elements"](https://accessibility.blog.gov.uk/2016/07/22/using-the-fieldset-and-legend-elements).
- If the input is a required field, use the `aria-required` property and use the validation message for input errors.
- Input with validation errors should have `aria-describedby` with the `id` of the validation message.
- Input with validation errors should have `aria-describedby` with the `id` of the validation message.

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `label` | A provided label for the input | `string` | `''` |
| `name` | The name of the input | `string` | `''` |
| `value` | A provided value for the radio | `string\|number` | `''` |
| `description` | Describes the input | `string` | `''` |
| `disabled` | Disables the input | `boolean` | `false` |
| `validationState` | The validation state of the input | `string` | `''` |
| `inputClass` | Used to customize the input element | `string\|array\|object` | `''` |
| `labelClass` | Used to customize the label container | `string\|array\|object` | `''` |
| `descriptionClass` | Used to customize the description container | `string\|array\|object` | `''` |
| `labelChildProps` | A set of props that are passed into the label container | `object` | `{}` |
| `descriptionChildProps` | A set of props that are passed into the description container | `object` | `{}` |
| `rootClass` | Additional class name for the root element. Can accept all of: String, Object, and Array, i.e. has the same api as Vue's built-in handling of the class attribute. | `string\|object\|array` | `''` |
| `v-model` | Used to set the checked state of the checkable input | `boolean` | `false` |
| `indeterminate` | Indeterminate State, toggling indeterminate checkbox will uncheck | `boolean` | `false` |
| `messagesClass` | Used to customize the validation messages component | `string\|array\|object` | `''` |
| `messagesChildProps` | A set of props that are passed into the validation messages component | `object` | `{}` |
| `showMessages` | Used to hide / show the validation messages | `boolean` | `true` |
| `messages` | Validation messages | `array` | `[]` |

### Slots

| Name | Description |
| --- | --- |
| `default` | slot for Radio Label |
| `description` | slot for Radio Description |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `input` | Native input event | `String \| Number` |
| `update:modelValue` | Event fired to sync the modelValue prop with the parent component | `String \| Number` |
| `focus` | Native input focus event | `FocusEvent` |
| `focusin` | Native input focusin event | `undefined` |
| `focusout` | Native input focusout event | `undefined` |
