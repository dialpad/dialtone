<template>
  <dt-popover
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
      <dt-button
        v-bind="attrs"
        @click="isOpen = !isOpen"
      >
        Click to open
      </dt-button>
    </template>
    <template #content>
      <p class="d-fs14 d-m0">
        I will be displayed in the popover!
      </p>
    </template>
  </dt-popover>
</template>

<script>
import { DtPopover } from './';
import { DtButton } from '../button';

export default {
  name: 'PopoverDefault',
  components: { DtPopover, DtButton },

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
