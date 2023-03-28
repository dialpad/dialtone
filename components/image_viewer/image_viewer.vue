<template>
  <div>
    <dt-button
      data-qa="dt-image-viewer-preview"
      :aria-label="ariaLabel"
      importance="clear"
      @click="open"
    >
      <img
        :class="imageButtonClass"
        :src="imageSrc"
        :alt="imageAlt"
      >
    </dt-button>
    <Teleport
      v-if="show"
      to="body"
    >
      <div
        :aria-hidden="isOpen"
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
    </Teleport>
  </div>
</template>

<script>
import Modal from '@/common/mixins/modal.js';
import { EVENT_KEYNAMES } from '@/common/constants';
import { DtIcon } from '@/components/icon';
import { DtButton } from '@/components/button';

export default {
  name: 'DtImageViewer',

  components: {
    DtButton,
    DtIcon,
  },

  mixins: [Modal],

  props: {
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

  data () {
    return {
      show: false,
      showCloseButton: true,
    };
  },

  computed: {
    isOpen () {
      return `${!this.show}`;
    },

    modalListeners () {
      return {
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
    show: {
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
  },

  methods: {
    open () {
      this.show = true;
      this.showCloseButton = true;
      setTimeout(() => {
        this.focusAfterOpen();
      });
    },

    close () {
      this.show = false;
    },

    focusAfterOpen () {
      this.$refs.closeImage?.$el.focus();
    },

    trapFocus (e) {
      if (this.show) {
        this.focusTrappedTabPress(e);
      }
    },

  },
};
</script>
