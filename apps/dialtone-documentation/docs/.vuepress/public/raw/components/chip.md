# Chip

A Chip is a compact UI element that provides brief, descriptive information about an element. It is terse, ideally one word.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-chip--default
- **Keywords**: tag, pill, token, badge, d-chip, DtChip, dt-chip, filter chip, choice chip

## Variants and Examples

### Non Interactive

Add `:interactive="false"` to make it a read-only, non-interactive Chip. This changes it from a `<button>` to a non-interactive, read-only Chip with no events or hover/active state. Note that this does not effect the interactivity of its `×` remove button.

```vue
<dt-chip :interactive="false">
  Chip
</dt-chip>
```

### Default

```vue
<dt-chip>
  Chip
</dt-chip>
```

### Disabled

Use the `disabled` prop to disable both the Chip and its close button. This sets `aria-disabled="true"` and `tabindex="-1"` on the interactive elements and applies disabled styles, preventing pointer and keyboard interaction.

```vue
<dt-chip disabled>
  Chip
</dt-chip>
```

### Without Close Button

```vue
<dt-chip :hide-close="true">
  Chip
</dt-chip>
```

### With Icon

```vue
<dt-chip :hide-close="true">
  <template #icon>
    <dt-icon
      name="phone"
      size="200"
    />
  </template>
  <template #default>
    Chip
  </template>
</dt-chip>
```

### With Icon and Close Button

```vue
<dt-chip>
  <template #icon>
    <dt-icon
      name="phone"
      size="200"
    />
  </template>
  <template #default>
    Chip
  </template>
</dt-chip>
```

### With Avatar and Close Button

```vue
<dt-chip>
  <template #avatar>
    <dt-avatar
      image-src="/assets/images/person.png"
      image-alt="Jaqueline Nackos"
      full-name="Jaqueline Nackos"
    />
  </template>
  <template #default>
    Chip
  </template>
</dt-chip>
```

### Truncated

To truncate text, add `.d-truncate` to the content element, and set the width of the `.d-chip` element.

```vue
<dt-chip content-class="d-w102">
  <span class="d-chip__text d-truncate">Chip loooooong name</span>
</dt-chip>
```

### Sizes

```vue
<dt-chip :interactive="false" size="xs">
  chip
</dt-chip>
<dt-chip :interactive="false" size="sm">
  chip
</dt-chip>
<dt-chip :interactive="false">
  chip
</dt-chip>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `disabled` | Whether the chip is disabled | `boolean` | `false` |
| `hideClose` | Hides the close button on the chip | `boolean` | `false` |
| `size` | The size of the chip. | `string` | `'md'` |
| `interactive` | The interactivity of the chip. Makes chip clickable, apply hover/focus/active style, emit keyboard events etc. | `boolean` | `true` |
| `id` | Id to use for the dialog's aria-labelledby. | `string` | `(function)` |
| `ariaLabel` | Descriptive label for the chip content. If this prop is unset the content in the default slot will be used as an aria-label. | `string` | `''` |
| `contentClass` | Additional class name for the chip element. | `string\|array\|object` | `''` |
| `labelClass` | Additional class name for the span element. | `string\|array\|object` | `''` |

### Slots

| Name | Description |
| --- | --- |
| `icon` | slot for Chip icon |
| `avatar` | slot for Chip avatar |
| `default` | slot for Content within chip |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `close` | Close button click event | `` |
| `click` | Native chip click event | `PointerEvent \| KeyboardEvent` |
| `keyup` | Native chip key up event | `KeyboardEvent` |
| `keydown` | Native chip key down event | `KeyboardEvent` |

## Classes

| Class | Applies to | Description |
| --- | --- | --- |
| `d-chip` | N/A | Container for the chip button and close button elements. |
| `d-chip__label` | N/A | Default chip styling |
| `d-chip__label--sm` | .d-chip | Applies small size. |
| `d-chip__label--xs` | .d-chip | Applies extra small size. |
| `d-chip__close` | N/A | Applies positioning and styling for the chip close button. |
| `d-chip__close--sm` | .d-chip-close-btn | Small close button. |
| `d-chip__close--xs` | .d-chip-close-btn | Extra small close button. |
| `d-chip__icon` | N/A | Applies positioning and styling for the chip icon. |

[//]: # (## Accessibility)
[//]: # (Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi massa ante, tempus vitae lacus id, luctus tristique lorem. Mauris feugiat massa ex, id aliquet mi tempor non. Curabitur non tristique lectus. Fusce ut nisl non diam dignissim viverra. In posuere dui arcu, sed eleifend massa faucibus sed. Phasellus quis leo vitae erat pellentesque venenatis id vitae lectus. Suspendisse convallis, metus a congue tincidunt, velit sem tincidunt dui, eget auctor ipsum ipsum in ex. Nullam lobortis, mauris vel vestibulum rutrum, lorem elit vehicula est, nec viverra ante erat nec dolor. Proin at placerat tortor. Nam ullamcorper metus et eros porta, at lacinia leo scelerisque. Curabitur finibus sollicitudin odio tempor finibus. Donec lobortis metus vitae mollis gravida.)
