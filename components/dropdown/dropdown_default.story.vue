<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <dt-dropdown
    :open.sync="isOpen"
    :placement="placement"
    :fallback-placements="fallbackPlacements"
    :content-width="contentWidth"
    :padding="padding"
    :modal="modal"
    :navigation-type="navigationType"
    @highlight="onHighlight"
    @opened="onOpened"
  >
    <template #anchor="{ attrs }">
      <div
        v-if="anchor"
        v-html="anchor"
      />
      <dt-button
        v-else
        v-bind="attrs"
      >
        Click to open
      </dt-button>
    </template>
    <template #list="{ close }">
      <div
        v-if="list"
        v-html="list"
      />
      <dt-list-item
        v-for="(item) in items"
        v-else
        :key="item.id"
        role="menuitem"
        :navigation-type="navigationType"
        @click="close"
      >
        {{ item.name }}
      </dt-list-item>
    </template>
  </dt-dropdown>
</template>

<script>
import DtDropdown from './dropdown';
import { DtListItem } from '../list_item';
import { DtButton } from '../button';
import { LIST_ITEM_NAVIGATION_TYPES } from '../list_item/list_item_constants';

export default {
  name: 'DtDropdownDefault',

  components: { DtDropdown, DtListItem, DtButton },

  data () {
    return {
      LIST_ITEM_NAVIGATION_TYPES,
      isOpen: this.open,
    };
  },

  computed: {
    items () {
      return [
        { name: '1st menu item', id: 1 },
        { name: '2nd menu item', id: 2 },
        { name: '3rd menu item', id: 3 },
      ];
    },
  },

  watch: {
    open (open) {
      this.isOpen = open;
    },
  },
};
</script>
