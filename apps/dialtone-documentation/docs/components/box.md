---
title: Box
description: Low-level surface and spacing primitive for building token-constrained containers.
status: beta
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-box--default
keywords: ["box", "container", "surface", "padding", "border", "shadow", "radius", "sizing", "overflow", "scrollbar", "background", "spacing", "layout", "primitive", "elevation"]
---

<component-combinator component-name="DtBox" />

## Usage

```vue code-only
<dt-box> ... </dt-box>
```

DtBox complements [DtText](/components/text.html) (typography) and [DtStack](/components/stack.html) (flex layout) to form Dialtone's **primitive triad**:

* **DtBox**: what the container *is* (`surface`, `border`, `padding`, `sizing`)
* **DtText**: what the content *looks* like (`font`, `size`, `color`)
* **DtStack**: how children are *arranged* (`direction`, `gap`, `alignment`)

### Guidance

* Use DtBox in place of composing multiple surface utility classes (e.g., `d-bgc-*`, `d-bc-*`, `d-bar*`, `d-bs-*`, `d-p-*`).
* Use the `as` prop to render semantic HTML elements (`section`, `nav`, `article`, `header`, etc.) for accessibility.
* DtBox is a **passive container** — it does not handle layout (use [DtStack](/components/stack.html)) or typography (use [DtText](/components/text.html)).
* Compose DtBox + DtStack + DtText together for structured UI surface containers.

<dialtone-usage>
<template #do>

* Use DtBox for card surfaces, info panels, content regions, and any container that needs surface styling.
* Compose with DtStack for layout: `<dt-box><dt-stack>...</dt-stack></dt-box>`.
* Use the `as` prop for semantic HTML: `<dt-box as="nav">`, `<dt-box as="section">`.
* Use `class` for one-off styling outside DtBox's prop surface (e.g., `class="d-ps-sticky"`).

</template>
<template #dont>

* Don't use DtBox for flex layout — use [DtStack](/components/stack.html) for direction, gap, alignment.
* Don't use DtBox for typography — use [DtText](/components/text.html) for font, size, tone.
* Don't use utility classes for properties DtBox already handles (e.g., avoid `class="d-bgc-primary"` when `surface="primary"` exists).
* Don't nest DtBox deeply when a dedicated component (DtCard, DtNotice) better fits the pattern.

</template>
</dialtone-usage>

## Surface

Background surface color mapped to `--dt-color-surface-*` tokens.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="200">
  <dt-box padding="200" surface="primary" border-width="100" border-radius="300">primary</dt-box>
  <dt-box padding="200" surface="secondary" border-width="100" border-radius="300">secondary</dt-box>
  <dt-box padding="200" surface="moderate" border-width="100" border-radius="300">moderate</dt-box>
  <dt-box padding="200" surface="bold" border-width="100" border-radius="300">bold</dt-box>
  <dt-box padding="200" surface="strong" border-width="100" border-radius="300">strong</dt-box>
</dt-stack>
<!-- @code -->
<dt-box surface="{surfaceColor}">...</dt-box>
```

### Semantic surfaces

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="200">
  <dt-box padding="200" surface="brand" border-width="100" border-radius="300">brand</dt-box>
  <dt-box padding="200" surface="info" border-width="100" border-radius="300">info</dt-box>
  <dt-box padding="200" surface="positive" border-width="100" border-radius="300">positive</dt-box>
  <dt-box padding="200" surface="warning" border-width="100" border-radius="300">warning</dt-box>
  <dt-box padding="200" surface="critical" border-width="100" border-radius="300">critical</dt-box>
</dt-stack>
<!-- @code -->
<dt-box surface="{surfaceColor}">...</dt-box>
```

## Padding

Spacing token scale values for internal whitespace. The padding cascade resolves specific sides over axis shorthands over the all-sides shorthand.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="200">
  <dt-box padding="200" surface="moderate" border-radius="300">padding="200"</dt-box>
  <dt-box padding="300" surface="moderate" border-radius="300">padding="300"</dt-box>
  <dt-box padding="400" surface="moderate" border-radius="300">padding="400"</dt-box>
</dt-stack>
<!-- @code -->
<dt-box padding="{padding}">...</dt-box>
```

### Directional padding

Override specific sides. The cascade resolves: `paddingBlockStart` > `paddingBlock` > `padding`.

```vue demo
<!-- @wrapper -->
<dt-stack gap="200">
  <dt-box padding="200" surface="moderate" border-radius="300">All sides: 200</dt-box>
  <dt-box padding="200" padding-inline="400" surface="moderate" border-radius="300">Inline override: 400</dt-box>
  <dt-box padding="200" padding-block-start="400" surface="moderate" border-radius="300">Block-start override: 400</dt-box>
</dt-stack>
```

## Border

### Border width

No visible border until a `border-width` is set. Uniform width applies to all sides.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="200">
  <dt-box padding="200" surface="moderate" border-radius="300">No border</dt-box>
  <dt-box padding="200" surface="moderate" border-width="100" border-radius="300">100</dt-box>
  <dt-box padding="200" surface="moderate" border-width="200" border-radius="300">200</dt-box>
</dt-stack>
```

### Directional border width

Show borders on specific sides only.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="200">
  <dt-box padding="200" surface="moderate" border-width-block-end="100">Bottom only</dt-box>
  <dt-box padding="200" surface="moderate" border-width-inline-start="200" border-color="critical">Start critical</dt-box>
  <dt-box padding="200" surface="moderate" border-width-block="100" border-width-inline="0">Block only</dt-box>
</dt-stack>
```

### Border color

Defaults to `'default'` (`--dt-color-border-default`). Only visible when a `border-width` is set.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="200">
  <dt-box padding="200" surface="moderate" border-width="100" border-radius="300">default</dt-box>
  <dt-box padding="200" surface="moderate" border-width="100" border-color="subtle" border-radius="300">subtle</dt-box>
  <dt-box padding="200" surface="moderate" border-width="100" border-color="critical" border-radius="300">critical</dt-box>
  <dt-box padding="200" surface="moderate" border-width="100" border-color="positive" border-radius="300">positive</dt-box>
</dt-stack>
```

### Border radius

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="200" align="center">
  <dt-box padding="200" surface="moderate" border-radius="0">0</dt-box>
  <dt-box padding="200" surface="moderate" border-radius="200">200</dt-box>
  <dt-box padding="200" surface="moderate" border-radius="400">400</dt-box>
  <dt-box padding="200" surface="moderate" border-radius="pill" inline-size="200" class="d-ta-center">pill</dt-box>
  <dt-box surface="moderate" border-radius="circle" inline-size="100" block-size="100" class="d-plc-center d-ta-center">circle</dt-box>
</dt-stack>
```

## Shadow

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="300">
  <dt-box padding="200" surface="moderate" border-radius="300" shadow="small">small</dt-box>
  <dt-box padding="200" surface="moderate" border-radius="300" shadow="medium">medium</dt-box>
  <dt-box padding="200" surface="moderate" border-radius="300" shadow="large">large</dt-box>
  <dt-box padding="200" surface="moderate" border-radius="300" shadow="card">card</dt-box>
</dt-stack>
```

## Sizing

Maps to Dialtone's **layout token scale** (`--dt-layout-*`). Supports both fixed values and percentage tokens.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="200">
  <dt-box padding="200" surface="moderate" border-radius="300" inline-size="300">300 (192px)</dt-box>
  <dt-box padding="200" surface="moderate" border-radius="300" inline-size="500">500 (320px)</dt-box>
  <dt-box padding="200" surface="moderate" border-radius="300" inline-size="50-percent">50-percent</dt-box>
</dt-stack>
```

## Overflow

```vue demo
<dt-box
  surface="moderate"
  border-radius="300"
  overflow="hidden"
  inline-size="500"
  block-size="200"
  padding="200"
>
  Tall content clipped by <dt-text kind="code" size="200">overflow="hidden"</dt-text>. Nemo rem ullam culpa ut laudantium repellat unde. Consequuntur cupiditate voluptatem velit rerum doloremque voluptatum commodi vitae vel inventore iusto ducimus iure? Ex fugit quae iste perferendis eaque! Alias in reiciendis suscipit facere incidunt repellendus! Voluptatibus iste nesciunt numquam consectetur suscipit unde atque tempora saepe est illum quaerat sit natus mollitia excepturi? Repellendus explicabo deserunt ipsam sint esse ab delectus beatae eligendi velit libero quasi culpa ut tenetur sunt corrupti iure suscipit magni fuga blanditiis nihil incidunt! Mollitia voluptas sed temporibus quasi.
</dt-box>
```

## Scrollbar

Integrates the `v-dt-scrollbar` directive. An inner viewport wrapper is inserted automatically, solving the [Custom Scrollbar's](/components/scrollbar.html) single-child constraint.

```vue demo
<dt-box
  padding="200"
  border-width="100"
  border-radius="300"
  scrollbar="never"
  block-size="300"
>
  <dt-stack gap="100">
    <dt-text v-for="i in 20" :key="i" kind="body" size="sm">Scrollable item {{ i }}</dt-text>
  </dt-stack>
</dt-box>
```

## Render as

Use the `as` prop to render semantic HTML elements for accessibility.

```vue demo
<!-- @wrapper -->
<dt-stack gap="200">
  <dt-box as="section" padding="200" surface="moderate" border-radius="300">as="section"</dt-box>
  <dt-box as="nav" padding="200" surface="moderate" border-radius="300">as="nav"</dt-box>
  <dt-box as="article" padding="200" surface="moderate" border-radius="300">as="article"</dt-box>
</dt-stack>
```

## Examples

### Card

```vue demo
<dt-box
  padding="300"
  surface="primary"
  border-width="100"
  border-radius="400"
  shadow="card"
>
  <dt-stack gap="200">
    <dt-text as="h3" kind="headline" size="md">Card title</dt-text>
    <dt-text kind="body" size="sm">Card body content with supporting text.</dt-text>
  </dt-stack>
</dt-box>
```

### Composed layout

```vue demo
<dt-box
  padding="200"
  surface="primary"
  border-width="100"
  border-radius="400"
>
  <dt-stack gap="200">
    <dt-stack direction="row" justify="space-between" align="baseline">
      <dt-text as="h2" kind="headline" :size="400">Title</dt-text>
      <dt-button size="200">Action</dt-button>
    </dt-stack>
    <dt-stack direction="row" gap="200">
      <dt-box class="d-fl1" padding="200" surface="secondary" border-width="100" border-color="subtle" border-radius="300">
        <dt-text as="p" align="center" tone="muted">Box 1</dt-text>
      </dt-box>
      <dt-box class="d-fl1" padding="200" surface="secondary" border-width="100" border-color="subtle" border-radius="300">
        <dt-text as="p" align="center" tone="muted">Box 2</dt-text>
      </dt-box>
      <dt-box class="d-fl1" padding="200" surface="secondary" border-width="100" border-color="subtle" border-radius="300">
        <dt-text as="p" align="center" tone="muted">Box 3</dt-text>
      </dt-box>
    </dt-stack>
  </dt-stack>
</dt-box>
```

## Accessibility

* Use the `as` prop to render appropriate semantic elements — `nav` for navigation, `section` for thematic content, `article` for self-contained content.
* DtBox does not add any implicit ARIA role. The rendered element's native semantics determine how screen readers interpret it.
* When using `as="nav"` or `as="section"`, consider adding `aria-label` to provide an accessible name for the landmark region.
* The scrollbar integration preserves native keyboard scrolling behavior.

## Vue API

<component-vue-api component-name="box" />

## Classes

<component-class-table component-name="box" />
