---
title: Filter Pill
description: A Filter Pill offers a button paired with a popover to show and manage filtering options, the label and
  content of the filter can be handled through slots and props.
status: beta
# storybook: https://dialtone.dialpad.com/vue/?path=/story/components-filter-pill--default @TODO: Uncomment once it's RFP
keywords: ["filter tag", "filter chip", "search filter", "d-filter-pill", "DtFilterPill", "dt-filter-pill", "removable tag", "dismissible chip"]
---

```vue demo-only
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    :model-value="[{name: 'Address', active: true}, {name: 'Call Purpose', active: true}, {name: 'Action Item'}, {name: 'Negative Sentiment'}, {name: 'Warranty Inquiry', active: true}]"
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
    :start-tooltip-text="selectedHeroConversationType !== 'All Conversations'
      ? 'Conversation type'
      : ''"
    end-tooltip-text="Remove"
    use-dropdown
    @clear="resetHeroConversationType"
  >
    <template #default>
      {{ selectedHeroConversationType === 'All Conversations'
        ? 'Conversation type'
        : selectedHeroConversationType }}
    </template>
    <template #content="{ close }">
      <dt-list-item
        v-for="filter in heroConversationTypes"
        :key="filter.name"
        role="menuitem"
        navigation-type="arrow-keys"
        :selected="filter.name === selectedHeroConversationType"
        @click="selectHeroConversationType(filter.name, close)"
      >
        {{ filter.name }}
      </dt-list-item>
    </template>
  </dt-filter-pill>
  <dt-filter-pill
    :model-value="[{name: 'Email'}, {name: 'Phone', active: true}, {name: 'Chat'}, {name: 'Social'}, {name: 'SMS'}]"
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

<component-combinator component-name="DtFilterPill" />

## Usage

### Key concepts

- `v-model` expects an array of `{ name, active? }` objects. The pill is "active" when any item has `active: true`.
- The `default` scoped slot overrides the pill label and receives: `{ label, filters, activeFilters, activeFilterList, activeFilterOverflow }`.
- The `content` slot overrides the popover body, replacing the default checkbox list with custom content (e.g., radio groups).
- **In-place mutation**: The pill copies the `modelValue` array at mount. To keep active state in sync, mutate objects with `forEach` rather than replacing the array with `map`.

<dialtone-usage>
<template #do>

- Use to filter a list, table, or other data set by a specific attribute (e.g., channel, contact center, date range).
- Use the default checkbox popover for multi-select filters where several options can be active at once.
- Use `use-dropdown` for single-select filters where only one option applies at a time (e.g., conversation type).
- Provide `end-tooltip-text` on the clear button so it has an accessible name for screen readers.
</template>

<template #dont>

- Don't use as a general-purpose action button — filter pills are for narrowing data, not triggering commands.
- Don't use for binary on/off settings — use a [Toggle](toggle.md).
- Don't omit `label` and the `default` slot — the pill must always have visible text identifying the filter category.
- Don't replace the array with `map` when toggling active state — mutate objects in-place with `forEach` to keep the pill's internal copy in sync.
</template>

</dialtone-usage>

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

### Clearable

A clear button appears when any filter is active. It emits the `reset` event when clicked.

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

Setting the `:show-clear="false"` prop hides the reset/clear button.

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
out of the box — ideal for single-select filter patterns.

```vue demo
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    v-model="dropdownTypes"
    :start-tooltip-text="selectedDropdownType !== 'All Conversations'
      ? 'Conversation type'
      : ''"
    end-tooltip-text="Remove"
    use-dropdown
    @clear="resetDropdownType"
  >
    <template #default>
      {{ selectedDropdownType === 'All Conversations'
        ? 'Conversation type'
        : selectedDropdownType }}
    </template>
    <template #content="{ close }">
      <dt-list-item
        v-for="filter in dropdownTypes"
        :key="filter.name"
        role="menuitem"
        navigation-type="arrow-keys"
        :selected="filter.name === selectedDropdownType"
        @click="selectDropdownType(filter.name, close)"
      >
        {{ filter.name }}
      </dt-list-item>
    </template>
  </dt-filter-pill>
</dt-stack>
<!-- @code -->
<dt-filter-pill
  :model-value="[{name: &apos;All Conversations&apos;}, {name: &apos;Only Calls&apos;}, {name: &apos;Only Meetings&apos;}, {name: &apos;Only Digital&apos;}]"
  :start-tooltip-text="selectedType !== &apos;All Conversations&apos;
    ? &apos;Conversation type&apos;
    : &apos;&apos;"
  end-tooltip-text="Remove"
  use-dropdown
  @clear="resetType"
>
  <template #default>
    {{ selectedType === &apos;All Conversations&apos;
      ? &apos;Conversation type&apos;
      : selectedType }}
  </template>
  <template #content="{ close }">
    <dt-list-item
      v-for="filter in conversationTypes"
      :key="filter.name"
      role="menuitem"
      navigation-type="arrow-keys"
      :selected="filter.name === selectedType"
      @click="selectType(filter.name, close)"
    >
      {{ filter.name }}
    </dt-list-item>
  </template>
</dt-filter-pill>
```

## Slots

### Default

Using the `default` slot, you can override the `label` prop.

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

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    :model-value="[{name: 'All Conversations'}, {name: 'Only Calls'}, {name: 'Only Meetings'}, {name: 'Only Digital'}]"
    :start-tooltip-text="selectedConversationType !== 'All Conversations'
      ? 'Conversation type'
      : ''"
    end-tooltip-text="Remove"
    @clear="selectedConversationType = 'All Conversations'"
  >
    <template #default>
      {{ selectedConversationType === 'All Conversations'
        ? 'Conversation type'
        : selectedConversationType }}
    </template>
    <template #content>
      <dt-radio-group
        v-model="selectedConversationType"
        name="conversation-type-doc-filter"
      >
        <dt-radio
          v-for="filter in conversationTypes"
          :key="filter.name"
          :label="filter.name"
          :value="filter.name"
          @input="$event => selectedConversationType = $event"
        />
      </dt-radio-group>
    </template>
  </dt-filter-pill>
</dt-stack>
```

### Content

Using the `content` slot, you can override the popover content with custom markup.

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

## Vue API

<component-vue-api component-name="filterPill"></component-vue-api>

## Accessibility

The filter pill is built on `DtButton` and `DtPopover`/`DtDropdown`, inheriting their keyboard and screen reader support.

### Keyboard interaction

| Key | Action |
|-----|--------|
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Opens the popover or dropdown; toggles checkboxes inside |
| <kbd>Arrow Up</kbd> / <kbd>Arrow Down</kbd> | Opens the popover; navigates list items in dropdown mode |
| <kbd>Escape</kbd> | Closes the popover or dropdown, discarding pending changes in deferred mode |
| <kbd>Tab</kbd> | Moves focus between the primary button, checkboxes, footer actions, and the clear button |

### ARIA attributes

- The primary button uses `aria-disabled="true"` in read-only mode instead of `disabled`, preserving focusability while indicating the control is not interactive.
- The checkbox group inside the popover receives `aria-label` set to the pill's `label` prop, giving screen readers context for the list of options.
- The clear button uses `aria-label` set to `endTooltipText` (or a localized default), ensuring the icon-only button has an accessible name.

### Labelling guidelines

- Always provide a `label` prop or populate the `default` slot so the pill has visible text.
- When active filters change the visible label (e.g., radio selection patterns), set `start-tooltip-text` to the original label so the full context remains available on hover and to assistive technology.
- Provide `end-tooltip-text` for the clear button to give it a meaningful accessible name (e.g., "Remove filter").

## Classes

<component-class-table component-name="filter-pill"></component-class-table>

<script setup>
import { ref, computed } from 'vue';

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
const sizes = Object.keys(window.DIALTONE_CONSTANTS.BUTTON_SIZE_MODIFIERS).filter(k => /^\d+$/.test(k));
</script>
