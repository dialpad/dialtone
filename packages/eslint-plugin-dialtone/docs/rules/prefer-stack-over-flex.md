# prefer-stack-over-flex

Prefer using the `<dt-stack>` component instead of `d-d-flex` utility classes on regular HTML elements.

## Rule Details

The DtStack component provides a semantic, prop-based API for flex layouts. Using `<dt-stack>` instead of `d-d-flex` utilities improves:

- **API clarity:** Props instead of CSS classes for layout logic
- **Type safety:** Vue prop validation
- **Developer experience:** IDE autocomplete for prop values
- **Consistency:** Aligns with component-first architecture
- **Separation of concerns:** Layout logic in props, styling in classes

### Examples of incorrect code

```vue
<!-- Basic flex container -->
<div class="d-d-flex">...</div>

<!-- Flex with alignment -->
<div class="d-d-flex d-ai-center">...</div>

<!-- Flex with justify -->
<div class="d-d-flex d-jc-space-between">...</div>

<!-- Flex with direction and gap -->
<div class="d-d-flex d-fd-column d-g16">...</div>

<!-- Flex with wrap (keep as class on dt-stack) -->
<div class="d-d-flex d-fw-wrap">...</div>

<!-- Flex with flex-grow (keep as class on dt-stack) -->
<div class="d-d-flex d-fl-grow1">...</div>
```

### Examples of correct code

```vue
<!-- Basic stack -->
<dt-stack>...</dt-stack>

<!-- Stack with alignment -->
<dt-stack align="center">...</dt-stack>

<!-- Stack with justify -->
<dt-stack justify="between">...</dt-stack>

<!-- Stack with direction and gap -->
<dt-stack direction="column" gap="500">...</dt-stack>

<!-- Stack with wrap (retain utility class) -->
<dt-stack class="d-fw-wrap">...</dt-stack>

<!-- Stack with flex-grow (retain utility class) -->
<dt-stack class="d-fl-grow1">...</dt-stack>

<!-- Stack with multiple props -->
<dt-stack align="center" justify="between" direction="row" gap="400">
  ...
</dt-stack>
```

## Migration Guide

### Utilities That Become Props

| CSS Utility | DtStack Prop |
|-------------|--------------|
| `d-d-flex` | Not needed (DtStack is already flex) |
| `d-ai-center` | `align="center"` |
| `d-ai-flex-start` | `align="start"` |
| `d-ai-flex-end` | `align="end"` |
| `d-ai-stretch` | `align="stretch"` |
| `d-ai-baseline` | `align="baseline"` |
| `d-jc-flex-start` | `justify="start"` |
| `d-jc-center` | `justify="center"` |
| `d-jc-flex-end` | `justify="end"` |
| `d-jc-space-around` | `justify="around"` |
| `d-jc-space-between` | `justify="between"` |
| `d-jc-space-evenly` | `justify="evenly"` |
| `d-fd-row` | `direction="row"` |
| `d-fd-column` | `direction="column"` |
| `d-fd-row-reverse` | `direction="row-reverse"` |
| `d-fd-column-reverse` | `direction="column-reverse"` |
| `d-g0` | `gap="0"` |
| `d-g8` | `gap="400"` |
| `d-g16` | `gap="500"` |
| `d-g24` | `gap="550"` |
| `d-g32` | `gap="600"` |
| `d-g48` | `gap="650"` |
| `d-g64` | `gap="700"` |

### Utilities That Stay as Classes

Some flex utilities don't have DtStack prop equivalents. Keep these as classes on the DtStack:

| CSS Utility | Migration |
|-------------|-----------|
| `d-fw-wrap` | `<dt-stack class="d-fw-wrap">` |
| `d-fw-wrap-reverse` | `<dt-stack class="d-fw-wrap-reverse">` |
| `d-fl-grow1` | `<dt-stack class="d-fl-grow1">` |
| `d-fl-shrink0` | `<dt-stack class="d-fl-shrink0">` |
| `d-as-flex-end` | `<dt-stack class="d-as-flex-end">` |
| `d-order1` | `<dt-stack class="d-order1">` |
| `d-flow16` | `<dt-stack class="d-flow16">` |
| `d-g80`, `d-g96`, etc. | `<dt-stack class="d-g80">` (no prop equivalent) |

### Migration Examples

**Before:**
```vue
<div class="d-d-flex d-ai-center d-jc-space-between d-g16">
  <span>Left</span>
  <span>Right</span>
</div>
```

**After:**
```vue
<dt-stack direction="row" align="center" justify="between" gap="500">
  <span>Left</span>
  <span>Right</span>
</dt-stack>
```

---

**Before:**
```vue
<div class="d-d-flex d-fw-wrap d-ai-center d-g8">
  <badge v-for="item in items" :key="item.id">{{ item.name }}</badge>
</div>
```

**After:**
```vue
<dt-stack direction="row" align="center" gap="400" class="d-fw-wrap">
  <badge v-for="item in items" :key="item.id">{{ item.name }}</badge>
</dt-stack>
```

---

**Before:**
```vue
<div class="d-d-flex d-fd-column d-g32 d-fl-grow1">
  <section>...</section>
  <section>...</section>
</div>
```

**After:**
```vue
<dt-stack direction="column" gap="600" class="d-fl-grow1">
  <section>...</section>
  <section>...</section>
</dt-stack>
```

## When Not To Use

This rule only applies to non-DtStack elements. DtStack components with redundant `d-d-flex` are handled by the `deprecated-stack-alignment-classes` rule.

## Further Reading

- [Stack Component Documentation](https://dialtone.dialpad.com/components/stack.html)
- [Align Prop Documentation](https://dialtone.dialpad.com/components/stack.html#align)
- [Justify Prop Documentation](https://dialtone.dialpad.com/components/stack.html#justify)
- [Direction Prop Documentation](https://dialtone.dialpad.com/components/stack.html#direction)
- [Gap Prop Documentation](https://dialtone.dialpad.com/components/stack.html#gap)
