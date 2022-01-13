<template>
  <div class="d-d-flex">
    <dt-dropdown
      class="d-mr8"
      v-for="(variant, i) in variants.fixedAlignment"
      :key="i"
      :open="isOpen[variant]"
      :fixed-alignment="variant"
      :content-width="contentWidth"
      :padding="padding"
      @highlight="onHighlight"
      @select="onSelect"
      @escape="onDropdownEscape($event, variant)"
      :navigation-type="navigationType"
      @update:open="updateOpen($event, variant)"
    >
      <template #anchor>
        <dt-button
          @click.prevent="isOpen[variant] = !isOpen[variant]"
        >
          {{ variant }} aligned dropdown
        </dt-button>
      </template>
      <template #list="{ listProps, getItemProps, activeItemIndex, setHighlightIndex }">
        <ul
          v-bind="listProps"
          class="d-p0 d-w100p"
        >
          <dt-list-item
            v-for="(item, i) in items"
            v-bind="getItemProps(i)"
            :key="item.id"
            :is-highlighted="activeItemIndex === i"
            :set-highlight="() => setHighlightIndex(i)"
            :navigation-type="navigationType"
            @click="onDropdownSelect($event, variant, i)"
            :focusable="true"
          >
            {{ item.name }}
          </dt-list-item>
        </ul>
      </template>
    </dt-dropdown>
  </div>
</template>

<script>
import DtDropdown from './dropdown';
import { DtListItem } from '../list_item';
import { DtButton } from '../button';

export default {
  name: 'DtDropdownVariants',

  components: { DtDropdown, DtListItem, DtButton },

  data () {
    return {
      isOpen: {
        left: false,
        center: false,
        right: false,
      },
      variants: {
        fixedAlignment: ['left', 'center', 'right'],
      },
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

  methods: {
    updateOpen (isOpen, key) {
      this.isOpen[key] = isOpen;
    },

    onDropdownSelect (event, key, item) {
      this.isOpen[key] = false;
      this.onSelect(item);
    },

    onDropdownEscape (event, key) {
      this.isOpen[key] = false;
      this.onEscape();
    },
  },
};
</script>
