<template>
  <dt-combobox
    :empty-state-message="$attrs.emptyStateMessage"
    :loading="$attrs.loading"
    :show-list="!!value && $attrs.showList"
    :label="$attrs.label"
    :label-visible="$attrs.labelVisible"
    :size="$attrs.size"
    :description="$attrs.description"
    :empty-list="$attrs.emptyList"
    :empty-state-class="$attrs.emptyStateClass"
    :click-on-select="$attrs.clickOnSelect"
    @escape="onComboboxEscape"
    @highlight="$attrs.onHighlight"
    @select="onComboboxSelect"
    @opened="$attrs.onOpened"
  >
    <template
      #input="{ inputProps }"
    >
      <dt-input
        v-model="value"
        v-bind="inputProps"
        placeholder="Type to show the items"
      />
    </template>
    <template
      #list="{ listProps }"
    >
      <ol
        v-bind="listProps"
        class="d-p0 d-mt8 d-hmx332 d-of-y-auto"
      >
        <dt-list-item
          v-for="(item, i) in displayItems"
          :key="item.id"
          role="option"
          navigation-type="arrow-keys"
          @click="onListItemSelect(i)"
        >
          <template #left>
            <dt-avatar
              kind="initials"
              color="purple-400"
            >
              <span aria-hidden="true">{{ i + 1 }}</span>
            </dt-avatar>
          </template>
          {{ item.name }}
        </dt-list-item>
      </ol>
    </template>
    <template
      v-if="$attrs.emptyListItem"
      #emptyListItem
    >
      <span v-html="$attrs.emptyListItem" />
    </template>
  </dt-combobox>
</template>

<script>
import DtAvatar from '../avatar/avatar';
import DtCombobox from './combobox';
import DtInput from '../input/input';
import DtListItem from '../list_item/list_item';

export default {
  name: 'DtComboboxDefault',

  components: {
    DtAvatar,
    DtCombobox,
    DtInput,
    DtListItem,
  },

  data () {
    return {
      value: 'example',
    };
  },

  computed: {
    displayItems () {
      return this.$attrs.items;
    },
  },

  methods: {
    onComboboxSelect (i) {
      this.value = '';
      this.$attrs.onSelect(i);
    },

    onListItemSelect (i) {
      this.value = '';
      this.$attrs.onItemClick(i);
    },

    onComboboxEscape () {
      this.value = '';
      this.$attrs.onEscape();
    },
  },
};
</script>
