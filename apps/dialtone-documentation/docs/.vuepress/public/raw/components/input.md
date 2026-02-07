# Input

An input field is an input control that allows users to enter alphanumeric information. It can have a range of options and supports single line and multi-line lengths, as well as varying formats, including numbers, masked passwords, etc.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-input--default
- **Keywords**: text field, form field, textbox, d-input, DtInput, dt-input, text input, form input

## Usage

This component combines both the `input` and `textarea` elements as options within a single component. Its default presentation includes a paired text `label`.

**Do:**

- If you can’t reasonably predict a user’s answer to a prompt and there might be wide variability in users’ answers.
- When using another type of input will make answering more difficult. For example, birthdays and other known dates are easier to type in than they are to select from a calendar picker.
- When users want to be able to paste in a response.

**Don't:**

- When users are choosing from a specific set of options. Consider [Select](select-menu.md), [Radio](radio.md), or [Checkbox](checkbox.md).

### Best Practices

- The length of the text input provides a hint to users as to how much text to enter.
- Only show error validation messages or stylings after a user has interacted with a particular field.
- Do not use placeholder text (i.e. `placeholder` attribute) in place of an accessible `label`.
- Consider the type of content a user may enter to aid mobile device entry; mobile devices typically surface a keyboard UI attuned to the type. For example, type="tel" will surface a [phone keyboard](http://html5doctor.com/html5-forms-input-types/#input-tel).

## Sizes

We offer different sizes for instances in which the interface requires a smaller or larger input. In general, though, use the base (medium) size input as much as possible, especially in forms.

```vue
<dt-input label="Extra Small" type="text" placeholder="Placeholder" size="xs" />
<dt-input label="Extra Small" type="textarea" placeholder="Placeholder" size="xs" />
<dt-input label="Small" type="text" placeholder="Placeholder" size="sm" />
<dt-input label="Small" type="textarea" placeholder="Placeholder" size="sm" />
<dt-input label="Medium" type="text" placeholder="Placeholder" size="md" />
<dt-input label="Medium" type="textarea" placeholder="Placeholder" size="md" />
<dt-input label="Large" type="text" placeholder="Placeholder" size="lg" />
<dt-input label="Large" type="textarea" placeholder="Placeholder" size="lg" />
<dt-input label="Extra large" type="text" placeholder="Placeholder" size="xl" />
<dt-input label="Extra large" type="textarea" placeholder="Placeholder" size="xl" />
```

## Examples

### Base Styles

An input is normally paired with a label, but there are times when it can be used without a label.  Placeholder text should primarily be used as a content prompt and only provided when needed.

```vue
<dt-input label="Label" placeholder="Placeholder" />
<!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
<dt-input label="Label" model-value="Value" />
<dt-input label="Label" placeholder="Placeholder" disabled />
```

```vue
<dt-input label="Label" placeholder="Placeholder" type="textarea" />
<!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
<dt-input label="Label" type="textarea" model-value="Value" />
<dt-input label="Label" placeholder="Placeholder" type="textarea" disabled />
```

### With Description Text

```vue
<dt-input label="Label" description="Helpful description text" placeholder="Placeholder"/>
```

```vue
<dt-input label="Label" description="Helpful description text" type="textarea" placeholder="Placeholder"/>
```

### With Validation States

Provides feedback to the user based on their interaction, or lack thereof, with an input.

```vue
<!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
<dt-input label="Label" type="email" model-value="Value" :messages="[messages.error]"/>
<dt-input label="Label" type="email" model-value="Value" :messages="[messages.success]"/>
<dt-input label="Label" type="email" model-value="Value" :messages="[messages.warning]"/>
```

```vue
<!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
<dt-input label="Label" type="textarea" model-value="Value" :messages="[messages.error]"/>
<dt-input label="Label" type="textarea" model-value="Value" :messages="[messages.success]"/>
<dt-input label="Label" type="textarea" model-value="Value" :messages="[messages.warning]"/>
```

### With Multiple Validation Messages

```vue
<!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
<dt-input label="Label" type="email" model-value="Value" :messages="multipleMessages" />
```

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

```vue
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
```

### With Custom Maximum Length Validation Message

```vue
<dt-input
  label="Label"
  placeholder="placeholder"
  :validate="validate()"
  v-model="inputValue"
/>
```

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

```vue
<dt-input
  aria-label="Search items"
  placeholder="Search Items"
  type="search"
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
```

## Icon Support

```vue
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
```

```vue
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
```

### Icon Sizes

Each Text Input size has a default icon size, keeping it proportional. While rare, customizing the icon size is possible.

```vue
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
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `messagesClass` | Used to customize the validation messages component | `string\|array\|object` | `''` |
| `messagesChildProps` | A set of props that are passed into the validation messages component | `object` | `{}` |
| `showMessages` | Used to hide / show the validation messages | `boolean` | `true` |
| `messages` | Validation messages | `array` | `[]` |
| `name` | Name property of the input element | `string` | `''` |
| `type` | Type of the input. When `textarea` a `<textarea>` element will be rendered instead of an `<input>` element. | `string` | `INPUT_TYPES.TEXT` |
| `modelValue` | Value of the input | `string\|number` | `''` |
| `disabled` | Disables the input | `boolean` | `false` |
| `label` | Label for the input | `string` | `''` |
| `labelVisible` | Determines visibility of input label. | `boolean` | `true` |
| `description` | Description for the input | `string` | `''` |
| `size` | Size of the input, one of `xs`, `sm`, `md`, `lg`, `xl` | `string` | `'md'` |
| `inputClass` | Additional class name for the input element. Can accept String, Object, and Array, i.e. has the same API as Vue's built-in handling of the class attribute. | `string\|object\|array` | `''` |
| `inputWrapperClass` | Additional class name for the input wrapper element. Can accept all of: String, Object, and Array, i.e. has the same api as Vue's built-in handling of the class attribute. | `string\|object\|array` | `''` |
| `rootClass` | Additional class name for the root element. Can accept all of: String, Object, and Array, i.e. has the same api as Vue's built-in handling of the class attribute. | `string\|object\|array` | `''` |
| `currentLength` | The current character length that the user has entered into the input. This will only need to be used if you are using `validate.length` and the string contains abnormal characters. For example, an emoji could take up many characters in the input, but should only count as 1 character. If no number is provided, a built-in length calculation will be used for the length validation. | `number` | `null` |
| `retainWarning` | Whether the input will continue to display a warning validation message even if the input has lost focus. | `boolean` | `false` |
| `validate` | Validation for the input. Supports maximum length validation with the structure: `{ "length": {"description": string, "max": number, "warn": number, "message": string, "limitMaxLength": boolean }}` | `object` | `null` |
| `hidden` | hidden allows to use input without the element visually present in DOM | `boolean` | `false` |

### Slots

| Name | Description |
| --- | --- |
| `labelSlot` | Slot for label, defaults to label prop |
| `description` | Slot for description, defaults to description prop |
| `leftIcon` | Slot for left icon |
| `rightIcon` | Slot for right icon |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `input` | Native input event | `String` |
| `blur` | Native input blur event | `FocusEvent` |
| `clear` | Input clear event | `` |
| `focus` | Native input focus event | `FocusEvent` |
| `focusin` | Native input focusin event | `FocusEvent` |
| `focusout` | Native input focusout event | `FocusEvent` |
| `update:modelValue` | Event fired to sync the modelValue prop with the parent component | `undefined` |
| `update:length` | Length of the input when currentLength prop is not passed | `Number` |
| `update:invalid` | Result of the input validation | `Boolean` |

## Classes

| Class | Applies to | Description |
| --- | --- | --- |
| `d-input` | N/A | Base input style. |
| `d-input--xs` | .d-input | Applies extra small size. |
| `d-input--sm` | .d-input | Applies small size. |
| `d-input--lg` | .d-input | Applies large size. |
| `d-input--xl` | .d-input | Applies extra large size. |
| `d-input--warning` | .d-input | Styles input in a warning state. |
| `d-input--error` | .d-input | Styles input in a error state. |
| `d-input--success` | .d-input | Styles input in a success state. |
| `d-input-icon` | .d-input | Styles input to have an icon. |
| `d-input-icon--left` | .d-input | Styles for left icons, applied to the input. |
| `d-input-icon--right` | .d-input | Styles for right icons, applied to the input. |
| `d-input-icon--left` | .d-input-icon | Styles for left icons. applied to the icon wrapper. |
| `d-input-icon--right` | .d-input-icon | Styles for right icons. applied to the icon wrapper. |
| `d-textarea` | N/A | Base textarea style. |
| `d-textarea--xs` | .d-textarea | Applies extra small size. |
| `d-textarea--sm` | .d-textarea | Applies small size. |
| `d-textarea--lg` | .d-textarea | Applies large size. |
| `d-textarea--xl` | .d-textarea | Applies extra large size. |
| `d-textarea--warning` | .d-textarea | Styles textarea in a warning state. |
| `d-textarea--error` | .d-textarea | Styles textarea in a error state. |
| `d-textarea--success` | .d-textarea | Styles textarea in a success state. |

## Accessibility

- Make sure the `label` `for` attribute match the input `id`.
- Avoiding removing `labels`. Labelled inputs are user-friendly.
- Avoid relying on placeholder text as a substitute for a `label`.
- If the input is a required field, use the `aria-required` property and use the validation message for input errors.
- Input with validation errors should have `aria-describedby` with the `id` of the validation message.
- Placeholder text should not include critical information. Use description text for any information that helps the user successfully interact with the input.
