<template>
  <div>
    <dt-lazy-show
      :show="modal && isOpen"
      transition="d-zoom"
      class="d-modal--transparent"
      :aria-hidden="modal && isOpen ? 'false' : 'true'"
    />
    <component
      :is="elementType"
      ref="popover"
      :class="['d-popover', { 'd-popover__anchor--modal-opened': modal && isOpen }]"
      data-qa="dt-popover-container"
      v-on="$listeners"
    >
      <div
        :id="!ariaLabelledby && labelledBy"
        ref="anchor"
        data-qa="dt-popover-anchor"
        @mouseup.capture="defaultToggleOpen"
        @keydown.enter.capture="defaultToggleOpen"
        @keydown.escape.capture="closePopover"
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
        :class="['d-popover__dialog', { 'd-popover__dialog--modal': modal }, dialogClass]"
        :style="{
          'max-height': maxHeight,
          'max-width': maxWidth,
        }"
        tabindex="-1"
        appear
        v-on="$listeners"
        @keydown.capture="onKeydown"
        @after-leave="onLeaveTransitionComplete"
        @after-enter="onEnterTransitionComplete"
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
          <!-- @slot content that is displayed in the popover when it is open. -->
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
            <slot
              name="footerContent"
              :close="closePopover"
            />
          </template>
        </popover-header-footer>
      </dt-lazy-show>
    </component>
  </div>
</template>

<script>
/* eslint-disable max-lines */
import {
  POPOVER_CONTENT_WIDTHS,
  POPOVER_PADDING_CLASSES,
  POPOVER_HEADER_FOOTER_PADDING_CLASSES,
  POPOVER_ROLES,
} from './popover_constants';
import { getUniqueString } from '@/common/utils';
import DtLazyShow from '../lazy_show/lazy_show';
import ModalMixin from '@/common/mixins/modal.js';
import {
  createTippy,
  getPopperOptions,
} from './tippy_utils';

import PopoverHeaderFooter from './popover_header_footer';

export default {
  name: 'DtPopover',

  /********************
   * CHILD COMPONENTS *
   ********************/
  components: {
    DtLazyShow,
    PopoverHeaderFooter,
  },

  mixins: [ModalMixin],

  props: {
    /**
     * Controls whether the popover is shown. Leaving this null will have the popover trigger on click by default.
     * If you set this value, the default trigger behavior will be disabled and you can control it as you need.
     * Supports .sync modifier
     */
    open: {
      type: Boolean,
      default: null,
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
     * @see https://www.w3.org/TR/wai-aria/#aria-haspopup
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
     */
    contentWidth: {
      type: String,
      default: null,
      validator: contentWidth => POPOVER_CONTENT_WIDTHS.includes(contentWidth),
    },

    /**
     * The id of the tooltip
     */
    id: {
      type: String,
      default () { return getUniqueString(); },
    },

    /**
     *  Displaces the content box from its reference element
     *  by the specified number of pixels.
     */
    offset: {
      type: Array,
      default: () => [0, 4],
    },

    /**
     * Determines if the popover hides upon clicking the
     * reference or outside of the content box.
     */
    hideOnClick: {
      type: Boolean,
      default: true,
    },

    /**
     * Determines if the first element within the popover will
     * be focused when the anchor is triggered, and the anchor
     * will be focused when the popover is closed. Note even
     * if enabled this will only happen when activated by
     * keyboard.
     */
    autoFocus: {
      type: Boolean,
      default: true,
    },

    /**
     * Determines modal state. If enabled popover has a modal overlay
     * preventing interaction with elements below it, but it is invisible.
     */
    modal: {
      type: Boolean,
      default: true,
    },

    /**
     * If the popover does not fit in the direction described by "placement",
     * it will attempt to change it's direction to the "fallbackPlacements".
     * */
    fallbackPlacements: {
      type: Array,
      default: () => {
        return ['auto'];
      },
    },

    /**
     * The direction the popover displays relative to the anchor.
     */
    placement: {
      type: String,
      default: 'bottom-end',
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
  },

  emits: ['update:open', 'opened'],

  data () {
    return {
      POPOVER_PADDING_CLASSES,
      POPOVER_HEADER_FOOTER_PADDING_CLASSES,
      isOpen: false,
      triggeredByMouse: false,
      anchorEl: null,
      popoverContentEl: null,
    };
  },

  computed: {
    labelledBy () {
      // aria-labelledby should be set only if aria-labelledby is passed as a prop, or if
      // there is no aria-label and the labelledby should point to the anchor.
      return this.ariaLabelledby || (!this.ariaLabel && getUniqueString('DtPopover__anchor'));
    },
  },

  watch: {
    modal (modal) {
      this.tip.setProps({
        zIndex: modal ? 650 : 300,
      });
    },

    offset (offset) {
      this.tip.setProps({
        offset: offset,
      });
    },

    fallbackPlacements (fallbackPlacements) {
      this.tip.setProps({
        popperOptions: getPopperOptions({
          fallbackPlacements: fallbackPlacements,
          hasHideModifierEnabled: true,
        }),
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
    this.anchorEl = this.$refs.anchor.children[0];
    this.popoverContentEl = this.$refs.content.$el;

    // align popover content width when
    if (this.contentWidth === 'anchor') {
      window.addEventListener('resize', this.onResize);
    }
    this.tip = createTippy(this.anchorEl, {
      popperOptions: getPopperOptions({
        fallbackPlacements: this.fallbackPlacements,
        hasHideModifierEnabled: true,
      }),
      contentElement: this.popoverContentEl,
      placement: this.placement,
      offset: this.offset,
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

  beforeDestroy () {
    window.removeEventListener('resize', this.onResize);
    this.tip?.destroy();
    this.removeReferences();
    this.removeClosePopoverEventListener();
  },

  /******************
   *     METHODS    *
   ******************/
  methods: {
    calculateAnchorZindex () {
      // if a modal is currently active render at modal-element z-index, otherwise at popover z-index
      if (document.querySelector('.d-modal[aria-hidden="false"], .d-modal--transparent[aria-hidden="false"]')) {
        return 650;
      } else {
        return 300;
      }
    },

    defaultToggleOpen (e) {
      if (e.type === 'mouseup') {
        this.triggeredByMouse = true;
      }
      // Only use default toggle behaviour if the user has not set the open prop.
      // Check that the anchor element specifically was clicked.
      this.open ?? (this.anchorEl.contains(e.target) && this.toggleOpen());
    },

    toggleOpen () {
      this.isOpen = !this.isOpen;
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

    onLeaveTransitionComplete () {
      this.focusFirstElementIfNeeded(this.$refs.anchor);
      this.tip?.unmount();
      this.$emit('opened', false);
      if (this.open !== null) {
        this.$emit('update:open', false);
      }
    },

    async onEnterTransitionComplete () {
      this.$emit('opened', true, this.$refs.popover__content);
      if (this.open !== null) {
        this.$emit('update:open', true);
      }
      this.focusFirstElementIfNeeded(this.$refs.popover__content);
    },

    onResize () {
      this.closePopover();
    },

    onClickOutside () {
      if (!this.hideOnClick) return;
      // If a modal popover is opened inside of this one, do not hide on click out
      const innerModals = this.popoverContentEl.querySelector('.d-modal--transparent[aria-hidden="false"]');
      if (!innerModals) {
        this.triggeredByMouse = true;
        this.closePopover();
      }
    },

    onKeydown (e) {
      if (e.key === 'Tab') {
        this.focusTrappedTabPress(e, this.popoverContentEl);
      }
      if (e.key === 'Escape') {
        this.closePopover();
      }
    },

    async setPopoverContentAnchorWidth () {
      await this.$nextTick();
      this.popoverContentEl.style.width = `${this.anchorEl.clientWidth}px`;
    },

    focusFirstElementIfNeeded (domEl) {
      if (this.triggeredByMouse || !this.autoFocus) {
        this.triggeredByMouse = false;
        return;
      }
      const focusableElements = this._getFocusableElements(domEl, true);
      if (focusableElements.length !== 0) {
        this.focusFirstElement(domEl);
      } else if (this.showCloseButton) {
        this.$refs.popover__header?.focusCloseButton();
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
