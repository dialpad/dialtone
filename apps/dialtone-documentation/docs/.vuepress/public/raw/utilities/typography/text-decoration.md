# Text Decoration

Utilities to change an element's text decoration styles.

- **Keywords**: underline, strikethrough, line through

## Underline

Use `d-td-underline` to underline text.

```html
<p class="d-td-underline">...</p>
```

## Dotted

Use `d-td-dotted` to apply a dotted underline style to the text.

```html
<p class="d-td-dotted">...</p>
```

## Line Through

Use `d-td-line-through` to apply a line through the text.

```html
<p class="d-td-line-through">...</p>
```

## No Decorations

Use `d-td-none` to remove text decorations.

```html
<p class="d-td-none">...</p>
```

## Hover

Use `h:d-td-{n}` to change an element's :hover state text decoration.

```html
<dt-button kind="unstyled" class="h:d-td-underline">
  The quick brown fox jumps over the lazy dog.
</dt-button>
```

## Focus

Use `f:d-td-{n}` to change an element's :focus and :focus-within state text decoration.

```html
<dt-button kind="unstyled" class="f:d-td-underline">
  The quick brown fox jumps over the lazy dog.
</dt-button>
```

## Focus Visible

Use `fv:d-td-{n}` to change an element's :focus-visible state text decoration [only when focused by keyboard].

```html
<dt-button kind="unstyled" class="fv:d-td-underline">
  The quick brown fox jumps over the lazy dog.
</dt-button>
```

## Classes

| Class | Output |
| --- | --- |
| `d-td-dotted` | text-decoration: underline dotted !important; text-underline-offset: calc(var(--dt-size-border-300) - var(--dt-size-border-100)) !important; text-decoration-thickness: var(--dt-size-border-100) !important |
| `d-td-line-through` | text-decoration: line-through !important; text-decoration-thickness: var(--dt-size-border-100) !important |
| `d-td-none` | text-decoration: none !important |
| `d-td-underline` | text-decoration: underline !important; text-underline-offset: calc(var(--dt-size-border-300) - var(--dt-size-border-100)) !important; text-decoration-thickness: var(--dt-size-border-50) !important |
| `d-td-unset` | text-decoration: unset !important |
