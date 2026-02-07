# Font Family

Utilities to change an element's font-family.

- **Keywords**: typeface, sans serif, monospace

> **Use DtText in favor of CSS Utilities.** Reach for the [DtText](../../components/text.md) component before considering any typography utility.

## Sans-Serif

Use `d-ff-sans` to apply a Sans-Serif font stack.

```html
<p class="d-ff-sans">...</p>
```

## Mono

Use `d-ff-mono` to apply a Monospace font stack.

```html
<p class="d-ff-mono">...</p>
```

## Marketing

Dialtone supports select marketing fonts and weights. Use the following combinations to apply the marketing font stack.

```html
<p class="d-ff-marketing">...</p>
```

## CSS Variables

  <div>
| Variable | Output |
| --- | --- |
| var(--ff-{{ varName }}) | {{ output }} |

  </div>

## Classes

  <div>
| Class | Output |
| --- | --- |
| .d-ff-{{ varName }} | font-family: {{ output }} !important; |

  </div>
