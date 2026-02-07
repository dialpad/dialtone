# Dropdown

A Dropdown presents a list of options or actions.

- **Status**: planned
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-dropdown--default
- **Keywords**: select,menu,picker,d-dropdown,DtDropdown,dt-dropdown

## Usage

Use the Dropdown component when you have a list of links or actions that can be performed. Use the [Select Menu](./select-menu.md) component to allow the users to choose one option from the list.

- The dropdown component provides accessibility controls when using with List item component.
- The dropdown has two major pieces that are provided as required named slots: the anchor and the list.
- The **anchor** slot contains the element that controls the dropdown's visibility.
- The **list** slot contains a list of items to show as dropdown menu items.

## Variants and Examples

### Default

```vue
<dt-dropdown navigation-type="arrow-keys">
  <template #anchor="{ attrs }">
    <dt-button v-bind="attrs">
      Click to open
    </dt-button>
  </template>
  <template #list="{ close }">
    <dt-list-item
      v-for="(item) in items"
      :key="item.id"
      role="menuitem"
      :navigation-type="arrow-keys"
      @click="close"
    >
      {{ item.name }}
    </dt-list-item>
  </template>
</dt-dropdown>
```

### With Sections and Headings

```vue
<dt-dropdown navigation-type="arrow-keys">
  <template #anchor="{ attrs }">
    <dt-button v-bind="attrs">
      Click to open
    </dt-button>
  </template>
  <template #list="{ close }">
    <dt-list-item-group
      heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
      heading="Menu Heading A"
    >
      <dt-list-item
        role="menuitem"
        navigation-type="arrow-keys"
        @click="close"
      >
        Menu Item 1
      </dt-list-item>
      <dt-dropdown-separator />
      <dt-list-item
        role="menuitem"
        navigation-type="arrow-keys"
        @click="close"
      >
        Menu Item 2
      </dt-list-item>
    </dt-list-item-group>
    <dt-dropdown-separator />
    <dt-list-item-group
      heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
      heading="Menu Heading B"
    >
      <dt-list-item
        role="menuitem"
        navigation-type="arrow-keys"
        @click="close"
      >
        Menu Item 3
      </dt-list-item>
    </dt-list-item-group>
  </template>
</dt-dropdown>
```

### Context Menu

Set `openOnContext=true` to open the menu on right-click (context menu) and disable the default trigger behavior.

```vue
<dt-dropdown navigation-type="arrow-keys" :open-on-context="true">
  <template #anchor="{ attrs }">
    <div
      v-bind="attrs"
      class="d-ba d-bas-dashed d-w264 d-py48 d-ta-center d-bgc-black-300"
    >
      Right click to open
    </div>
  </template>
  <template #list="{ close }">
    <dt-list-item
      v-for="(item) in items"
      :key="item.id"
      role="menuitem"
      :navigation-type="arrow-keys"
      @click="close"
    >
      {{ item.name }}
    </dt-list-item>
  </template>
</dt-dropdown>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `open` | Controls whether the dropdown is shown. Leaving this null will have the dropdown trigger on click by default. If you set this value, the default trigger behavior will be disabled and you can control it as you need. Supports v-model | `boolean` | `null` |
| `openOnContext` | Opens the dropdown on right click (context menu). If you set this value to `true`, the default trigger behavior will be disabled. | `boolean` | `false` |
| `padding` | Vertical padding size around the list element. | `string` | `'small'` |
| `modal` | Determines modal state, dropdown has a modal overlay preventing interaction with elements below it, but it is invisible. | `boolean` | `true` |
| `contentWidth` | Width configuration for the popover content. When its value is 'anchor', the popover content will have the same width as the anchor. | `string` | `null` |
| `maxHeight` | Determines maximum height for the popover before overflow. Possible units rem\|px\|em | `string` | `''` |
| `maxWidth` | Determines maximum width for the popover before overflow. Possible units rem\|px\|%\|em | `string` | `''` |
| `listId` | Sets an ID on the list element of the component. Used by several aria attributes as well as when deriving the IDs for each item. | `string` | `(function)` |
| `navigationType` | The type of navigation that this component should support. - "arrow-keys" for items that are navigated with UP/DOWN keys. - "tab" for items that are navigated using the TAB key. - "none" for static items that are not interactive. | `string` | `LIST_ITEM_NAVIGATION_TYPES.ARROW_KEYS` |
| `fallbackPlacements` | If the dropdown does not fit in the direction described by "placement", it will attempt to change it's direction to the "fallbackPlacements". | `array` | `['auto']` |
| `placement` | The direction the dropdown displays relative to the anchor. | `string` | `'bottom'` |
| `onBeginningOfList` | A method that will be called when the selection goes past the beginning of the list. | `func` | `null` |
| `onEndOfList` | A method that will be called when the selection goes past the end of the list. | `func` | `null` |
| `listClass` | Additional class for the wrapper list element. | `string\|array\|object` | `''` |
| `appendTo` | Sets the element to which the popover is going to append to. 'body' will append to the nearest body (supports shadow DOM). | `HTMLElement\|string` | `'body'` |
| `tether` | If set to false the dialog will display over top of the anchor when there is insufficient space. If set to true it will never move from its position relative to the anchor and will clip instead. <a class="d-link" href="https://popper.js.org/docs/v2/modifiers/prevent-overflow/#tether" target="_blank" > Popper.js docs </a> | `boolean` | `true` |
| `transition` | Named transition when the content display is toggled. | `string` | `'fade'` |

### Slots

| Name | Description |
| --- | --- |
| `anchor` | Anchor element that activates the dropdown |
| `list` | Slot for the list component |
| `footer` | Slot for the footer content |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| `keydown` | Native keydown event | `KeyboardEvent` |
| `highlight` | Event fired when the highlight changes | `Number` |
| `update:open` | Event fired to sync the open prop with the parent component | `undefined` |
| `opened` | Event fired when dropdown is shown or hidden | `Boolean \| Array` |

## Accessibility

A screen reader visible only close button is added by default.

The dropdown menu has a role of "menu" and the list items have a role "menuitem". See [W3C guidelines](https://www.w3.org/WAI/ARIA/apg/#menubutton) for more information.

### List

The Dropdown is rendered with semantic `<ul>` and `<li>`. The list slot is wrapped in `<ul>` element so make sure the items are wrapped in `<li>` element and each item has the menuitem role. It is recommended to use the [List Item component](./list-item.md) as it supports all the necessary accessibility props and interactions.

### Focus & Keyboard

A dropdown menu has well defined standard [keyboard interactions](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/examples/menu-button-links/#kbd_label) that it should support. The focus will be set to the the active item on keyboard navigation. `UP` and `DOWN` arrows move the highlighted selection between the list items. `HOME` and `END` keys will jump straight to the first or the last item. Once the beginning or the end of the list is reached the selection will move to the opposite end of the list by default. If you want custom behavior you can pass `onBeginningOfList` and `onEndOfList` methods as props. `A-Z` keys will cycle through items that start with the corresponding letter.

Pressing `ESC` key while the dropdown has focus will emit an **escape** event and will close the menu. When the **highlight** selection changes, a highlight event is emitted with the index of the currently highlighted item. `SPACE` key will open the dropdown if it's closed and select the item when it's pressed on a list item.
