---
title: Combobox With Popover
description: A combobox that renders the listbox inside a popover therefore the listbox is rendered at the root of the document.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-combobox-with-popover--default
---

<code-well-header class="d-d-block">
  <dt-combobox-with-popover
    ref="example-combobox"
    label="Label Text"
    :show-list="showList"
    content-width="anchor"
    max-height="300px"
    @select="onSelect"
    @opened="onOpened"
  >
    <template #input="{ inputProps, onInput }">
      <dt-input
        v-model="inputValue"
        placeholder="Select one or start typing"
        v-bind="inputProps"
        @input="onInput"
      />
    </template>
    <template #list="{ listProps }">
      <ul v-bind="listProps" class="d-p4">
        <dt-list-item
          v-for="(item, i) in items"
          :key="item.id"
          role="option"
          navigation-type="arrow-keys"
          @click="onSelect(i)"
        >
          {{ item.number }}
          <template #right>
            <span class="d-fc-secondary">{{ item.type }}</span>
          </template>
        </dt-list-item>
      </ul>
    </template>
  </dt-combobox-with-popover>
</code-well-header>

<component-combinator component-name="DtComboboxWithPopover" />

<code-example-tabs
vueCode='
<dt-combobox-with-popover
  ref="comboboxWithPopover"
  label="Label Text"
  content-width="anchor"
  max-height="300px"
  @escape="onEscape"
  @highlight="onHighlight"
  @select="onSelect"
>
  <template #input="{ inputProps, onInput }">
    <dt-input
      v-model="inputValue"
      placeholder="Select one or start typing"
      v-bind="inputProps"
      @input="onInput"
    />
  </template>
  <template #list="{ listProps }">
    <ul v-bind="listProps">
      <dt-list-item
        v-for="(item, i) in items"
        :key="item.id"
        navigation-type="arrow-keys"
        role="option"
        @click="onSelect(i)"
      >
        {{ item.name }}
      </dt-list-item>
    </ul>
  </template>
</dt-combobox-with-popover>
'
/>

## Usage

The combobox contains the `input` and `list` slots specified in the [combobox documentation](/components/combobox.html).
Since it's using the popover content to render the list, it's also possible to add a header and footer to the popover
as specified in the [popover documentation](/components/popover.html).

### Closing the list after selection

When not passing `showList` and using the default combobox trigger on input focus,
to close the list with the `select` event or with the `click` event in the list item,
use the `closeComboboxList` method:

```javascript
methods: {
  onSelect (i) {
    this.$refs.comboboxWithPopover.closeComboboxList();
  },
}
```

## With Header and Footer

You can add header and footer content to the popover using the `header` and `footer` slots.

<code-well-header class="d-d-block">
  <dt-combobox-with-popover
    ref="example-combobox-header-footer"
    label="Label Text"
    :show-list="showListHeaderFooter"
    content-width="anchor"
    max-height="300px"
    @select="onSelectHeaderFooter"
    @opened="onOpenedHeaderFooter"
  >
    <template #header>
      <div class="d-px12 d-py8 d-fw-semibold">Select an option</div>
    </template>
    <template #input="{ inputProps, onInput }">
      <dt-input
        v-model="inputValueHeaderFooter"
        placeholder="Select one or start typing"
        v-bind="inputProps"
        @input="onInput"
      />
    </template>
    <template #list="{ listProps }">
      <ul v-bind="listProps" class="d-p4">
        <dt-list-item
          v-for="(item, i) in items"
          :key="item.id"
          role="option"
          navigation-type="arrow-keys"
          @click="onSelectHeaderFooter(i)"
        >
          {{ item.number }}
          <template #right>
            <span class="d-fc-secondary">{{ item.type }}</span>
          </template>
        </dt-list-item>
      </ul>
    </template>
    <template #footer>
      <div class="d-px12 d-py8 d-fc-tertiary">Footer content</div>
    </template>
  </dt-combobox-with-popover>
</code-well-header>

<code-example-tabs
vueCode='
<dt-combobox-with-popover
  label="Label Text"
  @escape="onEscape"
  @highlight="onHighlight"
  @select="onSelect"
>
  <template #header>
    <div class="d-px12 d-py8 d-fw-semibold">Select an option</div>
  </template>
  <template #input="{ inputProps, onInput }">
    <dt-input v-bind="inputProps" @input="onInput" />
  </template>
  <template #list="{ listProps }">
    <ul v-bind="listProps">
      <dt-list-item
        v-for="(item, i) in items"
        :key="item.id"
        navigation-type="arrow-keys"
        role="option"
        @click="onSelect(i)"
      >
        {{ item.name }}
      </dt-list-item>
    </ul>
  </template>
  <template #footer>
    <div class="d-px12 d-py8 d-fc-tertiary">Footer content</div>
  </template>
</dt-combobox-with-popover>
'
/>

## Vue API

<component-vue-api component-name="comboboxwithpopover" />

## Accessibility

A screen reader visible only close button is added by default.

<script setup>
import { ref } from 'vue';

const ITEMS_DATA = [
  { id: 'item1', number: '(732) 338-2720', type: 'MAINLINE' },
  { id: 'item2', number: '(732) 338-2722', type: 'MAINLINE' },
  { id: 'item3', number: '(732) 338-2725', type: 'MAINLINE' },
  { id: 'item4', number: '(732) 338-2764', type: 'MAINLINE' },
  { id: 'item5', number: '(732) 338-2784', type: 'MAINLINE' },
  { id: 'item6', number: '(732) 338-2743', type: 'MAINLINE' },
];

const items = ref([...ITEMS_DATA]);
const inputValue = ref('');
const showList = ref(null);

const inputValueHeaderFooter = ref('');
const showListHeaderFooter = ref(null);

function onSelect (i) {
  if (items.value[i]) {
    inputValue.value = items.value[i].number;
  }
}

function onOpened (opened) {
  if (!opened) {
    showList.value = null;
  }
}

function onSelectHeaderFooter (i) {
  if (items.value[i]) {
    inputValueHeaderFooter.value = items.value[i].number;
  }
}

function onOpenedHeaderFooter (opened) {
  if (!opened) {
    showListHeaderFooter.value = null;
  }
}
</script>
