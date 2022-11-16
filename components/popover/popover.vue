<template>
  <div>
    <Teleport
      v-if="modal && isOpen"
      to="body"
    >
      <div
        class="d-modal--transparent"
        :aria-hidden="modal && isOpen ? 'false' : 'true'"
        @click.prevent.stop
      />
    </Teleport>
    <component
      :is="elementType"
      ref="popover"
      :class="['d-popover', { 'd-popover__anchor--opened': isOpen }]"
      data-qa="dt-popover-container"
    >
      <div
        :id="!ariaLabelledby && labelledBy"
        ref="anchor"
        data-qa="dt-popover-anchor"
        :tabindex="openOnContext ? 0 : undefined"
        @click.capture="defaultToggleOpen"
        @contextmenu="onContext"
        @keydown.up.prevent="onArrowKeyPress"
        @keydown.down.prevent="onArrowKeyPress"
        @wheel="(e) => (isOpen && modal) && e.preventDefault()"
        @keydown.escape.capture="closePopover"
        @keydown.enter="$emit('keydown', $event)"
        @keydown.space="$emit('keydown', $event)"
      >
        <!-- @slot Anchor element that activates the popover. Usually a button. -->
        <slot
          name="anchor"
          :attrs="{
            'aria-expanded': isOpen.toString(),
            'aria-controls': id,
            'aria-haspopup': role,
          }"
        />
      </div>
      <dt-lazy-show
        :id="id"
        ref="content"
        :role="role"
        data-qa="dt-popover"
        :aria-hidden="`${!isOpen}`"
        :aria-labelledby="labelledBy"
        :aria-label="ariaLabel"
        :aria-modal="`${!modal}`"
        :transition="transition"
        :show="isOpen"
        :appear="contentAppear"
        :class="['d-popover__dialog', { 'd-popover__dialog--modal': modal }, dialogClass]"
        :style="{
          'max-height': maxHeight,
          'max-width': maxWidth,
        }"
        :css="$attrs.css"
        :tabindex="contentTabindex"
        v-on="popoverListeners"
      >
        <popover-header-footer
          v-if="$slots.headerContent || showCloseButton"
          ref="popover__header"
          :class="POPOVER_HEADER_FOOTER_PADDING_CLASSES[padding]"
          :content-class="headerClass"
          type="header"
          :show-close-button="showCloseButton"
          :close-button-props="closeButtonProps"
          @close="closePopover"
        >
          <template #content>
            <!-- @slot Slot for popover header content -->
            <slot
              name="headerContent"
              :close="closePopover"
            />
          </template>
        </popover-header-footer>
        <div
          ref="popover__content"
          data-qa="dt-popover-content"
          :class="[
            'd-popover__content',
            POPOVER_PADDING_CLASSES[padding],
            contentClass,
          ]"
        >
          <!-- @slot Slot for the content that is displayed in the popover when it is open. -->
          <slot
            name="content"
            :close="closePopover"
          />
        </div>
        <popover-header-footer
          v-if="$slots.footerContent"
          ref="popover__footer"
          type="footer"
          :class="POPOVER_HEADER_FOOTER_PADDING_CLASSES[padding]"
          :content-class="footerClass"
        >
          <template #content>
            <!-- @slot Slot for the footer content. -->
            <slot
              name="footerContent"
              :close="closePopover"
            />
          </template>
        </popover-header-footer>
        <sr-only-close-button
          v-if="showVisuallyHiddenClose"
          :visually-hidden-close-label="visuallyHiddenCloseLabel"
          @close="closePopover"
        />
      </dt-lazy-show>
    </component>
  </div>
</template>

<script>
/* eslint-disable max-lines */
import {
  POPOVER_CONTENT_WIDTHS,
  POPOVER_HEADER_FOOTER_PADDING_CLASSES,
  POPOVER_INITIAL_FOCUS_STRINGS,
  POPOVER_PADDING_CLASSES,
  POPOVER_ROLES,
  POPOVER_STICKY_VALUES,
} from './popover_constants';
import { getUniqueString } from '@/common/utils';
import DtLazyShow from '../lazy_show/lazy_show';
import ModalMixin from '@/common/mixins/modal.js';
import { createTippy, getPopperOptions } from './tippy_utils';
import PopoverHeaderFooter from './popover_header_footer';
import SrOnlyCloseButtonMixin from '@/common/mixins/sr_only_close_button';
import SrOnlyCloseButton from '@/common/sr_only_close_button';

/**
 * A Popover displays a content overlay when its anchor element is activated.
 * @see https://dialpad.design/components/popover.html
 */
export default {
  name: 'DtPopover',

  /********************
   * CHILD COMPONENTS *
   ********************/
  components: {
    SrOnlyCloseButton,
    DtLazyShow,
    PopoverHeaderFooter,
  },

  mixins: [ModalMixin, SrOnlyCloseButtonMixin],

  props: {
    /**
     * Controls whether the popover is shown. Leaving this null will have the popover trigger on click by default.
     * If you set this value, the default trigger behavior will be disabled, and you can control it as you need.
     * Supports v-model
     * @values null, true, false
     */
    open: {
      type: Boolean,
      default: null,
    },

    /**
     * Opens the popover on right click (context menu). If you set this value to `true`,
     * the default trigger behavior will be disabled.
     * @values true, false
     */
    openOnContext: {
      type: Boolean,
      default: false,
    },

    /**
     * Element type (tag name) of the root element of the component.
     */
    elementType: {
      type: String,
      default: 'div',
    },

    /**
     * Named transition when the content display is toggled.
     * @see DtLazyShow
     */
    transition: {
      type: String,
      default: 'fade',
    },

    /**
     * ARIA role for the content of the popover. Defaults to "dialog".
     * <a href="https://www.w3.org/TR/wai-aria/#aria-haspopup" target="_blank">aria-haspopup</a>
     */
    role: {
      type: String,
      default: 'dialog',
      validator: (role) => {
        return POPOVER_ROLES.includes(role);
      },
    },

    /**
     * ID of the element that serves as the label for the popover content.
     * Defaults to the "anchor" element; this exists to provide a different
     * ID of the label element if, for example, the anchor slot contains
     * other items that do not serve as a label. You should provide this
     * or ariaLabel, but not both.
     */
    ariaLabelledby: {
      type: String,
      default: null,
    },

    /**
     * Descriptive label for the popover content. You should provide this
     * or ariaLabelledby, but not both.
     */
    ariaLabel: {
      type: String,
      default: null,
    },

    /**
     * A set of props to be passed into the popover's header close button.
     * Requires an 'ariaLabel' property, when the header popover is visible
     */
    closeButtonProps: {
      type: Object,
      default: () => ({}),
    },

    /**
     * Padding size class for the popover content.
     * @values none, small, medium, large
     */
    padding: {
      type: String,
      default: 'large',
      validator: (padding) => {
        return Object.keys(POPOVER_PADDING_CLASSES).some((item) => item === padding);
      },
    },

    /**
     * Additional class name for the content wrapper element.
     */
    contentClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Width configuration for the popover content. When its value is 'anchor',
     * the popover content will have the same width as the anchor.
     * @values null, anchor
     */
    contentWidth: {
      type: String,
      default: null,
      validator: contentWidth => POPOVER_CONTENT_WIDTHS.includes(contentWidth),
    },

    /**
     * Whether to apply transition on initial render in the content lazy show component.
     */
    contentAppear: {
      type: Boolean,
      default: false,
    },

    /**
     * Tabindex value for the content. Passing null, no tabindex attribute will be set.
     */
    contentTabindex: {
      type: Number || null,
      default: -1,
    },

    /**
     * External anchor id to use in those cases the anchor can't be provided via the slot.
     * For instance, using the combobox's input as the anchor for the popover.
     */
    externalAnchor: {
      type: String,
      default: '',
    },

    /**
     * The id of the tooltip
     */
    id: {
      type: String,
      default () { return getUniqueString(); },
    },

    /**
     *  Displaces the content box from its anchor element
     *  by the specified number of pixels. See
     *  <a href="https://atomiks.github.io/tippyjs/v6/all-props/#offset" target="_blank">Tippy.js docs</a>
     */
    offset: {
      type: Array,
      default: () => [0, 4],
    },

    /**
     * Determines if the popover hides upon clicking the
     * anchor or outside of the content box.
     * @values true, false
     */
    hideOnClick: {
      type: Boolean,
      default: true,
    },

    /**
     * Determines modal state. If enabled popover has a modal overlay
     * preventing interaction with elements below it, but it is invisible.
     * @values true, false
     */
    modal: {
      type: Boolean,
      default: true,
    },

    /**
     * If the popover does not fit in the direction described by "placement",
     * it will attempt to change it's direction to the "fallbackPlacements".
     * See <a href="https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements" target="_blank">Popper.js docs</a>
     * */
    fallbackPlacements: {
      type: Array,
      default: () => {
        return ['auto'];
      },
    },

    /**
     * The direction the popover displays relative to the anchor.
     * See <a href="https://atomiks.github.io/tippyjs/v6/all-props/#placement" target="_blank">Tippy.js docs</a>
     * @values top, top-start, top-end,
     * right, right-start, right-end,
     * left, left-start, left-end,
     * bottom, bottom-start, bottom-end,
     * auto, auto-start, auto-end
     */
    placement: {
      type: String,
      default: 'bottom-end',
    },

    /**
     * If set to false the dialog will display over top of the anchor when there is insufficient space.
     * If set to true it will never move from its position relative to the anchor and will clip instead.
     * See <a href="https://popper.js.org/docs/v2/modifiers/prevent-overflow/#tether" target="_blank">Popper.js docs</a>
     * @values true, false
     */
    tether: {
      type: Boolean,
      default: true,
    },

    /**
     * If the popover sticks to the anchor. This is usually not needed, but can be needed
     * if the reference element's position is animating, or to automatically update the popover
     * position in those cases the DOM layout changes the reference element's position.
     * `true` enables it, `reference` only checks the "reference" rect for changes and `popper` only
     * checks the "popper" rect for changes.
     * See <a href="https://atomiks.github.io/tippyjs/v6/all-props/#sticky" target="_blank">Tippy.js docs</a>
     * @values true, false, reference, popper
     */
    sticky: {
      type: [Boolean, String],
      default: false,
      validator: (sticky) => {
        return POPOVER_STICKY_VALUES.includes(sticky);
      },
    },

    /**
     * Determines maximum height for the popover before overflow.
     * Possible units rem|px|em
     */
    maxHeight: {
      type: String,
      default: '',
    },

    /**
     * Determines maximum width for the popover before overflow.
     * Possible units rem|px|%|em
     */
    maxWidth: {
      type: String,
      default: '',
    },

    /**
     * Determines visibility for close button
     * @values true, false
     */
    showCloseButton: {
      type: Boolean,
      default: false,
    },

    /**
     * Additional class name for the header content wrapper element.
     */
    headerClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional class name for the footer content wrapper element.
     */
    footerClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional class name for the dialog element.
     */
    dialogClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * The element that is focused when the popover is opened. This can be an
     * HTMLElement within the popover, a string starting with '#' which will
     * find the element by ID. 'first' which will automatically focus
     * the first element, or 'dialog' which will focus the dialog window itself.
     * If the dialog is modal this prop cannot be 'none'.
     * @values none, dialog, first
     */
    initialFocusElement: {
      type: [String, HTMLElement],
      default: 'first',
      validator: initialFocusElement => {
        return POPOVER_INITIAL_FOCUS_STRINGS.includes(initialFocusElement) ||
          (initialFocusElement instanceof HTMLElement) ||
          initialFocusElement.startsWith('#');
      },
    },

    /**
     * If the popover should open pressing up or down arrow key on the anchor element.
     * This can be set when not passing open prop.
     * @values true, false
     */
    openWithArrowKeys: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
    /**
     * Native keydown event
     *
     * @event keydown
     * @type {KeyboardEvent}
     */
    'keydown',

    /**
     * Event fired to sync the open prop with the parent component
     * @event update:open
     */
    'update:open',

    /**
     * Emitted when popover is shown or hidden
     *
     * @event opened
     * @type {Boolean | Array}
     */
    'opened',
  ],

  data () {
    return {
      POPOVER_PADDING_CLASSES,
      POPOVER_HEADER_FOOTER_PADDING_CLASSES,
      isOpen: false,
      anchorEl: null,
      popoverContentEl: null,
    };
  },

  computed: {
    popoverListeners () {
      return {
        keydown: event => {
          this.onKeydown(event);
        },

        'after-leave': event => {
          this.onLeaveTransitionComplete();
        },

        'after-enter': event => {
          this.onEnterTransitionComplete();
        },
      };
    },

    labelledBy () {
      // aria-labelledby should be set only if aria-labelledby is passed as a prop, or if
      // there is no aria-label and the labelledby should point to the anchor.
      return this.ariaLabelledby || (!this.ariaLabel && getUniqueString('DtPopover__anchor'));
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

    modal (modal) {
      this.tip.setProps({
        zIndex: this.modal ? 650 : this.calculateAnchorZindex(),
      });
    },

    offset (offset) {
      this.tip.setProps({
        offset,
      });
    },

    sticky (sticky) {
      this.tip.setProps({
        sticky,
      });
    },

    fallbackPlacements () {
      this.tip.setProps({
        popperOptions: this.popperOptions(),
      });
    },

    tether () {
      this.tip.setProps({
        popperOptions: this.popperOptions(),
      });
    },

    placement (placement) {
      this.tip?.setProps({
        placement,
      });
    },

    open: {
      handler: function (open) {
        if (open !== null) {
          this.isOpen = open;
        }
      },

      immediate: true,
    },

    isOpen (isOpen, isPrev) {
      if (isOpen) {
        this.tip.setProps({
          zIndex: this.modal ? 650 : this.calculateAnchorZindex(),
        });
        this.tip.show();
        this.addClosePopoverEventListener();
      } else if (!isOpen && isPrev !== isOpen) {
        this.removeClosePopoverEventListener();
        this.tip.hide();
      }
    },
  },

  mounted () {
    // support single anchor for popover, not multi anchor
    const externalAnchorEl = document.getElementById(this.externalAnchor);
    this.anchorEl = externalAnchorEl ?? this.$refs.anchor.children[0];
    this.popoverContentEl = this.$refs.content.$el;

    // align popover content width when
    if (this.contentWidth === 'anchor') {
      window.addEventListener('resize', this.onResize);
    }
    this.tip = createTippy(this.anchorEl, {
      popperOptions: this.popperOptions(),
      contentElement: this.popoverContentEl,
      placement: this.placement,
      offset: this.offset,
      sticky: this.sticky,
      appendTo: document.body,
      interactive: true,
      trigger: 'manual',
      // We have to manage hideOnClick functionality manually to handle
      // popover within popover situations.
      hideOnClick: false,
      zIndex: this.modal ? 650 : this.calculateAnchorZindex(),
      onClickOutside: this.onClickOutside,
      onShow: this.onShow,
    });

    // immediate watcher fires before mounted, so have this here in case
    // show prop was initially set to true.
    if (this.isOpen) {
      this.tip.show();
    }
  },

  beforeUnmount () {
    window.removeEventListener('resize', this.onResize);
    this.tip?.destroy();
    this.removeReferences();
    this.removeClosePopoverEventListener();
  },

  /******************
   *     METHODS    *
   ******************/
  methods: {
    popperOptions () {
      return getPopperOptions({
        fallbackPlacements: this.fallbackPlacements,
        tether: this.tether,
        hasHideModifierEnabled: true,
      });
    },

    validateProps () {
      if (this.modal && this.initialFocusElement === 'none') {
        console.error('If the popover is modal you must set the ' +
        'initialFocusElement prop. Possible values: "dialog", "first", HTMLElement');
      }
    },

    calculateAnchorZindex () {
      // if a modal is currently active render at modal-element z-index, otherwise at popover z-index
      if (document.querySelector('.d-modal[aria-hidden="false"], .d-modal--transparent[aria-hidden="false"]')) {
        return 650;
      } else {
        return 300;
      }
    },

    defaultToggleOpen (e) {
      if (this.openOnContext) { return; }

      // Only use default toggle behaviour if the user has not set the open prop.
      // Check that the anchor element specifically was clicked.
      if (this.open === null || this.open === undefined) {
        if ((!this.anchorEl.contains(e.target) && !this.anchorEl.isEqualNode(e.target)) || this.anchorEl?.disabled) {
          return;
        }

        this.toggleOpen();
      }
    },

    onContext (event) {
      if (!this.openOnContext) { return; }

      event.preventDefault();

      this.tip?.setProps({
        placement: 'right-start',
      });

      this.tip.setProps({
        getReferenceClientRect: () => ({
          width: 0,
          height: 0,
          top: event.clientY,
          bottom: event.clientY,
          left: event.clientX,
          right: event.clientX,
        }),
      });

      this.toggleOpen();
    },

    toggleOpen () {
      this.isOpen = !this.isOpen;
    },

    onArrowKeyPress (e) {
      if (this.open !== null) { return; }
      if (this.openWithArrowKeys && this.anchorEl.contains(e.target)) {
        if (!this.isOpen) {
          this.isOpen = true;
        }
      }

      this.$emit('keydown', e);
    },

    addClosePopoverEventListener () {
      window.addEventListener('dt-popover-close', this.closePopover);
    },

    removeClosePopoverEventListener () {
      window.removeEventListener('dt-popover-close', this.closePopover);
    },

    closePopover () {
      this.isOpen = false;
    },

    removeReferences () {
      this.anchorEl = null;
      this.popoverContentEl = null;
      this.tip = null;
    },

    async onShow () {
      if (this.contentWidth === 'anchor') {
        await this.setPopoverContentAnchorWidth();
      }

      if (this.contentWidth === null) {
        this.popoverContentEl.style.width = 'auto';
      }
    },

    async onLeaveTransitionComplete () {
      if (this.modal) {
        this.focusFirstElement(this.$refs.anchor);
        // await next tick in case the user wants to change focus themselves.
        await this.$nextTick();
      }
      this.tip?.unmount();
      this.$emit('opened', false);
      if (this.open !== null) {
        this.$emit('update:open', false);
      }
    },

    async onEnterTransitionComplete () {
      this.focusInitialElement();
      // await next tick in case the user wants to change focus themselves.
      await this.$nextTick();
      this.$emit('opened', true, this.$refs.popover__content);
      if (this.open !== null) {
        this.$emit('update:open', true);
      }
    },

    focusInitialElement () {
      if (this.initialFocusElement === 'dialog') {
        this.$refs.content.$el.focus();
      }
      // find by ID
      if (this.initialFocusElement.startsWith('#')) {
        this.focusInitialElementById();
      }
      if (this.initialFocusElement === 'first') {
        this.focusFirstElementIfNeeded(this.$refs.popover__content);
      }
      if (this.initialFocusElement instanceof HTMLElement) {
        this.initialFocusElement.focus();
      }
    },

    focusInitialElementById () {
      const result = this.$refs.content.$el.querySelector(this.initialFocusElement);
      if (result) {
        result.focus();
      } else {
        console.warn('Could not find the element specified in dt-popover prop "initialFocusElement". ' +
          'Defaulting to focusing the dialog.');
      }
      result ? result.focus() : this.$refs.content.$el.focus();
    },

    onResize () {
      this.closePopover();
    },

    onClickOutside () {
      if (!this.hideOnClick) return;
      // If a popover is opened inside of this one, do not hide on click out
      const innerModals = this.popoverContentEl.querySelector('.d-popover__anchor--opened');
      if (!innerModals) {
        this.closePopover();
      }
    },

    onKeydown (e) {
      if (e.key === 'Tab') {
        if (this.modal) {
          this.focusTrappedTabPress(e, this.popoverContentEl);
        }
      }
      if (e.key === 'Escape') {
        this.closePopover();
      }

      this.$emit('keydown', e);
    },

    async setPopoverContentAnchorWidth () {
      await this.$nextTick();
      this.popoverContentEl.style.width = `${this.anchorEl.clientWidth}px`;
    },

    focusFirstElementIfNeeded (domEl) {
      const focusableElements = this._getFocusableElements(domEl, true);
      if (focusableElements.length !== 0) {
        this.focusFirstElement(domEl);
      } else if (this.showCloseButton) {
        this.$refs.popover__header?.focusCloseButton();
      } else {
        // if there are no focusable elements at all focus the dialog itself
        this.$refs.content.$el.focus();
      }
    },
  },
};
</script>

<style lang="less">
.tippy-box[data-popper-reference-hidden],
.tippy-box[data-popper-escaped] {
  .d-popover__dialog {
    visibility: hidden;
    pointer-events: none;
  }
}
</style>
