# List Item Group

The "List Item Group" component uses a non interactive heading which groups list items.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-list-item-group--default
- **Keywords**: list group, list items, d-list-item-group, DtListItemGroup, dt-list-item-group, menu list, option list

## Base Style

You should use this component when you have multiple list items you would like to group into different categories.

The heading is unstyled by default. You will likely have to pass utility classes to the heading-class prop to make the heading look how you wish.

```vue
<dt-list-item-group
  heading="Example Heading"
  heading-class="d-fw-bold"
>
  <dt-list-item
    navigation-type="tab"
  >
    item1
  </dt-list-item>
  <dt-list-item
    navigation-type="tab"
  >
    item2
  </dt-list-item>
  <dt-list-item
    navigation-type="tab"
  >
    item3
  </dt-list-item>
</dt-list-item-group>
```

## Accessibility

The List Item Group does not implement arrow-keys keyboard navigation. You will however get arrow-keys keyboard navigation when using this within list based Dialtone components such as Dropdown or Combobox.

The aria label for the List Item Group will be set by the content of the heading.

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `id` | Id of the List Item Group | `string` | `(function)` |
| `heading` | List's heading. | `string` | `''` |
| `headingClass` | Additional class to style the heading | `string\|array\|object` | `''` |
| `listClass` | Additional class for the wrapper list element. | `string\|array\|object` | `''` |

### Slots

| Name | Description |
| --- | --- |
| `headingSlot` | Slot for heading, will override heading prop. |
| `default` | Slot for the list component |
