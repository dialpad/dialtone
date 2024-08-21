---
title: List item group
description: The "List Item Group" component uses a non interactive heading which groups list items.
status: ready
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-list-item-group--default
---

<code-well-header>
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
</code-well-header>

## Base style

You should use this component when you have multiple list items you would like to group into different categories.

The heading is unstyled by default. You will likely have to pass utility classes to the heading-class prop to make the heading look how you wish.

<code-well-header>
  <dt-list-item-group
    heading="Example Heading"
    heading-class="d-fw-bold"
    ref="listItemGroup"
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
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.listItemGroup'
vueCode='
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
'
/>

## Accessibility

The List Item Group does not implement arrow-keys keyboard navigation. You will however get arrow-keys keyboard navigation when using this within list based Dialtone components such as Dropdown or Combobox.

The aria label for the List Item Group will be set by the content of the heading.

## Vue API

<component-vue-api component-name="listitemgroup" />
