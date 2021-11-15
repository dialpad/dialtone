<template>
  <div
    class="d-notice__actions"
    data-qa="notice-content-actions"
  >
    <slot />
    <dt-button
      v-if="!hideClose"
      ref="closeButton"
      size="sm"
      importance="clear"
      circle
      :aria-label="closeButtonProps.ariaLabel ? closeButtonProps.ariaLabel : 'Close'"
      v-bind="closeButtonProps"
      @click="close"
    >
      <template #icon>
        <icon-close />
      </template>
    </dt-button>
  </div>
</template>

<script>
import IconClose from '@dialpad/dialtone/lib/dist/vue/icons/IconClose';
import DtButton from '../button/button';

export default {
  name: 'DtNoticeAction',

  components: {
    IconClose,
    DtButton,
  },

  props: {
    closeButtonProps: {
      type: Object,
      default: () => ({}),
    },

    hideClose: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close'],

  created () {
    if (!this.hideClose && !this.closeButtonProps.ariaLabel) {
      console.error('Invalid props: you must pass in closeButtonProps.ariaLabel if the close button is displayed.');
    }
  },

  mounted () {
    if (!this.hideClose) {
      this.lastFocusedElement = document.activeElement;
    }
  },

  beforeDestroy () {
    this.lastFocusedElement?.focus();
  },

  methods: {
    close () {
      this.$emit('close');
    },
  },
};
</script>
