---
title: Badge
description: Compact marker for status, counts, release stage, and content lifecycle.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-badge--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=2128-0
keywords: ["label","tag","indicator","count","d-badge","DtBadge","dt-badge"]
combinator: DtBadge
---

A badge is a small, non-interactive marker that sits next to the item it describes. It shows the status of that item, a count, where a feature is in its release, or where a piece of content is in its lifecycle. For categories or labels that people create, use [Chip](/components/chip.html).

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-badge label="Draft" />
  <dt-badge variant="positive" label="Resolved" />
  <dt-badge kind="counter" variant="count" label="12" />
  <dt-badge kind="release" variant="pre-release" label="Beta" emphasis="base" />
</dt-stack>
```

## Usage

<dialtone-usage>
<template #do>

- Show the status of the item next to it, such as Overdue or Resolved.
- Show a count, such as unread messages.
- Mark where a feature is in its release, such as Alpha, Beta, or New.
- Show the state of a piece of content, such as Draft or Published.
</template>

<template #dont>

- Ask the user to take an action. Use a [Button](/components/button.html) or a [DtLink](/components/link.html) instead.
- Show labels or tags that people create. Use a [Chip](/components/chip.html) instead.
- Add color to the UI when there's no status, count, or stage to show.
</template>

</dialtone-usage>

## Best practices

- Keep labels short, ideally one or two words. The label describes the item next to the badge or that item's status, such as "Overdue" or "Out of stock."
- Write status labels in the past tense, for example "Refunded" instead of "Refund."
- Choose the variant for what it means. Critical needs action now, warning needs attention, positive is a good outcome, info is context, and neutral has no particular state. Use the same variant for the same status everywhere in your product.
- Make sure the label says what the color says. Color shouldn't be the only signal.
- Use strong emphasis for the one badge that should stand out. Base emphasis suits most lists and tables.
- Place a badge next to what it describes: near the title in a list item, or in its own column in a table.
- Give a badge an accessible name when its text is a bare value, such as `12`. Use `aria-label` or `aria-labelledby`.

## Groups

| `kind` | Describes | Variants | Emphasis |
| --- | --- | --- | --- |
| `status` | The status of the item it sits next to | `neutral`, `info`, `positive`, `warning`, `critical` | `base`, `strong` |
| `counter` | A number | `count`, `mention` | `base`, `strong` |
| `release` | Whether a feature has launched | `pre-release`, `release` | `subtle`, `base`, `strong` |
| `lifecycle` | The state of a piece of content | `draft`, `edited`, `unsaved`, `saved`, `published`, `archived`, `scheduled` | `base`, `strong` |

`kind` defaults to `status`, so you only set it for `counter`, `release`, and `lifecycle`. A variant that doesn't belong to the `kind`, or an emphasis the group doesn't support, falls back to the default and logs a warning in development.

### Status

```vue demo
<!-- @wrapper -->
<dt-stack gap="100">
  <dt-stack direction="row" gap="100">
    <dt-badge variant="neutral" label="Draft" />
    <dt-badge variant="info" label="In progress" />
    <dt-badge variant="positive" label="Resolved" />
    <dt-badge variant="warning" label="Overdue" />
    <dt-badge variant="critical" label="Failed" />
  </dt-stack>
  <dt-stack direction="row" gap="100">
    <dt-badge variant="neutral" label="Draft" emphasis="strong" />
    <dt-badge variant="info" label="In progress" emphasis="strong" />
    <dt-badge variant="positive" label="Resolved" emphasis="strong" />
    <dt-badge variant="warning" label="Overdue" emphasis="strong" />
    <dt-badge variant="critical" label="Failed" emphasis="strong" />
  </dt-stack>
</dt-stack>
```

### Counter

`count` shows a number. `mention` puts an `@` before the number. The `@` is text by default, and the `startIcon` slot replaces it with an icon.

A badge nested inside another badge restyles itself in CSS, so there's nothing to configure. Nest one only when it qualifies the outer badge, such as the mentions inside an unread count.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100" align="center">
  <dt-badge kind="counter" variant="count" label="99" />
  <dt-badge kind="counter" variant="count" label="99" emphasis="strong" />
  <dt-badge kind="counter" variant="mention" label="2" />
  <dt-badge kind="counter" variant="mention" label="2" emphasis="strong" />
  <dt-badge kind="counter" variant="count" label="99" emphasis="strong">
    <template #trailing>
      <dt-badge kind="counter" variant="mention" label="2" emphasis="strong" />
    </template>
  </dt-badge>
</dt-stack>
```

> [!INFO] Nested styling is provisional
> The nested look (shorter, smaller radius) is a first pass. Design hasn't settled how nested badges should be colored.

### Release

`pre-release` is for features that aren't generally available yet, such as internal (alpha), early access (beta), and new features. `release` is for features that have launched. After launch, a feature fades from `pre-release` (solid purple) to `release` with `strong` emphasis (dark gray, the same as neutral status with `strong` emphasis) to `release` with `base` emphasis (light gray), and then you remove the badge. Your team decides when each stage happens, such as after a number of days, visits, or clicks.

Emphasis shows how important the feature is. `subtle` is an outline, `base` is a light fill, and `strong` is a solid fill. The label stays your product's word, such as "Alpha," "Beta," or "New."

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-badge kind="release" variant="pre-release" label="Alpha" emphasis="subtle" />
  <dt-badge kind="release" variant="pre-release" label="Beta" emphasis="base" />
  <dt-badge kind="release" variant="pre-release" label="New" emphasis="strong" />
  <dt-badge kind="release" variant="release" label="New" emphasis="strong" />
  <dt-badge kind="release" variant="release" label="New" emphasis="base" />
</dt-stack>
```

`useFeatureAwarenessBadge` steps through the fade from an exposure count. It returns the variant and emphasis for the current stage, and your app supplies the label, persistence, and counting.

```vue
<script setup>
import { useFeatureAwarenessBadge } from '@dialpad/dialtone-vue';

const awareness = useFeatureAwarenessBadge({
  exposureCount: 2,
  thresholds: { new: 0, release: 3, hidden: 10 },
});
</script>

<template>
  <dt-badge
    v-if="awareness.isVisible.value"
    kind="release"
    :variant="awareness.variant.value"
    :emphasis="awareness.emphasis.value"
    label="New"
  />
</template>
```

Pass a `stages` option to set the variant and emphasis for each stage. By default the first stage is `new`, which is `pre-release` with `strong` emphasis, and the next is `release`, which is `release` with `base` emphasis.

> [!INFO] The look of `pre-release` may change
> Pick the variant and emphasis for the stage you mean, and don't rely on how a variant looks today.

### Lifecycle

Use `lifecycle` for the state of a piece of content as it moves from writing to publishing, such as a document, a message, or a campaign. Each variant takes a status color: `draft` and `archived` are neutral, `edited` and `scheduled` are info, `unsaved` is warning, and `saved` and `published` are positive. `published` defaults to `strong` emphasis so it stands apart from `saved`. The label is your product's word for the state.

```vue demo
<!-- @wrapper -->
<dt-stack gap="100">
  <dt-stack direction="row" gap="100">
    <dt-badge kind="lifecycle" variant="draft" label="Draft" />
    <dt-badge kind="lifecycle" variant="edited" label="Edited" />
    <dt-badge kind="lifecycle" variant="unsaved" label="Unsaved" />
    <dt-badge kind="lifecycle" variant="saved" label="Saved" />
    <dt-badge kind="lifecycle" variant="published" label="Published" />
    <dt-badge kind="lifecycle" variant="archived" label="Archived" />
    <dt-badge kind="lifecycle" variant="scheduled" label="Scheduled" />
  </dt-stack>
  <dt-stack direction="row" gap="100">
    <dt-badge kind="lifecycle" variant="draft" label="Draft" emphasis="strong" />
    <dt-badge kind="lifecycle" variant="edited" label="Edited" emphasis="strong" />
    <dt-badge kind="lifecycle" variant="unsaved" label="Unsaved" emphasis="strong" />
    <dt-badge kind="lifecycle" variant="saved" label="Saved" emphasis="strong" />
    <dt-badge kind="lifecycle" variant="published" label="Published" />
    <dt-badge kind="lifecycle" variant="archived" label="Archived" emphasis="strong" />
    <dt-badge kind="lifecycle" variant="scheduled" label="Scheduled" emphasis="strong" />
  </dt-stack>
</dt-stack>
```

## Examples

### Icons

Use the `startIcon` and `endIcon` slots for icons, and set the icon `size` to `200`. Use the `leading` and `trailing` slots for freeform content, such as the nested badge in the counter example.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-badge variant="critical" label="Recording">
    <template #startIcon>
      <dt-icon-record-filled size="200" />
    </template>
  </dt-badge>
  <dt-badge label="Locked">
    <template #startIcon>
      <dt-icon-lock size="200" />
    </template>
  </dt-badge>
  <dt-badge kind="counter" variant="count" label="5%" emphasis="strong">
    <template #startIcon>
      <dt-icon-arrow-up size="200" />
    </template>
  </dt-badge>
</dt-stack>
```

### Sizes

Sizes run from `100` to `500`, and `200` is the default. Font size, height, padding, and corner radius step up together. `count` and `mention` badges keep a minimum width equal to their height.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100" align="center">
  <dt-badge label="100" :size="100" />
  <dt-badge label="200" :size="200" />
  <dt-badge label="300" :size="300" />
  <dt-badge label="400" :size="400" />
  <dt-badge label="500" :size="500" />
</dt-stack>
```

### Label or slot

Use the `label` prop for plain text and the default slot for markup. The slot wins when both are set.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-badge variant="info" label="In progress" />
  <dt-badge variant="info">In <strong>progress</strong></dt-badge>
</dt-stack>
```

## Theming

Badge colors come from the `--dt-badge-color-*` component tokens. Each token points at a semantic token where one exists, so badges follow the theme and dark mode. Set the variant and emphasis instead of overriding the tokens.

> [!WARNING] `decoration` is deprecated
> The `decoration` prop and its `d-badge--decorate-*` colors remain for this major only. Use `dt-chip` for categorical labels. Don't add new uses, and don't combine `decoration` with an icon or with any variant other than `neutral`.

If you're upgrading from the v10 API, run `npx dialtone-migrate-badge-api` to replace `type` and `text` and to add `kind`. The [migration guide](/guides/migration/badge-chip-api/) lists every change.

## Vue API

<component-vue-api component-name="badge"></component-vue-api>

## Classes

<component-class-table component-name="badge"></component-class-table>

<script setup>
  import {
    DtIconLock,
    DtIconRecordFilled,
    DtIconArrowUp,
  } from '@dialpad/dialtone-icons/vue';
</script>
