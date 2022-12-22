<template>
  <dt-recipe-combobox-multi-select
    ref="comboboxMultiSelect"
    :label="$attrs.label"
    :description="$attrs.description"
    :selected-items="selected"
    :label-visible="$attrs.labelVisible"
    :size="$attrs.size"
    :placeholder="$attrs.placeholder"
    :input-messages="$attrs.inputMessages"
    :show-input-messages="$attrs.showInputMessages"
    :loading="$attrs.loading"
    :loading-message="$attrs.loadingMessage"
    :show-list="$attrs.showList"
    :max-selected="$attrs.maxSelected"
    :list-max-height="$attrs.listMaxHeight"
    :max-selected-message="$attrs.maxSelectedMessage"
    :has-suggestion-list="$attrs.hasSuggestionList"
    :visually-hidden-close="$attrs.visuallyHiddenClose"
    :visually-hidden-close-label="$attrs.visuallyHiddenCloseLabel"
    @input="onComboboxInput"
    @select="onComboboxSelect"
    @remove="onComboboxRemove"
    @max-selected="onComboboxMaxSelected"
  >
    <template
      v-if="$attrs.header"
      #header
    >
      <span v-html="$attrs.header" />
    </template>
    <template #list>
      <ul
        class="d-p0"
      >
        <dt-list-item
          v-for="(item, i) in items"
          :key="item.id"
          role="option"
          navigation-type="arrow-keys"
          @click="onComboboxSelect(i)"
        >
          {{ item.value }}
          <template #right>
            {{ item.type }}
          </template>
        </dt-list-item>
      </ul>
    </template>
    <template
      v-if="$attrs.footer"
      #footer
    >
      <span v-html="$attrs.footer" />
    </template>
  </dt-recipe-combobox-multi-select>
</template>

<script>
import DtListItem from '@/components/list_item/list_item';
import DtRecipeComboboxMultiSelect from './combobox_multi_select';
import { ITEMS_LIST_DATA } from './combobox_multi_select_story_constants';

export default {
  name: 'DtRecipeComboboxMultiSelectDefault',
  components: {
    DtRecipeComboboxMultiSelect,
    DtListItem,
  },

  data () {
    return {
      items: ITEMS_LIST_DATA,
      selected: null,
    };
  },

  created () {
    this.selected = this.$attrs.selected ? [...this.$attrs.selected] : [];
  },

  methods: {
    onComboboxInput (value) {
      // Filter list
      this.items = ITEMS_LIST_DATA.filter(item => item.value.includes(value));
      this.$attrs.onInput(value);
    },

    onComboboxSelect (i) {
      if (this.items[i]) {
        this.$attrs.onSelect(i);

        const item = this.items[i].value;
        if (this.selected.includes(item)) {
          return;
        }
        this.selected.push(item);

        // Clear input box and unfilter list
        this.$refs.comboboxMultiSelect.$data.value = '';
        this.items = ITEMS_LIST_DATA;
      }
    },

    onComboboxMaxSelected () {
      this.$attrs.onMaxSelected();
    },

    onComboboxRemove (item) {
      this.$attrs.onRemove(item);
      const index = this.selected.indexOf(item);
      if (index < 0) {
        return;
      }
      this.selected.splice(index, 1);
    },
  },
};
</script>
