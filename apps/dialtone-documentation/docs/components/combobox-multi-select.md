---
title: Combobox Multi-Select
description: Select allows users to make a single selection or multiple selections from a list of options.
status: ready
thumb: true
# image: assets/images/components/combobox-multi-select.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-combobox-multi-select--default
---

<!-- <component-combinator component-name="DtComboboxMultiSelect" /> -->

<code-example class="d-d-block" vueCode='
<dt-combobox-multi-select
  ref="comboboxMultiSelect"
  label="Label Text"
  :selected-items="selectedItems"
  @input="onInput"
  @select="onSelect"
  @remove="onRemove"
>
  <template #list>
    <dt-stack as="ul" class="d-ps-relative d-m4 d-px0">
      <dt-list-item
        v-for="(item, i) in items"
        :key="item.id"
        role="option"
        navigation-type="arrow-keys"
        @click="onSelect(i)"
      >
        {{ item.value }}
        <template #right>
          <span class="d-fc-secondary">{{ item.type }}</span>
        </template>
      </dt-list-item>
    </dt-stack>
  </template>
</dt-combobox-multi-select>
'>
  <dt-combobox-multi-select
    label="Label Text"
    :selected-items="selectedItems"
    @input="onComboboxInput"
    @select="onComboboxSelect"
    @remove="onComboboxRemove"
  >
    <template #list>
      <dt-stack as="ul" class="d-ps-relative d-m4 d-px0">
        <dt-list-item
          v-for="(item, i) in items"
          :key="item.id"
          role="option"
          navigation-type="arrow-keys"
          @click="onComboboxSelect(i)"
        >
          {{ item.value }}
          <template #right>
            <span class="d-fc-secondary">{{ item.type }}</span>
          </template>
        </dt-list-item>
      </dt-stack>
    </template>
  </dt-combobox-multi-select>
</code-example>

## Usage

The Combobox Multi-Select component combines an input element with a dropdown list, allowing users to select multiple items. Selected items appear as chips within the input field.

### Closing the list after selection

When not passing `showList` and `hasSuggestionList` is `true`, to close the list with the `select` event, use the `closeComboboxList` method:

```javascript
methods: {
  onSelect (i) {
    this.$refs.comboboxMultiSelect.closeComboboxList();
  },
}
```

## With Max Selected Validation

Adds validation for max selection. Make sure to provide the following props:

- `maxSelected` the maximum number of selections you can make. 0 is unlimited
- `maxSelectedMessage` should be the message that shown if max selection has been reached

<code-example class="d-d-block" vueCode='
<dt-combobox-multi-select
  ref="comboboxMultiSelect"
  label="Label Text"
  description="Select up to 2 options."
  :selected-items="selectedItems"
  :max-selected="2"
  :max-selected-message="[{ message: `More than 2 selected`, type: `error` }]"
  @input="onInput"
  @select="onSelect"
  @remove="onRemove"
  @max-selected="onMaxSelected"
>
  <template #list>
    <dt-stack as="ul" class="d-ps-relative d-m4 d-px0">
      <dt-list-item
        v-for="(item, i) in items"
        :key="item.id"
        role="option"
        navigation-type="arrow-keys"
        @click="onSelect(i)"
      >
        {{ item.value }}
        <template #right>
          <span class="d-fc-secondary">{{ item.type }}</span>
        </template>
      </dt-list-item>
    </dt-stack>
  </template>
</dt-combobox-multi-select>
'>
  <dt-combobox-multi-select
    label="Label Text"
    description="Select up to 2 options."
    :selected-items="maxSelectedItems"
    :max-selected="2"
    :max-selected-message="[{ message: 'More than 2 selected', type: 'error' }]"
    @input="onMaxSelectInput"
    @select="onMaxSelectSelect"
    @remove="onMaxSelectRemove"
    @max-selected="onMaxSelected"
  >
    <template #list>
      <dt-stack as="ul" class="d-ps-relative d-m4 d-px0">
        <dt-list-item
          v-for="(item, i) in maxSelectItems"
          :key="item.id"
          role="option"
          navigation-type="arrow-keys"
          @click="onMaxSelectSelect(i)"
        >
          {{ item.value }}
          <template #right>
            <span class="d-fc-secondary">{{ item.type }}</span>
          </template>
        </dt-list-item>
      </dt-stack>
    </template>
  </dt-combobox-multi-select>
</code-example>

## Vue API

<component-vue-api component-name="comboboxmultiselect" />

## Accessibility

A screen reader visible only close button is added by default.

### Keyboard Support

- User can navigate between chips pressing the `LEFT` and `RIGHT` key.
- Pressing `LEFT` key when you have chips in the input and you are at the start of the text would select the last chip.
- Pressing `RIGHT` key when you are at the last chip would focus on the start of the input.
- Pressing `BACKSPACE` key would focus the chip.
- When a chip is focused, pressing `BACKSPACE` or `DELETE` key would remove the chip.
- User can navigate the popover list pressing `UP` and `DOWN` key.

See full [Keyboard Support](/components/popover.html#keyboard-support) for popover list.

<script setup>
import { ref } from 'vue';

const ITEMS_LIST_DATA = [
  { id: 'item1', value: 'item1', type: 'MAINLINE' },
  { id: 'item2', value: 'item2', type: 'MAINLINE' },
  { id: 'item3', value: 'item3', type: 'MAINLINE' },
  { id: 'item4', value: 'item4', type: 'MAINLINE' },
  { id: 'item5', value: 'item5', type: 'MAINLINE' },
  { id: 'item6', value: 'item6', type: 'MAINLINE' },
  { id: 'item7', value: 'item7', type: 'MAINLINE' },
  { id: 'item8', value: 'item8', type: 'Other' },
];

const items = ref([...ITEMS_LIST_DATA]);
const selectedItems = ref([]);

const maxSelectItems = ref([...ITEMS_LIST_DATA]);
const maxSelectedItems = ref(['item1', 'item2', 'item3']);

function onComboboxInput (value) {
  items.value = ITEMS_LIST_DATA.filter(item => item.value.includes(value));
}

function onComboboxSelect (i) {
  if (items.value[i]) {
    const item = items.value[i].value;
    if (!selectedItems.value.includes(item)) {
      selectedItems.value.push(item);
    }
    items.value = [...ITEMS_LIST_DATA];
  }
}

function onComboboxRemove (item) {
  const index = selectedItems.value.indexOf(item);
  if (index >= 0) {
    selectedItems.value.splice(index, 1);
  }
}

function onMaxSelectInput (value) {
  maxSelectItems.value = ITEMS_LIST_DATA.filter(item => item.value.includes(value));
}

function onMaxSelectSelect (i) {
  if (maxSelectItems.value[i]) {
    const item = maxSelectItems.value[i].value;
    if (!maxSelectedItems.value.includes(item)) {
      maxSelectedItems.value.push(item);
    }
    maxSelectItems.value = [...ITEMS_LIST_DATA];
  }
}

function onMaxSelectRemove (item) {
  const index = maxSelectedItems.value.indexOf(item);
  if (index >= 0) {
    maxSelectedItems.value.splice(index, 1);
  }
}

function onMaxSelected () {
  console.log('Max selected reached');
}
</script>
