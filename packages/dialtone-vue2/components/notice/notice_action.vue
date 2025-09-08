<template>
  <div
    class="d-notice__actions"
    data-qa="notice-content-actions"
  >
    <!-- @slot Slot for main content -->
    <slot v-if="!hideAction" />
    <dt-button
      v-if="!hideClose"
      ref="closeButton"
      circle
      data-qa="dt-notice-action-close-button"
      importance="clear"
      size="sm"
      :aria-label="closeButtonTitle"
      :title="closeButtonTitle"
      v-on="noticeActionListeners"
    >
      <template #icon>
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
import { DtIconClose } from '@dialpad/dialtone-icons/vue2';
import { DtButton } from '@/components/button';
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
     * Hides the close button from the notice
     * @values true, false
     */
    hideClose: {
      type: Boolean,
      default: false,
    },

    /**
     * Hides the action from the notice
     * @values true, false
     */
    hideAction: {
      type: Boolean,
      default: false,
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
    noticeActionListeners () {
      return {
        ...this.$listeners,

        click: event => {
          this.close();
          this.$emit('click', event);
        },
      };
    },

    closeButtonTitle () {
      return this.i18n.$t('DIALTONE_CLOSE_BUTTON');
    },
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
