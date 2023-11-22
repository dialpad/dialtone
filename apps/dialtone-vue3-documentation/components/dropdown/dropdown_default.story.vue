<template>
  <dt-dropdown
    v-model:open="isOpen"
    :placement="$attrs.placement"
    :fallback-placements="$attrs.fallbackPlacements"
    :content-width="$attrs.contentWidth"
    :padding="$attrs.padding"
    :modal="$attrs.modal"
    :max-height="$attrs.maxHeight"
    :max-width="$attrs.maxWidth"
    :list-class="$attrs.listClass"
    :navigation-type="$attrs.navigationType"
    :open-on-context="$attrs.openOnContext"
    :visually-hidden-close="$attrs.visuallyHiddenClose"
    :visually-hidden-close-label="$attrs.visuallyHiddenCloseLabel"
    :tether="$attrs.tether"
    :transition="$attrs.transition"
    @highlight="$attrs.onHighlight"
    @opened="$attrs.onOpened"
  >
    <template #anchor="{ attrs }">
      <div
        v-if="$attrs.anchor"
        v-html="$attrs.anchor"
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
        v-if="$attrs.list"
        v-html="$attrs.list"
      />
      <dt-list-item
        v-for="(item) in items"
        v-else
        :key="item.id"
        role="menuitem"
        :navigation-type="$attrs.navigationType"
        @click="close"
      >
        {{ item.name }}
      </dt-list-item>
    </template>
  </dt-dropdown>
</template>

<script>
import { DtDropdown, LIST_ITEM_NAVIGATION_TYPES, DROPDOWN_STORY_ITEMS, DtListItem, DtButton } from '@dialpad/dialtone-vue';

export default {
  name: 'DtDropdownDefault',

  components: { DtDropdown, DtListItem, DtButton },

  data () {
    return {
      LIST_ITEM_NAVIGATION_TYPES,
      isOpen: this.$attrs.open,
    };
  },

  computed: {
    items () {
      return DROPDOWN_STORY_ITEMS;
    },
  },

  watch: {
    open (open) {
      this.isOpen = open;
    },
  },
};
</script>
