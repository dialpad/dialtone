---
title: Filter Pill
description: A Filter Pill offers a button paired with a popover to show and manage filtering options, the label and
  content of the filter can be handled through slots and props.
status: beta
# storybook: https://dialtone.dialpad.com/vue/?path=/story/components-filter-pill--default @TODO: Uncomment once it's RFP
keywords: ["filter tag", "filter chip", "search filter", "d-filter-pill", "DtFilterPill", "dt-filter-pill", "removable tag", "dismissible chip"]
---

<!-- <code-well-header>
  <dt-filter-pill
    v-model="exampleFilters"
    label="With header, content and footer"
  >
  </dt-filter-pill>
</code-well-header> -->

<component-combinator component-name="DtFilterPill" />

## Variants

### Base

<code-well-header>
  <dt-stack direction="row" gap="400">
      <dt-filter-pill
        label="Simple example"
        :model-value="[{ name: 'Option 1' }, { name: 'Option 2' }, { name: 'Option 3' }]"
        end-tooltip-text="Remove"
        ref="simpleExample"
      >
      </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.simpleExample'
vueCode='<dt-filter-pill
  v-model="filters"
  label="Simple example"
  end-tooltip-text="Remove"
/>
// filters = [{ name: &quot;Option 1&quot; }, { name: &quot;Option 2&quot; }, { name: &quot;Option 3&quot; }]'
showHtmlWarning />

### Disabled

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill label="Disabled filter" disabled :model-value="[{ name: 'Option 1' }, { name: 'Option 2' }, { name: 'Option 3' }]" end-tooltip-text="Remove" ref="disabledFilter"></dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.disabledFilter'
vueCode='<dt-filter-pill
  v-model="filters"
  label="Disabled filter"
  end-tooltip-text="Remove"
  disabled
/>
// filters = [{ name: &quot;Option 1&quot; }, { name: &quot;Option 2&quot; }, { name: &quot;Option 3&quot; }]'
showHtmlWarning />

### Active

<code-well-header>
  <dt-stack direction="row" gap="400">
      <dt-filter-pill
        label="Active example"
        :model-value="[{ name: 'Option 1' }, { name: 'Option 2' }, { name: 'Option 3', active: true }]"
        end-tooltip-text="Remove"
        ref="activeExample"
      >
      </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.activeExample'
vueCode='<dt-filter-pill
  v-model="filters"
  label="Active example"
  end-tooltip-text="Remove"
/>
// filters = [{ name: &quot;Option 1&quot; }, { name: &quot;Option 2&quot; }, { name: &quot;Option 3&quot;, active: true }]'
showHtmlWarning />

### Clearable

You can handle the filter resetting, the button will show whenever an active filter is passed.
It will emit the `reset` event when clicked.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      label="Clearable example"
      ref="clearableExample"
      :model-value="[{ name: 'Option 1' }, { name: 'Option 2', active: true }, { name: 'Option 3' }]"
      end-tooltip-text="Remove"
    >
    </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.clearableExample'
vueCode='<dt-filter-pill
  v-model="filters"
  label="Clearable example"
  end-tooltip-text="Remove"
/>
// filters = [{ name: &quot;Option 1&quot; }, { name: &quot;Option 2&quot;, active: true }, { name: &quot;Option 3&quot; }]'
showHtmlWarning />

### Non Clearable

Setting the `hide-clear` prop will hide the reset/clear button in case you don't want your filter be reset.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      label="Non Clearable example"
      ref="nonClearableExample"
      :model-value="[{ name: 'Option 1', active: true }, { name: 'Option 2' }, { name: 'Option 3' }]"
      end-tooltip-text="Remove"
      hide-clear
    >
    </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.nonClearableExample'
vueCode='<dt-filter-pill
  v-model="filters"
  label="Non Clearable example"
  end-tooltip-text="Remove"
  hide-clear
/>
// filters = [{ name: &quot;Option 1&quot;, active: true }, { name: &quot;Option 2&quot; }, { name: &quot;Option 3&quot; }]'
showHtmlWarning />

### Sizes

<code-well-header>
  <dt-stack direction="row" gap="300">
    <dt-filter-pill
      v-for="size in sizes"
      :key="size"
      :label="size"
      :size="size"
      end-tooltip-text="Remove"
      ref="smExample"
    ></dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.smExample[1]'
vueCode='<dt-filter-pill label="..." size="sm" end-tooltip-text="Remove" />'
showHtmlWarning />

### With default slot

Using the "default" slot, you're able to override the `label` prop

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      ref="defaultSlotExample"
      :model-value="[{ name: 'Option 1' }, { name: 'Option 2' }]"
      end-tooltip-text="Remove"
    >
      <template #default>
        With Default slot
      </template>
    </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.defaultSlotExample'
vueCode='<dt-filter-pill v-model="filters" end-tooltip-text="Remove">
  <template #default>
    With Default slot
  </template>
</dt-filter-pill>
// filters = [{ name: &quot;Option 1&quot; }, { name: &quot;Option 2&quot; }]'
showHtmlWarning />

### With content slot

Using the "content" slot, you're able to override the popover content, this enables you
to create custom filter pill.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      label="With content slot"
      ref="contentSlotExample"
      :model-value="[{ name: 'Option 1' }, { name: 'Option 2' }]"
      end-tooltip-text="Remove"
    >
      <template #content>
        Content slot example
      </template>
    </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.contentSlotExample'
vueCode='<dt-filter-pill v-model="filters" label="With content slot" end-tooltip-text="Remove">
  <template #content>
    Content slot example
  </template>
</dt-filter-pill>
// filters = [{ name: &quot;Option 1&quot; }, { name: &quot;Option 2&quot; }]'
showHtmlWarning />

## Content Mode

Filter Pill popover content renders outside the DOM tree. Use the `contentMode` prop to apply color mode (invert, light, dark) to the positioned content. See [Positioned Components](/components/mode-island.html#positioned-components) for details.

<code-well-header>
  <dt-filter-pill content-mode="invert" label="Inverted" :model-value="[{ name: 'Orange', active: true }, { name: 'Apple' }]" end-tooltip-text="Remove" />
</code-well-header>

<code-example-tabs
vueCode='
<dt-filter-pill content-mode="invert">...</dt-filter-pill>
<dt-filter-pill content-mode="dark">...</dt-filter-pill>
<dt-filter-pill content-mode="light">...</dt-filter-pill>
'
/>

## Vue API

<component-vue-api component-name="filterPill"></component-vue-api>

## Classes

<component-class-table component-name="filter-pill"></component-class-table>

<script setup>
const sizes = Object.keys(window.DIALTONE_CONSTANTS.BUTTON_SIZE_MODIFIERS);
</script>
