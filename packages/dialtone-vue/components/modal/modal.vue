<template>
  <teleport
    :disabled="!appendTo"
    :to="appendTo"
  >
    <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
    <dialog
      ref="dialogEl"
      :class="[
        'd-modal',
        MODAL_KIND_MODIFIERS[kind],
        MODAL_SIZE_MODIFIERS[size],
        modalClass,
      ]"
      data-qa="dt-modal"
      :aria-describedby="describedById || undefined"
      :aria-labelledby="labelledById"
      v-bind="modeAttrs"
      @cancel.prevent="close"
      @click="onBackdropClick"
      @keydown="onKeydown"
    >
      <div
        v-if="show && (hasSlotContent($slots.banner) || bannerTitle)"
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
        :appear="show"
        name="d-modal__dialog"
        @after-enter="onAfterEnter"
        @after-leave="onAfterLeave"
      >
        <div
          v-show="show"
          :class="[
            'd-modal__dialog',
            { 'd-modal__dialog--scrollable': fixedHeaderFooter },
            dialogClass,
          ]"
        >
          <div
            v-if="hasSlotContent($slots.header)"
            :id="labelledById"
            class="d-modal__header"
            data-qa="dt-modal-title"
          >
            <!-- @slot Slot for dialog header section, taking the place of any "title" text prop -->
            <slot name="header" />
          </div>
          <dt-text
            v-else
            :id="labelledById"
            kind="headline"
            :size="600"
            strength="medium"
            density="100"
            text-box-trim="start"
            as="h2"
            class="d-modal__header"
            data-qa="dt-modal-title"
          >
            {{ title }}
          </dt-text>
          <div
            v-if="hasSlotContent($slots.default)"
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
            :size="300"
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
    </dialog>
  </teleport>
</template>

<script>
/* eslint-disable max-lines */
import { DtButton } from '@/components/button';
import { DtText } from '@/components/text';
import { DtIconClose } from '@dialpad/dialtone-icons/vue';
import ModeMixin from '@/common/mixins/mode';
import {
  MODAL_BANNER_KINDS,
  MODAL_KIND_MODIFIERS,
  MODAL_SIZE_MODIFIERS,
} from './modal_constants';
import { getUniqueString, hasSlotContent, returnFirstEl, disableRootScrolling, enableRootScrolling } from '@/common/utils';
import SrOnlyCloseButton from '@/common/sr_only_close_button.vue';
import { NOTICE_KINDS } from '@/components/notice';
import { DialtoneLocalization } from '@/localization';

const focusableSelector = 'button:not(:disabled),[href],input:not(:disabled),select:not(:disabled),' +
  'textarea:not(:disabled),details,[tabindex]:not([tabindex="-1"]):not(:disabled):not([aria-disabled="true"])';

/**
 * Modals focus the user's attention exclusively on one task or piece of information
 * via a window that sits on top of the page content.
 * @see https://dialtone.dialpad.com/components/modal.html
 */
export default {
  compatConfig: { MODE: 3 },
  name: 'DtModal',

  components: {
    DtButton,
    DtText,
    DtIconClose,
    SrOnlyCloseButton,
  },

  mixins: [ModeMixin],

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
     * The theme of the modal.
     * @values default, critical
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
     * @values base, critical, info, positive, warning
     */
    bannerKind: {
      type: String,
      default: 'warning',
      validator (kind) {
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
      MODAL_BANNER_KINDS,
      hasSlotContent,
      i18n: new DialtoneLocalization(),
    };
  },

  computed: {
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
    show (isShowing) {
      this.syncDialogState(isShowing);
    },
  },

  mounted () {
    if (this.show) {
      this.syncDialogState(true);
    }
  },

  beforeUnmount () {
    const dialogEl = this.$refs.dialogEl;
    if (dialogEl?.open) {
      dialogEl.close();
      enableRootScrolling(this.getScrollRoot());
    }
    this.previousActiveElement = null;
  },

  methods: {
    getScrollRoot () {
      return returnFirstEl(this.$refs.dialogEl)?.getRootNode()?.host;
    },

    syncDialogState (isShowing) {
      const dialogEl = this.$refs.dialogEl;
      if (!dialogEl) return;

      if (isShowing) {
        this.previousActiveElement = document.activeElement;
        if (!dialogEl.open) {
          dialogEl.showModal();
        }
        disableRootScrolling(this.getScrollRoot());
      } else if (dialogEl.open) {
        // Leave transition plays via v-show on inner content.
        // close() is called in onAfterLeave when transition completes.
        enableRootScrolling(this.getScrollRoot());
      }
    },

    close () {
      this.$emit('update:show', false);
    },

    onBackdropClick (event) {
      if (this.closeOnClick && event.target === event.currentTarget) {
        this.close();
      }
      this.$emit('click', event);
    },

    onKeydown (event) {
      this.$emit('keydown', event);
    },

    async onAfterEnter () {
      this.$emit('update:show', true);
      await this.setFocusAfterTransition();
    },

    onAfterLeave () {
      const dialogEl = this.$refs.dialogEl;
      if (dialogEl?.open) {
        dialogEl.close();
      }
      this.previousActiveElement?.focus();
      this.previousActiveElement = null;
    },

    focusFirstTabbable (container) {
      const focusable = [...container.querySelectorAll(focusableSelector)];
      if (!focusable.length) return;
      let target = focusable[0];
      // If first focusable is an unchecked radio, prefer the checked radio in the same group.
      if (target.matches('[type="radio"]:not(:checked)')) {
        target = focusable.find(el => el.checked && el.name === target.name) || target;
      }
      target.focus({ preventScroll: true });
    },

    async setFocusAfterTransition () {
      const dialogEl = this.$refs.dialogEl;
      if (!dialogEl) return;

      await this.$nextTick();

      if (this.initialFocusElement === 'first') {
        this.focusFirstTabbable(dialogEl);
      } else if (typeof this.initialFocusElement === 'string' && this.initialFocusElement.startsWith('#')) {
        const el = dialogEl.querySelector(this.initialFocusElement);
        if (el) {
          el.focus();
        } else {
          // eslint-disable-next-line no-console
          console.warn('Could not find the element specified in dt-modal prop "initialFocusElement". ' +
            'Defaulting to focusing the first element.');
          this.focusFirstTabbable(dialogEl);
        }
      } else if (this.initialFocusElement instanceof HTMLElement) {
        this.initialFocusElement.focus();
      }
    },
  },
};
</script>
