---
title: Split Button
description: A Split Button offers a default action paired with a secondary action to reveal alternate or related actions.
status: ready
thumb: true
image: assets/images/components/split-button.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-split-button--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=19800-32233
keywords: ["dropdown button", "button with menu", "d-split-button", "DtSplitButton", "dt-split-button", "menu button", "combo button"]
---

<component-combinator component-name="DtSplitButton" />

## Usage

This dual-functionality allows for surfacing variations of the default action. It conserves space in the interface and reduces cognitive load. While versatile, they should be used judiciously to avoid overwhelming users or cluttering the UI.

In addition to the [Button component's](button.md) documentation:

- The default button supports text or icons, while the secondary action is always an icon.
- The secondary action selected from its menu replaces the primary action.
- Ensure that primary and secondary actions are clearly labeled to avoid user confusion.

<dialtone-usage>
<template #do>

- Use Split Buttons when you need to offer a default action paired with closely related actions, such as "Save" with secondary actions like "Save as Draft" or "Save all."
- Reserve for scenarios where multiple related actions can reasonably be grouped within the same context via the secondary action.

</template>
<template #dont>

- Avoid using if the secondary action is unrelated or distantly related.
- Refrain from grouping multiple Split Buttons together, as this can lead to a cluttered and confusing interface.

</template>
</dialtone-usage>

## Variants

### Base

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-split-button end-tooltip-text="More calling options">
    Place Call
    <template #dropdownList>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>
    </template>
  </dt-split-button>
  <dt-split-button importance="outlined" end-tooltip-text="More calling options">
    Place Call
    <template #dropdownList>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>
    </template>
  </dt-split-button>
  <dt-split-button importance="clear" end-tooltip-text="More calling options">
    Place Call
    <template #dropdownList>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>
    </template>
  </dt-split-button>
</dt-stack>
```

### Danger

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-split-button kind="danger" end-tooltip-text="More calling options">
    Place Call
    <template #dropdownList>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>
    </template>
  </dt-split-button>
  <dt-split-button importance="outlined" kind="danger" end-tooltip-text="More calling options">
    Place Call
    <template #dropdownList>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>
    </template>
  </dt-split-button>
  <dt-split-button importance="clear" kind="danger" end-tooltip-text="More calling options">
    Place Call
    <template #dropdownList>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>
    </template>
  </dt-split-button>
</dt-stack>
```

### Positive

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
    <dt-split-button kind="positive" end-tooltip-text="More calling options"> Place Call </dt-split-button>
    <dt-split-button importance="outlined" kind="positive" end-tooltip-text="More calling options"> Place Call </dt-split-button>
    <dt-split-button importance="clear" kind="positive" end-tooltip-text="More calling options"> Place Call </dt-split-button>
</dt-stack>
```

### Muted

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
    <dt-split-button importance="outlined" kind="muted" end-tooltip-text="More calling options"> Place Call </dt-split-button>
    <dt-split-button importance="clear" kind="muted" end-tooltip-text="More calling options"> Place Call </dt-split-button>
</dt-stack>
```

### Disabled

Use the `disabled` prop to disable both buttons, or use `start-disabled` and `end-disabled` to disable each button independently.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
    <dt-split-button disabled end-tooltip-text="More calling options"> Both disabled </dt-split-button>
    <dt-split-button start-disabled end-tooltip-text="More calling options"> Start disabled </dt-split-button>
    <dt-split-button end-disabled end-tooltip-text="More calling options"> End disabled </dt-split-button>
</dt-stack>
```

### Active

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-split-button start-active end-tooltip-text="More calling options"> Start active </dt-split-button>
  <dt-split-button end-active end-tooltip-text="More calling options"> End active </dt-split-button>
</dt-stack>
```

### No Divider

Use `:show-divider="false"` to hide the vertical divider between the start and end buttons. This is only available for the `clear` importance variant.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-split-button importance="clear" kind="muted" :show-divider="false" end-tooltip-text="More calling options">
    Place Call
    <template #dropdownList>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>
    </template>
  </dt-split-button>
  <dt-split-button importance="clear" :show-divider="false" end-tooltip-text="More calling options">
    Place Call
    <template #dropdownList>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item>
      <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 3 </dt-list-item>
    </template>
  </dt-split-button>
</dt-stack>
```

## Sizes

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-split-button :size="100" end-tooltip-text="More calling options"> 100 </dt-split-button>
  <dt-split-button :size="200" end-tooltip-text="More calling options"> 200 </dt-split-button>
  <dt-split-button :size="300" end-tooltip-text="More calling options"> 300 </dt-split-button>
  <dt-split-button :size="400" end-tooltip-text="More calling options"> 400 </dt-split-button>
  <dt-split-button :size="500" end-tooltip-text="More calling options"> 500 </dt-split-button>
</dt-stack>
```

## Loading

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-split-button start-loading end-tooltip-text="More calling options"> Place call </dt-split-button>
  <dt-split-button start-loading importance="outlined" end-tooltip-text="More calling options"> Place call </dt-split-button>
  <dt-split-button start-loading importance="clear" end-tooltip-text="More calling options"> Place call </dt-split-button>
</dt-stack>
```

## Navigation

The start button supports navigation via `start-href` (renders as `<a>`) or `start-to` (renders as `<router-link>`). Navigation only applies to the start button — the end button is a dropdown trigger.

### External Link

```vue demo
<dt-split-button
  start-href="https://dialpad.com"
  start-target="_blank"
  start-rel="noopener noreferrer"
  end-tooltip-text="More options"
>
  Visit Dialpad
  <template #dropdownList>
    <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item>
    <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item>
  </template>
</dt-split-button>
```

### Router Link

```vue demo
<dt-split-button
  start-to="/components/button"
  end-tooltip-text="More options"
>
  Go to DtButton docs
  <template #dropdownList>
    <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 1 </dt-list-item>
    <dt-list-item role="menuitem" navigation-type="arrow-keys"> Option 2 </dt-list-item>
  </template>
</dt-split-button>
```

## Icon Support

### Icon and Label

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100" class="d-fw-wrap">
  <dt-split-button importance="outlined" end-tooltip-text="More calling options">
    <template #startIcon="{ size }">
      <dt-icon name="phone" :size="size" />
    </template>
    Place call
  </dt-split-button>
  <dt-split-button importance="outlined" start-icon-position="blockStart" end-tooltip-text="More calling options">
    <template #startIcon="{ size }">
      <dt-icon name="phone" :size="size" />
    </template>
    Place call
  </dt-split-button>
  <dt-split-button importance="outlined" start-icon-position="end" end-tooltip-text="More calling options">
    <template #startIcon="{ size }">
      <dt-icon name="phone" :size="size" />
    </template>
    Place call
  </dt-split-button>
  <dt-split-button importance="outlined" start-icon-position="blockEnd" end-tooltip-text="More calling options">
    <template #startIcon="{ size }">
      <dt-icon name="phone" :size="size" />
    </template>
    Place call
  </dt-split-button>
</dt-stack>
```

### Dual Icons on Start Button

Use `#startIcon` and `#startEndIcon` together to place icons at both the start and end positions
within the start button. This uses the same dual-icon pattern as [DtButton](/components/button.html#start-and-end-icons).

```vue demo
<dt-split-button importance="outlined" end-tooltip-text="More calling options">
  <template #startIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
  <template #startEndIcon="{ size }">
    <dt-icon name="arrow-down" :size="size" />
  </template>
  Place call
</dt-split-button>
```

### Custom End Button Icon

Use `#endIcon` to replace the default chevron icon on the end (omega) button.

```vue demo
<dt-split-button importance="outlined" end-tooltip-text="More calling options">
  <template #startIcon="{ size }">
    <dt-icon name="phone" :size="size" />
  </template>
  <template #endIcon="{ size }">
    <dt-icon name="more-vertical" :size="size" />
  </template>
  Place call
</dt-split-button>
```

### Icon Only

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-split-button end-tooltip-text="More calling options" start-tooltip-text="Place call">
    <template #startIcon="{ size }">
      <dt-icon name="phone" :size="size" />
    </template>
  </dt-split-button>
  <dt-split-button importance="outlined" kind="muted" end-tooltip-text="More calling options" start-tooltip-text="Place call">
    <template #startIcon="{ size }">
      <dt-icon name="phone" :size="size" />
    </template>
  </dt-split-button>
  <dt-split-button importance="clear" kind="danger" end-tooltip-text="More calling options" start-tooltip-text="Place call">
    <template #startIcon="{ size }">
      <dt-icon name="phone" :size="size" />
    </template>
  </dt-split-button>
</dt-stack>
```

## Leading & Trailing

The `#leading` and `#trailing` slots are forwarded to the alpha button. Use `alpha-leading-class` and `alpha-trailing-class` to style the containers.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-split-button
    importance="outlined"
    omega-tooltip-text="More calling options"
    alpha-trailing-class="d-pie-100"
  >
    Place Call
    <template #trailing>
      <dt-keyboard-shortcut shortcut="{cmd}+N" />
    </template>
  </dt-split-button>
  <dt-split-button
    importance="outlined"
    omega-tooltip-text="More calling options"
    alpha-leading-class="d-pis-100"
  >
    Place Call
    <template #leading>
      <dt-badge kind="count" text="3" />
    </template>
  </dt-split-button>
</dt-stack>
```

## Vue API

<component-vue-api component-name="splitButton" />

## Accessibility

In addition to the [Button component's](button.md#accessibility) accessibility documentation:

- An icon-only primary action and the secondary action require a [Tooltip](tooltip.md) to indicate its function.
- While the secondary action is focused, pressing `Enter` or `Space` triggers its action, displaying a [Dropdown component](dropdown.md) or [Popover component](popover.md).

## Classes

<component-class-table component-name="split-button" />
