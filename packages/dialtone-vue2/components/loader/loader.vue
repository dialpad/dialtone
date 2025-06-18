<template>
  <div
    class="d-loader"
    :aria-label="loaderText"
    data-qa="dt-loader"
  >
    <dt-icon-loading
      class="d-loader-icon"
      data-qa="dt-loader-icon"
      :size="size"
    />
  </div>
</template>

<script>
import { DtIconLoading } from '@dialpad/dialtone-icons/vue2';
import { ICON_SIZE_MODIFIERS } from '@/components/icon';
import { DtLocalizationMixin } from '@/common/mixins';

export default {
  name: 'DtLoader',

  components: {
    DtIconLoading,
  },

  mixins: [DtLocalizationMixin],

  props: {
    /**
     * The label of the loader as read out by a screen reader.
     * Default is "loading"
     */
    ariaLabel: {
      type: String,
      default: '',
    },

    /**
     * The size of the icon.
     * @values 100, 200, 300, 400, 500, 600, 700, 800
     */
    size: {
      type: String,
      default: '500',
      validator: (s) => Object.keys(ICON_SIZE_MODIFIERS).includes(s),
    },
  },

  computed: {
    loaderText () {
      return this.ariaLabel || this.i18n.$t('DIALTONE_LOADING');
    },
  },
};
</script>
