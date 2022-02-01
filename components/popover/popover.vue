<template>
  <component
    :is="elementType"
    ref="popover"
    data-qa="dt-popover-container"
    v-on="$listeners"
  >
    <dt-lazy-show
      v-if="modal"
      ref="overlay"
      :show="modal && isOpeningPopover"
      transition="d-zoom"
      class="
        d-ps-fixed
        d-all0
        d-zi-modal
        d-fl-center
        d-fd-column
        d-popover-overlay
        d-vi-visible
        d-o100
        d-bgc-black-900
      "
      @click.self="closePopoverOnClick"
    />
    <div
      :id="!ariaLabelledby && labelledBy"
      ref="anchor"
      data-qa="dt-popover-anchor"
    >
      <!-- @slot Anchor element that activates the popover. Usually a button. -->
      <slot
        name="anchor"
        :attrs="{
          'aria-expanded': showPopover.toString(),
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
      :aria-hidden="`${!showPopover}`"
      :aria-labelledby="labelledBy"
      :aria-label="ariaLabel"
      :aria-modal="modal"
      :transition="transition"
      :show="showPopover"
      :class="[
        'd-bgc-white',
        'd-bs-card',
        'd-bar8',
        'd-bc-black-100',
        'dt-popover-box',
        {
          'd-d-grid d-of-hidden dt-popover-box__grid': fixedHeaderFooter,
          'd-of-auto': Boolean(maxHeight),
          'd-wmx-unset': !Boolean(maxWidth),
        },
      ]"
      :style="{
        'max-height': maxHeight,
        'max-width': maxWidth,
      }"
      tabindex="-1"
      appear
      v-on="$listeners"
      @keydown="onKeydown"
      @after-leave="onLeave"
      @enter="isOpeningPopover = true"
      @leave="isOpeningPopover = false"
      @after-enter="onOpen"
    >
      <popover-header-footer
        v-if="$slots.headerContent || showCloseButton"
        ref="popover__header"
        :content-class="headerClass"
        type="header"
        :show-close-button="showCloseButton"
        :close-button-props="closeButtonProps"
        :has-box-shadow="hasBoxShadow"
        @close="closePopover"
      >
        <template #content>
          <!-- @slot Slot for popover header content -->
          <slot name="headerContent" />
        </template>
      </popover-header-footer>
      <div
        ref="popover__content"
        data-qa="dt-popover-content"
        :class="[
          'dt-popover__content',
          POPOVER_PADDING_CLASSES[padding],
          {
            'd-of-auto': fixedHeaderFooter,
          },
          contentClass,
        ]"
        @scroll="onScrollContent"
      >
        <!-- @slot content that is displayed in the popover when it is open. -->
        <slot name="content" />
      </div>
      <popover-header-footer
        v-if="$slots.footerContent"
        type="footer"
        :content-class="footerClass"
        :has-box-shadow="hasBoxShadow"
      >
        <template #content>
          <slot name="footerContent" />
        </template>
      </popover-header-footer>
    </dt-lazy-show>
  </component>
</template>

<script>
import {
  POPOVER_CONTENT_WIDTHS,
  POPOVER_PADDING_CLASSES,
  POPOVER_ROLES,
} from './popover_constants';
import { getUniqueString } from '../utils';
import DtLazyShow from '../lazy_show/lazy_show';
import { TOOLTIP_HIDE_ON_CLICK_VARIANTS } from '../tooltip';
import ModalMixin from '../mixins/modal.js';
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
     * Whether or not the popover content is shown. Supports .sync modifier.
     */
    open: {
      type: Boolean,
      required: true,
    },

    /**
     * Padding size class for the popover content.
     */
    padding: {
      type: String,
      default: 'large',
      validator: (padding) => {
        return !!POPOVER_PADDING_CLASSES[padding];
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
     * the popover content will be set the same width with anchor element onShow popover event
     */
    contentWidth: {
      type: String,
      default: null,
      validator: contentWidth => POPOVER_CONTENT_WIDTHS.includes(contentWidth),
    },

    /**
     * Determines whether the anchor should be focused after closing the popover.
     */
    focusAnchorOnClose: {
      type: Boolean,
      default: true,
    },

    /**
     * The id of the tooltip
     */
    id: {
      type: String,
      default () { return getUniqueString(); },
    },

    /**
     *  Displaces the tippy from its reference element
     *  in pixels (skidding and distance).
     */
    offset: {
      type: [Number, Array],
      default: () => [0, 4],
    },

    /**
     * The element to append the tippy to.
     */
    appendTo: {
      type: [String, HTMLElement],
      default: () => document.body,
    },

    /**
     * Determines if the tippy has interactive content inside of it,
     * so that it can be hovered over and clicked inside without hiding.
     */
    interactive: {
      type: Boolean,
      default: true,
    },

    /**
     * This describes the area that the element
     * will be checked for overflow relative to.
     */
    flipBoundary: {
      type: [String, HTMLElement, Array],
      default: 'clippingParents',
      validator (boundary) {
        if (typeof boundary === 'string') {
          return boundary === 'clippingParents';
        }

        if (Array.isArray(boundary)) {
          return boundary.every(el => el instanceof HTMLElement);
        }

        return boundary instanceof HTMLElement;
      },
    },

    /**
     * Determines the size of the invisible border around the
     * tippy that will prevent it from hiding if the cursor left it.
     */
    interactiveBorder: {
      type: Number,
      default: 2,
    },

    /**
     * Determines the events that cause the tippy to show.
     * Multiple event names are separated by spaces.
     */
    trigger: {
      type: String,
      default: 'manual',
    },

    /***
     * Determines if the tippy hides upon clicking the
     * reference or outside of the tippy.
     * The behavior can depend upon the trigger events used.
     */
    hideOnClick: {
      type: [Boolean, String],
      default: true,
      validator (value) {
        return TOOLTIP_HIDE_ON_CLICK_VARIANTS.some(variant => variant === value);
      },
    },

    /**
     * Determines modal state, when the popover's overlay is rendered
     */
    modal: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines the popover's z-index
     */
    zIndex: {
      type: [Number, String],
      default: 300,
      validator: zIndex => !!Number(zIndex),
    },

    /**
     * Determines html element container for popover's overlay,
     * which will be rendered when 'modal' property is 'true'.
     */
    overlayAppendTo: {
      type: HTMLElement,
      default: () => document.body,
    },

    /**
     * This property is needed for define fallback placements
     * by providing a list of placements to try.
     * */
    fallbackPlacements: {
      type: Array,
      default: () => ['left-end', 'top-end'],
    },

    /**
     * Describes the preferred placement of the popover
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
     * Determines fixed / sticky styles for popover header
     */
    fixedHeaderFooter: {
      type: Boolean,
      default: true,
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
  },

  emits: ['update:open'],

  data () {
    return {
      POPOVER_PADDING_CLASSES,
      isOpeningPopover: false,
      showPopover: this.open,
      isPreventHidePopover: false,
      closedByClickOutside: false,
      focusCloseButton: false,
      anchorEl: null,
      popoverContentEl: null,
      hasScrolled: false,
    };
  },

  computed: {
    hasBoxShadow () {
      return this.hasScrolled && this.fixedHeaderFooter;
    },

    isDialog () {
      return this.role === 'dialog';
    },

    isMenu () {
      return this.role === 'menu';
    },

    labelledBy () {
      // aria-labelledby should be set only if aria-labelledby is passed as a prop, or if
      // there is no aria-label and the labelledby should point to the anchor.
      return this.ariaLabelledby || (!this.ariaLabel && getUniqueString('DtPopover__anchor'));
    },
  },

  watch: {
    placement (placement) {
      this.tip?.setProps({
        placement,
      });
    },

    open (isOpen, isPrev) {
      if (isOpen) {
        this.tip.show();
        this.addClosePopoverEventLister();
      } else if (!isOpen && isPrev !== isOpen) {
        this.showPopover = false;
        this.removeClosePopoverEventLister();
      }
    },

    hideOnClick () {
      this.tip?.setProps({
        hideOnClick: this.hideOnClick,
      });
    },
  },

  mounted () {
    // support single anchor for popover, not multi anchor
    this.anchorEl = this.$refs.anchor.children[0];
    this.popoverContentEl = this.$refs.content.$el;
    let zIndex = this.zIndex;
    // align z-indexes when popover has modal prop
    if (this.modal) {
      this.anchorEl.classList.add('d-zi-notification');
      zIndex = zIndex > 600 ? zIndex : 700;
      this.appendOverlay();
    }

    // align popover content width when
    if (this.contentWidth === 'anchor') {
      window.addEventListener('resize', this.onResize);
    }
    this.tip = createTippy(this.anchorEl, {
      popperOptions: getPopperOptions({
        boundary: this.flipBoundary,
        flip: this.fallbackPlacements,
        hasHideModifierEnabled: this.appendTo !== 'parent',
      }),
      contentElement: this.popoverContentEl,
      placement: this.placement,
      hideOnClick: this.hideOnClick,
      offset: this.offset,
      interactiveBorder: this.interactiveBorder,
      appendTo: this.appendTo,
      interactive: this.interactive,
      trigger: this.trigger,
      zIndex,
      onHide: this.onHide,
      onMount: this.onMount,
      onClickOutside: this.onClickOutside,
      onShow: this.onShow,
    });
    if (this.showPopover) {
      this.tip.show();
      this.addClosePopoverEventLister();
    }
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.onResize);
    this.removeOverlay();
    this.tip?.destroy();
    this.removeReferences();
    this.removeClosePopoverEventLister();
  },

  /******************
   *     METHODS    *
   ******************/
  methods: {
    addClosePopoverEventLister () {
      window.addEventListener('dt-popover-close', this.closePopover);
    },

    removeClosePopoverEventLister () {
      window.removeEventListener('dt-popover-close', this.closePopover);
    },

    onScrollContent ({ target }) {
      this.hasScrolled = target.scrollTop > 0;
    },

    removeReferences () {
      this.anchorEl = null;
      this.popoverContentEl = null;
      this.tip = null;
    },

    appendOverlay () {
      const overlay = this.$refs.overlay.$el;
      const { lastChild } = this.overlayAppendTo;
      if (lastChild) {
        this.overlayAppendTo.insertBefore(overlay, lastChild);
      } else {
        this.overlayAppendTo.append(overlay);
      }
    },

    removeOverlay () {
      if (this.$refs.overlay && this.$refs.overlay.$el) {
        this.$refs.popover.append(this.$refs.overlay.$el);
      }
    },

    closePopover () {
      this.tip.hide();
    },

    closePopoverOnClick () {
      if (typeof this.hideOnClick === 'boolean' && this.hideOnClick) {
        this.closePopover();
      }
    },

    async onShow () {
      if (this.contentWidth === 'anchor') {
        await this.setPopoverContentAnchorWidth();
      }

      if (this.contentWidth === null) {
        this.popoverContentEl.style.width = 'auto';
      }
    },

    onLeave () {
      this.isPreventHidePopover = true;
      if (this.focusAnchorOnClose && !this.closedByClickOutside) {
        this.focusFirstElementIfNeeded(this.$refs.anchor);
      }
      this.closedByClickOutside = false;
      this.tip?.unmount();
      this.$emit('update:open', false);
    },

    onOpen () {
      this.$emit('update:open', true, this.$refs.popover__content);
      this.focusFirstElementIfNeeded(this.$refs.popover__content);
    },

    onHide () {
      this.showPopover = false;
      /**
       *  https://atomiks.github.io/tippyjs/v6/all-props/#onhide
       *  return false from 'onHide' lifecycle to cancel a hide based on a condition.
      **/
      return this.isPreventHidePopover;
    },

    onMount () {
      this.isPreventHidePopover = false;
      this.showPopover = true;
      this.tip?.setProps({
        placement: this.placement,
      });
    },

    onResize () {
      this.closePopover();
    },

    onClickOutside () {
      this.closedByClickOutside = true;
    },

    onKeydown (e) {
      if (e.key === 'Tab') {
        this.focusTrappedTabPress(e, this.popoverContentEl);
      }
    },

    async setPopoverContentAnchorWidth () {
      await this.$nextTick();
      this.popoverContentEl.style.width = `${this.anchorEl.clientWidth}px`;
    },

    focusFirstElementIfNeeded (domEl) {
      if (this.isDialog) {
        const focusableElements = this._getFocusableElements(domEl);
        if (focusableElements.length !== 0) {
          this.focusFirstElement(domEl);
        } else if (this.showCloseButton) {
          this.$refs.popover__header?.focusCloseButton();
        }
      }
    },
  },
};
</script>

<style lang="less">
@import "../../css/dialtone.less";

.tippy-box[data-popper-reference-hidden],
.tippy-box[data-popper-escaped] {
  .dt-popover-box {
    visibility: hidden;
    pointer-events: none;
  }
}

.d-popover-overlay {
  --bgo: 85% !important;
}

.dt-popover-box {
  &,
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  &__grid {
    grid-template-rows: auto 1fr;
  }
}
</style>
