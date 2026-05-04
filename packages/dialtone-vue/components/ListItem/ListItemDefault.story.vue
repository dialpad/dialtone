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
      :wrapper-class="$attrs.wrapperClass"
    >
      <template #start>
        <dt-icon :name="$attrs.start" />
      </template>
      <span v-html="defaultSlot" />
      <template #subtitle>
        <span v-html="$attrs.subtitle" />
      </template>
      <template #blockEnd>
        <span v-html="$attrs.blockEnd" />
      </template>
      <template #end>
        <dt-icon :name="$attrs.end" />
      </template>
    </dt-list-item>
  </ul>
</template>

<script>
import DtListItem from './ListItem.vue';
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
