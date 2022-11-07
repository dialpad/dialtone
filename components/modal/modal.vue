<template>
  <dt-lazy-show
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
          class="d-modal__content"
          data-qa="dt-modal-copy"
        >
          <!-- @slot Default slot for dialog body section, taking the place of any "copy" text prop -->
          <slot />
        </div>
        <p
          v-else
          class="d-modal__content"
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
        <dt-button
          v-if="!hideClose"
          class="d-modal__close"
          circle
          size="lg"
          importance="clear"
          :aria-label="closeButtonProps.ariaLabel"
          v-bind="closeButtonProps"
          :kind="kind"
          @click="close"
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
    </transition>
  </dt-lazy-show>
</template>

<script>
import DtButton from '../button/button.vue';
import IconClose from '@dialpad/dialtone/lib/dist/vue/icons/IconClose';
import Modal from '@/common/mixins/modal.js';
import { MODAL_KIND_MODIFIERS, MODAL_SIZE_MODIFIERS } from './modal_constants';
import { getUniqueString } from '@/common/utils';
import DtLazyShow from '../lazy_show/lazy_show';
import { EVENT_KEYNAMES } from '@/common/constants';
import SrOnlyCloseButtonMixin from '@/common/mixins/sr_only_close_button';
import SrOnlyCloseButton from '@/common/sr_only_close_button';

/**
 * Modals focus the user’s attention exclusively on one task or piece of information
 * via a window that sits on top of the page content.
 * @see https://dialpad.design/components/modal.html
 */
export default {
  name: 'DtModal',

  components: {
    DtLazyShow,
    DtButton,
    IconClose,
    SrOnlyCloseButton,
  },

  mixins: [Modal, SrOnlyCloseButtonMixin],

  props: {
    /**
     * A set of props to be passed into the modal's close button.
     * Requires an 'ariaLabel' property.
     */
    closeButtonProps: {
      type: Object,
      required: true,
      validator: (props) => {
        return !!props.ariaLabel;
      },
    },

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
     * Scrollable modal that allows scroll the modal content keeping the header and footer fixed
     * @values true, false
     */
    fixedHeaderFooter: {
      type: Boolean,
      default: true,
    },
  },

  emits: [
    /**
     * Native button click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',

    /**
     * Native keydown event
     *
     * @event keydown
     * @type {KeyboardEvent}
     */
    'keydown',

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
    };
  },

  computed: {
    modalListeners () {
      return {
        click: event => {
          (event.target === event.currentTarget) && this.close();
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

        'after-enter': event => {
          (event.target === event.currentTarget) && this.setFocusAfterTransition();
        },
      };
    },

    open () {
      return `${!this.show}`;
    },

    hasFooterSlot () {
      return !!this.$slots.footer;
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

    $props: {
      immediate: true,
      deep: true,
      handler () {
        this.validateProps();
      },
    },
  },

  methods: {
    close () {
      this.$emit('update:show', false);
    },

    setFocusAfterTransition () {
      this.focusFirstElement();
    },

    trapFocus (e) {
      if (this.show) {
        this.focusTrappedTabPress(e);
      }
    },

    validateProps () {
      if (this.hideClose && !this.visuallyHiddenClose) {
        console.error(`If hideClose prop is true, visuallyHiddenClose and visuallyHiddenCloseLabel props
        need to be set so the component always includes a close button`);
      }
    },
  },
};
</script>
