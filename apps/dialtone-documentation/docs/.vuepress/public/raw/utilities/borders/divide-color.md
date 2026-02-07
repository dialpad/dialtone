# Divide Color

Utilities for controlling the border color between an element's child items.

- **Keywords**: divider color,separator color,divide colour

## Vertical Dividers

Use `d-divide-y{n}` to create a divider between an element's child items.

```html
<dt-stack class="d-divide-y d-divide-default d-w100p">
  <dt-stack direction="row" align="center" justify="center" class="d-w100p d-p16">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-w100p d-p16">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-w100p d-p16">3</dt-stack>
</dt-stack>
```

## Horizontal Dividers

Use `d-divide-x{n}` to create a divider between an element's child items.

```html
<dt-stack direction="row" class="d-divide-x d-divide-default d-w100p">
  <dt-stack direction="row" align="center" justify="center" class="d-w100p d-p16">1</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-w100p d-p16">2</dt-stack>
  <dt-stack direction="row" align="center" justify="center" class="d-w100p d-p16">3</dt-stack>
</dt-stack>
```

## Classes

| Class | Output |
| --- | --- |
| `d-divide-accent` | --dco: var(--dt-color-border-accent-a); border-color: oklch(from var(--dt-color-border-accent) l c h / var(--dco)) !important |
| `d-divide-ai` | border-image-source: var(--dt-color-border-ai) !important; border-image-slice: 1 !important |
| `d-divide-berry-100` | --dco: var(--dt-color-berry-100-a); border-color: oklch(from var(--dt-color-berry-100) l c h / var(--dco)) !important |
| `d-divide-berry-1000` | --dco: var(--dt-color-berry-1000-a); border-color: oklch(from var(--dt-color-berry-1000) l c h / var(--dco)) !important |
| `d-divide-berry-200` | --dco: var(--dt-color-berry-200-a); border-color: oklch(from var(--dt-color-berry-200) l c h / var(--dco)) !important |
| `d-divide-berry-300` | --dco: var(--dt-color-berry-300-a); border-color: oklch(from var(--dt-color-berry-300) l c h / var(--dco)) !important |
| `d-divide-berry-400` | --dco: var(--dt-color-berry-400-a); border-color: oklch(from var(--dt-color-berry-400) l c h / var(--dco)) !important |
| `d-divide-berry-50` | --dco: var(--dt-color-berry-50-a); border-color: oklch(from var(--dt-color-berry-50) l c h / var(--dco)) !important |
| `d-divide-berry-500` | --dco: var(--dt-color-berry-500-a); border-color: oklch(from var(--dt-color-berry-500) l c h / var(--dco)) !important |
| `d-divide-berry-600` | --dco: var(--dt-color-berry-600-a); border-color: oklch(from var(--dt-color-berry-600) l c h / var(--dco)) !important |
| `d-divide-berry-700` | --dco: var(--dt-color-berry-700-a); border-color: oklch(from var(--dt-color-berry-700) l c h / var(--dco)) !important |
| `d-divide-berry-800` | --dco: var(--dt-color-berry-800-a); border-color: oklch(from var(--dt-color-berry-800) l c h / var(--dco)) !important |
| `d-divide-berry-900` | --dco: var(--dt-color-berry-900-a); border-color: oklch(from var(--dt-color-berry-900) l c h / var(--dco)) !important |
| `d-divide-berry-950` | --dco: var(--dt-color-berry-950-a); border-color: oklch(from var(--dt-color-berry-950) l c h / var(--dco)) !important |
| `d-divide-black-100` | --dco: var(--dt-color-black-100-a); border-color: oklch(from var(--dt-color-black-100) l c h / var(--dco)) !important |
| `d-divide-black-1000` | --dco: var(--dt-color-black-1000-a); border-color: oklch(from var(--dt-color-black-1000) l c h / var(--dco)) !important |
| `d-divide-black-200` | --dco: var(--dt-color-black-200-a); border-color: oklch(from var(--dt-color-black-200) l c h / var(--dco)) !important |
| `d-divide-black-300` | --dco: var(--dt-color-black-300-a); border-color: oklch(from var(--dt-color-black-300) l c h / var(--dco)) !important |
| `d-divide-black-400` | --dco: var(--dt-color-black-400-a); border-color: oklch(from var(--dt-color-black-400) l c h / var(--dco)) !important |
| `d-divide-black-50` | --dco: var(--dt-color-black-50-a); border-color: oklch(from var(--dt-color-black-50) l c h / var(--dco)) !important |
| `d-divide-black-500` | --dco: var(--dt-color-black-500-a); border-color: oklch(from var(--dt-color-black-500) l c h / var(--dco)) !important |
| `d-divide-black-600` | --dco: var(--dt-color-black-600-a); border-color: oklch(from var(--dt-color-black-600) l c h / var(--dco)) !important |
| `d-divide-black-700` | --dco: var(--dt-color-black-700-a); border-color: oklch(from var(--dt-color-black-700) l c h / var(--dco)) !important |
| `d-divide-black-800` | --dco: var(--dt-color-black-800-a); border-color: oklch(from var(--dt-color-black-800) l c h / var(--dco)) !important |
| `d-divide-black-900` | --dco: var(--dt-color-black-900-a); border-color: oklch(from var(--dt-color-black-900) l c h / var(--dco)) !important |
| `d-divide-black-950` | --dco: var(--dt-color-black-950-a); border-color: oklch(from var(--dt-color-black-950) l c h / var(--dco)) !important |
| `d-divide-blue-100` | --dco: var(--dt-color-blue-100-a); border-color: oklch(from var(--dt-color-blue-100) l c h / var(--dco)) !important |
| `d-divide-blue-1000` | --dco: var(--dt-color-blue-1000-a); border-color: oklch(from var(--dt-color-blue-1000) l c h / var(--dco)) !important |
| `d-divide-blue-200` | --dco: var(--dt-color-blue-200-a); border-color: oklch(from var(--dt-color-blue-200) l c h / var(--dco)) !important |
| `d-divide-blue-300` | --dco: var(--dt-color-blue-300-a); border-color: oklch(from var(--dt-color-blue-300) l c h / var(--dco)) !important |
| `d-divide-blue-400` | --dco: var(--dt-color-blue-400-a); border-color: oklch(from var(--dt-color-blue-400) l c h / var(--dco)) !important |
| `d-divide-blue-425` | --dco: var(--dt-color-blue-425-a); border-color: oklch(from var(--dt-color-blue-425) l c h / var(--dco)) !important |
| `d-divide-blue-450` | --dco: var(--dt-color-blue-450-a); border-color: oklch(from var(--dt-color-blue-450) l c h / var(--dco)) !important |
| `d-divide-blue-475` | --dco: var(--dt-color-blue-475-a); border-color: oklch(from var(--dt-color-blue-475) l c h / var(--dco)) !important |
| `d-divide-blue-50` | --dco: var(--dt-color-blue-50-a); border-color: oklch(from var(--dt-color-blue-50) l c h / var(--dco)) !important |
| `d-divide-blue-500` | --dco: var(--dt-color-blue-500-a); border-color: oklch(from var(--dt-color-blue-500) l c h / var(--dco)) !important |
| `d-divide-blue-600` | --dco: var(--dt-color-blue-600-a); border-color: oklch(from var(--dt-color-blue-600) l c h / var(--dco)) !important |
| `d-divide-blue-900` | --dco: var(--dt-color-blue-900-a); border-color: oklch(from var(--dt-color-blue-900) l c h / var(--dco)) !important |
| `d-divide-bold` | --dco: var(--dt-color-border-bold-a); border-color: oklch(from var(--dt-color-border-bold) l c h / var(--dco)) !important |
| `d-divide-bold-inverted` | --dco: var(--dt-color-border-bold-inverted-a); border-color: oklch(from var(--dt-color-border-bold-inverted) l c h / var(--dco)) !important |
| `d-divide-brand` | --dco: var(--dt-color-border-brand-a); border-color: oklch(from var(--dt-color-border-brand) l c h / var(--dco)) !important |
| `d-divide-brand-inverted` | --dco: var(--dt-color-border-brand-inverted-a); border-color: oklch(from var(--dt-color-border-brand-inverted) l c h / var(--dco)) !important |
| `d-divide-brand-strong` | --dco: var(--dt-color-border-brand-strong-a); border-color: oklch(from var(--dt-color-border-brand-strong) l c h / var(--dco)) !important |
| `d-divide-brand-strong-inverted` | --dco: var(--dt-color-border-brand-strong-inverted-a); border-color: oklch(from var(--dt-color-border-brand-strong-inverted) l c h / var(--dco)) !important |
| `d-divide-brand-subtle` | --dco: var(--dt-color-border-brand-subtle-a); border-color: oklch(from var(--dt-color-border-brand-subtle) l c h / var(--dco)) !important |
| `d-divide-brand-subtle-inverted` | --dco: var(--dt-color-border-brand-subtle-inverted-a); border-color: oklch(from var(--dt-color-border-brand-subtle-inverted) l c h / var(--dco)) !important |
| `d-divide-coral-100` | --dco: var(--dt-color-coral-100-a); border-color: oklch(from var(--dt-color-coral-100) l c h / var(--dco)) !important |
| `d-divide-coral-1000` | --dco: var(--dt-color-coral-1000-a); border-color: oklch(from var(--dt-color-coral-1000) l c h / var(--dco)) !important |
| `d-divide-coral-200` | --dco: var(--dt-color-coral-200-a); border-color: oklch(from var(--dt-color-coral-200) l c h / var(--dco)) !important |
| `d-divide-coral-300` | --dco: var(--dt-color-coral-300-a); border-color: oklch(from var(--dt-color-coral-300) l c h / var(--dco)) !important |
| `d-divide-coral-400` | --dco: var(--dt-color-coral-400-a); border-color: oklch(from var(--dt-color-coral-400) l c h / var(--dco)) !important |
| `d-divide-coral-50` | --dco: var(--dt-color-coral-50-a); border-color: oklch(from var(--dt-color-coral-50) l c h / var(--dco)) !important |
| `d-divide-coral-500` | --dco: var(--dt-color-coral-500-a); border-color: oklch(from var(--dt-color-coral-500) l c h / var(--dco)) !important |
| `d-divide-coral-600` | --dco: var(--dt-color-coral-600-a); border-color: oklch(from var(--dt-color-coral-600) l c h / var(--dco)) !important |
| `d-divide-coral-700` | --dco: var(--dt-color-coral-700-a); border-color: oklch(from var(--dt-color-coral-700) l c h / var(--dco)) !important |
| `d-divide-coral-800` | --dco: var(--dt-color-coral-800-a); border-color: oklch(from var(--dt-color-coral-800) l c h / var(--dco)) !important |
| `d-divide-coral-900` | --dco: var(--dt-color-coral-900-a); border-color: oklch(from var(--dt-color-coral-900) l c h / var(--dco)) !important |
| `d-divide-coral-950` | --dco: var(--dt-color-coral-950-a); border-color: oklch(from var(--dt-color-coral-950) l c h / var(--dco)) !important |
| `d-divide-critical` | --dco: var(--dt-color-border-critical-a); border-color: oklch(from var(--dt-color-border-critical) l c h / var(--dco)) !important |
| `d-divide-critical-inverted` | --dco: var(--dt-color-border-critical-inverted-a); border-color: oklch(from var(--dt-color-border-critical-inverted) l c h / var(--dco)) !important |
| `d-divide-critical-strong` | --dco: var(--dt-color-border-critical-strong-a); border-color: oklch(from var(--dt-color-border-critical-strong) l c h / var(--dco)) !important |
| `d-divide-critical-strong-inverted` | --dco: var(--dt-color-border-critical-strong-inverted-a); border-color: oklch(from var(--dt-color-border-critical-strong-inverted) l c h / var(--dco)) !important |
| `d-divide-critical-subtle` | --dco: var(--dt-color-border-critical-subtle-a); border-color: oklch(from var(--dt-color-border-critical-subtle) l c h / var(--dco)) !important |
| `d-divide-critical-subtle-inverted` | --dco: var(--dt-color-border-critical-subtle-inverted-a); border-color: oklch(from var(--dt-color-border-critical-subtle-inverted) l c h / var(--dco)) !important |
| `d-divide-default` | --dco: var(--dt-color-border-default-a); border-color: oklch(from var(--dt-color-border-default) l c h / var(--dco)) !important |
| `d-divide-default-inverted` | --dco: var(--dt-color-border-default-inverted-a); border-color: oklch(from var(--dt-color-border-default-inverted) l c h / var(--dco)) !important |
| `d-divide-focus` | --dco: var(--dt-color-border-focus-a); border-color: oklch(from var(--dt-color-border-focus) l c h / var(--dco)) !important |
| `d-divide-gold-100` | --dco: var(--dt-color-gold-100-a); border-color: oklch(from var(--dt-color-gold-100) l c h / var(--dco)) !important |
| `d-divide-gold-1000` | --dco: var(--dt-color-gold-1000-a); border-color: oklch(from var(--dt-color-gold-1000) l c h / var(--dco)) !important |
| `d-divide-gold-200` | --dco: var(--dt-color-gold-200-a); border-color: oklch(from var(--dt-color-gold-200) l c h / var(--dco)) !important |
| `d-divide-gold-300` | --dco: var(--dt-color-gold-300-a); border-color: oklch(from var(--dt-color-gold-300) l c h / var(--dco)) !important |
| `d-divide-gold-350` | --dco: var(--dt-color-gold-350-a); border-color: oklch(from var(--dt-color-gold-350) l c h / var(--dco)) !important |
| `d-divide-gold-400` | --dco: var(--dt-color-gold-400-a); border-color: oklch(from var(--dt-color-gold-400) l c h / var(--dco)) !important |
| `d-divide-gold-450` | --dco: var(--dt-color-gold-450-a); border-color: oklch(from var(--dt-color-gold-450) l c h / var(--dco)) !important |
| `d-divide-gold-50` | --dco: var(--dt-color-gold-50-a); border-color: oklch(from var(--dt-color-gold-50) l c h / var(--dco)) !important |
| `d-divide-gold-500` | --dco: var(--dt-color-gold-500-a); border-color: oklch(from var(--dt-color-gold-500) l c h / var(--dco)) !important |
| `d-divide-gold-600` | --dco: var(--dt-color-gold-600-a); border-color: oklch(from var(--dt-color-gold-600) l c h / var(--dco)) !important |
| `d-divide-gold-700` | --dco: var(--dt-color-gold-700-a); border-color: oklch(from var(--dt-color-gold-700) l c h / var(--dco)) !important |
| `d-divide-gold-900` | --dco: var(--dt-color-gold-900-a); border-color: oklch(from var(--dt-color-gold-900) l c h / var(--dco)) !important |
| `d-divide-green-100` | --dco: var(--dt-color-green-100-a); border-color: oklch(from var(--dt-color-green-100) l c h / var(--dco)) !important |
| `d-divide-green-1000` | --dco: var(--dt-color-green-1000-a); border-color: oklch(from var(--dt-color-green-1000) l c h / var(--dco)) !important |
| `d-divide-green-200` | --dco: var(--dt-color-green-200-a); border-color: oklch(from var(--dt-color-green-200) l c h / var(--dco)) !important |
| `d-divide-green-300` | --dco: var(--dt-color-green-300-a); border-color: oklch(from var(--dt-color-green-300) l c h / var(--dco)) !important |
| `d-divide-green-350` | --dco: var(--dt-color-green-350-a); border-color: oklch(from var(--dt-color-green-350) l c h / var(--dco)) !important |
| `d-divide-green-400` | --dco: var(--dt-color-green-400-a); border-color: oklch(from var(--dt-color-green-400) l c h / var(--dco)) !important |
| `d-divide-green-425` | --dco: var(--dt-color-green-425-a); border-color: oklch(from var(--dt-color-green-425) l c h / var(--dco)) !important |
| `d-divide-green-475` | --dco: var(--dt-color-green-475-a); border-color: oklch(from var(--dt-color-green-475) l c h / var(--dco)) !important |
| `d-divide-green-50` | --dco: var(--dt-color-green-50-a); border-color: oklch(from var(--dt-color-green-50) l c h / var(--dco)) !important |
| `d-divide-green-500` | --dco: var(--dt-color-green-500-a); border-color: oklch(from var(--dt-color-green-500) l c h / var(--dco)) !important |
| `d-divide-green-600` | --dco: var(--dt-color-green-600-a); border-color: oklch(from var(--dt-color-green-600) l c h / var(--dco)) !important |
| `d-divide-green-900` | --dco: var(--dt-color-green-900-a); border-color: oklch(from var(--dt-color-green-900) l c h / var(--dco)) !important |
| `d-divide-indigo-100` | --dco: var(--dt-color-indigo-100-a); border-color: oklch(from var(--dt-color-indigo-100) l c h / var(--dco)) !important |
| `d-divide-indigo-1000` | --dco: var(--dt-color-indigo-1000-a); border-color: oklch(from var(--dt-color-indigo-1000) l c h / var(--dco)) !important |
| `d-divide-indigo-200` | --dco: var(--dt-color-indigo-200-a); border-color: oklch(from var(--dt-color-indigo-200) l c h / var(--dco)) !important |
| `d-divide-indigo-300` | --dco: var(--dt-color-indigo-300-a); border-color: oklch(from var(--dt-color-indigo-300) l c h / var(--dco)) !important |
| `d-divide-indigo-400` | --dco: var(--dt-color-indigo-400-a); border-color: oklch(from var(--dt-color-indigo-400) l c h / var(--dco)) !important |
| `d-divide-indigo-50` | --dco: var(--dt-color-indigo-50-a); border-color: oklch(from var(--dt-color-indigo-50) l c h / var(--dco)) !important |
| `d-divide-indigo-500` | --dco: var(--dt-color-indigo-500-a); border-color: oklch(from var(--dt-color-indigo-500) l c h / var(--dco)) !important |
| `d-divide-indigo-600` | --dco: var(--dt-color-indigo-600-a); border-color: oklch(from var(--dt-color-indigo-600) l c h / var(--dco)) !important |
| `d-divide-indigo-700` | --dco: var(--dt-color-indigo-700-a); border-color: oklch(from var(--dt-color-indigo-700) l c h / var(--dco)) !important |
| `d-divide-indigo-800` | --dco: var(--dt-color-indigo-800-a); border-color: oklch(from var(--dt-color-indigo-800) l c h / var(--dco)) !important |
| `d-divide-indigo-900` | --dco: var(--dt-color-indigo-900-a); border-color: oklch(from var(--dt-color-indigo-900) l c h / var(--dco)) !important |
| `d-divide-indigo-950` | --dco: var(--dt-color-indigo-950-a); border-color: oklch(from var(--dt-color-indigo-950) l c h / var(--dco)) !important |
| `d-divide-magenta-100` | --dco: var(--dt-color-magenta-100-a); border-color: oklch(from var(--dt-color-magenta-100) l c h / var(--dco)) !important |
| `d-divide-magenta-1000` | --dco: var(--dt-color-magenta-1000-a); border-color: oklch(from var(--dt-color-magenta-1000) l c h / var(--dco)) !important |
| `d-divide-magenta-200` | --dco: var(--dt-color-magenta-200-a); border-color: oklch(from var(--dt-color-magenta-200) l c h / var(--dco)) !important |
| `d-divide-magenta-250` | --dco: var(--dt-color-magenta-250-a); border-color: oklch(from var(--dt-color-magenta-250) l c h / var(--dco)) !important |
| `d-divide-magenta-300` | --dco: var(--dt-color-magenta-300-a); border-color: oklch(from var(--dt-color-magenta-300) l c h / var(--dco)) !important |
| `d-divide-magenta-400` | --dco: var(--dt-color-magenta-400-a); border-color: oklch(from var(--dt-color-magenta-400) l c h / var(--dco)) !important |
| `d-divide-magenta-425` | --dco: var(--dt-color-magenta-425-a); border-color: oklch(from var(--dt-color-magenta-425) l c h / var(--dco)) !important |
| `d-divide-magenta-475` | --dco: var(--dt-color-magenta-475-a); border-color: oklch(from var(--dt-color-magenta-475) l c h / var(--dco)) !important |
| `d-divide-magenta-50` | --dco: var(--dt-color-magenta-50-a); border-color: oklch(from var(--dt-color-magenta-50) l c h / var(--dco)) !important |
| `d-divide-magenta-500` | --dco: var(--dt-color-magenta-500-a); border-color: oklch(from var(--dt-color-magenta-500) l c h / var(--dco)) !important |
| `d-divide-magenta-600` | --dco: var(--dt-color-magenta-600-a); border-color: oklch(from var(--dt-color-magenta-600) l c h / var(--dco)) !important |
| `d-divide-magenta-900` | --dco: var(--dt-color-magenta-900-a); border-color: oklch(from var(--dt-color-magenta-900) l c h / var(--dco)) !important |
| `d-divide-moderate` | --dco: var(--dt-color-border-moderate-a); border-color: oklch(from var(--dt-color-border-moderate) l c h / var(--dco)) !important |
| `d-divide-moderate-inverted` | --dco: var(--dt-color-border-moderate-inverted-a); border-color: oklch(from var(--dt-color-border-moderate-inverted) l c h / var(--dco)) !important |
| `d-divide-neutral-black` | --dco: var(--dt-color-neutral-black-a); border-color: oklch(from var(--dt-color-neutral-black) l c h / var(--dco)) !important |
| `d-divide-neutral-transparent` | --dco: var(--dt-color-neutral-transparent-a); border-color: oklch(from var(--dt-color-neutral-transparent) l c h / var(--dco)) !important |
| `d-divide-neutral-white` | --dco: var(--dt-color-neutral-white-a); border-color: oklch(from var(--dt-color-neutral-white) l c h / var(--dco)) !important |
| `d-divide-olive-100` | --dco: var(--dt-color-olive-100-a); border-color: oklch(from var(--dt-color-olive-100) l c h / var(--dco)) !important |
| `d-divide-olive-1000` | --dco: var(--dt-color-olive-1000-a); border-color: oklch(from var(--dt-color-olive-1000) l c h / var(--dco)) !important |
| `d-divide-olive-200` | --dco: var(--dt-color-olive-200-a); border-color: oklch(from var(--dt-color-olive-200) l c h / var(--dco)) !important |
| `d-divide-olive-300` | --dco: var(--dt-color-olive-300-a); border-color: oklch(from var(--dt-color-olive-300) l c h / var(--dco)) !important |
| `d-divide-olive-400` | --dco: var(--dt-color-olive-400-a); border-color: oklch(from var(--dt-color-olive-400) l c h / var(--dco)) !important |
| `d-divide-olive-50` | --dco: var(--dt-color-olive-50-a); border-color: oklch(from var(--dt-color-olive-50) l c h / var(--dco)) !important |
| `d-divide-olive-500` | --dco: var(--dt-color-olive-500-a); border-color: oklch(from var(--dt-color-olive-500) l c h / var(--dco)) !important |
| `d-divide-olive-600` | --dco: var(--dt-color-olive-600-a); border-color: oklch(from var(--dt-color-olive-600) l c h / var(--dco)) !important |
| `d-divide-olive-700` | --dco: var(--dt-color-olive-700-a); border-color: oklch(from var(--dt-color-olive-700) l c h / var(--dco)) !important |
| `d-divide-olive-800` | --dco: var(--dt-color-olive-800-a); border-color: oklch(from var(--dt-color-olive-800) l c h / var(--dco)) !important |
| `d-divide-olive-900` | --dco: var(--dt-color-olive-900-a); border-color: oklch(from var(--dt-color-olive-900) l c h / var(--dco)) !important |
| `d-divide-olive-950` | --dco: var(--dt-color-olive-950-a); border-color: oklch(from var(--dt-color-olive-950) l c h / var(--dco)) !important |
| `d-divide-purple-100` | --dco: var(--dt-color-purple-100-a); border-color: oklch(from var(--dt-color-purple-100) l c h / var(--dco)) !important |
| `d-divide-purple-1000` | --dco: var(--dt-color-purple-1000-a); border-color: oklch(from var(--dt-color-purple-1000) l c h / var(--dco)) !important |
| `d-divide-purple-200` | --dco: var(--dt-color-purple-200-a); border-color: oklch(from var(--dt-color-purple-200) l c h / var(--dco)) !important |
| `d-divide-purple-250` | --dco: var(--dt-color-purple-250-a); border-color: oklch(from var(--dt-color-purple-250) l c h / var(--dco)) !important |
| `d-divide-purple-300` | --dco: var(--dt-color-purple-300-a); border-color: oklch(from var(--dt-color-purple-300) l c h / var(--dco)) !important |
| `d-divide-purple-350` | --dco: var(--dt-color-purple-350-a); border-color: oklch(from var(--dt-color-purple-350) l c h / var(--dco)) !important |
| `d-divide-purple-400` | --dco: var(--dt-color-purple-400-a); border-color: oklch(from var(--dt-color-purple-400) l c h / var(--dco)) !important |
| `d-divide-purple-450` | --dco: var(--dt-color-purple-450-a); border-color: oklch(from var(--dt-color-purple-450) l c h / var(--dco)) !important |
| `d-divide-purple-50` | --dco: var(--dt-color-purple-50-a); border-color: oklch(from var(--dt-color-purple-50) l c h / var(--dco)) !important |
| `d-divide-purple-500` | --dco: var(--dt-color-purple-500-a); border-color: oklch(from var(--dt-color-purple-500) l c h / var(--dco)) !important |
| `d-divide-purple-550` | --dco: var(--dt-color-purple-550-a); border-color: oklch(from var(--dt-color-purple-550) l c h / var(--dco)) !important |
| `d-divide-purple-600` | --dco: var(--dt-color-purple-600-a); border-color: oklch(from var(--dt-color-purple-600) l c h / var(--dco)) !important |
| `d-divide-red-100` | --dco: var(--dt-color-red-100-a); border-color: oklch(from var(--dt-color-red-100) l c h / var(--dco)) !important |
| `d-divide-red-1000` | --dco: var(--dt-color-red-1000-a); border-color: oklch(from var(--dt-color-red-1000) l c h / var(--dco)) !important |
| `d-divide-red-200` | --dco: var(--dt-color-red-200-a); border-color: oklch(from var(--dt-color-red-200) l c h / var(--dco)) !important |
| `d-divide-red-300` | --dco: var(--dt-color-red-300-a); border-color: oklch(from var(--dt-color-red-300) l c h / var(--dco)) !important |
| `d-divide-red-350` | --dco: var(--dt-color-red-350-a); border-color: oklch(from var(--dt-color-red-350) l c h / var(--dco)) !important |
| `d-divide-red-400` | --dco: var(--dt-color-red-400-a); border-color: oklch(from var(--dt-color-red-400) l c h / var(--dco)) !important |
| `d-divide-red-450` | --dco: var(--dt-color-red-450-a); border-color: oklch(from var(--dt-color-red-450) l c h / var(--dco)) !important |
| `d-divide-red-50` | --dco: var(--dt-color-red-50-a); border-color: oklch(from var(--dt-color-red-50) l c h / var(--dco)) !important |
| `d-divide-red-500` | --dco: var(--dt-color-red-500-a); border-color: oklch(from var(--dt-color-red-500) l c h / var(--dco)) !important |
| `d-divide-red-600` | --dco: var(--dt-color-red-600-a); border-color: oklch(from var(--dt-color-red-600) l c h / var(--dco)) !important |
| `d-divide-red-700` | --dco: var(--dt-color-red-700-a); border-color: oklch(from var(--dt-color-red-700) l c h / var(--dco)) !important |
| `d-divide-red-900` | --dco: var(--dt-color-red-900-a); border-color: oklch(from var(--dt-color-red-900) l c h / var(--dco)) !important |
| `d-divide-subtle` | --dco: var(--dt-color-border-subtle-a); border-color: oklch(from var(--dt-color-border-subtle) l c h / var(--dco)) !important |
| `d-divide-subtle-inverted` | --dco: var(--dt-color-border-subtle-inverted-a); border-color: oklch(from var(--dt-color-border-subtle-inverted) l c h / var(--dco)) !important |
| `d-divide-success` | --dco: var(--dt-color-border-success-a); border-color: oklch(from var(--dt-color-border-success) l c h / var(--dco)) !important |
| `d-divide-success-inverted` | --dco: var(--dt-color-border-success-inverted-a); border-color: oklch(from var(--dt-color-border-success-inverted) l c h / var(--dco)) !important |
| `d-divide-success-strong` | --dco: var(--dt-color-border-success-strong-a); border-color: oklch(from var(--dt-color-border-success-strong) l c h / var(--dco)) !important |
| `d-divide-success-strong-inverted` | --dco: var(--dt-color-border-success-strong-inverted-a); border-color: oklch(from var(--dt-color-border-success-strong-inverted) l c h / var(--dco)) !important |
| `d-divide-success-subtle` | --dco: var(--dt-color-border-success-subtle-a); border-color: oklch(from var(--dt-color-border-success-subtle) l c h / var(--dco)) !important |
| `d-divide-success-subtle-inverted` | --dco: var(--dt-color-border-success-subtle-inverted-a); border-color: oklch(from var(--dt-color-border-success-subtle-inverted) l c h / var(--dco)) !important |
| `d-divide-tan-100` | --dco: var(--dt-color-tan-100-a); border-color: oklch(from var(--dt-color-tan-100) l c h / var(--dco)) !important |
| `d-divide-tan-1000` | --dco: var(--dt-color-tan-1000-a); border-color: oklch(from var(--dt-color-tan-1000) l c h / var(--dco)) !important |
| `d-divide-tan-200` | --dco: var(--dt-color-tan-200-a); border-color: oklch(from var(--dt-color-tan-200) l c h / var(--dco)) !important |
| `d-divide-tan-300` | --dco: var(--dt-color-tan-300-a); border-color: oklch(from var(--dt-color-tan-300) l c h / var(--dco)) !important |
| `d-divide-tan-400` | --dco: var(--dt-color-tan-400-a); border-color: oklch(from var(--dt-color-tan-400) l c h / var(--dco)) !important |
| `d-divide-tan-50` | --dco: var(--dt-color-tan-50-a); border-color: oklch(from var(--dt-color-tan-50) l c h / var(--dco)) !important |
| `d-divide-tan-500` | --dco: var(--dt-color-tan-500-a); border-color: oklch(from var(--dt-color-tan-500) l c h / var(--dco)) !important |
| `d-divide-tan-600` | --dco: var(--dt-color-tan-600-a); border-color: oklch(from var(--dt-color-tan-600) l c h / var(--dco)) !important |
| `d-divide-tan-700` | --dco: var(--dt-color-tan-700-a); border-color: oklch(from var(--dt-color-tan-700) l c h / var(--dco)) !important |
| `d-divide-tan-800` | --dco: var(--dt-color-tan-800-a); border-color: oklch(from var(--dt-color-tan-800) l c h / var(--dco)) !important |
| `d-divide-tan-900` | --dco: var(--dt-color-tan-900-a); border-color: oklch(from var(--dt-color-tan-900) l c h / var(--dco)) !important |
| `d-divide-tan-950` | --dco: var(--dt-color-tan-950-a); border-color: oklch(from var(--dt-color-tan-950) l c h / var(--dco)) !important |
| `d-divide-teal-100` | --dco: var(--dt-color-teal-100-a); border-color: oklch(from var(--dt-color-teal-100) l c h / var(--dco)) !important |
| `d-divide-teal-1000` | --dco: var(--dt-color-teal-1000-a); border-color: oklch(from var(--dt-color-teal-1000) l c h / var(--dco)) !important |
| `d-divide-teal-200` | --dco: var(--dt-color-teal-200-a); border-color: oklch(from var(--dt-color-teal-200) l c h / var(--dco)) !important |
| `d-divide-teal-300` | --dco: var(--dt-color-teal-300-a); border-color: oklch(from var(--dt-color-teal-300) l c h / var(--dco)) !important |
| `d-divide-teal-400` | --dco: var(--dt-color-teal-400-a); border-color: oklch(from var(--dt-color-teal-400) l c h / var(--dco)) !important |
| `d-divide-teal-50` | --dco: var(--dt-color-teal-50-a); border-color: oklch(from var(--dt-color-teal-50) l c h / var(--dco)) !important |
| `d-divide-teal-500` | --dco: var(--dt-color-teal-500-a); border-color: oklch(from var(--dt-color-teal-500) l c h / var(--dco)) !important |
| `d-divide-teal-600` | --dco: var(--dt-color-teal-600-a); border-color: oklch(from var(--dt-color-teal-600) l c h / var(--dco)) !important |
| `d-divide-teal-700` | --dco: var(--dt-color-teal-700-a); border-color: oklch(from var(--dt-color-teal-700) l c h / var(--dco)) !important |
| `d-divide-teal-800` | --dco: var(--dt-color-teal-800-a); border-color: oklch(from var(--dt-color-teal-800) l c h / var(--dco)) !important |
| `d-divide-teal-900` | --dco: var(--dt-color-teal-900-a); border-color: oklch(from var(--dt-color-teal-900) l c h / var(--dco)) !important |
| `d-divide-teal-950` | --dco: var(--dt-color-teal-950-a); border-color: oklch(from var(--dt-color-teal-950) l c h / var(--dco)) !important |
| `d-divide-warning` | --dco: var(--dt-color-border-warning-a); border-color: oklch(from var(--dt-color-border-warning) l c h / var(--dco)) !important |
| `d-divide-warning-inverted` | --dco: var(--dt-color-border-warning-inverted-a); border-color: oklch(from var(--dt-color-border-warning-inverted) l c h / var(--dco)) !important |
| `d-divide-warning-strong` | --dco: var(--dt-color-border-warning-strong-a); border-color: oklch(from var(--dt-color-border-warning-strong) l c h / var(--dco)) !important |
| `d-divide-warning-strong-inverted` | --dco: var(--dt-color-border-warning-strong-inverted-a); border-color: oklch(from var(--dt-color-border-warning-strong-inverted) l c h / var(--dco)) !important |
| `d-divide-warning-subtle` | --dco: var(--dt-color-border-warning-subtle-a); border-color: oklch(from var(--dt-color-border-warning-subtle) l c h / var(--dco)) !important |
| `d-divide-warning-subtle-inverted` | --dco: var(--dt-color-border-warning-subtle-inverted-a); border-color: oklch(from var(--dt-color-border-warning-subtle-inverted) l c h / var(--dco)) !important |
| `d-divide-x` | --divide-x-reverse: 0; -webkit-border-end: calc(1px * var(--divide-x-reverse)) solid var(--dt-color-border-default) !important; border-inline-end: calc(1px * var(--divide-x-reverse)) solid var(--dt-color-border-default) !important; -webkit-border-start: calc(1px * (1 - var(--divide-x-reverse))) solid var(--dt-color-border-default) !important; border-inline-start: calc(1px * (1 - var(--divide-x-reverse))) solid var(--dt-color-border-default) !important |
| `d-divide-x-reverse` | --divide-x-reverse: 1 |
| `d-divide-x0` | --divide-x-reverse: 0; -webkit-border-end: calc(0 * var(--divide-x-reverse)) solid var(--dt-color-border-default) !important; border-inline-end: calc(0 * var(--divide-x-reverse)) solid var(--dt-color-border-default) !important; -webkit-border-start: calc(0 * (1 - var(--divide-x-reverse))) solid var(--dt-color-border-default) !important; border-inline-start: calc(0 * (1 - var(--divide-x-reverse))) solid var(--dt-color-border-default) !important |
| `d-divide-x2` | --divide-x-reverse: 0; -webkit-border-end: calc(2px * var(--divide-x-reverse)) solid var(--dt-color-border-default) !important; border-inline-end: calc(2px * var(--divide-x-reverse)) solid var(--dt-color-border-default) !important; -webkit-border-start: calc(2px * (1 - var(--divide-x-reverse))) solid var(--dt-color-border-default) !important; border-inline-start: calc(2px * (1 - var(--divide-x-reverse))) solid var(--dt-color-border-default) !important |
| `d-divide-x4` | --divide-x-reverse: 0; -webkit-border-end: calc(4px * var(--divide-x-reverse)) solid var(--dt-color-border-default) !important; border-inline-end: calc(4px * var(--divide-x-reverse)) solid var(--dt-color-border-default) !important; -webkit-border-start: calc(4px * (1 - var(--divide-x-reverse))) solid var(--dt-color-border-default) !important; border-inline-start: calc(4px * (1 - var(--divide-x-reverse))) solid var(--dt-color-border-default) !important |
| `d-divide-y` | --divide-y-reverse: 0; -webkit-border-before: calc(1px * (1 - var(--divide-y-reverse))) solid var(--dt-color-border-default) !important; border-block-start: calc(1px * (1 - var(--divide-y-reverse))) solid var(--dt-color-border-default) !important; -webkit-border-after: calc(1px * var(--divide-y-reverse)) solid var(--dt-color-border-default) !important; border-block-end: calc(1px * var(--divide-y-reverse)) solid var(--dt-color-border-default) !important |
| `d-divide-y-reverse` | --divide-y-reverse: 1 |
| `d-divide-y0` | --divide-y-reverse: 0; -webkit-border-before: calc(0 * (1 - var(--divide-y-reverse))) solid var(--dt-color-border-default) !important; border-block-start: calc(0 * (1 - var(--divide-y-reverse))) solid var(--dt-color-border-default) !important; -webkit-border-after: calc(0 * var(--divide-y-reverse)) solid var(--dt-color-border-default) !important; border-block-end: calc(0 * var(--divide-y-reverse)) solid var(--dt-color-border-default) !important |
| `d-divide-y2` | --divide-y-reverse: 0; -webkit-border-before: calc(2px * (1 - var(--divide-y-reverse))) solid var(--dt-color-border-default) !important; border-block-start: calc(2px * (1 - var(--divide-y-reverse))) solid var(--dt-color-border-default) !important; -webkit-border-after: calc(2px * var(--divide-y-reverse)) solid var(--dt-color-border-default) !important; border-block-end: calc(2px * var(--divide-y-reverse)) solid var(--dt-color-border-default) !important |
| `d-divide-y4` | --divide-y-reverse: 0; -webkit-border-before: calc(4px * (1 - var(--divide-y-reverse))) solid var(--dt-color-border-default) !important; border-block-start: calc(4px * (1 - var(--divide-y-reverse))) solid var(--dt-color-border-default) !important; -webkit-border-after: calc(4px * var(--divide-y-reverse)) solid var(--dt-color-border-default) !important; border-block-end: calc(4px * var(--divide-y-reverse)) solid var(--dt-color-border-default) !important |
