<template>
  <portal
    :disabled="!appendTo"
    :selector="appendTo"
  >
    <dt-lazy-show
      ref="modalRoot"
      transition="d-zoom"
      :show="show"
      :class="[
        'd-modal',
        MODAL_KIND_MODIFIERS[kind],
        MODAL_SIZE_MODIFIERS[size],
        modalClass,
      ]"
      data-qa="dt-modal"
      :aria-hidden="open"
      v-on="modalListeners"
    >
      <div
        v-if="show && ($slots.banner || bannerTitle)"
        data-qa="dt-modal-banner"
        :class="[
          'd-modal__banner',
          bannerClass,
          bannerKindClass,
        ]"
      >
        <!-- @slot Slot for the banner, defaults to bannerTitle prop -->
        <slot name="banner">
          {{ bannerTitle }}
        </slot>
      </div>
      <transition
        appear
        name="d-modal__dialog"
      >
        <div
          v-show="show"
          :class="[
            'd-modal__dialog',
            { 'd-modal__dialog--scrollable': fixedHeaderFooter },
            dialogClass,
          ]"
          role="dialog"
          aria-modal="true"
          :aria-describedby="describedById"
          :aria-labelledby="labelledById"
        >
          <div
            v-if="$slots.header"
            :id="labelledById"
            class="d-modal__header"
            data-qa="dt-modal-title"
          >
            <!-- @slot Slot for dialog header section, taking the place of any "title" text prop -->
            <slot name="header" />
          </div>
          <h2
            v-else
            :id="labelledById"
            class="d-modal__header"
            data-qa="dt-modal-title"
          >
            {{ title }}
          </h2>
          <div
            v-if="$slots.default"
            :class="[
              'd-modal__content',
              contentClass,
            ]"
            data-qa="dt-modal-copy"
          >
            <!-- @slot Default slot for dialog body section, taking the place of any "copy" text prop -->
            <slot />
          </div>
          <p
            v-else
            :class="[
              'd-modal__content',
              contentClass,
            ]"
            data-qa="dt-modal-copy"
          >
            {{ copy }}
          </p>
          <footer
            v-if="hasFooterSlot"
            class="d-modal__footer"
          >
            <!-- @slot Slot for dialog footer content, often containing cancel and confirm buttons. -->
            <slot name="footer" />
          </footer>
          <sr-only-close-button
            v-if="hideClose"
            @close="close"
          />
          <dt-button
            v-else
            class="d-modal__close"
            data-qa="dt-modal-close-button"
            size="md"
            kind="muted"
            importance="clear"
            :aria-label="closeButtonTitle"
            :title="closeButtonTitle"
            @click="close"
          >
            <template #icon="{ iconSize }">
              <dt-icon-close
                :size="iconSize"
              />
            </template>
          </dt-button>
        </div>
      </transition>
    </dt-lazy-show>
  </portal>
</template>

<script>
/* eslint-disable max-lines */
import { DtButton } from '@/components/button';
import { DtIconClose } from '@dialpad/dialtone-icons/vue2';
import Modal from '@/common/mixins/modal';
import {
  MODAL_BANNER_KINDS,
  MODAL_KIND_MODIFIERS,
  MODAL_SIZE_MODIFIERS,
} from './modal_constants';
import { getUniqueString, disableRootScrolling, enableRootScrolling } from '@/common/utils';
import { DtLazyShow } from '@/components/lazy_show';
import { EVENT_KEYNAMES } from '@/common/constants';
import SrOnlyCloseButton from '@/common/sr_only_close_button.vue';
import { NOTICE_KINDS } from '@/components/notice';
import { DialtoneLocalization } from '@/localization';
import { Portal } from '@linusborg/vue-simple-portal';

/**
 * Modals focus the user’s attention exclusively on one task or piece of information
 * via a window that sits on top of the page content.
 * @see https://dialtone.dialpad.com/components/modal.html
 */
export default {
  name: 'DtModal',

  components: {
    DtLazyShow,
    DtButton,
    DtIconClose,
    SrOnlyCloseButton,
    Portal,
  },

  mixins: [Modal],

  props: {
    /**
     * Body text to display as the modal's main content.
     */
    copy: {
      type: String,
      default: '',
    },

    /**
     * Id to use for the dialog's aria-describedby.
     * Recommended only if the dialog content itself isn't enough to give full context,
     * as screen readers should recite the dialog contents by default before any aria-description.
     */
    describedById: {
      type: String,
      default: '',
    },

    /**
     * Id to use for the dialog's aria-labelledby.
     */
    labelledById: {
      type: String,
      default: function () { return getUniqueString(); },
    },

    /**
     * Whether the modal should be shown.
     * Parent component can sync on this value to control the modal's visibility.
     * @values true, false
     */
    show: {
      type: Boolean,
      default: false,
    },

    /**
     * Title text to display in the modal header.
     */
    title: {
      type: String,
      default: '',
    },

    /**
     * Title text to display in the modal banner.
     */
    bannerTitle: {
      type: String,
      default: '',
    },

    /**
     * The theme of the modal. kind - default or danger,
     * @values default, danger
     */
    kind: {
      type: String,
      default: 'default',
      validator: (k) => Object.keys(MODAL_KIND_MODIFIERS).includes(k),
    },

    /**
     * The size of the modal. size - default or full,
     * @values default, full
     */
    size: {
      type: String,
      default: 'default',
      validator: (s) => Object.keys(MODAL_SIZE_MODIFIERS).includes(s),
    },

    /**
     * Additional class name for the root modal element.
     * Can accept String, Object, and Array, i.e. has the
     * same API as Vue's built-in handling of the class attribute.
     */
    modalClass: {
      type: [String, Object, Array],
      default: '',
    },

    /**
     * Additional class name for the dialog element within the modal.
     * Can accept String, Object, and Array, i.e. has the
     * same API as Vue's built-in handling of the class attribute.
     */
    dialogClass: {
      type: [String, Object, Array],
      default: '',
    },

    /**
     * Additional class name for the content element within the modal.
     * Can accept String, Object, and Array, i.e. has the
     * same API as Vue's built-in handling of the class attribute.
     */
    contentClass: {
      type: [String, Object, Array],
      default: '',
    },

    /**
     * Sets the color of the banner.
     * @values base, error, info, success, warning
     */
    bannerKind: {
      type: String,
      default: 'warning',
      validate (kind) {
        return NOTICE_KINDS.includes(kind);
      },
    },

    /**
     * Additional class name for the banner element within the modal.
     * Can accept String, Object, and Array, i.e. has the
     * same API as Vue's built-in handling of the class attribute.
     */
    bannerClass: {
      type: [String, Object, Array],
      default: '',
    },

    /**
     * Hides the close button on the modal
     * @values true, false
     */
    hideClose: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether the modal will close when you click outside of the dialog on the overlay.
     * @values true, false
     */
    closeOnClick: {
      type: Boolean,
      default: true,
    },

    /**
     * Scrollable modal that allows scroll the modal content keeping the header and footer fixed
     * @values true, false
     */
    fixedHeaderFooter: {
      type: Boolean,
      default: true,
    },

    /**
     * The element that is focused when the modal is opened. This can be an
     * HTMLElement within the modal, a string starting with '#' which will
     * find the element by ID. 'first' which will automatically focus
     * the first element, or 'dialog' which will focus the dialog window itself.
     * If the dialog is modal this prop cannot be 'none'.
     */
    initialFocusElement: {
      type: [String, HTMLElement],
      default: 'first',
      validator: initialFocusElement => {
        return initialFocusElement === 'first' ||
          (initialFocusElement instanceof HTMLElement) ||
          initialFocusElement.startsWith('#');
      },
    },

    /**
     * A CSS selector string for the element to portal the modal to. If not provided, the modal will be rendered in its default location.
     */
    appendTo: {
      type: String,
      default: undefined,
    },
  },

  emits: [
    /**
     * The modal will emit a "false" boolean value for this event when the user performs a modal-closing action.
     * Parent components can sync on this value to create a 2-way binding to control modal visibility.
     *
     * @event update:show
     * @type {Boolean}
     */
    'update:show',
  ],

  data () {
    return {
      MODAL_KIND_MODIFIERS,
      MODAL_SIZE_MODIFIERS,
      MODAL_BANNER_KINDS,
      EVENT_KEYNAMES,
      i18n: new DialtoneLocalization(),
    };
  },

  computed: {
    modalListeners () {
      return {
        ...this.$listeners,

        click: event => {
          // Handle backdrop clicks for closing modal
          if (this.closeOnClick && event.target === event.currentTarget) {
            this.close();
          } else if (this.show && event.target !== event.currentTarget) {
            // Ensure focus stays within modal when clicking inside it
            this.handleModalClick(event);
          }

          this.$emit('click', event);
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
          this.$emit('keydown', event);
        },

        'after-enter': async () => {
          this.$emit('update:show', true);
          await this.setFocusAfterTransition();
        },
      };
    },

    open () {
      return `${!this.show}`;
    },

    hasFooterSlot () {
      return !!this.$slots.footer;
    },

    bannerKindClass () {
      return MODAL_BANNER_KINDS[this.bannerKind];
    },

    closeButtonTitle () {
      return this.i18n.$t('DIALTONE_CLOSE_BUTTON');
    },
  },

  watch: {
    show: {
      handler (isShowing) {
        if (isShowing) {
          // Set a reference to the previously-active element, to which we'll return focus on modal close.
          this.previousActiveElement = document.activeElement;
          const modalEl = this.$refs.modalRoot?.$el || this.$el;
          disableRootScrolling(modalEl.getRootNode().host);
        } else {
          const modalEl = this.$refs.modalRoot?.$el || this.$el;
          enableRootScrolling(modalEl.getRootNode().host);
          // Modal is being hidden, so return focus to the previously active element before clearing the reference.
          this.previousActiveElement?.focus();
          this.previousActiveElement = null;
        }
      },
    },
  },

  methods: {
    close () {
      this.$emit('update:show', false);
    },

    async setFocusAfterTransition () {
      const modalEl = this.$refs.modalRoot?.$el || this.$el;
      if (this.initialFocusElement === 'first') {
        await this.focusFirstElement(modalEl);
      } else if (this.initialFocusElement.startsWith('#')) {
        await this.focusElementById(this.initialFocusElement);
      } else if (this.initialFocusElement instanceof HTMLElement) {
        this.initialFocusElement.focus();
      }
    },

    trapFocus (e) {
      if (this.show) {
        const modalEl = this.$refs.modalRoot?.$el || this.$el;
        this.focusTrappedTabPress(e, modalEl);
      }
    },

    handleModalClick (event) {
      // Ensure focus stays within modal when clicking inside it
      const clickedElement = event.target;
      const modalEl = this.$refs.modalRoot?.$el || this.$el;
      const focusableElements = this._getFocusableElements(modalEl);

      // If the clicked element is not focusable, ensure focus stays in modal
      if (focusableElements.length && !focusableElements.includes(clickedElement)) {
        // Check if current active element is still within the modal
        if (!focusableElements.includes(document.activeElement)) {
          this.focusFirstElement(modalEl);
        }
      }
    },
  },
};
</script>
