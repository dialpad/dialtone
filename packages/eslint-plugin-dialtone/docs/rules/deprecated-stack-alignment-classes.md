# deprecated-stack-alignment-classes

Recommends using the `align` and `justify` props on `<dt-stack>` components instead of CSS utility classes.

## Rule Details

The Stack component now provides `align` and `justify` props that should be used instead of the `d-ai-*` (align-items) and `d-jc-*` (justify-content) CSS utility classes.

This improves:

- **API clarity:** Props instead of CSS classes for layout logic
- **Type safety:** Vue prop validation
- **Developer experience:** IDE autocomplete for prop values
- **Consistency:** Matches the `direction` and `gap` prop pattern
- **Separation of concerns:** Layout logic in props, styling in classes

### Examples of incorrect code

```vue
<dt-stack class="d-ai-center">...</dt-stack>
```

```vue
<dt-stack class="d-jc-space-between">...</dt-stack>
```

```vue
<dt-stack class="d-p16 d-ai-flex-start">...</dt-stack>
```

```vue
<dt-stack
  :direction="{ 'default': 'column', 'md': 'row' }"
  gap="600"
  class="d-ai-flex-start"
>
  ...
</dt-stack>
```

### Examples of correct code

```vue
<dt-stack align="center">...</dt-stack>
```

```vue
<dt-stack justify="between">...</dt-stack>
```

```vue
<dt-stack class="d-p16" align="start">...</dt-stack>
```

```vue
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

## When Not To Use

This rule only applies to `<dt-stack>` components. Regular HTML elements using `d-ai-*` and `d-jc-*` utilities are valid and will not trigger this rule.

**Valid usage on non-Stack elements:**

```vue
<div class="d-ai-center">...</div>
<div class="d-jc-space-between">...</div>
```

## Further Reading

- [Stack Component Documentation](https://dialtone.dialpad.com/components/stack.html)
- [Align Prop Documentation](https://dialtone.dialpad.com/components/stack.html#align)
- [Justify Prop Documentation](https://dialtone.dialpad.com/components/stack.html#justify)
