# Item Layout

An item layout provides a standardized group of containers to enable developer to use list-item like stack. It is used as base for `dt-list-item` component

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-item-layout--default
- **Keywords**: list layout,item structure,d-item-layout,DtItemLayout,dt-item-layout

## With Default Styling

By default, item layout includes custom styling, like paddings, sizes, colors, etc.

```vue
<dt-item-layout>
  <template #left>
    <dt-icon name="lock" />
  </template>
  Layout title
  <template #subtitle>
    Subtitle
  </template>
  <template #bottom>
    <dt-badge>Content</dt-badge>
  </template>
  <template #right>
    <dt-icon name="share" />
  </template>
  <template #selected>
    <dt-icon name="check" />
  </template>
</dt-item-layout>
```

## Without Styling

Setting the `unstyled` property will add `d-item-layout--custom` class. This will change the item-layout from flexbox to grid, removing all the custom styling while maintaining the slots positions.

This way you can utilize the layout and customize your own styling using utility classes.

```vue
<dt-item-layout unstyled>
  <template #left>
    <dt-icon name="lock" />
  </template>
  Layout title
  <template #subtitle>
    Subtitle
  </template>
  <template #bottom>
    <dt-badge>Content</dt-badge>
  </template>
  <template #right>
    <dt-icon name="share" />
  </template>
  <template #selected>
    <dt-icon name="check" />
  </template>
</dt-item-layout>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `as` | Set this prop to render layout as a specific HTML element. | `string` | `'div'` |
| `unstyled` | Set this prop to remove the default styling. | `boolean` | `false` |
| `leftClass` | Set the class for the left section. | `string` | `''` |
| `contentClass` | Set the class for the content section. | `string` | `''` |
| `titleClass` | Set the class for the title section. | `string` | `''` |
| `subtitleClass` | Set the class for the subtitle section. | `string` | `''` |
| `bottomClass` | Set the class for the bottom section. | `string` | `''` |
| `rightClass` | Set the class for the right section. | `string` | `''` |
| `selectedClass` | Set the class for the selected section. | `string` | `''` |

### Slots

| Name | Description |
| --- | --- |
| `left` | Slot for left content |
| `default` | Slot for main content |
| `subtitle` | Slot for content below main content |
| `bottom` | Slot for content below subtitle |
| `right` | Slot for right content |
| `selected` | Slot for selected icon |
