# Radio Group

Radio groups are control elements that allow the user to make a single selection from a list of options.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-radio-group--default
- **Keywords**: radio buttons,radio options,form fields,d-radio-group,DtRadioGroup,dt-radio-group

## Variants

### Default

```vue
<dt-radio-group
  model-value=""
  name="fruits-radio-group-01"
  legend="Fruits"
>
  <dt-radio value="apple"><span >Apple</span></dt-radio>
  <dt-radio value="banana"><span >Banana</span></dt-radio>
  <dt-radio value="other"><span >Other</span></dt-radio>
</dt-radio-group>
```

### With Options

Passing in Radio components programmatically using an options object.

```vue
<dt-radio-group
  v-model="selectedFruits"
  name="fruits-radio-group"
  legend="Fruits"
>
  <dt-radio
    v-for="option in options"
    :key="option.value"
    :value="option.value"
  >
    <span>{{ option.label }}</span>
  </dt-radio>
</dt-radio-group>
```

### Without Legend

When no legend is provided it is expected that an `aria-label` is passed into the component.

```vue
<dt-radio-group
  name="fruits-radio-group"
  aria-label="Fruits"
>
  <dt-radio value="pear">Pear</dt-radio>
  <dt-radio value="kiwi">Kiwi</dt-radio>
</dt-radio-group>
```

### With Slotted Legend

The legend can also be passed by slot.

```vue
<dt-radio-group
  name="fruits-radio-group"
>
  <dt-radio value="pear">Pear</dt-radio>
  <dt-radio value="kiwi">Kiwi</dt-radio>
  <template #legend>
    Fruits
  </template>
</dt-radio-group>
```

### With Event Hander

The event handler is only needed if you need to do additional processing. The v-model is automatically updated.

```vue
<dt-radio-group
  v-model="selectedFruits"
  name="fruits-radio-group"
  legend="Fruits"
  @input="onInput"
>
  <dt-radio value="pear">Pear</dt-radio>
  <dt-radio value="kiwi">Kiwi</dt-radio>
</dt-radio-group>
```

### With Validation States

```vue
<div class="d-stack16">
  <div>
    <dt-radio-group
      name="radio-group-with-success-message"
      legend="With Success Message"
      :messages=`[{"message":"Success validation message","type":"success"}]`
    >
      <dt-radio value="apple"><span >Apple</span></dt-radio>
      <dt-radio value="banana"><span >Banana</span></dt-radio>
      <dt-radio value="other"><span >Other</span></dt-radio>
    </dt-radio-group>
  </div>
  <div>
    <dt-radio-group
      name="radio-group-with-warning-message"
      legend="With Warning Message"
      :messages=`[{"message":"Warning validation message","type":"warning"}]`
    >
      <dt-radio value="apple"><span >Apple</span></dt-radio>
      <dt-radio value="banana"><span >Banana</span></dt-radio>
      <dt-radio value="other"><span >Other</span></dt-radio>
    </dt-radio-group>
  </div>
  <div>
    <dt-radio-group
      name="radio-group-with-error-message"
      legend="With Error Message"
      :messages=`[{"message":"Error validation message","type":"error"}]`
    >
      <dt-radio value="apple"><span >Apple</span></dt-radio>
      <dt-radio value="banana"><span >Banana</span></dt-radio>
      <dt-radio value="other"><span >Other</span></dt-radio>
    </dt-radio-group>
  </div>
</div>
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
| `dataQaGroup` | A data qa tag for the radio group | `string` | `'radio-group'` |
| `dataQaGroupLegend` | A data qa tag for the radio group legend | `string` | `'radio-group-legend'` |
| `dataQaGroupMessages` | A data qa tag for the radio group messages | `string` | `'radio-group-messages'` |
| `v-model` | A provided value for the radio group | `string\|number` | `''` |

### Slots

| Name | Description |
| --- | --- |
| `legend` | slot for Input Group Legend |
| `default` | slot for Input Group Components |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `input` | Native input event | `String \| Number` |
| `update:modelValue` | Native input event | `String \| Number` |

## Accessibility

Radio Groups are typically paired with a legend which identifies the group. If no legend is provided then it is expected
that an `aria-label` will be given in order to provide an invisible label to screen readers.
