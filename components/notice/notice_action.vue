<template>
  <div
    class="d-notice__actions"
    data-qa="notice-content-actions"
  >
    <!-- @slot Slot for main content -->
    <slot />
    <dt-button
      v-if="!hideClose"
      ref="closeButton"
      data-qa="dt-notice-action-close-button"
      size="sm"
      importance="clear"
      circle
      :aria-label="closeButtonProps.ariaLabel ? closeButtonProps.ariaLabel : 'Close'"
      v-bind="closeButtonProps"
      v-on="noticeActionListeners"
    >
      <template #icon>
        <icon-close />
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
import IconClose from '@dialpad/dialtone/lib/dist/vue/icons/IconClose';
import DtButton from '../button/button';
import SrOnlyCloseButtonMixin from '@/common/mixins/sr_only_close_button';
import SrOnlyCloseButton from '@/common/sr_only_close_button';

export default {
  name: 'DtNoticeAction',

  components: {
    IconClose,
    DtButton,
    SrOnlyCloseButton,
  },

  mixins: [SrOnlyCloseButtonMixin],

  props: {
    /**
     * Props for the notice close button.
     */
    closeButtonProps: {
      type: Object,
      default: () => ({}),
    },

    /**
     * Hides the close button from the notice
     * @values true, false
     */
    hideClose: {
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

  watch: {
    $props: {
      immediate: true,
      deep: true,
      handler () {
        this.validateProps();
      },
    },
  },

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

    validateProps () {
      if (this.hideClose && !this.visuallyHiddenClose) {
        console.error('If hideClose prop is true, visuallyHiddenClose and visuallyHiddenCloseLabel props ' +
          'need to be set so the component always includes a close button');
      }
    },
  },
};
</script>
