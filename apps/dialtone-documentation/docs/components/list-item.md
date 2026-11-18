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
      <dt-icon-check size="300" />
    </template>
    <span>Default List Item</span>
    <template #subtitle>
      Description
    </template>
    <template #bottom>
      <dt-badge text="Label" />
    </template>
    <template #end>
      <dt-icon-external-link size="300" />
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
      <dt-icon-check size="300" />
    </template>
    <span>Default List Item</span>
    <template #subtitle>
      Description
    </template>
    <template #bottom>
      <dt-badge text="Label" />
    </template>
    <template #end>
      <dt-icon-external-link size="300" />
    </template>
  </dt-list-item>
</ul>
```

## Roles and selection

Choose the role from the surrounding widget. A checkmark or `selected=true` never changes the role automatically.

| Context | ListItem role | State ownership |
| --- | --- | --- |
| Ordinary `ul` or `ol` | `listitem` (default) | `selected` shows a visual checkmark. |
| Action inside a Dropdown menu | `menuitem` | Activating performs an action. |
| Persistent, mutually exclusive choice inside a Dropdown menu | `menuitemradio` | The consumer sets `selected`; it controls both the checkmark and `aria-checked`. |
| Choice inside a listbox, such as Combobox | `option` | Preserve the parent widget's selection and keyboard contract. |

Menu radios are menu choices, not native form radio inputs. Keep exactly one row selected when the menu represents one committed choice. Moving keyboard or mouse highlight does not change `aria-checked`; activation requests the consumer's update. The new role omits `aria-selected`; existing roles retain their current markup.

Use [Dropdown's persistent-choice example](dropdown.md#persistent-menu-choices) for the menu parent, optional ListItemGroup heading, and selection handlers. Listbox choices remain `option`, even when only one value can be selected. See also the [Menu Roles story](https://dialtone.dialpad.com/vue/?path=/story/components-dropdown--menu-roles).

## Disabled

Set `disabled` on a row that can't be activated right now. The row renders `aria-disabled="true"` and the disabled style, and it doesn't emit `click` for pointer, Enter or Space, and cancels the native default, such as navigation for `element-type="a"`. It still emits `keydown`, `mousemove` and `mouseleave`, and stays focusable and reachable with the arrow keys, Home, End and typeahead, so keyboard and screen reader users can find it and learn why it's unavailable. This follows the WAI-ARIA Authoring Practices guidance on [focusability of disabled controls](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#focusabilityofdisabledcontrols), which keeps disabled menu items focusable. Use it on interactive rows (`menuitem`, `menuitemradio` or `option`), where assistive technology announces the state.

Put the reason in the `subtitle` slot, hide that text from the row's name with `aria-hidden`, and point `aria-describedby` at it. Interactive rows take their name from their content, so without `aria-hidden` the reason would be repeated in the name; `aria-describedby` still reads it as the description.

```vue demo
<!-- @class d-d-block -->
<ul>
  <dt-list-item navigation-type="tab">
    Rename
  </dt-list-item>
  <dt-list-item
    navigation-type="tab"
    disabled
    aria-describedby="list-item-disabled-reason"
  >
    Delete
    <template #subtitle>
      <span
        id="list-item-disabled-reason"
        aria-hidden="true"
      >Only the owner can delete this file</span>
    </template>
  </dt-list-item>
</ul>
```

The style comes from the `disabled` prop. A row that sets `aria-disabled` without the prop keeps its current look and still emits `click`. Don't combine the two: an `aria-disabled` attribute overrides the announced state, while the prop still controls the style and activation.

> [!WARNING] Parent-driven selection isn't gated
> `disabled` stops only the row's own `click`. A parent that selects by highlighted index, such as DtCombobox on Enter, doesn't check it, so that parent must skip unavailable rows itself.

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
          variant="body-xs"
          tone="muted"
          datetime="10:00"
        >
          10:00
        </dt-text>
        <dt-text density="300" variant="body-md" tone="secondary">
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
            <dt-icon-share
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
            <dt-icon-star
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
            <dt-icon-more-vertical
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

<script setup>
import {
  DtIconCheck,
  DtIconExternalLink,
  DtIconShare,
  DtIconStar,
  DtIconMoreVertical,
} from '@dialpad/dialtone-icons/vue';
</script>
