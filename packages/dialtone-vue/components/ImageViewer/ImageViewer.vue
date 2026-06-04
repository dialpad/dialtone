<template>
  <div>
    <dt-button
      data-qa="dt-image-viewer-preview"
      class="d-image-viewer__preview-button"
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
    <Teleport
      v-if="isOpen"
      :to="appendTo"
    >
      <div
        v-dt-focustrap="{ active: isOpen, initialFocus: false, restoreFocus: false }"
        :aria-hidden="!isOpen ? 'true' : 'false'"
        class="d-modal"
        data-qa="dt-modal"
        v-bind="modeAttrs"
        v-on="modalListeners"
        @mouseover="showCloseButton = true"
        @mouseleave="showCloseButton = false"
        @focusin=" showCloseButton = true"
        @focusout=" showCloseButton = false"
      >
        <div
          data-qa="dt-image-viewer-full"
          class="d-image-viewer__full"
          role="dialog"
          aria-modal="true"
        >
          <img
            class="d-image-viewer__full__image"
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
            :size="400"
            importance="clear"
            kind="inverted"
            :aria-label="closeButtonTitle"
            :title="closeButtonTitle"
            @click="close"
          >
            <template #icon>
              <dt-icon-close
                class="d-image-viewer__close-button"
                size="400"
              />
            </template>
          </dt-button>
          <sr-only-close-button
            v-else
            @close="close"
          />
        </transition>
      </div>
    </Teleport>
  </div>
</template>

<script>
import ModeMixin from '@/common/mixins/mode';
import { returnFirstEl } from '@/common/utils';
import { EVENT_KEYNAMES } from '@/common/constants';
import { DtIconClose } from '@dialpad/dialtone-icons/vue';
import { DtButton } from '@/components/Button';
import SrOnlyCloseButton from '@/common/sr_only_close_button.vue';
import { DialtoneLocalization } from '@/localization';

export default {
  name: 'DtImageViewer',

  components: {
    SrOnlyCloseButton,
    DtButton,
    DtIconClose,
  },

  mixins: [ModeMixin],

  props: {
    /**
     * By default the portal appends to the body of the root parent. We can modify
     * this behaviour by passing an appendTo prop that points to an id or an html tag from the root of the parent.
     * The appendTo prop expects a CSS selector string or an actual DOM node.
     * type: string | HTMLElement, default: 'body'
     */
    appendTo: {
      type: String,
      default: 'body',
    },

    /**
     * Controls whether the image modal is shown. When null (default), the image modal
     * triggers on click. When set to true or false, the default trigger is
     * disabled and the parent controls visibility via v-model:open.
     * @values null, true, false
     */
    open: {
      type: [Boolean, null],
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
      i18n: new DialtoneLocalization(),
    };
  },

  computed: {
    modalListeners () {
      return {
        click: event => {
          (event.target === event.currentTarget) && this.close();
        },

        keydown: event => {
          // Tab focus trapping is handled by the v-dt-focustrap directive on the modal.
          switch (event.code) {
            case EVENT_KEYNAMES.esc:
            case EVENT_KEYNAMES.escape:
              this.close();
              break;
          }
        },
      };
    },

    closeButtonTitle () {
      return this.i18n.$t('DIALTONE_CLOSE_BUTTON');
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
      returnFirstEl(this.$refs.closeImage?.$el)?.focus();
    },
  },
};
</script>
