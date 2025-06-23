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
      slot="input"
      slot-scope="{ inputProps }"
    >
      <dt-input
        v-model="value"
        v-bind="inputProps"
        placeholder="Type to show the items"
      />
    </template>
    <template
      slot="list"
      slot-scope="{ listProps }"
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
          <template slot="left">
            <dt-avatar
              :full-name="(i + 1).toString()"
              :seed="i.toString()"
            />
          </template>
          {{ item.name }}
        </dt-list-item>
      </ol>
    </template>
    <template
      v-if="$attrs.emptyListItem"
      slot="emptyListItem"
    >
      <span v-html="$attrs.emptyListItem" />
    </template>
  </dt-combobox>
</template>

<script>
import { DtAvatar } from '@/components/avatar';
import { DtCombobox } from '@/components/combobox';
import { DtInput } from '@/components/input';
import { DtListItem } from '@/components/list_item';

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
      this.value = this.$attrs.items[i].name;
      this.$attrs.onSelect(i);
    },

    onListItemSelect (i) {
      this.value = this.$attrs.items[i].name;
      this.$attrs.onItemClick(i);
    },

    onComboboxEscape () {
      this.value = '';
      this.$attrs.onEscape();
    },
  },
};
</script>
