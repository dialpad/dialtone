# Select menu

A select menu is an input control that allows users to choose one option from a list.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-select-menu--default
- **Keywords**: dropdown, picker, d-select-menu, DtSelectMenu, dt-select-menu, native select, listbox

## Usage

**Do:**

- Use sparingly — only when a user needs to choose from about seven to 15 possible options, and you have limited space to display the options.

**Don't:**

- For site navigation.
- If the list of options is very short. Use [Radio](radio.md) instead.
- If the list of options is very long. Let users type the same information into an [Input](input.md) that suggests possible options instead (aka Combobox).
- Avoid using the `multiple` attribute. Users often don’t understand how to select multiple items from the select element (e.g. by holding down a modifier key).
- For selecting an action that takes immediate effect. A `select` is for selecting a choice that is only confirmed by a separate submit action (much like a [Checkbox](checkbox.md)). For immediate actions consider the [Dropdown](dropdown.md) component.

### Best Practices

- Selects should be considered the “UI of last resort,” as users often find them confusing and difficult to use. Consider testing thoroughly with members of your target audience.
- Avoid making options in one dropdown menu change based on the input to another. Users often don’t understand how selecting an item in one impacts another.
- When most users will (or should) pick a particular option, make it the default selection.
- Avoid auto-submission. Be wary of UI implications of automatically submitting upon selection or applying its value. Users may often change their choices multiple times, particularly if interacting with a form solely with keyboard. Auto-submission is also less accessible. For auto-submission consider the [Dropdown](dropdown.md) component.

## Variants

### Base

A select is normally paired with a label, but there are times when it can be used without a label. Don't rely on the placeholder text as a label.

```vue
<!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
<dt-select-menu
  :options="[
        { value: ``, label: `Please select one` },
        { value: `1`, label: `Option 1` },
        { value: `2`, label: `Option 2` },
        { value: `3`, label: `Option 3` },
      ]"
  label="Default"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
/>
<dt-select-menu
  :options="[
        { value: ``, label: `Please select one` },
        { value: `1`, label: `Option 1` },
        { value: `2`, label: `Option 2` },
        { value: `3`, label: `Option 3` },
      ]"
  label="Disabled"
  disabled
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
/>
```

### With Description Text

```vue
<!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
<dt-select-menu
  :options="[
        { value: ``, label: `Please select one` },
        { value: `1`, label: `Option 1` },
        { value: `2`, label: `Option 2` },
        { value: `3`, label: `Option 3` },
      ]"
  label="Label"
  description="Optional description text"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
/>
```

### With Validation States

Provides feedback to the user based on their interaction, or lack thereof, with a select.

```vue
<!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
<dt-select-menu
  :options="[
    { value: ``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  :messages="[{ message: `Error validation message`, type: `error` }]"
  label="Label"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
/>
<dt-select-menu
  :options="[
    { value: ``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  :messages="[{ message: `Success validation message`, type: `success` }]"
  label="Label"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
/>
<dt-select-menu
  :options="[
    { value: ``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  :messages="[{ message: `Warning validation message`, type: `warning` }]"
  label="Label"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
/>
```

### With Validation States Hidden

```vue
<!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
<dt-select-menu
  :options="[
    { value: ``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  :messages="[{ message: `Error validation message`, type: `error` }]"
  label="Label"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
  :show-messages="false"
/>
<dt-select-menu
  :options="[
    { value:``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  :messages="[{ message: `Success validation message`, type: `success` }]"
  label="Label"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
  :show-messages="false"
/>
<dt-select-menu
  :options="[
    { value: ``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  :messages="[{ message: `Warning validation message`, type: `warning` }]"
  label="Label"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
  :show-messages="false"
/>
```

### With Slotted Label

```vue
<!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
<dt-select-menu
  :options="[
    { value: ``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
>
  <template #label>
    <div>Slotted label</div>
  </template>
</dt-select-menu>
```

### With Slotted Description

```vue
<!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
<dt-select-menu
  :options="[
    { value: ``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
>
  <template #description>
    <div>Slotted description</div>
  </template>
</dt-select-menu>
```

### With Slotted Options

```vue
<!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
<dt-select-menu
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
>
  <template #default>
    <option
      v-for="option in options"
      :key="`with-slotted-options-${option.value}`"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </template>
</dt-select-menu>
```

## Sizes

We offer different sizes for instances in which the interface requires a smaller or larger select. In general, though, use the base (medium) size select as much as possible, especially in forms.

```vue
<!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
<dt-select-menu
  :options="[
    { value: ``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  label="Label"
  size="xs"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
/>
<dt-select-menu
  :options="[
    { value: ``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  label="Label"
  size="sm"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
/>
<dt-select-menu
  :options="[
    { value: ``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  label="Label"
  size="md"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
/>
<dt-select-menu
  :options="[
    { value: ``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  label="Label"
  size="lg"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
/>
<dt-select-menu
  :options="[
    { value: ``, label: `Please select one` },
    { value: `1`, label: `Option 1` },
    { value: `2`, label: `Option 2` },
    { value: `3`, label: `Option 3` },
  ]"
  label="Label"
  size="xl"
  :model-value="modelValue"
  @input="onInput"
  @change="onChange"
/>
```

## Accessibility

- Make sure the `label` `for` attribute match the select `id`.
- Avoiding removing `labels`. Labelled selects are user-friendly.
- Avoid relying on placeholder text as a substitute for a label.
- Avoid customizing the placeholder text.
- If the select is a required field, use the `aria-required` property and use the validation message for input errors.
- Select with validation errors should have `aria-describedby` with the `id` of the validation message.

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `messagesClass` | Used to customize the validation messages component | `string\|array\|object` | `''` |
| `messagesChildProps` | A set of props that are passed into the validation messages component | `object` | `{}` |
| `showMessages` | Used to hide / show the validation messages | `boolean` | `true` |
| `messages` | Validation messages | `array` | `[]` |
| `label` | Label for the select | `string` | `''` |
| `description` | Description for the select | `string` | `''` |
| `options` | Select Menu Options, overridden by default slot. Each option has the following structure: `{ value: number \|\| string (required), label: string (required) }` | `array` | `[]` |
| `size` | Controls the size of the select | `string` | `'md'` |
| `labelClass` | Used to customize the label container | `string\|array\|object` | `''` |
| `descriptionClass` | Used to customize the description container | `string\|array\|object` | `''` |
| `selectClass` | Used to customize the select | `string\|array\|object` | `''` |
| `optionClass` | Used to customize each option, should options be provided via prop | `string\|array\|object` | `''` |
| `labelChildProps` | A set of props that are passed into the label container | `object` | `{}` |
| `descriptionChildProps` | A set of props that are passed into the description container | `object` | `{}` |
| `optionChildProps` | A set of props that are passed into each option, should options be provided via prop | `object` | `{}` |
| `disabled` | Disabled state of the select | `boolean` | `false` |
| `rootClass` | Additional class name for the root element. Can accept all of: String, Object, and Array, i.e. has the same api as Vue's built-in handling of the class attribute. | `string\|object\|array` | `''` |
| `modelValue` | The value of the select menu | `string\|number` | `''` |

### Slots

| Name | Description |
| --- | --- |
| `label` | Slot for label, defaults to label prop |
| `description` | Slot for description, defaults to description prop |
| `default` | Slot for select menu options, defaults to options prop |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `input` | Native input event | `String \| Number` |
| `update:modelValue` | Event fired to sync the modelValue prop with the parent component | `String \| Number` |
| `change` | Native change event | `String \| Number` |

## Classes

| Class | Applies to | Description |
| --- | --- | --- |
| `d-select` | N/A | Wraps the select element and applies base style. |
| `d-select--xs` | .d-select | Applies extra small size. |
| `d-select--sm` | .d-select | Applies small size. |
| `d-select--lg` | .d-select | Applies large size. |
| `d-select--xl` | .d-select | Applies extra large size. |
| `d-select__input` | N/A | Styles the select element. |
| `d-select__input--warning` | .d-select__input | Styles select in a warning state. |
| `d-select__input--error` | .d-select__input | Styles select in a error state. |
| `d-select__input--success` | .d-select__input | Styles select in a success state. |
