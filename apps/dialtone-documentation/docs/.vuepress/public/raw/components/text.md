# Text

Consistent typography styling through semantic text kinds and sizes.

- **Status**: beta
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-text--default

## Usage

```vue
<dt-text {{props}}> ... </dt-text>
```

Use in place of manually applying Text Styles. Examples of manual application **you should avoid** include:

* Applying Text Styles classes, e.g. `class="d-text-body--md"`
* Combinations of CSS Utilities, e.g. `class="d-fs-300 d-fw-semibold d-lh-300"`
* Custom CSS, e.g. `.foo { font: var(--dt-typography-body-md); }`.

### Guidance

* Prefer `DtText` over individual typography utility classes to keep implementations aligned with token updates.
* Use the default slot for rich content. The `text` prop provides a simple fallback string when no slot content is present.
* Choose the `as` prop to match the semantic HTML element (e.g., `h1`, `label`, `p`).
* All properties are optional, as they layer in on top of each other.

**Do:**

* Replace multiple `d-` typography classes with a single `dt-text` instance.
* Pick the smallest `kind`/`size` combination that conveys the desired hierarchy.
* Use `tone` for semantic color tokens instead of standalone `d-fc-*` classes.

**Don't:**

* Mix `DtText` with conflicting typography utilities (e.g., `d-fs-*`).
* Render headings with non-heading tags (e.g., avoid `as="div"` for top-level titles).
* Depend on the `text` prop when the content requires inline formatting; slot it instead.

## Variants

### Kind

Declare the role of the content. Default will inherit styles from the parent.

```vue
<dt-text kind="headline">Headline</dt-text>
<dt-text kind="body">Body</dt-text>
<dt-text kind="label">Label</dt-text>
<dt-text kind="code">Code</dt-text>
<dt-text>Default (inherits)</dt-text>
```

### Size

All kinds support `size` prop, but not all sizes are available for each kind. When `kind` is set, size defaults to `md` if not specified.

```vue
<dt-text kind="{{kind}}" size="{{size}}">....</dt-text>
```

### Numeric

The `numeric` prop applies styles that ensure that each number is set with consistent width, making them align properly when displayed together. Ideal for displaying aligned data such as phone numbers or numbers in a table.

```vue
<dt-text numeric>(913) 555-3170</dt-text>
```

### Strength

Override the font-weight of the text. Applies to any kind/size combination. If omitted, the default weight from the typography token is used.

```vue
<dt-text strength="{{strength}}">...</dt-text>
```

### Density

Override the line-height of the text. Applies to any kind/size combination. If omitted, the default line-height from the typography token is used.

```vue
<dt-text density="{{density}}">...</dt-text>
```

## Tone

Use `tone` to declare the text's tone, which will map to a foreground color. By default, the tone is inherited from its parent.

```vue
<dt-text tone="{{tone}}">...</dt-text>
```

## As

Use `as` to declare the underlying HTML tag that the component should render, independent of the visual styling. Defaults to `span`.

```vue
<dt-text kind="headline" as="h1" size="2xl">...</dt-text>
<dt-text kind="body" as="p" size="lg">...</dt-text>
<dt-text kind="headline" as="h2" size="xl">...</dt-text>
<dt-text kind="body" as="p">...</dt-text>
<dt-text kind="headline" as="h2" size="xl">...</dt-text>
<dt-text kind="body" as="p">...</dt-text>
<dt-text kind="headline" as="h2" size="xl">...</dt-text>
<dt-text kind="body" as="p">...</dt-text>
```

## Align

Since `DtText`'s default element is a `<span>`, which is inline by default, the `align` prop will only work if its element is styled in a block context.

```vue
<dt-text align="start">....</dt-text>
<dt-text align="center">....</dt-text>
<dt-text align="end">....</dt-text>
<dt-text align="justify">....</dt-text>
```

## Truncate

Since `DtText`'s default element is a `<span>`, the `truncate` will only work if its element is in block or inline-block context, e.g. `<div>...</div>`.

```vue
<dt-text as="p" truncate>....</dt-text>
```

## Max Lines

```vue
<dt-text as="p" :max-lines="maxLines">....</dt-text>
```

## Wrap

Control text wrapping behavior. Particularly useful for headlines where balanced line lengths improve readability.

Since `DtText`'s default element is a `<span>`, which is inline by default, the `wrap` prop will only work if its element is styled in a block context.

```vue
<dt-text>....</dt-text>
<dt-text wrap="balance">....</dt-text>
<dt-text wrap="pretty">....</dt-text>
<dt-text wrap="nowrap">....</dt-text>
```

## Text Box Trim

Remove extra leading space above and/or below text. Useful for tight component layouts where text needs to align precisely with adjacent elements.

Text box trim will only affect elements with block or inline-block styled context. It may have no effect on elements with inline or flex context.

```vue
<dt-text as="p" text-box-trim="start">....</dt-text>
<dt-text as="p" text-box-trim="end">....</dt-text>
<dt-text as="p" text-box-trim="both">....</dt-text>
```

**Do:**

* Use `text-box-trim="both"` when text needs to align flush with container's top and/or bottom edges.

**Don't:**

* Apply text-box-trim to body copy that benefits from natural line spacing.
* Use text-box-trim as a substitute for proper layout spacing.

  kind="info"
  class="d-wmx100p d-my24"
  hide-close
  title="Browser Support"
>
  Text box trim requires modern browser support for <code class="d-bgc-transparent">text-box-trim</code>. Chrome 133+, Edge 132+, Safari 18.2+ as of November 2025. Otherwise, it will gracefully fallback to default rendering with half-leading above and below.

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

## Accessibility

* Maintain semantic structure via `as` (e.g., screen readers expect heading levels to be sequential).
* When using `truncate`, provide another way to access the full content (tooltip, detail view, or explicit `aria-label`). `DtText` does not apply alternative access to the full string, so consuming applications should opt in.
* Allow numeric content to remain readable by enabling the `numeric` prop when aligning tables or numbers that dynamically update.

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `as` | HTML tag or component used for rendering. | `string` | `'span'` |
| `kind` | Typography kind mapping to headline/body/label/code token sets. | `string` | `null` |
| `size` | Size variant within the selected `kind`. Falls back to `md` if unsupported. Headline supports all sizes; body/label/code support lg, md, sm, xs. | `string` | `null` |
| `tone` | Aligns to available foreground color tokens, e.g. `tertiary`, `critical`, etc. | `string` | `null` |
| `align` | Logical text alignment. Requires block/inline-block context. | `string` | `null` |
| `truncate` | Enables single-line truncation (i.e. ellipsis) when true; requires block/inline-block context. | `boolean` | `false` |
| `maxLines` | Applies multi-line truncation (i.e. clamp) when greater than zero; requires block/inline-block context. | `number` | `null` |
| `numeric` | Renders numeric content with tabular figures. | `boolean` | `false` |
| `wrap` | Controls text wrapping behavior. | `string` | `null` |
| `textBoxTrim` | Controls text-box-trim (leading space above/below text). Useful for tight component layouts. | `string` | `null` |
| `strength` | Overrides font-weight. Applies to any kind/size combination. | `string` | `null` |
| `density` | Overrides line-height. Applies to any kind/size combination. | `string\|number` | `null` |

### Slots

| Name | Description |
| --- | --- |
| `default` | Default slot for text content |

## Classes

| Class | Applies to | Description |
| --- | --- | --- |
| `d-text` | N/A | Text component base class. |
| `d-text-headline--3xl` | .d-text | Headline style, size 3xl. |
| `d-text-headline--2xl` | .d-text | Headline style, size 2xl. |
| `d-text-headline--xl` | .d-text | Headline style, size xl. |
| `d-text-headline--lg` | .d-text | Headline style, size lg. |
| `d-text-headline--md` | .d-text | Headline style, size md. |
| `d-text-headline--sm` | .d-text | Headline style, size sm. |
| `d-text-headline--xs` | .d-text | Headline style, size xs. |
| `d-text-body--lg` | .d-text | Body style, size lg. |
| `d-text-body--md` | .d-text | Body style, size md. |
| `d-text-body--sm` | .d-text | Body style, size sm. |
| `d-text-body--xs` | .d-text | Body style, size xs. |
| `d-text-label--lg` | .d-text | Label style, size lg. |
| `d-text-label--md` | .d-text | Label style, size md. |
| `d-text-label--sm` | .d-text | Label style, size sm. |
| `d-text-label--xs` | .d-text | Label style, size xs. |
| `d-text-code--lg` | .d-text | Code style, size lg. |
| `d-text-code--md` | .d-text | Code style, size md. |
| `d-text-code--sm` | .d-text | Code style, size sm. |
| `d-text-code--xs` | .d-text | Code style, size xs. |
| `d-text--truncate` | .d-text | Truncates text with ellipsis. |
| `d-text--line-clamp` | .d-text | Enables multi-line truncation. Use with --dt-text-line-clamp CSS variable. |
| `d-text--numeric` | .d-text | Applies tabular-nums for numeric alignment. |
| `d-text--align-start` | .d-text | Aligns text to start. |
| `d-text--align-center` | .d-text | Aligns text to center. |
| `d-text--align-end` | .d-text | Aligns text to end. |
| `d-text--align-justify` | .d-text | Justifies text. |
| `d-text--wrap-wrap` | .d-text | Normal text wrapping. |
| `d-text--wrap-nowrap` | .d-text | Prevents text wrapping. |
| `d-text--wrap-balance` | .d-text | Balances line lengths. |
| `d-text--wrap-pretty` | .d-text | Optimizes line breaks. |
| `d-text--trim-start` | .d-text | Trims leading whitespace. |
| `d-text--trim-end` | .d-text | Trims trailing whitespace. |
| `d-text--trim-both` | .d-text | Trims both leading and trailing whitespace. |
| `d-text--fw-bold` | .d-text | Bold font weight. |
| `d-text--fw-semibold` | .d-text | Semibold font weight. |
| `d-text--fw-medium` | .d-text | Medium font weight. |
| `d-text--fw-normal` | .d-text | Normal font weight. |
| `d-text--lh-100` | .d-text | Line height 100. |
| `d-text--lh-200` | .d-text | Line height 200. |
| `d-text--lh-300` | .d-text | Line height 300. |
| `d-text--lh-400` | .d-text | Line height 400. |
| `d-text--lh-500` | .d-text | Line height 500. |
| `d-text--lh-600` | .d-text | Line height 600. |
