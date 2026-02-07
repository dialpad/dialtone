# Background Size

Utilities for controlling an element's background size.

- **Keywords**: bg size, cover, contain

## Usage

Use `d-bgs-{n}` to control the size of element's background image.

```html
<div class="d-bgr-none d-bgs-contain" style="background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-cover" style="background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-var" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-auto d-bgp-center" style="background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-unset" style="background-image: url(...);">...</div>
```

## Classes

| Class | Output |
| --- | --- |
| `d-bgs-auto` | background-size: auto !important |
| `d-bgs-contain` | background-size: contain !important |
| `d-bgs-cover` | background-size: cover !important |
| `d-bgs-unset` | background-size: unset !important |
| `d-bgs-var` | background-size: var(--bgg-size, 100% 100%) !important |
