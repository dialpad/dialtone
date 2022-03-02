<template>
  <div class="d-d-flex">
    <dt-dropdown
      v-for="(variant, i) in variants.fixedAlignment"
      :key="i"
      class="d-mr8"
      :fixed-alignment="variant"
      :content-width="contentWidth"
      :padding="padding"
      :navigation-type="navigationType"
      @highlight="onHighlight"
      @escape="onDropdownEscape($event, variant)"
    >
      <template
        slot="anchor"
        slot-scope="{ toggleOpen }"
      >
        <dt-button
          @click.prevent="toggleOpen"
        >
          {{ variant }} aligned dropdown
        </dt-button>
      </template>
      <template
        slot="list"
        slot-scope="{ close }"
      >
        <dt-list-item
          v-for="(item) in items"
          :key="item.id"
          role="menuitem"
          :navigation-type="navigationType"
          @click="close"
        >
          {{ item.name }}
        </dt-list-item>
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
    onDropdownEscape (event, key) {
      this.onEscape();
    },
  },
};
</script>
