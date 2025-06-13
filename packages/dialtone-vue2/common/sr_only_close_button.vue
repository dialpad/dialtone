<template>
  <dt-button
    id="sr-only-close-button"
    data-qa="dt-sr-only-close-button"
    class="d-vi-visible-sr"
    :aria-label="closeButtonTitle"
    :title="closeButtonTitle"
    @click="close"
    @keydown.space.prevent.stop="close"
  >
    <dt-icon-close />
  </dt-button>
</template>

<script>
import { DtIconClose } from '@dialpad/dialtone-icons/vue2';
import { DtButton } from '@/components/button';
import { DtLocalizationMixin } from '@/common/mixins';

export default {
  name: 'SrOnlyCloseButton',
  components: {
    DtIconClose,
    DtButton,
  },

  mixins: [DtLocalizationMixin],

  emits: ['close'],

  computed: {
    closeButtonTitle () {
      return this.i18n.$t('DIALTONE_CLOSE_BUTTON');
    },
  },

  methods: {
    close () {
      this.$emit('close');
    },
  },
};
</script>
