# Background Attachment

Utilities for controlling the way an element's background image position is fixed within the viewport or scrolls with its containing block.

- **Keywords**: bg attachment,scroll,fixed,background scroll

## Scroll

This is the default behavior. Use `d-bga-scroll` to fix the <dt-link href="/assets/images/dp-sample-gradient.png" target="_blank" rel="noopener noreferrer"> background image </dt-link> to the element. It does not scroll with its content.

```html

<div class="... d-bga-scroll">...</div>
```

## Fixed

Use `d-bga-fixed` to fix the <dt-link href="/assets/images/dp-sample-gradient.png" target="_blank" rel="noopener noreferrer"> background image </dt-link> to the viewport. The background image does not scroll with the content.

```html

<div class="... d-bga-fixed">...</div>
```

## Local

Use `d-bga-local` to fix <dt-link href="/assets/images/dp-sample-gradient.png" target="_blank" rel="noopener noreferrer"> background image </dt-link> relative to the element's contents. If the element is scrollable, the
background scrolls with the element's contents, and background area and positioning are relative to the scrollable area
of the element rather than the viewable box.

```html

<div class="... d-bga-local">...</div>
```

## Classes

| Class | Output |
| --- | --- |
| `d-bga-fixed` | background-attachment: fixed !important |
| `d-bga-local` | background-attachment: local !important |
| `d-bga-scroll` | background-attachment: scroll !important |
| `d-bga-unset` | background-attachment: unset !important |
