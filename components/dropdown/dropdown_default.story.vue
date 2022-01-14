<template>
  <dt-dropdown
    :open="isOpen"
    :fixed-vertical-alignment="fixedVerticalAlignment"
    :fixed-alignment="fixedAlignment"
    :content-width="contentWidth"
    :padding="padding"
    :navigation-type="navigationType"
    @highlight="onHighlight"
    @select="onDropdownSelect"
    @escape="onDropdownEscape"
    @update:open="updateOpen"
  >
    <template #anchor="{ attrs }">
      <div
        v-if="anchor"
        v-html="anchor"
      />
      <dt-button
        v-else
        v-bind="attrs"
        @click.prevent="isOpen = !isOpen"
      >
        Click to open
      </dt-button>
    </template>
    <template #list="{ listProps, getItemProps, activeItemIndex, setHighlightIndex }">
      <div
        v-if="list"
        v-html="list"
      />
      <ul
        v-else
        v-bind="listProps"
        class="d-p0"
      >
        <dt-list-item
          v-for="(item, i) in items"
          v-bind="getItemProps(i)"
          :key="item.id"
          :is-highlighted="navigationType === LIST_ITEM_NAVIGATION_TYPES.ARROW_KEYS && activeItemIndex === i"
          :set-highlight="() => setHighlightIndex(i)"
          :navigation-type="navigationType"
          @click="onDropdownSelect(i)"
        >
          {{ item.name }}
        </dt-list-item>
      </ul>
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
      isOpen: this.open || false,
      LIST_ITEM_NAVIGATION_TYPES,
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
    open: {
      handler () {
        this.isOpen = this.open;
      },
    },
  },

  methods: {
    updateOpen (isOpen) {
      this.isOpen = isOpen;
    },

    onDropdownSelect (i) {
      this.isOpen = false;
      this.onSelect(i);
    },

    onDropdownEscape () {
      this.isOpen = false;
      this.onEscape();
    },
  },
};
</script>
