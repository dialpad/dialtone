<template>
  <dt-dropdown
    :open.sync="isOpen"
    placement="bottom-start"
    navigation-type="arrow-keys"
    follow-cursor="initial"
  >
    <template #anchor="{ attrs }">
      <div
        @contextmenu.prevent="showMenu"
      >
        <!-- @slot Anchor element that will trigger the context menu -->
        <slot
          ref="anchor"
          name="anchor"
          v-bind="attrs"
        />
      </div>
    </template>
    <template #list="{ close }">
      <div class="d-context-menu-list">
        <!-- @slot Slot for the list component -->
        <slot
          name="list"
          :close="close"
        />
      </div>
    </template>
  </dt-dropdown>
</template>

<script>
import DtDropdown from '@/components/dropdown/dropdown';
import { DtListItem } from '../list_item';
import { DtButton } from '../button';
import { DROPDOWN_STORY_ITEMS } from '@/components/dropdown/dropdown_story_constants';

export default {
  name: 'DtContextMenu',

  components: { DtDropdown, DtButton, DtListItem },

  props: {},

  data () {
    return {
      isOpen: false,
    };
  },

  computed: {
    items () {
      return DROPDOWN_STORY_ITEMS;
    },
  },

  methods: {
    showMenu () {
      this.isOpen = true;
    },
  },
};
</script>

<style lang="less">
.d-context-menu-list {
  width: 24rem;
}
</style>
