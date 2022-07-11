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
    >
      <template #left>
        <component :is="$attrs.left" />
      </template>
      <span v-html="defaultSlot" />
      <template #subtitle>
        <span v-html="$attrs.subtitle" />
      </template>
      <template #bottom>
        <span v-html="$attrs.bottom" />
      </template>
      <template #right>
        <component :is="$attrs.right" />
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
import icon from '@/common/mixins/icon';
import KeyboardNavigation from '@/common/mixins/keyboard_list_navigation';

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
