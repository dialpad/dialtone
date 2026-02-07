# Border Colors

Utilities for controlling an element's border color.

- **Keywords**: border colour

  Before using border color utilities, first consider [semantic border colors](../../foundations/colors/palette.md#borders).

## Usage

Use `d-bc-{color}` to set an element's border color.

```html
<div class="d-ba d-bc-{color}">...</div>
```

## Hover

Use `h:d-bc-{color}` to change an element's border color spot on `:hover`.

```html
<dt-button kind="unstyled" class="d-p16 d-ba d-baw2 h:d-bc-moderate">
  Hover over me
</dt-button>
<dt-button kind="unstyled" class="d-p16 d-ba d-baw2 h:d-bc-critical">
  Hover over me
</dt-button>
```

## Focus

Use `f:d-bc-{color}` to change an element's border color when in `:focus` or `:focus-within` states.

```html
<dt-button kind="unstyled" class="d-p16 d-ba d-baw2 f:d-bc-moderate">
  Focus me
</dt-button>
<dt-button kind="unstyled" class="d-p16 d-ba d-baw2 f:d-bc-critical">
  Focus me
</dt-button>
```

## Focus Visible

Use `fv:d-bc-{color}` to change an element's border color when in `:focus-visible` state [only when focused by keyboard]
.

```html
<dt-button kind="unstyled" class="d-p16 d-ba d-baw2 fv:d-bc-moderate">
  Keyboard focus me
</dt-button>
<dt-button kind="unstyled" class="d-p16 d-ba d-baw2 fv:d-bc-critical">
  Keyboard focus me
</dt-button>
```

## Changing Opacities

Use `d-bco{n}` to change the border color opacity value.

```html
<div class="d-ba d-bc-critical d-bco100">100%</div>
<div class="d-ba d-bc-critical d-bco99">99%</div>
<div class="d-ba d-bc-critical d-bco95">95%</div>
<div class="d-ba d-bc-critical d-bco90">90%</div>
<div class="d-ba d-bc-critical d-bco75">75%</div>
<div class="d-ba d-bc-critical d-bco50">50%</div>
<div class="d-ba d-bc-critical d-bco25">25%</div>
<div class="d-ba d-bc-critical d-bco10">10%</div>
<div class="d-ba d-bc-critical d-bco0">0%</div>
```

You can also change the border color opacity value on `:hover`
, `:focus`, `:focus-visible` by using the respective `h:d-bco{n}`, `f:d-bco{n}`, `fv:d-bco{n}` prefixes.

```html
<dt-button kind="unstyled" class="d-p16 d-ba d-baw2 d-bc-critical h:d-bco50">
  Hover me to see 50%
</dt-button>
<dt-button kind="unstyled" class="d-p16 d-ba d-baw2 d-bc-critical f:d-bco50">
  Focus me with mouse to see 50%
</dt-button>
<dt-button kind="unstyled" class="d-p16 d-ba d-baw2 d-bc-critical fv:d-bco50">
  Focus me via keyboard to see 50%
</dt-button>
```

## Classes

| Class | Output |
| --- | --- |
| `d-bc-accent` | --bco: var(--dt-color-border-accent-a); border-color: oklch(from var(--dt-color-border-accent) l c h / var(--bco)) !important |
| `d-bc-ai` | border-image-source: var(--dt-color-border-ai) !important; border-image-slice: 1 !important |
| `d-bc-berry-100` | --bco: var(--dt-color-berry-100-a); border-color: oklch(from var(--dt-color-berry-100) l c h / var(--bco)) !important |
| `d-bc-berry-1000` | --bco: var(--dt-color-berry-1000-a); border-color: oklch(from var(--dt-color-berry-1000) l c h / var(--bco)) !important |
| `d-bc-berry-200` | --bco: var(--dt-color-berry-200-a); border-color: oklch(from var(--dt-color-berry-200) l c h / var(--bco)) !important |
| `d-bc-berry-300` | --bco: var(--dt-color-berry-300-a); border-color: oklch(from var(--dt-color-berry-300) l c h / var(--bco)) !important |
| `d-bc-berry-400` | --bco: var(--dt-color-berry-400-a); border-color: oklch(from var(--dt-color-berry-400) l c h / var(--bco)) !important |
| `d-bc-berry-50` | --bco: var(--dt-color-berry-50-a); border-color: oklch(from var(--dt-color-berry-50) l c h / var(--bco)) !important |
| `d-bc-berry-500` | --bco: var(--dt-color-berry-500-a); border-color: oklch(from var(--dt-color-berry-500) l c h / var(--bco)) !important |
| `d-bc-berry-600` | --bco: var(--dt-color-berry-600-a); border-color: oklch(from var(--dt-color-berry-600) l c h / var(--bco)) !important |
| `d-bc-berry-700` | --bco: var(--dt-color-berry-700-a); border-color: oklch(from var(--dt-color-berry-700) l c h / var(--bco)) !important |
| `d-bc-berry-800` | --bco: var(--dt-color-berry-800-a); border-color: oklch(from var(--dt-color-berry-800) l c h / var(--bco)) !important |
| `d-bc-berry-900` | --bco: var(--dt-color-berry-900-a); border-color: oklch(from var(--dt-color-berry-900) l c h / var(--bco)) !important |
| `d-bc-berry-950` | --bco: var(--dt-color-berry-950-a); border-color: oklch(from var(--dt-color-berry-950) l c h / var(--bco)) !important |
| `d-bc-black-100` | --bco: var(--dt-color-black-100-a); border-color: oklch(from var(--dt-color-black-100) l c h / var(--bco)) !important |
| `d-bc-black-1000` | --bco: var(--dt-color-black-1000-a); border-color: oklch(from var(--dt-color-black-1000) l c h / var(--bco)) !important |
| `d-bc-black-200` | --bco: var(--dt-color-black-200-a); border-color: oklch(from var(--dt-color-black-200) l c h / var(--bco)) !important |
| `d-bc-black-300` | --bco: var(--dt-color-black-300-a); border-color: oklch(from var(--dt-color-black-300) l c h / var(--bco)) !important |
| `d-bc-black-400` | --bco: var(--dt-color-black-400-a); border-color: oklch(from var(--dt-color-black-400) l c h / var(--bco)) !important |
| `d-bc-black-50` | --bco: var(--dt-color-black-50-a); border-color: oklch(from var(--dt-color-black-50) l c h / var(--bco)) !important |
| `d-bc-black-500` | --bco: var(--dt-color-black-500-a); border-color: oklch(from var(--dt-color-black-500) l c h / var(--bco)) !important |
| `d-bc-black-600` | --bco: var(--dt-color-black-600-a); border-color: oklch(from var(--dt-color-black-600) l c h / var(--bco)) !important |
| `d-bc-black-700` | --bco: var(--dt-color-black-700-a); border-color: oklch(from var(--dt-color-black-700) l c h / var(--bco)) !important |
| `d-bc-black-800` | --bco: var(--dt-color-black-800-a); border-color: oklch(from var(--dt-color-black-800) l c h / var(--bco)) !important |
| `d-bc-black-900` | --bco: var(--dt-color-black-900-a); border-color: oklch(from var(--dt-color-black-900) l c h / var(--bco)) !important |
| `d-bc-black-950` | --bco: var(--dt-color-black-950-a); border-color: oklch(from var(--dt-color-black-950) l c h / var(--bco)) !important |
| `d-bc-blue-100` | --bco: var(--dt-color-blue-100-a); border-color: oklch(from var(--dt-color-blue-100) l c h / var(--bco)) !important |
| `d-bc-blue-1000` | --bco: var(--dt-color-blue-1000-a); border-color: oklch(from var(--dt-color-blue-1000) l c h / var(--bco)) !important |
| `d-bc-blue-200` | --bco: var(--dt-color-blue-200-a); border-color: oklch(from var(--dt-color-blue-200) l c h / var(--bco)) !important |
| `d-bc-blue-300` | --bco: var(--dt-color-blue-300-a); border-color: oklch(from var(--dt-color-blue-300) l c h / var(--bco)) !important |
| `d-bc-blue-400` | --bco: var(--dt-color-blue-400-a); border-color: oklch(from var(--dt-color-blue-400) l c h / var(--bco)) !important |
| `d-bc-blue-425` | --bco: var(--dt-color-blue-425-a); border-color: oklch(from var(--dt-color-blue-425) l c h / var(--bco)) !important |
| `d-bc-blue-450` | --bco: var(--dt-color-blue-450-a); border-color: oklch(from var(--dt-color-blue-450) l c h / var(--bco)) !important |
| `d-bc-blue-475` | --bco: var(--dt-color-blue-475-a); border-color: oklch(from var(--dt-color-blue-475) l c h / var(--bco)) !important |
| `d-bc-blue-50` | --bco: var(--dt-color-blue-50-a); border-color: oklch(from var(--dt-color-blue-50) l c h / var(--bco)) !important |
| `d-bc-blue-500` | --bco: var(--dt-color-blue-500-a); border-color: oklch(from var(--dt-color-blue-500) l c h / var(--bco)) !important |
| `d-bc-blue-600` | --bco: var(--dt-color-blue-600-a); border-color: oklch(from var(--dt-color-blue-600) l c h / var(--bco)) !important |
| `d-bc-blue-900` | --bco: var(--dt-color-blue-900-a); border-color: oklch(from var(--dt-color-blue-900) l c h / var(--bco)) !important |
| `d-bc-bold` | --bco: var(--dt-color-border-bold-a); border-color: oklch(from var(--dt-color-border-bold) l c h / var(--bco)) !important |
| `d-bc-bold-inverted` | --bco: var(--dt-color-border-bold-inverted-a); border-color: oklch(from var(--dt-color-border-bold-inverted) l c h / var(--bco)) !important |
| `d-bc-brand` | --bco: var(--dt-color-border-brand-a); border-color: oklch(from var(--dt-color-border-brand) l c h / var(--bco)) !important |
| `d-bc-brand-inverted` | --bco: var(--dt-color-border-brand-inverted-a); border-color: oklch(from var(--dt-color-border-brand-inverted) l c h / var(--bco)) !important |
| `d-bc-brand-strong` | --bco: var(--dt-color-border-brand-strong-a); border-color: oklch(from var(--dt-color-border-brand-strong) l c h / var(--bco)) !important |
| `d-bc-brand-strong-inverted` | --bco: var(--dt-color-border-brand-strong-inverted-a); border-color: oklch(from var(--dt-color-border-brand-strong-inverted) l c h / var(--bco)) !important |
| `d-bc-brand-subtle` | --bco: var(--dt-color-border-brand-subtle-a); border-color: oklch(from var(--dt-color-border-brand-subtle) l c h / var(--bco)) !important |
| `d-bc-brand-subtle-inverted` | --bco: var(--dt-color-border-brand-subtle-inverted-a); border-color: oklch(from var(--dt-color-border-brand-subtle-inverted) l c h / var(--bco)) !important |
| `d-bc-chart-accent` | --bco: var(--dt-color-chart-accent-a); border-color: oklch(from var(--dt-color-chart-accent) l c h / var(--bco)) !important |
| `d-bc-chart-accent-hover` | --bco: var(--dt-color-chart-accent-hover-a); border-color: oklch(from var(--dt-color-chart-accent-hover) l c h / var(--bco)) !important |
| `d-bc-chart-accent-selected` | --bco: var(--dt-color-chart-accent-selected-a); border-color: oklch(from var(--dt-color-chart-accent-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-01` | --bco: var(--dt-color-chart-categorical-01-a); border-color: oklch(from var(--dt-color-chart-categorical-01) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-01-hover` | --bco: var(--dt-color-chart-categorical-01-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-01-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-01-selected` | --bco: var(--dt-color-chart-categorical-01-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-01-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-02` | --bco: var(--dt-color-chart-categorical-02-a); border-color: oklch(from var(--dt-color-chart-categorical-02) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-02-hover` | --bco: var(--dt-color-chart-categorical-02-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-02-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-02-selected` | --bco: var(--dt-color-chart-categorical-02-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-02-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-03` | --bco: var(--dt-color-chart-categorical-03-a); border-color: oklch(from var(--dt-color-chart-categorical-03) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-03-hover` | --bco: var(--dt-color-chart-categorical-03-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-03-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-03-selected` | --bco: var(--dt-color-chart-categorical-03-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-03-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-04` | --bco: var(--dt-color-chart-categorical-04-a); border-color: oklch(from var(--dt-color-chart-categorical-04) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-04-hover` | --bco: var(--dt-color-chart-categorical-04-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-04-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-04-selected` | --bco: var(--dt-color-chart-categorical-04-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-04-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-05` | --bco: var(--dt-color-chart-categorical-05-a); border-color: oklch(from var(--dt-color-chart-categorical-05) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-05-hover` | --bco: var(--dt-color-chart-categorical-05-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-05-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-05-selected` | --bco: var(--dt-color-chart-categorical-05-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-05-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-06` | --bco: var(--dt-color-chart-categorical-06-a); border-color: oklch(from var(--dt-color-chart-categorical-06) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-06-hover` | --bco: var(--dt-color-chart-categorical-06-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-06-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-06-selected` | --bco: var(--dt-color-chart-categorical-06-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-06-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-07` | --bco: var(--dt-color-chart-categorical-07-a); border-color: oklch(from var(--dt-color-chart-categorical-07) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-07-hover` | --bco: var(--dt-color-chart-categorical-07-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-07-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-07-selected` | --bco: var(--dt-color-chart-categorical-07-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-07-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-08` | --bco: var(--dt-color-chart-categorical-08-a); border-color: oklch(from var(--dt-color-chart-categorical-08) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-08-hover` | --bco: var(--dt-color-chart-categorical-08-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-08-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-08-selected` | --bco: var(--dt-color-chart-categorical-08-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-08-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-09` | --bco: var(--dt-color-chart-categorical-09-a); border-color: oklch(from var(--dt-color-chart-categorical-09) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-09-hover` | --bco: var(--dt-color-chart-categorical-09-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-09-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-09-selected` | --bco: var(--dt-color-chart-categorical-09-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-09-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-10` | --bco: var(--dt-color-chart-categorical-10-a); border-color: oklch(from var(--dt-color-chart-categorical-10) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-10-hover` | --bco: var(--dt-color-chart-categorical-10-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-10-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-10-selected` | --bco: var(--dt-color-chart-categorical-10-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-10-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-11` | --bco: var(--dt-color-chart-categorical-11-a); border-color: oklch(from var(--dt-color-chart-categorical-11) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-11-hover` | --bco: var(--dt-color-chart-categorical-11-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-11-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-11-selected` | --bco: var(--dt-color-chart-categorical-11-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-11-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-12` | --bco: var(--dt-color-chart-categorical-12-a); border-color: oklch(from var(--dt-color-chart-categorical-12) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-12-hover` | --bco: var(--dt-color-chart-categorical-12-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-12-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-12-selected` | --bco: var(--dt-color-chart-categorical-12-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-12-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-13` | --bco: var(--dt-color-chart-categorical-13-a); border-color: oklch(from var(--dt-color-chart-categorical-13) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-13-hover` | --bco: var(--dt-color-chart-categorical-13-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-13-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-13-selected` | --bco: var(--dt-color-chart-categorical-13-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-13-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-14` | --bco: var(--dt-color-chart-categorical-14-a); border-color: oklch(from var(--dt-color-chart-categorical-14) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-14-hover` | --bco: var(--dt-color-chart-categorical-14-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-14-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-14-selected` | --bco: var(--dt-color-chart-categorical-14-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-14-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-15` | --bco: var(--dt-color-chart-categorical-15-a); border-color: oklch(from var(--dt-color-chart-categorical-15) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-15-hover` | --bco: var(--dt-color-chart-categorical-15-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-15-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-15-selected` | --bco: var(--dt-color-chart-categorical-15-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-15-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-16` | --bco: var(--dt-color-chart-categorical-16-a); border-color: oklch(from var(--dt-color-chart-categorical-16) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-16-hover` | --bco: var(--dt-color-chart-categorical-16-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-16-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-16-selected` | --bco: var(--dt-color-chart-categorical-16-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-16-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-17` | --bco: var(--dt-color-chart-categorical-17-a); border-color: oklch(from var(--dt-color-chart-categorical-17) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-17-hover` | --bco: var(--dt-color-chart-categorical-17-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-17-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-17-selected` | --bco: var(--dt-color-chart-categorical-17-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-17-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-18` | --bco: var(--dt-color-chart-categorical-18-a); border-color: oklch(from var(--dt-color-chart-categorical-18) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-18-hover` | --bco: var(--dt-color-chart-categorical-18-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-18-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-18-selected` | --bco: var(--dt-color-chart-categorical-18-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-18-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-19` | --bco: var(--dt-color-chart-categorical-19-a); border-color: oklch(from var(--dt-color-chart-categorical-19) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-19-hover` | --bco: var(--dt-color-chart-categorical-19-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-19-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-19-selected` | --bco: var(--dt-color-chart-categorical-19-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-19-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-20` | --bco: var(--dt-color-chart-categorical-20-a); border-color: oklch(from var(--dt-color-chart-categorical-20) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-20-hover` | --bco: var(--dt-color-chart-categorical-20-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-20-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-20-selected` | --bco: var(--dt-color-chart-categorical-20-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-20-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-21` | --bco: var(--dt-color-chart-categorical-21-a); border-color: oklch(from var(--dt-color-chart-categorical-21) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-21-hover` | --bco: var(--dt-color-chart-categorical-21-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-21-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-21-selected` | --bco: var(--dt-color-chart-categorical-21-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-21-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-22` | --bco: var(--dt-color-chart-categorical-22-a); border-color: oklch(from var(--dt-color-chart-categorical-22) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-22-hover` | --bco: var(--dt-color-chart-categorical-22-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-22-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-22-selected` | --bco: var(--dt-color-chart-categorical-22-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-22-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-23` | --bco: var(--dt-color-chart-categorical-23-a); border-color: oklch(from var(--dt-color-chart-categorical-23) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-23-hover` | --bco: var(--dt-color-chart-categorical-23-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-23-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-23-selected` | --bco: var(--dt-color-chart-categorical-23-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-23-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-24` | --bco: var(--dt-color-chart-categorical-24-a); border-color: oklch(from var(--dt-color-chart-categorical-24) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-24-hover` | --bco: var(--dt-color-chart-categorical-24-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-24-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-24-selected` | --bco: var(--dt-color-chart-categorical-24-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-24-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-25` | --bco: var(--dt-color-chart-categorical-25-a); border-color: oklch(from var(--dt-color-chart-categorical-25) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-25-hover` | --bco: var(--dt-color-chart-categorical-25-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-25-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-25-selected` | --bco: var(--dt-color-chart-categorical-25-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-25-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-26` | --bco: var(--dt-color-chart-categorical-26-a); border-color: oklch(from var(--dt-color-chart-categorical-26) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-26-hover` | --bco: var(--dt-color-chart-categorical-26-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-26-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-26-selected` | --bco: var(--dt-color-chart-categorical-26-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-26-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-27` | --bco: var(--dt-color-chart-categorical-27-a); border-color: oklch(from var(--dt-color-chart-categorical-27) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-27-hover` | --bco: var(--dt-color-chart-categorical-27-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-27-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-27-selected` | --bco: var(--dt-color-chart-categorical-27-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-27-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-28` | --bco: var(--dt-color-chart-categorical-28-a); border-color: oklch(from var(--dt-color-chart-categorical-28) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-28-hover` | --bco: var(--dt-color-chart-categorical-28-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-28-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-28-selected` | --bco: var(--dt-color-chart-categorical-28-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-28-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-29` | --bco: var(--dt-color-chart-categorical-29-a); border-color: oklch(from var(--dt-color-chart-categorical-29) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-29-hover` | --bco: var(--dt-color-chart-categorical-29-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-29-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-29-selected` | --bco: var(--dt-color-chart-categorical-29-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-29-selected) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-30` | --bco: var(--dt-color-chart-categorical-30-a); border-color: oklch(from var(--dt-color-chart-categorical-30) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-30-hover` | --bco: var(--dt-color-chart-categorical-30-hover-a); border-color: oklch(from var(--dt-color-chart-categorical-30-hover) l c h / var(--bco)) !important |
| `d-bc-chart-categorical-30-selected` | --bco: var(--dt-color-chart-categorical-30-selected-a); border-color: oklch(from var(--dt-color-chart-categorical-30-selected) l c h / var(--bco)) !important |
| `d-bc-chart-critical` | --bco: var(--dt-color-chart-critical-a); border-color: oklch(from var(--dt-color-chart-critical) l c h / var(--bco)) !important |
| `d-bc-chart-critical-hover` | --bco: var(--dt-color-chart-critical-hover-a); border-color: oklch(from var(--dt-color-chart-critical-hover) l c h / var(--bco)) !important |
| `d-bc-chart-critical-selected` | --bco: var(--dt-color-chart-critical-selected-a); border-color: oklch(from var(--dt-color-chart-critical-selected) l c h / var(--bco)) !important |
| `d-bc-chart-info` | --bco: var(--dt-color-chart-info-a); border-color: oklch(from var(--dt-color-chart-info) l c h / var(--bco)) !important |
| `d-bc-chart-info-hover` | --bco: var(--dt-color-chart-info-hover-a); border-color: oklch(from var(--dt-color-chart-info-hover) l c h / var(--bco)) !important |
| `d-bc-chart-info-selected` | --bco: var(--dt-color-chart-info-selected-a); border-color: oklch(from var(--dt-color-chart-info-selected) l c h / var(--bco)) !important |
| `d-bc-chart-neutral` | --bco: var(--dt-color-chart-neutral-a); border-color: oklch(from var(--dt-color-chart-neutral) l c h / var(--bco)) !important |
| `d-bc-chart-neutral-hover` | --bco: var(--dt-color-chart-neutral-hover-a); border-color: oklch(from var(--dt-color-chart-neutral-hover) l c h / var(--bco)) !important |
| `d-bc-chart-neutral-selected` | --bco: var(--dt-color-chart-neutral-selected-a); border-color: oklch(from var(--dt-color-chart-neutral-selected) l c h / var(--bco)) !important |
| `d-bc-chart-positive` | --bco: var(--dt-color-chart-positive-a); border-color: oklch(from var(--dt-color-chart-positive) l c h / var(--bco)) !important |
| `d-bc-chart-positive-hover` | --bco: var(--dt-color-chart-positive-hover-a); border-color: oklch(from var(--dt-color-chart-positive-hover) l c h / var(--bco)) !important |
| `d-bc-chart-positive-selected` | --bco: var(--dt-color-chart-positive-selected-a); border-color: oklch(from var(--dt-color-chart-positive-selected) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-01` | --bco: var(--dt-color-chart-sequential-01-a); border-color: oklch(from var(--dt-color-chart-sequential-01) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-01-hover` | --bco: var(--dt-color-chart-sequential-01-hover-a); border-color: oklch(from var(--dt-color-chart-sequential-01-hover) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-01-selected` | --bco: var(--dt-color-chart-sequential-01-selected-a); border-color: oklch(from var(--dt-color-chart-sequential-01-selected) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-02` | --bco: var(--dt-color-chart-sequential-02-a); border-color: oklch(from var(--dt-color-chart-sequential-02) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-02-hover` | --bco: var(--dt-color-chart-sequential-02-hover-a); border-color: oklch(from var(--dt-color-chart-sequential-02-hover) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-02-selected` | --bco: var(--dt-color-chart-sequential-02-selected-a); border-color: oklch(from var(--dt-color-chart-sequential-02-selected) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-03` | --bco: var(--dt-color-chart-sequential-03-a); border-color: oklch(from var(--dt-color-chart-sequential-03) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-03-hover` | --bco: var(--dt-color-chart-sequential-03-hover-a); border-color: oklch(from var(--dt-color-chart-sequential-03-hover) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-03-selected` | --bco: var(--dt-color-chart-sequential-03-selected-a); border-color: oklch(from var(--dt-color-chart-sequential-03-selected) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-04` | --bco: var(--dt-color-chart-sequential-04-a); border-color: oklch(from var(--dt-color-chart-sequential-04) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-04-hover` | --bco: var(--dt-color-chart-sequential-04-hover-a); border-color: oklch(from var(--dt-color-chart-sequential-04-hover) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-04-selected` | --bco: var(--dt-color-chart-sequential-04-selected-a); border-color: oklch(from var(--dt-color-chart-sequential-04-selected) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-05` | --bco: var(--dt-color-chart-sequential-05-a); border-color: oklch(from var(--dt-color-chart-sequential-05) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-05-hover` | --bco: var(--dt-color-chart-sequential-05-hover-a); border-color: oklch(from var(--dt-color-chart-sequential-05-hover) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-05-selected` | --bco: var(--dt-color-chart-sequential-05-selected-a); border-color: oklch(from var(--dt-color-chart-sequential-05-selected) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-06` | --bco: var(--dt-color-chart-sequential-06-a); border-color: oklch(from var(--dt-color-chart-sequential-06) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-06-hover` | --bco: var(--dt-color-chart-sequential-06-hover-a); border-color: oklch(from var(--dt-color-chart-sequential-06-hover) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-06-selected` | --bco: var(--dt-color-chart-sequential-06-selected-a); border-color: oklch(from var(--dt-color-chart-sequential-06-selected) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-07` | --bco: var(--dt-color-chart-sequential-07-a); border-color: oklch(from var(--dt-color-chart-sequential-07) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-07-hover` | --bco: var(--dt-color-chart-sequential-07-hover-a); border-color: oklch(from var(--dt-color-chart-sequential-07-hover) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-07-selected` | --bco: var(--dt-color-chart-sequential-07-selected-a); border-color: oklch(from var(--dt-color-chart-sequential-07-selected) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-08` | --bco: var(--dt-color-chart-sequential-08-a); border-color: oklch(from var(--dt-color-chart-sequential-08) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-08-hover` | --bco: var(--dt-color-chart-sequential-08-hover-a); border-color: oklch(from var(--dt-color-chart-sequential-08-hover) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-08-selected` | --bco: var(--dt-color-chart-sequential-08-selected-a); border-color: oklch(from var(--dt-color-chart-sequential-08-selected) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-09` | --bco: var(--dt-color-chart-sequential-09-a); border-color: oklch(from var(--dt-color-chart-sequential-09) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-09-hover` | --bco: var(--dt-color-chart-sequential-09-hover-a); border-color: oklch(from var(--dt-color-chart-sequential-09-hover) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-09-selected` | --bco: var(--dt-color-chart-sequential-09-selected-a); border-color: oklch(from var(--dt-color-chart-sequential-09-selected) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-10` | --bco: var(--dt-color-chart-sequential-10-a); border-color: oklch(from var(--dt-color-chart-sequential-10) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-10-hover` | --bco: var(--dt-color-chart-sequential-10-hover-a); border-color: oklch(from var(--dt-color-chart-sequential-10-hover) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-10-selected` | --bco: var(--dt-color-chart-sequential-10-selected-a); border-color: oklch(from var(--dt-color-chart-sequential-10-selected) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-00-end` | --bco: var(--dt-color-chart-sequential-range-00-end-a); border-color: oklch(from var(--dt-color-chart-sequential-range-00-end) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-00-start` | --bco: var(--dt-color-chart-sequential-range-00-start-a); border-color: oklch(from var(--dt-color-chart-sequential-range-00-start) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-01-end` | --bco: var(--dt-color-chart-sequential-range-01-end-a); border-color: oklch(from var(--dt-color-chart-sequential-range-01-end) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-01-start` | --bco: var(--dt-color-chart-sequential-range-01-start-a); border-color: oklch(from var(--dt-color-chart-sequential-range-01-start) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-02-end` | --bco: var(--dt-color-chart-sequential-range-02-end-a); border-color: oklch(from var(--dt-color-chart-sequential-range-02-end) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-02-start` | --bco: var(--dt-color-chart-sequential-range-02-start-a); border-color: oklch(from var(--dt-color-chart-sequential-range-02-start) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-03-end` | --bco: var(--dt-color-chart-sequential-range-03-end-a); border-color: oklch(from var(--dt-color-chart-sequential-range-03-end) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-03-start` | --bco: var(--dt-color-chart-sequential-range-03-start-a); border-color: oklch(from var(--dt-color-chart-sequential-range-03-start) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-04-end` | --bco: var(--dt-color-chart-sequential-range-04-end-a); border-color: oklch(from var(--dt-color-chart-sequential-range-04-end) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-04-start` | --bco: var(--dt-color-chart-sequential-range-04-start-a); border-color: oklch(from var(--dt-color-chart-sequential-range-04-start) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-05-end` | --bco: var(--dt-color-chart-sequential-range-05-end-a); border-color: oklch(from var(--dt-color-chart-sequential-range-05-end) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-05-start` | --bco: var(--dt-color-chart-sequential-range-05-start-a); border-color: oklch(from var(--dt-color-chart-sequential-range-05-start) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-06-end` | --bco: var(--dt-color-chart-sequential-range-06-end-a); border-color: oklch(from var(--dt-color-chart-sequential-range-06-end) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-06-start` | --bco: var(--dt-color-chart-sequential-range-06-start-a); border-color: oklch(from var(--dt-color-chart-sequential-range-06-start) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-07-end` | --bco: var(--dt-color-chart-sequential-range-07-end-a); border-color: oklch(from var(--dt-color-chart-sequential-range-07-end) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-07-start` | --bco: var(--dt-color-chart-sequential-range-07-start-a); border-color: oklch(from var(--dt-color-chart-sequential-range-07-start) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-08-end` | --bco: var(--dt-color-chart-sequential-range-08-end-a); border-color: oklch(from var(--dt-color-chart-sequential-range-08-end) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-08-start` | --bco: var(--dt-color-chart-sequential-range-08-start-a); border-color: oklch(from var(--dt-color-chart-sequential-range-08-start) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-09-end` | --bco: var(--dt-color-chart-sequential-range-09-end-a); border-color: oklch(from var(--dt-color-chart-sequential-range-09-end) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-09-start` | --bco: var(--dt-color-chart-sequential-range-09-start-a); border-color: oklch(from var(--dt-color-chart-sequential-range-09-start) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-10-end` | --bco: var(--dt-color-chart-sequential-range-10-end-a); border-color: oklch(from var(--dt-color-chart-sequential-range-10-end) l c h / var(--bco)) !important |
| `d-bc-chart-sequential-range-10-start` | --bco: var(--dt-color-chart-sequential-range-10-start-a); border-color: oklch(from var(--dt-color-chart-sequential-range-10-start) l c h / var(--bco)) !important |
| `d-bc-chart-warning` | --bco: var(--dt-color-chart-warning-a); border-color: oklch(from var(--dt-color-chart-warning) l c h / var(--bco)) !important |
| `d-bc-chart-warning-hover` | --bco: var(--dt-color-chart-warning-hover-a); border-color: oklch(from var(--dt-color-chart-warning-hover) l c h / var(--bco)) !important |
| `d-bc-chart-warning-selected` | --bco: var(--dt-color-chart-warning-selected-a); border-color: oklch(from var(--dt-color-chart-warning-selected) l c h / var(--bco)) !important |
| `d-bc-coral-100` | --bco: var(--dt-color-coral-100-a); border-color: oklch(from var(--dt-color-coral-100) l c h / var(--bco)) !important |
| `d-bc-coral-1000` | --bco: var(--dt-color-coral-1000-a); border-color: oklch(from var(--dt-color-coral-1000) l c h / var(--bco)) !important |
| `d-bc-coral-200` | --bco: var(--dt-color-coral-200-a); border-color: oklch(from var(--dt-color-coral-200) l c h / var(--bco)) !important |
| `d-bc-coral-300` | --bco: var(--dt-color-coral-300-a); border-color: oklch(from var(--dt-color-coral-300) l c h / var(--bco)) !important |
| `d-bc-coral-400` | --bco: var(--dt-color-coral-400-a); border-color: oklch(from var(--dt-color-coral-400) l c h / var(--bco)) !important |
| `d-bc-coral-50` | --bco: var(--dt-color-coral-50-a); border-color: oklch(from var(--dt-color-coral-50) l c h / var(--bco)) !important |
| `d-bc-coral-500` | --bco: var(--dt-color-coral-500-a); border-color: oklch(from var(--dt-color-coral-500) l c h / var(--bco)) !important |
| `d-bc-coral-600` | --bco: var(--dt-color-coral-600-a); border-color: oklch(from var(--dt-color-coral-600) l c h / var(--bco)) !important |
| `d-bc-coral-700` | --bco: var(--dt-color-coral-700-a); border-color: oklch(from var(--dt-color-coral-700) l c h / var(--bco)) !important |
| `d-bc-coral-800` | --bco: var(--dt-color-coral-800-a); border-color: oklch(from var(--dt-color-coral-800) l c h / var(--bco)) !important |
| `d-bc-coral-900` | --bco: var(--dt-color-coral-900-a); border-color: oklch(from var(--dt-color-coral-900) l c h / var(--bco)) !important |
| `d-bc-coral-950` | --bco: var(--dt-color-coral-950-a); border-color: oklch(from var(--dt-color-coral-950) l c h / var(--bco)) !important |
| `d-bc-critical` | --bco: var(--dt-color-border-critical-a); border-color: oklch(from var(--dt-color-border-critical) l c h / var(--bco)) !important |
| `d-bc-critical-inverted` | --bco: var(--dt-color-border-critical-inverted-a); border-color: oklch(from var(--dt-color-border-critical-inverted) l c h / var(--bco)) !important |
| `d-bc-critical-strong` | --bco: var(--dt-color-border-critical-strong-a); border-color: oklch(from var(--dt-color-border-critical-strong) l c h / var(--bco)) !important |
| `d-bc-critical-strong-inverted` | --bco: var(--dt-color-border-critical-strong-inverted-a); border-color: oklch(from var(--dt-color-border-critical-strong-inverted) l c h / var(--bco)) !important |
| `d-bc-critical-subtle` | --bco: var(--dt-color-border-critical-subtle-a); border-color: oklch(from var(--dt-color-border-critical-subtle) l c h / var(--bco)) !important |
| `d-bc-critical-subtle-inverted` | --bco: var(--dt-color-border-critical-subtle-inverted-a); border-color: oklch(from var(--dt-color-border-critical-subtle-inverted) l c h / var(--bco)) !important |
| `d-bc-current` | border-color: currentColor !important |
| `d-bc-default` | --bco: var(--dt-color-border-default-a); border-color: oklch(from var(--dt-color-border-default) l c h / var(--bco)) !important |
| `d-bc-default-inverted` | --bco: var(--dt-color-border-default-inverted-a); border-color: oklch(from var(--dt-color-border-default-inverted) l c h / var(--bco)) !important |
| `d-bc-focus` | --bco: var(--dt-color-border-focus-a); border-color: oklch(from var(--dt-color-border-focus) l c h / var(--bco)) !important |
| `d-bc-gold-100` | --bco: var(--dt-color-gold-100-a); border-color: oklch(from var(--dt-color-gold-100) l c h / var(--bco)) !important |
| `d-bc-gold-1000` | --bco: var(--dt-color-gold-1000-a); border-color: oklch(from var(--dt-color-gold-1000) l c h / var(--bco)) !important |
| `d-bc-gold-200` | --bco: var(--dt-color-gold-200-a); border-color: oklch(from var(--dt-color-gold-200) l c h / var(--bco)) !important |
| `d-bc-gold-300` | --bco: var(--dt-color-gold-300-a); border-color: oklch(from var(--dt-color-gold-300) l c h / var(--bco)) !important |
| `d-bc-gold-350` | --bco: var(--dt-color-gold-350-a); border-color: oklch(from var(--dt-color-gold-350) l c h / var(--bco)) !important |
| `d-bc-gold-400` | --bco: var(--dt-color-gold-400-a); border-color: oklch(from var(--dt-color-gold-400) l c h / var(--bco)) !important |
| `d-bc-gold-450` | --bco: var(--dt-color-gold-450-a); border-color: oklch(from var(--dt-color-gold-450) l c h / var(--bco)) !important |
| `d-bc-gold-50` | --bco: var(--dt-color-gold-50-a); border-color: oklch(from var(--dt-color-gold-50) l c h / var(--bco)) !important |
| `d-bc-gold-500` | --bco: var(--dt-color-gold-500-a); border-color: oklch(from var(--dt-color-gold-500) l c h / var(--bco)) !important |
| `d-bc-gold-600` | --bco: var(--dt-color-gold-600-a); border-color: oklch(from var(--dt-color-gold-600) l c h / var(--bco)) !important |
| `d-bc-gold-700` | --bco: var(--dt-color-gold-700-a); border-color: oklch(from var(--dt-color-gold-700) l c h / var(--bco)) !important |
| `d-bc-gold-900` | --bco: var(--dt-color-gold-900-a); border-color: oklch(from var(--dt-color-gold-900) l c h / var(--bco)) !important |
| `d-bc-green-100` | --bco: var(--dt-color-green-100-a); border-color: oklch(from var(--dt-color-green-100) l c h / var(--bco)) !important |
| `d-bc-green-1000` | --bco: var(--dt-color-green-1000-a); border-color: oklch(from var(--dt-color-green-1000) l c h / var(--bco)) !important |
| `d-bc-green-200` | --bco: var(--dt-color-green-200-a); border-color: oklch(from var(--dt-color-green-200) l c h / var(--bco)) !important |
| `d-bc-green-300` | --bco: var(--dt-color-green-300-a); border-color: oklch(from var(--dt-color-green-300) l c h / var(--bco)) !important |
| `d-bc-green-350` | --bco: var(--dt-color-green-350-a); border-color: oklch(from var(--dt-color-green-350) l c h / var(--bco)) !important |
| `d-bc-green-400` | --bco: var(--dt-color-green-400-a); border-color: oklch(from var(--dt-color-green-400) l c h / var(--bco)) !important |
| `d-bc-green-425` | --bco: var(--dt-color-green-425-a); border-color: oklch(from var(--dt-color-green-425) l c h / var(--bco)) !important |
| `d-bc-green-475` | --bco: var(--dt-color-green-475-a); border-color: oklch(from var(--dt-color-green-475) l c h / var(--bco)) !important |
| `d-bc-green-50` | --bco: var(--dt-color-green-50-a); border-color: oklch(from var(--dt-color-green-50) l c h / var(--bco)) !important |
| `d-bc-green-500` | --bco: var(--dt-color-green-500-a); border-color: oklch(from var(--dt-color-green-500) l c h / var(--bco)) !important |
| `d-bc-green-600` | --bco: var(--dt-color-green-600-a); border-color: oklch(from var(--dt-color-green-600) l c h / var(--bco)) !important |
| `d-bc-green-900` | --bco: var(--dt-color-green-900-a); border-color: oklch(from var(--dt-color-green-900) l c h / var(--bco)) !important |
| `d-bc-indigo-100` | --bco: var(--dt-color-indigo-100-a); border-color: oklch(from var(--dt-color-indigo-100) l c h / var(--bco)) !important |
| `d-bc-indigo-1000` | --bco: var(--dt-color-indigo-1000-a); border-color: oklch(from var(--dt-color-indigo-1000) l c h / var(--bco)) !important |
| `d-bc-indigo-200` | --bco: var(--dt-color-indigo-200-a); border-color: oklch(from var(--dt-color-indigo-200) l c h / var(--bco)) !important |
| `d-bc-indigo-300` | --bco: var(--dt-color-indigo-300-a); border-color: oklch(from var(--dt-color-indigo-300) l c h / var(--bco)) !important |
| `d-bc-indigo-400` | --bco: var(--dt-color-indigo-400-a); border-color: oklch(from var(--dt-color-indigo-400) l c h / var(--bco)) !important |
| `d-bc-indigo-50` | --bco: var(--dt-color-indigo-50-a); border-color: oklch(from var(--dt-color-indigo-50) l c h / var(--bco)) !important |
| `d-bc-indigo-500` | --bco: var(--dt-color-indigo-500-a); border-color: oklch(from var(--dt-color-indigo-500) l c h / var(--bco)) !important |
| `d-bc-indigo-600` | --bco: var(--dt-color-indigo-600-a); border-color: oklch(from var(--dt-color-indigo-600) l c h / var(--bco)) !important |
| `d-bc-indigo-700` | --bco: var(--dt-color-indigo-700-a); border-color: oklch(from var(--dt-color-indigo-700) l c h / var(--bco)) !important |
| `d-bc-indigo-800` | --bco: var(--dt-color-indigo-800-a); border-color: oklch(from var(--dt-color-indigo-800) l c h / var(--bco)) !important |
| `d-bc-indigo-900` | --bco: var(--dt-color-indigo-900-a); border-color: oklch(from var(--dt-color-indigo-900) l c h / var(--bco)) !important |
| `d-bc-indigo-950` | --bco: var(--dt-color-indigo-950-a); border-color: oklch(from var(--dt-color-indigo-950) l c h / var(--bco)) !important |
| `d-bc-magenta-100` | --bco: var(--dt-color-magenta-100-a); border-color: oklch(from var(--dt-color-magenta-100) l c h / var(--bco)) !important |
| `d-bc-magenta-1000` | --bco: var(--dt-color-magenta-1000-a); border-color: oklch(from var(--dt-color-magenta-1000) l c h / var(--bco)) !important |
| `d-bc-magenta-200` | --bco: var(--dt-color-magenta-200-a); border-color: oklch(from var(--dt-color-magenta-200) l c h / var(--bco)) !important |
| `d-bc-magenta-250` | --bco: var(--dt-color-magenta-250-a); border-color: oklch(from var(--dt-color-magenta-250) l c h / var(--bco)) !important |
| `d-bc-magenta-300` | --bco: var(--dt-color-magenta-300-a); border-color: oklch(from var(--dt-color-magenta-300) l c h / var(--bco)) !important |
| `d-bc-magenta-400` | --bco: var(--dt-color-magenta-400-a); border-color: oklch(from var(--dt-color-magenta-400) l c h / var(--bco)) !important |
| `d-bc-magenta-425` | --bco: var(--dt-color-magenta-425-a); border-color: oklch(from var(--dt-color-magenta-425) l c h / var(--bco)) !important |
| `d-bc-magenta-475` | --bco: var(--dt-color-magenta-475-a); border-color: oklch(from var(--dt-color-magenta-475) l c h / var(--bco)) !important |
| `d-bc-magenta-50` | --bco: var(--dt-color-magenta-50-a); border-color: oklch(from var(--dt-color-magenta-50) l c h / var(--bco)) !important |
| `d-bc-magenta-500` | --bco: var(--dt-color-magenta-500-a); border-color: oklch(from var(--dt-color-magenta-500) l c h / var(--bco)) !important |
| `d-bc-magenta-600` | --bco: var(--dt-color-magenta-600-a); border-color: oklch(from var(--dt-color-magenta-600) l c h / var(--bco)) !important |
| `d-bc-magenta-900` | --bco: var(--dt-color-magenta-900-a); border-color: oklch(from var(--dt-color-magenta-900) l c h / var(--bco)) !important |
| `d-bc-moderate` | --bco: var(--dt-color-border-moderate-a); border-color: oklch(from var(--dt-color-border-moderate) l c h / var(--bco)) !important |
| `d-bc-moderate-inverted` | --bco: var(--dt-color-border-moderate-inverted-a); border-color: oklch(from var(--dt-color-border-moderate-inverted) l c h / var(--bco)) !important |
| `d-bc-neutral-black` | --bco: var(--dt-color-neutral-black-a); border-color: oklch(from var(--dt-color-neutral-black) l c h / var(--bco)) !important |
| `d-bc-neutral-transparent` | --bco: var(--dt-color-neutral-transparent-a); border-color: oklch(from var(--dt-color-neutral-transparent) l c h / var(--bco)) !important |
| `d-bc-neutral-white` | --bco: var(--dt-color-neutral-white-a); border-color: oklch(from var(--dt-color-neutral-white) l c h / var(--bco)) !important |
| `d-bc-olive-100` | --bco: var(--dt-color-olive-100-a); border-color: oklch(from var(--dt-color-olive-100) l c h / var(--bco)) !important |
| `d-bc-olive-1000` | --bco: var(--dt-color-olive-1000-a); border-color: oklch(from var(--dt-color-olive-1000) l c h / var(--bco)) !important |
| `d-bc-olive-200` | --bco: var(--dt-color-olive-200-a); border-color: oklch(from var(--dt-color-olive-200) l c h / var(--bco)) !important |
| `d-bc-olive-300` | --bco: var(--dt-color-olive-300-a); border-color: oklch(from var(--dt-color-olive-300) l c h / var(--bco)) !important |
| `d-bc-olive-400` | --bco: var(--dt-color-olive-400-a); border-color: oklch(from var(--dt-color-olive-400) l c h / var(--bco)) !important |
| `d-bc-olive-50` | --bco: var(--dt-color-olive-50-a); border-color: oklch(from var(--dt-color-olive-50) l c h / var(--bco)) !important |
| `d-bc-olive-500` | --bco: var(--dt-color-olive-500-a); border-color: oklch(from var(--dt-color-olive-500) l c h / var(--bco)) !important |
| `d-bc-olive-600` | --bco: var(--dt-color-olive-600-a); border-color: oklch(from var(--dt-color-olive-600) l c h / var(--bco)) !important |
| `d-bc-olive-700` | --bco: var(--dt-color-olive-700-a); border-color: oklch(from var(--dt-color-olive-700) l c h / var(--bco)) !important |
| `d-bc-olive-800` | --bco: var(--dt-color-olive-800-a); border-color: oklch(from var(--dt-color-olive-800) l c h / var(--bco)) !important |
| `d-bc-olive-900` | --bco: var(--dt-color-olive-900-a); border-color: oklch(from var(--dt-color-olive-900) l c h / var(--bco)) !important |
| `d-bc-olive-950` | --bco: var(--dt-color-olive-950-a); border-color: oklch(from var(--dt-color-olive-950) l c h / var(--bco)) !important |
| `d-bc-purple-100` | --bco: var(--dt-color-purple-100-a); border-color: oklch(from var(--dt-color-purple-100) l c h / var(--bco)) !important |
| `d-bc-purple-1000` | --bco: var(--dt-color-purple-1000-a); border-color: oklch(from var(--dt-color-purple-1000) l c h / var(--bco)) !important |
| `d-bc-purple-200` | --bco: var(--dt-color-purple-200-a); border-color: oklch(from var(--dt-color-purple-200) l c h / var(--bco)) !important |
| `d-bc-purple-250` | --bco: var(--dt-color-purple-250-a); border-color: oklch(from var(--dt-color-purple-250) l c h / var(--bco)) !important |
| `d-bc-purple-300` | --bco: var(--dt-color-purple-300-a); border-color: oklch(from var(--dt-color-purple-300) l c h / var(--bco)) !important |
| `d-bc-purple-350` | --bco: var(--dt-color-purple-350-a); border-color: oklch(from var(--dt-color-purple-350) l c h / var(--bco)) !important |
| `d-bc-purple-400` | --bco: var(--dt-color-purple-400-a); border-color: oklch(from var(--dt-color-purple-400) l c h / var(--bco)) !important |
| `d-bc-purple-450` | --bco: var(--dt-color-purple-450-a); border-color: oklch(from var(--dt-color-purple-450) l c h / var(--bco)) !important |
| `d-bc-purple-50` | --bco: var(--dt-color-purple-50-a); border-color: oklch(from var(--dt-color-purple-50) l c h / var(--bco)) !important |
| `d-bc-purple-500` | --bco: var(--dt-color-purple-500-a); border-color: oklch(from var(--dt-color-purple-500) l c h / var(--bco)) !important |
| `d-bc-purple-550` | --bco: var(--dt-color-purple-550-a); border-color: oklch(from var(--dt-color-purple-550) l c h / var(--bco)) !important |
| `d-bc-purple-600` | --bco: var(--dt-color-purple-600-a); border-color: oklch(from var(--dt-color-purple-600) l c h / var(--bco)) !important |
| `d-bc-red-100` | --bco: var(--dt-color-red-100-a); border-color: oklch(from var(--dt-color-red-100) l c h / var(--bco)) !important |
| `d-bc-red-1000` | --bco: var(--dt-color-red-1000-a); border-color: oklch(from var(--dt-color-red-1000) l c h / var(--bco)) !important |
| `d-bc-red-200` | --bco: var(--dt-color-red-200-a); border-color: oklch(from var(--dt-color-red-200) l c h / var(--bco)) !important |
| `d-bc-red-300` | --bco: var(--dt-color-red-300-a); border-color: oklch(from var(--dt-color-red-300) l c h / var(--bco)) !important |
| `d-bc-red-350` | --bco: var(--dt-color-red-350-a); border-color: oklch(from var(--dt-color-red-350) l c h / var(--bco)) !important |
| `d-bc-red-400` | --bco: var(--dt-color-red-400-a); border-color: oklch(from var(--dt-color-red-400) l c h / var(--bco)) !important |
| `d-bc-red-450` | --bco: var(--dt-color-red-450-a); border-color: oklch(from var(--dt-color-red-450) l c h / var(--bco)) !important |
| `d-bc-red-50` | --bco: var(--dt-color-red-50-a); border-color: oklch(from var(--dt-color-red-50) l c h / var(--bco)) !important |
| `d-bc-red-500` | --bco: var(--dt-color-red-500-a); border-color: oklch(from var(--dt-color-red-500) l c h / var(--bco)) !important |
| `d-bc-red-600` | --bco: var(--dt-color-red-600-a); border-color: oklch(from var(--dt-color-red-600) l c h / var(--bco)) !important |
| `d-bc-red-700` | --bco: var(--dt-color-red-700-a); border-color: oklch(from var(--dt-color-red-700) l c h / var(--bco)) !important |
| `d-bc-red-900` | --bco: var(--dt-color-red-900-a); border-color: oklch(from var(--dt-color-red-900) l c h / var(--bco)) !important |
| `d-bc-subtle` | --bco: var(--dt-color-border-subtle-a); border-color: oklch(from var(--dt-color-border-subtle) l c h / var(--bco)) !important |
| `d-bc-subtle-inverted` | --bco: var(--dt-color-border-subtle-inverted-a); border-color: oklch(from var(--dt-color-border-subtle-inverted) l c h / var(--bco)) !important |
| `d-bc-success` | --bco: var(--dt-color-border-success-a); border-color: oklch(from var(--dt-color-border-success) l c h / var(--bco)) !important |
| `d-bc-success-inverted` | --bco: var(--dt-color-border-success-inverted-a); border-color: oklch(from var(--dt-color-border-success-inverted) l c h / var(--bco)) !important |
| `d-bc-success-strong` | --bco: var(--dt-color-border-success-strong-a); border-color: oklch(from var(--dt-color-border-success-strong) l c h / var(--bco)) !important |
| `d-bc-success-strong-inverted` | --bco: var(--dt-color-border-success-strong-inverted-a); border-color: oklch(from var(--dt-color-border-success-strong-inverted) l c h / var(--bco)) !important |
| `d-bc-success-subtle` | --bco: var(--dt-color-border-success-subtle-a); border-color: oklch(from var(--dt-color-border-success-subtle) l c h / var(--bco)) !important |
| `d-bc-success-subtle-inverted` | --bco: var(--dt-color-border-success-subtle-inverted-a); border-color: oklch(from var(--dt-color-border-success-subtle-inverted) l c h / var(--bco)) !important |
| `d-bc-tan-100` | --bco: var(--dt-color-tan-100-a); border-color: oklch(from var(--dt-color-tan-100) l c h / var(--bco)) !important |
| `d-bc-tan-1000` | --bco: var(--dt-color-tan-1000-a); border-color: oklch(from var(--dt-color-tan-1000) l c h / var(--bco)) !important |
| `d-bc-tan-200` | --bco: var(--dt-color-tan-200-a); border-color: oklch(from var(--dt-color-tan-200) l c h / var(--bco)) !important |
| `d-bc-tan-300` | --bco: var(--dt-color-tan-300-a); border-color: oklch(from var(--dt-color-tan-300) l c h / var(--bco)) !important |
| `d-bc-tan-400` | --bco: var(--dt-color-tan-400-a); border-color: oklch(from var(--dt-color-tan-400) l c h / var(--bco)) !important |
| `d-bc-tan-50` | --bco: var(--dt-color-tan-50-a); border-color: oklch(from var(--dt-color-tan-50) l c h / var(--bco)) !important |
| `d-bc-tan-500` | --bco: var(--dt-color-tan-500-a); border-color: oklch(from var(--dt-color-tan-500) l c h / var(--bco)) !important |
| `d-bc-tan-600` | --bco: var(--dt-color-tan-600-a); border-color: oklch(from var(--dt-color-tan-600) l c h / var(--bco)) !important |
| `d-bc-tan-700` | --bco: var(--dt-color-tan-700-a); border-color: oklch(from var(--dt-color-tan-700) l c h / var(--bco)) !important |
| `d-bc-tan-800` | --bco: var(--dt-color-tan-800-a); border-color: oklch(from var(--dt-color-tan-800) l c h / var(--bco)) !important |
| `d-bc-tan-900` | --bco: var(--dt-color-tan-900-a); border-color: oklch(from var(--dt-color-tan-900) l c h / var(--bco)) !important |
| `d-bc-tan-950` | --bco: var(--dt-color-tan-950-a); border-color: oklch(from var(--dt-color-tan-950) l c h / var(--bco)) !important |
| `d-bc-teal-100` | --bco: var(--dt-color-teal-100-a); border-color: oklch(from var(--dt-color-teal-100) l c h / var(--bco)) !important |
| `d-bc-teal-1000` | --bco: var(--dt-color-teal-1000-a); border-color: oklch(from var(--dt-color-teal-1000) l c h / var(--bco)) !important |
| `d-bc-teal-200` | --bco: var(--dt-color-teal-200-a); border-color: oklch(from var(--dt-color-teal-200) l c h / var(--bco)) !important |
| `d-bc-teal-300` | --bco: var(--dt-color-teal-300-a); border-color: oklch(from var(--dt-color-teal-300) l c h / var(--bco)) !important |
| `d-bc-teal-400` | --bco: var(--dt-color-teal-400-a); border-color: oklch(from var(--dt-color-teal-400) l c h / var(--bco)) !important |
| `d-bc-teal-50` | --bco: var(--dt-color-teal-50-a); border-color: oklch(from var(--dt-color-teal-50) l c h / var(--bco)) !important |
| `d-bc-teal-500` | --bco: var(--dt-color-teal-500-a); border-color: oklch(from var(--dt-color-teal-500) l c h / var(--bco)) !important |
| `d-bc-teal-600` | --bco: var(--dt-color-teal-600-a); border-color: oklch(from var(--dt-color-teal-600) l c h / var(--bco)) !important |
| `d-bc-teal-700` | --bco: var(--dt-color-teal-700-a); border-color: oklch(from var(--dt-color-teal-700) l c h / var(--bco)) !important |
| `d-bc-teal-800` | --bco: var(--dt-color-teal-800-a); border-color: oklch(from var(--dt-color-teal-800) l c h / var(--bco)) !important |
| `d-bc-teal-900` | --bco: var(--dt-color-teal-900-a); border-color: oklch(from var(--dt-color-teal-900) l c h / var(--bco)) !important |
| `d-bc-teal-950` | --bco: var(--dt-color-teal-950-a); border-color: oklch(from var(--dt-color-teal-950) l c h / var(--bco)) !important |
| `d-bc-transparent` | border-color: transparent !important |
| `d-bc-unset` | border-color: unset !important |
| `d-bc-warning` | --bco: var(--dt-color-border-warning-a); border-color: oklch(from var(--dt-color-border-warning) l c h / var(--bco)) !important |
| `d-bc-warning-inverted` | --bco: var(--dt-color-border-warning-inverted-a); border-color: oklch(from var(--dt-color-border-warning-inverted) l c h / var(--bco)) !important |
| `d-bc-warning-strong` | --bco: var(--dt-color-border-warning-strong-a); border-color: oklch(from var(--dt-color-border-warning-strong) l c h / var(--bco)) !important |
| `d-bc-warning-strong-inverted` | --bco: var(--dt-color-border-warning-strong-inverted-a); border-color: oklch(from var(--dt-color-border-warning-strong-inverted) l c h / var(--bco)) !important |
| `d-bc-warning-subtle` | --bco: var(--dt-color-border-warning-subtle-a); border-color: oklch(from var(--dt-color-border-warning-subtle) l c h / var(--bco)) !important |
| `d-bc-warning-subtle-inverted` | --bco: var(--dt-color-border-warning-subtle-inverted-a); border-color: oklch(from var(--dt-color-border-warning-subtle-inverted) l c h / var(--bco)) !important |
