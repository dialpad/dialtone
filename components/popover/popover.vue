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
      <!-- @slot Anchor element that activates the popover. -->
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
        `dt-popover__content--align-${horizontalAlignment}`,
        `dt-popover__content--valign-${verticalAlignment}`,
        {
          'd-d-grid d-of-hidden dt-popover-box__grid': fixedHeader,
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
      <div
        v-if="hasCaret"
        class="
          d-ps-absolute
          dt-popover__caret
          d-mtn2
          d-bt
          d-bl
          d-w4
          d-h4
          d-bgc-white
          d-bc-transparent
        "
      />
      <popover-header
        v-if="isHeaderVisible"
        ref="popover__header"
        :header-class="headerClass"
        :title="title"
        :show-close-button="showCloseButton"
        :close-button-props="closeButtonProps"
        :has-box-shadow="hasBoxShadow"
        @close="closePopover"
      >
        <template #title>
          <!-- @slot Slot for popover header title, defaults to title prop -->
          <slot name="title" />
        </template>
        <template #headerActions>
          <!-- @slot Additional actions near close button. Should be used only for secondary and tertiary buttons -->
          <slot name="headerActions" />
        </template>
      </popover-header>
      <!-- @slot content that is displayed in the popover when it is open. -->
      <div
        ref="popover__content"
        data-qa="dt-popover-content"
        :class="[
          'dt-popover__content',
          POPOVER_PADDING_CLASSES[padding],
          {
            'd-of-auto': fixedHeader,
          },
          contentClass,
        ]"
        @scroll="onScrollContent"
      >
        <!-- @slot Content element to display inside the popover. -->
        <slot name="content" />
      </div>
    </dt-lazy-show>
  </component>
</template>

<script>
import tippy from 'tippy.js/headless';
import { hideOnEsc, getArrowDetected } from '../tooltip/modifiers';
import {
  POPOVER_CONTENT_WIDTHS,
  POPOVER_HORIZONTAL_ALIGNMENT,
  POPOVER_PADDING_CLASSES,
  POPOVER_ROLES,
  POPOVER_VERTICAL_ALIGNMENT,
} from './popover_constants';
import { getUniqueString } from '../utils';
import DtLazyShow from '../lazy_show/lazy_show';
import { TOOLTIP_HIDE_ON_CLICK_VARIANTS } from '../tooltip';
import ModalMixin from '../mixins/modal.js';
import PopoverHeader from './popover_header';

export default {
  name: 'DtPopover',

  /********************
   * CHILD COMPONENTS *
   ********************/
  components: {
    DtLazyShow,
    PopoverHeader,
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
     * Fixed vertical alignment of the popover content. If passed, the popover
     * will always display anchored to the top or bottom of the anchor element.
     * If null, the content will be positioned on whichever side has the most
     * available space relative to the root Vue element. String values must be
     * one of `top` or `bottom`.
     */
    fixedVerticalAlignment: {
      type: String,
      default: null,
      validator: (align) => {
        return POPOVER_VERTICAL_ALIGNMENT.includes(align);
      },
    },

    /**
     * Fixed horizontal alignment of the popover content. If passed, the
     * popover will always display anchored to the left or right of the
     * anchor element. If null, the content will be positioned on whichever
     * side has the most available space relative to the root Vue element.
     * String values must be one of `left` or `right`.
     */
    fixedAlignment: {
      type: String,
      default: null,
      validator: (align) => {
        return POPOVER_HORIZONTAL_ALIGNMENT.includes(align);
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
     * Whether or not a carat (arrow) should be shown from the content pointing
     * at the anchor.
     */
    hasCaret: {
      type: Boolean,
      default: true,
    },

    /**
     * Determines should the anchor be focused after closing the popover
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
     * Determines title for popover header.
     * If provided prop is not null, corresponding holder div will be rendered
     */
    title: {
      type: String,
      default: null,
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
    fixedHeader: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines visibility for close button
     */
    showCloseButton: {
      type: Boolean,
      default: false,
    },

    /**
     * Additional class name for the content wrapper element.
     */
    headerClass: {
      type: [String, Array, Object],
      default: '',
    },
  },

  emits: ['update:open'],

  data () {
    return {
      POPOVER_PADDING_CLASSES,
      verticalAlignment: '',
      horizontalAlignment: '',
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
      return this.hasScrolled && this.fixedHeader;
    },

    fallbackPlacements () {
      const verticalVariants = POPOVER_VERTICAL_ALIGNMENT.filter(alignment => alignment);
      const horizontalVariants = POPOVER_HORIZONTAL_ALIGNMENT.filter(alignment => alignment);
      if (this.fixedAlignment === null && this.fixedVerticalAlignment === null) {
        return verticalVariants.map(vertical =>
          horizontalVariants.map(horizontal =>
            this.getPlacement(vertical, horizontal)),
        ).flat();
      }

      if (this.fixedAlignment === null) {
        return horizontalVariants
          .map(horizontal => this.getPlacement(this.fixedVerticalAlignment, horizontal));
      }

      if (this.fixedVerticalAlignment === null) {
        return verticalVariants
          .map(vertical => this.getPlacement(vertical, this.fixedAlignment));
      }

      return [];
    },

    placement () {
      return this.getPlacement(this.fixedVerticalAlignment, this.fixedAlignment);
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

    isHeaderVisible () {
      return this.isTitleVisible || this.areHeaderButtonsVisible;
    },

    isTitleVisible () {
      return this.$slots.title || this.title !== null;
    },

    areHeaderButtonsVisible () {
      return this.$slots.headerActions;
    },
  },

  watch: {
    placement (placement) {
      this.tip?.setProps({
        placement,
      });
    },

    fallbackPlacements: {
      deep: true,
      handler () {
        this.tip?.setProps({
          popperOptions: this.getPopperOptions(),
        });
      },
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
    // local verticalAlignment is needed for flipping
    this.verticalAlignment = this.fixedVerticalAlignment;
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
    this.tip = tippy(this.anchorEl, this.getOptions({
      popperOptions: this.getPopperOptions(),
      tippyOptions: {
        placement: this.placement,
        hideOnClick: this.hideOnClick,
        offset: this.offset,
        interactiveBorder: this.interactiveBorder,
        appendTo: this.appendTo,
        interactive: this.interactive,
        allowHTML: true,
        trigger: this.trigger,
        zIndex,
        onHide: this.onHide,
        onMount: this.onMount,
        onClickOutside: this.onClickOutside,
        onShow: this.onShow,
      },
    }));
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

    getPlacement (vertical = 'bottom', horizontal = 'end') {
      const verticalAlignment = vertical || 'bottom';
      const horizontalAlignment = horizontal || 'end';
      if (horizontalAlignment === 'center') return verticalAlignment;
      if (horizontalAlignment === 'left' || horizontalAlignment === 'right') {
        return `${verticalAlignment}-${horizontalAlignment === 'left' ? 'start' : 'end'}`;
      }
      return `${verticalAlignment}-${horizontalAlignment}`;
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
      this.tip.unmount();
      this.$emit('update:open', false);
    },

    onOpen () {
      this.$emit('update:open', true);
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

    getPopperOptions () {
      return {
        modifiers: [
          {
            name: 'flip',
            options: {
              boundary: this.flipBoundary,
              fallbackPlacements: this.fallbackPlacements,
            },
          },
          {
            name: 'hide',
            enabled: this.appendTo !== 'parent',
          },
          getArrowDetected(({ state }) => {
            this.verticalAlignment = state.placement.includes('top') ? 'top' : 'bottom';
            if (state.placement === 'top' || state.placement === 'bottom') {
              this.horizontalAlignment = 'center';
            } else {
              this.horizontalAlignment = state.placement.includes('start') ? 'left' : 'right';
            }
          }),
        ],
      };
    },

    getOptions ({ popperOptions, tippyOptions } = {}) {
      return {
        popperOptions,
        ...tippyOptions,
        plugins: [hideOnEsc],
        render: () => {
          // The recommended structure is to use the popper as an outer wrapper
          const popper = document.createElement('div');
          popper.className = 'tippy-box d-ps-absolute';
          popper.appendChild(this.popoverContentEl);
          return {
            popper,
          };
        },
      };
    },

    async setPopoverContentAnchorWidth () {
      await this.$nextTick();
      this.popoverContentEl.style.width = `${this.anchorEl.clientWidth}px`;
    },

    focusFirstElementIfNeeded (domEl) {
      if (this.isDialog || this.isMenu) {
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

.dt-popover__content {
  &--align-right {
    .dt-popover__caret {
      right: @su24;
    }
  }

  &--align-left {
    .dt-popover__caret {
      left: @su24;
    }
  }

  &--align-center {
    .dt-popover__caret {
      left: 50%;
    }
  }

  &--valign-top {
    bottom: 100%;
    margin-top: @su0;
    margin-bottom: @su4;

    .dt-popover__caret {
      bottom: 0;
      transform: rotate(225deg);
    }
  }

  &--valign-bottom {
    .dt-popover__caret {
      bottom: 100%;
      top: 0;
      transform: rotate(45deg);
    }
  }
}

.dt-popover__caret {
  transform: rotate(45deg);
}

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
