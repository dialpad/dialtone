<template>
  <ul
    ref="listWrapper"
  >
    <dt-list-item
      :id="id"
      :role="role"
      :element-type="elementType"
      :type="type"
      :navigation-type="navigationType"
      :selected="selected"
      @click="onClick"
    >
      <template slot="left">
        <dt-icon :name="left" />
      </template>
      <span v-html="defaultSlot" />
      <template slot="subtitle">
        <span v-html="subtitle" />
      </template>
      <template slot="bottom">
        <span v-html="bottom" />
      </template>
      <template slot="right">
        <dt-icon :name="right" />
      </template>
    </dt-list-item>
  </ul>
</template>

<script>
import DtListItem from './list_item';
import { DtIcon } from '@/components/icon';
import KeyboardNavigation from '@/common/mixins/keyboard_list_navigation';

export default {
  name: 'DtListItemDefault',

  components: {
    DtListItem,
    DtIcon,
  },

  mixins: [
    KeyboardNavigation({
      indexKey: 'highlightIndex',
      idKey: 'highlightId',
      listElementKey: 'getListElement',
    }),
  ],

  methods: {
    getListElement () {
      return this.$refs.listWrapper;
    },
  },
};
</script>
