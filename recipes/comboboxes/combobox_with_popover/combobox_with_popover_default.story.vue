<template>
  <dt-recipe-combobox-with-popover
    ref="comboboxWithPopover"
    :label="label"
    :label-visible="labelVisible"
    :description="description"
    :size="size"
    :loading="loading"
    :max-height="maxHeight"
    :content-width="contentWidth"
    :has-suggestion-list="hasSuggestionList"
    :show-list="showList"
    :padding="padding"
    :list-id="listId"
    :empty-list="emptyList"
    :visually-hidden-close="visuallyHiddenClose"
    :visually-hidden-close-label="visuallyHiddenCloseLabel"
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
        class="d-p4"
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
import DtInput from '@/components/input/input';
import DtListItem from '@/components/list_item/list_item';
import DtCheckbox from '@/components/checkbox/checkbox';

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
    };
  },

  methods: {
    onComboboxSelect (i) {
      this.onSelect(i);
      this.value = this.items[i].number;
    },

    onComboboxEscape () {
      this.onEscape();
    },
  },
};
</script>
