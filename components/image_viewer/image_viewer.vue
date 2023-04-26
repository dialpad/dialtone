<template>
  <div>
    <dt-button
      data-qa="dt-image-viewer-preview"
      class="d-p0 d-c-zoom-in"
      :aria-label="ariaLabel"
      importance="clear"
      @click="openModal"
    >
      <img
        :class="imageButtonClass"
        :src="imageSrc"
        :alt="imageAlt"
      >
    </dt-button>
    <portal v-if="isOpen">
      <div
        :aria-hidden="!isOpen ? 'true' : 'false'"
        class="d-modal"
        data-qa="dt-modal"
        v-on="modalListeners"
        @mouseover="showCloseButton = true"
        @mouseleave="showCloseButton = false"
        @focusin=" showCloseButton = true"
        @focusout=" showCloseButton = false"
      >
        <div
          data-qa="dt-image-viewer-full"
          class="d-p0 d-bar0 d-wmx80p d-hmx80p"
          role="dialog"
          aria-modal="true"
        >
          <img
            class="d-wmx100p d-hmx100p"
            :src="imageSrc"
            :alt="imageAlt"
          >
        </div>
        <transition name="fade">
          <dt-button
            v-if="showCloseButton"
            ref="closeImage"
            data-qa="dt-image-viewer-close-btn"
            class="d-modal__close"
            circle
            size="lg"
            importance="clear"
            kind="inverted"
            :aria-label="closeAriaLabel"
            @click="close"
          >
            <template #icon>
              <dt-icon
                name="close"
                size="400"
              />
            </template>
          </dt-button>
        </transition>
      </div>
    </portal>
  </div>
</template>

<script>
import Modal from '@/common/mixins/modal.js';
import { EVENT_KEYNAMES } from '@/common/constants';
import { DtIcon } from '@/components/icon';
import { DtButton } from '@/components/button';
import { Portal } from '@linusborg/vue-simple-portal';

export default {
  name: 'DtImageViewer',

  components: {
    Portal,
    DtButton,
    DtIcon,
  },

  mixins: [Modal],

  props: {
    /**
     * Controls whether the image modal is shown. Leaving this null will have the image modal
     * trigger on click by default.
     * If you set this value, the default trigger behavior will be disabled and you can control it as you need.
     * Supports .sync modifier
     * @values null, true, false
     */
    open: {
      type: Boolean,
      default: null,
    },

    /**
     * URL of the image to be shown
     */
    imageSrc: {
      type: String,
      required: true,
    },

    /**
     * Alt text of image
     */
    imageAlt: {
      type: String,
      required: true,
    },

    /**
     * Image Class
     */
    imageButtonClass: {
      type: String,
      required: false,
      default: '',
    },

    /**
     * Aria label
     */
    ariaLabel: {
      type: String,
      required: true,
    },

    /**
     * Aria label for close button
     */
    closeAriaLabel: {
      type: String,
      required: true,
    },
  },

  emits: [
    /**
     * Emitted when popover is shown or hidden
     *
     * @event opened
     * @type {Boolean}
     */
    'opened',

    /**
     * Event fired to sync the open prop with the parent component
     * @event update:open
     */
    'update:open',
  ],

  data () {
    return {
      showCloseButton: true,
      isOpen: false,
    };
  },

  computed: {
    modalListeners () {
      return {
        ...this.$listeners,

        click: event => {
          (event.target === event.currentTarget) && this.close();
        },

        keydown: event => {
          switch (event.code) {
            case EVENT_KEYNAMES.esc:
            case EVENT_KEYNAMES.escape:
              this.close();
              break;
            case EVENT_KEYNAMES.tab:
              this.trapFocus(event);
              break;
          }
        },
      };
    },
  },

  watch: {
    isOpen: {
      immediate: true,
      handler (isShowing) {
        if (isShowing) {
          // Set a reference to the previously-active element, to which we'll return focus on modal close.
          this.previousActiveElement = document.activeElement;
        } else {
          // Modal is being hidden, so return focus to the previously active element before clearing the reference.
          this.previousActiveElement?.focus();
          this.previousActiveElement = null;
        }
      },
    },

    open: {
      handler: function (open) {
        if (open !== null) {
          this.isOpen = open;
        }
      },

      immediate: true,
    },
  },

  methods: {
    openModal () {
      // Has custom control passed in
      if (this.open !== null) {
        return;
      }
      this.isOpen = true;
      this.showCloseButton = true;
      this.$emit('opened', true);

      setTimeout(() => {
        this.focusAfterOpen();
      });
    },

    close () {
      this.isOpen = false;
      this.$emit('opened', false);

      if (this.open !== null) {
        this.$emit('update:open', false);
      }
    },

    focusAfterOpen () {
      this.$refs.closeImage?.$el.focus();
    },

    trapFocus (e) {
      if (this.isOpen) {
        this.focusTrappedTabPress(e);
      }
    },

  },
};
</script>
