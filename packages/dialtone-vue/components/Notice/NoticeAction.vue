<template>
  <div
    :class="['d-notice__actions', actionClass]"
    data-qa="notice-content-actions"
  >
    <!-- @slot Slot for main content -->
    <slot v-if="showAction" />
    <dt-button
      v-if="showClose"
      ref="closeButton"
      data-qa="dt-notice-action-close-button"
      importance="clear"
      kind="muted"
      :size="200"
      :aria-label="closeButtonTitle"
      :title="closeButtonTitle"
      @click="close"
    >
      <template #startIcon>
        <dt-icon-close
          size="200"
        />
      </template>
    </dt-button>
    <sr-only-close-button
      v-else
      @close="close"
    />
  </div>
</template>

<script>
import { DtIconClose } from '@dialpad/dialtone-icons/vue';
import { DtButton } from '@/components/Button';
import SrOnlyCloseButton from '@/common/sr_only_close_button.vue';
import { DialtoneLocalization } from '@/localization';

export default {
  name: 'DtNoticeAction',

  components: {
    DtIconClose,
    DtButton,
    SrOnlyCloseButton,
  },

  props: {
    /**
     * Shows the close button in the notice
     * @values true, false
     */
    showClose: {
      type: Boolean,
      default: true,
    },

    /**
     * Shows the action in the notice
     * @values true, false
     */
    showAction: {
      type: Boolean,
      default: true,
    },

    /**
     * Additional class name for the action wrapper element.
     */
    actionClass: {
      type: [String, Array, Object],
      default: '',
    },
  },

  emits: [
    /**
     * Close button click event
     *
     * @event close
     */
    'close',
  ],

  data () {
    return {
      i18n: new DialtoneLocalization(),
    };
  },

  computed: {
    closeButtonTitle () {
      return this.i18n.$t('DIALTONE_CLOSE_BUTTON');
    },
  },

  mounted () {
    if (this.showClose) {
      this.lastFocusedElement = document.activeElement;
    }
  },

  beforeUnmount () {
    this.lastFocusedElement?.focus();
  },

  methods: {
    close () {
      this.$emit('close');
    },
  },
};
</script>
