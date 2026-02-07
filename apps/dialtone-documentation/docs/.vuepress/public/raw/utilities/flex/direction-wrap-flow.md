# Direction, Wrap, & Flow

Utilities for setting an object's flex direction, wrap, and flow directions.

- **Keywords**: flexbox,flex direction,flex wrap,flex flow,row,column

> **Use DtStack in favor of Flex CSS Utilities.** Use the [DtStack](../../components/stack.md) component for most Flex-based layout implementations. View [Migrating from Flex CSS Utilities to DtStack](/about/whats-new/posts/2025-12-2) for more details.

## Flex Direction

The `flex-direction` property declares a flex container’s main axis direction. The default value is row.

```html
<dt-stack class="d-fd-row-reverse">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
<dt-stack class="d-fd-row">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

### Classes

  <div>
| Class | Output | Description |
| --- | --- | --- |
| .d-{{ className }} | {{ output }} | {{ description }} |

  </div>

## Flex Wrap

The `flex-wrap` property declares a flex container’s wrapping status. The default value is nowrap.

```html
<dt-stack direction="row" class="d-fw-wrap">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

### Classes

  <div>
| Class | Output | Description |
| --- | --- | --- |
| .d-{{ className }} | {{ output }} | {{ description }} |

  </div>

## Flex Flow

The `flex-flow` property is a shorthand property that sets allows you to quickly set the above `flex-direction` and `flex-wrap` properties. By default all flex containers are set to `row` and `nowrap`.

```html
<dt-stack class="d-ff-row-reverse-wrap">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</dt-stack>
```

### Classes

  <div>
| Class | Output | Description |
| --- | --- | --- |
| .d-{{ className }} | {{ output }} | {{ description }} |

  </div>
