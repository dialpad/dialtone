# Divide Width

Utilities for controlling the divider width between an element's child items.

- **Keywords**: divider width,separator width,divider size

## Default Width

Use `d-divide-{y|x}` to create a 1px divider between an element's child items.

```html
<dt-stack class="d-divide-y d-divide-default d-w100p">
  <dt-stack direction="row" align="center" justify="center" class="d-p16">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p16">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-p16">3</dt-stack>
</dt-stack>

<dt-stack direction="row" class="d-divide-x d-divide-default d-w100p">
  <dt-stack direction="row" align="center" justify="center" class="d-w100p d-p16">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-w100p d-p16">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-w100p d-p16">3</dt-stack>
</dt-stack>
```

## Changing the Divider Width

Use `d-divide-{y|x}{n}` to change the divider width between an element's child items.

```html
<dt-stack direction="row" class="d-divide-x d-divide-x0 d-divide-default d-w100p d-ba">
  ...
</dt-stack>
<dt-stack direction="row" class="d-divide-x d-divide-x2 d-divide-default d-w100p d-ba d-baw2">
  ...
</dt-stack>
<dt-stack direction="row" class="d-divide-x d-divide-x4 d-divide-default d-w100p d-ba d-baw4">
  ...
</dt-stack>
```

## Reversing the Divider Direction

If an element's `flex-direction` is reversed, apply `d-divide-{y|x}-reverse` to reverse the divider placement between an element's child items.

```html
<dt-stack direction="row-reverse" class="d-divide-x d-divide-default d-divide-x-reverse d-w100p d-ba d-bc-default">
  <dt-stack direction="row" align="center" justify="center" class="d-w100p d-p16">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-w100p d-p16">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-w100p d-p16">3</dt-stack>
</dt-stack>
```

## Classes

| Class | Output |
| --- | --- |
| `d-divide-x` | --divide-x-reverse: 0; -webkit-border-end: calc(1px * var(--divide-x-reverse)) solid var(--dt-color-border-default) !important; border-inline-end: calc(1px * var(--divide-x-reverse)) solid var(--dt-color-border-default) !important; -webkit-border-start: calc(1px * (1 - var(--divide-x-reverse))) solid var(--dt-color-border-default) !important; border-inline-start: calc(1px * (1 - var(--divide-x-reverse))) solid var(--dt-color-border-default) !important |
| `d-divide-x0` | --divide-x-reverse: 0; -webkit-border-end: calc(0 * var(--divide-x-reverse)) solid var(--dt-color-border-default) !important; border-inline-end: calc(0 * var(--divide-x-reverse)) solid var(--dt-color-border-default) !important; -webkit-border-start: calc(0 * (1 - var(--divide-x-reverse))) solid var(--dt-color-border-default) !important; border-inline-start: calc(0 * (1 - var(--divide-x-reverse))) solid var(--dt-color-border-default) !important |
| `d-divide-x2` | --divide-x-reverse: 0; -webkit-border-end: calc(2px * var(--divide-x-reverse)) solid var(--dt-color-border-default) !important; border-inline-end: calc(2px * var(--divide-x-reverse)) solid var(--dt-color-border-default) !important; -webkit-border-start: calc(2px * (1 - var(--divide-x-reverse))) solid var(--dt-color-border-default) !important; border-inline-start: calc(2px * (1 - var(--divide-x-reverse))) solid var(--dt-color-border-default) !important |
| `d-divide-x4` | --divide-x-reverse: 0; -webkit-border-end: calc(4px * var(--divide-x-reverse)) solid var(--dt-color-border-default) !important; border-inline-end: calc(4px * var(--divide-x-reverse)) solid var(--dt-color-border-default) !important; -webkit-border-start: calc(4px * (1 - var(--divide-x-reverse))) solid var(--dt-color-border-default) !important; border-inline-start: calc(4px * (1 - var(--divide-x-reverse))) solid var(--dt-color-border-default) !important |
| `d-divide-y` | --divide-y-reverse: 0; -webkit-border-before: calc(1px * (1 - var(--divide-y-reverse))) solid var(--dt-color-border-default) !important; border-block-start: calc(1px * (1 - var(--divide-y-reverse))) solid var(--dt-color-border-default) !important; -webkit-border-after: calc(1px * var(--divide-y-reverse)) solid var(--dt-color-border-default) !important; border-block-end: calc(1px * var(--divide-y-reverse)) solid var(--dt-color-border-default) !important |
| `d-divide-y0` | --divide-y-reverse: 0; -webkit-border-before: calc(0 * (1 - var(--divide-y-reverse))) solid var(--dt-color-border-default) !important; border-block-start: calc(0 * (1 - var(--divide-y-reverse))) solid var(--dt-color-border-default) !important; -webkit-border-after: calc(0 * var(--divide-y-reverse)) solid var(--dt-color-border-default) !important; border-block-end: calc(0 * var(--divide-y-reverse)) solid var(--dt-color-border-default) !important |
| `d-divide-y2` | --divide-y-reverse: 0; -webkit-border-before: calc(2px * (1 - var(--divide-y-reverse))) solid var(--dt-color-border-default) !important; border-block-start: calc(2px * (1 - var(--divide-y-reverse))) solid var(--dt-color-border-default) !important; -webkit-border-after: calc(2px * var(--divide-y-reverse)) solid var(--dt-color-border-default) !important; border-block-end: calc(2px * var(--divide-y-reverse)) solid var(--dt-color-border-default) !important |
| `d-divide-y4` | --divide-y-reverse: 0; -webkit-border-before: calc(4px * (1 - var(--divide-y-reverse))) solid var(--dt-color-border-default) !important; border-block-start: calc(4px * (1 - var(--divide-y-reverse))) solid var(--dt-color-border-default) !important; -webkit-border-after: calc(4px * var(--divide-y-reverse)) solid var(--dt-color-border-default) !important; border-block-end: calc(4px * var(--divide-y-reverse)) solid var(--dt-color-border-default) !important |
