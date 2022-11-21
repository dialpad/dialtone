<template>
  <dt-combobox
    :empty-state-message="emptyStateMessage"
    :loading="loading"
    :show-list="!!value && showList"
    list-aria-label="Example list items"
    :empty-list="emptyList"
    :empty-state-class="emptyStateClass"
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
          @click="onComboboxSelect(i)"
        >
          <template slot="left">
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
      v-if="emptyListItem"
      slot="emptyListItem"
    >
      <span v-html="emptyListItem" />
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
      return this.items;
    },
  },

  methods: {
    onComboboxSelect (i) {
      this.value = '';
      this.onSelect(i);
    },

    onComboboxEscape () {
      this.value = '';
      this.onEscape();
    },
  },
};
</script>
