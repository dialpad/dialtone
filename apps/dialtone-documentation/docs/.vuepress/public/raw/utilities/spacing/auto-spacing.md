# Auto Spacing

Utilities for controlling the space between child elements.

- **Keywords**: margin,padding,gap,whitespace

`d-stack` and `d-flow` utilities are deprecated. Please use the [Stack](../../components/stack.md) component instead.

## Adding Space Vertically

```html
<div class="d-stack16">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Adding Space Horizontally

```html
<div class="d-flow24">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```

## Classes

The Stack and Flow layouts work by using the adjacent sibling combinator (`+`) to apply a top or left margin to sibling elements. This means it will only work when there are more than two sibling items. To allow for differing nesting spacing values, these margins are scoped to apply **only** to direct children of the parent (e.g. `.d-stack[#] > * + *`).

  <div>
| Value | Vertical Class | Horizontal Class |
| --- | --- | --- |
| {{ val }}px | .d-stack{{ val }} | .d-flow{{ val }} |

  </div>
