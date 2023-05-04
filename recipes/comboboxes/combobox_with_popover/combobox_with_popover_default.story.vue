<template>
  <dt-recipe-combobox-with-popover
    ref="comboboxWithPopover"
    :label="$attrs.label"
    :label-visible="$attrs.labelVisible"
    :description="$attrs.description"
    :size="$attrs.size"
    :loading="$attrs.loading"
    :max-height="$attrs.maxHeight"
    :content-width="$attrs.contentWidth"
    :has-suggestion-list="$attrs.hasSuggestionList"
    :max-width="$attrs.maxWidth"
    :show-list="$attrs.showList"
    :padding="$attrs.padding"
    :list-id="$attrs.listId"
    :list-class="$attrs.listClass"
    :open-with-arrow-keys="$attrs.openWithArrowKeys"
    :empty-list="$attrs.emptyList"
    :empty-state-message="$attrs.emptyStateMessage"
    :append-to="$attrs.appendTo"
    :visually-hidden-close="$attrs.visuallyHiddenClose"
    :visually-hidden-close-label="$attrs.visuallyHiddenCloseLabel"
    :transition="$attrs.transition"
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
        class="d-p4"
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
      v-else-if="!emptyList"
      #footer
    >
      <div class="d-d-flex d-ai-center d-px12">
        <dt-checkbox label="Apply primary number to assigned Contact Centers" />
      </div>
    </template>
  </dt-recipe-combobox-with-popover>
</template>

<script>
import DtRecipeComboboxWithPopover from './combobox_with_popover.vue';
import DtInput from '@/components/input/input.vue';
import DtListItem from '@/components/list_item/list_item.vue';
import DtCheckbox from '@/components/checkbox/checkbox.vue';

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
      this.value = this.$attrs.items[i].number;
    },

    onComboboxEscape () {
      this.$attrs.onEscape();
    },
  },
};
</script>
