---
title: Dropdown
description: A Dropdown presents a list of options or actions.
status: planned
thumb: true
image: assets/images/components/dropdown.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-dropdown--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=10732%3A69099
---

<code-well-header>
  <dt-dropdown navigation-type="arrow-keys">
    <template #anchor="{ attrs }">
      <dt-button v-bind="attrs">
        Click to Open
      </dt-button>
    </template>
    <template #list="{ close }">
      <dt-list-item-group
        heading-class="d-py4 d-px8 d-fw-semibold d-c-default"
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
        heading-class="d-py4 d-px8 d-fw-semibold d-c-default"
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
</code-well-header>

## Usage

Use the Dropdown component when you have a list of links or actions that can be performed. Use the [Select Menu](/components/select-menu.html) component to allow the users to choose one option from the list.

- The dropdown component provides accessibility controls when using with List item component.
- The dropdown has two major pieces that are provided as required named slots: the anchor and the list.
- The **anchor** slot contains the element that controls the dropdown's visibility.
- The **list** slot contains a list of items to show as dropdown menu items.

## Variants and examples

### Default

<code-well-header>
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
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <div class="d-popover">
    <div id="DtPopover__anchor2">
      <button class="base-button__button d-btn d-btn--primary">
        <span class="d-btn__label base-button__label"> Click to open </span>
      </button>
    </div>
  </div>
</div>
<div class="tippy-box d-ps-absolute" data-tippy-root="" id="tippy-13" data-popper-placement="bottom" style="...">
  <div id="dt7" role="menu" aria-hidden="false" aria-labelledby="DtPopover__anchor8" aria-modal="false" class="d-popover__dialog d-popover__dialog--modal" tabindex="-1" style="...">
    <div class="d-popover__content">
      <ul id="dt6" class="d-dropdown-list d-py0">
        <li class="dt-list-item" tabindex="-1" role="menuitem" aria-selected="false">
          <div class="dt-item-layout">
            <section class="dt-item-layout--content">
              <div class="dt-item-layout--title">Menu Item 1</div>
            </section>
          </div>
        </li>
        ...
      </ul>
    </div>
  </div>
</div>
'
vueCode='
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
'
/>

### With sections and headings

<code-well-header>
  <dt-dropdown navigation-type="arrow-keys">
    <template #anchor="{ attrs }">
      <dt-button v-bind="attrs">
        Click to open
      </dt-button>
    </template>
    <template #list="{ close }">
      <dt-list-item-group
        heading-class="d-py4 d-px8 d-fw-semibold d-c-default"
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
        heading-class="d-py4 d-px8 d-fw-semibold d-c-default"
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
</code-well-header>

<code-example-tabs
htmlCode='
<div>
  <div class="d-popover">
    <div id="DtPopover__anchor2">
      <button class="base-button__button d-btn d-btn--primary">
        <span class="d-btn__label base-button__label"> Click to open </span>
      </button>
    </div>
  </div>
</div>
<div class="tippy-box d-ps-absolute" data-tippy-root="" id="tippy-13" data-popper-placement="bottom" style="...">
  <div id="dt7" role="menu" aria-hidden="false" aria-labelledby="DtPopover__anchor8" aria-modal="false" class="d-popover__dialog d-popover__dialog--modal" tabindex="-1" style="...">
    <div class="d-popover__content">
      <ul id="dt6" class="d-dropdown-list d-py0">
        <ul id="dt16" class="d-list-item-group" role="group" aria-labelledby="dt16-heading">
          <li id="dt16-heading" role="presentation" class="dt-dropdown-list--header d-py4 d-px8 d-fw-semibold d-c-default">Menu Heading A</li>
          <li id="dt17" class="dt-list-item dt-list-item--static" tabindex="-1" role="listitem">
            <div class="dt-item-layout">
              <section class="dt-item-layout--content">
                <div class="dt-item-layout--title">
                  Menu Item 1
                </div>
              </section>
            </div>
          </li>
          <li aria-hidden="true" class="dt-list-separator"></li>
          <li id="dt18" class="dt-list-item dt-list-item--static" tabindex="-1" role="listitem">
            <div class="dt-item-layout">
              <section class="dt-item-layout--content">
                <div class="dt-item-layout--title">
                  Menu Item 2
                </div>
              </section>
            </div>
          </li>
        </ul>
        <li aria-hidden="true" class="dt-list-separator"></li>
        <ul id="dt19" class="d-list-item-group" role="group" aria-labelledby="dt19-heading">
          <li id="dt19-heading" role="presentation" class="dt-dropdown-list--header d-py4 d-px8 d-fw-semibold d-c-default">Menu Heading B</li>
          <li id="dt20" class="dt-list-item dt-list-item--static" tabindex="-1" role="listitem">
            <div class="dt-item-layout">
              <section class="dt-item-layout--content">
                <div class="dt-item-layout--title">
                  Menu Item 3
                </div>
              </section>
            </div>
          </li>
        </ul>
      </ul>
    </div>
  </div>
</div>
'
vueCode='
<dt-dropdown navigation-type="arrow-keys">
  <template #anchor="{ attrs }">
    <dt-button v-bind="attrs">
      Click to open
    </dt-button>
  </template>
  <template #list="{ close }">
    <dt-list-item-group
      heading-class="d-py4 d-px8 d-fw-semibold d-c-default"
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
      heading-class="d-py4 d-px8 d-fw-semibold d-c-default"
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
'
showHtmlWarning />

### Context menu

Set `openOnContext=true` to open the menu on right-click (context menu) and disable the default trigger behavior.

<code-well-header>
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
</code-well-header>

<code-example-tabs
vueCode='
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
'
/>

## Vue API

<component-vue-api component-name="dropdown" />

## Accessibility

It is possible to include a screen reader visible only close button setting `visually-hidden-close` and `visually-hidden-close-label` props.

The dropdown menu has a role of "menu" and the list items have a role "menuitem". See [W3C guidelines](https://www.w3.org/WAI/ARIA/apg/#menubutton) for more information.

### List

The Dropdown is rendered with semantic `<ul>` and `<li>`. The list slot is wrapped in `<ul>` element so make sure the items are wrapped in `<li>` element and each item has the menuitem role. It is recommended to use the [List Item component](/components/list-item.html) as it supports all the necessary accessibility props and interactions.

### Focus & Keyboard

A dropdown menu has well defined standard [keyboard interactions](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/examples/menu-button-links/#kbd_label) that it should support. The focus will be set to the the active item on keyboard navigation. `UP` and `DOWN` arrows move the highlighted selection between the list items. `HOME` and `END` keys will jump straight to the first or the last item. Once the beginning or the end of the list is reached the selection will move to the opposite end of the list by default. If you want custom behavior you can pass `onBeginningOfList` and `onEndOfList` methods as props. `A-Z` keys will cycle through items that start with the corresponding letter.

Pressing `ESC` key while the dropdown has focus will emit an **escape** event and will close the menu. When the **highlight** selection changes, a highlight event is emitted with the index of the currently highlighted item. `SPACE` key will open the dropdown if it's closed and select the item when it's pressed on a list item.

<script setup>
const items = [
  { name: 'Menu item 1', id: 1 },
  { name: 'Menu item 2', id: 2 },
  { name: 'Another menu item 1', id: 3 },
  { name: 'Menu item 3', id: 4 },
  { name: 'Another menu item 2', id: 5 },
];
</script>
