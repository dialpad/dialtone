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

## Vue API

<component-vue-api component-name="filterPill"></component-vue-api>

## Classes

<component-class-table component-name="filter-pill"></component-class-table>

<script setup>
import { ref } from 'vue';
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
const sizes = Object.keys(window.DIALTONE_CONSTANTS.BUTTON_SIZE_MODIFIERS);
const sizeNames = {
  xs: 'Extra small',
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  xl: 'Extra Large',
};
</script>
