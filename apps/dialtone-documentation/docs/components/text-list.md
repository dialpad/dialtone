---
title: Text List
description: Semantic bullet, numbered, nested, and custom-marker lists.
status: new
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-text-list--default
figma: planned
keywords:
  [
    "dt-text-list",
    "DtTextList",
    "dt-text-list-item",
    "DtTextListItem",
    "bullet",
    "numbered",
    "ordered",
    "unordered",
    "icon",
    "ul",
    "ol",
    "li",
  ]
---

<component-combinator component-name="DtTextList" />

## Usage

```vue code-only
<dt-text-list>
  <dt-text-list-item>First item</dt-text-list-item>
  <dt-text-list-item>Second item</dt-text-list-item>
</dt-text-list>
```

Use `DtTextList` for hand-authored text or content lists. It renders native `ul`, `ol`, and `li` elements, keeps marker styling in component props, and avoids the clunky `d-ls-*`, `d-lst-*`, and indentation utility class combinations.

### Guidance

- Use `DtTextListItem` as the direct child of `DtTextList`.
- Use `type="ordered"` only when item order or sequence changes the meaning.
- Keep `marker` visual. The `type` prop controls semantics.
- Nested lists go inside a `DtTextListItem`.
- Set `markerTone` on the `DtTextList` to control all markers. Set `markerTone` on `DtTextListItem` when individual markers may differ.
- Keep custom markers decorative. If a marker conveys status, include readable text in the item content.

<dialtone-usage>
<template #do>

- Prefer `DtTextList` over `d-ls-*` and `d-lst-*` utilities in Vue.
- Use `gap` for item spacing up to `400`.
- Use `markerTone` for semantic marker color.
- Use `DtText` within each `DtTextListItem` when customizing list item typography.

</template>
<template #dont>

- Use raw `li` children directly under `DtTextList`.
- Use `marker` to imply ordered or unordered semantics.
- Use custom markers as the only source of meaning.

</template>
</dialtone-usage>

## Variants

### Unordered

Unordered lists render a native `ul` by default.

```vue demo
<dt-text-list>
  <dt-text-list-item>Route customer questions to the right team.</dt-text-list-item>
  <dt-text-list-item>Summarize every conversation after it ends.</dt-text-list-item>
  <dt-text-list-item>Keep notes available across channels.</dt-text-list-item>
</dt-text-list>
```

### Ordered

Use `type="ordered"` when sequence matters. `start`, `reversed`, and item `value` are passed only to ordered lists.

```vue demo
<!-- @wrapper -->
<dt-stack gap="400" direction="row">
  <dt-text-list type="ordered">
    <dt-text-list-item>Invite the workspace owners.</dt-text-list-item>
    <dt-text-list-item>Map inboxes to support queues.</dt-text-list-item>
    <dt-text-list-item>Review routing before launch.</dt-text-list-item>
  </dt-text-list>
  <dt-text-list type="ordered" start="4">
    <dt-text-list-item>Invite the workspace owners.</dt-text-list-item>
    <dt-text-list-item>Map inboxes to support queues.</dt-text-list-item>
    <dt-text-list-item>Review routing before launch.</dt-text-list-item>
  </dt-text-list>
</dt-stack>
```

### Gap

Use `gap` to add space between items and before nested lists. Values come from the spacing scale up to `400`. There is no default `gap`, effectively `0`.

```vue demo
<!-- @wrapper -->
<dt-stack gap="400" direction="row">
  <dt-text-list>
    <dt-text-list-item>Default gap</dt-text-list-item>
    <dt-text-list-item>No added space.</dt-text-list-item>
    <dt-text-list-item>Natural line flow.</dt-text-list-item>
  </dt-text-list>
  <dt-text-list gap="200">
    <dt-text-list-item>Gap 200</dt-text-list-item>
    <dt-text-list-item>Space between items.</dt-text-list-item>
    <dt-text-list-item>None before or after.</dt-text-list-item>
  </dt-text-list>
</dt-stack>
```

### Marker

Use `marker` for visual marker style. Unset markers progress automatically as lists nest.

```vue demo
<!-- @wrapper -->
<dt-stack gap="400" direction="row">
  <dt-text-list
    marker="square"
    marker-tone="secondary"
  >
    <dt-text-list-item>Square marker</dt-text-list-item>
    <dt-text-list-item marker-tone="critical">Item marker tone override</dt-text-list-item>
  </dt-text-list>

  <dt-text-list
    type="ordered"
    marker="lower-alpha"
  >
    <dt-text-list-item>Lower alpha marker</dt-text-list-item>
    <dt-text-list-item>Native ordered semantics</dt-text-list-item>
  </dt-text-list>
</dt-stack>
```

### Custom Markers

Use the item `marker` slot to replace an item's visual marker while preserving `ul` or `ol` semantics. The `marker` slot is freeform, so you can use icons, images, or any other content. Use `marker-tone` to control the color of the marker.

```vue demo
<dt-text-list
  marker-tone="positive"
>
  <dt-text-list-item>
    <template #marker>
      <dt-icon name="check" size="200" />
    </template>
    Included in every plan.
  </dt-text-list-item>
  <dt-text-list-item>
    <template #marker>
      <dt-icon name="check" size="200" />
    </template>
    Unlimited team members.
  </dt-text-list-item>
  <dt-text-list-item marker-tone="critical">
    <template #marker>
      <dt-icon name="close" size="200" />
    </template>
    Requires admin approval.
  </dt-text-list-item>
</dt-text-list>
```

### Nested

Nested lists go inside item content. Unset markers advance by depth: unordered lists use `disc`, `circle`, then `square`; ordered lists use `decimal`, `lower-alpha`, then `lower-roman`.

```vue demo
<dt-text-list>
  <dt-text-list-item>
    Prepare the launch workspace.
    <dt-text-list
      type="ordered"
    >
      <dt-text-list-item>Confirm owners.</dt-text-list-item>
      <dt-text-list-item>Publish onboarding notes.</dt-text-list-item>
    </dt-text-list>
  </dt-text-list-item>
  <dt-text-list-item>
    Track unresolved tasks.
    <dt-text-list>
      <dt-text-list-item>Permissions</dt-text-list-item>
      <dt-text-list-item>Billing handoff</dt-text-list-item>
    </dt-text-list>
  </dt-text-list-item>
</dt-text-list>
```

## Accessibility

`DtTextList` always renders native list elements. When markers are visually removed through `marker="none"`, the component also applies `role="list"` so Safari with VoiceOver still announces list semantics.

Custom marker wrappers are considered decorative and will not be announced to assistive technology. Do not rely on a marker alone to communicate state.

## Vue API

### Text List

<component-vue-api component-name="textlist" :also-import="['textlistitem']" />

### Text List Item

<component-vue-api component-name="textlistitem" :show-import="false" />
