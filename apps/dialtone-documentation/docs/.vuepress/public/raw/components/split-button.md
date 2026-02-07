# Split Button

A Split Button offers a default action paired with a secondary action to reveal alternate or related actions.

- **Status**: beta
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-split-button--default
- **Keywords**: dropdown button, button with menu, d-split-button, DtSplitButton, dt-split-button, menu button, combo button

## Usage

This dual-functionality allows for surfacing variations of the default action. It conserves space in the interface and reduces cognitive load. While versatile, they should be used judiciously to avoid overwhelming users or cluttering the UI.

In addition to the [Button component's](button.md) documentation:

- The default button supports text or icons, while the secondary action is always an icon.
- The secondary action selected from its menu replaces the primary action.
- Ensure that primary and secondary actions are clearly labeled to avoid user confusion.

**Do:**

- Use Split Buttons when you need to offer a default action paired with closely related actions, such as "Save" with secondary actions like "Save as Draft" or “Save all.”
- Reserve for scenarios where multiple related actions can reasonably be grouped within the same context via the secondary action.

**Don't:**

- Avoid using if the secondary action is unrelated or distantly related.
- Refrain from grouping multiple Split Buttons together, as this can lead to a cluttered and confusing interface.

## Variants

### Base

```vue
<dt-split-button omega-tooltip-text="More calling options"> Place Call </dt-split-button>
<dt-split-button importance="outlined" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
<dt-split-button importance="clear" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
```

### Danger

```vue
<dt-split-button kind="danger" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
<dt-split-button importance="outlined" kind="danger" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
<dt-split-button importance="clear" kind="danger" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
```

### Positive

```vue
<dt-split-button kind="positive" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
<dt-split-button kind="positive" importance="outlined" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
<dt-split-button kind="positive" importance="clear" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
```

### Inverted

```vue
<dt-split-button kind="inverted" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
<dt-split-button importance="outlined" kind="inverted" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
<dt-split-button importance="clear" kind="inverted" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
```

### Muted

```vue
<dt-split-button importance="outlined" kind="muted" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
<dt-split-button importance="clear" kind="muted" omega-tooltip-text="More calling options"> Place Call </dt-split-button>
```

### Disabled

Use the `disabled` prop to disable both buttons, or use `alpha-disabled` and `omega-disabled` to disable each button independently.

```vue
<dt-split-button disabled omega-tooltip-text="More calling options"> Both disabled </dt-split-button>
<dt-split-button alpha-disabled omega-tooltip-text="More calling options"> Alpha disabled </dt-split-button>
<dt-split-button omega-disabled omega-tooltip-text="More calling options"> Omega disabled </dt-split-button>
```

### Active

```vue
<dt-split-button alpha-active omega-tooltip-text="More calling options"> Alpha active </dt-split-button>
<dt-split-button omega-active omega-tooltip-text="More calling options"> Omega active </dt-split-button>
```

## Sizes

```vue
<dt-split-button size="xs" omega-tooltip-text="More calling options"> xs </dt-split-button>
<dt-split-button size="sm" omega-tooltip-text="More calling options"> sm </dt-split-button>
<dt-split-button size="md" omega-tooltip-text="More calling options"> md </dt-split-button>
<dt-split-button size="lg" omega-tooltip-text="More calling options"> lg </dt-split-button>
<dt-split-button size="xl" omega-tooltip-text="More calling options"> xl </dt-split-button>
```

## Loading

```vue
<dt-split-button alpha-loading omega-tooltip-text="More calling options"> Place call </dt-split-button>
<dt-split-button alpha-loading importance="outlined" omega-tooltip-text="More calling options"> Place call </dt-split-button>
<dt-split-button alpha-loading importance="clear" omega-tooltip-text="More calling options"> Place call </dt-split-button>
```

## Icon Support

### Icon and Label

```vue
<dt-split-button importance="outlined" omega-tooltip-text="More calling options">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
  Place call
</dt-split-button>
<dt-split-button importance="outlined" alpha-icon-position="top" omega-tooltip-text="More calling options">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
  Place call
</dt-split-button>
<dt-split-button importance="outlined" alpha-icon-position="right" omega-tooltip-text="More calling options">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
  Place call
</dt-split-button>
<dt-split-button importance="outlined" alpha-icon-position="bottom" omega-tooltip-text="More calling options">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
  Place call
</dt-split-button>
```

### Icon Only

```vue
<dt-split-button omega-tooltip-text="More calling options" alpha-tooltip-text="Place call">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
<dt-split-button importance="outlined" kind="muted" omega-tooltip-text="More calling options" alpha-tooltip-text="Place call">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
<dt-split-button importance="clear" kind="danger" omega-tooltip-text="More calling options" alpha-tooltip-text="Place call">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
```

```vue
<dt-split-button kind="inverted" omega-tooltip-text="More calling options" alpha-tooltip-text="Place call">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
<dt-split-button importance="outlined" kind="inverted" omega-tooltip-text="More calling options" alpha-tooltip-text="Place call">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
<dt-split-button importance="clear" kind="inverted" omega-tooltip-text="More calling options" alpha-tooltip-text="Place call">
  <template #alphaIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
</dt-split-button>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `alphaActive` | Determines whether the alpha button should have active styling | `boolean` | `false` |
| `alphaAriaLabel` | Descriptive label for the alpha button | `string` | `null` |
| `alphaIconPosition` | The position of the icon slot within the alpha button. | `string` | `'left'` |
| `alphaLabelClass` | Used to customize the alpha label container | `string\|array\|object` | `''` |
| `alphaDisabled` | HTML button disabled attribute for alpha button only <a class="d-link" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#disabled" target="_blank"> (Reference) </a> | `boolean` | `false` |
| `alphaLoading` | Whether the alpha button should display a loading animation or not. | `boolean` | `false` |
| `alphaTooltipText` | Text shown in tooltip when you hover the alpha button, required if no content is passed to default slot | `string` | `''` |
| `assertiveOnFocus` | Determines whether a screenreader reads live updates of the button content to the user while the button is in focus. | `boolean` | `false` |
| `disabled` | HTML button disabled attribute for both buttons. Use alphaDisabled or omegaDisabled to disable buttons individually. <a class="d-link" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#disabled" target="_blank"> (Reference) </a> | `boolean` | `false` |
| `dropdownPlacement` | The direction the dropdown displays relative to the anchor. | `string` | `'bottom-end'` |
| `importance` | The fill and outline of the button associated with its visual importance. | `string` | `'primary'` |
| `kind` | The color of the button. | `string` | `'default'` |
| `omegaActive` | Determines whether the omega button should have active styling | `boolean` | `false` |
| `omegaAriaLabel` | Descriptive label for the omega button | `string` | `null` |
| `omegaDisabled` | HTML button disabled attribute for omega button only <a class="d-link" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#disabled" target="_blank"> (Reference) </a> | `boolean` | `false` |
| `omegaId` | Element ID, useful in case you need to reference the button as an external anchor for popover. | `string` | `''` |
| `omegaTooltipText` | Text shown in tooltip when you hover the omega button, required as it is an icon only button | `string` | `''` |
| `size` | The size of the button. | `string` | `'md'` |
| `width` | Button width, accepts <a class="d-link" href="https://developer.mozilla.org/en-US/docs/Web/CSS/width" target="_blank"> CSS width attribute </a> values | `string` | `null` |
| `rootClass` | Additional class name for the root element. Can accept all of: String, Object, and Array, i.e. has the same api as Vue's built-in handling of the class attribute. | `string\|object\|array` | `''` |

### Slots

| Name | Description |
| --- | --- |
| `alphaIcon` | Alpha (left) button icon slot |
| `default` | Default content slot |
| `omega` | Omega (right) content slot, overrides omega button styling and functionality completely |
| `omegaIcon` | Omega (right) button icon slot |
| `dropdownList` | Built-in dropdown content slot, use of dt-list-item is highly recommended here. |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `alpha-clicked` | Native alpha button click event | `PointerEvent \| KeyboardEvent` |
| `omega-clicked` | Native omega button click event | `PointerEvent \| KeyboardEvent` |

## Accessibility

In addition to the [Button component's](button.md#accessibility) accessibility documentation:

- An icon-only primary action and the secondary action require a [Tooltip](tooltip.md) to indicate its function.
- While the secondary action is focused, pressing `Enter` or `Space` triggers its action, displaying a [Dropdown component](dropdown.md) or [Popover component](popover.md).

## Classes

| Class | Applies to | Description |
| --- | --- | --- |
| `d-split-btn` | N/A | Base split button style. |
| `d-split-btn__alpha` | N/A | Alpha button style. |
| `d-split-btn__omega` | N/A | Omega button style. |
| `d-split-btn__omega--xs` | .d-split-btn__omega | Applies extra small size. |
| `d-split-btn__omega--sm` | .d-split-btn__omega | Applies small size. |
| `d-split-btn__omega--lg` | .d-split-btn__omega | Applies large size. |
| `d-split-btn__omega--xl` | .d-split-btn__omega | Applies extra large size. |
