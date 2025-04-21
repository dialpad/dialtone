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
      v-bind="$ta('CLOSE_BUTTON')"
      v-on="noticeActionListeners"
    >
      <template #icon>
        <dt-icon-close
          size="200"
        />
      </template>
    </dt-button>
    <sr-only-close-button
      v-if="showVisuallyHiddenClose"
      :visually-hidden-close-label="visuallyHiddenCloseLabel"
      @close="close"
    />
  </div>
</template>

<script>
import { DtIconClose } from '@dialpad/dialtone-icons/vue2';
import { DtButton } from '@/components/button';
import SrOnlyCloseButtonMixin from '@/common/mixins/sr_only_close_button';
import SrOnlyCloseButton from '@/common/sr_only_close_button.vue';
import { DtLocalizationMixin } from '@/common/mixins';

export default {
  name: 'DtNoticeAction',

  components: {
    DtIconClose,
    DtButton,
    SrOnlyCloseButton,
  },

  mixins: [SrOnlyCloseButtonMixin, DtLocalizationMixin],

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
