# Collapsible

A collapsible is a component consisting of an interactive anchor that toggled the expandable/collapsible element.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-collapsible--default
- **Keywords**: accordion, expand, collapse, toggle content, d-collapsible, DtCollapsible, dt-collapsible, disclosure, expandable

The collapsible component consists of two parts: the anchor and the content. If the anchor slot is not filled, the anchor will default to a basic button with text. The content must be provided and is the element that can be hidden or shown when the anchor is clicked.

### Basic Usage Without Anchor Slot

```vue
<dt-collapsible
  anchorText="Click me to toggle Content"
>
  <template #content>
    <div>Content slot</div>
  </template>
</dt-collapsible>
```

### With Anchor Slot

```vue
<dt-collapsible :open="isOpen">
  <template #anchor>
    <dt-button @click="toggleIsOpen">
      Click Me!
    </dt-button>
  </template>
  <template #content>
    <div>
      This will be shown in the expanded area.
    </div>
  </template>
</dt-collapsible>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `anchorText` | Text that is displayed on the anchor if nothing is passed in the slot. Ignored if the anchor slot is used. | `string` | `null` |
| `open` | Controls whether the collapsible is shown. Leaving this null will have the collapsible start expanded and trigger on click by default. If you set this value, the default trigger behavior will be disabled, and you can control it as you need. Supports .sync modifier | `boolean` | `null` |
| `id` | The id of the content wrapper. | `string` | `(function)` |
| `elementType` | HTML element type (tag name) of the root element of the component. | `string` | `'div'` |
| `contentElementType` | HTML element type (tag name) of the content wrapper element. | `string` | `'div'` |
| `anchorClass` | Additional class name for the anchor wrapper element. | `string\|array\|object` | `null` |
| `contentClass` | Additional class name for the content wrapper element. | `string\|array\|object` | `null` |
| `maxWidth` | The maximum width of the anchor and collapsible element. Possible units rem\|px\|%\|em | `string` | `null` |
| `maxHeight` | The maximum height of the collapsible element. Possible units rem\|px\|%\|em | `string` | `null` |
| `ariaLabel` | Label on the collapsible content. Should provide this or ariaLabelledBy but not both. | `string` | `null` |
| `ariaLabelledBy` | Id of the element that labels the collapsible content. Defaults to the anchor element. Should provide this or ariaLabel but not both. | `string` | `null` |

### Slots

| Name | Description |
| --- | --- |
| `anchor` | Slot for the anchor element that toggles the collapsible content |
| `content` | Slot for the collapsible element that is expanded by the anchor |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `update:open` | Event fired to sync the open prop with the parent component | `undefined` |
| `opened` | Event fired when the content is shown or hidden | `Boolean` |
