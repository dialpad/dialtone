---
title: Filter Pill
description: A Filter Pill offers a button paired with a popover to show and manage filtering options, the label and
  content of the filter can be handled through slots and props.
status: beta
# storybook: https://dialtone.dialpad.com/vue/?path=/story/components-filter-pill--default @TODO: Uncomment once it's RFP
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
      <dt-stack v-if="defaultSlotValues" direction="row" gap="300">
        <span>{{ defaultSlotText }}</span>
        <strong>=</strong>
        <span>{{ defaultSlotValues }}</span>
      </dt-stack>
      <span v-else>{{ defaultSlotText }}</span>
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
      :label="selectedContentFilter"
      ref="contentSlotExample"
      v-model="contentSlotFiltersArray"
      popover-padding="small"
    >
      <template #content="{ close }">
        <dt-list-item
          v-for="filter in contentSlotFilters"
          :key="filter.name"
          :id="`content-filter-${filter.name}`"
          role="menuitem"
          element-type="li"
          type="default"
          navigation-type="arrow-keys"
          @click="() => {
            selectedContentFilter = filter.name;
            contentSlotFiltersArray = [{name: filter.name, active: true}];
            close();
          }"
        >
          <template v-if="filter.icon" #left>
            <component :is="filter.icon" size="300" />
          </template>
          <span>{{ filter.name }}</span>
          <template v-if="filter.subtitle" #subtitle>
            {{ filter.subtitle }}
          </template>
          <template #right>
            <dt-icon-check
              size="200"
              :class="selectedContentFilter === filter.name ? '' : 'd-o0'"
            />
          </template>
        </dt-list-item>
      </template>
    </dt-filter-pill>
  </dt-stack>
</code-well-header>

## Vue API

<component-vue-api component-name="filterPill"></component-vue-api>

## Classes

<component-class-table component-name="filter-pill"></component-class-table>

<script setup>
import { ref, computed } from 'vue';
import {
  DtIconSearch,
  DtIconClose,
  DtIconCheck,
  DtIconGrid,
  DtIconCheckCircle,
  DtIconArchive,
  DtIconClock
} from '@dialpad/dialtone-icons/vue3';

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
  {name: 'Orange'},
  {name: 'Apple'},
  {name: 'Avocado'},
  {name: 'Grapefruit'},
  {name: 'Grapes'},
]);
const contentSlotFilters = ref([
  {name: 'All Items', subtitle: 'Show everything', icon: DtIconGrid},
  {name: 'Active Only', subtitle: 'Show only active items', icon: DtIconCheckCircle},
  {name: 'Archived', subtitle: 'Show archived items', icon: DtIconArchive},
  {name: 'Recent', subtitle: 'Last 30 days', icon: DtIconClock},
]);
const selectedContentFilter = ref('All Items');
// Initialize with dummy data to satisfy filter pill validation
const contentSlotFiltersArray = ref([{name: 'All Items', active: true}]);
const sizes = Object.keys(window.DIALTONE_CONSTANTS.BUTTON_SIZE_MODIFIERS);
const sizeNames = {
  xs: 'Extra small',
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  xl: 'Extra Large',
};

const defaultSlotText = computed(() => 'Fruit');

const defaultSlotValues = computed(() => {
  const activeItems = defaultSlotFilters.value.filter(item => item.active);
  if (activeItems.length === 0) return '';

  const displayItems = activeItems.slice(0, 2).map(item => item.name);
  if (activeItems.length > 2) {
    displayItems.push(`+${activeItems.length - 2}`);
  }
  return displayItems.join(', ');
});
</script>
