# Checkbox Group

Checkbox groups are convenient components for a grouping of related Checkboxes.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-checkbox-group--default
- **Keywords**: checkboxes,multi select,form fields,d-checkbox-group,DtCheckboxGroup,dt-checkbox-group

Checkbox Groups are typically paired with a legend which identifies the group. If no legend is provided then it is expected that an `aria-label` will be given in order to provide an invisible label to screen readers. Each Checkbox Group should contain one or more Checkboxes which users can make selections from.

## Variants

### Default

```vue
<dt-checkbox-group
  name="fruits-checkbox-group"
  class="d-input-group__fieldset"
  legend="Fruits"
>
  <dt-checkbox value="apple"><span>Apple</span></dt-checkbox>
  <dt-checkbox value="banana"><span>Banana</span></dt-checkbox>
  <dt-checkbox value="other"><span>Other</span></dt-checkbox>
</dt-checkbox-group>
```

### With Selected Values

```vue
<dt-checkbox-group
  name="my-group-name"
  legend="My Legend"
  :selected-values="[`option1`]"
>
  <dt-checkbox
    value="option1"
    label="Option 1"
  />
  <dt-checkbox
    value="option2"
    label="Option 2"
  />
</dt-checkbox-group>
```

### Disabled

```vue
<dt-checkbox-group
  name="my-group-name"
  legend="My Legend"
  disabled
>
  <dt-checkbox
    value="option1"
    label="Option 1"
  />
  <dt-checkbox
    value="option2"
    label="Option 2"
  />
</dt-checkbox-group>
```

### With Validation States

```vue
<dt-checkbox-group
  name="fruits-checkbox-group"
  class="d-input-group__fieldset"
  legend="Fruits"
  validation-state="success"
  :messages="[{ message: `Success validation message.`, type: `success` }]"
>
  <dt-checkbox value="apple"><span>Apple</span></dt-checkbox>
  <dt-checkbox value="banana"><span>Banana</span></dt-checkbox>
  <dt-checkbox value="other"><span>Other</span></dt-checkbox>
</dt-checkbox-group>
<dt-checkbox-group
  name="fruits-checkbox-group"
  class="d-input-group__fieldset"
  legend="Fruits"
  validation-state="warning"
  :messages="[{ message: `Warning validation message.`, type: `warning` }]"
>
  <dt-checkbox value="apple"><span>Apple</span></dt-checkbox>
  <dt-checkbox value="banana"><span>Banana</span></dt-checkbox>
  <dt-checkbox value="other"><span>Other</span></dt-checkbox>
</dt-checkbox-group>
<dt-checkbox-group
  name="fruits-checkbox-group"
  class="d-input-group__fieldset"
  legend="Fruits"
  validation-state="error"
  :messages="[{ message: `Error validation message.`, type: `error` }]"
>
  <dt-checkbox value="apple"><span>Apple</span></dt-checkbox>
  <dt-checkbox value="banana"><span>Banana</span></dt-checkbox>
  <dt-checkbox value="other"><span>Other</span></dt-checkbox>
</dt-checkbox-group>
```

### With Validation Messages Hidden

```vue
<dt-checkbox-group
  name="my-group-name"
  legend="My Legend"
  :messages="[{ message: `My Success Message`, type: VALIDATION_MESSAGE_TYPES.SUCCESS }]"
  :show-messages="false"
>
  <dt-checkbox
    value="option1"
    label="Option 1"
  />
  <dt-checkbox
    value="option2"
    label="Option 2"
  />
</dt-checkbox-group>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `id` | The id of the input group | `string` | `(function)` |
| `value` | The value of the input group | `string\|number\|boolean\|object` | `null` |
| `name` | The name of the input group | `string` | `''` |
| `legend` | The legend of the input group | `string` | `''` |
| `disabled` | Disables the input group | `boolean` | `false` |
| `messages` | Validation messages | `array` | `[]` |
| `showMessages` | Show validation messages | `boolean` | `true` |
| `legendClass` | Used to customize the legend element | `string\|array\|object` | `''` |
| `messagesClass` | Used to customize the messages container | `string\|array\|object` | `''` |
| `legendChildProps` | A set of props that are passed into the legend element | `object` | `{}` |
| `messagesChildProps` | A set of props that are passed into the messages container | `object` | `{}` |
| `dataQaGroup` | A data qa tag for the radio group | `string` | `'checkbox-group'` |
| `dataQaGroupLegend` | A data qa tag for the radio group legend | `string` | `'checkbox-group-legend'` |
| `dataQaGroupMessages` | A data qa tag for the radio group messages | `string` | `'checkbox-group-messages'` |
| `modelValue` | Not supported by this component, please use selectedValues | `` | `null` |
| `v-model` | A provided list of selected values(s) for the checkbox group | `array` | `[]` |

### Slots

| Name | Description |
| --- | --- |
| `legend` | slot for Input Group Legend |
| `default` | slot for Input Group Components |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `input` | Native input event | `Array` |
| `update:selectedValues` | Selected values for the checkbox group | `Array` |
