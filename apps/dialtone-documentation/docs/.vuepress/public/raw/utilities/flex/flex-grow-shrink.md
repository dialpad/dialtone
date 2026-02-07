# Flex, Grow, & Shrink

Utilities for setting an object's flex, grow, and shrink flex properties.

- **Keywords**: flexbox, flex shrink, flex basis

> **Use DtStack in favor of Flex CSS Utilities.** Use the [DtStack](../../components/stack.md) component for most Flex-based layout implementations. View [Migrating from Flex CSS Utilities to DtStack](/about/whats-new/posts/2025-12-2) for more details.

## Flex

The `flex` property is a shorthand property for `flex-grow`, `flex-shrink`, and `flex-basis` properties. You can also
control the grow and shrink flex values separately with their own utility classes.

```html
<dt-stack direction="row">
  <div>...</div>
  <div class="d-fl1">...</div>
  <div>...</div>
</dt-stack>
```

  <div>
| Class | Output | Description |
| --- | --- | --- |
| .d-fl{{ v }} | flex: {{ v }} auto !important; | {{ properties[0].description }} {{ v }}, flex-shrink to 1 and flex-basis to auto. |
| .d-fl-unset | flex: unset; | Resets the flex value to the initial value (0 1 auto). |

  </div>

## Flex Grow

The `flex-grow` sets the flex container’s grow factor relative to the parent's main size. The default value is 0.

```html
<dt-stack direction="row">
  <div>...</div>
  <div class="d-fl-grow1">...</div>
  <div>...</div>
</dt-stack>
```

  <div>
| Class | Output | Description |
| --- | --- | --- |
| .d-{{ properties[1].class }}{{ v }} | flex-grow: {{ v }} !important; | {{ properties[1].description }} {{ v }}. |
| .d-fl-grow-unset | flex-grow: unset !important; | Resets the flex-grow value to the initial value (0). |

  </div>

## Flex Shrink

The `flex-shrink` sets the flex container’s shrink factor relative to the parent's main size. The default value is 1.

```html
<dt-stack direction="row">
  <div>...</div>
  <div class="d-fl-shrink1">...</div>
  <div>...</div>
</dt-stack>
```

  <div>
| Class | Output | Description |
| --- | --- | --- |
| .d-{{ properties[2].class }}{{ v }} | flex-shrink: {{ v }} !important; | {{ properties[2].description }} {{ v }}. |
| .d-fl-shrink-unset | flex-shrink: unset !important; | Resets the flex-shrink value to the initial value (1). |

  </div>
