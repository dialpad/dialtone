<template>
  <ul
    ref="listWrapper"
  >
    <dt-list-item
      :id="$attrs.id"
      :role="$attrs.role"
      :element-type="$attrs.elementType"
      :type="$attrs.type"
      :navigation-type="$attrs.navigationType"
      :selected="$attrs.selected"
      @click="$attrs.onClick"
    >
      <template slot="left">
        <dt-icon :name="$attrs.left" />
      </template>
      <span v-html="$attrs.default" />
      <template slot="subtitle">
        <span v-html="$attrs.subtitle" />
      </template>
      <template slot="bottom">
        <span v-html="$attrs.bottom" />
      </template>
      <template slot="right">
        <dt-icon :name="$attrs.right" />
      </template>
    </dt-list-item>
  </ul>
</template>

<script>
import DtListItem from './list_item.vue';
import { DtIcon } from '@/components/icon';
import KeyboardNavigation from '../../common/mixins/keyboard_list_navigation';

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
