# Word wrap

Utilities for controlling the way words wrap within an element. Generally used for handling overflow of long strings that are actually supposed to be a single unbroken word, like URLs or file paths.

- **Keywords**: overflow wrap, break word, long url

## Normal

Use `d-ww-normal` to break words only at allowed break points.

```html
<p class="d-ww-normal">...</p>
```

## Break word

Use `d-ww-break-word` to allow unbreakable words to be broken. Is a more conservative approach than [`d-wb-break-all`](./word-break.md#break-all) and will only break long words that do not fit the container.

```html
<p class="d-ww-break-word">...</p>
```

## Anywhere

Use `d-ww-anywhere` to break words at any point in the string (not just at allowed break points) to prevent long strings from overflowing their container.

```html
<p class="d-ww-anywhere">...</p>
```

## Initial

Use `d-ww-initial`to set this property to its default value.

```html
<p class="d-ww-initial">...</p>
```

## Inherit

Use `d-ww-inherit` to inherit this property from its parent element.

```html
<p class="d-ww-inherit">...</p>
```

## Classes

| Class | Output |
| --- | --- |
| `d-ww-anywhere` | overflow-wrap: anywhere !important |
| `d-ww-break-word` | overflow-wrap: break-word !important |
| `d-ww-inherit` | overflow-wrap: inherit !important |
| `d-ww-initial` | overflow-wrap: initial !important |
| `d-ww-normal` | overflow-wrap: normal !important |
