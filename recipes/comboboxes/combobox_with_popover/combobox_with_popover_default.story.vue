<template>
  <dt-recipe-combobox-with-popover
    ref="comboboxWithPopover"
    :loading="loading"
    :list-aria-label="listAriaLabel"
    :max-height="maxHeight"
    :max-width="maxWidth"
    :content-width="contentWidth"
    :show-list="showList"
    :padding="padding"
    :list-id="listId"
    :list-class="listClass"
    :open-with-arrow-keys="openWithArrowKeys"
    :has-suggestion-list="hasSuggestionList"
    @escape="onComboboxEscape"
    @highlight="onHighlight"
    @select="onComboboxSelect"
    @opened="onOpened"
  >
    <template
      v-if="header"
      #header
    >
      <span v-html="header" />
    </template>

    <template #input="{ inputProps, onInput }">
      <dt-input
        v-model="value"
        placeholder="Select one or start typing"
        v-bind="inputProps"
        @input="onInput"
      />
    </template>
    <template #list="{ listProps }">
      <ul
        v-bind="listProps"
        class="d-p0"
      >
        <dt-list-item
          v-for="(item, i) in items"
          :key="item.id"
          role="option"
          navigation-type="arrow-keys"
          @click="onComboboxSelect(i)"
        >
          {{ item.number }}
          <template #right>
            {{ item.type }}
          </template>
        </dt-list-item>
      </ul>
    </template>
    <template
      v-if="footer"
      #footer
    >
      <span v-html="footer" />
    </template>
    <template
      v-else
      #footer
    >
      <div class="d-d-flex d-ai-center d-px12">
        <dt-checkbox label="Apply primary number to assigned Contact Centers" />
      </div>
    </template>
  </dt-recipe-combobox-with-popover>
</template>

<script>
import DtRecipeComboboxWithPopover from './combobox_with_popover';
import { DtInput, DtListItem, DtCheckbox } from '@';

export default {
  name: 'DtRecipeComboboxWithPopoverDefault',
  components: {
    DtRecipeComboboxWithPopover,
    DtInput,
    DtListItem,
    DtCheckbox,
  },

  data () {
    return {
      value: '',
      items: [
        { id: 'item1', number: '(732) 338-2720', type: 'MAINLINE' },
        { id: 'item2', number: '(732) 338-2722', type: 'MAINLINE' },
        { id: 'item3', number: '(732) 338-2725', type: 'MAINLINE' },
        { id: 'item4', number: '(732) 338-2764', type: 'MAINLINE' },
        { id: 'item5', number: '(732) 338-2784', type: 'MAINLINE' },
        { id: 'item6', number: '(732) 338-2743', type: 'MAINLINE' },
        { id: 'item7', number: '(732) 338-2728', type: 'MAINLINE' },
        { id: 'item8', number: '(732) 338-2769', type: 'Other' },
        { id: 'item9', number: '(732) 338-2723', type: 'MAINLINE' },
        { id: 'item10', number: '(732) 338-2729', type: 'MAINLINE' },
        { id: 'item11', number: '(732) 338-2489', type: 'MAINLINE' },
        { id: 'item12', number: '(732) 338-2756', type: 'Other' },
      ],
    };
  },

  methods: {
    onComboboxSelect (i) {
      this.onSelect(i);
      this.value = this.items[i].number;
      this.$refs.comboboxWithPopover.closeComboboxList();
    },

    onComboboxEscape () {
      this.onEscape();
    },
  },
};
</script>
