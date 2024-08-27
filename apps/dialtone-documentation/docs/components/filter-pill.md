---
title: Filter Pill
description: A Filter Pill offers a button paired with a popover to show and manage filtering options, the label and state of the filter can be handled through events and props.
status: beta
# storybook: https://dialtone.dialpad.com/vue/?path=/story/components-filter-pill--default @TODO: Uncomment once it's RFP
---

<code-well-header>
  <dt-filter-pill
    label="With header, content and footer"
  >
    <template #headerContent>
      <div class="d-mr16">
        <dt-input
          v-model="inputValue"
          aria-label="Search items"
          placeholder="Search Items"
          type="text"
        >
          <template #leftIcon="{ iconSize }">
            <dt-icon-search
              :size="iconSize"
            />
          </template>
          <template
            #rightIcon="{ clear }"
          >
            <dt-button
              kind="muted"
              importance="clear"
              size="xs"
              circle
              aria-label="Clear search"
              @click="clear"
            >
              <template #icon="{ iconSize }">
                <dt-icon-close
                  :size="iconSize"
                />
              </template>
            </dt-button>
          </template>
        </dt-input>
      </div>
    </template>
    <template #content>
      <dt-checkbox
        v-for="option in options"
        :key="option"
        :label="option"
      />
    </template>
    <template #footerContent>
      <div class="d-ta-right d-pr16">
        <dt-button
          kind="muted"
          importance="outlined"
          size="sm"
        >
          Apply
        </dt-button>
      </div>
    </template>
  </dt-filter-pill>
</code-well-header>

## Variants

### Base

<code-well-header>
  <dt-stack direction="row" gap="400">
      <dt-filter-pill
        label="Simple example"
        ref="simpleExample"
      >
        <template #content>
          Main content
        </template>
      </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.simpleExample'
vueCode='
<dt-filter-pill label="Simple example">
  <template #content>
    Main content
  </template>
</dt-filter-pill>
'
showHtmlWarning />

### Disabled

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill label="Disabled filter" disabled ref="disabledFilter"></dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.disabledFilter'
vueCode='<dt-filter-pill label="Disabled filter" disabled/>'
showHtmlWarning />

### Active

<code-well-header>
  <dt-stack direction="row" gap="400">
      <dt-filter-pill
        label="Active example"
        active
        ref="activeExample"
      >
        <template #content>
          Main content
        </template>
      </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.activeExample'
vueCode='
<dt-filter-pill label="Active example" active>
  <template #content>
    Main content
  </template>
</dt-filter-pill>
'
showHtmlWarning />

### Loading

When `loading` prop is set, a loading skeleton will be shown, skeleton width can
be customized via `loading-skeleton-width` prop.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      label="Loading example"
      loading
      ref="loadingExample"
    >
      <template #content>
        Loading filter
      </template>
    </dt-filter-pill>
    <dt-filter-pill
      label="Loading example"
      loading
      loading-skeleton-width="50px"
    >
      <template #content>
        Loading filter with custom width
      </template>
    </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.loadingExample'
vueCode='
<dt-filter-pill
  label="Loading example"
  loading
>
  <template #content>
    Main content
  </template>
</dt-filter-pill>
<dt-filter-pill
  label="Loading example"
  loading
  loading-skeleton-width="50px"
>
  <template #content>
    Main content
  </template>
</dt-filter-pill>
'
showHtmlWarning />

### Clearable

Setting the `show-reset` prop will show a reset button that will emit
the `reset` event when clicked, so you can handle the filter resetting.

<code-well-header>
  <dt-stack direction="row" gap="400">
    <dt-filter-pill
      label="Clearable example"
      active
      show-reset
      ref="clearableExample"
    >
      <template #content>
        Clearable filter
      </template>
    </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.clearableExample'
vueCode='
<dt-filter-pill
  label="Clearable example"
  active
  show-reset
>
  <template #content>
    Main content
  </template>
</dt-filter-pill>
'
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
    >
      <template #content>
        {{ sizeNames[size] }} example
      </template>
    </dt-filter-pill>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.clearableExample'
vueCode='
<dt-filter-pill
label="Clearable example"
active
show-reset
>
<template #content>
Main content
</template>
</dt-filter-pill>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="filterPill"></component-vue-api>

## Classes

<component-class-table component-name="filter-pill"></component-class-table>

<script setup>
import { ref } from 'vue';
import { DtIconSearch, DtIconClose } from '@dialpad/dialtone-icons/vue3';

const inputValue = ref('');
const options = [
  'Option 1',
  'Option 2',
  'Option 3',
  'Option 4',
  'Option 5',
];
const sizes = Object.keys(window.DIALTONE_CONSTANTS.BUTTON_SIZE_MODIFIERS);
const sizeNames = {
  xs: 'Extra small',
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  xl: 'Extra Large',
};
</script>
