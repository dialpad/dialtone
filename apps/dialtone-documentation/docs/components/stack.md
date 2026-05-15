---
title: Stack
description: Foundational layout primitive for elements along a vertical or horizontal axis, with consistent spacing and alignment.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-stack--default
keywords: ["layout", "vertical", "horizontal", "d-stack", "DtStack", "dt-stack", "flex container", "auto layout", "primitive"]
---

<component-combinator component-name="DtStack" />

## Direction

### Column

`direction="column"` will flow child items vertically, i.e. top to bottom. It is the default direction and doesn't need to be explictily set.

```vue demo
<dt-box surface="moderate-opaque" border-radius="300">
  <dt-stack gap="200">
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Stack item 1
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Stack item 2
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Stack item 3
    </dt-box>
  </dt-stack>
</dt-box>
<!-- @code -->
<dt-stack gap="200">
  <dt-box> Stack item 1 </dt-box>
  <dt-box> Stack item 2 </dt-box>
  <dt-box> Stack item 3 </dt-box>
</dt-stack>
```

### Row

`direction="row"` will flow child items horizontally, i.e. left to right.

```vue demo
<dt-box surface="moderate-opaque" border-radius="300">
  <dt-stack
    gap="200"
    direction="row"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Stack item 1
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Stack item 2
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Stack item 3
    </dt-box>
  </dt-stack>
</dt-box>
<!-- @code -->
<dt-stack
  gap="200"
  direction="row"
>
  <dt-box> Stack item 1 </dt-box>
  <dt-box> Stack item 2 </dt-box>
  <dt-box> Stack item 3 </dt-box>
</dt-stack>
```

### Row Reverse

```vue demo
<dt-box surface="moderate-opaque" border-radius="300">
  <dt-stack
    gap="200"
    direction="row-reverse"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Stack item 1
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Stack item 2
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Stack item 3
    </dt-box>
  </dt-stack>
</dt-box>
<!-- @code -->
<dt-stack
  gap="200"
  direction="row-reverse"
>
  <dt-box> Stack item 1 </dt-box>
  <dt-box> Stack item 2 </dt-box>
  <dt-box> Stack item 3 </dt-box>
</dt-stack>
```

### Column Reverse

```vue demo
<dt-box surface="moderate-opaque" border-radius="300">
  <dt-stack
    gap="200"
    direction="column-reverse"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Stack item 1
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Stack item 2
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Stack item 3
    </dt-box>
  </dt-stack>
</dt-box>
<!-- @code -->
<dt-stack
  gap="200"
  direction="column-reverse"
>
  <dt-box> Stack item 1 </dt-box>
  <dt-box> Stack item 2 </dt-box>
  <dt-box> Stack item 3 </dt-box>
</dt-stack>
```

## Render as

The `as` prop controls which HTML element the Stack component renders as. Defaults to `<div>`, but can be declared as any valid HTML element to ensure semantic and accessible markup.

Declaring as an appropriate HTML element improves accessibility by helping screen readers better understand document structure, and maintainability with clear code intent.

**Common `as` values:** `span`, `ul`, `ol`, `li`, `section`, `nav`, `article`, `main`, `aside`, `header`, `footer`.

### Example: section

Use `as="section"` to create a thematic grouping of content.

```vue demo
<dt-box surface="moderate-opaque" border-radius="300">
  <dt-stack
    as="section"
    gap="100"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Stack item 1</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Stack item 2</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Stack item 3</dt-box>
  </dt-stack>
</dt-box>
<!-- @code -->
<dt-stack
  as="section"
  gap="100"
>
  <dt-box>Stack item 1</dt-box>
  <dt-box>Stack item 2</dt-box>
  <dt-box>Stack item 3</dt-box>
</dt-stack>
```

### Example: span

Use `as="span"` when you need an inline container.

```vue demo
<dt-box surface="moderate-opaque" border-radius="300">
  <dt-stack
    as="span"
    direction="row"
    gap="100"
  >
    <dt-box as="span" surface="moderate-opaque" padding="200" border-radius="300">Inline item 1</dt-box>
    <dt-box as="span" surface="moderate-opaque" padding="200" border-radius="300">Inline item 2<br>with a second line</dt-box>
    <dt-box as="span" surface="moderate-opaque" padding="200" border-radius="300">Inline item 3</dt-box>
  </dt-stack>
</dt-box>
<!-- @code -->
<dt-stack
  as="span"
  direction="row"
  gap="100"
>
  <dt-box>Inline item 1</dt-box>
  <dt-box>Inline item 2</dt-box>
  <dt-box>Inline item 3</dt-box>
</dt-stack>
```

## Gap

```vue demo
<dt-stack gap="200" class="d-w100p">
  <div class="d-d-none xl:d-d-flex d-jc-center">
    <dt-segmented-control
      :size="100"
      :model-value="selectedGap"
      aria-label="Gap size"
      @update:model-value="setGap"
    >
      <dt-segmented-control-item
        v-for="gap in gaps"
        v-dt-tooltip="{ message: gapToPx(gap), delay: false }"
        :key="gap"
        :value="gap"
        :selected="gap === selectedGap"
      >
        {{ gap }}
      </dt-segmented-control-item>
    </dt-segmented-control>
  </div>
  <dt-stack
    :direction="{ 'default': 'column', 'md': 'row' }"
    gap="200"
    class="d-w100p"
    align="start"
  >
    <dt-stack class="d-w100p md:d-w50p" gap="50">
      <dt-text as="h3" kind="headline" :size="300">Column</dt-text>
      <dt-stack
        :gap="selectedGap"
        class="d-bgc-moderate-opaque d-t d-td300 d-bar-400 d-ttf-quint"
      >
        <dt-box surface="moderate-opaque" padding="200" border-radius="300">Stack item 1</dt-box>
        <dt-box surface="moderate-opaque" padding="200" border-radius="300">Stack item 2</dt-box>
        <dt-box surface="moderate-opaque" padding="200" border-radius="300">Stack item 3</dt-box>
      </dt-stack>
    </dt-stack>
    <dt-stack class="d-w100p md:d-w50p" gap="50">
      <dt-text as="h3" kind="headline" :size="300">Row</dt-text>
      <dt-stack
        direction="row"
        :gap="selectedGap"
        class="d-bgc-moderate-opaque d-t d-td300 d-bar-400 d-ttf-quint"
      >
        <dt-box surface="moderate-opaque" padding="200" border-radius="300" class="d-fl1">Stack item 1</dt-box>
        <dt-box surface="moderate-opaque" padding="200" border-radius="300" class="d-fl1">Stack item 2</dt-box>
        <dt-box surface="moderate-opaque" padding="200" border-radius="300" class="d-fl1">Stack item 3</dt-box>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</dt-stack>
<!-- @code -->
<dt-stack gap="100">
  <dt-box> Stack item 1 </dt-box>
  <dt-box> Stack item 2 </dt-box>
  <dt-box> Stack item 3 </dt-box>
</dt-stack>
```

### Available gaps

<clamped-table-wrapper>
  <dt-box>
    <table class="d-table dialtone-doc-table">
      <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-ibs-0">
        <tr>
          <th scope="col" class="d-p-0 d-bbw0">
            <div class="d-p-200 d-bb d-bbw1">Size</div>
          </th>
          <th scope="col" class="d-p-0 d-bbw0">
            <div class="d-p-200 d-bb d-bbw1">Design Token</div>
          </th>
          <th scope="col" class="d-ta-right d-p-0 d-bbw0">
            <div class="d-p-200 d-bb d-bbw1">REM</div>
          </th>
          <th scope="col" class="d-ta-right d-p-0 d-bbw0">
            <div class="d-p-200 d-bb d-bbw1">PX</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ value: stop, output } in spacingValues" :key="stop" valign="baseline">
          <th scope="row" class="d-code--sm d-docsite-code">{{ stop }}</th>
          <td><dt-text kind="code" size="xs">var(--dt-spacing-{{ stop }})</dt-text></td>
          <td class="d-code--sm d-docsite-code d-ta-right">{{ output }}</td>
          <td class="d-code--sm d-docsite-code d-ta-right">{{ (parseFloat(output) * 10) }}px</td>
        </tr>
      </tbody>
    </table>
  </dt-box>
</clamped-table-wrapper>

## Align

The `align` prop controls how items are aligned along the cross-axis (perpendicular to the stack direction). For row stacks, this controls vertical alignment. For column stacks, this controls horizontal alignment.

Available `align` values: `start`, `center`, `end`, `stretch`, `baseline`.

### Default

The `align` prop is optional. Unless specified, it will default vertical stacks to `align-items="stretch"` and horizontal stacks to `align-items="center"`.

```vue demo
<dt-stack
  gap="200"
  :direction="{ default: `column`, md: `row` }"
>
  <dt-stack
    gap="100"
    class="d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--inline-stretch"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Short
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Taller item<br>
      with more content
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Short
    </dt-box>
  </dt-stack>
  <dt-stack
    gap="100"
    direction="row"
    class="d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--block-center"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Short
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Taller item<br>
      with more content
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Short
    </dt-box>
  </dt-stack>
</dt-stack>
<!-- @code -->
<dt-stack gap="100">
  <dt-box>Short</dt-box>
  <dt-box>
    Taller item<br>
    with more content
  </dt-box>
  <dt-box>Short</dt-box>
</dt-stack>
<dt-stack direction="row">
  <dt-box>Short</dt-box>
  <dt-box>
    Taller item<br>
    with more content
  </dt-box>
  <dt-box>Short</dt-box>
</dt-stack>
```

### Start

Align items to the start of the cross-axis.

```vue demo
<dt-stack
  gap="100"
  :direction="{ default: `column`, md: `row` }"
>
  <dt-stack
    gap="100"
    align="start"
    class="d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--inline-start"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Short
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Taller item<br>
      with more content
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Short
    </dt-box>
  </dt-stack>
  <dt-stack
    direction="row"
    gap="100"
    align="start"
    class="d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--block-start"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Short
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Taller item<br>
      with more content
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Short
    </dt-box>
  </dt-stack>
</dt-stack>
<!-- @code -->
<dt-stack
  gap="100"
  align="start"
>
  <dt-box>Short</dt-box>
  <dt-box>
    Taller item<br>
    with more content
  </dt-box>
  <dt-box>Short</dt-box>
</dt-stack>
<dt-stack
  direction="row"
  gap="100"
  align="start"
>
  <dt-box>Short</dt-box>
  <dt-box>
    Taller item<br>
    with more content
  </dt-box>
  <dt-box>Short</dt-box>
</dt-stack>
```

### Center

Center items along the cross-axis.

```vue demo
<dt-stack
  gap="200"
  :direction="{ default: `column`, md: `row` }"
>
  <dt-stack
    gap="100"
    align="center"
    class="d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--inline-center"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Short
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Taller item<br>
      with more content
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Short
    </dt-box>
  </dt-stack>
  <dt-stack
    direction="row"
    gap="100"
    align="center"
    class="d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--block-center"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Short
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Taller item<br>
      with more content
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Short
    </dt-box>
  </dt-stack>
</dt-stack>
<!-- @code -->
<dt-stack
  direction="row"
  gap="100"
  align="center"
>
  <dt-box>Short</dt-box>
  <dt-box>
    Taller item<br>
    with more content
  </dt-box>
  <dt-box>Short</dt-box>
</dt-stack>
```

### End

Align items to the end of the cross-axis.

```vue demo
<dt-stack
  gap="200"
  :direction="{ default: `column`, md: `row` }"
>
  <dt-stack
    gap="100"
    align="end"
    class="d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--inline-end"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Short
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Taller item<br>
      with more content
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Short
    </dt-box>
  </dt-stack>
  <dt-stack
    direction="row"
    gap="100"
    align="end"
    class="d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--block-end"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Short
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Taller item<br>
      with more content
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Short
    </dt-box>
  </dt-stack>
</dt-stack>
<!-- @code -->
<dt-stack
  gap="100"
  align="end"
>
  <dt-box>Short</dt-box>
  <dt-box>
    Taller item<br>
    with more content
  </dt-box>
  <dt-box>Short</dt-box>
</dt-stack>
<dt-stack
  direction="row"
  gap="100"
  align="end"
>
  <dt-box>Short</dt-box>
  <dt-box>
    Taller item<br>
    with more content
  </dt-box>
  <dt-box>Short</dt-box>
</dt-stack>
```

### Stretch

Stretch items to fill the container height.

```vue demo
<dt-stack
  gap="200"
  :direction="{ default: `column`, md: `row` }"
>
  <dt-stack
    gap="100"
    align="stretch"
    class="d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--inline-stretch"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Short
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Taller item<br>
      with more content
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Short
    </dt-box>
  </dt-stack>
  <dt-stack
    direction="row"
    gap="100"
    align="stretch"
    class="d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--block-stretch"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Short
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Taller item<br>
      with more content
    </dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Short
    </dt-box>
  </dt-stack>
</dt-stack>
<!-- @code -->
<dt-stack
  direction="row"
  gap="100"
  align="stretch"
>
  <dt-box>Short</dt-box>
  <dt-box>
    Taller item<br>
    with more content
  </dt-box>
  <dt-box>Short</dt-box>
</dt-stack>
```

### Baseline

Align items along their text baselines.

```vue demo
<dt-stack
  direction="row"
  gap="100"
  align="baseline"
  class="d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--baseline"
>
  <dt-box surface="moderate-opaque" padding="200" border-radius="300">
    <dt-text kind="body" :size="100">Small body</dt-text>
  </dt-box>
  <dt-box surface="moderate-opaque" padding="200" border-radius="300">
    <dt-text kind="body" :size="300">Medium body</dt-text>
  </dt-box>
  <dt-box surface="moderate-opaque" padding="200" border-radius="300">
    <dt-text kind="headline" :size="600">Large headline</dt-text>
  </dt-box>
</dt-stack>
<!-- @code -->
<dt-stack
  direction="row"
  gap="100"
  align="baseline"
>
  <dt-text kind="body" :size="100">Small body</dt-text>
  <dt-text kind="body" :size="300">Medium body</dt-text>
  <dt-text kind="headline" :size="600">Large headline</dt-text>
</dt-stack>
```

## Justify

The `justify` prop controls how items are distributed along the main axis (the direction of the stack). For row stacks, this controls horizontal distribution. For column stacks, this controls vertical distribution.

Available `justify` values: `start` (default), `center`, `end`, `space-around`, `space-between`, `space-evenly`.

### Start

Align items to the start of the main axis (default).

```vue demo
<dt-stack
  class="d-w100p"
  gap="200"
  align="stretch"
  :direction="{ default: `column`, md: `row` }"
>
  <dt-stack
    gap="100"
    justify="start"
    class="d-w100p d-h-400 d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--block-start"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 1</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 2</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 3</dt-box>
  </dt-stack>
  <dt-stack
    direction="row"
    gap="100"
    justify="start"
    class="d-w100p d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--inline-start"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 1</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 2</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 3</dt-box>
  </dt-stack>
</dt-stack>
<!-- @code -->
<dt-stack justify="start">
  <dt-box>Item 1</dt-box>
  <dt-box>Item 2</dt-box>
  <dt-box>Item 3</dt-box>
</dt-stack>
```

### Center

Center items along the main axis.

```vue demo
<dt-stack
  class="d-w100p"
  gap="200"
  :direction="{ default: `column`, md: `row` }"
>
  <dt-stack
    gap="100"
    justify="center"
    class="d-w100p d-h-400 d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--block-center"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 1</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 2</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 3</dt-box>
  </dt-stack>
  <dt-stack
    direction="row"
    gap="100"
    justify="center"
    class="d-w100p d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--inline-center"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 1</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 2</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 3</dt-box>
  </dt-stack>
</dt-stack>
<!-- @code -->
<dt-stack justify="center">
  <dt-box>Item 1</dt-box>
  <dt-box>Item 2</dt-box>
  <dt-box>Item 3</dt-box>
</dt-stack>
```

### End

Align items to the end of the main axis.

```vue demo
<dt-stack
  class="d-w100p"
  gap="200"
  :direction="{ default: `column`, md: `row` }"
>
  <dt-stack
    gap="100"
    justify="end"
    class="d-w100p d-h-400 d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--block-end"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 1</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 2</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 3</dt-box>
  </dt-stack>
  <dt-stack
    direction="row"
    gap="100"
    justify="end"
    class="d-w100p d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--inline-end"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 1</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 2</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 3</dt-box>
  </dt-stack>
</dt-stack>
<!-- @code -->
<dt-stack justify="end">
  <dt-box>Item 1</dt-box>
  <dt-box>Item 2</dt-box>
  <dt-box>Item 3</dt-box>
</dt-stack>
```

### Space Around

Distribute items with equal space around each item.

```vue demo
<dt-stack
  class="d-w100p"
  gap="200"
  :direction="{ default: `column`, md: `row` }"
>
  <dt-stack
    gap="100"
    justify="space-around"
    class="d-w100p d-h-400 d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--block-center"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 1</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 2</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 3</dt-box>
  </dt-stack>
  <dt-stack
    direction="row"
    gap="100"
    justify="space-around"
    class="d-w100p d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--inline-center"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 1</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 2</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 3</dt-box>
  </dt-stack>
</dt-stack>
<!-- @code -->
<dt-stack justify="space-around">
  <dt-box>Item 1</dt-box>
  <dt-box>Item 2</dt-box>
  <dt-box>Item 3</dt-box>
</dt-stack>
```

### Space Between

Distribute items with space between them, edges flush to container.

```vue demo
<dt-stack
  class="d-w100p"
  gap="200"
  :direction="{ default: `column`, md: `row` }"
>
  <dt-stack
    gap="100"
    justify="space-between"
    class="d-w100p d-h-400 d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--block-center"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 1</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 2</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 3</dt-box>
  </dt-stack>
  <dt-stack
    direction="row"
    gap="100"
    justify="space-between"
    class="d-w100p d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--inline-center"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 1</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 2</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 3</dt-box>
  </dt-stack>
</dt-stack>
<!-- @code -->
<dt-stack
  direction="row"
  gap="100"
  justify="space-between"
  class="d-w100p"
>
  <dt-box>Item 1</dt-box>
  <dt-box>Item 2</dt-box>
  <dt-box>Item 3</dt-box>
</dt-stack>
```

### Space Evenly

Distribute items with equal space between all items, including edges.

```vue demo
<dt-stack
  class="d-w100p"
  gap="200"
  :direction="{ default: `column`, md: `row` }"
>
  <dt-stack
    gap="100"
    justify="space-evenly"
    class="d-w100p d-h-400 d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--block-center"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 1</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 2</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 3</dt-box>
  </dt-stack>
  <dt-stack
    direction="row"
    gap="100"
    justify="space-evenly"
    class="d-w100p d-bgc-moderate-opaque d-bar-400 axis-outline axis-outline--inline-center"
  >
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 1</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 2</dt-box>
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 3</dt-box>
  </dt-stack>
</dt-stack>
<!-- @code -->
<dt-stack justify="space-evenly">
  <dt-box>Item 1</dt-box>
  <dt-box>Item 2</dt-box>
  <dt-box>Item 3</dt-box>
</dt-stack>
```

## Responsive

### Example

Stacks column at small screen size and column reverse at large screen

```vue demo
<dt-stack
  :direction="{ default: `row`, sm: `column`, lg: `column-reverse` }"
  gap="100"
  class="d-bgc-moderate-opaque"
>
  <dt-box surface="moderate-opaque" padding="200" border-radius="300">
    Stack item 1
  </dt-box>
  <dt-box surface="moderate-opaque" padding="200" border-radius="300">
    Stack item 2
  </dt-box>
  <dt-box surface="moderate-opaque" padding="200" border-radius="300">
    Stack item 3
  </dt-box>
</dt-stack>
<!-- @code -->
<dt-stack
  :direction="{ default: `row`, sm: `column`, lg: `column-reverse` }"
  gap="100"
>
  <dt-box>
    Stack item 1
  </dt-box>
  <dt-box>
    Stack item 2
  </dt-box>
  <dt-box>
    Stack item 3
  </dt-box>
</dt-stack>
```

Set `200` as the default gap, `300` for small and larger, `400` for medium, `500` for large, and `600` for extra large. Learn more about how our breakpoints work in the [Responsive Breakpoints documentation](/utilities/responsive/breakpoints.md).

```vue demo
<dt-stack
  :gap="{ default: '200', xl: '600', lg: '500', md: '400', sm: '300' }"
  class="d-bgc-moderate-opaque"
>
  <dt-box surface="moderate-opaque" padding="200" border-radius="300">
    Stack item 1
  </dt-box>
  <dt-box surface="moderate-opaque" padding="200" border-radius="300">
    Stack item 2
  </dt-box>
  <dt-box surface="moderate-opaque" padding="200" border-radius="300">
    Stack item 3
  </dt-box>
</dt-stack>
<!-- @code -->
<dt-stack :gap="{ default: `200`, xl: `600`, lg: `500`, md: `400`, sm: `300` }">
  <dt-box> Stack item 1 </dt-box>
  <dt-box> Stack item 2 </dt-box>
  <dt-box> Stack item 3 </dt-box>
</dt-stack>
```

### Nested Example

Stacks row with gap 500 and stacks in row reverse the nested stack with gap 500.

```vue demo
<dt-box surface="moderate-opaque" border-radius="300">
  <dt-stack direction="row" as="section" gap="200">
    <dt-box surface="moderate-opaque" padding="200" border-radius="300">
      Stack item 1
    </dt-box>
    <dt-stack gap="200">
      <dt-box surface="moderate-opaque" padding="200" border-radius="300">Stack item 2</dt-box>
      <dt-stack direction="row-reverse" gap="200">
        <dt-box surface="moderate-opaque" padding="200" border-radius="300">Stack item 3<br>with multiple lines</dt-box>
        <dt-box surface="moderate-opaque" padding="200" border-radius="300">Stack item 4</dt-box>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</dt-box>
<!-- @code -->
<dt-stack
  direction="row"
  as="section"
  gap="200"
>
  <dt-stack>
    Stack item 1
  </dt-stack>
  <dt-stack gap="200">
    <dt-box>Stack item 2</dt-box>
    <dt-stack
      direction="row-reverse"
      gap="200"
    >
      <dt-box>Stack item 3<br>with multiple lines</dt-box>
      <dt-box>Stack item 4</dt-box>
    </dt-stack>
  </dt-stack>
</dt-stack>
```

### Example: Align and Justify

Like `direction` and `gap`, the `align` and `justify` props support responsive object syntax to change alignment at different breakpoints.

```vue demo
<dt-box surface="moderate-opaque" border-radius="300">
  <dt-stack
  direction="row"
  gap="100"
  :align="{ default: 'start', md: 'center', lg: 'end' }"
  >
  <dt-box surface="moderate-opaque" padding="200" border-radius="300">
    Short
  </dt-box>
  <dt-box surface="moderate-opaque" padding="200" border-radius="300">
    Taller<br>
    item
  </dt-box>
  <dt-box surface="moderate-opaque" padding="200" border-radius="300">
    Short
  </dt-box>
</dt-stack>
</dt-box>
<!-- @code -->
<dt-stack
  direction="row"
  gap="100"
  :align="{ default: `start`, md: `center`, lg: `end` }"
>
  <dt-box>Short</dt-box>
  <dt-box>
    Taller<br>
    item
  </dt-box>
  <dt-box>Short</dt-box>
</dt-stack>
```

Resize your browser to see the alignment change at different breakpoints.

```vue demo
<dt-stack
  direction="row"
  gap="0"
  :justify="{ default: 'start', md: 'center', lg: 'space-between' }"
  class="d-w100p d-bgc-moderate-opaque d-bar-400"
>
  <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 1</dt-box>
  <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 2</dt-box>
  <dt-box surface="moderate-opaque" padding="200" border-radius="300">Item 3</dt-box>
</dt-stack>
<!-- @code -->
<dt-stack
  direction="row"
  :justify="{ default: `start`, md: `center`, lg: `space-between` }"
  class="d-w100p"
>
  <dt-box>Item 1</dt-box>
  <dt-box>Item 2</dt-box>
  <dt-box>Item 3</dt-box>
</dt-stack>
```

Resize your browser to see the justification change at different breakpoints.

## Migrating from Flex CSS Utilities

View the [Migrating from Flex CSS Utilities to DtStack](/guides/migration/flex-to-stack/) for more details.

## Examples

### Profile Card

```vue demo
<ExampleProfileCard />
<!-- @code -->
<dt-stack gap="200">
  <dt-stack gap="100" justify="space-between">
    <dt-stack>
      <dt-text as="h2" kind="headline" :size="500" strength="medium" density="200" class="d-fs-400">
        Katie Rodriguez
      </dt-text>
      <dt-stack direction="row" gap="350">
        <dt-text tone="positive">
          Available
        </dt-text>
        <dt-text>&bull;</dt-text>
        <dt-text tone="tertiary">
          Working from coffee shop
        </dt-text>
      </dt-stack>
    </dt-stack>
    <dt-stack gap="200">
      <dt-text kind="body" :size="300" density="200" strength="semibold" tone="tertiary">
        Chief Customer Success Officer
      </dt-text>
      <dt-text kind="body" :size="200" density="200">
        <dt-text strength="semibold">
          6:19 am
        </dt-text> local time
      </dt-text>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="100" direction="row" justify="space-between">
    <dt-button class="d-fl1" kind="muted" importance="outlined">
      <template #startIcon="{ iconSize }">
        <dt-icon-phone :size="iconSize" />
      </template>
      Call
    </dt-button>
    <dt-button class="d-fl1" kind="muted" importance="outlined">
      <template #startIcon="{ iconSize }">
        <dt-icon-quick-reply :size="iconSize" />
      </template>
      Message
    </dt-button>
    <dt-button class="d-fl1" kind="muted" importance="outlined">
      <template #startIcon="{ iconSize }">
        <dt-icon-video :size="iconSize" />
      </template>
      Meet
    </dt-button>
  </dt-stack>
</dt-stack>
```

### Call Log

```vue demo
<dt-stack gap="100" class="d-w-800">
  <dt-text as="h2" kind="headline" :size="400">Saturday, May 24, 2025</dt-text>
  <dt-stack direction="row" gap="100" class="d-w100p">
    <dt-avatar full-name="Ashanti Trevor" />
    <dt-stack class="d-fl1">
      <dt-text kind="body" :size="200" strength="bold">Ashanti Trevor</dt-text>
      <dt-stack direction="row" gap="50">
        <dt-stack direction="row" gap="100">
          <dt-icon name="phone-outgoing" size="200" class="d-fc-tertiary" />
          <dt-text kind="body" :size="100" tone="tertiary">Outgoing call</dt-text>
        </dt-stack>
        <dt-text kind="body" :size="100" tone="tertiary">&bull;</dt-text>
        <dt-text kind="body" :size="100" tone="tertiary">2 minutes 10 seconds</dt-text>
      </dt-stack>
    </dt-stack>
    <dt-text kind="body" :size="200" tone="tertiary" numeric>3:23 pm</dt-text>
    <dt-badge kind="count" type="bulletin" text="6" />
  </dt-stack>
</dt-stack>
```

## Vue API

<component-vue-api component-name="stack" />

## Classes

<component-class-table component-name="stack"></component-class-table>

<script setup>
  import { ref } from 'vue';
  import ClampedTableWrapper from '@baseComponents/ClampedTableWrapper.vue';
  import ExampleProfileCard from '@exampleComponents/ExampleProfileCard.vue';
  import { values as spacingValues } from '@data/spacing.json';

  const selectedGap = ref('100');

  const gapToPx = (gap) => {
    const entry = spacingValues.find(v => v.value === gap);
    return entry ? `${parseFloat(entry.output) * 10}px` : gap;
  };

  const setGap = (gap) => {
    selectedGap.value = gap;
  };

  const allGaps = window.DIALTONE_CONSTANTS.DT_STACK_GAP;
  const gaps = allGaps.slice(0, allGaps.indexOf('400') + 1);
</script>

<style scoped lang="less">
  .axis-outline {
    --axis-size: var(--dt-spacing-25);
    --axis-offset: var(--dt-spacing-25-negative);
    --axis-color: var(--dt-color-border-critical);
    --axis-opacity: var(--dt-opacity-800);
    --axis-pattern-vertical: repeating-linear-gradient(
      to bottom,
      var(--axis-color) 0,
      var(--axis-color) calc(var(--axis-size) * 2),
      transparent calc(var(--axis-size) * 2),
      transparent calc(var(--axis-size) * 4)
    );
    --axis-pattern-horizontal: repeating-linear-gradient(
      to right,
      var(--axis-color) 0,
      var(--axis-color) calc(var(--axis-size) * 2),
      transparent calc(var(--axis-size) * 2),
      transparent calc(var(--axis-size) * 4)
    );

    position: relative;

    &:before,
    &:after {
      content: "";
      position: absolute;
      z-index: 1;
      border-radius: var(--dt-size-radius-pill);
      background-image: var(--axis-pattern-vertical); // Default to vertical
      opacity: var(--axis-opacity);
    }

    &:hover:before,
    &:hover:after {
      --axis-opacity: var(--dt-opacity-1300);
      background-image: none;
      background-color: var(--axis-color);
    }

    // Inline axis indicators (vertical lines)
    &--inline-start::before {
      inset-inline-start: var(--axis-offset);
      inline-size: var(--axis-size);
      block-size: 100%;
    }

    &--inline-center::before {
      inset-inline-start: 50%;
      inset-block-start: 50%;
      transform: translate(-50%, -50%);
      inline-size: var(--axis-size);
      block-size: 100%;
    }

    &--inline-end::before {
      inset-inline-end: var(--axis-offset);
      inline-size: var(--axis-size);
      block-size: 100%;
    }

    &--inline-stretch {
      &::before {
        inset-inline-start: var(--axis-offset);
        inline-size: var(--axis-size);
        block-size: 100%;
      }

      &::after {
        inset-inline-end: var(--axis-offset);
        inline-size: var(--axis-size);
        block-size: 100%;
      }
    }

    // Block axis indicators (horizontal lines)
    &--block-start::before {
      inset-block-start: var(--axis-offset);
      block-size: var(--axis-size);
      inline-size: 100%;
      background-image: var(--axis-pattern-horizontal);
    }

    &--block-center::before {
      inset-inline-start: 50%;
      inset-block-start: 50%;
      transform: translate(-50%, -50%);
      inline-size: 100%;
      block-size: var(--axis-size);
      background-image: var(--axis-pattern-horizontal);
    }

    &--block-end::before {
      inset-block-end: var(--axis-offset);
      block-size: var(--axis-size);
      inline-size: 100%;
      background-image: var(--axis-pattern-horizontal);
    }

    &--block-stretch {
      &::before {
        inset-block-start: var(--axis-offset);
        block-size: var(--axis-size);
        inline-size: 100%;
        background-image: var(--axis-pattern-horizontal);
      }

      &::after {
        inset-block-end: var(--axis-offset);
        block-size: var(--axis-size);
        inline-size: 100%;
        background-image: var(--axis-pattern-horizontal);
      }
    }

    // Special case for baseline
    &--baseline::before {
      inset-block-end: var(--dt-spacing-300);
      block-size: var(--axis-size);
      inline-size: 100%;
      background-image: var(--axis-pattern-horizontal);
    }
  }
</style>
