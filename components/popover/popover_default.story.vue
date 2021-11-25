<template>
  <dt-popover
    :id="id"
    :open="isOpen"
    :fixed-alignment="fixedAlignment"
    :fixed-vertical-alignment="fixedVerticalAlignment"
    :content-class="contentClass"
    :has-caret="hasCaret"
    :padding="padding"
    :hide-on-click="hideOnClick"
    :role="role"
    :element-type="elementType"
    :transition="transition"
    :aria-labelledby="ariaLabelledby"
    :aria-label="ariaLabel"
    :focus-anchor-on-close="focusAnchorOnClose"
    :offset="offset"
    :append-to="appendTo"
    :interactive="interactive"
    :flip-boundary="flipBoundary"
    :interactive-border="interactiveBorder"
    :trigger="trigger"
    :modal="modal"
    :content-width="contentWidth"
    width-content="anchor"
    @update:open="updateOpen"
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
        <span
          v-if="content"
          v-html="content"
        />
        <span v-else>I will be displayed in the popover!</span>
      </p>
    </template>
  </dt-popover>
</template>

<script>
import { DtPopover } from './';
import { DtButton } from '../button';

export default {
  name: 'PopoverDefaultStory',
  components: {
    DtPopover,
    DtButton,
  },

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

  methods: {
    updateOpen (isOpen) {
      this.isOpen = isOpen;
      this.onClose(isOpen);
    },
  },
};
</script>
