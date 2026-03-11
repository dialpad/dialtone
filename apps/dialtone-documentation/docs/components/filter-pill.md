---
title: Filter Pill
description: A Filter Pill offers a button paired with a popover to show and manage filtering options, the label and
  content of the filter can be handled through slots and props.
status: beta
# storybook: https://dialtone.dialpad.com/vue/?path=/story/components-filter-pill--default @TODO: Uncomment once it's RFP
keywords: ["filter tag", "filter chip", "search filter", "d-filter-pill", "DtFilterPill", "dt-filter-pill", "removable tag", "dismissible chip"]
---

<code-well-header>
  <dt-stack direction="row" gap="400">
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
      v-model="deferredFilters"
      label="Channel"
      end-tooltip-text="Remove"
      defer-selection
    >
    </dt-filter-pill>
    <dt-button size="sm" kind="muted" importance="outlined" :disabled="!heroHasActiveFilters" @click="resetHeroFilters">
      Reset
    </dt-button>
  </dt-stack>
</code-well-header>

<!-- ## Usage

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
- Keep labels short and scannable — a noun describing the category ("Channel", "Duration", "CSAT").
- Provide `end-tooltip-text` on the clear button so it has an accessible name for screen readers.
</template>

<template #dont>

- Don't use as a general-purpose action button — filter pills are for narrowing data, not triggering commands.
- Don't use for binary on/off settings — use a [Toggle](toggle.md) instead.
- Don't nest filter pills inside another filter pill's popover.
- Don't omit `label` and the `default` slot — the pill must always have visible text identifying the filter category.
- Don't replace the array with `map` when toggling active state — mutate objects in-place with `forEach` to keep the pill's internal copy in sync.
</template>

</dialtone-usage> -->

## Variants

### Base

<code-well-header>
  <dt-stack direction="row" gap="400">
      <dt-filter-pill
        label="Channel"
        v-model="baseFilters"
        ref="simpleExample"
      >
      </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.simpleExample'
vueCode='<dt-filter-pill v-model="[...]" label="Channel" />'
showHtmlWarning />

### Active

The pill becomes active when any filter item has `active: true`.

<code-well-header>
  <dt-stack direction="row" gap="400">
      <dt-filter-pill
        label="Contact centers"
        v-model="activeFilters"
        ref="activeExample"
      >
      </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.activeExample'
vueCode='<dt-filter-pill v-model="[...]" label="Contact centers" />'
showHtmlWarning />

### Disabled

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill label="Conversation type" disabled ref="disabledFilter"></dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.disabledFilter'
vueCode='<dt-filter-pill label="Conversation type" disabled />'
showHtmlWarning />

### Read only

Its value is reflected in the filter set but cannot be opened, cleared, or modified. Functionally and visually distinct from disabled.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      v-model="readOnlyFilters"
      label="Contact centers"
      read-only
      ref="readOnlyExample"
    ></dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.readOnlyExample'
vueCode='<dt-filter-pill v-model="[...]" label="Contact centers" read-only />'
showHtmlWarning />

### Size

`sm` is the default.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      v-for="size in sizes"
      :key="size"
      :label="size"
      :size="size"
      label="Contact centers"
      ref="sizeExample"
    ></dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.sizeExample[1]'
vueCode='<dt-filter-pill label="..." size="{size}" />'
showHtmlWarning />

## Interaction patterns

### Clearable

A clear button appears when any filter is active. It emits the `reset` event when clicked.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      label="Channel"
      ref="clearableExample"
      v-model="clearableFilters"
    >
    </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.clearableExample'
vueCode='<dt-filter-pill label="Channel" v-model="[...]" />'
showHtmlWarning />

### Non clearable

Setting the `hide-clear` prop hides the reset/clear button.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      label="Duration"
      ref="nonClearableExample"
      v-model="nonClearableFilters"
      hide-clear
    >
    </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.nonClearableExample'
vueCode='<dt-filter-pill label="Duration" v-model="[...]" hide-clear />'
showHtmlWarning />

### Deferred selection

Setting `defer-selection` holds checkbox changes in a pending state until Apply is clicked.
Cancel, Escape, or clicking outside discards pending changes.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      v-model="deferredFilters"
      label="Channel"
      end-tooltip-text="Remove"
      defer-selection
      ref="deferredExample"
    >
    </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.deferredExample'
vueCode='<dt-filter-pill v-model="[...]" label="Channel" defer-selection />'
showHtmlWarning />

## With dropdown

Setting `use-dropdown` switches the overlay from a popover to a dropdown with keyboard-navigable
list items. This provides arrow key navigation, highlight management, and Enter/Space selection
out of the box — ideal for single-select filter patterns.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      v-model="dropdownTypes"
      :start-tooltip-text="selectedDropdownType !== 'All Conversations'
        ? 'Conversation type'
        : ''"
      end-tooltip-text="Remove"
      use-dropdown
      ref="dropdownExample"
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
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.dropdownExample'
vueCode='<dt-filter-pill
  v-model="conversationTypes"
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
</dt-filter-pill>'
showHtmlWarning />

## Custom labels

### Example: Count

Using the `default` scoped slot, you can display a count of active filters alongside the label.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      v-model="momentCount"
      label="Contact centers"
      end-tooltip-text="Remove"
      ref="badgeCountExample"
    >
      <template #default="{ label, filters, activeFilters }">
        {{ label }}<template v-if="activeFilters.length">:
        <strong>
          {{ activeFilters.length === filters.length ? 'All' : activeFilters.length }}
        </strong></template>
      </template>
    </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.badgeCountExample'
vueCode='<dt-filter-pill v-model="filters" label="Contact centers" end-tooltip-text="Remove">
  <template #default="{ label, filters, activeFilters }">
    {{ label }}<template v-if="activeFilters.length">:
    <strong>
      {{ activeFilters.length === filters.length ? &apos;All&apos; : activeFilters.length }}
    </strong></template>
  </template>
</dt-filter-pill>'
showHtmlWarning />

### Example: Active filter list

Shows the first active filter name using `activeFilterList`, with overflow count for remaining selections (e.g., "Email +2").

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      v-model="channelsFilterList"
      label="Channel"
      end-tooltip-text="Remove"
      ref="filterListExample"
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
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.filterListExample'
vueCode='<dt-filter-pill v-model="filters" label="Channel" end-tooltip-text="Remove">
  <template #default="{ label, filters, activeFilters, activeFilterList, activeFilterOverflow }">
    {{ label }}<template v-if="activeFilters.length">:
    <strong>
      {{ activeFilters.length === filters.length ? &apos;All&apos; : activeFilterList }}
    </strong>
    <template v-if="activeFilterOverflow"> {{ activeFilterOverflow }}</template></template>
  </template>
</dt-filter-pill>'
showHtmlWarning />

### Example: Radio selection

Combining the `default` and `content` slots with a radio group creates a single-select filter.
The label updates to show the selected option, and a clear button resets to the default.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      v-model="conversationTypes"
      :start-tooltip-text="selectedConversationType !== 'All Conversations'
        ? 'Conversation type'
        : ''"
      end-tooltip-text="Remove"
      ref="radioExample"
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
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.radioExample'
vueCode='<dt-filter-pill
  v-model="conversationTypes"
  :start-tooltip-text="selectedConversationType !== &apos;All Conversations&apos;
    ? &apos;Conversation type&apos;
    : &apos;&apos;"
  end-tooltip-text="Remove"
  @clear="selectedConversationType = &apos;All Conversations&apos;"
>
  <template #default>
    {{ selectedConversationType === &apos;All Conversations&apos;
      ? &apos;Conversation type&apos;
      : selectedConversationType }}
  </template>
  <template #content>
    <dt-radio-group v-model="selectedConversationType" name="conversation-type-filter">
      <dt-radio
        v-for="filter in conversationTypes"
        :key="filter.name"
        :label="filter.name"
        :value="filter.name"
        @input="$event => selectedConversationType = $event"
      />
    </dt-radio-group>
  </template>
</dt-filter-pill>'
showHtmlWarning />

## Slots

### Default slot

Using the `default` slot, you can override the `label` prop.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      ref="defaultSlotExample"
      v-model="defaultSlotFilters"
    >
      <template #default>
        CSAT score
      </template>
    </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.defaultSlotExample'
vueCode='<dt-filter-pill v-model="[...]">
  <template #default>
    CSAT score
  </template>
</dt-filter-pill>'
showHtmlWarning />

### Content slot

Using the `content` slot, you can override the popover content with custom markup.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      label="Keyword"
      ref="contentSlotExample"
      v-model="contentSlotFilters"
    >
      <template #content>
        Enter a keyword to filter results
      </template>
    </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.contentSlotExample'
vueCode='<dt-filter-pill label="Keyword" v-model="[...]">
  <template #content>
    Enter a keyword to filter results
  </template>
</dt-filter-pill>'
showHtmlWarning />

## Overlay customization

### Header and footer slots

The `headerContent` and `footerContent` slots let you customize the popover header and footer.
Both receive a `close` binding; `footerContent` also provides `apply` and `cancel` for deferred-selection workflows.

When `deferSelection` is true and no `#footerContent` slot is provided, the default Cancel/Apply footer renders as before.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      v-model="overlayCustomFilters"
      label="Custom overlay"
      ref="overlayCustomExample"
    >
      <template #headerContent>
        <strong class="d-pl16">Pick your filters</strong>
      </template>
      <template #footerContent="{ close }">
        <div class="d-d-flex d-jc-flex-end d-pr16">
          <dt-button size="sm" importance="primary" @click="close">Done</dt-button>
        </div>
      </template>
    </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.overlayCustomExample'
vueCode='<dt-filter-pill v-model="[...]" label="Custom overlay">
  <template #headerContent>
    <strong>Pick your filters</strong>
  </template>
  <template #footerContent="{ close }">
    <div class="d-d-flex d-jc-flex-end d-pr16">
      <dt-button size="sm" importance="primary" @click="close">Done</dt-button>
    </div>
  </template>
</dt-filter-pill>'
showHtmlWarning />

### Overlay class props

Use `popoverContentClass`, `popoverHeaderClass`, `popoverFooterClass`, and `popoverDialogClass`
to pass custom CSS classes to the underlying popover areas. In dropdown mode, use `dropdownListClass`
to style the list wrapper.

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

const heroChannels = ref([
  {name: 'Email'},
  {name: 'Phone'},
  {name: 'Chat'},
  {name: 'Social'},
  {name: 'SMS'},
]);
const heroContactCenters = ref([
  {name: 'Headquarters', active: true},
  {name: 'Westside'},
  {name: 'Downtown', active: true},
  {name: 'Riverside'},
  {name: 'Northgate'},
]);
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
const heroDuration = ref([
  {name: '0–5 min', active: true},
  {name: '5–15 min'},
  {name: '15–30 min'},
  {name: '30+ min'},
]);
const heroChannelOverflow = ref([
  {name: 'Email', active: true},
  {name: 'Phone', active: true},
  {name: 'Chat', active: true},
  {name: 'Social'},
  {name: 'SMS'},
]);
const heroReadOnly = ref([
  {name: 'Past 7 days'},
  {name: 'Past 30 days', active: true},
  {name: 'Past 90 days'},
]);
const baseFilters = ref([
  {name: 'Email'},
  {name: 'Phone'},
  {name: 'Chat'},
  {name: 'Social'},
  {name: 'SMS'},
]);
const activeFilters = ref([
  {name: 'Headquarters', active: true},
  {name: 'Westside'},
  {name: 'Downtown'},
]);
const readOnlyFilters = ref([
  {name: 'Headquarters', active: true},
  {name: 'Westside', active: true},
  {name: 'Downtown'},
]);
const clearableFilters = ref([
  {name: 'Email', active: true},
  {name: 'Phone'},
  {name: 'Chat'},
  {name: 'Social'},
  {name: 'SMS'},
]);
const nonClearableFilters = ref([
  {name: '0–5 min', active: true},
  {name: '5–15 min'},
  {name: '15–30 min'},
  {name: '30+ min'},
]);
const deferredFilters = ref([
  {name: 'Email'},
  {name: 'Phone', active: true },
  {name: 'Chat'},
  {name: 'Social'},
  {name: 'SMS'},
]);
const defaultSlotFilters = ref([
  {name: '1 Star'},
  {name: '2 Stars'},
  {name: '3 Stars'},
  {name: '4 Stars'},
  {name: '5 Stars'},
]);
const contentSlotFilters = ref([
  {name: 'Contains'},
  {name: 'Starts with'},
]);
const overlayCustomFilters = ref([
  {name: 'Email'},
  {name: 'Phone'},
  {name: 'Chat'},
]);
const momentCount = ref([
  {name: 'Address', active: true},
  {name: 'Call Purpose', active: true},
  {name: 'Action Item'},
  {name: 'Negative Sentiment'},
  {name: 'Warranty Inquiry', active: true },
]);
const channelsFilterList = ref([
  {name: 'Email', active: true},
  {name: 'Phone', active: true},
  {name: 'Chat', active: true},
  {name: 'Social'},
  {name: 'SMS'},
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
const sizes = Object.keys(window.DIALTONE_CONSTANTS.BUTTON_SIZE_MODIFIERS);
</script>
