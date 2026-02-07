# Stack

Foundational layout primitive for elements along a vertical or horizontal axis, with consistent spacing and alignment.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-stack--default
- **Keywords**: layout, vertical, horizontal, d-stack, DtStack, dt-stack, flex container, auto layout

## Direction

### Column

`direction="column"` will flow child items vertically, i.e. top to bottom. It is the default direction and doesn't need to be explictily set.

```vue
<dt-stack
  gap="500"
>
  <div> Stack item 1 </div>
  <div> Stack item 2 </div>
  <div> Stack item 3 </div>
</dt-stack>
```

### Row

`direction="row"` will flow child items horizontally, i.e. left to right.

```vue
<dt-stack
  gap="500"
  direction="row"
>
  <div> Stack item 1 </div>
  <div> Stack item 2 </div>
  <div> Stack item 3 </div>
</dt-stack>
```

### Row Reverse

```vue
<dt-stack
  gap="500"
  direction="row-reverse"
>
  <div> Stack item 1 </div>
  <div> Stack item 2 </div>
  <div> Stack item 3 </div>
</dt-stack>
```

### Column Reverse

```vue
<dt-stack
  gap="500"
  direction="column-reverse"
>
  <div> Stack item 1 </div>
  <div> Stack item 2 </div>
  <div> Stack item 3 </div>
</dt-stack>
```

## As

The `as` prop controls which HTML element the Stack component renders as. Defaults to `<div>`, but can be declared as any valid HTML element to ensure semantic and accessible markup.

Declaring as an appropriate HTML element improves accessibility by helping screen readers better understand document structure, and maintainability with clear code intent.

**Common `as` values:** `span`, `ul`, `ol`, `li`, `section`, `nav`, `article`, `main`, `aside`, `header`, `footer`.

### Example: section

Use `as="section"` to create a thematic grouping of content.

```vue
<dt-stack
  as="section"
  gap="400"
>
  <div>Stack item 1</div>
  <div>Stack item 2</div>
  <div>Stack item 3</div>
</dt-stack>
```

### Example: span

Use `as="span"` when you need an inline container.

```vue
<dt-stack
  as="span"
  direction="row"
  gap="300"
>
  <span>Inline item 1</span>
  <span>Inline item 2</span>
  <span>Inline item 3</span>
</dt-stack>
```

## Gap

```vue
<dt-stack
  gap="400"
>
  <div> Stack item 1 </div>
  <div> Stack item 2 </div>
  <div> Stack item 3 </div>
</dt-stack>
```

### Available gaps

  <div>
| Size | Design Token | REM | PX |
| --- | --- | --- | --- |
| 0 | var(--dt-size-0) | 0.0rem | 0px |
| 50 | var(--dt-size-50) | 0.05rem | .5px |
| 100 | var(--dt-size-100) | 0.1rem | 1px |
| 200 | var(--dt-size-200) | 0.2rem | 2px |
| 300 | var(--dt-size-300) | 0.4rem | 4px |
| 350 | var(--dt-size-350) | 0.6rem | 6px |
| 400 | var(--dt-size-400) | 0.8rem | 8px |
| 450 | var(--dt-size-450) | 1.2rem | 12px |
| 500 | var(--dt-size-500) | 1.6rem | 16px |
| 525 | var(--dt-size-525) | 2.0rem | 20px |
| 550 | var(--dt-size-550) | 2.4rem | 24px |
| 600 | var(--dt-size-600) | 3.2rem | 32px |
| 625 | var(--dt-size-625) | 4.2rem | 42px |
| 650 | var(--dt-size-650) | 4.8rem | 48px |
| 700 | var(--dt-size-700) | 6.4rem | 64px |

  </div>

## Align

The `align` prop controls how items are aligned along the cross-axis (perpendicular to the stack direction). For row stacks, this controls vertical alignment. For column stacks, this controls horizontal alignment.

Available `align` values: `start`, `center`, `end`, `stretch`, `baseline`.

### Default

The `align` prop is optional. Unless specified, it will default vertical stacks to `align-items="stretch"` and horizontal stacks to `align-items="center"`.

```vue
<dt-stack>
  <div>Short</div>
  <div>
    Taller item<br>
    with more content
  </div>
  <div>Short</div>
</dt-stack>
<dt-stack direction="row">
  <div>Short</div>
  <div>
    Taller item<br>
    with more content
  </div>
  <div>Short</div>
</dt-stack>
```

### Start

Align items to the start of the cross-axis.

```vue
<dt-stack
  gap="400"
  align="start"
>
  <div>Short</div>
  <div>
    Taller item<br>
    with more content
  </div>
  <div>Short</div>
</dt-stack>
<dt-stack
  direction="row"
  gap="400"
  align="start"
>
  <div>Short</div>
  <div>
    Taller item<br>
    with more content
  </div>
  <div>Short</div>
</dt-stack>
```

### Center

Center items along the cross-axis.

```vue
<dt-stack
  direction="row"
  gap="400"
  align="center"
>
  <div>Short</div>
  <div>
    Taller item<br>
    with more content
  </div>
  <div>Short</div>
</dt-stack>
```

### End

Align items to the end of the cross-axis.

```vue
<dt-stack
  gap="400"
  align="end"
>
  <div>Short</div>
  <div>
    Taller item<br>
    with more content
  </div>
  <div>Short</div>
</dt-stack>
<dt-stack
  direction="row"
  gap="400"
  align="end"
>
  <div>Short</div>
  <div>
    Taller item<br>
    with more content
  </div>
  <div>Short</div>
</dt-stack>
```

### Stretch

Stretch items to fill the container height.

```vue
<dt-stack
  direction="row"
  gap="400"
  align="stretch"
>
  <div>Short</div>
  <div>
    Taller item<br>
    with more content
  </div>
  <div>Short</div>
</dt-stack>
```

### Baseline

Align items along their text baselines.

```vue
<dt-stack
  direction="row"
  gap="400"
  align="baseline"
>
  <dt-text kind="body" size="xs">Small body</dt-text>
  <dt-text kind="body" size="md">Medium body</dt-text>
  <dt-text kind="headline" size="2xl">Large headline</dt-text>
</dt-stack>
```

## Justify

The `justify` prop controls how items are distributed along the main axis (the direction of the stack). For row stacks, this controls horizontal distribution. For column stacks, this controls vertical distribution.

Available `justify` values: `start` (default), `center`, `end`, `space-around`, `space-between`, `space-evenly`.

### Start

Align items to the start of the main axis (default).

```vue
<dt-stack
  justify="start"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</dt-stack>
```

### Center

Center items along the main axis.

```vue
<dt-stack
  justify="center"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</dt-stack>
```

### End

Align items to the end of the main axis.

```vue
<dt-stack
  justify="end"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</dt-stack>
```

### Space Around

Distribute items with equal space around each item.

```vue
<dt-stack
  justify="space-around"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</dt-stack>
```

### Space Between

Distribute items with space between them, edges flush to container.

```vue
<dt-stack
  direction="row"
  gap="400"
  justify="space-between"
  class="d-w100p"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</dt-stack>
```

### Space Evenly

Distribute items with equal space between all items, including edges.

```vue
<dt-stack
  justify="space-evenly"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</dt-stack>
```

## Responsive

### Example

Stacks column at small screen size and column reverse at large screen

```vue
<dt-stack
  :direction="{ `default`: `row`, `sm`: `column`, `lg`: `column-reverse` }"
  gap="500"
>
  <div>
    Stack item 1
  </div>
  <div>
    Stack item 2
  </div>
  <div>
    Stack item 3
  </div>
</dt-stack>
```

Set `200` as the default gap, `300` for small and larger, `400` for medium, `500` for large, and `600` for extra large. Learn more about how our breakpoints work in the [Responsive Breakpoints documentation](../utilities/responsive/breakpoints.md).

```vue
<dt-stack :gap="{ default: `300`, xl: `600`, lg: `500`, md: `400`, sm: `300` }">
  <div> Stack item 1 </div>
  <div> Stack item 2 </div>
  <div> Stack item 3 </div>
</dt-stack>
```

### Nested Example

Stacks row with gap 500 and stacks in row reverse the nested stack with gap 500.

```vue
<dt-stack
  direction="row"
  as="section"
  gap="500"
>
  <dt-stack>
    Stack item 1
  </dt-stack>
  <dt-stack gap="500">
    <div>Stack item 2</div>
    <dt-stack
      direction="row-reverse"
      gap="500"
    >
      <div>Stack item 3<br>with multiple lines</div>
      <div>Stack item 4</div>
    </dt-stack>
  </dt-stack>
</dt-stack>
```

### Example: Align and Justify

Like `direction` and `gap`, the `align` and `justify` props support responsive object syntax to change alignment at different breakpoints.

```vue
<dt-stack
  direction="row"
  gap="400"
  :align="{ default: `start`, md: `center`, lg: `end` }"
>
  <div>Short</div>
  <div>
    Taller<br>
    item
  </div>
  <div>Short</div>
</dt-stack>
```

Resize your browser to see the alignment change at different breakpoints.

```vue
<dt-stack
  direction="row"
  :justify="{ default: `start`, md: `center`, lg: `space-between` }"
  class="d-w100p"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</dt-stack>
```

Resize your browser to see the justification change at different breakpoints.

## Migrating from Flex CSS Utilities

View the [Migrating from Flex CSS Utilities to DtStack](/about/whats-new/posts/2025-12-2) for more details.

## Examples

### Profile Card

```vue
<dt-stack gap="500">
  <dt-stack gap="400" class="d-jc-space-between">
    <dt-stack>
      <dt-text as="h2" kind="headline" size="xl" strength="medium" density="200" class="d-fs-400">
        Katie Rodriguez
      </dt-text>
      <dt-stack direction="row" gap="350">
        <dt-text tone="success">
          Available
        </dt-text>
        <dt-text>&bull;</dt-text>
        <dt-text tone="tertiary">
          Working from coffee shop
        </dt-text>
      </dt-stack>
    </dt-stack>
    <dt-stack gap="200">
      <dt-text kind="body" size="md" density="200" strength="semibold" tone="tertiary">
        Chief Customer Success Officer
      </dt-text>
      <dt-text kind="body" size="sm" density="200">
        <dt-text strength="semibold">
          6:19 am
        </dt-text> local time
      </dt-text>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="400" direction="row" class="d-jc-space-between">
    <dt-button class="d-fl1" kind="muted" importance="outlined">
      <template #icon="{ iconSize }">
        <dt-icon-phone :size="iconSize" />
      </template>
      Call
    </dt-button>
    <dt-button class="d-fl1" kind="muted" importance="outlined">
      <template #icon="{ iconSize }">
        <dt-icon-quick-reply :size="iconSize" />
      </template>
      Message
    </dt-button>
    <dt-button class="d-fl1" kind="muted" importance="outlined">
      <template #icon="{ iconSize }">
        <dt-icon-video :size="iconSize" />
      </template>
      Meet
    </dt-button>
  </dt-stack>
</dt-stack>
```

### Call Log

```vue
<dt-text as="h2" kind="headline" size="lg">Saturday, May 24, 2025</dt-text>
<dt-stack direction="row" gap="450" class="d-w100p">
  <dt-avatar full-name="Ashanti Trevor" />
  <dt-stack class="d-fl1">
    <dt-text kind="body" size="sm" strength="bold">Ashanti Trevor</dt-text>
    <dt-stack direction="row" gap="300">
      <dt-stack direction="row" gap="400">
        <dt-icon name="phone-outgoing" size="200" class="d-fc-tertiary" />
        <dt-text kind="body" size="xs" tone="tertiary">Outgoing call</dt-text>
      </dt-stack>
      <dt-text kind="body" size="xs" tone="tertiary">&bull;</dt-text>
      <dt-text kind="body" size="xs" tone="tertiary">2 minutes 10 seconds</dt-text>
    </dt-stack>
  </dt-stack>
  <dt-text kind="body" size="sm" tone="tertiary">3:23 pm</dt-text>
  <dt-badge kind="count" type="bulletin" text="6" />
</dt-stack>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `direction` | Set this prop to the direction to stack the items. You can override the default direction with 'default' key. All the undefined breakpoints will have 'default' value. By default, for the column direction it will have `justify-content: flex-start` and for the row direction `align-items: center`. This can be overridden using the `align` and `justify` props. | `string\|object` | `'column'` |
| `as` | Set this prop to render stack as a specific HTML element. | `string` | `'div'` |
| `gap` | The gap property controls the spacing between items in the stack. The gap can be set to a string, or object with breakpoints. All the undefined breakpoints will have the 'default' value. You can override the default gap with 'default' key. In case of string, it will be applied to all the breakpoints. Valid values are '0', '50', '100', '200', '300', '350', '400', '450', '500', '525', '550', '600', '625', '650', '700'. | `string\|object` | `'0'` |
| `align` | The align property controls the alignment of items along the cross axis. The align can be set to a string, or object with breakpoints. All the undefined breakpoints will have the 'default' value. You can override the default align with 'default' key. In case of string, it will be applied to all the breakpoints. If not specified, alignment uses CSS defaults: stretch for column direction, center for row/row-reverse directions (set by CSS). Valid values are 'start', 'center', 'end', 'stretch', 'baseline'. | `string\|object` | `''` |
| `justify` | The justify property controls the justification of items along the main axis. The justify can be set to a string, or object with breakpoints. All the undefined breakpoints will have the 'default' value. You can override the default justify with 'default' key. In case of string, it will be applied to all the breakpoints. Valid values are 'start', 'center', 'end', 'space-around', 'space-between', 'space-evenly'. | `string\|object` | `'start'` |

### Slots

| Name | Description |
| --- | --- |
| `default` | Slot for main content |

## Classes

| Class | Applies to | Description |
| --- | --- | --- |
| `d-stack` | N/A | Stack's parent wrapper. |
| `d-stack--column-reverse` | .d-stack | Styles stack group with column-reverse direction. |
| `d-stack--row` | .d-stack | Styles stack group with row direction. |
| `d-stack--row-reverse` | .d-stack | Styles stack group with row-reverse direction. |
| `d-stack--align-normal` | .d-stack | Aligns stack items with browser default behavior along the cross-axis (default). |
| `d-stack--align-start` | .d-stack | Aligns stack items to the start along the cross-axis. |
| `d-stack--align-center` | .d-stack | Aligns stack items to the center along the cross-axis. |
| `d-stack--align-end` | .d-stack | Aligns stack items to the end along the cross-axis. |
| `d-stack--align-stretch` | .d-stack | Stretches stack items to fill the cross-axis. |
| `d-stack--align-baseline` | .d-stack | Aligns stack items along their baselines. |
| `d-stack--justify-start` | .d-stack | Justifies stack items to the start along the main axis (default). |
| `d-stack--justify-center` | .d-stack | Justifies stack items to the center along the main axis. |
| `d-stack--justify-end` | .d-stack | Justifies stack items to the end along the main axis. |
| `d-stack--justify-around` | .d-stack | Distributes stack items with equal space around each item. |
| `d-stack--justify-between` | .d-stack | Distributes stack items with space between them. |
| `d-stack--justify-evenly` | .d-stack | Distributes stack items with equal space between all items. |
| `d-stack--gap-50` | .d-stack | Styles stack with gap 50 between elements. |
| `d-stack--gap-100` | .d-stack | Styles stack with gap 100 between elements. |
| `d-stack--gap-200` | .d-stack | Styles stack with gap 200 between elements. |
| `d-stack--gap-300` | .d-stack | Styles stack with gap 300 between elements. |
| `d-stack--gap-350` | .d-stack | Styles stack with gap 350 between elements. |
| `d-stack--gap-400` | .d-stack | Styles stack with gap 400 between elements. |
| `d-stack--gap-450` | .d-stack | Styles stack with gap 450 between elements. |
| `d-stack--gap-500` | .d-stack | Styles stack with gap 500 between elements. |
| `d-stack--gap-525` | .d-stack | Styles stack with gap 525 between elements. |
| `d-stack--gap-550` | .d-stack | Styles stack with gap 550 between elements. |
| `d-stack--gap-600` | .d-stack | Styles stack with gap 600 between elements. |
| `d-stack--gap-625` | .d-stack | Styles stack with gap 625 between elements. |
| `d-stack--gap-650` | .d-stack | Styles stack with gap 650 between elements. |
| `d-stack--gap-700` | .d-stack | Styles stack with gap 700 between elements. |
| `d-stack--sm-column` | .d-stack | Styles stack in small screen with column direction. |
| `d-stack--sm-column-reverse` | .d-stack | Styles stack in small screen with column reverse direction. |
| `d-stack--sm-row` | .d-stack | Styles stack in small screen with row direction. |
| `d-stack--sm-row-reverse` | .d-stack | Styles stack in small screen with row reverse direction. |
| `d-stack--sm-align-normal` | .d-stack | Aligns stack items with browser default behavior on small screens and larger. |
| `d-stack--sm-align-start` | .d-stack | Aligns stack items to the start on small screens and larger. |
| `d-stack--sm-align-center` | .d-stack | Aligns stack items to the center on small screens and larger. |
| `d-stack--sm-align-end` | .d-stack | Aligns stack items to the end on small screens and larger. |
| `d-stack--sm-align-stretch` | .d-stack | Stretches stack items to fill the cross-axis on small screens and larger. |
| `d-stack--sm-align-baseline` | .d-stack | Aligns stack items along their baselines on small screens and larger. |
| `d-stack--sm-justify-start` | .d-stack | Justifies stack items to the start on small screens and larger. |
| `d-stack--sm-justify-center` | .d-stack | Justifies stack items to the center on small screens and larger. |
| `d-stack--sm-justify-end` | .d-stack | Justifies stack items to the end on small screens and larger. |
| `d-stack--sm-justify-around` | .d-stack | Distributes stack items with equal space around each item on small screens and larger. |
| `d-stack--sm-justify-between` | .d-stack | Distributes stack items with space between them on small screens and larger. |
| `d-stack--sm-justify-evenly` | .d-stack | Distributes stack items with equal space between all items on small screens and larger. |
| `d-stack--sm-gap-50` | .d-stack | Styles stack with gap 50 on small screens and larger. |
| `d-stack--sm-gap-100` | .d-stack | Styles stack with gap 100 on small screens and larger. |
| `d-stack--sm-gap-200` | .d-stack | Styles stack with gap 200 on small screens and larger. |
| `d-stack--sm-gap-300` | .d-stack | Styles stack with gap 300 on small screens and larger. |
| `d-stack--sm-gap-350` | .d-stack | Styles stack with gap 350 on small screens and larger. |
| `d-stack--sm-gap-400` | .d-stack | Styles stack with gap 400 on small screens and larger. |
| `d-stack--sm-gap-450` | .d-stack | Styles stack with gap 450 on small screens and larger. |
| `d-stack--sm-gap-500` | .d-stack | Styles stack with gap 500 on small screens and larger. |
| `d-stack--sm-gap-525` | .d-stack | Styles stack with gap 525 on small screens and larger. |
| `d-stack--sm-gap-550` | .d-stack | Styles stack with gap 550 on small screens and larger. |
| `d-stack--sm-gap-600` | .d-stack | Styles stack with gap 600 on small screens and larger. |
| `d-stack--sm-gap-625` | .d-stack | Styles stack with gap 625 on small screens and larger. |
| `d-stack--sm-gap-650` | .d-stack | Styles stack with gap 650 on small screens and larger. |
| `d-stack--sm-gap-700` | .d-stack | Styles stack with gap 700 on small screens and larger. |
| `d-stack--md-column` | .d-stack | Styles stack in medium screen with column direction. |
| `d-stack--md-column-reverse` | .d-stack | Styles stack in medium screen with column reverse direction. |
| `d-stack--md-row` | .d-stack | Styles stack in medium screen with row direction. |
| `d-stack--md-row-reverse` | .d-stack | Styles stack in medium screen with row reverse direction. |
| `d-stack--md-align-normal` | .d-stack | Aligns stack items with browser default behavior on medium screens and larger. |
| `d-stack--md-align-start` | .d-stack | Aligns stack items to the start on medium screens and larger. |
| `d-stack--md-align-center` | .d-stack | Aligns stack items to the center on medium screens and larger. |
| `d-stack--md-align-end` | .d-stack | Aligns stack items to the end on medium screens and larger. |
| `d-stack--md-align-stretch` | .d-stack | Stretches stack items to fill the cross-axis on medium screens and larger. |
| `d-stack--md-align-baseline` | .d-stack | Aligns stack items along their baselines on medium screens and larger. |
| `d-stack--md-justify-start` | .d-stack | Justifies stack items to the start on medium screens and larger. |
| `d-stack--md-justify-center` | .d-stack | Justifies stack items to the center on medium screens and larger. |
| `d-stack--md-justify-end` | .d-stack | Justifies stack items to the end on medium screens and larger. |
| `d-stack--md-justify-around` | .d-stack | Distributes stack items with equal space around each item on medium screens and larger. |
| `d-stack--md-justify-between` | .d-stack | Distributes stack items with space between them on medium screens and larger. |
| `d-stack--md-justify-evenly` | .d-stack | Distributes stack items with equal space between all items on medium screens and larger. |
| `d-stack--md-gap-50` | .d-stack | Styles stack with gap 50 on medium screens and larger. |
| `d-stack--md-gap-100` | .d-stack | Styles stack with gap 100 on medium screens and larger. |
| `d-stack--md-gap-200` | .d-stack | Styles stack with gap 200 on medium screens and larger. |
| `d-stack--md-gap-300` | .d-stack | Styles stack with gap 300 on medium screens and larger. |
| `d-stack--md-gap-350` | .d-stack | Styles stack with gap 350 on medium screens and larger. |
| `d-stack--md-gap-400` | .d-stack | Styles stack with gap 400 on medium screens and larger. |
| `d-stack--md-gap-450` | .d-stack | Styles stack with gap 450 on medium screens and larger. |
| `d-stack--md-gap-500` | .d-stack | Styles stack with gap 500 on medium screens and larger. |
| `d-stack--md-gap-525` | .d-stack | Styles stack with gap 525 on medium screens and larger. |
| `d-stack--md-gap-550` | .d-stack | Styles stack with gap 550 on medium screens and larger. |
| `d-stack--md-gap-600` | .d-stack | Styles stack with gap 600 on medium screens and larger. |
| `d-stack--md-gap-625` | .d-stack | Styles stack with gap 625 on medium screens and larger. |
| `d-stack--md-gap-650` | .d-stack | Styles stack with gap 650 on medium screens and larger. |
| `d-stack--md-gap-700` | .d-stack | Styles stack with gap 700 on medium screens and larger. |
| `d-stack--lg-column` | .d-stack | Styles stack in large screen with column direction. |
| `d-stack--lg-column-reverse` | .d-stack | Styles stack in large screen with column reverse direction. |
| `d-stack--lg-row` | .d-stack | Styles stack in large screen with row direction. |
| `d-stack--lg-row-reverse` | .d-stack | Styles stack in large screen with row reverse direction. |
| `d-stack--lg-align-normal` | .d-stack | Aligns stack items with browser default behavior on large screens and larger. |
| `d-stack--lg-align-start` | .d-stack | Aligns stack items to the start on large screens and larger. |
| `d-stack--lg-align-center` | .d-stack | Aligns stack items to the center on large screens and larger. |
| `d-stack--lg-align-end` | .d-stack | Aligns stack items to the end on large screens and larger. |
| `d-stack--lg-align-stretch` | .d-stack | Stretches stack items to fill the cross-axis on large screens and larger. |
| `d-stack--lg-align-baseline` | .d-stack | Aligns stack items along their baselines on large screens and larger. |
| `d-stack--lg-justify-start` | .d-stack | Justifies stack items to the start on large screens and larger. |
| `d-stack--lg-justify-center` | .d-stack | Justifies stack items to the center on large screens and larger. |
| `d-stack--lg-justify-end` | .d-stack | Justifies stack items to the end on large screens and larger. |
| `d-stack--lg-justify-around` | .d-stack | Distributes stack items with equal space around each item on large screens and larger. |
| `d-stack--lg-justify-between` | .d-stack | Distributes stack items with space between them on large screens and larger. |
| `d-stack--lg-justify-evenly` | .d-stack | Distributes stack items with equal space between all items on large screens and larger. |
| `d-stack--lg-gap-50` | .d-stack | Styles stack with gap 50 on large screens and larger. |
| `d-stack--lg-gap-100` | .d-stack | Styles stack with gap 100 on large screens and larger. |
| `d-stack--lg-gap-200` | .d-stack | Styles stack with gap 200 on large screens and larger. |
| `d-stack--lg-gap-300` | .d-stack | Styles stack with gap 300 on large screens and larger. |
| `d-stack--lg-gap-350` | .d-stack | Styles stack with gap 350 on large screens and larger. |
| `d-stack--lg-gap-400` | .d-stack | Styles stack with gap 400 on large screens and larger. |
| `d-stack--lg-gap-450` | .d-stack | Styles stack with gap 450 on large screens and larger. |
| `d-stack--lg-gap-500` | .d-stack | Styles stack with gap 500 on large screens and larger. |
| `d-stack--lg-gap-525` | .d-stack | Styles stack with gap 525 on large screens and larger. |
| `d-stack--lg-gap-550` | .d-stack | Styles stack with gap 550 on large screens and larger. |
| `d-stack--lg-gap-600` | .d-stack | Styles stack with gap 600 on large screens and larger. |
| `d-stack--lg-gap-625` | .d-stack | Styles stack with gap 625 on large screens and larger. |
| `d-stack--lg-gap-650` | .d-stack | Styles stack with gap 650 on large screens and larger. |
| `d-stack--lg-gap-700` | .d-stack | Styles stack with gap 700 on large screens and larger. |
| `d-stack--xl-column` | .d-stack | Styles stack in extra large screen with column direction. |
| `d-stack--xl-column-reverse` | .d-stack | Styles stack in extra large screen with column reverse direction. |
| `d-stack--xl-row` | .d-stack | Styles stack in extra large screen with row direction. |
| `d-stack--xl-row-reverse` | .d-stack | Styles stack in extra large screen with row reverse direction. |
| `d-stack--xl-align-normal` | .d-stack | Aligns stack items with browser default behavior on extra large screens and larger. |
| `d-stack--xl-align-start` | .d-stack | Aligns stack items to the start on extra large screens and larger. |
| `d-stack--xl-align-center` | .d-stack | Aligns stack items to the center on extra large screens and larger. |
| `d-stack--xl-align-end` | .d-stack | Aligns stack items to the end on extra large screens and larger. |
| `d-stack--xl-align-stretch` | .d-stack | Stretches stack items to fill the cross-axis on extra large screens and larger. |
| `d-stack--xl-align-baseline` | .d-stack | Aligns stack items along their baselines on extra large screens and larger. |
| `d-stack--xl-justify-start` | .d-stack | Justifies stack items to the start on extra large screens and larger. |
| `d-stack--xl-justify-center` | .d-stack | Justifies stack items to the center on extra large screens and larger. |
| `d-stack--xl-justify-end` | .d-stack | Justifies stack items to the end on extra large screens and larger. |
| `d-stack--xl-justify-around` | .d-stack | Distributes stack items with equal space around each item on extra large screens and larger. |
| `d-stack--xl-justify-between` | .d-stack | Distributes stack items with space between them on extra large screens and larger. |
| `d-stack--xl-justify-evenly` | .d-stack | Distributes stack items with equal space between all items on extra large screens and larger. |
| `d-stack--xl-gap-50` | .d-stack | Styles stack with gap 50 on extra large screens and larger. |
| `d-stack--xl-gap-100` | .d-stack | Styles stack with gap 100 on extra large screens and larger. |
| `d-stack--xl-gap-200` | .d-stack | Styles stack with gap 200 on extra large screens and larger. |
| `d-stack--xl-gap-300` | .d-stack | Styles stack with gap 300 on extra large screens and larger. |
| `d-stack--xl-gap-350` | .d-stack | Styles stack with gap 350 on extra large screens and larger. |
| `d-stack--xl-gap-400` | .d-stack | Styles stack with gap 400 on extra large screens and larger. |
| `d-stack--xl-gap-450` | .d-stack | Styles stack with gap 450 on extra large screens and larger. |
| `d-stack--xl-gap-500` | .d-stack | Styles stack with gap 500 on extra large screens and larger. |
| `d-stack--xl-gap-525` | .d-stack | Styles stack with gap 525 on extra large screens and larger. |
| `d-stack--xl-gap-550` | .d-stack | Styles stack with gap 550 on extra large screens and larger. |
| `d-stack--xl-gap-600` | .d-stack | Styles stack with gap 600 on extra large screens and larger. |
| `d-stack--xl-gap-625` | .d-stack | Styles stack with gap 625 on extra large screens and larger. |
| `d-stack--xl-gap-650` | .d-stack | Styles stack with gap 650 on extra large screens and larger. |
| `d-stack--xl-gap-700` | .d-stack | Styles stack with gap 700 on extra large screens and larger. |
