---
paths:
  - "packages/dialtone-vue/components/**"
---

# Slot Class Props Convention

Every named slot **must** have a corresponding `{slotName}Class` prop applied to its wrapper element. This gives consumers styling control over each slot region without overriding internal classes.

## Prop Shape

Always declare slot class props with this exact shape:

```js
{slotName}Class: {
  type: [String, Array, Object],
  default: '',
},
```

## Template Application

Merge the class prop into the wrapper element's static class list:

```vue
<div :class="['d-component__section', sectionClass]">
  <slot name="section" />
</div>
```

The Dialtone BEM class comes first; the consumer override comes second.

## Exceptions

### 1. Default slot — use a semantic name

The default slot must **never** use `defaultClass`. Instead, choose a semantic name that describes the content region (`contentClass`, `labelClass`, `bodyClass`, etc.).

```js
// ✅ correct
contentClass: { type: [String, Array, Object], default: '' }

// ❌ wrong
defaultClass: { type: [String, Array, Object], default: '' }
```

### 2. Overlay header/footer slots — shortened names are acceptable

Overlay components (Popover, Hovercard, Modal) use `headerContent` / `footerContent` slot names. The corresponding class props may use the shortened form:

| Slot name       | Class prop    |
|-----------------|---------------|
| `headerContent` | `headerClass` |
| `footerContent` | `footerClass` |

Both `headerContentClass` and `headerClass` are acceptable; prefer the shorter form for consistency with existing components.

### 3. Structural class props are separate

Props like `rootClass`, `dialogClass`, `wrapperClass`, etc. target structural wrapper elements that do **not** correspond to a slot. These are encouraged for deep customization but are a separate concern — they do not satisfy the slot class requirement.

## Checklist

When adding or reviewing a slot:

1. Slot exists in the template → corresponding `{slotName}Class` prop is declared.
2. Prop uses the canonical shape (`[String, Array, Object]`, default `''`).
3. Prop is bound on the slot's immediate wrapper element via `:class` array merge.
4. Default slot uses a semantic name, not `defaultClass`.
5. Overlay header/footer slots use `headerClass` / `footerClass`.
