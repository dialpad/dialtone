# deprecated-stack-flow-classes

Flags `d-stack*` and `d-flow*` sibling-margin utility classes and recommends [`<dt-stack>`](https://dialtone.dialpad.com/components/stack.html) with the equivalent `gap` prop.

## Rule Details

`d-stack*` and `d-flow*` apply spacing between adjacent siblings via a `> * + *` margin selector. They predate `<dt-stack>`, which provides the same vertical/horizontal spacing through native flexbox `gap` and exposes it via a typed prop with responsive support.

### Examples of incorrect code

```vue
<div class="d-stack16">
  <p>One</p>
  <p>Two</p>
</div>

<div class="d-flow24">
  <span>One</span>
  <span>Two</span>
</div>

<ul class="d-ps-relative d-stack2 d-px-0">
  <li>...</li>
</ul>

<ul :class="['d-ps-relative', 'd-stack2', listClass]">
  <li>...</li>
</ul>

<div :class="{ 'd-stack16': isCompact }">...</div>
```

### Examples of correct code

```vue
<dt-stack gap="200">
  <p>One</p>
  <p>Two</p>
</dt-stack>

<dt-stack direction="row" gap="300">
  <span>One</span>
  <span>Two</span>
</dt-stack>

<dt-stack :gap="{ default: '200', md: '400' }">
  <p>One</p>
  <p>Two</p>
</dt-stack>
```

## Px to `gap` Prop Mapping

The pixel suffix on the deprecated class maps to a Dialtone spacing token, which is what `<dt-stack>`'s `gap` prop accepts. Use `direction="column"` (the default) to replace `d-stack*`; use `direction="row"` to replace `d-flow*`.

| Deprecated class | DtStack gap prop |
| --- | --- |
| `d-stack0` / `d-flow0` | `gap="0"` |
| `d-stack1` / `d-flow1` | `gap="1"` |
| `d-stack2` / `d-flow2` | `gap="25"` |
| `d-stack4` / `d-flow4` | `gap="50"` |
| `d-stack6` / `d-flow6` | `gap="75"` |
| `d-stack8` / `d-flow8` | `gap="100"` |
| `d-stack12` / `d-flow12` | `gap="150"` |
| `d-stack16` / `d-flow16` | `gap="200"` |
| `d-stack20` / `d-flow20` | `gap="250"` |
| `d-stack24` / `d-flow24` | `gap="300"` |
| `d-stack32` / `d-flow32` | `gap="400"` |
| `d-stack48` / `d-flow48` | `gap="600"` |
| `d-stack64` / `d-flow64` | `gap="800"` |

`d-stack72` and larger sizes have no exact `gap` value in DtStack's prop scale — use the closest available `gap` and fall back to a custom CSS rule on the parent if a larger gap is genuinely required.

## Dynamic Bindings

The rule flags `d-stack*` / `d-flow*` string literals inside `:class` bindings (array, object, or single-string forms). These can't be safely auto-rewritten — the surrounding logic typically needs to move to a `:gap` prop binding:

```vue
<!-- Before -->
<div :class="{ 'd-stack16': isCompact, 'd-stack8': !isCompact }">

<!-- After -->
<dt-stack :gap="isCompact ? '200' : '100'">
```

## When Not To Use

Only `d-stack*` / `d-flow*` are flagged. Other layout utility classes (`d-d-flex`, `d-ai-*`, `d-jc-*`, etc.) are out of scope — see [`prefer-stack-over-flex`](./prefer-stack-over-flex.md) and [`deprecated-stack-alignment-classes`](./deprecated-stack-alignment-classes.md) for those.

If a specific occurrence cannot be migrated yet, disable the rule on that line:

```vue
<!-- eslint-disable-next-line dialtone/deprecated-stack-flow-classes -- legacy code path -->
<ul :class="['d-ps-relative', 'd-stack2', listClass]">
```

## Further Reading

- [DtStack component documentation](https://dialtone.dialpad.com/components/stack.html)
- [Migrating from Flex CSS Utilities to DtStack](https://dialtone.dialpad.com/guides/migration/flex-to-stack/)
