---
title: Filter Pill
description: A Filter Pill offers a button paired with a popover to show and manage filtering options, the label and
  content of the filter can be handled through slots and props.
status: beta
# storybook: https://dialtone.dialpad.com/vue/?path=/story/components-filter-pill--default @TODO: Uncomment once it's RFP
keywords: ["filter tag", "filter chip", "search filter", "d-filter-pill", "DtFilterPill", "dt-filter-pill", "removable tag", "dismissible chip"]
---

<code-well-header>
  <dt-filter-pill
    v-model="exampleFilters"
    label="With header, content and footer"
  >
  </dt-filter-pill>
</code-well-header>

## Variants

### Base

<code-well-header>
  <dt-stack direction="row" gap="400">
      <dt-filter-pill
        label="Simple example"
        v-model="baseFilters"
        ref="simpleExample"
      >
      </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.simpleExample'
vueCode='<dt-filter-pill v-model="[...]" label="..."/>'
showHtmlWarning />

### Disabled

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill label="Disabled filter" disabled ref="disabledFilter"></dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.disabledFilter'
vueCode='<dt-filter-pill v-model="[...]" label="..." disabled/>'
showHtmlWarning />

### Active

<code-well-header>
  <dt-stack direction="row" gap="400">
      <dt-filter-pill
        label="Active example"
        v-model="activeFilters"
        ref="activeExample"
      >
      </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.activeExample'
vueCode='<dt-filter-pill v-model="[...]" label="..."/>'
showHtmlWarning />

### Clearable

You can handle the filter resetting, the button will show whenever an active filter is passed.
It will emit the `reset` event when clicked.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      label="Clearable example"
      ref="clearableExample"
      v-model="clearableFilters"
    >
    </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.clearableExample'
vueCode='<dt-filter-pill label="..." v-model="[...]" />'
showHtmlWarning />

### Non Clearable

Setting the `hide-clear` prop will hide the reset/clear button in case you don't want your filter be reset.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      label="Non Clearable example"
      ref="clearableExample"
      v-model="nonClearableFilters"
      hide-clear
    >
    </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.clearableExample'
vueCode='<dt-filter-pill label="..." v-model="[...]" hide-clear />'
showHtmlWarning />

### Sizes

<code-well-header>
  <dt-stack direction="row" gap="300">
    <dt-filter-pill
      v-for="size in sizes"
      :key="size"
      :label="size"
      :size="size"
      ref="smExample"
    ></dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.smExample[1]'
vueCode='<dt-filter-pill label="..." size="sm" />'
showHtmlWarning />

### With default slot

Using the "default" slot, you're able to override the `label` prop

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      ref="clearableExample"
      v-model="defaultSlotFilters"
    >
      <template #default>
        With Default slot
      </template>
    </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.clearableExample'
vueCode='<dt-filter-pill label="..." v-model="[...]">
  <template #default>
    With Default slot
  </template>
</dt-filter-pill>'
showHtmlWarning />

### With content slot

Using the "content" slot, you're able to override the popover content, this enables you
to create custom filter pill.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      label="With content slot"
      ref="clearableExample"
      v-model="contentSlotFilters"
    >
      <template #content>
        Content slot example
      </template>
    </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.clearableExample'
vueCode='<dt-filter-pill label="..." v-model="[...]">
  <template #content>
    Content slot example
  </template>
</dt-filter-pill>'
showHtmlWarning />

### With custom label (count)

Using the "default" scoped slot, you can display a count of active filters alongside the label.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      v-model="contactCentersBadge"
      label="Contact centers"
      end-tooltip-text="Remove"
      ref="badgeCountExample"
    >
      <template #default="{ label, filters, activeFilters }">
        {{ label }}:
        <strong v-if="activeFilters.length">
          {{ activeFilters.length === filters.length ? 'All' : activeFilters.length }}
        </strong>
      </template>
    </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.badgeCountExample'
vueCode='<dt-filter-pill v-model="filters" label="Contact centers" end-tooltip-text="Remove">
  <template #default="{ label, filters, activeFilters }">
    {{ label }}:
    <strong v-if="activeFilters.length">
      {{ activeFilters.length === filters.length ? &apos;All&apos; : activeFilters.length }}
    </strong>
  </template>
</dt-filter-pill>'
showHtmlWarning />

### With dropdown

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
</dt-filter-pill>'
showHtmlWarning />

### With custom label (radio)

Combining the "default" and "content" slots with a radio group creates a single-select filter.
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

## Vue API

<component-vue-api component-name="filterPill"></component-vue-api>

## Classes

<component-class-table component-name="filter-pill"></component-class-table>

<script setup>
import { ref, computed } from 'vue';
import { DtIconSearch, DtIconClose } from '@dialpad/dialtone-icons/vue3';

const inputValue = ref('');
const exampleFilters = ref([
  {name: 'Option 1'},
  {name: 'Option 2'},
]);
const baseFilters = ref([
  {name: 'Option 1'},
  {name: 'Option 2'},
  {name: 'Option 3'},
]);
const activeFilters = ref([
  {name: 'Option 1'},
  {name: 'Option 2'},
  {name: 'Option 3', active: true}
]);
const clearableFilters = ref([
  {name: 'Option 1'},
  {name: 'Option 2', active: true},
  {name: 'Option 3'}
]);
const nonClearableFilters = ref([
  {name: 'Option 1', active: true},
  {name: 'Option 2'},
  {name: 'Option 3'}
]);
const defaultSlotFilters = ref([
  {name: 'Option 1'},
  {name: 'Option 2'},
]);
const contentSlotFilters = ref([
  {name: 'Option 1'},
  {name: 'Option 2'},
]);
const contactCentersBadge = ref([
  {name: 'Headquarters', active: true},
  {name: 'Westside'},
  {name: 'Downtown', active: true},
  {name: 'Riverside'},
  {name: 'Northgate'},
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
function resetDropdownType () {
  dropdownTypes.value.forEach(f => { f.active = false; });
}
const sizes = Object.keys(window.DIALTONE_CONSTANTS.BUTTON_SIZE_MODIFIERS);
const sizeNames = {
  xs: 'Extra small',
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  xl: 'Extra Large',
};
</script>
