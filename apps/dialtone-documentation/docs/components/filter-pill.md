---
title: Filter Pill
description: Filter control with selectable options in a popover.
status: new
thumb: true
# storybook: https://dialtone.dialpad.com/vue/?path=/story/components-filter-pill--default @TODO: Uncomment once it's RFP
keywords: ["filter tag", "filter chip", "search filter", "d-filter-pill", "DtFilterPill", "dt-filter-pill", "removable tag", "dismissible chip"]
combinator: DtFilterPill
---

Controlled selection, trailing slots and `opened` are unreleased. Dialtone 10.5.1 predates these APIs; use a compatible published release when available.

<!-- @example {"exclude":{"reason":"Controlled options/selected require the DLT-3736 feature release; the current Dialtone 10.5.1 lookup profile predates that API. Withhold until compatible publication and profile qualification.","owner":"DLT-3736 / Dialtone component and lookup maintainers"}} -->

```vue demo-only
<!-- The options/selected API is unreleased. Use a compatible published release when available. -->
<dt-filter-pill
  v-model:selected="heroSelected"
  :options="[{ value: 'all', label: 'All Messages', shortLabel: 'All' }, { value: 'unread', label: 'Unread' }, { value: 'mentions', label: 'Mentions & Reactions', shortLabel: 'Mentions' }]"
  label="Filter by"
  neutral-value="all"
  end-tooltip-text="Clear"
  use-dropdown
/>
```

## Usage

### Key concepts

Controlled `options`/`selected` and the `opened` notification are unreleased. Dialtone 10.5.1, used by the `dt10-pinned` lookup profile, predates these APIs. Use a compatible published release when available.

- Pass an array in `options` when mounting to use controlled selection. `:options="[]"` opts in and supports asynchronous loading. Initial omitted, `undefined`, `null` or non-array options preserve the legacy array contract. A controlled instance stays controlled if later options become invalid; invalid input disables selection until repaired.
- With `use-dropdown`, `selected` is a string or `null`. In the checkbox popover, it is an array of strings. Bind it with `v-model:selected`, or assign it from one `selection-change` handler when the application also needs a business command.
- Options use stable, unique string `value` identities and visible `label` text. `shortLabel` changes only the pill label. Replacing selection, options or translated labels updates the same open control without mutating supplied data.
- `neutral-value` identifies the single-selection choice restored by Clear. Omitted or `null` means no neutral option; an empty string is a valid identity. A `null` `shortLabel` falls back to `label`. It remains checked but does not activate the pill. Multiple selection clears to `[]`. Unknown nonneutral values stay selected and active; no first choice is selected automatically. A multiple summary shows All only when more than one option is available, all are selected and none are unknown. Otherwise it uses the first known label in committed selection order, or Unavailable if none resolve.
- `selection-change` includes `value`, `previousValue`, `reason` and `changed`. Activating the current radio choice still reports `changed: false`, so intentional repeated application actions remain possible. External prop updates do not emit this event. Use one application write path; do not also write selection from `clear`.
- `v-model:open` synchronizes logical overlay visibility. A bound `false` does not veto user opening. Accept `update:open` to keep parent state synchronized: if updates are ignored, repeatedly assigning an unchanged `false` is not an observable close command. Disabling or making the control read-only closes it. Controlled `opened(boolean)` reports the current completed transition separately. Wait for `opened(false)` before removing an open or closing pill.
- Keep the legacy/controlled contract and controlled `use-dropdown` pattern stable for a mounted pill. Use a keyed remount with the matching scalar/array value when switching either. Replacing a controlled option array is an ordinary update. Legacy `use-dropdown` switching retains its existing behavior.

For existing callers, `v-model` still accepts `{ name, active? }[]` and keeps its initial array reference. Mutate those objects in place; replacing that legacy array does not replace the internal reference. The examples under Variants and the existing custom-slot examples retain that contract. Its `activeFilterList` slot binding remains the literal `'All'` for a complete multi-item selection, and `activeFilterOverflow` remains a string such as `'+2'`. Localize application slot text yourself; built-in aggregate and unavailable-selection text uses Dialtone localization. Generated legacy slot metadata now uses the camelCase names `activeFilters`, `activeFilterList`, `activeFilterOverflow` and `pendingFilters`, matching the unchanged runtime bindings.

### Controlled single selection

Controlled single selection is unreleased; Dialtone 10.5.1 predates this API. Use a compatible published release when available. The built-in dropdown renders persistent radio selection separately from keyboard highlight. Moving highlight does not change the selected value. The neutral row supplies the inactive label; the dimension label remains available to assistive technology.

<!-- @example {"id":"examples/docs/components/filter-pill/controlled-single-selection","exclude":{"reason":"Controlled options/selected require the DLT-3736 feature release; the current Dialtone 10.5.1 lookup profile predates that API. Withhold until compatible publication and profile qualification.","owner":"DLT-3736 / Dialtone component and lookup maintainers"}} -->

```vue demo
<!-- The options/selected API is unreleased. Use a compatible published release when available. -->
<dt-filter-pill
  v-model:selected="selectedMessage"
  :options="[{ value: 'all', label: 'All Messages', shortLabel: 'All' }, { value: 'unread', label: 'Unread' }, { value: 'mentions', label: 'Mentions & Reactions', shortLabel: 'Mentions' }]"
  label="Filter by"
  neutral-value="all"
  end-tooltip-text="Clear"
  use-dropdown
/>
```

The page defines `const selectedMessage = ref('all')`. Options can be replaced with new objects while keeping these values. Use `neutral-value=""` with an empty-string neutral option when that is the application's identity; `null` is also a valid unselected scalar.

### Controlled multiple selection

Controlled multiple selection is unreleased; Dialtone 10.5.1 predates this API. Use a compatible published release when available. Checkbox selection uses `ref([])` and a literal option list. `defer-selection` holds edits until Apply. Cancel, Escape and dismissal discard them. A semantically changed committed `selected` value wins over a dirty draft and rebases the open session; replacing it with the same selected identities preserves edits. Adding, removing, relabelling or reordering options also preserves pending edits, including selected identities whose options are temporarily absent. External selection writes made synchronously before or after calling `apply()` win over the draft. A later write after an `await` while Apply is pending can be overwritten; await `apply()` before issuing those later external writes.

<!-- @example {"id":"examples/docs/components/filter-pill/controlled-multiple-selection","exclude":{"reason":"Controlled options/selected require the DLT-3736 feature release; the current Dialtone 10.5.1 lookup profile predates that API. Withhold until compatible publication and profile qualification.","owner":"DLT-3736 / Dialtone component and lookup maintainers"}} -->

```vue demo
<!-- The options/selected API is unreleased. Use a compatible published release when available. -->
<dt-filter-pill
  v-model:selected="selectedChannels"
  :options="[{ value: 'email', label: 'Email' }, { value: 'phone', label: 'Phone' }, { value: 'chat', label: 'Chat' }]"
  label="Channel"
  end-tooltip-text="Clear"
  defer-selection
/>
```

Omit `defer-selection` for immediate checkbox updates. The `content` slot exposes `pendingSelected`, `apply` and `cancel` in controlled deferred mode; legacy content keeps its existing `pendingFilters` binding. In a custom controlled footer, call `apply()` alone: it asynchronously commits and closes on success. Calling `apply(); close()` cancels the pending proposal. Await `apply()` before application work that depends on the proposal finishing; this does not await the closing transition or terminal overlay cleanup. A custom Apply outside a deferred editing session does nothing.

### Closing before removal

The controlled `opened` notification is unreleased; Dialtone 10.5.1 predates it. Use a compatible published release when available. Controlled `open(false)` and `update:open(false)` report the start of closing. They do not signal that focus restoration or modal scroll cleanup has completed. Removing an open or closing pill at that point can leave the page scroll-locked. Keep the pill mounted, with its modal setting, anchor and scroll container unchanged, until `opened(false)` reports the current completed close. A leave cancelled by reopening does not report a completed close.

Use the same sequence before navigation or rebuilding a header: record the requested application action, request closing, then perform the action after `opened(false)`. Keep one selection write path. Immediate unmount inside `selection-change`, logical `open`, or an Apply handler does not follow this sequence. This notification describes that overlay's completed transition; it does not repair ownership of locks from other overlays or changed scroll contexts.

The example requests removal from an open pill's footer and returns focus to the remaining Reset control after removal. An initially closed pill that has never opened can be removed directly. Legacy `open` retains its existing timing; `opened` is a controlled-selection notification.

<!-- @example {"exclude":{"reason":"Terminal close/removal uses a named application handler and component refs beyond bounded lookup setup. The current Dialtone 10.5.1 consumer profile also lacks the controlled selection and opened notification APIs.","owner":"DLT-3736 / Dialtone component and lookup maintainers"}} -->

```vue demo
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    v-if="removalPillVisible"
    v-model:selected="removalSelection"
    :options="[{ value: 'email', label: 'Email' }, { value: 'phone', label: 'Phone' }]"
    label="Channel"
    end-tooltip-text="Clear"
    @opened="onRemovalOpened"
  >
    <template #footerContent="{ close }">
      <dt-button :size="200" @click="removalRequested = true; close()">Remove after closing</dt-button>
    </template>
  </dt-filter-pill>
  <dt-button ref="removalResetButton" :size="200" @click="resetRemovalExample">Reset example</dt-button>
</dt-stack>
```

<dialtone-usage>
<template #do>

- Use to filter a list, table, or other data set by a specific attribute.
- Use the checkbox popover for multiple selection and `use-dropdown` for one choice.
- Provide a dimension `label` and an accessible clear-button name with `end-tooltip-text`.
</template>

<template #dont>

- Don't use as a general-purpose action button or a binary on/off setting.
- Don't mix `model-value` with controlled `options`/`selected`. For legacy arrays, mutate active flags in place.

</template>
</dialtone-usage>

## Labels and counts

Controlled trailing slots are unreleased; Dialtone 10.5.1 predates this API. Use a compatible published release when available. Use `anchorEnd` and `optionEnd` for trailing content while retaining the built-in labels, selection and handlers. This example uses synthetic English counts with singular/plural handling; use the application's plural-aware translations for other locales. Hide the visual badge from assistive technology and supply its meaning as text.

<!-- @example {"exclude":{"reason":"Named application handler, reactive options and computed count setup exceed bounded lookup extraction; the current Dialtone 10.5.1 consumer pin also predates options/selected.","owner":"DLT-3736 / Dialtone component and lookup maintainers"}} -->

```vue demo
<dt-stack gap="200">
  <dt-filter-pill
    :selected="currentMessage"
    :options="messageOptions"
    label="Filter by"
    neutral-value="all"
    end-tooltip-text="Clear"
    use-dropdown
    @selection-change="applyMessageFilter"
  >
    <template #headerContent>Filter by</template>
    <template #anchorEnd="{ selected }">
      <template v-if="selected === 'unread' && unreadCount > 0">
        <dt-badge type="bulletin" kind="count" aria-hidden="true">{{ countText }}</dt-badge>
        <span class="d-vi-visible-sr">, {{ messageCountText }}</span>
      </template>
    </template>
    <template #optionEnd="{ option }">
      <template v-if="option.value === 'unread' && unreadCount > 0">
        <dt-badge type="bulletin" kind="count" aria-hidden="true">{{ countText }}</dt-badge>
        <span class="d-vi-visible-sr">, {{ messageCountText }}</span>
      </template>
    </template>
  </dt-filter-pill>
  <dt-stack direction="row" gap="100">
    <dt-button :size="200" @click="unreadCount = unreadCount === 12 ? 100 : unreadCount === 100 ? 0 : 12">Change count</dt-button>
    <dt-button :size="200" @click="currentMessage = 'mentions'">Set Mentions externally</dt-button>
  </dt-stack>
  <span>Application commands: {{ messageCommands }}</span>
</dt-stack>
```

The handler assigns selection once and can perform an application command, including a deliberate same-value action. Changing the count or setting Mentions externally emits no selection command and keeps an open menu mounted. The badge caps display at `99+` and hides at zero; its accessible text keeps the complete count. A default-slot override can use `{ selected, displayLabel }` and a label map for a known value deliberately absent from the menu, without adding a hidden choice or a second selection array.

## Combined filters

These existing examples use the legacy array contract. Reset updates the same arrays bound to each pill.

```vue demo-only
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    v-model="momentCount"
    label="Moment"
    end-tooltip-text="Remove"
  >
    <template #default="{ label, filters, activeFilters }">
      {{ label }}<template v-if="activeFilters.length">:
      <strong>
        {{ activeFilters.length === filters.length ? 'All' : activeFilters.length }}
      </strong></template>
    </template>
  </dt-filter-pill>
  <dt-filter-pill
    v-model="heroConversationTypes"
    label="Conversation type"
    :start-tooltip-text="selectedHeroConversationType !== 'All Conversations'
      ? 'Conversation type'
      : ''"
    end-tooltip-text="Remove"
    use-dropdown
    @clear="resetHeroConversationType"
  >
    <template #default="{ label }">
      <span
        v-if="selectedHeroConversationType !== 'All Conversations'"
        class="sr-only"
      >{{ label }}: </span>
      {{ selectedHeroConversationType === 'All Conversations'
        ? label
        : selectedHeroConversationType }}
    </template>
    <template #content="{ close }">
      <dt-list-item
        v-for="filter in heroConversationTypes"
        :key="filter.name"
        role="menuitemradio"
        navigation-type="arrow-keys"
        :selected="filter.name === selectedHeroConversationType"
        @click="selectHeroConversationType(filter.name, close)"
      >
        {{ filter.name }}
        <template #selected>
          <dt-icon-check
            size="200"
            :class="{ 'd-vi-hidden': filter.name !== selectedHeroConversationType }"
            aria-hidden="true"
          />
        </template>
      </dt-list-item>
    </template>
  </dt-filter-pill>
  <dt-filter-pill
    v-model="deferredFilters"
    label="Channel"
    end-tooltip-text="Remove"
    popover-footer-class="d-pie-200 d-py-150"
    defer-selection
  >
  </dt-filter-pill>
  <dt-button :size="200" kind="muted" importance="outlined" :disabled="!heroHasActiveFilters" @click="resetHeroFilters">
    Reset
  </dt-button>
</dt-stack>
```

## Variants

### Base

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    :model-value="[{name: 'Email'}, {name: 'Phone'}, {name: 'Chat'}, {name: 'Social'}, {name: 'SMS'}]"
    label="Channel"
  >
  </dt-filter-pill>
</dt-stack>
```

### Active

The pill becomes active when any filter item has `active: true`.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    :model-value="[{name: 'Headquarters', active: true}, {name: 'Westside'}, {name: 'Downtown'}]"
    label="Contact centers"
  >
  </dt-filter-pill>
</dt-stack>
```

### Disabled

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill label="Conversation type" disabled></dt-filter-pill>
</dt-stack>
```

### Read only

Its value is reflected in the filter set but cannot be opened, cleared, or modified. Functionally and visually distinct from disabled.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    :model-value="[{name: 'Headquarters', active: true}, {name: 'Westside', active: true}, {name: 'Downtown'}]"
    label="Contact centers"
    read-only
  ></dt-filter-pill>
</dt-stack>
```

### Size

`200` (small) is the default.

```vue demo
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    v-for="size in sizes"
    :key="size"
    :label="size"
    :size="size"
  ></dt-filter-pill>
</dt-stack>
<!-- @code -->
<dt-filter-pill label="{size}" size="{size}" />
```

## Interaction patterns

Both overlays default to a minimum inline size matching the entire FilterPill, including its Clear button.
Longer content can make the overlay wider. Set `overlay-min-inline-size="300"` to use `--dt-layout-300`,
following DtBox's layout scale. Use `overlay-min-inline-size="0"` for natural content sizing.
The default is `anchor`; `popover-max-width` still caps the overlay.

Popover content defaults to `d-py-100 d-px-150`. Set `popover-padding` to `none`, `small`, `medium`, or `large`
for a uniform padding preset; `large` restores the previous `d-p-200` content padding. For custom padding,
use `popover-padding="none"` with `popover-content-class`, for example `popover-content-class="d-py-150 d-px-200"`.
Header/footer spacing and dropdown padding are unchanged.

### Clearable

A clear button appears when any filter is active. It emits the `clear` event when clicked.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    label="Channel"
    :model-value="[{ name: 'Option 1' }, { name: 'Option 2', active: true }, { name: 'Option 3' }]"
    end-tooltip-text="Remove"
  >
  </dt-filter-pill>
</dt-stack>
```

### Non clearable

Setting the `:show-clear="false"` prop hides the clear button.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    :model-value="[{name: '0–5 min', active: true}, {name: '5–15 min'}, {name: '15–30 min'}, {name: '30+ min'}]"
    label="Duration"
    :show-clear="false"
  >
  </dt-filter-pill>
</dt-stack>
```

### Defer selection

Setting `defer-selection` holds checkbox changes in a pending state until Apply is clicked.
Cancel, Escape, or clicking outside discards pending changes.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    :model-value="[{name: 'Email'}, {name: 'Phone', active: true}, {name: 'Chat'}, {name: 'Social'}, {name: 'SMS'}]"
    label="Channel"
    end-tooltip-text="Remove"
    defer-selection
    popover-footer-class="d-pie-200 d-py-150"
  >
  </dt-filter-pill>
</dt-stack>
```

### Dropdown

Setting `use-dropdown` switches the overlay from a popover to a dropdown with keyboard-navigable
list items. This provides arrow key navigation, highlight management, and Enter/Space selection
out of the box — ideal for single-select filter patterns. Use `role="menuitemradio"` with `:selected` for persistent, mutually exclusive choices; use `menuitem` for actions. The radio role exposes `aria-checked` independently of keyboard highlight. Built-in dropdown rows reserve space for the selected checkmark. For custom content, keep a decorative checkmark in each row and use `d-vi-hidden` on unselected markers, as shown below, to retain its layout space.

```vue demo
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    v-model="dropdownTypes"
    label="Conversation type"
    :start-tooltip-text="selectedDropdownType !== 'All Conversations'
      ? 'Conversation type'
      : ''"
    end-tooltip-text="Remove"
    use-dropdown
    @clear="resetDropdownType"
  >
    <template #default="{ label }">
      <span
        v-if="selectedDropdownType !== 'All Conversations'"
        class="sr-only"
      >{{ label }}: </span>
      {{ selectedDropdownType === 'All Conversations'
        ? label
        : selectedDropdownType }}
    </template>
    <template #content="{ close }">
      <dt-list-item
        v-for="filter in dropdownTypes"
        :key="filter.name"
        role="menuitemradio"
        navigation-type="arrow-keys"
        :selected="filter.name === selectedDropdownType"
        @click="selectDropdownType(filter.name, close)"
      >
        {{ filter.name }}
        <template #selected>
          <dt-icon-check
            size="200"
            :class="{ 'd-vi-hidden': filter.name !== selectedDropdownType }"
            aria-hidden="true"
          />
        </template>
      </dt-list-item>
    </template>
  </dt-filter-pill>
</dt-stack>
<!-- @code -->
<dt-filter-pill
  :model-value="[{name: &apos;All Conversations&apos;}, {name: &apos;Only Calls&apos;}, {name: &apos;Only Meetings&apos;}, {name: &apos;Only Digital&apos;}]"
  label="Conversation type"
  :start-tooltip-text="selectedType !== &apos;All Conversations&apos;
    ? &apos;Conversation type&apos;
    : &apos;&apos;"
  end-tooltip-text="Remove"
  use-dropdown
  @clear="resetType"
>
  <template #default="{ label }">
    <span
      v-if="selectedType !== &apos;All Conversations&apos;"
      class="sr-only"
    >{{ label }}: </span>
    {{ selectedType === &apos;All Conversations&apos;
      ? label
      : selectedType }}
  </template>
  <template #content="{ close }">
    <dt-list-item
      v-for="filter in conversationTypes"
      :key="filter.name"
      role="menuitemradio"
      navigation-type="arrow-keys"
      :selected="filter.name === selectedType"
      @click="selectType(filter.name, close)"
    >
      {{ filter.name }}
      <template #selected>
        <dt-icon-check
          size="200"
          :class="{ 'd-vi-hidden': filter.name !== selectedType }"
          aria-hidden="true"
        />
      </template>
    </dt-list-item>
  </template>
</dt-filter-pill>
```

## Slots

### Default

The `default` slot replaces the built-in anchor-label content. Preserve the filter dimension and current selection in its accessible name; the `label` prop alone does not add that context after you replace the content. See [Labelling guidelines](#labelling-guidelines).

#### Example: Count

Using the `default` scoped slot, you can display a count of active filters alongside the label.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    :model-value="[{name: 'Address', active: true}, {name: 'Call Purpose', active: true}, {name: 'Action Item'}, {name: 'Negative Sentiment'}, {name: 'Warranty Inquiry', active: true}]"
    label="Contact centers"
    end-tooltip-text="Remove"
  >
    <template #default="{ label, filters, activeFilters }">
      {{ label }}<template v-if="activeFilters.length">:
      <strong>
        {{ activeFilters.length === filters.length ? 'All' : activeFilters.length }}
      </strong></template>
    </template>
  </dt-filter-pill>
</dt-stack>
```

#### Example: Active filter list

Shows the first active filter name using `activeFilterList`, with overflow count for remaining selections (e.g., "Email +2").

<!-- @example {"key":"overflow"} -->

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    :model-value="[{name: 'Email', active: true}, {name: 'Phone', active: true}, {name: 'Chat', active: true}, {name: 'Social'}, {name: 'SMS'}]"
    label="Channel"
    end-tooltip-text="Remove"
  >
    <template #default="{ label, filters, activeFilters, activeFilterList, activeFilterOverflow }">
      {{ label }}<template v-if="activeFilters.length">:
      <strong>
        {{ activeFilters.length === filters.length ? 'All' : activeFilterList }}
      </strong>
      <template v-if="activeFilterOverflow"> {{ activeFilterOverflow }}</template></template>
    </template>
  </dt-filter-pill>
</dt-stack>
```

#### Example: Radio selection

Combining the `default` and `content` slots with a radio group creates a single-select filter.
The label updates to show the selected option, and a clear button resets to the default.

<!-- @example {"key":"conversation-type"} -->

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    v-model="conversationTypes"
    label="Conversation type"
    :start-tooltip-text="selectedConversationType !== 'All Conversations'
      ? 'Conversation type'
      : ''"
    end-tooltip-text="Remove"
    @clear="selectedConversationType = 'All Conversations'"
  >
    <template #default="{ label }">
      <span
        v-if="selectedConversationType !== 'All Conversations'"
        class="sr-only"
      >{{ label }}: </span>
      {{ selectedConversationType === 'All Conversations'
        ? label
        : selectedConversationType }}
    </template>
    <template #content>
      <dt-radio-group
        v-model="selectedConversationType"
        aria-label="Conversation type"
        name="conversation-type-doc-filter"
      >
        <dt-radio
          v-for="filter in conversationTypes"
          :key="filter.name"
          :label="filter.name"
          :value="filter.name"
          @update:model-value="$event => selectedConversationType = $event"
        />
      </dt-radio-group>
    </template>
  </dt-filter-pill>
</dt-stack>
```

### Content

Using the `content` slot, you can override the popover content with custom markup.

Controlled slots are unreleased. In the built-in controlled dropdown, `headerContent` supplies a noninteractive heading. A full `content` override owns its headings, accessible naming, roles and keyboard handling; the built-in dropdown heading is not added. Popover headers retain their existing behavior.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    :model-value="[{name: 'Contains'}, {name: 'Starts with'}]"
    label="Keyword"
  >
    <template #content>
      Enter a keyword to filter results
    </template>
  </dt-filter-pill>
</dt-stack>
```

## Content Mode

Filter Pill popover content renders outside the DOM tree. Use the `contentMode` prop to apply color mode (invert, light, dark) to the positioned content. See [Positioned Components](/components/mode-island.html#positioned-components) for details.

```vue demo
<dt-filter-pill content-mode="invert" label="Inverted" :model-value="[{ name: 'Orange', active: true }, { name: 'Apple' }]" end-tooltip-text="Remove" />
<!-- @code -->
<dt-filter-pill content-mode="invert">...</dt-filter-pill>
<dt-filter-pill content-mode="dark">...</dt-filter-pill>
<dt-filter-pill content-mode="light">...</dt-filter-pill>
```

## Accessibility

The filter pill is built on `DtButton` and `DtPopover`/`DtDropdown`, inheriting their keyboard and screen reader support.

### Keyboard interaction

| Key | Action |
| ----- | -------- |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Opens the popover or dropdown; toggles checkboxes inside |
| <kbd>Arrow Up</kbd> / <kbd>Arrow Down</kbd> | Opens the popover; navigates list items in dropdown mode |
| <kbd>Escape</kbd> | Closes the popover or dropdown, discarding pending changes in deferred mode |
| <kbd>Tab</kbd> | Moves focus between the primary button, checkboxes, footer actions, and the clear button |

### ARIA attributes

- The primary button uses `aria-disabled="true"` in read-only mode instead of `disabled`, preserving focusability while indicating the control is not interactive.
- The checkbox group inside the popover receives `aria-label` set to the pill's `label` prop, giving screen readers context for the list of options.
- The clear button uses `aria-label` set to `endTooltipText` (or a localized default), ensuring the icon-only button has an accessible name.

### Labelling guidelines

- Provide a meaningful dimension `label`, such as `Conversation type`. Built-in controlled labels include the dimension and current selection in the accessible name even when only the selection is visible. A separate external visual label is not required.
- When replacing the `default` slot, include both the dimension and current selection in its accessible content. A screen-reader-only prefix, as shown in the custom-label examples, preserves context while keeping the visible label compact. Use `anchorEnd` or `optionEnd` when adding counts without replacing the built-in label.
- Use `start-tooltip-text` to repeat the dimension on hover when helpful. The tooltip does not replace a contextual accessible name; users should still understand the filter when they return focus after selecting a value.
- Provide `end-tooltip-text` for the clear button to give it a meaningful accessible name (e.g., "Remove filter").

## Vue API

<component-vue-api component-name="filterPill"></component-vue-api>

## Classes

<component-class-table component-name="filter-pill"></component-class-table>

<script setup>
import { ref, computed, inject, nextTick } from 'vue';

const removalPillVisible = ref(true);
const removalRequested = ref(false);
const removalSelection = ref(['email']);
const removalResetButton = ref(null);
async function onRemovalOpened (isOpen) {
  if (isOpen || !removalRequested.value) return;
  removalPillVisible.value = false;
  removalRequested.value = false;
  await nextTick();
  removalResetButton.value?.$el?.focus();
}
function resetRemovalExample () {
  removalRequested.value = false;
  removalSelection.value = ['email'];
  removalPillVisible.value = true;
}

const heroSelected = ref('all');
const selectedMessage = ref('all');
const selectedChannels = ref([]);
const currentMessage = ref('all');
const unreadCount = ref(12);
const messageCommands = ref(0);
const messageOptions = ref([
  { value: 'all', label: 'All Messages', shortLabel: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'starred', label: 'Starred' },
  { value: 'mentions', label: 'Mentions & Reactions', shortLabel: 'Mentions' },
]);
const countText = computed(() => unreadCount.value > 99 ? '99+' : String(unreadCount.value));
const messageCountText = computed(() => `${unreadCount.value} unread ${unreadCount.value === 1 ? 'message' : 'messages'}`);
function applyMessageFilter (action) {
  currentMessage.value = action.value;
  messageCommands.value++;
}

const heroConversationTypes = ref([
  {name: 'All Conversations'},
  {name: 'Only Calls'},
  {name: 'Only Meetings'},
  {name: 'Only Digital'},
]);
const selectedHeroConversationType = computed(() => {
  return heroConversationTypes.value.find(f => f.active)?.name || 'All Conversations';
});
function selectHeroConversationType (name, close) {
  heroConversationTypes.value.forEach(f => {
    f.active = name !== 'All Conversations' && f.name === name;
  });
  close();
}
function resetHeroConversationType () {
  heroConversationTypes.value.forEach(f => { f.active = false; });
}
const heroHasActiveFilters = computed(() => {
  return momentCount.value.some(f => f.active) ||
    selectedHeroConversationType.value !== 'All Conversations' ||
    deferredFilters.value.some(f => f.active);
});
function resetHeroFilters () {
  momentCount.value.forEach(f => { delete f.active; });
  heroConversationTypes.value.forEach(f => { f.active = false; });
  deferredFilters.value.forEach(f => { delete f.active; });
}
const deferredFilters = ref([
  {name: 'Email'},
  {name: 'Phone', active: true },
  {name: 'Chat'},
  {name: 'Social'},
  {name: 'SMS'},
]);
const momentCount = ref([
  {name: 'Address', active: true},
  {name: 'Call Purpose', active: true},
  {name: 'Action Item'},
  {name: 'Negative Sentiment'},
  {name: 'Warranty Inquiry', active: true },
]);
const conversationTypes = ref([
  {name: 'All Conversations'},
  {name: 'Only Calls'},
  {name: 'Only Meetings'},
  {name: 'Only Digital'},
]);
const dropdownTypes = ref([
  {name: 'All Conversations'},
  {name: 'Only Calls'},
  {name: 'Only Meetings'},
  {name: 'Only Digital'},
]);
const selectedConversationType = computed({
  get () {
    return conversationTypes.value.find(f => f.active)?.name || 'All Conversations';
  },
  set (newValue) {
    conversationTypes.value.forEach(f => {
      f.active = f.name === newValue && newValue !== 'All Conversations';
    });
  },
});
const selectedDropdownType = computed(() => {
  return dropdownTypes.value.find(f => f.active)?.name || 'All Conversations';
});
function selectDropdownType (name, close) {
  dropdownTypes.value.forEach(f => {
    f.active = name !== 'All Conversations' && f.name === name;
  });
  close();
}
function resetDropdownType () {
  dropdownTypes.value.forEach(f => { f.active = false; });
}
const dialtoneConstants = inject('dialtoneConstants', {});
const sizes = Object.keys(dialtoneConstants.BUTTON_SIZE_MODIFIERS ?? {}).filter(k => /^\d+$/.test(k));
</script>
