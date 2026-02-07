# Combobox

A combobox is a semantic component that displays an input element combined with a listbox, which enables the user to select items from the list.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-combobox--default
- **Keywords**: autocomplete,typeahead,search select,d-combobox,DtCombobox,dt-combobox

## Base Style

A combobox provides accessibility controls and common functionality. It does not render any functioning UI on it's own, but it depends on the elements passed to it via slots.

It has 2 core required slots:

1. `input`: contains the input element controlling the list. This will usually be the [Input component](./input.md).
2. `list`: the list of items to display responding to `input`'s value. Almost always this will be a list of `dt-list-item`.
This will usually be the [List Item component](./list-item.md).

```vue
<dt-combobox
  :show-list="!!value"
  label="Label Text"
  @escape="onComboboxEscape"
  @select="onComboboxSelect"
>
  <template
    #input="{ inputProps }"
  >
    <dt-input
      placeholder="Type to show the items"
      v-model="value"
      v-bind="inputProps"
    />
  </template>
  <template
    #list="{ listProps }"
  >
    <ol
      v-bind="listProps"
      class="d-p0 d-mt8 d-hmx332 d-of-y-auto"
    >
      <dt-list-item
        v-for="(item, i) in items"
        :key="item.id"
        role="option"
        navigation-type="arrow-keys"
        @click="onListItemSelect(i)"
      >
        <template #left>
          <dt-avatar
            :full-name="(i + 1).toString()"
            :seed="i.toString()"
          />
        </template>
        {{ item.name }}
      </dt-list-item>
    </ol>
  </template>
</dt-combobox>
```

## With Empty List Item

```vue
<dt-combobox
  :show-list="!!value"
  label="Label Text"
  @escape="onComboboxEscape"
  @select="onComboboxSelect"
  :empty-list="true"
>
  <template
    #input="{ inputProps }"
  >
    <dt-input
      placeholder="Type to show the items"
      v-model="value"
      v-bind="inputProps"
    />
  </template>
  <template #emptyListItem>
    <div class="d-py8 d-fc-tertiary">No matches found.</div>
  </template>
</dt-combobox>
```

## Accessibility

The combobox input has a role of "combobox", the list has a role "listbox" and the list items have a role "option".
Depending on the use case, the user should be able to use `ESC` key to hide the list and/or empty the input's value,
but this is not determined by the combobox.

When `loading` prop is set to `true`, the list also has the `aria-busy` attribute set to true.

See [W3C guidelines](https://www.w3.org/WAI/ARIA/apg/) for more information.

### Input

The input element should be fully accessible by keyboard. The easiest way to do this is by using an element like a `DtInput` that is already accessible. There are some required ARIA attributes for the input element. To make this as straightforward as possible, these ARIA attributes are passed with the correct values as the `inputProps` slot prop of the input slot.

### List

The list element mainly has to contain the correct ARIA attributes, which are passed as `listProps` slot prop of the list slot.
The combobox has a prop `listAriaLabel` that should be passed as it is used to describe the contents of the list. The list itself can be a Dialtone component or a native HTML element, such as `<ol></ol>`.

### List Item

The list item should be compatible with keyboard navigation. It is recommended to use `DtListItem` component as it supports all the necessary accessibility props and interactions.

### Focus & Keyboard

A combobox has well defined standard keyboard interactions that it should support. Only the input element should receive focus and the list items are not focusable. However, while the input has focus `UP` and `DOWN` arrows move the highlighted selection between the list items. `HOME` and `END` keys will jump straight to the first or the last item. Once the beginning or the end of the list is reached the selection will move to the opposite end of the list by default. If you want custom behavior you can pass `onBeginningOfList` and `onEndOfList` methods as props.

Pressing `ESC` key while the input has focus will emit an **escape** event that has to be handled based on the use case. Commonly the `ESC` key might hide the list or empty the input. `ENTER` key will emit a **select** event with the index of the currently highlighted list item. When the highlight selection changes, a **highlight** event is emitted with the index of the currently highlighted item.

When `loading` prop is set to `true`, only `ESC` key will emit an **escape** event.

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `label` | String to use for the input label. | `string` | `''` |
| `labelVisible` | Determines visibility of input label. | `boolean` | `true` |
| `size` | Size of the input, one of `xs`, `sm`, `md`, `lg`, `xl` | `string` | `null` |
| `description` | Description for the input | `string` | `''` |
| `listId` | Sets an ID on the list element of the component. Used by several aria attributes as well as when deriving the IDs for each item. | `string` | `(function)` |
| `onBeginningOfList` | A method that will be called when the selection goes past the beginning of the list. | `func` | `null` |
| `onEndOfList` | A method that will be called when the selection goes past the end of the list. | `func` | `null` |
| `showList` | Determines when to show the list element and also controls the aria-expanded attribute. | `boolean` | `false` |
| `listRenderedOutside` | If the list is rendered outside the component, like when using popover as the list wrapper. | `boolean` | `false` |
| `loading` | Determines when to show the skeletons and also controls aria-busy attribute. | `boolean` | `false` |
| `emptyList` | Sets the list to an empty state, and displays the message from prop `emptyStateMessage`. | `boolean` | `false` |
| `emptyStateMessage` | Message to show when the list is empty | `string` | `''` |
| `emptyStateClass` | Additional class name for the empty list element. Can accept all of: String, Object, and Array, i.e. has the same api as Vue's built-in handling of the class attribute. | `string\|object\|array` | `''` |
| `clickOnSelect` | Programmatically click on the active list item element when a selection comes from keyboard navigation, i.e. pressing the "Enter" key. | `boolean` | `false` |

### Slots

| Name | Description |
| --- | --- |
| `input` | Slot for the combobox input element |
| `emptyListItem` |  |
| `list` | Slot for the combobox list element |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `select` | Event fired when item selected | `Number` |
| `escape` | Event fired when pressing escape | `` |
| `highlight` | Event fired when the highlight changes | `Number` |
| `opened` | Event fired when list is shown or hidden | `Boolean` |
