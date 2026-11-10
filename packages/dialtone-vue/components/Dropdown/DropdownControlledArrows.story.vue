<template>
  <dt-stack
    gap="500"
    align="start"
  >
    <label>
      <input
        v-model="acceptArrows"
        type="checkbox"
        data-qa="accept-arrow-opening"
      >
      Accept anchor arrows synchronously
    </label>
    <dt-dropdown
      :open="isOpen"
      forward-anchor-arrow-keys
      @keydown="onKeydown"
      @open-change="onOpenChange"
      @opened="$attrs.onOpened"
    >
      <template #anchor="anchorAttrs">
        <dt-button
          ref="trigger"
          data-qa="controlled-arrow-trigger"
          :aria-expanded="anchorAttrs['aria-expanded']"
          :aria-controls="anchorAttrs['aria-controls']"
          :aria-haspopup="anchorAttrs['aria-haspopup']"
          @click="isOpen = !isOpen"
        >
          Controlled menu
        </dt-button>
      </template>
      <template #list="{ close }">
        <dt-list-item
          role="menuitem"
          navigation-type="arrow-keys"
          @click="close"
        >
          Alpha action
        </dt-list-item>
        <dt-list-item
          role="menuitem"
          navigation-type="arrow-keys"
          @click="close"
        >
          Beta action
        </dt-list-item>
      </template>
    </dt-dropdown>
    <p
      role="status"
      data-qa="controlled-arrow-status"
    >
      Forwarded anchor arrows: {{ arrowCount }}. Opening is {{ acceptArrows ? 'accepted' : 'ignored' }}.
    </p>
  </dt-stack>
</template>

<script>
import { DtDropdown } from './index';
import { DtListItem } from '@/components/ListItem';
import { DtButton } from '@/components/Button';
import { DtStack } from '@/components/Stack';

export default {
  name: 'DtDropdownControlledArrows',
  components: { DtDropdown, DtListItem, DtButton, DtStack },
  data () {
    return { isOpen: false, acceptArrows: true, arrowCount: 0 };
  },

  methods: {
    onKeydown (event) {
      if (!this.$refs.trigger?.$el.contains(event.target) || !['ArrowUp', 'ArrowDown'].includes(event.key)) return;
      this.arrowCount++;
      if (!this.acceptArrows) return;
      event.preventDefault();
      this.isOpen = true;
    },

    onOpenChange (open) {
      this.isOpen = open;
      this.$attrs.onOpenChange?.(open);
    },
  },
};
</script>
