# Font Color

Utilities to change an element's font-color.

- **Keywords**: text color, foreground color, font colour

> **Use DtText in favor of CSS Utilities.** Reach for the [DtText](../../components/text.md) component before considering any typography utility.

## Use DtText's `tone` prop

Use [DtText's](../../components/text.md#tone) `tone` prop to declare the text's tone, which will map to a foreground color. By default, the tone is inherited from its parent.

```vue
<dt-text tone="{{tone}}">...</dt-text>
```

## Usage

Use `d-fc-{color}` to change an element's text color.

```html
<p class="d-fc-critical">...</p>
```

## Hover

Use `h:d-fc-{color}` to change an element's text color `:hover` state.

```html

<dt-button kind="unstyled" class="d-fc-critical h:d-fc-success">Hover over me</dt-button>
```

## Focus

Use `f:d-fc-{color}` to change an element's text color `:focus` and `:focus-within` state.

```html

<dt-button kind="unstyled" class="d-fc-critical f:d-fc-success">Focus me</dt-button>
```

## Focus Visible

Use `fv:d-fc-{color}` to change an element's text color on `:focus-visible` state [only when focused by keyboard].

```html

<dt-button kind="unstyled" class="d-fc-critical fv:d-fc-success">Keyboard focus me</dt-button>
```

## Changing Opacity

Use `d-fco{n}` to change an element's text color opacity. You can also change font color opacity on `:hover`, `:focus`,
`:focus-visible` by using the respective `h:d-fco{n}`, `f:d-fco{n}`, `fv:d-fco{n}` prefixes.

```html
<p class="d-fc-critical">...</p>
<p class="d-fc-critical d-fco99">...</p>
<p class="d-fc-critical d-fco95">...</p>
<p class="d-fc-critical d-fco90">...</p>
<p class="d-fc-critical d-fco75">...</p>
<p class="d-fc-critical d-fco50">...</p>
<p class="d-fc-critical d-fco25">...</p>
<p class="d-fc-critical d-fco10">...</p>
<p class="d-fc-critical d-fco0">...</p>
```

## Classes

| Class | Output |
| --- | --- |
| `d-fc-berry-100` | --fco: var(--dt-color-berry-100-a); color: oklch(from var(--dt-color-berry-100) l c h / var(--fco)) !important |
| `d-fc-berry-1000` | --fco: var(--dt-color-berry-1000-a); color: oklch(from var(--dt-color-berry-1000) l c h / var(--fco)) !important |
| `d-fc-berry-200` | --fco: var(--dt-color-berry-200-a); color: oklch(from var(--dt-color-berry-200) l c h / var(--fco)) !important |
| `d-fc-berry-300` | --fco: var(--dt-color-berry-300-a); color: oklch(from var(--dt-color-berry-300) l c h / var(--fco)) !important |
| `d-fc-berry-400` | --fco: var(--dt-color-berry-400-a); color: oklch(from var(--dt-color-berry-400) l c h / var(--fco)) !important |
| `d-fc-berry-50` | --fco: var(--dt-color-berry-50-a); color: oklch(from var(--dt-color-berry-50) l c h / var(--fco)) !important |
| `d-fc-berry-500` | --fco: var(--dt-color-berry-500-a); color: oklch(from var(--dt-color-berry-500) l c h / var(--fco)) !important |
| `d-fc-berry-600` | --fco: var(--dt-color-berry-600-a); color: oklch(from var(--dt-color-berry-600) l c h / var(--fco)) !important |
| `d-fc-berry-700` | --fco: var(--dt-color-berry-700-a); color: oklch(from var(--dt-color-berry-700) l c h / var(--fco)) !important |
| `d-fc-berry-800` | --fco: var(--dt-color-berry-800-a); color: oklch(from var(--dt-color-berry-800) l c h / var(--fco)) !important |
| `d-fc-berry-900` | --fco: var(--dt-color-berry-900-a); color: oklch(from var(--dt-color-berry-900) l c h / var(--fco)) !important |
| `d-fc-berry-950` | --fco: var(--dt-color-berry-950-a); color: oklch(from var(--dt-color-berry-950) l c h / var(--fco)) !important |
| `d-fc-black-100` | --fco: var(--dt-color-black-100-a); color: oklch(from var(--dt-color-black-100) l c h / var(--fco)) !important |
| `d-fc-black-1000` | --fco: var(--dt-color-black-1000-a); color: oklch(from var(--dt-color-black-1000) l c h / var(--fco)) !important |
| `d-fc-black-200` | --fco: var(--dt-color-black-200-a); color: oklch(from var(--dt-color-black-200) l c h / var(--fco)) !important |
| `d-fc-black-300` | --fco: var(--dt-color-black-300-a); color: oklch(from var(--dt-color-black-300) l c h / var(--fco)) !important |
| `d-fc-black-400` | --fco: var(--dt-color-black-400-a); color: oklch(from var(--dt-color-black-400) l c h / var(--fco)) !important |
| `d-fc-black-50` | --fco: var(--dt-color-black-50-a); color: oklch(from var(--dt-color-black-50) l c h / var(--fco)) !important |
| `d-fc-black-500` | --fco: var(--dt-color-black-500-a); color: oklch(from var(--dt-color-black-500) l c h / var(--fco)) !important |
| `d-fc-black-600` | --fco: var(--dt-color-black-600-a); color: oklch(from var(--dt-color-black-600) l c h / var(--fco)) !important |
| `d-fc-black-700` | --fco: var(--dt-color-black-700-a); color: oklch(from var(--dt-color-black-700) l c h / var(--fco)) !important |
| `d-fc-black-800` | --fco: var(--dt-color-black-800-a); color: oklch(from var(--dt-color-black-800) l c h / var(--fco)) !important |
| `d-fc-black-900` | --fco: var(--dt-color-black-900-a); color: oklch(from var(--dt-color-black-900) l c h / var(--fco)) !important |
| `d-fc-black-950` | --fco: var(--dt-color-black-950-a); color: oklch(from var(--dt-color-black-950) l c h / var(--fco)) !important |
| `d-fc-blue-100` | --fco: var(--dt-color-blue-100-a); color: oklch(from var(--dt-color-blue-100) l c h / var(--fco)) !important |
| `d-fc-blue-1000` | --fco: var(--dt-color-blue-1000-a); color: oklch(from var(--dt-color-blue-1000) l c h / var(--fco)) !important |
| `d-fc-blue-200` | --fco: var(--dt-color-blue-200-a); color: oklch(from var(--dt-color-blue-200) l c h / var(--fco)) !important |
| `d-fc-blue-300` | --fco: var(--dt-color-blue-300-a); color: oklch(from var(--dt-color-blue-300) l c h / var(--fco)) !important |
| `d-fc-blue-400` | --fco: var(--dt-color-blue-400-a); color: oklch(from var(--dt-color-blue-400) l c h / var(--fco)) !important |
| `d-fc-blue-425` | --fco: var(--dt-color-blue-425-a); color: oklch(from var(--dt-color-blue-425) l c h / var(--fco)) !important |
| `d-fc-blue-450` | --fco: var(--dt-color-blue-450-a); color: oklch(from var(--dt-color-blue-450) l c h / var(--fco)) !important |
| `d-fc-blue-475` | --fco: var(--dt-color-blue-475-a); color: oklch(from var(--dt-color-blue-475) l c h / var(--fco)) !important |
| `d-fc-blue-50` | --fco: var(--dt-color-blue-50-a); color: oklch(from var(--dt-color-blue-50) l c h / var(--fco)) !important |
| `d-fc-blue-500` | --fco: var(--dt-color-blue-500-a); color: oklch(from var(--dt-color-blue-500) l c h / var(--fco)) !important |
| `d-fc-blue-600` | --fco: var(--dt-color-blue-600-a); color: oklch(from var(--dt-color-blue-600) l c h / var(--fco)) !important |
| `d-fc-blue-900` | --fco: var(--dt-color-blue-900-a); color: oklch(from var(--dt-color-blue-900) l c h / var(--fco)) !important |
| `d-fc-coral-100` | --fco: var(--dt-color-coral-100-a); color: oklch(from var(--dt-color-coral-100) l c h / var(--fco)) !important |
| `d-fc-coral-1000` | --fco: var(--dt-color-coral-1000-a); color: oklch(from var(--dt-color-coral-1000) l c h / var(--fco)) !important |
| `d-fc-coral-200` | --fco: var(--dt-color-coral-200-a); color: oklch(from var(--dt-color-coral-200) l c h / var(--fco)) !important |
| `d-fc-coral-300` | --fco: var(--dt-color-coral-300-a); color: oklch(from var(--dt-color-coral-300) l c h / var(--fco)) !important |
| `d-fc-coral-400` | --fco: var(--dt-color-coral-400-a); color: oklch(from var(--dt-color-coral-400) l c h / var(--fco)) !important |
| `d-fc-coral-50` | --fco: var(--dt-color-coral-50-a); color: oklch(from var(--dt-color-coral-50) l c h / var(--fco)) !important |
| `d-fc-coral-500` | --fco: var(--dt-color-coral-500-a); color: oklch(from var(--dt-color-coral-500) l c h / var(--fco)) !important |
| `d-fc-coral-600` | --fco: var(--dt-color-coral-600-a); color: oklch(from var(--dt-color-coral-600) l c h / var(--fco)) !important |
| `d-fc-coral-700` | --fco: var(--dt-color-coral-700-a); color: oklch(from var(--dt-color-coral-700) l c h / var(--fco)) !important |
| `d-fc-coral-800` | --fco: var(--dt-color-coral-800-a); color: oklch(from var(--dt-color-coral-800) l c h / var(--fco)) !important |
| `d-fc-coral-900` | --fco: var(--dt-color-coral-900-a); color: oklch(from var(--dt-color-coral-900) l c h / var(--fco)) !important |
| `d-fc-coral-950` | --fco: var(--dt-color-coral-950-a); color: oklch(from var(--dt-color-coral-950) l c h / var(--fco)) !important |
| `d-fc-critical` | --fco: var(--dt-color-foreground-critical-a); color: oklch(from var(--dt-color-foreground-critical) l c h / var(--fco)) !important |
| `d-fc-critical-inverted` | --fco: var(--dt-color-foreground-critical-inverted-a); color: oklch(from var(--dt-color-foreground-critical-inverted) l c h / var(--fco)) !important |
| `d-fc-critical-strong` | --fco: var(--dt-color-foreground-critical-strong-a); color: oklch(from var(--dt-color-foreground-critical-strong) l c h / var(--fco)) !important |
| `d-fc-critical-strong-inverted` | --fco: var(--dt-color-foreground-critical-strong-inverted-a); color: oklch(from var(--dt-color-foreground-critical-strong-inverted) l c h / var(--fco)) !important |
| `d-fc-current` | color: currentColor !important |
| `d-fc-disabled` | --fco: var(--dt-color-foreground-disabled-a); color: oklch(from var(--dt-color-foreground-disabled) l c h / var(--fco)) !important |
| `d-fc-disabled-inverted` | --fco: var(--dt-color-foreground-disabled-inverted-a); color: oklch(from var(--dt-color-foreground-disabled-inverted) l c h / var(--fco)) !important |
| `d-fc-gold-100` | --fco: var(--dt-color-gold-100-a); color: oklch(from var(--dt-color-gold-100) l c h / var(--fco)) !important |
| `d-fc-gold-1000` | --fco: var(--dt-color-gold-1000-a); color: oklch(from var(--dt-color-gold-1000) l c h / var(--fco)) !important |
| `d-fc-gold-200` | --fco: var(--dt-color-gold-200-a); color: oklch(from var(--dt-color-gold-200) l c h / var(--fco)) !important |
| `d-fc-gold-300` | --fco: var(--dt-color-gold-300-a); color: oklch(from var(--dt-color-gold-300) l c h / var(--fco)) !important |
| `d-fc-gold-350` | --fco: var(--dt-color-gold-350-a); color: oklch(from var(--dt-color-gold-350) l c h / var(--fco)) !important |
| `d-fc-gold-400` | --fco: var(--dt-color-gold-400-a); color: oklch(from var(--dt-color-gold-400) l c h / var(--fco)) !important |
| `d-fc-gold-450` | --fco: var(--dt-color-gold-450-a); color: oklch(from var(--dt-color-gold-450) l c h / var(--fco)) !important |
| `d-fc-gold-50` | --fco: var(--dt-color-gold-50-a); color: oklch(from var(--dt-color-gold-50) l c h / var(--fco)) !important |
| `d-fc-gold-500` | --fco: var(--dt-color-gold-500-a); color: oklch(from var(--dt-color-gold-500) l c h / var(--fco)) !important |
| `d-fc-gold-600` | --fco: var(--dt-color-gold-600-a); color: oklch(from var(--dt-color-gold-600) l c h / var(--fco)) !important |
| `d-fc-gold-700` | --fco: var(--dt-color-gold-700-a); color: oklch(from var(--dt-color-gold-700) l c h / var(--fco)) !important |
| `d-fc-gold-900` | --fco: var(--dt-color-gold-900-a); color: oklch(from var(--dt-color-gold-900) l c h / var(--fco)) !important |
| `d-fc-green-100` | --fco: var(--dt-color-green-100-a); color: oklch(from var(--dt-color-green-100) l c h / var(--fco)) !important |
| `d-fc-green-1000` | --fco: var(--dt-color-green-1000-a); color: oklch(from var(--dt-color-green-1000) l c h / var(--fco)) !important |
| `d-fc-green-200` | --fco: var(--dt-color-green-200-a); color: oklch(from var(--dt-color-green-200) l c h / var(--fco)) !important |
| `d-fc-green-300` | --fco: var(--dt-color-green-300-a); color: oklch(from var(--dt-color-green-300) l c h / var(--fco)) !important |
| `d-fc-green-350` | --fco: var(--dt-color-green-350-a); color: oklch(from var(--dt-color-green-350) l c h / var(--fco)) !important |
| `d-fc-green-400` | --fco: var(--dt-color-green-400-a); color: oklch(from var(--dt-color-green-400) l c h / var(--fco)) !important |
| `d-fc-green-425` | --fco: var(--dt-color-green-425-a); color: oklch(from var(--dt-color-green-425) l c h / var(--fco)) !important |
| `d-fc-green-475` | --fco: var(--dt-color-green-475-a); color: oklch(from var(--dt-color-green-475) l c h / var(--fco)) !important |
| `d-fc-green-50` | --fco: var(--dt-color-green-50-a); color: oklch(from var(--dt-color-green-50) l c h / var(--fco)) !important |
| `d-fc-green-500` | --fco: var(--dt-color-green-500-a); color: oklch(from var(--dt-color-green-500) l c h / var(--fco)) !important |
| `d-fc-green-600` | --fco: var(--dt-color-green-600-a); color: oklch(from var(--dt-color-green-600) l c h / var(--fco)) !important |
| `d-fc-green-900` | --fco: var(--dt-color-green-900-a); color: oklch(from var(--dt-color-green-900) l c h / var(--fco)) !important |
| `d-fc-indigo-100` | --fco: var(--dt-color-indigo-100-a); color: oklch(from var(--dt-color-indigo-100) l c h / var(--fco)) !important |
| `d-fc-indigo-1000` | --fco: var(--dt-color-indigo-1000-a); color: oklch(from var(--dt-color-indigo-1000) l c h / var(--fco)) !important |
| `d-fc-indigo-200` | --fco: var(--dt-color-indigo-200-a); color: oklch(from var(--dt-color-indigo-200) l c h / var(--fco)) !important |
| `d-fc-indigo-300` | --fco: var(--dt-color-indigo-300-a); color: oklch(from var(--dt-color-indigo-300) l c h / var(--fco)) !important |
| `d-fc-indigo-400` | --fco: var(--dt-color-indigo-400-a); color: oklch(from var(--dt-color-indigo-400) l c h / var(--fco)) !important |
| `d-fc-indigo-50` | --fco: var(--dt-color-indigo-50-a); color: oklch(from var(--dt-color-indigo-50) l c h / var(--fco)) !important |
| `d-fc-indigo-500` | --fco: var(--dt-color-indigo-500-a); color: oklch(from var(--dt-color-indigo-500) l c h / var(--fco)) !important |
| `d-fc-indigo-600` | --fco: var(--dt-color-indigo-600-a); color: oklch(from var(--dt-color-indigo-600) l c h / var(--fco)) !important |
| `d-fc-indigo-700` | --fco: var(--dt-color-indigo-700-a); color: oklch(from var(--dt-color-indigo-700) l c h / var(--fco)) !important |
| `d-fc-indigo-800` | --fco: var(--dt-color-indigo-800-a); color: oklch(from var(--dt-color-indigo-800) l c h / var(--fco)) !important |
| `d-fc-indigo-900` | --fco: var(--dt-color-indigo-900-a); color: oklch(from var(--dt-color-indigo-900) l c h / var(--fco)) !important |
| `d-fc-indigo-950` | --fco: var(--dt-color-indigo-950-a); color: oklch(from var(--dt-color-indigo-950) l c h / var(--fco)) !important |
| `d-fc-magenta-100` | --fco: var(--dt-color-magenta-100-a); color: oklch(from var(--dt-color-magenta-100) l c h / var(--fco)) !important |
| `d-fc-magenta-1000` | --fco: var(--dt-color-magenta-1000-a); color: oklch(from var(--dt-color-magenta-1000) l c h / var(--fco)) !important |
| `d-fc-magenta-200` | --fco: var(--dt-color-magenta-200-a); color: oklch(from var(--dt-color-magenta-200) l c h / var(--fco)) !important |
| `d-fc-magenta-250` | --fco: var(--dt-color-magenta-250-a); color: oklch(from var(--dt-color-magenta-250) l c h / var(--fco)) !important |
| `d-fc-magenta-300` | --fco: var(--dt-color-magenta-300-a); color: oklch(from var(--dt-color-magenta-300) l c h / var(--fco)) !important |
| `d-fc-magenta-400` | --fco: var(--dt-color-magenta-400-a); color: oklch(from var(--dt-color-magenta-400) l c h / var(--fco)) !important |
| `d-fc-magenta-425` | --fco: var(--dt-color-magenta-425-a); color: oklch(from var(--dt-color-magenta-425) l c h / var(--fco)) !important |
| `d-fc-magenta-475` | --fco: var(--dt-color-magenta-475-a); color: oklch(from var(--dt-color-magenta-475) l c h / var(--fco)) !important |
| `d-fc-magenta-50` | --fco: var(--dt-color-magenta-50-a); color: oklch(from var(--dt-color-magenta-50) l c h / var(--fco)) !important |
| `d-fc-magenta-500` | --fco: var(--dt-color-magenta-500-a); color: oklch(from var(--dt-color-magenta-500) l c h / var(--fco)) !important |
| `d-fc-magenta-600` | --fco: var(--dt-color-magenta-600-a); color: oklch(from var(--dt-color-magenta-600) l c h / var(--fco)) !important |
| `d-fc-magenta-900` | --fco: var(--dt-color-magenta-900-a); color: oklch(from var(--dt-color-magenta-900) l c h / var(--fco)) !important |
| `d-fc-muted` | --fco: var(--dt-color-foreground-muted-a); color: oklch(from var(--dt-color-foreground-muted) l c h / var(--fco)) !important |
| `d-fc-muted-inverted` | --fco: var(--dt-color-foreground-muted-inverted-a); color: oklch(from var(--dt-color-foreground-muted-inverted) l c h / var(--fco)) !important |
| `d-fc-neutral-black` | --fco: var(--dt-color-neutral-black-a); color: oklch(from var(--dt-color-neutral-black) l c h / var(--fco)) !important |
| `d-fc-neutral-transparent` | --fco: var(--dt-color-neutral-transparent-a); color: oklch(from var(--dt-color-neutral-transparent) l c h / var(--fco)) !important |
| `d-fc-neutral-white` | --fco: var(--dt-color-neutral-white-a); color: oklch(from var(--dt-color-neutral-white) l c h / var(--fco)) !important |
| `d-fc-olive-100` | --fco: var(--dt-color-olive-100-a); color: oklch(from var(--dt-color-olive-100) l c h / var(--fco)) !important |
| `d-fc-olive-1000` | --fco: var(--dt-color-olive-1000-a); color: oklch(from var(--dt-color-olive-1000) l c h / var(--fco)) !important |
| `d-fc-olive-200` | --fco: var(--dt-color-olive-200-a); color: oklch(from var(--dt-color-olive-200) l c h / var(--fco)) !important |
| `d-fc-olive-300` | --fco: var(--dt-color-olive-300-a); color: oklch(from var(--dt-color-olive-300) l c h / var(--fco)) !important |
| `d-fc-olive-400` | --fco: var(--dt-color-olive-400-a); color: oklch(from var(--dt-color-olive-400) l c h / var(--fco)) !important |
| `d-fc-olive-50` | --fco: var(--dt-color-olive-50-a); color: oklch(from var(--dt-color-olive-50) l c h / var(--fco)) !important |
| `d-fc-olive-500` | --fco: var(--dt-color-olive-500-a); color: oklch(from var(--dt-color-olive-500) l c h / var(--fco)) !important |
| `d-fc-olive-600` | --fco: var(--dt-color-olive-600-a); color: oklch(from var(--dt-color-olive-600) l c h / var(--fco)) !important |
| `d-fc-olive-700` | --fco: var(--dt-color-olive-700-a); color: oklch(from var(--dt-color-olive-700) l c h / var(--fco)) !important |
| `d-fc-olive-800` | --fco: var(--dt-color-olive-800-a); color: oklch(from var(--dt-color-olive-800) l c h / var(--fco)) !important |
| `d-fc-olive-900` | --fco: var(--dt-color-olive-900-a); color: oklch(from var(--dt-color-olive-900) l c h / var(--fco)) !important |
| `d-fc-olive-950` | --fco: var(--dt-color-olive-950-a); color: oklch(from var(--dt-color-olive-950) l c h / var(--fco)) !important |
| `d-fc-placeholder` | --fco: var(--dt-color-foreground-placeholder-a); color: oklch(from var(--dt-color-foreground-placeholder) l c h / var(--fco)) !important |
| `d-fc-placeholder-inverted` | --fco: var(--dt-color-foreground-placeholder-inverted-a); color: oklch(from var(--dt-color-foreground-placeholder-inverted) l c h / var(--fco)) !important |
| `d-fc-primary` | --fco: var(--dt-color-foreground-primary-a); color: oklch(from var(--dt-color-foreground-primary) l c h / var(--fco)) !important |
| `d-fc-primary-inverted` | --fco: var(--dt-color-foreground-primary-inverted-a); color: oklch(from var(--dt-color-foreground-primary-inverted) l c h / var(--fco)) !important |
| `d-fc-purple-100` | --fco: var(--dt-color-purple-100-a); color: oklch(from var(--dt-color-purple-100) l c h / var(--fco)) !important |
| `d-fc-purple-1000` | --fco: var(--dt-color-purple-1000-a); color: oklch(from var(--dt-color-purple-1000) l c h / var(--fco)) !important |
| `d-fc-purple-200` | --fco: var(--dt-color-purple-200-a); color: oklch(from var(--dt-color-purple-200) l c h / var(--fco)) !important |
| `d-fc-purple-250` | --fco: var(--dt-color-purple-250-a); color: oklch(from var(--dt-color-purple-250) l c h / var(--fco)) !important |
| `d-fc-purple-300` | --fco: var(--dt-color-purple-300-a); color: oklch(from var(--dt-color-purple-300) l c h / var(--fco)) !important |
| `d-fc-purple-350` | --fco: var(--dt-color-purple-350-a); color: oklch(from var(--dt-color-purple-350) l c h / var(--fco)) !important |
| `d-fc-purple-400` | --fco: var(--dt-color-purple-400-a); color: oklch(from var(--dt-color-purple-400) l c h / var(--fco)) !important |
| `d-fc-purple-450` | --fco: var(--dt-color-purple-450-a); color: oklch(from var(--dt-color-purple-450) l c h / var(--fco)) !important |
| `d-fc-purple-50` | --fco: var(--dt-color-purple-50-a); color: oklch(from var(--dt-color-purple-50) l c h / var(--fco)) !important |
| `d-fc-purple-500` | --fco: var(--dt-color-purple-500-a); color: oklch(from var(--dt-color-purple-500) l c h / var(--fco)) !important |
| `d-fc-purple-550` | --fco: var(--dt-color-purple-550-a); color: oklch(from var(--dt-color-purple-550) l c h / var(--fco)) !important |
| `d-fc-purple-600` | --fco: var(--dt-color-purple-600-a); color: oklch(from var(--dt-color-purple-600) l c h / var(--fco)) !important |
| `d-fc-red-100` | --fco: var(--dt-color-red-100-a); color: oklch(from var(--dt-color-red-100) l c h / var(--fco)) !important |
| `d-fc-red-1000` | --fco: var(--dt-color-red-1000-a); color: oklch(from var(--dt-color-red-1000) l c h / var(--fco)) !important |
| `d-fc-red-200` | --fco: var(--dt-color-red-200-a); color: oklch(from var(--dt-color-red-200) l c h / var(--fco)) !important |
| `d-fc-red-300` | --fco: var(--dt-color-red-300-a); color: oklch(from var(--dt-color-red-300) l c h / var(--fco)) !important |
| `d-fc-red-350` | --fco: var(--dt-color-red-350-a); color: oklch(from var(--dt-color-red-350) l c h / var(--fco)) !important |
| `d-fc-red-400` | --fco: var(--dt-color-red-400-a); color: oklch(from var(--dt-color-red-400) l c h / var(--fco)) !important |
| `d-fc-red-450` | --fco: var(--dt-color-red-450-a); color: oklch(from var(--dt-color-red-450) l c h / var(--fco)) !important |
| `d-fc-red-50` | --fco: var(--dt-color-red-50-a); color: oklch(from var(--dt-color-red-50) l c h / var(--fco)) !important |
| `d-fc-red-500` | --fco: var(--dt-color-red-500-a); color: oklch(from var(--dt-color-red-500) l c h / var(--fco)) !important |
| `d-fc-red-600` | --fco: var(--dt-color-red-600-a); color: oklch(from var(--dt-color-red-600) l c h / var(--fco)) !important |
| `d-fc-red-700` | --fco: var(--dt-color-red-700-a); color: oklch(from var(--dt-color-red-700) l c h / var(--fco)) !important |
| `d-fc-red-900` | --fco: var(--dt-color-red-900-a); color: oklch(from var(--dt-color-red-900) l c h / var(--fco)) !important |
| `d-fc-secondary` | --fco: var(--dt-color-foreground-secondary-a); color: oklch(from var(--dt-color-foreground-secondary) l c h / var(--fco)) !important |
| `d-fc-secondary-inverted` | --fco: var(--dt-color-foreground-secondary-inverted-a); color: oklch(from var(--dt-color-foreground-secondary-inverted) l c h / var(--fco)) !important |
| `d-fc-success` | --fco: var(--dt-color-foreground-success-a); color: oklch(from var(--dt-color-foreground-success) l c h / var(--fco)) !important |
| `d-fc-success-inverted` | --fco: var(--dt-color-foreground-success-inverted-a); color: oklch(from var(--dt-color-foreground-success-inverted) l c h / var(--fco)) !important |
| `d-fc-success-strong` | --fco: var(--dt-color-foreground-success-strong-a); color: oklch(from var(--dt-color-foreground-success-strong) l c h / var(--fco)) !important |
| `d-fc-success-strong-inverted` | --fco: var(--dt-color-foreground-success-strong-inverted-a); color: oklch(from var(--dt-color-foreground-success-strong-inverted) l c h / var(--fco)) !important |
| `d-fc-tan-100` | --fco: var(--dt-color-tan-100-a); color: oklch(from var(--dt-color-tan-100) l c h / var(--fco)) !important |
| `d-fc-tan-1000` | --fco: var(--dt-color-tan-1000-a); color: oklch(from var(--dt-color-tan-1000) l c h / var(--fco)) !important |
| `d-fc-tan-200` | --fco: var(--dt-color-tan-200-a); color: oklch(from var(--dt-color-tan-200) l c h / var(--fco)) !important |
| `d-fc-tan-300` | --fco: var(--dt-color-tan-300-a); color: oklch(from var(--dt-color-tan-300) l c h / var(--fco)) !important |
| `d-fc-tan-400` | --fco: var(--dt-color-tan-400-a); color: oklch(from var(--dt-color-tan-400) l c h / var(--fco)) !important |
| `d-fc-tan-50` | --fco: var(--dt-color-tan-50-a); color: oklch(from var(--dt-color-tan-50) l c h / var(--fco)) !important |
| `d-fc-tan-500` | --fco: var(--dt-color-tan-500-a); color: oklch(from var(--dt-color-tan-500) l c h / var(--fco)) !important |
| `d-fc-tan-600` | --fco: var(--dt-color-tan-600-a); color: oklch(from var(--dt-color-tan-600) l c h / var(--fco)) !important |
| `d-fc-tan-700` | --fco: var(--dt-color-tan-700-a); color: oklch(from var(--dt-color-tan-700) l c h / var(--fco)) !important |
| `d-fc-tan-800` | --fco: var(--dt-color-tan-800-a); color: oklch(from var(--dt-color-tan-800) l c h / var(--fco)) !important |
| `d-fc-tan-900` | --fco: var(--dt-color-tan-900-a); color: oklch(from var(--dt-color-tan-900) l c h / var(--fco)) !important |
| `d-fc-tan-950` | --fco: var(--dt-color-tan-950-a); color: oklch(from var(--dt-color-tan-950) l c h / var(--fco)) !important |
| `d-fc-teal-100` | --fco: var(--dt-color-teal-100-a); color: oklch(from var(--dt-color-teal-100) l c h / var(--fco)) !important |
| `d-fc-teal-1000` | --fco: var(--dt-color-teal-1000-a); color: oklch(from var(--dt-color-teal-1000) l c h / var(--fco)) !important |
| `d-fc-teal-200` | --fco: var(--dt-color-teal-200-a); color: oklch(from var(--dt-color-teal-200) l c h / var(--fco)) !important |
| `d-fc-teal-300` | --fco: var(--dt-color-teal-300-a); color: oklch(from var(--dt-color-teal-300) l c h / var(--fco)) !important |
| `d-fc-teal-400` | --fco: var(--dt-color-teal-400-a); color: oklch(from var(--dt-color-teal-400) l c h / var(--fco)) !important |
| `d-fc-teal-50` | --fco: var(--dt-color-teal-50-a); color: oklch(from var(--dt-color-teal-50) l c h / var(--fco)) !important |
| `d-fc-teal-500` | --fco: var(--dt-color-teal-500-a); color: oklch(from var(--dt-color-teal-500) l c h / var(--fco)) !important |
| `d-fc-teal-600` | --fco: var(--dt-color-teal-600-a); color: oklch(from var(--dt-color-teal-600) l c h / var(--fco)) !important |
| `d-fc-teal-700` | --fco: var(--dt-color-teal-700-a); color: oklch(from var(--dt-color-teal-700) l c h / var(--fco)) !important |
| `d-fc-teal-800` | --fco: var(--dt-color-teal-800-a); color: oklch(from var(--dt-color-teal-800) l c h / var(--fco)) !important |
| `d-fc-teal-900` | --fco: var(--dt-color-teal-900-a); color: oklch(from var(--dt-color-teal-900) l c h / var(--fco)) !important |
| `d-fc-teal-950` | --fco: var(--dt-color-teal-950-a); color: oklch(from var(--dt-color-teal-950) l c h / var(--fco)) !important |
| `d-fc-tertiary` | --fco: var(--dt-color-foreground-tertiary-a); color: oklch(from var(--dt-color-foreground-tertiary) l c h / var(--fco)) !important |
| `d-fc-tertiary-inverted` | --fco: var(--dt-color-foreground-tertiary-inverted-a); color: oklch(from var(--dt-color-foreground-tertiary-inverted) l c h / var(--fco)) !important |
| `d-fc-transparent` | color: transparent !important |
| `d-fc-unset` | color: unset !important |
| `d-fc-warning` | --fco: var(--dt-color-foreground-warning-a); color: oklch(from var(--dt-color-foreground-warning) l c h / var(--fco)) !important |
| `d-fc-warning-inverted` | --fco: var(--dt-color-foreground-warning-inverted-a); color: oklch(from var(--dt-color-foreground-warning-inverted) l c h / var(--fco)) !important |
