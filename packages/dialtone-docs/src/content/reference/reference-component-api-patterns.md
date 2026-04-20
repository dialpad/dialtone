---
type: reference
category: reference
keywords: [component-api, props, events, slots, constants, vue-components, dialtone-vue, v-model, provide-inject, aria, data-qa, icon-sizes]
ai_summary: Cross-component API contract for Dialtone Vue components — standard props, events, slots, and patterns shared by all components.
last_updated: 2026-03-09
related_packages: [dialtone-vue]
---

# Component API Patterns

Every Vue component in `packages/dialtone-vue/components/` follows shared conventions. This document describes the implicit contract so you know what to expect from any component without reading its source.

## Constants File Pattern

Every component has a `{component_name}_constants.js` file that exports modifier maps. These map prop values to CSS class names:

```javascript
// button_constants.js
export const BUTTON_SIZE_MODIFIERS = {
  xs: 'd-btn--xs',
  sm: 'd-btn--sm',
  md: '',           // default size — no modifier class needed
  lg: 'd-btn--lg',
  xl: 'd-btn--xl',
};
```

The Vue component validates props against these maps and applies the corresponding class. The empty string `''` convention means "default, no extra class."

Constants are also re-exported from each component's `index.js` so consumers can import them.

## Standard Prop Patterns

### Size

Most sizable components accept a `size` prop with values: `xs`, `sm`, `md`, `lg`, `xl`. Default is usually `md`.

Exceptions exist — DtModal uses `default` and `full` instead.

### Kind

Color or semantic variant. Values vary per component:

- DtButton: `default`, `muted`, `critical`, `positive`, `inverted`, `unstyled`
- DtModal: `default`, `critical`
- DtNotice: `base`, `critical`, `info`, `positive`, `warning`
- DtBadge: uses `type` instead (`default`, `info`, `positive`, `warning`, `critical`, `bulletin`, `ai`)

### Importance

Visual weight. Currently specific to DtButton: `clear`, `outlined`, `primary`. Other components do not use this prop.

### Class Customization

All components accept class override props typed as `[String, Array, Object]`:

- DtButton → `labelClass`
- DtInput → `inputClass`
- DtAvatar → `avatarClass`
- DtModal → `modalClass`
- DtToggle → `labelClass`

These are bound with Vue's `:class` binding on the inner element, separate from the root element's `class` prop.

## v-model Contract

All form components implement Vue 3 v-model via `modelValue` prop + `update:modelValue` emit:

| Component | modelValue type | Notes |
|-----------|----------------|-------|
| DtInput | `String \| Number` | Also emits `update:length`, `update:invalid` |
| DtCheckbox | `Boolean` | Via CheckableMixin |
| DtRadio | `String \| Number` | Via CheckableMixin |
| DtSelectMenu | `String \| Number` | |
| DtToggle | `Boolean \| String` | Supports `'mixed'` for indeterminate state |

Visibility-toggle components use `update:open`:

| Component | Emit |
|-----------|------|
| DtModal | `update:open` |
| DtTooltip | `update:open` |
| DtToast | `update:open` |
| DtPopover | `update:open` |
| DtDropdown | `update:open` |

## Event Naming

Native DOM events are forwarded as-is: `focus`, `blur`, `focusin`, `focusout`, `input`, `click`, `keydown`.

Custom events use the `update:{prop}` convention to stay compatible with `v-model`:

```
update:modelValue   — value changed
update:open         — visibility changed
update:length       — input length changed (DtInput)
update:invalid      — validation state changed (DtInput)
```

## Slot Conventions

| Slot name | Used by | Purpose |
|-----------|---------|---------|
| `default` | All components | Primary content |
| `icon` | Button, Badge, Avatar | Single icon placement |
| `leftIcon` / `rightIcon` | Input | Directional icon slots |
| `header` / `footer` | Modal | Section slots |
| `banner` | Modal | Top banner area |
| `anchor` | Tooltip, Popover | Trigger element |
| `description` | Input, Checkbox | Helper/description text |

Icon slots pass sizing data via slot props:

```vue
<slot name="icon" :icon-size="iconSize" />
```

## Icon Size Mapping

Each component with icons maps its `size` prop to an icon scale via a `*_ICON_SIZES` constant. The mapping is component-specific, not global:

| Component size | Button icon | Input icon | Avatar icon |
|---------------|-------------|------------|-------------|
| xs | 200 | 100 | 100 |
| sm | 200 | 200 | 200 |
| md | 300 | 200 | 300 |
| lg | 400 | 400 | 500 |
| xl | 500 | 500 | 600 |

Icon scale values correspond to pixel sizes defined in `packages/dialtone-icons/src/constants.js`:

| Scale | Pixels |
|-------|--------|
| 100 | 12px |
| 200 | 14px |
| 300 | 18px |
| 400 | 20px |
| 500 | 24px |
| 600 | 32px |
| 700 | 38px |
| 800 | 48px |

## Provide/Inject for Group Components

Group-child relationships use Vue's provide/inject. The parent provides a reactive context object plus action methods:

**Tab group** (`tab_group.vue`):

```
provides: { groupContext: { selected, disabled }, setFocus }
```

**Input groups** (CheckboxGroup, RadioGroup via `input_group.js` mixin):

```
provides: { groupContext: { name, disabled, validationState, value, selectedValues }, setGroupValue }
```

Child components inject with defaults so they also work standalone:

```javascript
inject: {
  groupContext: { default: {} },
  setGroupValue: { default: () => () => {} },
}
```

## Teleport and Floating Elements

DtModal uses Vue's native `<teleport>` with an `appendTo` prop (CSS selector string). When `appendTo` is undefined, the modal renders in-place.

DtTooltip, DtPopover, and DtHovercard use Tippy.js with a similar `appendTo` prop that defaults to `'body'`.

## Data-QA Attributes

All components use `data-qa` attributes for test selectors. Pattern: `dt-{component}` for the root, `dt-{component}-{element}` for children:

```
data-qa="dt-button"
data-qa="dt-button-icon"
data-qa="dt-button-label"
data-qa="dt-modal-title"
data-qa="dt-input-label"
```

Tests query these with `wrapper.find('[data-qa="dt-button"]')`.

## Prop Validation Warnings

Some components validate prop combinations at runtime and log warnings. There is no shared validation framework — each component implements its own checks in `watch` or `mounted()`:

- DtButton: warns on `circle + link` conflict, invalid `kind + importance` combinations
- DtBadge: errors on `type: 'ai'` with `kind: 'count'`, decoration with non-default type/kind
- DtAvatar: errors when `imageSrc` is provided without `imageAlt`
- DtTooltip: warns when both `enabled` and `show` props are set

Check each component's source or `_constants.js` for the full list of invalid combinations.
