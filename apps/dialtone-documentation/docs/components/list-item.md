---
title: List item
description: Structured row for choices, navigation, or actions.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-list-item--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=10732-69390
keywords: ["list element", "d-list-item", "DtListItem", "dt-list-item"]
---

```vue demo-only
<!-- @class d-d-block -->
<ul>
  <dt-list-item navigation-type="tab">
    <template #start>
      <dt-icon size="300" name="check" />
    </template>
    <span>Default List Item</span>
    <template #subtitle>
      Description
    </template>
    <template #bottom>
      <dt-badge text="Label" />
    </template>
    <template #end>
      <dt-icon size="300" name="external-link" />
    </template>
  </dt-list-item>
</ul>
```

## Base Style

A list item provides accessibility controls and common functionality. The component uses child components that provide styling and slots for different types of list items. If you want to create a custom list item you can pass a type "custom", which will let you define the structure of the content.

The default list item has 5 slots that can be used for the most common use cases, **start**, **end**, **default**, **subtitle** and **bottom** slot. All of the slots are optional.

The **start** slot can contain content, such as an avatar, that will be positioned at the start (left in LTR) of the main content.

The **end** slot works the same way, but its contents are placed at the end (right in LTR) of the main slot.

The **default** slot contains the main content of the list item.

The **subtitle** slot can be used to display content below the default slot. The slot has smaller text size and lighter color than default slot.

The **bottom** slot can be used to display content below the subtitle slot.

```vue demo
<!-- @class d-d-block -->
<ul>
  <dt-list-item navigation-type="tab">
    <template #start>
      <dt-icon size="300" name="check" />
    </template>
    <span>Default List Item</span>
    <template #subtitle>
      Description
    </template>
    <template #bottom>
      <dt-badge text="Label" />
    </template>
    <template #end>
      <dt-icon size="300" name="external-link" />
    </template>
  </dt-list-item>
</ul>
```

## Variants

### Custom List Item

When `type` is set to "custom" the list item will not render any styles or slots. This type can be used when the list item has to support content that does not work with the default structure.

```vue demo
<!-- @class d-d-block -->
<ul>
  <dt-list-item
    navigation-type="tab"
    type="custom"
  >
    <dt-stack direction="row" align="start" justify="between" gap="500" class="d-py-100 d-px-150 d-pie-100">
      <dt-stack align="baseline" direction="row" gap="400">
        <dt-text
          kind="body"
          tone="muted"
          :size="100"
          datetime="10:00"
        >
          10:00
        </dt-text>
        <dt-text :size="300" density="300" kind="body" tone="secondary">
          Custom list item example lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </dt-text>
      </dt-stack>
      <dt-stack direction="row">
        <dt-button
          :size="100"
          kind="muted"
          importance="clear"
          title="share"
        >
          <template #startIcon="{ iconSize }">
            <dt-icon
              name="share"
              :size="iconSize"
            />
          </template>
        </dt-button>
        <dt-button
          :size="100"
          kind="muted"
          importance="clear"
          title="star"
        >
          <template #startIcon="{ iconSize }">
            <dt-icon
              name="star"
              :size="iconSize"
            />
          </template>
        </dt-button>
        <dt-button
          :size="100"
          kind="muted"
          importance="clear"
          title="more"
        >
          <template #startIcon="{ iconSize }">
            <dt-icon
              name="more-vertical"
              :size="iconSize"
            />
          </template>
        </dt-button>
      </dt-stack>
    </dt-stack>
  </dt-list-item>
</ul>
```

## Vue API

<component-vue-api component-name="listitem" />
