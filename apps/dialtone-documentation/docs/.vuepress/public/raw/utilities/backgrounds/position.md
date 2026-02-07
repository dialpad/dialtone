# Background Position

Utilities for controlling the position of an element's background image.

- **Keywords**: bg position, center, top, bottom

## Usage

Use `d-bgp-{position}` to control where an element's background image is placed.

```html
<div class="d-bgr-none d-bgs-var d-bgp-tl" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-var d-bgp-t" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-var d-bgp-tr" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-var d-bgp-r" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-var d-bgp-bl" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-var d-bgp-b" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-var d-bgp-br" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-var d-bgp-l" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
```

## Classes

| Class | Output |
| --- | --- |
| `d-bgp-b` | background-position: bottom !important |
| `d-bgp-bl` | background-position: bottom start !important |
| `d-bgp-br` | background-position: bottom end !important |
| `d-bgp-center` | background-position: center !important |
| `d-bgp-l` | background-position: start !important |
| `d-bgp-r` | background-position: end !important |
| `d-bgp-t` | background-position: top !important |
| `d-bgp-tl` | background-position: top start !important |
| `d-bgp-tr` | background-position: top end !important |
| `d-bgp-unset` | background-position: unset !important |
