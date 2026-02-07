# List item

A list item is an element that can be used to represent individual items in a list.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-list-item--default
- **Keywords**: list element, d-list-item, DtListItem, dt-list-item

## Base Style

A list item provides accessibility controls and common functionality. The component uses child components that provide styling and slots for different types of list items. If you want to create a custom list item you can pass a type "custom", which will let you define the structure of the content.

The default list item has 5 slots that can be used for the most common use cases, **left**, **right**, **default**, **subtitle** and **bottom** slot. All of the slots are optional.

The **left** slot can contain content, such as an avatar, that will be positioned to the left of the main content.

The **right** slot works the same way, but its contents are placed to the right of the main slot.

The **default** slot contains the main content of the list item.

The **subtitle** slot can be used to display content below the default slot. The slot has smaller text size and lighter color than default slot.

The **bottom** slot can be used to display content below the subtitle slot.

```vue
<ul>
  <dt-list-item navigation-type="tab">
    <template #left>
      <dt-icon name="check" />
    </template>
    <span>Default List Item</span>
    <template #subtitle>
      Description
    </template>
    <template #bottom>
      <dt-badge text="Label" />
    </template>
    <template #right>
      <dt-icon name="external-link" />
    </template>
  </dt-list-item>
</ul>
```

## Variants

### Custom List Item

When `type` is set to "custom" the list item will not render any styles or slots. This type can be used when the list item has to support content that does not work with the default structure.

```vue
<ul>
  <dt-list-item
    navigation-type="tab"
    type="custom"
  >
    <dt-stack direction="row" align="center" justify="between" class="d-py8 d-px12">
      <div>
        <time
          class="d-fs-100 d-pr12"
          datetime="10:00"
        >
          10:00
        </time>
        <span class="d-fs-200">
          Custom List Item Example
        </span>
      </div>
      <dt-stack direction="row" class="d-p6 d-tn8 d-r12 d-bgc-white d-bar4 d-bs-md">
        <dt-button
          class="d-p4 d-py8"
          importance="clear"
          title="share"
        >
          <template #icon>
            <dt-icon
              name="share-2"
              size="200"
            />
          </template>
        </dt-button>
        <dt-button
          class="d-p4 d-py8 d-ml4"
          importance="clear"
          title="star"
        >
          <template #icon>
            <dt-icon
              name="star"
              size="200"
            />
          </template>
        </dt-button>
        <dt-button
          class="d-p4 d-py8 d-ml4"
          importance="clear"
          title="more"
        >
          <template #icon>
            <dt-icon
              name="more-vertical"
              size="200"
            />
          </template>
        </dt-button>
      </dt-stack>
      </dt-stack>
  </dt-list-item>
</ul>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `id` | Id for the item. | `string` | `(function)` |
| `role` | String to use for the item's role. | `string` | `'listitem'` |
| `elementType` | HTML element type (tag name) of the content wrapper element. | `string` | `'li'` |
| `type` | The type of child list item to use. | `string` | `LIST_ITEM_TYPES.DEFAULT` |
| `navigationType` | The type of navigation that this component should support. - "arrow-keys" for items that are navigated with UP/DOWN keys. - "tab" for items that are navigated using the TAB key. - "none" for static items that are not interactive. | `string` | `LIST_ITEM_NAVIGATION_TYPES.NONE` |
| `selected` | Applies selected styles to the list item | `boolean` | `false` |
| `wrapperClass` | Additional Classes to apply to the wrapper element, note: it only applies on "default" type Can accept all of: String, Object, and Array, i.e. has the same api as Vue's built-in handling of the class attribute. | `string\|object\|array` | `''` |

### Slots

| Name | Description |
| --- | --- |
| `slotName` | named slots for custom list items |
| `default` | slot for the main content |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `click` | Native click event | `PointerEvent \| KeyboardEvent` |
| `keydown` | Key down event | `KeyboardEvent` |
| `mousemove` | Native mouse move event | `MouseEvent` |
| `mouseleave` | Native mouse leave event | `MouseEvent` |
