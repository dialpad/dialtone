---
title: List Item Group
description: The "List Item Group" component uses a non interactive heading which groups list items.
status: ready
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-list-item-group--default
keywords: ["list group", "list items", "d-list-item-group", "DtListItemGroup", "dt-list-item-group", "menu list", "option list"]
---

<component-combinator component-name="DtListItemGroup" />

## Usage

Use this component when you have multiple list items you would like to group into different categories.

The heading is unstyled by default. You will likely have to pass utility classes to the heading-class prop to make the heading look how you wish.

## Accessibility

The List Item Group does not implement arrow-keys keyboard navigation. You will however get arrow-keys keyboard navigation when using this within list based Dialtone components such as Dropdown or Combobox.

The aria label for the List Item Group will be set by the content of the heading.

## Vue API

<component-vue-api component-name="listitemgroup" />
