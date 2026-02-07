# Font Variant Numeric

Utilities to change an element's font variant numeric.

- **Keywords**: tabular, lining, oldstyle

> **Use DtText in favor of CSS Utilities.** Reach for the [DtText](../../components/text.md) component before considering any typography utility.

The `font-variant-numeric` CSS property controls the usage of alternate glyphs for numbers, fractions, and ordinal markers.

## Normal (Default)

Use `d-fvn-normal` to deactivate any alternate glyphs.

```html
<p class="d-fvn-normal">...</p>
```

## Ordinal

The class `d-fvn-ordinal` forces the use of special glyphs for ordinal markers, like 1st, 2nd, 3rd.

```html
<p class="d-fvn-ordinal">1st, 2nd, 3rd, 4th</p>
```

## Proportional-Nums

Use `d-fvn-proportional` to set different sizes for each number.

```html
<div class="d-fvn-proportional">...</div>
```

## Tabular-Nums

Use `d-fvn-tabular` for aligning tabular data and preventing layout shifts of dynamically-changing content. For example, a timer counting down.

```html
<div class="d-fvn-tabular"><table>...</table></div>
```

## Diagonal-Fractions

Use `d-fvn-diagonal` to display numerator and denominator smaller and separated by a slash.

```html
<p class="d-fvn-diagonal">1/2 3/4 5/6</p>
```

## Unset

Use `d-fvn-unset` to deactivate other value previously set to `font-variant-numeric`.

```html
<p class="d-fvn-unset">...</p>
```

## Classes

| Class | Output |
| --- | --- |
| `d-fvn-diagonal` | font-variant-numeric: diagonal-fractions !important |
| `d-fvn-lining` | font-variant-numeric: lining-nums !important |
| `d-fvn-normal` | font-variant-numeric: normal !important |
| `d-fvn-ordinal` | font-variant-numeric: ordinal !important |
| `d-fvn-proportional` | font-variant-numeric: proportional-nums !important |
| `d-fvn-slashed-zero` | font-variant-numeric: slashed-zero !important |
| `d-fvn-stacked` | font-variant-numeric: stacked-fractions !important |
| `d-fvn-tabular` | font-variant-numeric: tabular-nums !important |
| `d-fvn-unset` | font-variant-numeric: unset !important |
