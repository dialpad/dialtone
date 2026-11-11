---
type: reference
category: reference
keywords:
  [
    component-api,
    props,
    events,
    slots,
    constants,
    vue-components,
    dialtone-vue,
    v-model,
    provide-inject,
    aria,
    data-qa,
    icon-sizes,
    dt-text,
    dt-box,
    logical-props,
  ]
ai_summary: Recurring Dialtone Vue props, events, slots, and API patterns; supported values and exceptions depend on the selected component.
last_updated: 2026-11-11
related_packages: [dialtone-vue]
---

# Component API Patterns

This reference explains recurring API patterns, not a universal contract for every component. Follow the [current Vue requirements](../../../../../.agents/resources/rules/vue-components.md) and inspect the selected component's props, emits, slots and validators before relying on an example. The size and filename guidance below is checked against current source; other component examples are navigation aids, not a complete API inventory.

## Constants File Pattern

Components that need exported value maps use a PascalCase file such as [ButtonConstants.js](../../../../dialtone-vue/components/Button/ButtonConstants.js). A constants file is not required when the component has no such definitions.

The component's validator and class binding use these maps; an empty class string can represent the default appearance. Some constants are re-exported through the component's `index.js`. Check that barrel before assuming a constant is public. Keep allowed/deprecated values in the owning source instead of copying the map into another reference.

## Standard Prop Patterns

### Size

Component ordinal sizes prefer numeric values. [The shared scale](../../../../dialtone-vue/common/constants/sizes.js) defines the common stops, while each component's constants and validator determine its supported subset and default. For example, [Button](../../../../dialtone-vue/components/Button/Button.vue) accepts numeric sizes with default `300`; t-shirt keys in its constants are deprecated compatibility aliases, not the preferred values for new code.

Do not apply one size contract to every component. Modal's fullscreen behavior, typography sizes and icon-family scales are separate APIs. For typography, inspect [Text.vue](../../../../dialtone-vue/components/Text/Text.vue) before combining `variant`, numeric `size` or legacy `kind`.

### Logical Geometry Props

Primitive container APIs use logical CSS naming for directional props. DtBox uses this pattern for padding, border widths, sizing, and positioning:

- `paddingBlockStart`, `paddingBlockEnd`, `paddingInlineStart`, `paddingInlineEnd`
- `borderWidthBlockStart`, `borderWidthBlockEnd`, `borderWidthInlineStart`, `borderWidthInlineEnd`
- `blockSize`, `inlineSize`, `minBlockSize`, `maxInlineSize`
- `insetBlockStart`, `insetBlockEnd`, `insetInlineStart`, `insetInlineEnd`

Use logical names in public component APIs. Documentation may mention physical equivalents such as top, right, bottom, and left for discoverability, but do not add physical prop aliases when logical props exist.

DtBox positioning props cover container positioning: `position`, logical inset props, and `zIndex`. Logical inset props accept documented coordinate values, including negative spacing coordinates and side-specific `50p` / `100p` percentage coordinates. Keep CSS utility classes available for responsive modifiers, calc coordinates, CSS-wide reset values, arbitrary coordinates, and non-DtBox elements.

### Kind

Color or semantic variant. Values vary per component:

- DtButton: `default`, `muted`, `critical`, `positive`, `inverted`, `unstyled`
- DtModal: `default`, `critical`
- DtNotice: `base`, `critical`, `info`, `positive`, `warning`
- DtBadge: uses `type` instead (`default`, `info`, `positive`, `warning`, `critical`, `bulletin`, `ai`)

For DtText, `kind` is legacy composition syntax. Prefer `variant` for new text compositions.

### Variant

Visual variant or complete composition. Values vary per component.

DtText uses `variant` for complete typography compositions such as `headline-md`, `body-md`, `label-md`, and `code-sm`. `variant` can be combined with numeric `size` when the composition is correct but the font-size token needs an explicit override.

### Importance

Visual weight. Currently specific to DtButton: `clear`, `outlined`, `primary`. Other components do not use this prop.

### Class Customization

Components expose class customization where their API defines it. Examples include:

- DtButton → `labelClass`
- DtInput → `inputClass`
- DtAvatar → `avatarClass`
- DtModal → `modalClass`
- DtToggle → `labelClass`

These are bound with Vue's `:class` binding on the inner element, separate from the root element's `class` prop.

## v-model Contract

Most form components implement Vue 3 v-model via `modelValue` prop + `update:modelValue` emit:

| Component    | modelValue type     | Notes                                        |
| ------------ | ------------------- | -------------------------------------------- |
| DtInput      | `String \| Number`  | Also emits `update:length`, `update:invalid` |
| DtCheckbox   | `Boolean`           | Via CheckableMixin                           |
| DtRadio      | `String \| Number`  | Via CheckableMixin                           |
| DtSelectMenu | `String \| Number`  |                                              |
| DtToggle     | `Boolean \| String` | Supports `'mixed'` for indeterminate state   |
| DtSlider     | `Number \| [Number, Number]` | A number is single-thumb mode, a 2-length array is range mode. Also emits `change` on commit only (pointer up / blur), separate from the continuous `update:modelValue` |

DtFilterPill selects its controlled contract only when `Array.isArray(options)` is true at creation, including `[]`: bind `v-model:selected` to `string | null` for `useDropdown=true`, or to a string array for the checkbox popover. Initial omitted, `undefined`, `null` or other non-array options preserve the existing mutable `modelValue` item contract. A controlled instance stays controlled if its options later become invalid, with safe unchecked, disabled choices. Keep the contract and controlled `useDropdown` pattern stable for an instance; remount with a key when intentionally switching them.

Options and committed selection stay owned by the consumer. Optional `neutralValue` and option `shortLabel` treat `null` and `undefined` as absent; an empty string remains valid. Refreshing options alone preserves an open deferred draft. A semantic parent selection change replaces that draft and wins over Apply in either same-turn call order.

Use one write/side-effect path for a controlled FilterPill action. Bind `v-model:selected` to plain state and use `selection-change` for a needed side effect, or pass `:selected` and handle `selection-change` through an application setter. Do not invoke the same command from both events or from both `clear` and `selection-change`. The action payload reports a proposal, including same-value single activation; external selection changes do not emit it. See the [FilterPill guide](https://dialtone.dialpad.com/components/filter-pill.html) for deferred selection, neutral values and slot bindings. Its three controlled source starters and six controlled Combinator presets are withheld from lookup with owned exclusions until compatible publication and profile qualification; `dt10-pinned` 10.5.1 predates `options`/`selected`. Live documentation and Storybook demos remain available. All 11 legacy source-example IDs and the original `examples/presets/DtFilterPill/default` record are preserved.

Controlled FilterPill `open` and `update:open` report logical visibility. Its controlled-only `opened(boolean)` event follows the overlay's completed transition and cleanup. For removal, request closure and wait for `opened(false)`, keeping the modal, anchor and scroll container unchanged through that notification. The [FilterPill guide](https://dialtone.dialpad.com/components/filter-pill.html#closing-before-removal) shows the removal recipe.

Visibility-toggle components use `update:open`:

| Component  | Emit          |
| ---------- | ------------- |
| DtModal    | `update:open` |
| DtTooltip  | `update:open` |
| DtToast    | `update:open` |
| DtPopover  | `update:open` |
| DtDropdown | `update:open` |

Popover and Dropdown accept an optional `visibilityChangeCallback` prop. When supplied, it receives the open boolean synchronously on logical visibility changes, including initial `true` during creation before mount when `open=true`. Neither component declares or emits `open-change`; existing custom DOM listeners retain their fallthrough behavior. The visible surface starts with `aria-hidden="false"` when initially open.

The callback runs inside a synchronous Vue watcher. An already-closed modal with no pending transition or retained scroll lock can be removed immediately. For an open or closing modal, keep `modal=true`, its anchor and its scroll container unchanged through the closing `opened(false)` notification: request closure if needed, then remove it after that notification. Changing `modal` or the anchor's scroll context after opening can leave the original lock active. `opened(false)` reports transition completion, not ownership of global scroll locks. Logical `open=false` alone does not establish that the leave transition has completed. Separately, defer a direct `app.unmount()` with `nextTick` to avoid interrupting Vue's render during prop delivery.

For Popover and Dropdown, `opened` and `update:open` report the current completed transition. Opening finishes initial focus before notifying listeners, so a focus choice made inside `opened` is preserved. `open=null` emits no `update:open`. Canceled transitions and stale async completions do not notify terminal state or restore obsolete focus.

With a boolean `open` prop, both components keep default anchor toggling disabled. `forwardAnchorArrowKeys` defaults to `false`; opting in forwards anchor ArrowUp/ArrowDown through `keydown` without toggling. A closed opted-in Dropdown lets the consumer handle default/propagation and preserves first-row focus only when opening is synchronously accepted in Dropdown's own emitted `keydown` callback. Ancestor DOM listeners and delayed updates do not carry that focus guarantee; handlers should distinguish anchor targets from content targets. Default anchor-arrow handling is unchanged when forwarding is disabled.

## Event Naming

Native DOM events are forwarded as-is: `focus`, `blur`, `focusin`, `focusout`, `input`, `click`, `keydown`.

Custom events use the `update:{prop}` convention to stay compatible with `v-model`:

```text
update:modelValue   — default model value changed
update:selected     — named selection model changed (controlled DtFilterPill)
update:open         — visibility changed
update:length       — input length changed (DtInput)
update:invalid      — validation state changed (DtInput)
```

## Slot Conventions

| Slot name                | Used by                   | Purpose                 |
| ------------------------ | ------------------------- | ----------------------- |
| `default`                | Components that expose it | Primary content         |
| `icon`                   | Button, Badge, Avatar     | Single icon placement   |
| `leftIcon` / `rightIcon` | Input                     | Directional icon slots  |
| `header` / `footer`      | Modal                     | Section slots           |
| `banner`                 | Modal                     | Top banner area         |
| `anchor`                 | Tooltip, Popover          | Trigger element         |
| `description`            | Input, Checkbox           | Helper/description text |

Icon slots pass sizing data via slot props:

```vue
<slot name="icon" :icon-size="iconSize" />
```

## Icon Size Mapping

Icon sizing is component-specific. Read the owning maps in [ButtonConstants.js](../../../../dialtone-vue/components/Button/ButtonConstants.js), [InputConstants.js](../../../../dialtone-vue/components/Input/InputConstants.js) or [AvatarConstants.js](../../../../dialtone-vue/components/Avatar/AvatarConstants.js) instead of reusing a global component-to-icon table. A component ordinal and an icon-size value are distinct scales.

Follow the icon slot's documented `iconSize` binding and current icon implementation for its rendering size. Do not infer pixels or another component's mapping from a matching ordinal.

## Provide/Inject for Group Components

Group-child relationships use Vue's provide/inject. The parent provides a reactive context object plus action methods:

**Tab group** (`tab_group.vue`):

```javascript
provides: { groupContext: { selected, disabled }, setFocus }
```

**Input groups** (CheckboxGroup, RadioGroup via `input_group.js` mixin):

```javascript
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

```html
data-qa="dt-button" data-qa="dt-button-icon" data-qa="dt-button-label"
data-qa="dt-modal-title" data-qa="dt-input-label"
```

Tests query these with `wrapper.find('[data-qa="dt-button"]')`.

## Prop Validation Warnings

Some components validate prop combinations at runtime and log warnings. There is no shared validation framework — each component implements its own checks in `watch` or `mounted()`:

- DtButton: warns on `circle + link` conflict, invalid `kind + importance` combinations
- DtBadge: errors on `type: 'ai'` with `kind: 'count'`, decoration with non-default type/kind
- DtAvatar: errors when `imageSrc` is provided without `imageAlt`
- DtTooltip: warns when both `enabled` and `show` props are set
- DtSlider: warns (dev-only `console.info`) when range mode (array `modelValue`) has no `getValueText`, and when there's no accessible name from `label`, a non-empty `label` slot, `aria-label`, or `aria-labelledby`

Check each component's source and validators for invalid combinations; inspect its constants file when present.
