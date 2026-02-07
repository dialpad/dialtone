# Lists

Utilities for controlling list styling.

- **Keywords**: list style,ordered list,unordered list,bullets,ol,ul

## Resetting a List

Use `d-ls-reset` to reset the margin, padding, and list-style-type of a list. Reseting a list applies to the parent `ol` or `ul`, any child `li` elements, and any child `ol` or `ul` elements.

```html
<ul class="d-ls-reset">
  <li>An unordered list item</li>
  <li>
    An unordered list item
    <ol>
      <li>A nested ordered list item</li>
      <li>A nested ordered list item</li>
    </ol>
  </li>
  <li>An unordered list item</li>
  <li>
    An unordered list item
    <ul>
      <li>A nested unordered list item</li>
      <li>A nested unordered list item</li>
    </ul>
  </li>
</ul>
```

## Changing the List Style Type

Use `d-lst-{none|disc|circle|decimal|content|none}` to change a list item's bullet styling.

```html
<dt-stack gap="400">
  <p>Paragraph of text.</p>
  <ul class="d-pl16">
    <li class="d-lst-disc"><strong>disc</strong> list item</li>
    <li class="d-lst-circle"><strong>circle</strong> list item</li>
    <li class="d-lst-decimal"><strong>decimal</strong> list item</li>
    <li class="d-lst-content" style="--ls-content: '🫠'"><strong>content</strong> list item</li>
    <li class="d-lst-none"><strong>none</strong> list item</li>
  </ul>
  <p>Paragraph of text.</p>
  <ul class="d-pl16">
    <li class="d-lst-disc">
      An unordered list item
      <ul class="d-pl16">
        <li class="d-lst-circle">A nested unordered list item</li>
        <li class="d-lst-circle">A nested unordered list item</li>
      </ul>
    </li>
    <li class="d-lst-disc">
      An unordered list item
      <ul class="d-pl16">
        <li class="d-pl8 d-lst-content" style="--ls-content: '✅'">A nested unordered list item</li>
        <li class="d-pl8 d-lst-content" style="--ls-content: '❌'">A nested unordered list item</li>
      </ul>
    </li>
  </ul>
</dt-stack>
```

## Custom Starting Number

Use the `start` attribute for an `<ol>` to set its starting number.

```html
<code-well-header class="d-d-flex d-jc-center d-fd-column d-p24 d-bgc-secondary d-w100p d-hmn102" custom>
  <dt-stack gap="400">
    <p>Paragraph of text.</p>
    <ol class="d-pl24">
      <li class="d-lst-decimal">Decimal list item</li>
      <li class="d-lst-decimal">Decimal list item</li>
      <li class="d-lst-decimal">Decimal list item</li>
    </ol>
    <p>Paragraph of text. The list below starts at 4.</p>
    <ol class="d-pl24" start="4">
      <li class="d-lst-decimal">Decimal list item</li>
      <li class="d-lst-decimal">Decimal list item</li>
      <li class="d-lst-decimal">Decimal list item</li>
    </ol>
  </dt-stack>
</code-well-header>
```

## Classes

| Class | Output |
| --- | --- |
| `d-ls-none` | list-style: none !important |
| `d-ls-reset` | margin: 0; padding: 0; list-style: none !important |
| `d-lst-circle` | list-style-type: circle !important |
| `d-lst-content` | list-style-type: var(--ls-content) !important |
| `d-lst-decimal` | list-style-type: decimal !important |
| `d-lst-disc` | list-style-type: disc !important |
| `d-lst-none` | list-style-type: none !important |
