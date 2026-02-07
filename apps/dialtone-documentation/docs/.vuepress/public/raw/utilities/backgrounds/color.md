# Background Color

Utilities for setting the background color.

- **Keywords**: bg color,background colour,bgc

  Before using background color utilities, first consider [semantic surface colors](../../foundations/colors/palette.md#surface).

## Usage

Use `d-bgc-{color}` to set an element's background color.

```html
<div class="d-bgc-primary">...</div>
<div class="d-bgc-critical">...</div>
```

## Hover

Use `h:d-bgc-{color}` to change an element's `:hover` state background color.

```html
<dt-button kind="unstyled" class="d-p16 d-bgc-primary h:d-bgc-critical">
  Hover over me
</dt-button>
```

## Focus

Use `f:d-bgc-{color}` to change an element's `:focus` and `:focus-within` state background color.

```html
<dt-button kind="unstyled" class="d-p16 d-bgc-primary f:d-bgc-critical">
  Focus me
</dt-button>
```

## Focus Visible

Use `fv:d-bgc-{color}` to change an element's `:focus-visible` state background color [only when focused by keyboard].

```html
<dt-button kind="unstyled" class="d-p16 d-bgc-primary fv:d-bgc-critical">
  Keyboard focus me
</dt-button>
```

## Changing Opacity

Use `d-bgo{stop}` to change an element's background color opacity. You can also change the background color opacity on `:hover`, `:focus`, `:focus-visible` by using the respective `h:d-bgo{stop}`, `f:d-bgo{stop}`, `fv:d-bgo{stop}` prefixes.

```html
<p class="d-bgc-critical">...</p>
<p class="d-bgc-critical d-bgo99">...</p>
<p class="d-bgc-critical d-bgo95">...</p>
<p class="d-bgc-critical d-bgo90">...</p>
<p class="d-bgc-critical d-bgo75">...</p>
<p class="d-bgc-critical d-bgo50">...</p>
<p class="d-bgc-critical d-bgo25">...</p>
<p class="d-bgc-critical d-bgo10">...</p>
<p class="d-bgc-critical d-bgo0">...</p>
```

## Classes

| Class | Output |
| --- | --- |
| `d-bgc-ai` | background-image: var(--dt-color-surface-ai) !important |
| `d-bgc-backdrop` | --bgo: var(--dt-color-surface-backdrop-a); background-color: oklch(from var(--dt-color-surface-backdrop) l c h / var(--bgo)) !important |
| `d-bgc-berry-100` | --bgo: var(--dt-color-berry-100-a); background-color: oklch(from var(--dt-color-berry-100) l c h / var(--bgo)) !important |
| `d-bgc-berry-1000` | --bgo: var(--dt-color-berry-1000-a); background-color: oklch(from var(--dt-color-berry-1000) l c h / var(--bgo)) !important |
| `d-bgc-berry-200` | --bgo: var(--dt-color-berry-200-a); background-color: oklch(from var(--dt-color-berry-200) l c h / var(--bgo)) !important |
| `d-bgc-berry-300` | --bgo: var(--dt-color-berry-300-a); background-color: oklch(from var(--dt-color-berry-300) l c h / var(--bgo)) !important |
| `d-bgc-berry-400` | --bgo: var(--dt-color-berry-400-a); background-color: oklch(from var(--dt-color-berry-400) l c h / var(--bgo)) !important |
| `d-bgc-berry-50` | --bgo: var(--dt-color-berry-50-a); background-color: oklch(from var(--dt-color-berry-50) l c h / var(--bgo)) !important |
| `d-bgc-berry-500` | --bgo: var(--dt-color-berry-500-a); background-color: oklch(from var(--dt-color-berry-500) l c h / var(--bgo)) !important |
| `d-bgc-berry-600` | --bgo: var(--dt-color-berry-600-a); background-color: oklch(from var(--dt-color-berry-600) l c h / var(--bgo)) !important |
| `d-bgc-berry-700` | --bgo: var(--dt-color-berry-700-a); background-color: oklch(from var(--dt-color-berry-700) l c h / var(--bgo)) !important |
| `d-bgc-berry-800` | --bgo: var(--dt-color-berry-800-a); background-color: oklch(from var(--dt-color-berry-800) l c h / var(--bgo)) !important |
| `d-bgc-berry-900` | --bgo: var(--dt-color-berry-900-a); background-color: oklch(from var(--dt-color-berry-900) l c h / var(--bgo)) !important |
| `d-bgc-berry-950` | --bgo: var(--dt-color-berry-950-a); background-color: oklch(from var(--dt-color-berry-950) l c h / var(--bgo)) !important |
| `d-bgc-black-100` | --bgo: var(--dt-color-black-100-a); background-color: oklch(from var(--dt-color-black-100) l c h / var(--bgo)) !important |
| `d-bgc-black-1000` | --bgo: var(--dt-color-black-1000-a); background-color: oklch(from var(--dt-color-black-1000) l c h / var(--bgo)) !important |
| `d-bgc-black-200` | --bgo: var(--dt-color-black-200-a); background-color: oklch(from var(--dt-color-black-200) l c h / var(--bgo)) !important |
| `d-bgc-black-300` | --bgo: var(--dt-color-black-300-a); background-color: oklch(from var(--dt-color-black-300) l c h / var(--bgo)) !important |
| `d-bgc-black-400` | --bgo: var(--dt-color-black-400-a); background-color: oklch(from var(--dt-color-black-400) l c h / var(--bgo)) !important |
| `d-bgc-black-50` | --bgo: var(--dt-color-black-50-a); background-color: oklch(from var(--dt-color-black-50) l c h / var(--bgo)) !important |
| `d-bgc-black-500` | --bgo: var(--dt-color-black-500-a); background-color: oklch(from var(--dt-color-black-500) l c h / var(--bgo)) !important |
| `d-bgc-black-600` | --bgo: var(--dt-color-black-600-a); background-color: oklch(from var(--dt-color-black-600) l c h / var(--bgo)) !important |
| `d-bgc-black-700` | --bgo: var(--dt-color-black-700-a); background-color: oklch(from var(--dt-color-black-700) l c h / var(--bgo)) !important |
| `d-bgc-black-800` | --bgo: var(--dt-color-black-800-a); background-color: oklch(from var(--dt-color-black-800) l c h / var(--bgo)) !important |
| `d-bgc-black-900` | --bgo: var(--dt-color-black-900-a); background-color: oklch(from var(--dt-color-black-900) l c h / var(--bgo)) !important |
| `d-bgc-black-950` | --bgo: var(--dt-color-black-950-a); background-color: oklch(from var(--dt-color-black-950) l c h / var(--bgo)) !important |
| `d-bgc-blue-100` | --bgo: var(--dt-color-blue-100-a); background-color: oklch(from var(--dt-color-blue-100) l c h / var(--bgo)) !important |
| `d-bgc-blue-1000` | --bgo: var(--dt-color-blue-1000-a); background-color: oklch(from var(--dt-color-blue-1000) l c h / var(--bgo)) !important |
| `d-bgc-blue-200` | --bgo: var(--dt-color-blue-200-a); background-color: oklch(from var(--dt-color-blue-200) l c h / var(--bgo)) !important |
| `d-bgc-blue-300` | --bgo: var(--dt-color-blue-300-a); background-color: oklch(from var(--dt-color-blue-300) l c h / var(--bgo)) !important |
| `d-bgc-blue-400` | --bgo: var(--dt-color-blue-400-a); background-color: oklch(from var(--dt-color-blue-400) l c h / var(--bgo)) !important |
| `d-bgc-blue-425` | --bgo: var(--dt-color-blue-425-a); background-color: oklch(from var(--dt-color-blue-425) l c h / var(--bgo)) !important |
| `d-bgc-blue-450` | --bgo: var(--dt-color-blue-450-a); background-color: oklch(from var(--dt-color-blue-450) l c h / var(--bgo)) !important |
| `d-bgc-blue-475` | --bgo: var(--dt-color-blue-475-a); background-color: oklch(from var(--dt-color-blue-475) l c h / var(--bgo)) !important |
| `d-bgc-blue-50` | --bgo: var(--dt-color-blue-50-a); background-color: oklch(from var(--dt-color-blue-50) l c h / var(--bgo)) !important |
| `d-bgc-blue-500` | --bgo: var(--dt-color-blue-500-a); background-color: oklch(from var(--dt-color-blue-500) l c h / var(--bgo)) !important |
| `d-bgc-blue-600` | --bgo: var(--dt-color-blue-600-a); background-color: oklch(from var(--dt-color-blue-600) l c h / var(--bgo)) !important |
| `d-bgc-blue-900` | --bgo: var(--dt-color-blue-900-a); background-color: oklch(from var(--dt-color-blue-900) l c h / var(--bgo)) !important |
| `d-bgc-bold` | --bgo: var(--dt-color-surface-bold-a); background-color: oklch(from var(--dt-color-surface-bold) l c h / var(--bgo)) !important |
| `d-bgc-bold-inverted` | --bgo: var(--dt-color-surface-bold-inverted-a); background-color: oklch(from var(--dt-color-surface-bold-inverted) l c h / var(--bgo)) !important |
| `d-bgc-bold-opaque` | --bgo: var(--dt-color-surface-bold-opaque-a); background-color: oklch(from var(--dt-color-surface-bold-opaque) l c h / var(--bgo)) !important |
| `d-bgc-bold-opaque-inverted` | --bgo: var(--dt-color-surface-bold-opaque-inverted-a); background-color: oklch(from var(--dt-color-surface-bold-opaque-inverted) l c h / var(--bgo)) !important |
| `d-bgc-border-box` | background-clip: border-box !important |
| `d-bgc-brand` | --bgo: var(--dt-color-surface-brand-a); background-color: oklch(from var(--dt-color-surface-brand) l c h / var(--bgo)) !important |
| `d-bgc-brand-inverted` | --bgo: var(--dt-color-surface-brand-inverted-a); background-color: oklch(from var(--dt-color-surface-brand-inverted) l c h / var(--bgo)) !important |
| `d-bgc-brand-opaque` | --bgo: var(--dt-color-surface-brand-opaque-a); background-color: oklch(from var(--dt-color-surface-brand-opaque) l c h / var(--bgo)) !important |
| `d-bgc-brand-opaque-inverted` | --bgo: var(--dt-color-surface-brand-opaque-inverted-a); background-color: oklch(from var(--dt-color-surface-brand-opaque-inverted) l c h / var(--bgo)) !important |
| `d-bgc-brand-strong` | --bgo: var(--dt-color-surface-brand-strong-a); background-color: oklch(from var(--dt-color-surface-brand-strong) l c h / var(--bgo)) !important |
| `d-bgc-brand-strong-inverted` | --bgo: var(--dt-color-surface-brand-strong-inverted-a); background-color: oklch(from var(--dt-color-surface-brand-strong-inverted) l c h / var(--bgo)) !important |
| `d-bgc-brand-subtle` | --bgo: var(--dt-color-surface-brand-subtle-a); background-color: oklch(from var(--dt-color-surface-brand-subtle) l c h / var(--bgo)) !important |
| `d-bgc-brand-subtle-inverted` | --bgo: var(--dt-color-surface-brand-subtle-inverted-a); background-color: oklch(from var(--dt-color-surface-brand-subtle-inverted) l c h / var(--bgo)) !important |
| `d-bgc-brand-subtle-opaque` | --bgo: var(--dt-color-surface-brand-subtle-opaque-a); background-color: oklch(from var(--dt-color-surface-brand-subtle-opaque) l c h / var(--bgo)) !important |
| `d-bgc-brand-subtle-opaque-inverted` | --bgo: var(--dt-color-surface-brand-subtle-opaque-inverted-a); background-color: oklch(from var(--dt-color-surface-brand-subtle-opaque-inverted) l c h / var(--bgo)) !important |
| `d-bgc-chart-accent` | --bgo: var(--dt-color-chart-accent-a); background-color: oklch(from var(--dt-color-chart-accent) l c h / var(--bgo)) !important |
| `d-bgc-chart-accent-hover` | --bgo: var(--dt-color-chart-accent-hover-a); background-color: oklch(from var(--dt-color-chart-accent-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-accent-selected` | --bgo: var(--dt-color-chart-accent-selected-a); background-color: oklch(from var(--dt-color-chart-accent-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-01` | --bgo: var(--dt-color-chart-categorical-01-a); background-color: oklch(from var(--dt-color-chart-categorical-01) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-01-hover` | --bgo: var(--dt-color-chart-categorical-01-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-01-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-01-selected` | --bgo: var(--dt-color-chart-categorical-01-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-01-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-02` | --bgo: var(--dt-color-chart-categorical-02-a); background-color: oklch(from var(--dt-color-chart-categorical-02) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-02-hover` | --bgo: var(--dt-color-chart-categorical-02-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-02-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-02-selected` | --bgo: var(--dt-color-chart-categorical-02-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-02-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-03` | --bgo: var(--dt-color-chart-categorical-03-a); background-color: oklch(from var(--dt-color-chart-categorical-03) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-03-hover` | --bgo: var(--dt-color-chart-categorical-03-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-03-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-03-selected` | --bgo: var(--dt-color-chart-categorical-03-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-03-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-04` | --bgo: var(--dt-color-chart-categorical-04-a); background-color: oklch(from var(--dt-color-chart-categorical-04) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-04-hover` | --bgo: var(--dt-color-chart-categorical-04-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-04-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-04-selected` | --bgo: var(--dt-color-chart-categorical-04-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-04-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-05` | --bgo: var(--dt-color-chart-categorical-05-a); background-color: oklch(from var(--dt-color-chart-categorical-05) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-05-hover` | --bgo: var(--dt-color-chart-categorical-05-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-05-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-05-selected` | --bgo: var(--dt-color-chart-categorical-05-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-05-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-06` | --bgo: var(--dt-color-chart-categorical-06-a); background-color: oklch(from var(--dt-color-chart-categorical-06) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-06-hover` | --bgo: var(--dt-color-chart-categorical-06-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-06-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-06-selected` | --bgo: var(--dt-color-chart-categorical-06-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-06-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-07` | --bgo: var(--dt-color-chart-categorical-07-a); background-color: oklch(from var(--dt-color-chart-categorical-07) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-07-hover` | --bgo: var(--dt-color-chart-categorical-07-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-07-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-07-selected` | --bgo: var(--dt-color-chart-categorical-07-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-07-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-08` | --bgo: var(--dt-color-chart-categorical-08-a); background-color: oklch(from var(--dt-color-chart-categorical-08) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-08-hover` | --bgo: var(--dt-color-chart-categorical-08-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-08-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-08-selected` | --bgo: var(--dt-color-chart-categorical-08-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-08-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-09` | --bgo: var(--dt-color-chart-categorical-09-a); background-color: oklch(from var(--dt-color-chart-categorical-09) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-09-hover` | --bgo: var(--dt-color-chart-categorical-09-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-09-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-09-selected` | --bgo: var(--dt-color-chart-categorical-09-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-09-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-10` | --bgo: var(--dt-color-chart-categorical-10-a); background-color: oklch(from var(--dt-color-chart-categorical-10) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-10-hover` | --bgo: var(--dt-color-chart-categorical-10-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-10-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-10-selected` | --bgo: var(--dt-color-chart-categorical-10-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-10-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-11` | --bgo: var(--dt-color-chart-categorical-11-a); background-color: oklch(from var(--dt-color-chart-categorical-11) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-11-hover` | --bgo: var(--dt-color-chart-categorical-11-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-11-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-11-selected` | --bgo: var(--dt-color-chart-categorical-11-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-11-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-12` | --bgo: var(--dt-color-chart-categorical-12-a); background-color: oklch(from var(--dt-color-chart-categorical-12) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-12-hover` | --bgo: var(--dt-color-chart-categorical-12-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-12-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-12-selected` | --bgo: var(--dt-color-chart-categorical-12-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-12-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-13` | --bgo: var(--dt-color-chart-categorical-13-a); background-color: oklch(from var(--dt-color-chart-categorical-13) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-13-hover` | --bgo: var(--dt-color-chart-categorical-13-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-13-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-13-selected` | --bgo: var(--dt-color-chart-categorical-13-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-13-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-14` | --bgo: var(--dt-color-chart-categorical-14-a); background-color: oklch(from var(--dt-color-chart-categorical-14) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-14-hover` | --bgo: var(--dt-color-chart-categorical-14-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-14-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-14-selected` | --bgo: var(--dt-color-chart-categorical-14-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-14-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-15` | --bgo: var(--dt-color-chart-categorical-15-a); background-color: oklch(from var(--dt-color-chart-categorical-15) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-15-hover` | --bgo: var(--dt-color-chart-categorical-15-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-15-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-15-selected` | --bgo: var(--dt-color-chart-categorical-15-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-15-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-16` | --bgo: var(--dt-color-chart-categorical-16-a); background-color: oklch(from var(--dt-color-chart-categorical-16) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-16-hover` | --bgo: var(--dt-color-chart-categorical-16-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-16-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-16-selected` | --bgo: var(--dt-color-chart-categorical-16-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-16-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-17` | --bgo: var(--dt-color-chart-categorical-17-a); background-color: oklch(from var(--dt-color-chart-categorical-17) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-17-hover` | --bgo: var(--dt-color-chart-categorical-17-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-17-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-17-selected` | --bgo: var(--dt-color-chart-categorical-17-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-17-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-18` | --bgo: var(--dt-color-chart-categorical-18-a); background-color: oklch(from var(--dt-color-chart-categorical-18) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-18-hover` | --bgo: var(--dt-color-chart-categorical-18-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-18-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-18-selected` | --bgo: var(--dt-color-chart-categorical-18-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-18-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-19` | --bgo: var(--dt-color-chart-categorical-19-a); background-color: oklch(from var(--dt-color-chart-categorical-19) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-19-hover` | --bgo: var(--dt-color-chart-categorical-19-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-19-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-19-selected` | --bgo: var(--dt-color-chart-categorical-19-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-19-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-20` | --bgo: var(--dt-color-chart-categorical-20-a); background-color: oklch(from var(--dt-color-chart-categorical-20) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-20-hover` | --bgo: var(--dt-color-chart-categorical-20-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-20-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-20-selected` | --bgo: var(--dt-color-chart-categorical-20-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-20-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-21` | --bgo: var(--dt-color-chart-categorical-21-a); background-color: oklch(from var(--dt-color-chart-categorical-21) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-21-hover` | --bgo: var(--dt-color-chart-categorical-21-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-21-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-21-selected` | --bgo: var(--dt-color-chart-categorical-21-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-21-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-22` | --bgo: var(--dt-color-chart-categorical-22-a); background-color: oklch(from var(--dt-color-chart-categorical-22) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-22-hover` | --bgo: var(--dt-color-chart-categorical-22-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-22-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-22-selected` | --bgo: var(--dt-color-chart-categorical-22-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-22-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-23` | --bgo: var(--dt-color-chart-categorical-23-a); background-color: oklch(from var(--dt-color-chart-categorical-23) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-23-hover` | --bgo: var(--dt-color-chart-categorical-23-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-23-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-23-selected` | --bgo: var(--dt-color-chart-categorical-23-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-23-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-24` | --bgo: var(--dt-color-chart-categorical-24-a); background-color: oklch(from var(--dt-color-chart-categorical-24) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-24-hover` | --bgo: var(--dt-color-chart-categorical-24-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-24-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-24-selected` | --bgo: var(--dt-color-chart-categorical-24-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-24-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-25` | --bgo: var(--dt-color-chart-categorical-25-a); background-color: oklch(from var(--dt-color-chart-categorical-25) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-25-hover` | --bgo: var(--dt-color-chart-categorical-25-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-25-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-25-selected` | --bgo: var(--dt-color-chart-categorical-25-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-25-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-26` | --bgo: var(--dt-color-chart-categorical-26-a); background-color: oklch(from var(--dt-color-chart-categorical-26) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-26-hover` | --bgo: var(--dt-color-chart-categorical-26-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-26-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-26-selected` | --bgo: var(--dt-color-chart-categorical-26-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-26-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-27` | --bgo: var(--dt-color-chart-categorical-27-a); background-color: oklch(from var(--dt-color-chart-categorical-27) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-27-hover` | --bgo: var(--dt-color-chart-categorical-27-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-27-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-27-selected` | --bgo: var(--dt-color-chart-categorical-27-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-27-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-28` | --bgo: var(--dt-color-chart-categorical-28-a); background-color: oklch(from var(--dt-color-chart-categorical-28) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-28-hover` | --bgo: var(--dt-color-chart-categorical-28-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-28-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-28-selected` | --bgo: var(--dt-color-chart-categorical-28-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-28-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-29` | --bgo: var(--dt-color-chart-categorical-29-a); background-color: oklch(from var(--dt-color-chart-categorical-29) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-29-hover` | --bgo: var(--dt-color-chart-categorical-29-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-29-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-29-selected` | --bgo: var(--dt-color-chart-categorical-29-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-29-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-30` | --bgo: var(--dt-color-chart-categorical-30-a); background-color: oklch(from var(--dt-color-chart-categorical-30) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-30-hover` | --bgo: var(--dt-color-chart-categorical-30-hover-a); background-color: oklch(from var(--dt-color-chart-categorical-30-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-categorical-30-selected` | --bgo: var(--dt-color-chart-categorical-30-selected-a); background-color: oklch(from var(--dt-color-chart-categorical-30-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-critical` | --bgo: var(--dt-color-chart-critical-a); background-color: oklch(from var(--dt-color-chart-critical) l c h / var(--bgo)) !important |
| `d-bgc-chart-critical-hover` | --bgo: var(--dt-color-chart-critical-hover-a); background-color: oklch(from var(--dt-color-chart-critical-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-critical-selected` | --bgo: var(--dt-color-chart-critical-selected-a); background-color: oklch(from var(--dt-color-chart-critical-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-info` | --bgo: var(--dt-color-chart-info-a); background-color: oklch(from var(--dt-color-chart-info) l c h / var(--bgo)) !important |
| `d-bgc-chart-info-hover` | --bgo: var(--dt-color-chart-info-hover-a); background-color: oklch(from var(--dt-color-chart-info-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-info-selected` | --bgo: var(--dt-color-chart-info-selected-a); background-color: oklch(from var(--dt-color-chart-info-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-neutral` | --bgo: var(--dt-color-chart-neutral-a); background-color: oklch(from var(--dt-color-chart-neutral) l c h / var(--bgo)) !important |
| `d-bgc-chart-neutral-hover` | --bgo: var(--dt-color-chart-neutral-hover-a); background-color: oklch(from var(--dt-color-chart-neutral-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-neutral-selected` | --bgo: var(--dt-color-chart-neutral-selected-a); background-color: oklch(from var(--dt-color-chart-neutral-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-positive` | --bgo: var(--dt-color-chart-positive-a); background-color: oklch(from var(--dt-color-chart-positive) l c h / var(--bgo)) !important |
| `d-bgc-chart-positive-hover` | --bgo: var(--dt-color-chart-positive-hover-a); background-color: oklch(from var(--dt-color-chart-positive-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-positive-selected` | --bgo: var(--dt-color-chart-positive-selected-a); background-color: oklch(from var(--dt-color-chart-positive-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-01` | --bgo: var(--dt-color-chart-sequential-01-a); background-color: oklch(from var(--dt-color-chart-sequential-01) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-01-hover` | --bgo: var(--dt-color-chart-sequential-01-hover-a); background-color: oklch(from var(--dt-color-chart-sequential-01-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-01-selected` | --bgo: var(--dt-color-chart-sequential-01-selected-a); background-color: oklch(from var(--dt-color-chart-sequential-01-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-02` | --bgo: var(--dt-color-chart-sequential-02-a); background-color: oklch(from var(--dt-color-chart-sequential-02) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-02-hover` | --bgo: var(--dt-color-chart-sequential-02-hover-a); background-color: oklch(from var(--dt-color-chart-sequential-02-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-02-selected` | --bgo: var(--dt-color-chart-sequential-02-selected-a); background-color: oklch(from var(--dt-color-chart-sequential-02-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-03` | --bgo: var(--dt-color-chart-sequential-03-a); background-color: oklch(from var(--dt-color-chart-sequential-03) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-03-hover` | --bgo: var(--dt-color-chart-sequential-03-hover-a); background-color: oklch(from var(--dt-color-chart-sequential-03-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-03-selected` | --bgo: var(--dt-color-chart-sequential-03-selected-a); background-color: oklch(from var(--dt-color-chart-sequential-03-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-04` | --bgo: var(--dt-color-chart-sequential-04-a); background-color: oklch(from var(--dt-color-chart-sequential-04) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-04-hover` | --bgo: var(--dt-color-chart-sequential-04-hover-a); background-color: oklch(from var(--dt-color-chart-sequential-04-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-04-selected` | --bgo: var(--dt-color-chart-sequential-04-selected-a); background-color: oklch(from var(--dt-color-chart-sequential-04-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-05` | --bgo: var(--dt-color-chart-sequential-05-a); background-color: oklch(from var(--dt-color-chart-sequential-05) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-05-hover` | --bgo: var(--dt-color-chart-sequential-05-hover-a); background-color: oklch(from var(--dt-color-chart-sequential-05-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-05-selected` | --bgo: var(--dt-color-chart-sequential-05-selected-a); background-color: oklch(from var(--dt-color-chart-sequential-05-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-06` | --bgo: var(--dt-color-chart-sequential-06-a); background-color: oklch(from var(--dt-color-chart-sequential-06) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-06-hover` | --bgo: var(--dt-color-chart-sequential-06-hover-a); background-color: oklch(from var(--dt-color-chart-sequential-06-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-06-selected` | --bgo: var(--dt-color-chart-sequential-06-selected-a); background-color: oklch(from var(--dt-color-chart-sequential-06-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-07` | --bgo: var(--dt-color-chart-sequential-07-a); background-color: oklch(from var(--dt-color-chart-sequential-07) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-07-hover` | --bgo: var(--dt-color-chart-sequential-07-hover-a); background-color: oklch(from var(--dt-color-chart-sequential-07-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-07-selected` | --bgo: var(--dt-color-chart-sequential-07-selected-a); background-color: oklch(from var(--dt-color-chart-sequential-07-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-08` | --bgo: var(--dt-color-chart-sequential-08-a); background-color: oklch(from var(--dt-color-chart-sequential-08) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-08-hover` | --bgo: var(--dt-color-chart-sequential-08-hover-a); background-color: oklch(from var(--dt-color-chart-sequential-08-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-08-selected` | --bgo: var(--dt-color-chart-sequential-08-selected-a); background-color: oklch(from var(--dt-color-chart-sequential-08-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-09` | --bgo: var(--dt-color-chart-sequential-09-a); background-color: oklch(from var(--dt-color-chart-sequential-09) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-09-hover` | --bgo: var(--dt-color-chart-sequential-09-hover-a); background-color: oklch(from var(--dt-color-chart-sequential-09-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-09-selected` | --bgo: var(--dt-color-chart-sequential-09-selected-a); background-color: oklch(from var(--dt-color-chart-sequential-09-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-10` | --bgo: var(--dt-color-chart-sequential-10-a); background-color: oklch(from var(--dt-color-chart-sequential-10) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-10-hover` | --bgo: var(--dt-color-chart-sequential-10-hover-a); background-color: oklch(from var(--dt-color-chart-sequential-10-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-10-selected` | --bgo: var(--dt-color-chart-sequential-10-selected-a); background-color: oklch(from var(--dt-color-chart-sequential-10-selected) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-00-end` | --bgo: var(--dt-color-chart-sequential-range-00-end-a); background-color: oklch(from var(--dt-color-chart-sequential-range-00-end) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-00-start` | --bgo: var(--dt-color-chart-sequential-range-00-start-a); background-color: oklch(from var(--dt-color-chart-sequential-range-00-start) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-01-end` | --bgo: var(--dt-color-chart-sequential-range-01-end-a); background-color: oklch(from var(--dt-color-chart-sequential-range-01-end) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-01-start` | --bgo: var(--dt-color-chart-sequential-range-01-start-a); background-color: oklch(from var(--dt-color-chart-sequential-range-01-start) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-02-end` | --bgo: var(--dt-color-chart-sequential-range-02-end-a); background-color: oklch(from var(--dt-color-chart-sequential-range-02-end) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-02-start` | --bgo: var(--dt-color-chart-sequential-range-02-start-a); background-color: oklch(from var(--dt-color-chart-sequential-range-02-start) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-03-end` | --bgo: var(--dt-color-chart-sequential-range-03-end-a); background-color: oklch(from var(--dt-color-chart-sequential-range-03-end) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-03-start` | --bgo: var(--dt-color-chart-sequential-range-03-start-a); background-color: oklch(from var(--dt-color-chart-sequential-range-03-start) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-04-end` | --bgo: var(--dt-color-chart-sequential-range-04-end-a); background-color: oklch(from var(--dt-color-chart-sequential-range-04-end) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-04-start` | --bgo: var(--dt-color-chart-sequential-range-04-start-a); background-color: oklch(from var(--dt-color-chart-sequential-range-04-start) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-05-end` | --bgo: var(--dt-color-chart-sequential-range-05-end-a); background-color: oklch(from var(--dt-color-chart-sequential-range-05-end) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-05-start` | --bgo: var(--dt-color-chart-sequential-range-05-start-a); background-color: oklch(from var(--dt-color-chart-sequential-range-05-start) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-06-end` | --bgo: var(--dt-color-chart-sequential-range-06-end-a); background-color: oklch(from var(--dt-color-chart-sequential-range-06-end) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-06-start` | --bgo: var(--dt-color-chart-sequential-range-06-start-a); background-color: oklch(from var(--dt-color-chart-sequential-range-06-start) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-07-end` | --bgo: var(--dt-color-chart-sequential-range-07-end-a); background-color: oklch(from var(--dt-color-chart-sequential-range-07-end) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-07-start` | --bgo: var(--dt-color-chart-sequential-range-07-start-a); background-color: oklch(from var(--dt-color-chart-sequential-range-07-start) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-08-end` | --bgo: var(--dt-color-chart-sequential-range-08-end-a); background-color: oklch(from var(--dt-color-chart-sequential-range-08-end) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-08-start` | --bgo: var(--dt-color-chart-sequential-range-08-start-a); background-color: oklch(from var(--dt-color-chart-sequential-range-08-start) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-09-end` | --bgo: var(--dt-color-chart-sequential-range-09-end-a); background-color: oklch(from var(--dt-color-chart-sequential-range-09-end) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-09-start` | --bgo: var(--dt-color-chart-sequential-range-09-start-a); background-color: oklch(from var(--dt-color-chart-sequential-range-09-start) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-10-end` | --bgo: var(--dt-color-chart-sequential-range-10-end-a); background-color: oklch(from var(--dt-color-chart-sequential-range-10-end) l c h / var(--bgo)) !important |
| `d-bgc-chart-sequential-range-10-start` | --bgo: var(--dt-color-chart-sequential-range-10-start-a); background-color: oklch(from var(--dt-color-chart-sequential-range-10-start) l c h / var(--bgo)) !important |
| `d-bgc-chart-warning` | --bgo: var(--dt-color-chart-warning-a); background-color: oklch(from var(--dt-color-chart-warning) l c h / var(--bgo)) !important |
| `d-bgc-chart-warning-hover` | --bgo: var(--dt-color-chart-warning-hover-a); background-color: oklch(from var(--dt-color-chart-warning-hover) l c h / var(--bgo)) !important |
| `d-bgc-chart-warning-selected` | --bgo: var(--dt-color-chart-warning-selected-a); background-color: oklch(from var(--dt-color-chart-warning-selected) l c h / var(--bgo)) !important |
| `d-bgc-content-box` | background-clip: content-box !important |
| `d-bgc-contrast` | --bgo: var(--dt-color-surface-contrast-a); background-color: oklch(from var(--dt-color-surface-contrast) l c h / var(--bgo)) !important |
| `d-bgc-contrast-inverted` | --bgo: var(--dt-color-surface-contrast-inverted-a); background-color: oklch(from var(--dt-color-surface-contrast-inverted) l c h / var(--bgo)) !important |
| `d-bgc-contrast-opaque` | --bgo: var(--dt-color-surface-contrast-opaque-a); background-color: oklch(from var(--dt-color-surface-contrast-opaque) l c h / var(--bgo)) !important |
| `d-bgc-contrast-opaque-inverted` | --bgo: var(--dt-color-surface-contrast-opaque-inverted-a); background-color: oklch(from var(--dt-color-surface-contrast-opaque-inverted) l c h / var(--bgo)) !important |
| `d-bgc-coral-100` | --bgo: var(--dt-color-coral-100-a); background-color: oklch(from var(--dt-color-coral-100) l c h / var(--bgo)) !important |
| `d-bgc-coral-1000` | --bgo: var(--dt-color-coral-1000-a); background-color: oklch(from var(--dt-color-coral-1000) l c h / var(--bgo)) !important |
| `d-bgc-coral-200` | --bgo: var(--dt-color-coral-200-a); background-color: oklch(from var(--dt-color-coral-200) l c h / var(--bgo)) !important |
| `d-bgc-coral-300` | --bgo: var(--dt-color-coral-300-a); background-color: oklch(from var(--dt-color-coral-300) l c h / var(--bgo)) !important |
| `d-bgc-coral-400` | --bgo: var(--dt-color-coral-400-a); background-color: oklch(from var(--dt-color-coral-400) l c h / var(--bgo)) !important |
| `d-bgc-coral-50` | --bgo: var(--dt-color-coral-50-a); background-color: oklch(from var(--dt-color-coral-50) l c h / var(--bgo)) !important |
| `d-bgc-coral-500` | --bgo: var(--dt-color-coral-500-a); background-color: oklch(from var(--dt-color-coral-500) l c h / var(--bgo)) !important |
| `d-bgc-coral-600` | --bgo: var(--dt-color-coral-600-a); background-color: oklch(from var(--dt-color-coral-600) l c h / var(--bgo)) !important |
| `d-bgc-coral-700` | --bgo: var(--dt-color-coral-700-a); background-color: oklch(from var(--dt-color-coral-700) l c h / var(--bgo)) !important |
| `d-bgc-coral-800` | --bgo: var(--dt-color-coral-800-a); background-color: oklch(from var(--dt-color-coral-800) l c h / var(--bgo)) !important |
| `d-bgc-coral-900` | --bgo: var(--dt-color-coral-900-a); background-color: oklch(from var(--dt-color-coral-900) l c h / var(--bgo)) !important |
| `d-bgc-coral-950` | --bgo: var(--dt-color-coral-950-a); background-color: oklch(from var(--dt-color-coral-950) l c h / var(--bgo)) !important |
| `d-bgc-critical` | --bgo: var(--dt-color-surface-critical-a); background-color: oklch(from var(--dt-color-surface-critical) l c h / var(--bgo)) !important |
| `d-bgc-critical-inverted` | --bgo: var(--dt-color-surface-critical-inverted-a); background-color: oklch(from var(--dt-color-surface-critical-inverted) l c h / var(--bgo)) !important |
| `d-bgc-critical-opaque` | --bgo: var(--dt-color-surface-critical-opaque-a); background-color: oklch(from var(--dt-color-surface-critical-opaque) l c h / var(--bgo)) !important |
| `d-bgc-critical-opaque-inverted` | --bgo: var(--dt-color-surface-critical-opaque-inverted-a); background-color: oklch(from var(--dt-color-surface-critical-opaque-inverted) l c h / var(--bgo)) !important |
| `d-bgc-critical-strong` | --bgo: var(--dt-color-surface-critical-strong-a); background-color: oklch(from var(--dt-color-surface-critical-strong) l c h / var(--bgo)) !important |
| `d-bgc-critical-strong-inverted` | --bgo: var(--dt-color-surface-critical-strong-inverted-a); background-color: oklch(from var(--dt-color-surface-critical-strong-inverted) l c h / var(--bgo)) !important |
| `d-bgc-critical-subtle` | --bgo: var(--dt-color-surface-critical-subtle-a); background-color: oklch(from var(--dt-color-surface-critical-subtle) l c h / var(--bgo)) !important |
| `d-bgc-critical-subtle-inverted` | --bgo: var(--dt-color-surface-critical-subtle-inverted-a); background-color: oklch(from var(--dt-color-surface-critical-subtle-inverted) l c h / var(--bgo)) !important |
| `d-bgc-critical-subtle-opaque` | --bgo: var(--dt-color-surface-critical-subtle-opaque-a); background-color: oklch(from var(--dt-color-surface-critical-subtle-opaque) l c h / var(--bgo)) !important |
| `d-bgc-critical-subtle-opaque-inverted` | --bgo: var(--dt-color-surface-critical-subtle-opaque-inverted-a); background-color: oklch(from var(--dt-color-surface-critical-subtle-opaque-inverted) l c h / var(--bgo)) !important |
| `d-bgc-gold-100` | --bgo: var(--dt-color-gold-100-a); background-color: oklch(from var(--dt-color-gold-100) l c h / var(--bgo)) !important |
| `d-bgc-gold-1000` | --bgo: var(--dt-color-gold-1000-a); background-color: oklch(from var(--dt-color-gold-1000) l c h / var(--bgo)) !important |
| `d-bgc-gold-200` | --bgo: var(--dt-color-gold-200-a); background-color: oklch(from var(--dt-color-gold-200) l c h / var(--bgo)) !important |
| `d-bgc-gold-300` | --bgo: var(--dt-color-gold-300-a); background-color: oklch(from var(--dt-color-gold-300) l c h / var(--bgo)) !important |
| `d-bgc-gold-350` | --bgo: var(--dt-color-gold-350-a); background-color: oklch(from var(--dt-color-gold-350) l c h / var(--bgo)) !important |
| `d-bgc-gold-400` | --bgo: var(--dt-color-gold-400-a); background-color: oklch(from var(--dt-color-gold-400) l c h / var(--bgo)) !important |
| `d-bgc-gold-450` | --bgo: var(--dt-color-gold-450-a); background-color: oklch(from var(--dt-color-gold-450) l c h / var(--bgo)) !important |
| `d-bgc-gold-50` | --bgo: var(--dt-color-gold-50-a); background-color: oklch(from var(--dt-color-gold-50) l c h / var(--bgo)) !important |
| `d-bgc-gold-500` | --bgo: var(--dt-color-gold-500-a); background-color: oklch(from var(--dt-color-gold-500) l c h / var(--bgo)) !important |
| `d-bgc-gold-600` | --bgo: var(--dt-color-gold-600-a); background-color: oklch(from var(--dt-color-gold-600) l c h / var(--bgo)) !important |
| `d-bgc-gold-700` | --bgo: var(--dt-color-gold-700-a); background-color: oklch(from var(--dt-color-gold-700) l c h / var(--bgo)) !important |
| `d-bgc-gold-900` | --bgo: var(--dt-color-gold-900-a); background-color: oklch(from var(--dt-color-gold-900) l c h / var(--bgo)) !important |
| `d-bgc-green-100` | --bgo: var(--dt-color-green-100-a); background-color: oklch(from var(--dt-color-green-100) l c h / var(--bgo)) !important |
| `d-bgc-green-1000` | --bgo: var(--dt-color-green-1000-a); background-color: oklch(from var(--dt-color-green-1000) l c h / var(--bgo)) !important |
| `d-bgc-green-200` | --bgo: var(--dt-color-green-200-a); background-color: oklch(from var(--dt-color-green-200) l c h / var(--bgo)) !important |
| `d-bgc-green-300` | --bgo: var(--dt-color-green-300-a); background-color: oklch(from var(--dt-color-green-300) l c h / var(--bgo)) !important |
| `d-bgc-green-350` | --bgo: var(--dt-color-green-350-a); background-color: oklch(from var(--dt-color-green-350) l c h / var(--bgo)) !important |
| `d-bgc-green-400` | --bgo: var(--dt-color-green-400-a); background-color: oklch(from var(--dt-color-green-400) l c h / var(--bgo)) !important |
| `d-bgc-green-425` | --bgo: var(--dt-color-green-425-a); background-color: oklch(from var(--dt-color-green-425) l c h / var(--bgo)) !important |
| `d-bgc-green-475` | --bgo: var(--dt-color-green-475-a); background-color: oklch(from var(--dt-color-green-475) l c h / var(--bgo)) !important |
| `d-bgc-green-50` | --bgo: var(--dt-color-green-50-a); background-color: oklch(from var(--dt-color-green-50) l c h / var(--bgo)) !important |
| `d-bgc-green-500` | --bgo: var(--dt-color-green-500-a); background-color: oklch(from var(--dt-color-green-500) l c h / var(--bgo)) !important |
| `d-bgc-green-600` | --bgo: var(--dt-color-green-600-a); background-color: oklch(from var(--dt-color-green-600) l c h / var(--bgo)) !important |
| `d-bgc-green-900` | --bgo: var(--dt-color-green-900-a); background-color: oklch(from var(--dt-color-green-900) l c h / var(--bgo)) !important |
| `d-bgc-indigo-100` | --bgo: var(--dt-color-indigo-100-a); background-color: oklch(from var(--dt-color-indigo-100) l c h / var(--bgo)) !important |
| `d-bgc-indigo-1000` | --bgo: var(--dt-color-indigo-1000-a); background-color: oklch(from var(--dt-color-indigo-1000) l c h / var(--bgo)) !important |
| `d-bgc-indigo-200` | --bgo: var(--dt-color-indigo-200-a); background-color: oklch(from var(--dt-color-indigo-200) l c h / var(--bgo)) !important |
| `d-bgc-indigo-300` | --bgo: var(--dt-color-indigo-300-a); background-color: oklch(from var(--dt-color-indigo-300) l c h / var(--bgo)) !important |
| `d-bgc-indigo-400` | --bgo: var(--dt-color-indigo-400-a); background-color: oklch(from var(--dt-color-indigo-400) l c h / var(--bgo)) !important |
| `d-bgc-indigo-50` | --bgo: var(--dt-color-indigo-50-a); background-color: oklch(from var(--dt-color-indigo-50) l c h / var(--bgo)) !important |
| `d-bgc-indigo-500` | --bgo: var(--dt-color-indigo-500-a); background-color: oklch(from var(--dt-color-indigo-500) l c h / var(--bgo)) !important |
| `d-bgc-indigo-600` | --bgo: var(--dt-color-indigo-600-a); background-color: oklch(from var(--dt-color-indigo-600) l c h / var(--bgo)) !important |
| `d-bgc-indigo-700` | --bgo: var(--dt-color-indigo-700-a); background-color: oklch(from var(--dt-color-indigo-700) l c h / var(--bgo)) !important |
| `d-bgc-indigo-800` | --bgo: var(--dt-color-indigo-800-a); background-color: oklch(from var(--dt-color-indigo-800) l c h / var(--bgo)) !important |
| `d-bgc-indigo-900` | --bgo: var(--dt-color-indigo-900-a); background-color: oklch(from var(--dt-color-indigo-900) l c h / var(--bgo)) !important |
| `d-bgc-indigo-950` | --bgo: var(--dt-color-indigo-950-a); background-color: oklch(from var(--dt-color-indigo-950) l c h / var(--bgo)) !important |
| `d-bgc-info` | --bgo: var(--dt-color-surface-info-a); background-color: oklch(from var(--dt-color-surface-info) l c h / var(--bgo)) !important |
| `d-bgc-info-inverted` | --bgo: var(--dt-color-surface-info-inverted-a); background-color: oklch(from var(--dt-color-surface-info-inverted) l c h / var(--bgo)) !important |
| `d-bgc-info-opaque` | --bgo: var(--dt-color-surface-info-opaque-a); background-color: oklch(from var(--dt-color-surface-info-opaque) l c h / var(--bgo)) !important |
| `d-bgc-info-opaque-inverted` | --bgo: var(--dt-color-surface-info-opaque-inverted-a); background-color: oklch(from var(--dt-color-surface-info-opaque-inverted) l c h / var(--bgo)) !important |
| `d-bgc-info-strong` | --bgo: var(--dt-color-surface-info-strong-a); background-color: oklch(from var(--dt-color-surface-info-strong) l c h / var(--bgo)) !important |
| `d-bgc-info-strong-inverted` | --bgo: var(--dt-color-surface-info-strong-inverted-a); background-color: oklch(from var(--dt-color-surface-info-strong-inverted) l c h / var(--bgo)) !important |
| `d-bgc-info-subtle` | --bgo: var(--dt-color-surface-info-subtle-a); background-color: oklch(from var(--dt-color-surface-info-subtle) l c h / var(--bgo)) !important |
| `d-bgc-info-subtle-inverted` | --bgo: var(--dt-color-surface-info-subtle-inverted-a); background-color: oklch(from var(--dt-color-surface-info-subtle-inverted) l c h / var(--bgo)) !important |
| `d-bgc-info-subtle-opaque` | --bgo: var(--dt-color-surface-info-subtle-opaque-a); background-color: oklch(from var(--dt-color-surface-info-subtle-opaque) l c h / var(--bgo)) !important |
| `d-bgc-info-subtle-opaque-inverted` | --bgo: var(--dt-color-surface-info-subtle-opaque-inverted-a); background-color: oklch(from var(--dt-color-surface-info-subtle-opaque-inverted) l c h / var(--bgo)) !important |
| `d-bgc-magenta-100` | --bgo: var(--dt-color-magenta-100-a); background-color: oklch(from var(--dt-color-magenta-100) l c h / var(--bgo)) !important |
| `d-bgc-magenta-1000` | --bgo: var(--dt-color-magenta-1000-a); background-color: oklch(from var(--dt-color-magenta-1000) l c h / var(--bgo)) !important |
| `d-bgc-magenta-200` | --bgo: var(--dt-color-magenta-200-a); background-color: oklch(from var(--dt-color-magenta-200) l c h / var(--bgo)) !important |
| `d-bgc-magenta-250` | --bgo: var(--dt-color-magenta-250-a); background-color: oklch(from var(--dt-color-magenta-250) l c h / var(--bgo)) !important |
| `d-bgc-magenta-300` | --bgo: var(--dt-color-magenta-300-a); background-color: oklch(from var(--dt-color-magenta-300) l c h / var(--bgo)) !important |
| `d-bgc-magenta-400` | --bgo: var(--dt-color-magenta-400-a); background-color: oklch(from var(--dt-color-magenta-400) l c h / var(--bgo)) !important |
| `d-bgc-magenta-425` | --bgo: var(--dt-color-magenta-425-a); background-color: oklch(from var(--dt-color-magenta-425) l c h / var(--bgo)) !important |
| `d-bgc-magenta-475` | --bgo: var(--dt-color-magenta-475-a); background-color: oklch(from var(--dt-color-magenta-475) l c h / var(--bgo)) !important |
| `d-bgc-magenta-50` | --bgo: var(--dt-color-magenta-50-a); background-color: oklch(from var(--dt-color-magenta-50) l c h / var(--bgo)) !important |
| `d-bgc-magenta-500` | --bgo: var(--dt-color-magenta-500-a); background-color: oklch(from var(--dt-color-magenta-500) l c h / var(--bgo)) !important |
| `d-bgc-magenta-600` | --bgo: var(--dt-color-magenta-600-a); background-color: oklch(from var(--dt-color-magenta-600) l c h / var(--bgo)) !important |
| `d-bgc-magenta-900` | --bgo: var(--dt-color-magenta-900-a); background-color: oklch(from var(--dt-color-magenta-900) l c h / var(--bgo)) !important |
| `d-bgc-moderate` | --bgo: var(--dt-color-surface-moderate-a); background-color: oklch(from var(--dt-color-surface-moderate) l c h / var(--bgo)) !important |
| `d-bgc-moderate-inverted` | --bgo: var(--dt-color-surface-moderate-inverted-a); background-color: oklch(from var(--dt-color-surface-moderate-inverted) l c h / var(--bgo)) !important |
| `d-bgc-moderate-opaque` | --bgo: var(--dt-color-surface-moderate-opaque-a); background-color: oklch(from var(--dt-color-surface-moderate-opaque) l c h / var(--bgo)) !important |
| `d-bgc-moderate-opaque-inverted` | --bgo: var(--dt-color-surface-moderate-opaque-inverted-a); background-color: oklch(from var(--dt-color-surface-moderate-opaque-inverted) l c h / var(--bgo)) !important |
| `d-bgc-neutral-black` | --bgo: var(--dt-color-neutral-black-a); background-color: oklch(from var(--dt-color-neutral-black) l c h / var(--bgo)) !important |
| `d-bgc-neutral-transparent` | --bgo: var(--dt-color-neutral-transparent-a); background-color: oklch(from var(--dt-color-neutral-transparent) l c h / var(--bgo)) !important |
| `d-bgc-neutral-white` | --bgo: var(--dt-color-neutral-white-a); background-color: oklch(from var(--dt-color-neutral-white) l c h / var(--bgo)) !important |
| `d-bgc-olive-100` | --bgo: var(--dt-color-olive-100-a); background-color: oklch(from var(--dt-color-olive-100) l c h / var(--bgo)) !important |
| `d-bgc-olive-1000` | --bgo: var(--dt-color-olive-1000-a); background-color: oklch(from var(--dt-color-olive-1000) l c h / var(--bgo)) !important |
| `d-bgc-olive-200` | --bgo: var(--dt-color-olive-200-a); background-color: oklch(from var(--dt-color-olive-200) l c h / var(--bgo)) !important |
| `d-bgc-olive-300` | --bgo: var(--dt-color-olive-300-a); background-color: oklch(from var(--dt-color-olive-300) l c h / var(--bgo)) !important |
| `d-bgc-olive-400` | --bgo: var(--dt-color-olive-400-a); background-color: oklch(from var(--dt-color-olive-400) l c h / var(--bgo)) !important |
| `d-bgc-olive-50` | --bgo: var(--dt-color-olive-50-a); background-color: oklch(from var(--dt-color-olive-50) l c h / var(--bgo)) !important |
| `d-bgc-olive-500` | --bgo: var(--dt-color-olive-500-a); background-color: oklch(from var(--dt-color-olive-500) l c h / var(--bgo)) !important |
| `d-bgc-olive-600` | --bgo: var(--dt-color-olive-600-a); background-color: oklch(from var(--dt-color-olive-600) l c h / var(--bgo)) !important |
| `d-bgc-olive-700` | --bgo: var(--dt-color-olive-700-a); background-color: oklch(from var(--dt-color-olive-700) l c h / var(--bgo)) !important |
| `d-bgc-olive-800` | --bgo: var(--dt-color-olive-800-a); background-color: oklch(from var(--dt-color-olive-800) l c h / var(--bgo)) !important |
| `d-bgc-olive-900` | --bgo: var(--dt-color-olive-900-a); background-color: oklch(from var(--dt-color-olive-900) l c h / var(--bgo)) !important |
| `d-bgc-olive-950` | --bgo: var(--dt-color-olive-950-a); background-color: oklch(from var(--dt-color-olive-950) l c h / var(--bgo)) !important |
| `d-bgc-padding-box` | background-clip: padding-box !important |
| `d-bgc-primary` | --bgo: var(--dt-color-surface-primary-a); background-color: oklch(from var(--dt-color-surface-primary) l c h / var(--bgo)) !important |
| `d-bgc-primary-inverted` | --bgo: var(--dt-color-surface-primary-inverted-a); background-color: oklch(from var(--dt-color-surface-primary-inverted) l c h / var(--bgo)) !important |
| `d-bgc-primary-opaque` | --bgo: var(--dt-color-surface-primary-opaque-a); background-color: oklch(from var(--dt-color-surface-primary-opaque) l c h / var(--bgo)) !important |
| `d-bgc-primary-opaque-inverted` | --bgo: var(--dt-color-surface-primary-opaque-inverted-a); background-color: oklch(from var(--dt-color-surface-primary-opaque-inverted) l c h / var(--bgo)) !important |
| `d-bgc-purple-100` | --bgo: var(--dt-color-purple-100-a); background-color: oklch(from var(--dt-color-purple-100) l c h / var(--bgo)) !important |
| `d-bgc-purple-1000` | --bgo: var(--dt-color-purple-1000-a); background-color: oklch(from var(--dt-color-purple-1000) l c h / var(--bgo)) !important |
| `d-bgc-purple-200` | --bgo: var(--dt-color-purple-200-a); background-color: oklch(from var(--dt-color-purple-200) l c h / var(--bgo)) !important |
| `d-bgc-purple-250` | --bgo: var(--dt-color-purple-250-a); background-color: oklch(from var(--dt-color-purple-250) l c h / var(--bgo)) !important |
| `d-bgc-purple-300` | --bgo: var(--dt-color-purple-300-a); background-color: oklch(from var(--dt-color-purple-300) l c h / var(--bgo)) !important |
| `d-bgc-purple-350` | --bgo: var(--dt-color-purple-350-a); background-color: oklch(from var(--dt-color-purple-350) l c h / var(--bgo)) !important |
| `d-bgc-purple-400` | --bgo: var(--dt-color-purple-400-a); background-color: oklch(from var(--dt-color-purple-400) l c h / var(--bgo)) !important |
| `d-bgc-purple-450` | --bgo: var(--dt-color-purple-450-a); background-color: oklch(from var(--dt-color-purple-450) l c h / var(--bgo)) !important |
| `d-bgc-purple-50` | --bgo: var(--dt-color-purple-50-a); background-color: oklch(from var(--dt-color-purple-50) l c h / var(--bgo)) !important |
| `d-bgc-purple-500` | --bgo: var(--dt-color-purple-500-a); background-color: oklch(from var(--dt-color-purple-500) l c h / var(--bgo)) !important |
| `d-bgc-purple-550` | --bgo: var(--dt-color-purple-550-a); background-color: oklch(from var(--dt-color-purple-550) l c h / var(--bgo)) !important |
| `d-bgc-purple-600` | --bgo: var(--dt-color-purple-600-a); background-color: oklch(from var(--dt-color-purple-600) l c h / var(--bgo)) !important |
| `d-bgc-red-100` | --bgo: var(--dt-color-red-100-a); background-color: oklch(from var(--dt-color-red-100) l c h / var(--bgo)) !important |
| `d-bgc-red-1000` | --bgo: var(--dt-color-red-1000-a); background-color: oklch(from var(--dt-color-red-1000) l c h / var(--bgo)) !important |
| `d-bgc-red-200` | --bgo: var(--dt-color-red-200-a); background-color: oklch(from var(--dt-color-red-200) l c h / var(--bgo)) !important |
| `d-bgc-red-300` | --bgo: var(--dt-color-red-300-a); background-color: oklch(from var(--dt-color-red-300) l c h / var(--bgo)) !important |
| `d-bgc-red-350` | --bgo: var(--dt-color-red-350-a); background-color: oklch(from var(--dt-color-red-350) l c h / var(--bgo)) !important |
| `d-bgc-red-400` | --bgo: var(--dt-color-red-400-a); background-color: oklch(from var(--dt-color-red-400) l c h / var(--bgo)) !important |
| `d-bgc-red-450` | --bgo: var(--dt-color-red-450-a); background-color: oklch(from var(--dt-color-red-450) l c h / var(--bgo)) !important |
| `d-bgc-red-50` | --bgo: var(--dt-color-red-50-a); background-color: oklch(from var(--dt-color-red-50) l c h / var(--bgo)) !important |
| `d-bgc-red-500` | --bgo: var(--dt-color-red-500-a); background-color: oklch(from var(--dt-color-red-500) l c h / var(--bgo)) !important |
| `d-bgc-red-600` | --bgo: var(--dt-color-red-600-a); background-color: oklch(from var(--dt-color-red-600) l c h / var(--bgo)) !important |
| `d-bgc-red-700` | --bgo: var(--dt-color-red-700-a); background-color: oklch(from var(--dt-color-red-700) l c h / var(--bgo)) !important |
| `d-bgc-red-900` | --bgo: var(--dt-color-red-900-a); background-color: oklch(from var(--dt-color-red-900) l c h / var(--bgo)) !important |
| `d-bgc-secondary` | --bgo: var(--dt-color-surface-secondary-a); background-color: oklch(from var(--dt-color-surface-secondary) l c h / var(--bgo)) !important |
| `d-bgc-secondary-inverted` | --bgo: var(--dt-color-surface-secondary-inverted-a); background-color: oklch(from var(--dt-color-surface-secondary-inverted) l c h / var(--bgo)) !important |
| `d-bgc-secondary-opaque` | --bgo: var(--dt-color-surface-secondary-opaque-a); background-color: oklch(from var(--dt-color-surface-secondary-opaque) l c h / var(--bgo)) !important |
| `d-bgc-secondary-opaque-inverted` | --bgo: var(--dt-color-surface-secondary-opaque-inverted-a); background-color: oklch(from var(--dt-color-surface-secondary-opaque-inverted) l c h / var(--bgo)) !important |
| `d-bgc-strong` | --bgo: var(--dt-color-surface-strong-a); background-color: oklch(from var(--dt-color-surface-strong) l c h / var(--bgo)) !important |
| `d-bgc-strong-inverted` | --bgo: var(--dt-color-surface-strong-inverted-a); background-color: oklch(from var(--dt-color-surface-strong-inverted) l c h / var(--bgo)) !important |
| `d-bgc-strong-opaque` | --bgo: var(--dt-color-surface-strong-opaque-a); background-color: oklch(from var(--dt-color-surface-strong-opaque) l c h / var(--bgo)) !important |
| `d-bgc-strong-opaque-inverted` | --bgo: var(--dt-color-surface-strong-opaque-inverted-a); background-color: oklch(from var(--dt-color-surface-strong-opaque-inverted) l c h / var(--bgo)) !important |
| `d-bgc-success` | --bgo: var(--dt-color-surface-success-a); background-color: oklch(from var(--dt-color-surface-success) l c h / var(--bgo)) !important |
| `d-bgc-success-inverted` | --bgo: var(--dt-color-surface-success-inverted-a); background-color: oklch(from var(--dt-color-surface-success-inverted) l c h / var(--bgo)) !important |
| `d-bgc-success-opaque` | --bgo: var(--dt-color-surface-success-opaque-a); background-color: oklch(from var(--dt-color-surface-success-opaque) l c h / var(--bgo)) !important |
| `d-bgc-success-opaque-inverted` | --bgo: var(--dt-color-surface-success-opaque-inverted-a); background-color: oklch(from var(--dt-color-surface-success-opaque-inverted) l c h / var(--bgo)) !important |
| `d-bgc-success-strong` | --bgo: var(--dt-color-surface-success-strong-a); background-color: oklch(from var(--dt-color-surface-success-strong) l c h / var(--bgo)) !important |
| `d-bgc-success-strong-inverted` | --bgo: var(--dt-color-surface-success-strong-inverted-a); background-color: oklch(from var(--dt-color-surface-success-strong-inverted) l c h / var(--bgo)) !important |
| `d-bgc-success-subtle` | --bgo: var(--dt-color-surface-success-subtle-a); background-color: oklch(from var(--dt-color-surface-success-subtle) l c h / var(--bgo)) !important |
| `d-bgc-success-subtle-inverted` | --bgo: var(--dt-color-surface-success-subtle-inverted-a); background-color: oklch(from var(--dt-color-surface-success-subtle-inverted) l c h / var(--bgo)) !important |
| `d-bgc-success-subtle-opaque` | --bgo: var(--dt-color-surface-success-subtle-opaque-a); background-color: oklch(from var(--dt-color-surface-success-subtle-opaque) l c h / var(--bgo)) !important |
| `d-bgc-success-subtle-opaque-inverted` | --bgo: var(--dt-color-surface-success-subtle-opaque-inverted-a); background-color: oklch(from var(--dt-color-surface-success-subtle-opaque-inverted) l c h / var(--bgo)) !important |
| `d-bgc-tan-100` | --bgo: var(--dt-color-tan-100-a); background-color: oklch(from var(--dt-color-tan-100) l c h / var(--bgo)) !important |
| `d-bgc-tan-1000` | --bgo: var(--dt-color-tan-1000-a); background-color: oklch(from var(--dt-color-tan-1000) l c h / var(--bgo)) !important |
| `d-bgc-tan-200` | --bgo: var(--dt-color-tan-200-a); background-color: oklch(from var(--dt-color-tan-200) l c h / var(--bgo)) !important |
| `d-bgc-tan-300` | --bgo: var(--dt-color-tan-300-a); background-color: oklch(from var(--dt-color-tan-300) l c h / var(--bgo)) !important |
| `d-bgc-tan-400` | --bgo: var(--dt-color-tan-400-a); background-color: oklch(from var(--dt-color-tan-400) l c h / var(--bgo)) !important |
| `d-bgc-tan-50` | --bgo: var(--dt-color-tan-50-a); background-color: oklch(from var(--dt-color-tan-50) l c h / var(--bgo)) !important |
| `d-bgc-tan-500` | --bgo: var(--dt-color-tan-500-a); background-color: oklch(from var(--dt-color-tan-500) l c h / var(--bgo)) !important |
| `d-bgc-tan-600` | --bgo: var(--dt-color-tan-600-a); background-color: oklch(from var(--dt-color-tan-600) l c h / var(--bgo)) !important |
| `d-bgc-tan-700` | --bgo: var(--dt-color-tan-700-a); background-color: oklch(from var(--dt-color-tan-700) l c h / var(--bgo)) !important |
| `d-bgc-tan-800` | --bgo: var(--dt-color-tan-800-a); background-color: oklch(from var(--dt-color-tan-800) l c h / var(--bgo)) !important |
| `d-bgc-tan-900` | --bgo: var(--dt-color-tan-900-a); background-color: oklch(from var(--dt-color-tan-900) l c h / var(--bgo)) !important |
| `d-bgc-tan-950` | --bgo: var(--dt-color-tan-950-a); background-color: oklch(from var(--dt-color-tan-950) l c h / var(--bgo)) !important |
| `d-bgc-teal-100` | --bgo: var(--dt-color-teal-100-a); background-color: oklch(from var(--dt-color-teal-100) l c h / var(--bgo)) !important |
| `d-bgc-teal-1000` | --bgo: var(--dt-color-teal-1000-a); background-color: oklch(from var(--dt-color-teal-1000) l c h / var(--bgo)) !important |
| `d-bgc-teal-200` | --bgo: var(--dt-color-teal-200-a); background-color: oklch(from var(--dt-color-teal-200) l c h / var(--bgo)) !important |
| `d-bgc-teal-300` | --bgo: var(--dt-color-teal-300-a); background-color: oklch(from var(--dt-color-teal-300) l c h / var(--bgo)) !important |
| `d-bgc-teal-400` | --bgo: var(--dt-color-teal-400-a); background-color: oklch(from var(--dt-color-teal-400) l c h / var(--bgo)) !important |
| `d-bgc-teal-50` | --bgo: var(--dt-color-teal-50-a); background-color: oklch(from var(--dt-color-teal-50) l c h / var(--bgo)) !important |
| `d-bgc-teal-500` | --bgo: var(--dt-color-teal-500-a); background-color: oklch(from var(--dt-color-teal-500) l c h / var(--bgo)) !important |
| `d-bgc-teal-600` | --bgo: var(--dt-color-teal-600-a); background-color: oklch(from var(--dt-color-teal-600) l c h / var(--bgo)) !important |
| `d-bgc-teal-700` | --bgo: var(--dt-color-teal-700-a); background-color: oklch(from var(--dt-color-teal-700) l c h / var(--bgo)) !important |
| `d-bgc-teal-800` | --bgo: var(--dt-color-teal-800-a); background-color: oklch(from var(--dt-color-teal-800) l c h / var(--bgo)) !important |
| `d-bgc-teal-900` | --bgo: var(--dt-color-teal-900-a); background-color: oklch(from var(--dt-color-teal-900) l c h / var(--bgo)) !important |
| `d-bgc-teal-950` | --bgo: var(--dt-color-teal-950-a); background-color: oklch(from var(--dt-color-teal-950) l c h / var(--bgo)) !important |
| `d-bgc-text` | color: transparent !important; -webkit-background-clip: text !important; background-clip: text !important |
| `d-bgc-transparent` | background-color: transparent !important; background-image: none !important |
| `d-bgc-unset` | background-color: unset !important; background-image: unset !important |
| `d-bgc-warning` | --bgo: var(--dt-color-surface-warning-a); background-color: oklch(from var(--dt-color-surface-warning) l c h / var(--bgo)) !important |
| `d-bgc-warning-inverted` | --bgo: var(--dt-color-surface-warning-inverted-a); background-color: oklch(from var(--dt-color-surface-warning-inverted) l c h / var(--bgo)) !important |
| `d-bgc-warning-opaque` | --bgo: var(--dt-color-surface-warning-opaque-a); background-color: oklch(from var(--dt-color-surface-warning-opaque) l c h / var(--bgo)) !important |
| `d-bgc-warning-opaque-inverted` | --bgo: var(--dt-color-surface-warning-opaque-inverted-a); background-color: oklch(from var(--dt-color-surface-warning-opaque-inverted) l c h / var(--bgo)) !important |
| `d-bgc-warning-strong` | --bgo: var(--dt-color-surface-warning-strong-a); background-color: oklch(from var(--dt-color-surface-warning-strong) l c h / var(--bgo)) !important |
| `d-bgc-warning-strong-inverted` | --bgo: var(--dt-color-surface-warning-strong-inverted-a); background-color: oklch(from var(--dt-color-surface-warning-strong-inverted) l c h / var(--bgo)) !important |
| `d-bgc-warning-subtle` | --bgo: var(--dt-color-surface-warning-subtle-a); background-color: oklch(from var(--dt-color-surface-warning-subtle) l c h / var(--bgo)) !important |
| `d-bgc-warning-subtle-inverted` | --bgo: var(--dt-color-surface-warning-subtle-inverted-a); background-color: oklch(from var(--dt-color-surface-warning-subtle-inverted) l c h / var(--bgo)) !important |
| `d-bgc-warning-subtle-opaque` | --bgo: var(--dt-color-surface-warning-subtle-opaque-a); background-color: oklch(from var(--dt-color-surface-warning-subtle-opaque) l c h / var(--bgo)) !important |
| `d-bgc-warning-subtle-opaque-inverted` | --bgo: var(--dt-color-surface-warning-subtle-opaque-inverted-a); background-color: oklch(from var(--dt-color-surface-warning-subtle-opaque-inverted) l c h / var(--bgo)) !important |
