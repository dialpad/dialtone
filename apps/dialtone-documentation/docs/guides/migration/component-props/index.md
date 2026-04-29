---
title: Migrating Component Props, Events, and Slots
description: Prop renames, value standardization, event consolidation, slot renames, and removal of rootClass/wrapperClass/containerClass. Automated migration script included.
---

> [!WARNING] Breaking Changes
> Affects many components. Run the [migration script](#migration-script) to automate most of these.
>
## Overview of changes

### Severity vocabulary

`danger` and `error` both collapse to `critical`. `success` becomes `positive`.

| Component(s) | Type | Before | After |
| --- | --- | --- | --- |
| Any with `kind` | Prop value | `kind="danger"` / `kind="error"` | `kind="critical"` |
| Any with `kind` | Prop value | `kind="success"` | `kind="positive"` |
| Any with `validation-state` | Prop value | `validation-state="danger"` / `…="error"` | `validation-state="critical"` |
| Any with `validation-state` | Prop value | `validation-state="success"` | `validation-state="positive"` |
| `dt-badge` | Prop value | `type="success"` | `type="positive"` |
| `dt-link` | Prop name | `kind` | `tone` |
| `dt-link` | Prop value | `tone="danger"` | `tone="critical"` |
| `dt-link` | Prop value | `tone="success"` | `tone="positive"` |
| `dt-modal` | Prop value | `bannerKind="error"` | `bannerKind="critical"` |
| `dt-modal` | Prop value | `bannerKind="success"` | `bannerKind="positive"` |
| `dt-text` | Prop value | `tone="success"` | `tone="positive"` |
| `dt-text` | Prop value | `tone="success-strong"` | `tone="positive-strong"` |
| `dt-button` | Prop value | `link-kind="danger"` | `link-kind="critical"` |
| `dt-button` | Prop value | `link-kind="success"` | `link-kind="positive"` |
| `dt-box` | Prop value | `surface="success*"` (subtle, strong, opaque, subtle-opaque) | `surface="positive*"` |
| `dt-box` | Prop value | `bc="success*"` (subtle, strong) | `bc="positive*"` |

> [!INFO] CSS variables and utility classes also rename
> The success-to-positive rename also covers `var(--dt-color-*-success-*)` design tokens, `d-fc-success*` / `d-bgc-success*` / `d-bc-success*` utility classes, and ships an ESLint rule and Stylelint rule. See the [Success to Positive](../success-to-positive/) migration guide for the CSS / token side and run `dialtone-migration-helper`.

### Visibility and open state

Positive-polarity naming throughout — no more `hide-*` props.

| Component(s) | Type | Before | After | Notes |
| --- | --- | --- | --- | --- |
| `dt-modal`, `dt-toast`, `dt-tooltip` | Prop name | `show` | `open` | |
| `dt-modal`, `dt-toast`, `dt-tooltip` | Event | `@update:show` | `@update:open` | |
| Many | Prop names | `hide-close`, `hide-icon`, `hide-action`, `hide-clear`, `hide-edges`, `hide-divider`, `hide-actions`, `hide-link-bubble-menu` | `:show-*="false"` | semantics inverted |
| `dt-rich-text-editor`, `dt-recipe-message-input` | Prop name | `prevent-typing` | `:allow-typing="false"` | inverted |
| `dt-popover` | Prop name | `hide-on-click` | `close-on-click` | same semantics |
| Form inputs | Prop name | `label-visible` | `show-label` | |

### Header and title naming

`title` consolidates to `header-text` across components that have a header region.

| Component(s) | Type | Before | After |
| --- | --- | --- | --- |
| `dt-banner`, `dt-notice`, `dt-toast` | Prop name | `title` | `header-text` |
| `dt-banner`, `dt-notice`, `dt-toast` | Prop name | `title-id` | `header-id` |
| `dt-modal` | Prop name | `title` | `header-text` |
| `dt-modal` | Prop name | `banner-title` | `banner-header-text` |
| Any with this slot | Slot | `#titleOverride` | `#header` |
| Any with this slot | Slot | `#labelSlot` | `#label` |
| Any with this slot | Slot | `#headingSlot` | `#heading` |

### `v-model` standardization

Form-state events and props consolidate around the standard Vue `v-model` contract.

| Component(s) | Type | Before | After |
| --- | --- | --- | --- |
| `dt-input`, `dt-radio`, `dt-radio-group`, `dt-combobox-multi-select`, `dt-rich-text-editor`, `dt-input-group` | Event | `@input` | `@update:model-value` |
| `dt-toggle`, `dt-select-menu` | Event | `@change` | `@update:model-value` |
| `dt-checkbox-group` | Prop name | `selectedValues` / `selected-values` | `modelValue` |

### Other renames

| Component(s) | Type | Before | After |
| --- | --- | --- | --- |
| `dt-avatar` | Prop name | `clickable` | `interactive` |

### Removals

| Component(s) | Type | Removed | Replacement |
| --- | --- | --- | --- |
| Any with these props | Prop name | `rootClass`, `root-class`, `wrapperClass`, `containerClass` | Apply classes directly on the component element. Script auto-migrates known components; a small number still require manual attention. |

## `kind`, `type`, `tone`, and `validation-state` Value Renames

Prop values across the system map to a shared set of names. `danger` and `error` both become `critical`. `success` becomes `positive`.

> [!INFO] DtLink: `kind` prop renamed to `tone`
> On `dt-link`, the prop name itself changes from `kind` to `tone`, on top of the value changes. The migration script handles both in one pass: `kind="danger"` becomes `tone="critical"`. The old `kind` prop still works as a deprecated alias if you'd rather migrate gradually.

**Affected components:** [DtBadge](/components/badge.html), [DtBanner](/components/banner.html), [DtButton](/components/button.html), [DtInput](/components/input.html), [DtLink](/components/link.html), [DtModal](/components/modal.html), [DtNotice](/components/notice.html), [DtText](/components/text.html), [DtToast](/components/toast.html), and any component accepting a `kind`, `type`, `tone`, or `validation-state` prop.

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<dt-button kind="danger" />
<dt-banner kind="error" />
<dt-badge type="success" />
<dt-link kind="danger" />
<dt-link kind="success" />
<dt-modal banner-kind="error" />
<dt-modal banner-kind="success" />
<dt-input validation-state="error" />
<dt-checkbox validation-state="success" />
```

</div>
<div>

**After**

```vue
<dt-button kind="critical" />
<dt-banner kind="critical" />
<dt-badge type="positive" />
<dt-link tone="critical" />
<dt-link tone="positive" />
<dt-modal banner-kind="critical" />
<dt-modal banner-kind="positive" />
<dt-input validation-state="critical" />
<dt-checkbox validation-state="positive" />
```

</div>
</div>

## DtBox `surface` / `bc`, DtText `tone-strong`, and DtButton `link-kind` Value Renames

DtBox, DtText, and DtButton each have severity-value props that the original DLT-3157 release missed. The migration script handles all of them.

**Affected components:** [DtBox](/components/box.html), [DtText](/components/text.html), [DtButton](/components/button.html)

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

### Before

```vue
<dt-box surface="success" />
<dt-box surface="success-subtle" />
<dt-box surface="success-strong" />
<dt-box surface="success-opaque" />
<dt-box surface="success-subtle-opaque" />

<dt-box bc="success" />
<dt-box bc="success-subtle" />
<dt-box bc="success-strong" />

<dt-text tone="success">Saved.</dt-text>
<dt-text tone="success-strong">Saved.</dt-text>

<dt-button link-kind="danger">Delete</dt-button>
<dt-button link-kind="success">Confirm</dt-button>
```

</div>
<div>

### After

```vue
<dt-box surface="positive" />
<dt-box surface="positive-subtle" />
<dt-box surface="positive-strong" />
<dt-box surface="positive-opaque" />
<dt-box surface="positive-subtle-opaque" />

<dt-box bc="positive" />
<dt-box bc="positive-subtle" />
<dt-box bc="positive-strong" />

<dt-text tone="positive">Saved.</dt-text>
<dt-text tone="positive-strong">Saved.</dt-text>

<dt-button link-kind="critical">Delete</dt-button>
<dt-button link-kind="positive">Confirm</dt-button>
```

</div>
</div>

## `show` → `open` on Overlay Components

On overlay components, `show` is now `open` and `update:show` is now `update:open`. This matches the `v-model:open` convention already used by `dt-popover`, `dt-dropdown`, and `dt-combobox-with-popover`.

**Affected components:** [DtModal](/components/modal.html), [DtToast](/components/toast.html), [DtTooltip](/components/tooltip.html)

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<dt-modal
  :show="isOpen"
  @update:show="isOpen = $event"
/>

<dt-toast v-model:show="toastVisible" />

<dt-tooltip :show="hovered" />
```

</div>
<div>

**After**

```vue
<dt-modal
  :open="isOpen"
  @update:open="isOpen = $event"
/>

<dt-toast v-model:open="toastVisible" />

<dt-tooltip :open="hovered" />
```

</div>
</div>

## `hide-*` and `prevent-*` Props Renamed (Semantics Inverted)

Boolean props prefixed with `hide-` or `prevent-` are replaced with `show-` or `allow-` equivalents, with the default flipped to `true`. A bare `hide-close` (close button is hidden) becomes `:show-close="false"` (close button is not shown). Bare `prevent-typing` becomes `:allow-typing="false"`.

> [!INFO]
> If you bind a dynamic expression like `:hide-close="someCondition"`, the migration script cannot safely invert it and will warn you. Replace manually with `:show-close="!someCondition"`.

**Affected components:** [DtBanner](/components/banner.html), [DtChip](/components/chip.html), [DtFilterPill](/components/filter-pill.html), [DtModal](/components/modal.html), [DtNotice](/components/notice.html), [DtNoticeAction](/components/notice.html), [DtPagination](/components/pagination.html), [DtRichTextEditor](/components/rich-text-editor.html), [DtRecipeMessageInput](/components/message-input.html), [DtRecipeContactCentersRow](/components/contact-centers-row.html), [DtSegmentedControl](/components/segmented-control.html), [DtToast](/components/toast.html)

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<dt-banner hide-close hide-icon />
<dt-chip hide-close />
<dt-modal hide-close />
<dt-notice hide-close hide-action />
<dt-notice-action hide-close hide-action />
<dt-toast hide-close hide-icon hide-action />
<dt-filter-pill hide-clear />
<dt-pagination hide-edges />
<dt-segmented-control hide-divider />
<dt-rich-text-editor prevent-typing hide-link-bubble-menu />
<dt-recipe-message-input prevent-typing />
<dt-recipe-contact-centers-row hide-actions />
```

</div>
<div>

**After**

```vue
<dt-banner :show-close="false" :show-icon="false" />
<dt-chip :show-close="false" />
<dt-modal :show-close="false" />
<dt-notice :show-close="false" :show-action="false" />
<dt-notice-action :show-close="false" :show-action="false" />
<dt-toast :show-close="false" :show-icon="false" :show-action="false" />
<dt-filter-pill :show-clear="false" />
<dt-pagination :show-edges="false" />
<dt-segmented-control :show-divider="false" />
<dt-rich-text-editor :allow-typing="false" :show-link-bubble-menu="false" />
<dt-recipe-message-input :allow-typing="false" />
<dt-recipe-contact-centers-row :show-actions="false" />
```

</div>
</div>

## `hideOnClick` → `closeOnClick` on DtPopover

`hideOnClick` on `dt-popover` is now `closeOnClick`. Behavior is unchanged; the new name describes what the prop actually does.

**Affected components:** [DtPopover](/components/popover.html)

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<dt-popover hide-on-click />
<dt-popover :hide-on-click="false" />
```

</div>
<div>

**After**

```vue
<dt-popover close-on-click />
<dt-popover :close-on-click="false" />
```

</div>
</div>

## `label-visible` → `show-label`

`label-visible` is now `show-label`, matching the `show-*` convention. Behavior is unchanged. Setting it to `false` visually hides the label while keeping it accessible to screen readers.

**Affected components:** [DtCheckbox](/components/checkbox.html), [DtCombobox](/components/combobox.html), [DtComboboxMultiSelect](/components/combobox-multi-select.html), [DtComboboxWithPopover](/components/combobox-with-popover.html), [DtInput](/components/input.html), [DtRadioGroup](/components/radio-group.html), [DtSelectMenu](/components/select-menu.html), [DtToggle](/components/toggle.html)

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<dt-input label="Name" label-visible="false" />
<dt-checkbox label="Accept" label-visible="false" />
<dt-combobox label="Search" :label-visible="showLabels" />
```

</div>
<div>

**After**

```vue
<dt-input label="Name" show-label="false" />
<dt-checkbox label="Accept" show-label="false" />
<dt-combobox label="Search" :show-label="showLabels" />
```

</div>
</div>

## `title` / `title-id` → `header-text` / `header-id`

`title` is now `header-text` on `dt-banner`, `dt-notice`, `dt-toast`, and `dt-modal`. `title-id` is now `header-id` on `dt-banner`, `dt-notice`, and `dt-toast`; `dt-modal` never had a `title-id` prop. The old names conflicted with the native HTML `title` attribute, which browsers reserve for tooltips.

**Affected components:** [DtBanner](/components/banner.html), [DtModal](/components/modal.html), [DtNotice](/components/notice.html), [DtToast](/components/toast.html)

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<dt-banner title="Payment failed" title-id="banner-hdr" />
<dt-notice title="Your session expires soon" />
<dt-toast title="Changes saved" title-id="toast-hdr" />
<dt-modal title="Confirm delete" />
<dt-modal banner-title="Danger zone" />
```

</div>
<div>

**After**

```vue
<dt-banner header-text="Payment failed" header-id="banner-hdr" />
<dt-notice header-text="Your session expires soon" />
<dt-toast header-text="Changes saved" header-id="toast-hdr" />
<dt-modal header-text="Confirm delete" />
<dt-modal banner-header-text="Danger zone" />
```

</div>
</div>

## `clickable` → `interactive` on DtAvatar

`clickable` on `dt-avatar` is now `interactive`. The new name describes the actual effect: the avatar renders as a `<button>`, becomes keyboard-focusable, and participates in the tab order.

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<dt-avatar full-name="Jane Doe" clickable @click="openProfile" />
```

</div>
<div>

**After**

```vue
<dt-avatar full-name="Jane Doe" interactive @click="openProfile" />
```

</div>
</div>

## `selectedValues` → `v-model` on DtCheckboxGroup

`selectedValues` and `update:selectedValues` on `dt-checkbox-group` now follow the Vue 3 default v-model convention. The prop is named `modelValue` internally, so you can drop the `v-model:selectedValues` argument and use plain `v-model`.

**Affected components:** [DtCheckboxGroup](/components/checkbox-group.html)

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<dt-checkbox-group
  :selected-values="checkedItems"
  @update:selected-values="checkedItems = $event"
/>

<dt-checkbox-group v-model:selectedValues="checkedItems" />
```

</div>
<div>

**After**

```vue
<dt-checkbox-group
  :model-value="checkedItems"
  @update:model-value="checkedItems = $event"
/>

<!-- or simply -->
<dt-checkbox-group v-model="checkedItems" />
```

</div>
</div>

## `@input` and `@change` Events Replaced by `@update:model-value`

Several form components emitted legacy `input` or `change` events alongside (or instead of) `update:modelValue`. The legacy events are gone. Use `@update:model-value` (or `v-model`) instead.

> [!INFO]
> If you were using `v-model` on any of these components, no change is needed — `v-model` already binds to `update:modelValue` internally.

**Affected components:** [DtComboboxMultiSelect](/components/combobox-multi-select.html), [DtInput](/components/input.html), [DtInputGroup](/components/input-group.html), [DtRadio](/components/radio.html), [DtRadioGroup](/components/radio-group.html), [DtRichTextEditor](/components/rich-text-editor.html), [DtSelectMenu](/components/select-menu.html), [DtToggle](/components/toggle.html)

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<dt-input @input="onValue" />
<dt-radio @input="onSelect" />
<dt-radio-group @input="onGroupChange" />
<dt-toggle @change="onToggle" />
<dt-select-menu @change="onSelect" />
<dt-combobox-multi-select @input="onSearch" />
<dt-rich-text-editor @input="onEdit" />
<dt-input-group @input="onGroup" />
```

</div>
<div>

**After**

```vue
<dt-input @update:model-value="onValue" />
<dt-radio @update:model-value="onSelect" />
<dt-radio-group @update:model-value="onGroupChange" />
<dt-toggle @update:model-value="onToggle" />
<dt-select-menu @update:model-value="onSelect" />
<dt-combobox-multi-select @update:model-value="onSearch" />
<dt-rich-text-editor @update:model-value="onEdit" />
<dt-input-group @update:model-value="onGroup" />
```

</div>
</div>

## `rootClass` / `wrapperClass` / `containerClass` Removed

These props are removed from every component that exposed them. They were workarounds for applying classes to a component's root element before Vue 3's `inheritAttrs` approach landed. Apply classes directly on the component; attributes and classes forward automatically.

**Affected components:** [DtAvatar](/components/avatar.html), [DtBreadcrumbItem](/components/breadcrumbs.html), [DtCard](/components/card.html), [DtCheckbox](/components/checkbox.html), [DtFeedItemPill](/components/feed-item-pill.html), [DtFilterPill](/components/filter-pill.html), [DtInput](/components/input.html), [DtModeIsland](/components/mode-island.html), [DtMotionText](/components/motion-text.html), [DtRadio](/components/radio.html), [DtSelectMenu](/components/select-menu.html), [DtSplitButton](/components/split-button.html), [DtToggle](/components/toggle.html)

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<dt-input root-class="d-w332" label="Email" />
<dt-toggle wrapper-class="d-mt16" />
<dt-card container-class="d-mbs-300" />
```

</div>
<div>

**After**

```vue
<dt-input class="d-w332" label="Email" />
<dt-toggle class="d-mt16" />
<dt-card class="d-mbs-300" />
```

</div>
</div>

The migration script handles the following components automatically:

| Component | Removed prop |
| --- | --- |
| [DtInput](/components/input.html), [DtCheckbox](/components/checkbox.html), [DtRadio](/components/radio.html), [DtSelectMenu](/components/select-menu.html), [DtBreadcrumbItem](/components/breadcrumbs.html), [DtSplitButton](/components/split-button.html) | `rootClass` / `root-class` |
| [DtToggle](/components/toggle.html), [DtFeedItemPill](/components/feed-item-pill.html) | `wrapperClass` / `wrapper-class` |
| [DtCard](/components/card.html) | `containerClass` / `container-class` |

> [!WARNING]
> Four components are not in the auto-migration table: [DtAvatar](/components/avatar.html), [DtFilterPill](/components/filter-pill.html), [DtModeIsland](/components/mode-island.html), and [DtMotionText](/components/motion-text.html). The script warns for these. Move the class to the component tag manually.

> [!WARNING]
> If you have both `:root-class="expr"` and `:class="…"` on the same component, the script cannot safely merge the two dynamic bindings. It warns and leaves the tag unchanged. Merge manually.

## Slot Renames

Three slots are renamed to drop the `Override` and `Slot` suffixes from an older naming convention.

| Old name | New name | Component |
| --- | --- | --- |
| `#titleOverride` | `#header` | [DtBanner](/components/banner.html), [DtNotice](/components/notice.html), [DtToast](/components/toast.html) |
| `#labelSlot` | `#label` | [DtInput](/components/input.html), [DtSelectMenu](/components/select-menu.html) |
| `#headingSlot` | `#heading` | [DtListItemGroup](/components/list-item-group.html) |

<div class="d-d-grid d-g-200 d-g-cols1 md:d-g-cols2">
<div>

**Before**

```vue
<dt-banner kind="critical">
  <template #titleOverride>
    <dt-icon name="alert-triangle" /> Payment failed
  </template>
</dt-banner>

<dt-input label="Email">
  <template #labelSlot>
    Work email <span class="d-fc-critical">*</span>
  </template>
</dt-input>

<dt-list-item-group>
  <template #headingSlot>Recent</template>
</dt-list-item-group>
```

</div>
<div>

**After**

```vue
<dt-banner kind="critical">
  <template #header>
    <dt-icon name="alert-triangle" /> Payment failed
  </template>
</dt-banner>

<dt-input label="Email">
  <template #label>
    Work email <span class="d-fc-critical">*</span>
  </template>
</dt-input>

<dt-list-item-group>
  <template #heading>Recent</template>
</dt-list-item-group>
```

</div>
</div>

## Migration Script

`dialtone-migrate-props` automates most of these changes across `.vue`, `.js`, `.ts`, `.html`, `.md`, `.jsx`, and `.tsx` files.

### Dry run (preview changes)

```bash
npx dialtone-migrate-props --dry-run --cwd ./src
```

### Apply changes

```bash
npx dialtone-migrate-props --cwd ./src
```

### Apply without prompting

```bash
npx dialtone-migrate-props --cwd ./src --yes
```

### What the script handles automatically

**Severity vocabulary**

- `kind` and `validation-state` value renames (`danger`/`error`/`success`) on any `dt-*` component
- `type="success"` → `type="positive"` on `dt-badge`
- `kind` → `tone` prop rename on `dt-link`, with value renames applied in the same pass
- `banner-kind` / `bannerKind` value renames on `dt-modal` (`error` → `critical`, `success` → `positive`)
- `tone="success-strong"` → `tone="positive-strong"` on `dt-text` (the bare `tone="success"` is covered by the global `tone` rule above)
- `link-kind="danger"` → `link-kind="critical"` and `link-kind="success"` → `link-kind="positive"` on `dt-button`
- `surface="success*"` → `surface="positive*"` and `bc="success*"` → `bc="positive*"` on `dt-box` (covers `subtle`, `strong`, `opaque`, and `subtle-opaque` variants)

**Visibility and open state**

- `show` → `open`, `@update:show` → `@update:open`, `v-model:show` → `v-model:open`
- `hide-close`, `hide-icon`, `hide-action`, `hide-clear`, `hide-edges`, `hide-divider`, `hide-actions`, `hide-link-bubble-menu` → `:show-*="false"` on all affected components
- `prevent-typing` → `:allow-typing="false"` on `dt-rich-text-editor` and `dt-recipe-message-input`
- `:hide-*="true"` → `:show-*="false"` and `:hide-*="false"` → removed
- `hide-on-click` → `close-on-click` on `dt-popover` (same semantics)
- `label-visible` → `show-label`

**Header and title naming**

- `title` / `title-id` → `header-text` / `header-id`
- `banner-title` → `banner-header-text`
- Slot renames: `#titleOverride` → `#header`, `#labelSlot` → `#label`, `#headingSlot` → `#heading`

**v-model standardization**

- `selected-values` / `selectedValues` → `model-value` and `v-model:selectedValues` → `v-model` on `dt-checkbox-group`
- `@update:selected-values` / `@update:selectedValues` → `@update:model-value` on `dt-checkbox-group`
- `@input` → `@update:model-value` on `dt-input`, `dt-radio`, `dt-radio-group`, `dt-combobox-multi-select`, `dt-rich-text-editor`, `dt-input-group`
- `@change` → `@update:model-value` on `dt-toggle`, `dt-select-menu`

**Other renames**

- `clickable` → `interactive` on `dt-avatar`

**`*Class` removals**

- `root-class` / `rootClass` → `class` on `dt-input`, `dt-checkbox`, `dt-radio`, `dt-select-menu`, `dt-breadcrumb-item`, `dt-split-button`
- `wrapper-class` / `wrapperClass` → `class` on `dt-toggle`, `dt-feed-item-pill`
- `container-class` / `containerClass` → `class` on `dt-card`
- Merges into an existing `class="…"` attribute when one is already present

**Also handled**

- Both kebab-case and camelCase prop variants

### What requires manual review

> [!WARNING]
> The script flags these but won't change them. Automatic conversion would silently break runtime behavior. Review each warning and apply the fix by hand.

- **`:hide-*="someExpression"`**: cannot safely invert a dynamic expression. The script warns with the file and prop. Replace with `:show-*="!(someExpression)"`.
- **`rootClass` on unknown components**: `dt-avatar`, `dt-filter-pill`, `dt-mode-island`, `dt-motion-text` are not in the auto-migration table. The script warns; move the class to the component tag manually.
- **`:root-class="expr"` + `:class="…"` on the same tag**: the script cannot merge two dynamic bindings. It warns and leaves the tag unchanged; merge manually.
