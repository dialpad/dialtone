# Checkbox

A checkbox is an input control that allows users to select zero, one, or more options from a number of choices.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-checkbox--default
- **Keywords**: tick, select, form field, d-checkbox, DtCheckbox, dt-checkbox

## Usage

Checkboxes are an easily understandable way to indicate that users can select one or more answers to a question or items from a list. They visibly show users what’s been selected and makes it easy for them to “uncheck” an option, which can be difficult with other selection methods on a form (such as radio buttons or select menus).

**Do:**

- Selecting any number of choices from a set list.
- Binary selections that convey opposite states, such as check=“on” and unchecked=“off”, paired with a label that conveys the choice.
- When users need to see all the available options at a glance.

**Don't:**

- If a user can only select one option from a list; consider using [Radio](radio.md) or [Select](select-menu.md).
- If there are too many options to reasonably display in its context.

### Best Practices

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

## Variants and Examples

### Base Styles

```vue
<!-- Default -->
<dt-checkbox
  name="default"
  value="Value"
  label="Checkbox label"
/>
<!-- Checked -->
<dt-checkbox
  name="checked"
  value="Value"
  label="Checkbox label"
  :model-value="true"
/>
<!-- Disabled -->
<dt-checkbox
  name="disabled"
  value="Value"
  label="Checkbox label"
  disabled
/>
<!-- Disabled Checked -->
<dt-checkbox
  name="disabled-checked"
  value="Value"
  label="Checkbox label"
  :model-value="true"
  disabled
/>
```

### Indeterminate

```vue
<!-- Indeterminate -->
<dt-checkbox
  name="indeterminate"
  value="Value"
  label="Indeterminate checkbox"
  indeterminate
/>
<!-- Indeterminate disabled -->
<dt-checkbox
  name="indeterminate-disabled"
  value="Value"
  label="Indeterminate checkbox disabled"
  :model-value="true"
  disabled
  indeterminate
/>
```

### Stacked Group

```vue
<dt-stack gap="400">
  <p>...</p>
  <dt-checkbox
    name="option1"
    value="Value"
    label="Anonymous callers"
  />
  <dt-checkbox
    name="option2"
    value="Value"
    label="Block callers not already in contacts list"
  />
  <dt-checkbox
    name="option3"
    value="Value"
    label="Block callers with a high spam score"
  />
</dt-stack>
```

### With Description Text

```vue
<dt-stack gap="400">
  <p>...</p>
  <dt-checkbox
    name="option1"
    value="Value"
    label="Anonymous callers"
    description="Select how phone numbers you dont know should be handled."
  />
  <dt-checkbox
    name="option2"
    value="Value"
    label="Block callers not already in contacts list"
    description="You get enough calls. Free up some of your time."
  />
  <dt-checkbox
    name="option3"
    value="Value"
    label="Block callers with a high spam score"
    description="We will only let the legitimate callers through to bother you."
  />
</dt-stack>
```

### With Validation States

```vue
<dt-stack gap="400">
  <p>...</p>
  <dt-checkbox
    name="option1"
    value="Value"
    label="Anonymous callers"
    validation-state="warning"
    :messages="[{ message: `Select how phone numbers you dont know should be handled.`, type: `warning` }]"
  />
  <dt-checkbox
    name="option2"
    value="Value"
    label="Block callers not already in contacts list"
    validation-state="error"
    :messages="[{ message: `You get enough calls. Free up some of your time.`, type: `error` }]"
  />
  <dt-checkbox
    name="option3"
    value="Value"
    label="Block callers with a high spam score"
    validation-state="success"
    :messages="[{ message: `We will only let the legitimate callers through to bother you.`, type: `success` }]"
  />
</dt-stack>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `label` | A provided label for the input | `string` | `''` |
| `name` | The name of the input | `string` | `''` |
| `value` | The value of the input | `string\|number\|boolean` | `null` |
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
| `default` | slot for Checkbox Label |
| `description` | slot for Checkbox Description |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `input` | Native input event | `Boolean` |
| `update:modelValue` | Event fired to sync the modelValue prop with the parent component | `Boolean` |
| `focusin` | Native input focusin event | `FocusEvent` |
| `focusout` | Native input focusout event | `FocusEvent` |

## Classes

| Class | Applies to | Description |
| --- | --- | --- |
| `d-checkbox-group` | N/A | Checkbox's parent wrapper. |
| `d-checkbox__input` | N/A | Wraps checkbox's input. |
| `d-checkbox` | N/A | Styles checkbox's input. |
| `d-checkbox__copy` | N/A | Wraps checkbox's label. |
| `d-checkbox__label` | N/A | Styles checkbox's label. |
| `d-checkbox-group--disabled` | .d-checkbox-group | Styles checkbox group in a disabled state. |
| `d-checkbox--error` | .d-checkbox | Styles checkbox's input in an error state. |
| `d-checkbox--success` | .d-checkbox | Styles checkbox's input in a success state. |
| `d-checkbox--warning` | .d-checkbox | Styles checkbox's input in a warning state. |
| `d-checkbox--indeterminate` | .d-checkbox | Styles checkbox's input in an indeterminate state. |
| `d-validation-message` | N/A | Applies base styles to checkbox's validation message. |
| `d-validation-message--error` | .d-validation-message | Styles radio's validation message in an error state. |
| `d-validation-message--success` | .d-validation-message | Styles radio's validation message in a success state. |
| `d-validation-message--warning` | .d-validation-message | Styles radio's validation message in a warning state. |

## Accessibility

The best accessibility is semantic HTML. Most screen readers understand how to parse inputs if they’re correctly formatted. When it comes to checkboxes, there are a few things to keep in mind:

- All inputs should have an `id` attribute.
- Associate checkbox labels with their inputs using the `for` attribute. This correlates with the checkbox's `id`.
- If you have a group of related checkboxes, use a `fieldset` to group them and a `legend` to title the group. For further information, please visit Gov.UK’s article, ["Using the fieldset and legend elements"](https://accessibility.blog.gov.uk/2016/07/22/using-the-fieldset-and-legend-elements).
- Input with description text should have `aria-describedby` with the `id` of the description text.
- If the input is a required field, use the `aria-required` property and use the validation message for input errors.
- Input with validation errors should have `aria-describedby` with the `id` of the validation message.
