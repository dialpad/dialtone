<template>
  <div
    v-show="items.length"
    class="dt-emoji-suggestion-list"
  >
    <dt-list-item
      v-for="(item, index) in items"
      :key="index"
      :class="[
        'dt-emoji-suggestion-list-item',
        { 'is-selected': index === selectedIndex },
      ]"
      navigation-type="arrow-keys"
      @click="selectItem(index)"
      @keydown.prevent.stop="onKeyDown"
    >
      <dt-emoji
        size="200"
        :code="item"
      />
      <div class="dt-emoji-suggestion-list-text">
        {{ item }}
      </div>
    </dt-list-item>
  </div>
</template>

<script>
import { DtEmoji } from '@/emoji';
import { DtListItem } from '@/components/list_item';

export default {
  name: 'EmojiList',
  components: {
    DtEmoji,
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

      if (item) {
        this.command({ code: item });
      }
    },
  },
};
</script>

<style>
.dt-emoji-suggestion-list {
  background-color: var(--dt-color-surface-secondary) !important;
  border-color: var(--dt-color-border-subtle) !important;
  max-height: var(--dt-size-875) !important;
  overflow: hidden !important;
  overflow-y: scroll !important;
}
.dt-emoji-suggestion-list .dt-item-layout--title {
  display: flex;
}
.dt-emoji-suggestion-list-item {
  display: flex !important;
  border: var(--dt-size-100) solid transparent;
  min-width: var(--dt-size-850);
  width: var(--dt-size-100-percent) !important;

  &.is-selected {
    border-color: var(--bc-bold);
  }
}

.dt-emoji-suggestion-list-text {
  margin-left: var(--dt-size-350);
}
</style>
