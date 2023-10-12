<template>
  <div class="d-popover__dialog">
    <ul
      v-show="items.length"
      class="dt-suggestion-list"
    >
      <dt-list-item
        v-for="(item, index) in items"
        :key="index"
        :class="[
          'dt-suggestion-list--item',
          { 'is-selected dt-list-item--highlighted': index === selectedIndex },
        ]"
        navigation-type="arrow-keys"
        @click="selectItem(index)"
        @keydown.prevent.stop="onKeyDown"
      >
        <component
          :is="itemComponent"
          :item="item"
        />
      </dt-list-item>
    </ul>
  </div>
</template>

<script>
import { DtListItem } from '@/components/list_item';

export default {
  name: 'SuggestionList',
  components: {
    DtListItem,
  },

  props: {
    items: {
      type: Array,
      required: true,
    },

    command: {
      type: Function,
      required: true,
    },

    itemComponent: {
      type: Object,
      required: true,
    },

    itemType: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      selectedIndex: 0,
    };
  },

  watch: {
    items () {
      this.selectedIndex = 0;
    },
  },

  methods: {
    onKeyDown ({ event }) {
      if (event.key === 'ArrowUp') {
        this.upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        this.downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        this.enterHandler();
        return true;
      }

      return false;
    },

    upHandler () {
      this.selectedIndex = ((this.selectedIndex + this.items.length) - 1) % this.items.length;
    },

    downHandler () {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
    },

    enterHandler () {
      this.selectItem(this.selectedIndex);
    },

    selectItem (index) {
      const item = this.items[index];

      switch (this.itemType) {
        case 'emoji':
          this.command({ code: item });
          return;
        case 'mention':
          this.command({ name: item.name, contactId: item.contactId, avatarSrc: item.avatarSrc });
          break;
      }
    },
  },
};
</script>

<style>
.dt-suggestion-list {
  position: relative;
  padding: var(--dt-size-300);
  max-height: var(--dt-size-875) !important;
}

.dt-suggestion-list--item {
  border: var(--dt-size-100) solid transparent;

  &.is-selected {
    border-color: var(--dt-color-border-bold);
  }
}
</style>
