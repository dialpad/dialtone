# Font Size

Utilities to change an element's font-size.

- **Keywords**: text size, type size, type scale

> **Use DtText in favor of CSS Utilities.** Reach for the [DtText](../../components/text.md) component before considering any typography utility.

## Usage

```html
<p class="d-fs-*">...</p>
```

## Classes by Platform

### Product

  <div>
| Size | Class | Output |
| --- | --- | --- |
| {{ size }}px | .d-fs-{{ stop }} | font-size: {{ output }}rem !important; Aa |

  </div>

### Mobile

  <div>
| Size | Class | Output |
| --- | --- | --- |
| {{ size }}px | .d-fs-{{ stop }}-mobile | font-size: {{ output }}rem !important; Aa |

  </div>

### TC8

  <div>
| Size | Class | Output |
| --- | --- | --- |
| {{ size }}px | .d-fs-{{ stop }}-tc8 | font-size: {{ output }}rem !important; Aa |

  </div>

### TV

  <div>
| Size | Class | Output |
| --- | --- | --- |
| {{ size }}px | .d-fs-{{ stop }}-tv | font-size: {{ output }}rem !important; Aa |

  </div>
