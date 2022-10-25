<template>
  <dt-recipe-combobox-with-popover
    ref="comboboxWithPopover"
    :empty-state-message="emptyStateMessage"
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
    :empty-list="emptyList"
    :modal="modal"
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
      this.$refs.comboboxWithPopover.closeComboboxList();
    },

    onComboboxEscape () {
      this.onEscape();
    },
  },
};
</script>
