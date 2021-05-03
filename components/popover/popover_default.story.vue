<template>
  <hs-popover
    :id="id"
    :open.sync="isOpen"
    :element-type="elementType"
    :content-class="contentClass"
    :padding="padding"
    :has-caret="hasCaret"
    :role="role"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :transition="transition"
    :fixed-alignment="fixedAlignment"
    :fixed-vertical-alignment="fixedVerticalAlignment"
  >
    <template #anchor="{ attrs }">
      <hs-button
        v-bind="attrs"
        @click="isOpen = !isOpen"
      >
        Click to open
      </hs-button>
    </template>
    <template #content>
      <p class="d-fs14 d-m0">
        I will be displayed in the popover!
      </p>
    </template>
  </hs-popover>
</template>

<script>
import { HsPopover } from './';
import { HsButton } from '../button';

export default {
  name: 'PopoverDefault',
  components: { HsPopover, HsButton },

  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      isOpen: this.open || false,
    };
  },

  watch: {
    open (isOpen) {
      this.isOpen = isOpen;
    },
  },
};
</script>
