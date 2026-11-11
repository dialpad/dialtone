---
title: Dropdown
description: Triggerable menu for actions or choices.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-dropdown--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=10732-69099
keywords: ["select","menu","picker","d-dropdown","DtDropdown","dt-dropdown"]
combinator: DtDropdown
---

## Usage

Use Dropdown for menu actions or persistent menu choices. Use `role="menuitem"` for actions and explicitly choose `role="menuitemradio"` for mutually exclusive persistent choices. Use a native select or [Combobox](/components/combobox.md) for form-value selection; listbox choices keep `role="option"`.

- The dropdown component provides accessibility controls when using with List item component.
- The dropdown has two major pieces that are provided as required named slots: the anchor and the list.
- The **anchor** slot contains the element that controls the dropdown's visibility. It supplies `aria-expanded`, `aria-controls`, and `aria-haspopup` directly as slot props. Bind those three attributes explicitly to the trigger to preserve consumer refs; do not forward the internal `ref` slot prop. `aria-controls` refers to the popup element with `role="menu"`.
- The **list** slot contains a list of items to show as dropdown menu items.

## Variants and Examples

### Default

```vue demo
<dt-dropdown navigation-type="arrow-keys">
  <template #anchor="anchorAttrs">
    <dt-button
      :aria-expanded="anchorAttrs['aria-expanded']"
      :aria-controls="anchorAttrs['aria-controls']"
      :aria-haspopup="anchorAttrs['aria-haspopup']"
    >
      Click to open
    </dt-button>
  </template>
  <template #list="{ close }">
    <dt-list-item
      v-for="(item) in items"
      :key="item.id"
      role="menuitem"
      navigation-type="arrow-keys"
      @click="close"
    >
      {{ item.name }}
    </dt-list-item>
  </template>
</dt-dropdown>
```

### With Sections and Headings

```vue demo
<dt-dropdown navigation-type="arrow-keys">
  <template #anchor="anchorAttrs">
    <dt-button
      :aria-expanded="anchorAttrs['aria-expanded']"
      :aria-controls="anchorAttrs['aria-controls']"
      :aria-haspopup="anchorAttrs['aria-haspopup']"
    >
      Click to open
    </dt-button>
  </template>
  <template #list="{ close }">
    <dt-list-item-group
      heading-class="d-py-50 d-px-100 d-c-default d-fc-tertiary d-label--sm"
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
      heading-class="d-py-50 d-px-100 d-c-default d-fc-tertiary d-label--sm"
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

Set `openOnContext=true` to open the menu on right-click (context menu) and disable the default trigger behavior. This example retains an existing context-menu accessibility gap: the focusable wrapper does not receive the popup ARIA attributes.

```vue demo
<dt-dropdown navigation-type="arrow-keys" :open-on-context="true">
  <template #anchor>
    <div
      class="d-ba d-bas-dashed d-w-400 d-py-600 d-ta-center d-bgc-black-300"
    >
      Right click to open
    </div>
  </template>
  <template #list="{ close }">
    <dt-list-item
      v-for="(item) in items"
      :key="item.id"
      role="menuitem"
      navigation-type="arrow-keys"
      @click="close"
    >
      {{ item.name }}
    </dt-list-item>
  </template>
</dt-dropdown>
```

## Content Mode

Dropdown content renders outside the DOM tree. Use the `contentMode` prop to apply color mode (invert, light, dark) to the positioned content. See [Positioned Components](/components/mode-island.html#positioned-components) for details.

```vue demo
<dt-dropdown content-mode="invert" navigation-type="arrow-keys" placement="bottom-start">
  <template #anchor="anchorAttrs">
    <dt-button
      :aria-expanded="anchorAttrs['aria-expanded']"
      :aria-controls="anchorAttrs['aria-controls']"
      :aria-haspopup="anchorAttrs['aria-haspopup']"
      :size="200"
      kind="muted"
      importance="outlined"
    >
      Inverted Dropdown
      <template #endIcon="{ iconSize }">
        <dt-icon-chevron-down :size="iconSize" />
      </template>
    </dt-button>
  </template>
  <template #list="{ close }">
    <dt-list-item role="menuitem" @click="close">Option 1</dt-list-item>
    <dt-list-item role="menuitem" @click="close">Option 2</dt-list-item>
    <dt-list-item role="menuitem" @click="close">Option 3</dt-list-item>
  </template>
</dt-dropdown>
<!-- @code -->
<dt-dropdown content-mode="invert">...</dt-dropdown>
<dt-dropdown content-mode="dark">...</dt-dropdown>
<dt-dropdown content-mode="light">...</dt-dropdown>
```

## Persistent Menu Choices

Menu radio choices require `menuitemradio` support in both ListItem and Dropdown. Older packages, including `@dialpad/dialtone` 10.5.1, do not include this API. Check the supported roles in your installed package before adopting this pattern.

The parent owns the committed sort order. Each radio row uses `selected` for its checkmark and `aria-checked`; arrows and typeahead move focus without changing that state. ListItemGroup supplies an optional heading inside the menu. Ordinary action rows can share the menu and keep `menuitem`.

<!-- @example {"id":"examples/docs/components/dropdown/persistent-menu-choices","exclude":{"reason":"The dt10-pinned profile uses @dialpad/dialtone 10.5.1, which lacks menuitemradio checked state and navigation. Re-enable after a published compatible release, a compatible fixture profile, and consumer build, API, keyboard and accessibility qualification.","owner":"DLT-3738"}} -->

```vue demo
<dt-dropdown>
  <template #anchor="anchorAttrs">
    <dt-button
      :aria-expanded="anchorAttrs['aria-expanded']"
      :aria-controls="anchorAttrs['aria-controls']"
      :aria-haspopup="anchorAttrs['aria-haspopup']"
    >
      Sort order
    </dt-button>
  </template>
  <template #list="{ close }">
    <dt-list-item-group heading="Sort order">
      <dt-list-item
        role="menuitemradio"
        navigation-type="arrow-keys"
        :selected="newestFirst"
        @click="newestFirst = true; close()"
      >
        Newest first
      </dt-list-item>
      <dt-list-item
        role="menuitemradio"
        navigation-type="arrow-keys"
        :selected="!newestFirst"
        @click="newestFirst = false; close()"
      >
        Oldest first
      </dt-list-item>
    </dt-list-item-group>
  </template>
</dt-dropdown>
<!-- @code -->
<script setup>
import { ref } from 'vue';
import { DtButton, DtDropdown, DtListItem, DtListItemGroup } from '@dialpad/dialtone-vue';

const newestFirst = ref(true);
</script>

<template>
  <dt-dropdown>
    <template #anchor="anchorAttrs">
      <dt-button
        :aria-expanded="anchorAttrs['aria-expanded']"
        :aria-controls="anchorAttrs['aria-controls']"
        :aria-haspopup="anchorAttrs['aria-haspopup']"
      >
        Sort order
      </dt-button>
    </template>
    <template #list="{ close }">
      <dt-list-item-group heading="Sort order">
        <dt-list-item
          role="menuitemradio"
          navigation-type="arrow-keys"
          :selected="newestFirst"
          @click="newestFirst = true; close()"
        >
          Newest first
        </dt-list-item>
        <dt-list-item
          role="menuitemradio"
          navigation-type="arrow-keys"
          :selected="!newestFirst"
          @click="newestFirst = false; close()"
        >
          Oldest first
        </dt-list-item>
      </dt-list-item-group>
    </template>
  </dt-dropdown>
</template>
```

## Logical Visibility and Controlled Arrow Keys

Set `:visibility-change-callback="handleVisibilityChange"` to receive the open boolean synchronously when logical visibility changes, before the animation completes. With initial `open=true`, the callback runs during creation, before mount; the menu exposes `aria-hidden="false"`. No callback means no logical notification. Dropdown does not declare or emit `open-change`, preserving existing DOM listeners and wrapper notifications.

The callback runs inside a synchronous Vue watcher. An already-closed modal with no pending transition or retained scroll lock can be removed immediately. For an open or closing modal, keep `modal=true`, its anchor and its scroll container unchanged through the closing `opened(false)` notification: request closure if needed, then remove it after that notification. Changing `modal` or the anchor's scroll context after opening can leave the original lock active. `opened(false)` reports transition completion, not ownership of global scroll locks. Logical `open=false` alone does not establish that the leave transition has completed. Separately, defer a direct `app.unmount()` with `nextTick` to avoid interrupting Vue's render during prop delivery.

`opened` and `update:open` report current completed transitions. Opening finishes initial focus before notifying listeners, so focus chosen by an `opened` listener is preserved. Stale completions do not notify. `open=null` emits no `update:open`.

With a boolean `open` prop, anchor arrows remain silent by default. Set `forwardAnchorArrowKeys` to forward ArrowUp/ArrowDown through `keydown` without automatically toggling. On a closed opted-in Dropdown, the consumer decides whether to open and whether to prevent the key's default action; the event continues to ancestor listeners. To start with focus on the first navigable row, accept opening synchronously in Dropdown's own emitted `keydown` callback. An ancestor DOM listener or a delayed update does not carry that focus guarantee. The callback also receives content key events, so check that the event target belongs to the anchor before requesting opening; closing-content arrows must not reopen the menu. Ignored arrows do not make a later pointer opening behave like a keyboard opening. Once open, normal Dropdown navigation and key prevention apply.

## Accessibility

The list wrapper uses `role="none"` to preserve the containing menu context. Use explicit `menuitem` rows for actions and `menuitemradio` for persistent single choices; `listitem` and listbox `option` rows are not Dropdown menu patterns. Hovering headings does not move menu focus or change checked state.

A screen reader visible only close button is added by default.

The dropdown surface has `role="menu"`; action rows use `menuitem` and persistent mutually exclusive choices use `menuitemradio`. See [W3C guidelines](https://www.w3.org/WAI/ARIA/apg/#menubutton) for more information.

### List

The positioned surface supplies `role="menu"`. Its `<ul role="none">` list wrapper adds no implicit list role between that menu and its rows. Use `menuitem` for actions and `menuitemradio` for persistent mutually exclusive choices; optional ListItemGroup headings keep their labelled `group` context. Use [List Item](/components/list-item.md) for the row interactions.

### Focus & Keyboard

A dropdown menu has well defined standard [keyboard interactions](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/examples/menu-button-links/#kbd_label) that it should support. The focus will be set to the the active item on keyboard navigation. `UP` and `DOWN` arrows move the highlighted selection between the list items. `HOME` and `END` keys will jump straight to the first or the last item. Once the beginning or the end of the list is reached the selection will move to the opposite end of the list by default. If you want custom behavior you can pass `onBeginningOfList` and `onEndOfList` methods as props. `A-Z` keys will cycle through items that start with the corresponding letter.

Pressing `ESC` key while the dropdown has focus will emit an **escape** event and will close the menu. When the **highlight** selection changes, a highlight event is emitted with the index of the currently highlighted item. `SPACE` key will open the dropdown if it's closed and select the item when it's pressed on a list item.

The shared keyboard-navigation mixin accepts a string or array of roles through `listItemRole`; its default remains `option`. Dropdown collects `menuitem` and `menuitemradio` in document order. Built-in ListItem IDs are generated and remain stable. Use `li` rows for pointer-driven Dropdown navigation. A hand-authored `menuitemradio` must have a nonempty unique ID to participate; id-less radio rows are excluded. Non-`li` rows retain their existing pointer behavior: hover does not transfer menu focus or emit `highlight`. Headings and separators stay outside the navigable collection. Hovering an ID-bearing group heading clears the navigation highlight and emits `highlight(-1)` without moving focus or changing the checked choice. Direct calls to the exported mixin's `setHighlightId` retain legacy behavior: a nonempty ID is stored even before its row renders; an unmatched ID in a rendered collection clears the highlighted index.

<script setup>
import { DtIconChevronDown } from '@dialpad/dialtone-icons/vue';
import { ref } from 'vue';

const newestFirst = ref(true);

const items = [
  { name: 'Menu item 1', id: 1 },
  { name: 'Menu item 2', id: 2 },
  { name: 'Another menu item 1', id: 3 },
  { name: 'Menu item 3', id: 4 },
  { name: 'Another menu item 2', id: 5 },
];
</script>

## Vue API

<component-vue-api component-name="dropdown" :also-import="['dropdownseparator']" />
