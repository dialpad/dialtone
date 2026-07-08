---
title: Text List
description: Semantic text lists for bulleted, numbered, nested, and custom-marker content.
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
    "bullet list",
    "numbered list",
    "ordered list",
    "unordered list",
    "icon list",
    "content list",
    "ul",
    "ol",
    "li",
  ]
---

### Default line height

<dt-text-list>
  <dt-text-list-item>
    <template #marker>
      <dt-icon name="check" size="300" />
    </template>
    Included in every plan
  </dt-text-list-item>
  <dt-text-list-item marker-tone="warning">
    <template #marker>
      <dt-icon name="alert-circle" size="300" />
    </template>
    Requires admin approval
  </dt-text-list-item>
  <dt-text-list-item>
    <template #marker>
      <dt-icon name="plus" size="300" />
    </template>
    Can be customized per item  Can be customized per item  Can be customized per item  Can be customized per item
  </dt-text-list-item>
  <dt-text-list-item marker-tone="muted">
    <template #marker>
      <dt-icon name="check-circle" size="300" />
    </template>
    Can be customized per item  Can be customized per item  Can be customized per item  Can be customized per item
  </dt-text-list-item>
  <dt-text-list-item>
    <template #marker>
      a
    </template>
    Can be customized per item  Can be customized per item  Can be customized per item  Can be customized per item
  </dt-text-list-item>
  <dt-text-list-item>
    <template #marker>
      <dt-emoji code="❌" size="300" />
    </template>
    Can be customized per item  Can be customized per item  Can be customized per item  Can be customized per item
  </dt-text-list-item>
  <dt-text-list-item>
    <template #marker>
      <dt-emoji code="✅" size="300" />
    </template>
    Can be customized per item  Can be customized per item  Can be customized per item  Can be customized per item
  </dt-text-list-item>
  <dt-text-list-item>
    <template #marker>
      <dt-icon name="bullet" size="300" />
    </template>
    Can be customized per item  Can be customized per item  Can be customized per item  Can be customized per item
  </dt-text-list-item>
</dt-text-list>

### Tighter line height

<dt-text-list>
  <dt-text-list-item>
    <template #marker>
      <dt-icon name="check" size="300" />
    </template>
    <dt-text density="200" as="p">Included in every plan</dt-text>
  </dt-text-list-item>
  <dt-text-list-item marker-tone="warning">
    <template #marker>
      <dt-icon name="alert-circle" size="300" />
    </template>
    <dt-text density="200" as="p">Requires admin approval</dt-text>
  </dt-text-list-item>
  <dt-text-list-item>
    <template #marker>
      <dt-icon name="plus" size="300" />
    </template>
    <dt-text density="200" as="p">Can be customized per item  Can be customized per item  Can be customized per item  Can be customized per item</dt-text>
  </dt-text-list-item>
  <dt-text-list-item marker-tone="muted">
    <template #marker>
      <dt-icon name="check-circle" size="300" />
    </template>
    <dt-text density="200" as="p">Can be customized per item  Can be customized per item  Can be customized per item  Can be customized per item</dt-text>
  </dt-text-list-item>
  <dt-text-list-item>
    <template #marker>
      a
    </template>
    <dt-text density="200" as="p">Can be customized per item  Can be customized per item  Can be customized per item  Can be customized per item</dt-text>
  </dt-text-list-item>
  <dt-text-list-item>
    <template #marker>
      <dt-emoji code="❌" size="300" />
    </template>
    <dt-text density="200" as="p">Can be customized per item  Can be customized per item  Can be customized per item  Can be customized per item</dt-text>
  </dt-text-list-item>
  <dt-text-list-item>
    <template #marker>
      <dt-emoji code="✅" size="300" />
    </template>
    <dt-text density="200" as="p">Can be customized per item  Can be customized per item  Can be customized per item  Can be customized per item</dt-text>
  </dt-text-list-item>
  <dt-text-list-item>
    <template #marker>
      <dt-icon name="bullet" size="300" />
    </template>
    <dt-text density="200" as="p">Can be customized per item  Can be customized per item  Can be customized per item  Can be customized per item</dt-text>
  </dt-text-list-item>
</dt-text-list>

### Tightest line height

<dt-text-list>
  <dt-text-list-item>
    <template #marker>
      <dt-icon name="check" size="300" />
    </template>
    <dt-text density="100" as="p">Included in every plan</dt-text>
  </dt-text-list-item>
  <dt-text-list-item marker-tone="warning">
    <template #marker>
      <dt-icon name="alert-circle" size="300" />
    </template>
    <dt-text density="100" as="p">Requires admin approval</dt-text>
  </dt-text-list-item>
  <dt-text-list-item>
    <template #marker>
      <dt-icon name="plus" size="300" />
    </template>
    <dt-text density="100" as="p">Can be customized per item  Can be customized per item  Can be customized per item  Can be customized per item</dt-text>
  </dt-text-list-item>
  <dt-text-list-item marker-tone="muted">
    <template #marker>
      <dt-icon name="check-circle" size="300" />
    </template>
    <dt-text density="100" as="p">Can be customized per item  Can be customized per item  Can be customized per item  Can be customized per item</dt-text>
  </dt-text-list-item>
  <dt-text-list-item>
    <template #marker>
      a
    </template>
    <dt-text density="100" as="p">Can be customized per item  Can be customized per item  Can be customized per item  Can be customized per item</dt-text>
  </dt-text-list-item>
  <dt-text-list-item>
    <template #marker>
      <dt-emoji code="❌" size="300" />
    </template>
    <dt-text density="100" as="p">Can be customized per item  Can be customized per item  Can be customized per item  Can be customized per item</dt-text>
  </dt-text-list-item>
  <dt-text-list-item>
    <template #marker>
      <dt-emoji code="✅" size="300" />
    </template>
    <dt-text density="100" as="p">Can be customized per item  Can be customized per item  Can be customized per item  Can be customized per item</dt-text>
  </dt-text-list-item>
  <dt-text-list-item>
    <template #marker>
      <dt-icon name="bullet" size="300" />
    </template>
    <dt-text density="100" as="p">Can be customized per item  Can be customized per item  Can be customized per item  Can be customized per item</dt-text>
  </dt-text-list-item>
</dt-text-list>

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

- Use `type="ordered"` only when item order or sequence changes the meaning.
- Keep `marker` visual. The `type` prop controls semantics.
- Use `DtTextListItem` as the direct child of `DtTextList`.
- Put nested lists inside a `DtTextListItem`, not beside it.
- Set `marker-tone` on `DtTextListItem` when one marker needs to override the list tone.
- Use `DtDescriptionList` for term and description pairs.
- Use checkbox components for interactive checklists.
- Keep custom markers decorative. If a marker conveys status, include readable text in the item content.

<dialtone-usage>
<template #do>

- Prefer `DtTextList` over `d-ls-*` and `d-lst-*` utilities in Vue.
- Use `gap` for item spacing up to `400`.
- Use `markerTone` for semantic marker color.
- Wrap the list or surrounding copy in `DtText` when typography needs to change.

</template>
<template #dont>

- Use raw `li` children directly under `DtTextList`.
- Use `marker` to imply ordered or unordered semantics.
- Use custom markers as the only source of meaning.
- Use this component for menus, selectable rows, or data-heavy collections.

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
<dt-text-list
  type="ordered"
  :start="3"
>
  <dt-text-list-item>Invite the workspace owners.</dt-text-list-item>
  <dt-text-list-item :value="7">Map inboxes to support queues.</dt-text-list-item>
  <dt-text-list-item>Review routing before launch.</dt-text-list-item>
</dt-text-list>
```

### Marker

Use `marker` for visual marker style. Unset markers progress automatically as lists nest.

```vue demo
<dt-stack gap="400">
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

Use the item `marker` slot to replace an item's visual marker while preserving `ul` or `ol` semantics. Prefer tree-shakable icon components, such as `<dt-icon-close>`, for icon markers. The generic `<dt-icon name="close" />` component also works because marker content is slotted.

```vue demo
<dt-text-list
  marker-tone="positive"
>
  <dt-text-list-item>
    <template #marker>
      <dt-icon name="check" size="100" />
    </template>
    Included in every plan.
  </dt-text-list-item>
  <dt-text-list-item marker-tone="critical">
    <template #marker>
      <dt-icon-close size="200" />
    </template>
    Requires admin approval.
  </dt-text-list-item>
  <dt-text-list-item>
    <template #marker>
      +
    </template>
    Custom marker slot.
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

## Vue API

### Text List

<component-vue-api component-name="textlist" :also-import="['textlistitem']" />

### Text List Item

<component-vue-api component-name="textlistitem" :show-import="false" />

## Accessibility

`DtTextList` always renders native list elements. When markers are visually removed through `marker="none"`, the component also applies `role="list"` so Safari with VoiceOver still announces list semantics.

Custom marker wrappers are `aria-hidden="true"`. Do not rely on a marker alone to communicate state.
