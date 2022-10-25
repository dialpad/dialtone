<template>
  <dt-recipe-combobox-multi-select
    ref="comboboxMultiSelect"
    :label="label"
    :description="description"
    :size="size"
    :placeholder="placeholder"
    :input-messages="inputMessages"
    :show-input-messages="showInputMessages"
    :loading="loading"
    :loading-message="loadingMessage"
    :show-list="showList"
    :selected-items="selectedItems"
    :max-selected="maxSelected"
    :list-max-height="listMaxHeight"
    :max-selected-message="maxSelectedMessage"
    :has-suggestion-list="hasSuggestionList"
    :visually-hidden-close="visuallyHiddenClose"
    :visually-hidden-close-label="visuallyHiddenCloseLabel"
    @input="onComboboxInput"
    @select="onComboboxSelect"
    @remove="onComboboxRemove"
    @max-selected="onComboboxMaxSelected"
  >
    <template
      v-if="header"
      #header
    >
      <span v-html="header" />
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
      v-if="footer"
      #footer
    >
      <span v-html="footer" />
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
    };
  },

  methods: {
    onComboboxInput (value) {
      // Filter list
      this.items = ITEMS_LIST_DATA.filter(item => item.value.includes(value));
      this.onInput(value);
    },

    onComboboxSelect (i) {
      if (this.items[i]) {
        this.onSelect(i);

        const item = this.items[i].value;
        if (this.selectedItems.includes(item)) {
          return;
        }
        this.selectedItems.push(item);

        // Clear input box and unfilter list
        this.$refs.comboboxMultiSelect.$data.value = '';
        this.items = ITEMS_LIST_DATA;
      }
    },

    onComboboxMaxSelected () {
      this.onMaxSelected();
    },

    onComboboxRemove (item) {
      this.onRemove(item);
      const index = this.selectedItems.indexOf(item);
      if (index < 0) {
        return;
      }
      this.selectedItems.splice(index, 1);
    },
  },
};
</script>
