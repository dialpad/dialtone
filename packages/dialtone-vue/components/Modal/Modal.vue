<template>
  <teleport
    :disabled="!appendTo && !autoTeleportTarget"
    :to="appendTo || autoTeleportTarget"
  >
    <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
    <dialog
      ref="dialogEl"
      v-dt-focustrap="{ active: open, initialFocus: false, restoreFocus: false }"
      :class="[
        'd-modal',
        MODAL_KIND_MODIFIERS[kind],
        { 'd-modal--full': fullscreen },
        { 'd-modal--transparent-backdrop': transparentBackdrop },
        modalClass,
      ]"
      data-qa="dt-modal"
      aria-modal="true"
      :aria-describedby="describedById || undefined"
      :aria-labelledby="labelledById"
      v-bind="modeAttrs"
      @cancel.prevent="close"
      @click="onBackdropClick"
      @keydown="onKeydown"
    >
      <div
        v-if="open && (hasSlotContent($slots.banner) || bannerHeaderText)"
        data-qa="dt-modal-banner"
        :class="[
          'd-modal__banner',
          bannerClass,
          bannerKindClass,
        ]"
      >
        <!-- @slot Slot for the banner, defaults to bannerHeaderText prop -->
        <slot name="banner">
          {{ bannerHeaderText }}
        </slot>
      </div>
      <transition
        :appear="open"
        name="d-modal__dialog"
        @after-enter="onAfterEnter"
        @after-leave="onAfterLeave"
      >
        <div
          v-show="open"
          :class="[
            'd-modal__dialog',
            { 'd-modal__dialog--scrollable': fixedHeaderFooter },
            dialogClass,
          ]"
        >
          <div
            v-if="hasSlotContent($slots.header)"
            :id="labelledById"
            :class="['d-modal__header', headerClass]"
            data-qa="dt-modal-title"
          >
            <!-- @slot Slot for dialog header section, taking the place of any "headerText" text prop -->
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
            :class="['d-modal__header', headerClass]"
            data-qa="dt-modal-title"
          >
            {{ headerText }}
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
            :class="['d-modal__footer', footerClass]"
          >
            <!-- @slot Slot for dialog footer content, often containing cancel and confirm buttons. -->
            <slot name="footer" />
          </footer>
          <sr-only-close-button
            v-if="!showClose"
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
import { DtButton } from '@/components/Button';
import { DtText } from '@/components/Text';
import { DtIconClose } from '@dialpad/dialtone-icons/vue';
import ModeMixin from '@/common/mixins/mode';
import {
  MODAL_BANNER_KINDS,
  MODAL_KIND_MODIFIERS,
} from './ModalConstants';
import { getUniqueString, hasSlotContent, returnFirstEl, disableRootScrolling, enableRootScrolling } from '@/common/utils';
import { HTML_ELEMENT_TYPE } from '@/common/constants';
import SrOnlyCloseButton from '@/common/sr_only_close_button.vue';
import { NOTICE_KINDS } from '@/components/Notice';
import { DialtoneLocalization } from '@/localization';

const focusableSelector = 'button:not(:disabled),[href],input:not(:disabled),select:not(:disabled),' +
  'textarea:not(:disabled),details,[tabindex]:not([tabindex="-1"]):not(:disabled):not([aria-disabled="true"])';

/**
 * Open non-modal dialogs, oldest first, shared across instances. Only the topmost
 * one decides what is inert, which mirrors the browser: a dialog stacked above
 * another leaves the one below inert too, and whichever closes first the result is
 * recomputed from the remaining stack rather than unwound per instance.
 */
const openDialogs = [];

/** Elements we set inert, mapped to the value to restore when they are released. */
const inertedByDialtone = new Map();

function refreshInertForTopDialog () {
  inertedByDialtone.forEach((wasInert, el) => { el.inert = wasInert; });
  inertedByDialtone.clear();

  const top = openDialogs[openDialogs.length - 1];
  if (!top) return;

  const root = top.getRootNode();
  const container = root === document ? document.body : root;

  // The dialog only teleports when appendTo or a shadow root is in play, so by
  // default it renders wherever the consumer placed it. Walking up and inerting the
  // siblings at every level is what reaches the elements between the dialog and the
  // container; the dialog's own ancestor chain stays reachable.
  let node = top;
  while (node && node !== container) {
    const parent = node.parentNode;
    if (!parent?.children) break;
    [...parent.children].forEach((el) => {
      if (el === node || inertedByDialtone.has(el)) return;
      inertedByDialtone.set(el, !!el.inert);
      el.inert = true;
    });
    node = parent;
  }
}

function pushOpenDialog (el) {
  removeFromStack(el);
  openDialogs.push(el);
  refreshInertForTopDialog();
}

function removeOpenDialog (el) {
  removeFromStack(el);
  refreshInertForTopDialog();
}

function removeFromStack (el) {
  const index = openDialogs.indexOf(el);
  if (index !== -1) openDialogs.splice(index, 1);
}

/**
 * Modals focus the user's attention exclusively on one task or piece of information
 * via a window that sits on top of the page content.
 * @see https://dialtone.dialpad.com/components/modal.html
 */
export default {
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
    open: {
      type: Boolean,
      default: false,
    },

    /**
     * Header text to display in the modal header.
     */
    headerText: {
      type: String,
      default: undefined,
    },

    /**
     * Header text to display in the modal banner.
     */
    bannerHeaderText: {
      type: String,
      default: undefined,
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
     * Whether the modal fills the viewport instead of rendering at its default size.
     * @values true, false
     */
    fullscreen: {
      type: Boolean,
      default: false,
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
     * Additional class name for the header element within the modal.
     * Can accept String, Object, and Array, i.e. has the
     * same API as Vue's built-in handling of the class attribute.
     */
    headerClass: {
      type: [String, Object, Array],
      default: '',
    },

    /**
     * Additional class name for the footer element within the modal.
     * Can accept String, Object, and Array, i.e. has the
     * same API as Vue's built-in handling of the class attribute.
     */
    footerClass: {
      type: [String, Object, Array],
      default: '',
    },

    /**
     * Shows the close button on the modal
     * @values true, false
     */
    showClose: {
      type: Boolean,
      default: true,
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
      type: [String, HTML_ELEMENT_TYPE],
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

    /**
     * When true, the surrounding backdrop is rendered fully transparent
     * instead of the default dimming overlay. The dialog box itself
     * remains opaque. Useful when the underlying UI should remain visible.
     * @values true, false
     */
    transparentBackdrop: {
      type: Boolean,
      default: false,
    },

    /**
     * When true, the dialog opens with showModal(), which promotes it to the browser
     * top layer. Nothing outside the top layer can paint above it regardless of
     * z-index, so application surfaces such as toasts and call notifications end up
     * behind it. When false, it opens with show() and stays in the normal stacking
     * order, where the Dialtone z-index scale applies and --zi-notification (700)
     * outranks --zi-modal (600) as documented.
     *
     * Focus trapping, background inertness, scroll locking and Esc-to-close behave
     * identically in both modes; only top-layer promotion differs.
     * @values true, false
     */
    modal: {
      type: Boolean,
      default: false,
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
     * @event update:open
     * @type {Boolean}
     */
    'update:open',
  ],

  data () {
    return {
      MODAL_KIND_MODIFIERS,
      MODAL_BANNER_KINDS,
      hasSlotContent,
      i18n: new DialtoneLocalization(),
      autoTeleportTarget: null,
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
    open (isShowing) {
      this.syncDialogState(isShowing);
    },
  },

  mounted () {
    if (!this.appendTo) {
      const root = this.$el?.getRootNode();
      if (root instanceof ShadowRoot) {
        this.autoTeleportTarget = root;
        // Defer syncDialogState so the teleport renders inside the shadow root first.
        if (this.open) this.$nextTick(() => { if (this.open) this.syncDialogState(true); });
        return;
      }
    }
    if (this.open) {
      this.syncDialogState(true);
    }
  },

  beforeUnmount () {
    const dialogEl = this.$refs.dialogEl;
    if (dialogEl?.open) {
      dialogEl.close();
      enableRootScrolling(this.getScrollRoot());
    }
    // Unconditional: leaking inert onto the page would leave the app unusable.
    this.releaseBackgroundInert();
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
          // show() leaves the dialog in the normal stacking order instead of the
          // top layer, where the z-index scale still applies.
          if (this.modal) dialogEl.showModal(); else dialogEl.show();
        }
        if (!this.modal) {
          // The browser only makes the page inert for top-layer dialogs, so that is
          // reproduced here. Re-applied on every show rather than only on open:
          // reopening before the leave transition finishes leaves the dialog open,
          // skipping the branch above, while inertness has already been released.
          this.applyBackgroundInert();
        }
        disableRootScrolling(this.getScrollRoot());
      } else if (dialogEl.open) {
        // Leave transition plays via v-show on inner content.
        // close() is called in onAfterLeave when transition completes.
        this.releaseBackgroundInert();
        enableRootScrolling(this.getScrollRoot());
      }
    },

    /**
     * Marks everything outside the dialog inert while it is open, mirroring what the
     * browser does for a modal dialog in the top layer.
     */
    applyBackgroundInert () {
      const dialogEl = returnFirstEl(this.$refs.dialogEl);
      if (!dialogEl) return;

      // Becomes the topmost dialog, so inertness is recomputed around it. This also
      // clears any inert an earlier dialog had applied to this one before it opened.
      pushOpenDialog(dialogEl);
    },

    /** Gives up this dialog's claim on the elements it inerted. */
    releaseBackgroundInert () {
      const dialogEl = returnFirstEl(this.$refs.dialogEl);
      if (dialogEl) removeOpenDialog(dialogEl);
    },

    close () {
      this.$emit('update:open', false);
    },

    onBackdropClick (event) {
      if (this.closeOnClick && event.target === event.currentTarget) {
        this.close();
      }
      this.$emit('click', event);
    },

    onKeydown (event) {
      // The native cancel event only fires for dialogs opened with showModal(), so
      // Esc has to be handled explicitly to keep dismissal identical in both modes.
      // defaultPrevented means a nested widget (dropdown, combobox) already consumed
      // it to close itself, and the modal must not close out from under it.
      if (!this.modal && event.key === 'Escape' && !event.defaultPrevented) {
        event.preventDefault();
        this.close();
      }
      this.$emit('keydown', event);
    },

    async onAfterEnter () {
      this.$emit('update:open', true);
      await this.setFocusAfterTransition();
    },

    onAfterLeave () {
      const dialogEl = this.$refs.dialogEl;
      if (dialogEl?.open) {
        dialogEl.close();
      }
      this.releaseBackgroundInert();
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
