# Line Clamp

Limiting the number of lines displayed for text content.

- **Keywords**: truncate, ellipsis, max lines

> **Use DtText in favor of CSS Utilities.** Reach for the [DtText](../../components/text.md) component before considering any typography utility.

## Usage

Use `d-lc-{n}` to truncate text at a specific number of lines with an ellipsis.

```html
<p class="d-lc-{n}">Lorem ipsum dolor...</p>
```

### Avoiding display conflicts

    Avoid applying line-clamp to elements with flex or grid <code>display</code> styles. The clamped text should be considered a child element of the flex or grid container.

#### Flex example

```html
<!-- This won't work because DtStack is flex-based -->
<dt-stack class="d-lc-3"> ... </dt-stack>

<!-- This will -->
<dt-stack>
  <p class="d-lc-3"> ... </p>
</dt-stack>
```

#### Grid example

```html
<!-- This won't work -->
<div class="d-lc-3 d-d-grid"> ... </div>

<!-- This will -->
<div class="d-d-grid">
  <p class="d-lc-3"> ... </p>
</div>
```

## Custom

The `d-lc-{n}` utility currently goes up to `9`. Should you need to go beyond, use the `d-lc-custom` class and locally adjust the CSS custom property `--lc-lines`.

```html
<div class="d-lc-custom" style="--lc-lines: 11">
  ...
</div>
```

## Classes

| Class | Output |
| --- | --- |
| `d-lc-1` | --lc-lines: 1 |
| `d-lc-2` | --lc-lines: 2 |
| `d-lc-3` | --lc-lines: 3 |
| `d-lc-4` | --lc-lines: 4 |
| `d-lc-5` | --lc-lines: 5 |
| `d-lc-6` | --lc-lines: 6 |
| `d-lc-7` | --lc-lines: 7 |
| `d-lc-8` | --lc-lines: 8 |
| `d-lc-9` | --lc-lines: 9 |
| `d-lc-none` | display: initial !important; overflow: initial !important; -webkit-line-clamp: initial !important |
