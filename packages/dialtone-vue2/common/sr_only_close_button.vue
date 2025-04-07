<template>
  <dt-button
    id="sr-only-close-button"
    data-qa="dt-sr-only-close-button"
    class="d-vi-visible-sr"
    v-bind="$ta('CLOSE_BUTTON')"
    @click="close"
    @keydown.space.prevent.stop="close"
  >
    <dt-icon-close />
  </dt-button>
</template>

<script>
import { DtIconClose } from '@dialpad/dialtone-icons/vue2';
import { DtButton } from '@/components/button';
import { useI18N } from '@dialpad/i18n-vue2';
const { $ta } = useI18N();

export default {
  name: 'SrOnlyCloseButton',
  components: {
    DtIconClose,
    DtButton,
  },

  emits: ['close'],

  methods: {
    $ta,

    close () {
      this.$emit('close');
    },
  },
};
</script>
