<template>
  <dt-recipe-combobox-with-popover
    ref="comboboxWithPopover"
    :empty-state-message="$attrs.emptyStateMessage"
    :loading="$attrs.loading"
    :list-aria-label="$attrs.listAriaLabel"
    :max-height="$attrs.maxHeight"
    :max-width="$attrs.maxWidth"
    :content-width="$attrs.contentWidth"
    :show-list="$attrs.showList"
    :padding="$attrs.padding"
    :list-id="$attrs.listId"
    :list-class="$attrs.listClass"
    :open-with-arrow-keys="$attrs.openWithArrowKeys"
    :has-suggestion-list="$attrs.hasSuggestionList"
    :empty-list="$attrs.emptyList"
    :visually-hidden-close="$attrs.visuallyHiddenClose"
    :visually-hidden-close-label="$attrs.visuallyHiddenCloseLabel"
    @escape="onComboboxEscape"
    @highlight="$attrs.onHighlight"
    @select="onComboboxSelect"
    @opened="$attrs.onOpened"
  >
    <template
      v-if="$attrs.header"
      #header
    >
      <span v-html="$attrs.header" />
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
          v-for="(item, i) in $attrs.items"
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
      v-if="$attrs.footer"
      #footer
    >
      <span v-html="$attrs.footer" />
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
      this.$attrs.onSelect(i);
      this.value = this.items[i].number;
    },

    onComboboxEscape () {
      this.$attrs.onEscape();
    },
  },
};
</script>
