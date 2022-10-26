<template>
  <dt-button
    id="sr-only-close-button"
    data-qa="dt-sr-only-close-button"
    class="d-vi-visible-sr"
    :aria-label="visuallyHiddenCloseLabel"
    @click="close"
    @keydown.space.prevent.stop="close"
  >
    <icon-close />
  </dt-button>
</template>

<script>
import IconClose from '@dialpad/dialtone/lib/dist/vue/icons/IconClose';
import { DtButton } from '../components/button';

export default {
  name: 'SrOnlyCloseButton',
  components: {
    IconClose,
    DtButton,
  },

  props: {
    /**
     * Label for the visually hidden close button
     * Required if visuallyHiddenClose is set to `true`
     */
    visuallyHiddenCloseLabel: {
      type: String,
      default: null,
    },
  },

  methods: {
    close () {
      this.$emit('close');
    },
  },
};
</script>
