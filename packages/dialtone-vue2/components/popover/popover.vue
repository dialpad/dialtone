<!-- eslint-disable vuejs-accessibility/mouse-events-have-key-events -->
<template>
  <div>
    <portal v-if="modal && isOpen">
      <div
        class="d-modal--transparent"
        :aria-hidden="modal && isOpen ? 'false' : 'true'"
        @click.prevent.stop
      />
    </portal>
    <component
      :is="elementType"
      ref="popover"
      :class="['d-popover', { 'd-popover__anchor--opened': isOpen }]"
      data-qa="dt-popover-container"
      v-on="$listeners"
    >
      <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
      <div
        :id="!ariaLabelledby && labelledBy"
        ref="anchor"
        :data-qa="$attrs['data-qa'] ? `${$attrs['data-qa']}-anchor` : 'dt-popover-anchor'"
        :tabindex="openOnContext ? 0 : undefined"
        @click.capture="defaultToggleOpen"
        @contextmenu="onContext"
        @keydown.up.prevent="onArrowKeyPress"
        @keydown.down.prevent="onArrowKeyPress"
        @keydown.escape.capture="closePopover"
        @mouseenter="onEnterAnchor"
        @mouseleave="onLeaveAnchor"
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
        :data-qa="$attrs['data-qa'] ? `${$attrs['data-qa']}__dialog` : 'dt-popover'"
        :aria-hidden="`${!isOpen}`"
        :aria-labelledby="labelledBy"
        :aria-label="ariaLabel"
        :aria-modal="`${!modal}`"
        :transition="transition"
        :show="isOpen"
        :class="['d-popover__dialog', { 'd-popover__dialog--modal': modal }, dialogClass]"
        :style="{
          'max-height': calculatedMaxHeight,
          'max-width': maxWidth,
        }"
        :tabindex="contentTabindex"
        appear
        v-on="popoverListeners"
        @mouseenter="onEnterContent"
        @mouseleave="onLeaveContent"
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
          :data-qa="$attrs['data-qa'] ? `${$attrs['data-qa']}-content` : 'dt-popover-content'"
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
  POPOVER_APPEND_TO_VALUES,
  POPOVER_CONTENT_WIDTHS,
  POPOVER_HEADER_FOOTER_PADDING_CLASSES,
  POPOVER_INITIAL_FOCUS_STRINGS,
  POPOVER_PADDING_CLASSES,
  POPOVER_ROLES,
  POPOVER_STICKY_VALUES,
} from './popover_constants';
import { getUniqueString, isOutOfViewPort, warnIfUnmounted } from '@/common/utils';
import { DtLazyShow } from '@/components/lazy_show';
import { Portal } from '@linusborg/vue-simple-portal';
import ModalMixin from '@/common/mixins/modal';
import { createTippyPopover, getPopperOptions } from './tippy_utils';
import PopoverHeaderFooter from './popover_header_footer.vue';
import SrOnlyCloseButtonMixin from '@/common/mixins/sr_only_close_button';
import SrOnlyCloseButton from '@/common/sr_only_close_button.vue';
import { TOOLTIP_DELAY_MS } from '@/components/tooltip/index.js';
import { disableRootScrolling, enableRootScrolling } from '@/../../common/utils';

/**
 * A Popover displays a content overlay when its anchor element is activated.
 * @see https://dialtone.dialpad.com/components/popover.html
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
    Portal,
  },

  mixins: [ModalMixin, SrOnlyCloseButtonMixin],

  props: {
    /**
     * Controls whether the popover is shown. Leaving this null will have the popover trigger on click by default.
     * If you set this value, the default trigger behavior will be disabled, and you can control it as you need.
     * Supports .sync modifier
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
     * <a class="d-link" href="https://www.w3.org/TR/wai-aria/#aria-haspopup" target="_blank">aria-haspopup</a>
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
      default: '',
      validator: contentWidth => POPOVER_CONTENT_WIDTHS.includes(contentWidth),
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
     *  by the specified number of pixels.
     *  <a
     *    class="d-link"
     *    href="https://atomiks.github.io/tippyjs/v6/all-props/#offset"
     *    target="_blank"
     *  >
     *    Tippy.js docs
     *  </a>
     */
    offset: {
      type: Array,
      default: () => [0, 4],
    },

    /**
     * Determines if the popover hides upon clicking the
     * anchor or outside the content box.
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
     * it will attempt to change its direction to the "fallbackPlacements".
     * <a
     *   class="d-link"
     *   href="https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements"
     *   target="_blank"
     * >
     *   Popper.js docs
     * </a>
     * */
    fallbackPlacements: {
      type: Array,
      default: () => {
        return ['auto'];
      },
    },

    /**
     * The direction the popover displays relative to the anchor.
     * <a
     *   class="d-link"
     *   href="https://atomiks.github.io/tippyjs/v6/all-props/#placement"
     *   target="_blank"
     * >
     *   Tippy.js docs
     * </a>
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
     * <a
     *   class="d-link"
     *   href="https://popper.js.org/docs/v2/modifiers/prevent-overflow/#tether"
     *   target="_blank"
     * >
     *   Popper.js docs
     * </a>
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
     * <a
     *   class="d-link"
     *   href="https://atomiks.github.io/tippyjs/v6/all-props/#sticky"
     *   target="_blank"
     * >
     *   Tippy.js docs
     * </a>
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

    /**
     * Sets the element to which the popover is going to append to.
     * 'body' will append to the nearest body (supports shadow DOM).
     * 'root' will try append to the iFrame's parent body if it is contained in an iFrame
     * and has permissions to access it, else, it'd default to 'parent'.
     * @values 'body', 'parent', 'root', HTMLElement
     */
    appendTo: {
      type: [HTMLElement, String],
      default: 'body',
      validator: appendTo => {
        return POPOVER_APPEND_TO_VALUES.includes(appendTo) ||
            (appendTo instanceof HTMLElement);
      },
    },

    /**
     * Set this prop to true and popover component will support hovercard behaviour
     * It will open on mouseenter and close on mouseleave with timer delay of 300ms
     */
    hovercard: {
      type: Boolean,
      default: false,
    },

    /**
     * The timer is used only when the hovercard prop is true.
     * It defines the delays when opening several hovercards.
     * It must have the keys: enter, leave and current.
     * If null, the default delay of 300ms will be used.
     */
    timer: {
      type: [Object, null],
      default: null,
      validator: timer => {
        return timer === null || (timer.enter && timer.leave && Object.keys(timer).includes('current'));
      },
    },
  },

  emits: [
    /**
     * Emitted when popover is shown or hidden
     *
     * @event opened
     * @type {Boolean | Array}
     */
    'opened',

    /**
     * Emitted to sync value with parent
     *
     * @event update:opened
     * @type {Boolean | Array}
     */
    'update:open',
  ],

  data () {
    return {
      POPOVER_PADDING_CLASSES,
      POPOVER_HEADER_FOOTER_PADDING_CLASSES,
      intersectionObserver: null,
      isOutsideViewport: false,
      isOpen: false,
      anchorEl: null,
      popoverContentEl: null,
      inTimer: null,
      outTimer: null,
    };
  },

  computed: {
    popoverListeners () {
      return {
        ...this.$listeners,

        keydown: event => {
          this.onKeydown(event);
          this.$emit('keydown', event);
        },

        'after-leave': event => {
          this.onLeaveTransitionComplete();
        },

        'after-enter': event => {
          this.onEnterTransitionComplete();
        },
      };
    },

    calculatedMaxHeight () {
      if (this.isOutsideViewport && this.modal) {
        return `calc(100vh - var(--dt-space-300))`;
      }
      return this.maxHeight;
    },

    labelledBy () {
      // aria-labelledby should be set only if aria-labelledby is passed as a prop, or if
      // there is no aria-label and the labelledby should point to the anchor.
      return this.ariaLabelledby || (!this.ariaLabel && getUniqueString('DtPopover__anchor'));
    },

    currentHovercard () {
      return this.timer?.current.value;
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
      this.tip?.setProps({
        zIndex: modal ? 650 : this.calculateAnchorZindex(),
      });
    },

    offset (offset) {
      this.tip?.setProps({
        offset,
      });
    },

    sticky (sticky) {
      this.tip?.setProps({
        sticky,
      });
    },

    fallbackPlacements () {
      this.tip?.setProps({
        popperOptions: this.popperOptions(),
      });
    },

    tether () {
      this.tip?.setProps({
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
        this.initTippyInstance();
        this.tip.show();
      } else if (!isOpen && isPrev !== isOpen) {
        this.removeEventListeners();
        this.tip.hide();
      }
    },

    currentHovercard () {
      if (this.hovercard && this.timer) {
        if (this.currentHovercard === this.id) {
          this.isOpen = true;
        } else {
          this.isOpen = false;
        }
      }
    },
  },

  mounted () {
    warnIfUnmounted(this.$el, this.$options.name);

    const externalAnchorEl = this.externalAnchor
      ? this.$refs.anchor.getRootNode().querySelector(`#${this.externalAnchor}`)
      : null;
    this.anchorEl = externalAnchorEl ?? this.$refs.anchor.children[0];
    this.popoverContentEl = this.$refs.content?.$el;

    if (this.isOpen) {
      this.initTippyInstance();
      this.tip.show();
    }

    // rootMargin here must be greater than the margin of the height we are setting in calculatedMaxHeight which
    // currently is var(--dt-space-300) (4px). If not the intersectionObserver will continually trigger in an infinite
    // loop.
    // threshold 1.0 makes this trigger every time the dialog "touches" the edge of the viewport.
    this.intersectionObserver = new IntersectionObserver(this.hasIntersectedViewport);
    this.intersectionObserver.observe(this.popoverContentEl);
  },

  beforeDestroy () {
    this.tip?.destroy();
    this.intersectionObserver.disconnect();
    this.removeReferences();
    this.removeEventListeners();
  },

  /******************
   *     METHODS    *
   ******************/
  methods: {

    hasIntersectedViewport (entries) {
      const dialog = entries?.[0]?.target;
      if (!dialog) return;
      const isOut = isOutOfViewPort(dialog);
      this.isOutsideViewport = isOut.bottom || isOut.top;
    },

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
      if (this.$el.getRootNode()
        .querySelector('.d-modal[aria-hidden="false"], .d-modal--transparent[aria-hidden="false"]') ||
        // Special case because we don't have any dialtone drawer component yet. Render at 650 when
        // anchor of popover is within a drawer.
        this.anchorEl?.closest('.d-zi-drawer')) {
        return 650;
      } else {
        return 300;
      }
    },

    defaultToggleOpen (e) {
      if (this.hovercard) { return; }
      if (this.openOnContext) { return; }

      // Only use default toggle behaviour if the user has not set the open prop.
      // Check that the anchor element specifically was clicked.
      this.open ?? (this.anchorEl?.contains(e.target) && !this.anchorEl?.disabled && this.toggleOpen());
    },

    async onContext (event) {
      if (!this.openOnContext) { return; }

      event.preventDefault();

      this.isOpen = true;
      await this.$nextTick();
      this.tip.setProps({
        placement: 'right-start',
        getReferenceClientRect: () => ({
          width: 0,
          height: 0,
          top: event.clientY,
          bottom: event.clientY,
          left: event.clientX,
          right: event.clientX,
        }),
      });
    },

    toggleOpen () {
      this.isOpen = !this.isOpen;
    },

    onArrowKeyPress (e) {
      if (this.open !== null) { return; }

      if (this.openWithArrowKeys && this.anchorEl?.contains(e.target)) {
        if (!this.isOpen) {
          this.isOpen = true;
        }
      }
    },

    addEventListeners () {
      window.addEventListener('dt-popover-close', this.closePopover);
      // align popover content width when contentWidth is 'anchor'
      if (this.contentWidth === 'anchor') {
        window.addEventListener('resize', this.onResize);
      }
    },

    removeEventListeners () {
      window.removeEventListener('dt-popover-close', this.closePopover);
      if (this.contentWidth === 'anchor') {
        window.removeEventListener('resize', this.onResize);
      }
    },

    closePopover () {
      this.isOpen = false;
    },

    /*
    * Prevents scrolling outside of the currently opened modal popover by:
    *   - when anchor is not within another popover: setting the body to overflow: hidden
    *   - when anchor is within another popover: set the popover dialog container to it's non-modal z-index
    *     since it is no longer the active modal. This puts it underneath the overlay and prevents scrolling.
    **/
    preventScrolling () {
      if (this.modal) {
        const element = this.anchorEl?.closest('body, .tippy-box');
        if (!element) return;
        if (element.tagName?.toLowerCase() === 'body') {
          disableRootScrolling(this.anchorEl.getRootNode().host);
          this.tip.setProps({ offset: this.offset });
        } else {
          element.classList.add('d-zi-popover');
        }
      }
    },

    /*
    * Resets the prevent scrolling properties set in preventScrolling() back to normal.
    **/
    enableScrolling () {
      const element = this.anchorEl?.closest('body, .tippy-box');
      if (!element) return;
      if (element.tagName?.toLowerCase() === 'body') {
        enableRootScrolling(this.anchorEl.getRootNode().host);
        this.tip.setProps({ offset: this.offset });
      } else {
        element.classList.remove('d-zi-popover');
      }
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

      this.addEventListeners();
    },

    async onLeaveTransitionComplete () {
      if (this.modal) {
        await this.focusFirstElement(this.$refs.anchor);
        // await next tick in case the user wants to change focus themselves.
        await this.$nextTick();
        this.enableScrolling();
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
      this.preventScrolling();
      this.$emit('opened', true, this.$refs.popover__content);
      if (this.open !== null) {
        this.$emit('update:open', true);
      }
    },

    focusInitialElement () {
      if (this.initialFocusElement === 'dialog') {
        this.$refs.content?.$el?.focus();
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
      const result = this.$refs.content?.$el?.querySelector(this.initialFocusElement);
      if (result) {
        result.focus();
      } else {
        console.warn('Could not find the element specified in dt-popover prop "initialFocusElement". ' +
          'Defaulting to focusing the dialog.');
      }
      result ? result.focus() : this.$refs.content?.$el.focus();
    },

    onResize () {
      this.closePopover();
    },

    onClickOutside () {
      if (!this.hideOnClick) return;
      // If a popover is opened inside of this one, do not hide on click out
      const innerModals = this.popoverContentEl?.querySelector('.d-popover__anchor--opened');
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
    },

    async setPopoverContentAnchorWidth () {
      await this.$nextTick();
      this.popoverContentEl.style.width = `${this.anchorEl?.clientWidth}px`;
    },

    focusFirstElementIfNeeded (domEl) {
      const focusableElements = this._getFocusableElements(domEl, true);
      if (focusableElements.length !== 0) {
        this.focusFirstElement(domEl);
      } else if (this.showCloseButton) {
        this.$refs.popover__header?.focusCloseButton();
      } else {
        // if there are no focusable elements at all focus the dialog itself
        this.$refs.content?.$el.focus();
      }
    },

    /**
     * Return's the anchor ClientRect object relative to the window.
     * Refer to: https://atomiks.github.io/tippyjs/v6/all-props/#getreferenceclientrect for more information
     * @param error
     */
    getReferenceClientRect (error) {
      const anchorReferenceRect = this.anchorEl?.getBoundingClientRect();

      if (this.appendTo !== 'root' || error) return anchorReferenceRect;

      const anchorOwnerDocument = this.anchorEl?.ownerDocument;
      const anchorParentWindow = anchorOwnerDocument?.defaultView || anchorOwnerDocument?.parentWindow;
      const anchorIframe = anchorParentWindow?.frameElement;

      if (!anchorIframe) return anchorReferenceRect;

      const iframeReferenceRect = anchorIframe.getBoundingClientRect();

      return {
        width: anchorReferenceRect?.width,
        height: anchorReferenceRect?.height,
        top: iframeReferenceRect?.top + anchorReferenceRect?.top,
        left: iframeReferenceRect?.left + anchorReferenceRect?.left,
        right: iframeReferenceRect?.right + anchorReferenceRect?.right,
        bottom: iframeReferenceRect?.bottom + anchorReferenceRect?.bottom,
      };
    },

    initTippyInstance () {
      let internalAppendTo = null;
      let iFrameError = false;

      switch (this.appendTo) {
        case 'body':
          internalAppendTo = this.anchorEl?.getRootNode()?.querySelector('body');
          break;

        case 'root':
          // Try to attach the popover to root document, fallback to parent is fail
          try {
            internalAppendTo = window.parent.document.body;
          } catch (err) {
            console.error('Could not attach the popover to iframe parent window: ', err);
            internalAppendTo = 'parent';
            iFrameError = true;
          }
          break;

        default:
          internalAppendTo = this.appendTo;
          break;
      }

      this.tip = createTippyPopover(this.anchorEl, {
        popperOptions: this.popperOptions(),
        contentElement: this.popoverContentEl,
        placement: this.placement,
        offset: this.offset,
        sticky: this.sticky,
        appendTo: internalAppendTo,
        interactive: true,
        trigger: 'manual',
        getReferenceClientRect: () => this.getReferenceClientRect(iFrameError),
        // We have to manage hideOnClick functionality manually to handle
        // popover within popover situations.
        hideOnClick: false,
        zIndex: this.modal ? 650 : this.calculateAnchorZindex(),
        onClickOutside: this.onClickOutside,
        onShow: this.onShow,
      });
    },

    //  ============================================================================
    //  $ HOVERCARD
    //  ----------------------------------------------------------------------------

    setInTimer () {
      this.inTimer = setTimeout(() => {
        this.isOpen = true;
      }, TOOLTIP_DELAY_MS);
    },

    setOutTimer () {
      this.outTimer = setTimeout(() => {
        this.isOpen = false;
      }, TOOLTIP_DELAY_MS);
    },

    onEnterAnchor () {
      if (!this.hovercard) return;
      if (this.timer) this.timer.enter(this.id);
      else {
        clearTimeout(this.outTimer);
        this.setInTimer();
      }
    },

    onLeaveAnchor () {
      if (!this.hovercard) return;
      if (this.timer) this.timer.leave();
      else {
        clearTimeout(this.inTimer);
        this.setOutTimer();
      }
    },

    onEnterContent () {
      if (!this.hovercard) return;
      if (this.timer) this.timer.enter(this.id);
      else clearTimeout(this.outTimer);
    },

    onLeaveContent () {
      if (!this.hovercard) return;
      if (this.timer) this.timer.leave();
      else this.setOutTimer();
    },

    //  ============================================================================
    //  $ HOVERCARD
    //  ----------------------------------------------------------------------------
  },
};
</script>
