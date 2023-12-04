<template>
  <dt-recipe-combobox-multi-select
    ref="comboboxMultiSelect"
    :label="$attrs.label"
    :label-visible="$attrs.labelVisible"
    :description="$attrs.description"
    :size="$attrs.size"
    :loading="$attrs.loading"
    :loading-message="$attrs.loadingMessage"
    :show-list="$attrs.showList"
    :selected-items="$attrs.selectedItems"
    :max-selected="$attrs.maxSelected"
    :list-max-height="$attrs.listMaxHeight"
    :max-selected-message="$attrs.maxSelectedMessage"
    :has-suggestion-list="$attrs.hasSuggestionList"
    :visually-hidden-close-label="$attrs.visuallyHiddenCloseLabel"
    :append-to="$attrs.appendTo"
    :transition="$attrs.transition"
    @input="onComboboxInput"
    @select="onComboboxSelect"
    @remove="onComboboxRemove"
    @max-selected="$attrs.onMaxSelected"
  >
    <template
      v-if="$attrs.header"
      #header
    >
      <span v-html="$attrs.header" />
    </template>
    <template #list>
      <ul
        class="d-ps-relative d-stack2 d-m4 d-px0"
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
            <span class="d-fc-secondary">{{ item.type }}</span>
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
import DtListItem from '@/components/list_item/list_item.vue';
import DtRecipeComboboxMultiSelect from './combobox_multi_select.vue';
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
      this.$attrs.onInput(value);
    },

    onComboboxSelect (i) {
      if (this.items[i]) {
        this.$attrs.onSelect(i);

        const item = this.items[i].value;
        if (this.$attrs.selectedItems.includes(item)) {
          return;
        }
        this.$attrs.selectedItems.push(item);

        // Clear input box and unfilter list
        this.$refs.comboboxMultiSelect.$data.value = '';
        this.items = ITEMS_LIST_DATA;
      }
    },

    onComboboxRemove (item) {
      this.$attrs.onRemove(item);
      const index = this.$attrs.selectedItems.indexOf(item);
      if (index < 0) {
        return;
      }
      this.$attrs.selectedItems.splice(index, 1);
    },
  },
};
</script>
