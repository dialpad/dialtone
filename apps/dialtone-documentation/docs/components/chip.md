---
title: Chip
description: Compact token for selected values, filters, or dismissible items.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-chip--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=9937-64802
keywords: ["tag", "pill", "token", "badge", "d-chip", "DtChip", "dt-chip", "filter chip", "choice chip"]
combinator: DtChip
---

A chip is a compact element for a label, a category, or an attribute that people create or choose. It sits near the content it classifies and can be made interactive, with an optional remove button. For system-generated status, counts, and feature stages, use [Badge](/components/badge.html).

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-chip>Label name</dt-chip>
  <dt-chip variant="people">First Last</dt-chip>
  <dt-chip emphasis="strong">Selected</dt-chip>
</dt-stack>
```

## Usage

<dialtone-usage>
<template #do>

- Show labels, categories, or attributes that people create, such as tags.
- Show a person's name with the `people` variant.
- Make a chip interactive when it filters, selects, or removes something.
</template>

<template #dont>

- Show system status, counts, or feature stages. Use a [Badge](/components/badge.html) instead.
- Make a chip interactive when it does nothing, because it will look clickable.
- Use a chip for an action. Use a [Button](/components/button.html) or a [DtLink](/components/link.html) instead.
</template>

</dialtone-usage>

## Best practices

- Keep labels short, ideally one or two words. If a label can be long, truncate it and set a width on the chip content.
- Use the `people` variant for names and the default variant for everything else.
- Use `base` emphasis for most chips. Use `strong` to mark a selected chip, and `subtle` for text-only metadata that doesn't need a container.
- Make a chip interactive only when it responds to a click. Add the remove button only to chips people can remove.
- The label is the chip's accessible name. Set `aria-label` when the content is only an icon or an avatar, and set `remove-button-aria-label` so the remove button says what it removes, such as "Remove Jaqueline."

## Variants

| Variant | Use for |
| --- | --- |
| `default` | Labels, categories, and attributes. |
| `people` | The name of a person, usually with an avatar. |

| Emphasis | Look | Interactive |
| --- | --- | --- |
| `subtle` | Text only, with no fill or border | No, static only |
| `base` | Light fill with a hairline border | Yes |
| `strong` | Stronger fill, often for a selected chip | Yes |

```vue demo
<!-- @wrapper -->
<dt-stack gap="100">
  <dt-stack direction="row" gap="100">
    <dt-chip emphasis="subtle">Subtle</dt-chip>
    <dt-chip emphasis="base">Base</dt-chip>
    <dt-chip emphasis="strong">Strong</dt-chip>
  </dt-stack>
  <dt-stack direction="row" gap="100">
    <dt-chip variant="people" emphasis="subtle">Subtle</dt-chip>
    <dt-chip variant="people" emphasis="base">Base</dt-chip>
    <dt-chip variant="people" emphasis="strong">Strong</dt-chip>
  </dt-stack>
</dt-stack>
```

A chip that is both `interactive` and `emphasis="subtle"` warns in development and renders as `base`.

## Interactive chips

Chips are static by default. An interactive chip renders as a button. Hovering it deepens the fill, and pressing or focusing it fills the chip dark (default) or brand purple (`people`) and inverts the label. The remove button shows a soft rounded square behind the icon on hover. Add `show-close` for a remove button, which emits `close`. Backspace and Delete on a focused chip also emit `close`.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-chip interactive @click="() => {}">Clickable</dt-chip>
  <dt-chip interactive show-close remove-button-aria-label="Remove label name">Removable</dt-chip>
  <dt-chip variant="people" interactive show-close remove-button-aria-label="Remove First Last">First Last</dt-chip>
</dt-stack>
```

`show-close` needs `interactive`. Without it, Chip warns in development and doesn't render the button.

### Disabled

Use `disabled` to disable the chip and its remove button. It sets `aria-disabled="true"` and `tabindex="-1"`, and blocks pointer and keyboard interaction.

```vue demo
<dt-chip interactive show-close disabled>Disabled</dt-chip>
```

## Examples

### Icons and avatars

Use `startIcon` and `endIcon` for icons, and `startAvatar` for an avatar. Set the icon `size` to match the chip: `100` for sizes 100 and 200, `200` for 300 to 500, and `300` for 600 and 700.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-chip>
    <template #startIcon>
      <dt-icon name="phone" size="200" />
    </template>
    Start icon
  </dt-chip>
  <dt-chip>
    <template #endIcon>
      <dt-icon name="phone" size="200" />
    </template>
    End icon
  </dt-chip>
  <dt-chip variant="people" interactive show-close remove-button-aria-label="Remove Jaqueline">
    <template #startAvatar>
      <dt-avatar
        image-src="/assets/images/person.png"
        image-alt="Jaqueline Nackos"
        full-name="Jaqueline Nackos"
      />
    </template>
    Jaqueline
  </dt-chip>
</dt-stack>
```

### Leading and trailing content

Use the `leading` and `trailing` slots for freeform content, such as a [Badge](/components/badge.html). Each slot has a matching class prop: `leading-class` and `trailing-class`.

```vue demo
<dt-chip>
  Inbox
  <template #trailing>
    <dt-badge kind="counter" variant="count" emphasis="strong" label="4" :size="100" />
  </template>
</dt-chip>
```

### Sizes

Sizes run from `100` to `700`, and `300` is the default. Sizes `100` to `500` use the same type scale as [Badge](/components/badge.html), so chip and badge labels line up. `600` and `700` are chip-only. Block size, label size, icon size, corner radius, and horizontal padding step up together, and the remove button scales with the icon.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100" align="center">
  <dt-chip :size="100">100</dt-chip>
  <dt-chip :size="200">200</dt-chip>
  <dt-chip :size="300">300</dt-chip>
  <dt-chip :size="400">400</dt-chip>
  <dt-chip :size="500">500</dt-chip>
  <dt-chip :size="600">600</dt-chip>
  <dt-chip :size="700">700</dt-chip>
</dt-stack>
```

### Truncated

To truncate text, use DtText's `truncate` prop and set the width of the chip content with `content-class`.

```vue demo
<dt-chip content-class="d-w-150">
  <dt-text truncate>Chip loooooong name here</dt-text>
</dt-chip>
```

If you're upgrading from the v10 API, run `npx dialtone-migrate-chip-api` to rename the `icon` and `avatar` slots and their class props. The [migration guide](/guides/migration/badge-chip-api/) lists every change.

## Vue API

<component-vue-api component-name="chip" />

## Classes

<component-class-table component-name="chip" />
