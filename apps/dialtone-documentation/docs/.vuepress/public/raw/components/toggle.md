# Toggle

A toggle, or "switch", is a button control element that allows the user to make a binary selection.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-toggle--default
- **Keywords**: switch, checkbox, on off, d-toggle, DtToggle, dt-toggle, flip switch

## Usage

The Toggle component acts as a way to allow the User to switch between two mutually exclusive options. While it technically mirrors a [Checkbox](checkbox.md) state, its effect on the system is immediate&mdash;much like a light switch immediately turns on or off the lights. In contrast, the checked state of a [Checkbox](checkbox.md) won't be applied until a separate action to confirm the selection is taken.

**Do:**

- When its action has an instantaneous effect.

**Don't:**

- When its action does not have an immediate effect on the application.
- Selecting between 2 options. Instead, utilize a [Checkbox](checkbox.md).
- As an alternative to a [Checkbox](checkbox.md) or [Radio](radio.md) within a Form.

### Best Practices

- A Toggle component should be used as a control within an application and provide a way to toggle between two states like a household light switch.
- An `indeterminate` Toggle convey a "mixed" state that neither qualifies as toggled or not toggled. An example use case is when a Toggle acts as a "parent" of a collection of child Toggle components:
  - Toggled: all children are toggled.
  - Not toggled: all children are not toggled.
  - `indeterminate`: children are a mix of toggled and not toggled.

## Variants and Examples

### Base Styles

```vue
<dt-toggle>
  Unchecked Toggle
</dt-toggle>
<dt-toggle :model-value="true">
  Checked Toggle
</dt-toggle>
<dt-toggle :disabled="true">
  Unchecked Disabled
</dt-toggle>
<dt-toggle :model-value="true" :disabled="true">
  Checked Disabled
</dt-toggle>
<dt-toggle model-value="mixed">
  Indeterminate Toggle
</dt-toggle>
<dt-toggle model-value="mixed" :disabled="true">
  Indeterminate Disabled
</dt-toggle>
<dt-toggle :show-icon="false">
  Without icon
</dt-toggle>
```

### Sizes

```vue
<dt-toggle>
  Default size
</dt-toggle>
<dt-toggle size="sm">
  Small size
</dt-toggle>
```

### With v-model

```vue
<dt-toggle v-model="checked">
  Toggle
</dt-toggle>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `id` | The id of the toggle | `string` | `(function)` |
| `disabled` | Disables the toggle interactions | `boolean` | `false` |
| `v-model` | Value of the toggle | `boolean\|string` | `false` |
| `toggleOnClick` | Whether the component toggles on click. If you set this to false it means you will handle the toggling manually via the checked prop or v-model. Change events will still be triggered. | `boolean` | `true` |
| `size` | The size of the toggle. | `string` | `'md'` |
| `showIcon` | Shows the icon | `boolean` | `true` |
| `labelClass` | Used to customize the label container | `string\|array\|object` | `''` |
| `wrapperClass` | Additional styling for the wrapper element | `string\|array\|object` | `''` |
| `labelChildProps` | A set of props that are passed into the label container | `object` | `{}` |

### Slots

| Name | Description |
| --- | --- |
| `default` | Slot for the main content |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `change` | Toggle change event | `Boolean` |
| `update:modelValue` | v-model event event | `Boolean` |

## Classes

| Class | Applies to | Description |
| --- | --- | --- |
| `d-toggle` | N/A | Styles toggle button (default styling). |
| `d-toggle__inner` | Child of .d-toggle | Styles the inside of the toggle button. |
| `d-toggle--small` | .d-toggle | Applies small size. |
| `d-toggle--checked` | .d-toggle | Styles the button when it is in a checked state. |
| `d-toggle--disabled` | .d-toggle | Styles the toggle button when it is in a disabled state. |
| `d-toggle--indeterminate` | .d-toggle | Styles the toggle button when it is in a indeterminate state. |

## Accessibility

This component uses a native button element under the hood that has a role `switch` and type `button` to improve accessibility.
[See W3C guidelines](https://www.w3.org/TR/2021/NOTE-wai-aria-practices-1.2-20211129/examples/switch/switch-button.html)
for more information.

The best accessibility is semantic HTML. Most screen readers understand how to parse buttons if they’re correctly formatted. When it comes to toggles, there are a few things to keep in mind:

- All toggle buttons should have an `id` attribute.
- Associate toggle labels with their buttons using the `for` attribute. This correlates with the toggle's `id`.
- If you have a group of related toggles, use a `fieldset` to group them and a `legend` to title the group. For further information, please visit Gov.UK’s article, ["Using the fieldset and legend elements"](https://accessibility.blog.gov.uk/2016/07/22/using-the-fieldset-and-legend-elements).

### Button

The button element should be fully accessible by keyboard. To accomplish this, the `DtToggle` component automatically
populates several ARIA attributes to the underlying `button` element depending on the checked and
disabled states. However, if a label default slot is not used with `DtToggle`
(without including an `aria-label`), a console warning error will be thrown indicating that this issue exists.

### Focus & Keyboard

The button element should capture keyboard focus as long as it is not disabled (`disabled` prop is `true`).
`ENTER` key will
emit a **change** event with the current value of the toggle and will change its internal `checked` state.
