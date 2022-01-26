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
      @click="onClick"
    >
      <template #left>
        <component :is="left"/>
      </template>
      <span v-html="defaultSlot"/>
      <template #subtitle>
        <span v-html="subtitle"/>
      </template>
      <template #bottom>
        <span v-html="bottom"/>
      </template>
      <template #right>
        <component :is="right"/>
      </template>
    </dt-list-item>
  </ul>
</template>

<script>
import DtAvatar from '../avatar/avatar';
import DtBadge from '../badge/badge';
import DtButton from '../button/button';
import DtListItem from './list_item';
import IconPhone from '@dialpad/dialtone/lib/dist/vue/icons/IconPhone';
import icon from '../mixins/icon';
import KeyboardNavigation from '../mixins/keyboard_list_navigation';

export default {
  name: 'DtListItemDefault',

  components: {
    DtAvatar,
    DtBadge,
    DtButton,
    DtListItem,
    IconPhone,
  },

  mixins: [
    icon,
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
