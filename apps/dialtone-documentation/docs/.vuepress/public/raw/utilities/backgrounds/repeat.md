# Background Repeat

Utilities for controlling if or how an element's background image repeats.

- **Keywords**: bg repeat, no repeat, tile

## Usage

Use `d-bgr-{n}` to how an element's background image repeats.

```html
<div class="d-bgr-repeat d-bgs-var d-bgp-tl" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-repeat-x d-bgs-var d-bgp-tl" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-repeat-y d-bgs-var d-bgp-tl" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-space d-bgs-var d-bgp-tl" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-none d-bgs-var d-bgp-tl" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
<div class="d-bgr-unset d-bgs-var d-bgp-tl" style="--bgg-size: 65% 65%; background-image: url(...);">...</div>
```

## Classes

| Class | Output |
| --- | --- |
| `d-bgr-none` | background-repeat: no-repeat !important |
| `d-bgr-repeat` | background-repeat: repeat !important |
| `d-bgr-repeat-x` | background-repeat: repeat-x !important |
| `d-bgr-repeat-y` | background-repeat: repeat-y !important |
| `d-bgr-space` | background-repeat: space !important |
| `d-bgr-unset` | background-repeat: unset !important |
