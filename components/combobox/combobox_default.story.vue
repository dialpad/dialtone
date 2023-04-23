<template>
  <dt-combobox
    :empty-state-message="emptyStateMessage"
    :loading="loading"
    :show-list="!!value && showList"
    :label="label"
    :label-visible="labelVisible"
    :size="size"
    :description="description"
    :empty-list="emptyList"
    :empty-state-class="emptyStateClass"
    :click-on-select="clickOnSelect"
    @escape="onComboboxEscape"
    @highlight="onHighlight"
    @select="onComboboxSelect"
    @opened="onOpened"
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
            <dt-avatar :seed="i.toString()">
              <span aria-hidden="true">{{ i + 1 }}</span>
            </dt-avatar>
          </template>
          {{ item.name }}
        </dt-list-item>
      </ol>
    </template>
    <template
      v-if="emptyListItem"
      slot="emptyListItem"
    >
      <span v-html="emptyListItem" />
    </template>
  </dt-combobox>
</template>

<script>
import DtAvatar from '../avatar/avatar.vue';
import DtCombobox from './combobox.vue';
import DtInput from '../input/input.vue';
import DtListItem from '../list_item/list_item.vue';

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
      return this.items;
    },
  },

  methods: {
    onComboboxSelect (i) {
      this.value = this.items[i].name;
      this.onSelect(i);
    },

    onListItemSelect (i) {
      this.value = this.items[i].name;
      this.onItemClick(i);
    },

    onComboboxEscape () {
      this.value = '';
      this.onEscape();
    },
  },
};
</script>
