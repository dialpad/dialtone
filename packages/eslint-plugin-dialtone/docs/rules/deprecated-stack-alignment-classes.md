# deprecated-stack-alignment-classes

Recommends using props instead of CSS utility classes on `<dt-stack>` components.

## Rule Details

The Stack component provides `align`, `justify`, `direction`, and `gap` props that should be used instead of the corresponding CSS utility classes. Additionally, `d-d-flex` is redundant on Stack since it is already a flex container.

This improves:

- **API clarity:** Props instead of CSS classes for layout logic
- **Type safety:** Vue prop validation
- **Developer experience:** IDE autocomplete for prop values
- **Consistency:** Uses component props for all layout behavior
- **Separation of concerns:** Layout logic in props, styling in classes

### Examples of incorrect code

```vue
<!-- Use align prop instead of d-ai-* -->
<dt-stack class="d-ai-center">...</dt-stack>

<!-- Use justify prop instead of d-jc-* -->
<dt-stack class="d-jc-space-between">...</dt-stack>

<!-- Use direction prop instead of d-fd-* -->
<dt-stack class="d-fd-row">...</dt-stack>

<!-- Use gap prop instead of d-g* -->
<dt-stack class="d-g16">...</dt-stack>

<!-- Remove redundant d-d-flex -->
<dt-stack class="d-d-flex d-ai-center">...</dt-stack>

<!-- Multiple violations -->
<dt-stack class="d-p16 d-ai-flex-start d-fd-row d-g16">...</dt-stack>
```

### Examples of correct code

```vue
<dt-stack align="center">...</dt-stack>

<dt-stack justify="between">...</dt-stack>

<dt-stack direction="row">...</dt-stack>

<dt-stack gap="500">...</dt-stack>

<dt-stack class="d-p16" align="start" direction="row" gap="500">...</dt-stack>

<dt-stack
  :direction="{ 'default': 'column', 'md': 'row' }"
  gap="600"
  align="start"
>
  ...
</dt-stack>
```

## Migration Guide

### Align-Items Utilities → `align` Prop

| CSS Utility | Prop Value |
|-------------|------------|
| `d-ai-normal` | `align="normal"` |
| `d-ai-flex-start` | `align="start"` |
| `d-ai-center` | `align="center"` |
| `d-ai-flex-end` | `align="end"` |
| `d-ai-stretch` | `align="stretch"` |
| `d-ai-baseline` | `align="baseline"` |

### Justify-Content Utilities → `justify` Prop

| CSS Utility | Prop Value |
|-------------|------------|
| `d-jc-flex-start` | `justify="start"` |
| `d-jc-center` | `justify="center"` |
| `d-jc-flex-end` | `justify="end"` |
| `d-jc-space-around` | `justify="around"` |
| `d-jc-space-between` | `justify="between"` |
| `d-jc-space-evenly` | `justify="evenly"` |

### Direction Utilities → `direction` Prop

| CSS Utility | Prop Value |
|-------------|------------|
| `d-fd-row` | `direction="row"` |
| `d-fd-column` | `direction="column"` |
| `d-fd-row-reverse` | `direction="row-reverse"` |
| `d-fd-column-reverse` | `direction="column-reverse"` |

### Gap Utilities → `gap` Prop

Only gap utilities with DtStack equivalents are flagged. Gap utilities larger than 64px do not have DtStack equivalents and are not flagged.

| CSS Utility | Prop Value |
|-------------|------------|
| `d-g0` | `gap="0"` |
| `d-g8` | `gap="400"` |
| `d-g16` | `gap="500"` |
| `d-g24` | `gap="550"` |
| `d-g32` | `gap="600"` |
| `d-g48` | `gap="650"` |
| `d-g64` | `gap="700"` |

### Redundant `d-d-flex`

The `d-d-flex` utility is redundant on `<dt-stack>` since Stack is already a flex container. Simply remove it.

```vue
<!-- Before -->
<dt-stack class="d-d-flex d-ai-center">...</dt-stack>

<!-- After -->
<dt-stack align="center">...</dt-stack>
```

## When Not To Use

This rule only applies to `<dt-stack>` components. Regular HTML elements using these utility classes are valid and will not trigger this rule.

**Valid usage on non-Stack elements:**

```vue
<div class="d-d-flex d-ai-center">...</div>
<div class="d-jc-space-between">...</div>
<div class="d-fd-row d-g16">...</div>
```

## Further Reading

- [Stack Component Documentation](https://dialtone.dialpad.com/components/stack.html)
- [Align Prop Documentation](https://dialtone.dialpad.com/components/stack.html#align)
- [Justify Prop Documentation](https://dialtone.dialpad.com/components/stack.html#justify)
- [Direction Prop Documentation](https://dialtone.dialpad.com/components/stack.html#direction)
- [Gap Prop Documentation](https://dialtone.dialpad.com/components/stack.html#gap)
