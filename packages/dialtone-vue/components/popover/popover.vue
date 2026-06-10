<!-- eslint-disable vuejs-accessibility/mouse-events-have-key-events -->
<template>
  <div>
    <Teleport
      v-if="modal && isOpen"
      to="body"
    >
      <div
        class="d-modal--transparent"
        aria-hidden="false"
        @click.prevent.stop
      />
    </Teleport>
    <component
      :is="elementType"
      ref="popover"
      :class="['d-popover', { 'd-popover__anchor--opened': isOpen }]"
      data-qa="dt-popover-container"
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
        @keydown.enter="$emit('keydown', $event)"
        @keydown.space="$emit('keydown', $event)"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
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
        :appear="toAppear"
        :class="['d-popover__dialog', { 'd-popover__dialog--modal': modal }, dialogClass]"
        :style="{
          'max-height': calculatedMaxHeight,
          'max-width': maxWidth,
        }"
        :css="$attrs.css"
        :tabindex="contentTabindex"
        v-on="popoverListeners"
        @mouseenter="onMouseEnterAnchor"
        @mouseleave="onMouseLeaveAnchor"
      >
        <popover-header-footer
          v-if="hasSlotContent($slots.headerContent) || showCloseButton"
          ref="popover__header"
          :class="POPOVER_HEADER_FOOTER_PADDING_CLASSES[padding]"
          :content-class="headerClass"
          type="header"
          :show-close-button="showCloseButton"
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
          v-if="hasSlotContent($slots.footerContent)"
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
          v-if="!showCloseButton"
          @close="closePopover"
        />
      </dt-lazy-show>
tml>
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
import { getUniqueString, hasSlotContent, isOutOfViewPort, warnIfUnmounted, disableRootScrolling, enableRootScrolling, returnFirstEl } from '@/common/utils';
import { DtLazyShow } from '@/components/lazy_show';
import ModalMixin from '@/common/mixins/modal';
import { createTippyPopover, getPopperOptions } from './tippy_utils';
import PopoverHeaderFooter from './popover_header_footer.vue';
import SrOnlyCloseButton from '@/common/sr_only_close_button.vue';

/**
 * A Popover displays a content overlay when its anchor element is activated.
 * @see https://dialtone.dialpad.com/components/popover.html
 */
export default {
  compatConfig: { MODE: 3 },
  name: 'DtPopover',

  /********************
   * CHILD COMPONENTS *
   ********************/
  components: {
    SrOnlyCloseButton,
    DtLazyShow,
    PopoverHeaderFooter,
  },

  mixins: [ModalMixin],

  props: {
    open: {
      type: Boolean,
      default: null,
    },
    openOnContext: {
      type: Boolean,
      default: false,
    },
    elementType: {
      type: String,
      default: 'div',
    },
    transition: {
      type: String,
      default: 'fade',
    },
    role: {
      type: String,
      default: 'dialog',
      validator: (role) => {
        return POPOVER_ROLES.includes(role);
      },
    },
    ariaLabelledby: {
      type: String,
      default: null,
    },
    ariaLabel: {
      type: String,
      default: null,
    },
    padding: {
      type: String,
      default: 'large',
      validator: (padding) => {
        return Object.keys(POPOVER_PADDING_CLASSES).some((item) => item === padding);
      },
    },
    contentClass: {
      type: [String, Array, Object],
      default: '',
    },
    contentWidth: {
      type: String,
      default: '',
      validator: contentWidth => POPOVER_CONTENT_WIDTHS.includes(contentWidth),
    },
    contentAppear: {
      type: Boolean,
      default: null,
    },
    contentTabindex: {
      type: Number || null,
      default: -1,
    },
    externalAnchor: {
      type: String,
      default: '',
    },
    externalAnchorElement: {
      type: HTMLElement,
      default: null,
    },
    id: {
      type: String,
      default () { return getUniqueString(); },
    },
    offset: {
      type: Array,
      default: () => [0, 4],
    },
    hideOnClick: {
      type: Boolean,
      default: true,
    },
    modal: {
      type: Boolean,
      default: true,
    },
    fallbackPlacements: {
      type: Array,
      default: () => {
        return ['auto'];
      },
    },
    placement: {
      type: String,
      default: 'bottom-end',
    },
    tether: {
      type: Boolean,
      default: true,
    },
    sticky: {
      type: [Boolean, String],
      default: false,
      validator: (sticky) => {
        return POPOVER_STICKY_VALUES.includes(sticky);
      },
    },
    maxHeight: {
      type: String,
      default: '',
    },
    maxWidth: {
      type: String,
      default: '',
    },
    showCloseButton: {
      type: Boolean,
      default: false,
    },
    headerClass: {
      type: [String, Array, Object],
      default: '',
    },
    footerClass: {
      type: [String, Array, Object],
      default: '',
    },
    dialogClass: {
      type: [String, Array, Object],
      default: '',
    },
    initialFocusElement: {
      type: [String, HTMLElement],
      default: 'first',
      validator: initialFocusElement => {
        return POPOVER_INITIAL_FOCUS_STRINGS.includes(initialFocusElement) ||
          (initialFocusElement instanceof HTMLElement) ||
          initialFocusElement.startsWith('#');
      },
    },
    openWithArrowKeys: {
      type: Boolean,
      default: false,
    },
    appendTo: {
      type: [HTMLElement, String],
      default: 'body',
      validator: appendTo => {
        return POPOVER_APPEND_TO_VALUES.includes(appendTo) ||
            (appendTo instanceof HTMLElement);
      },
    },
  },

  emits: [
    'keydown',
    'update:open',
    'opened',
    'mouseenter-popover',
    'mouseleave-popover',
    'mouseenter-popover-anchor',
    'mouseleave-popover-anchor',
  ],

  data () {
    return {
      POPOVER_PADDING_CLASSES,
      POPOVER_HEADER_FOOTER_PADDING_CLASSES,
      intersectionObserver: null,
      mutationObserver: null,
      isOutsideViewport: false,
      isOpen: false,
      toAppear: false,
      anchorEl: null,
      popoverContentEl: null,
      hasSlotContent,
    };
  },

  computed: {
    popoverListeners () {
      return {
        keydown: event => {
          this.onKeydown(event);
        },
        'after-leave': () => {
          this.onLeaveTransitionComplete();
        },
        'after-enter': () => {
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

    externalAnchorElement () {
      this.updateAnchorEl();
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
        if (open === true) {
          this.toAppear = true;
        }
      },
      immediate: true,
    },

    contentAppear: {
      handler: function (contentAppear) {
        if (contentAppear !== null) {
          this.toAppear = contentAppear;
        }
      },
    },

    isOpen (isOpen, isPrev) {
      if (isOpen) {
        this.initTippyInstance();
        this.tip?.show();
      } else if (!isOpen && isPrev !== isOpen) {
        this.removeEventListeners();
        this.tip?.hide();
      }
    },
  },

  mounted () {
    warnIfUnmounted(returnFirstEl(this.$el), this.$options.name);

    this.popoverContentEl = returnFirstEl(this.$refs.content?.$el);
    this.updateAnchorEl();

    this.mutationObserver = new MutationObserver(this.updateAnchorEl);
    this.mutationObserver.observe(this.$refs.anchor, {childList: true});

    this.intersectionObserver = new IntersectionObserver(this.hasIntersectedViewport);
    this.intersectionObserver.observe(this.popoverContentEl);
  },

  beforeUnmount () {
    this._isUnmounting = true;
    if (this.popoverContentEl) {
      this.popoverContentEl.style.transition = 'none';
    }
    this.tip?.destroy();
    this.intersectionObserver?.disconnect();
    this.mutationObserver?.disconnect();
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

    updateAnchorEl () {
      const externalAnchorEl = this.externalAnchorElement ||
        (this.externalAnchor
          ? this.$refs.anchor.getRootNode().querySelector(`#${this.externalAnchor}`)
          : null);
      const anchorEl = externalAnchorEl ?? this.$refs.anchor.children[0];
      if (anchorEl === this.anchorEl) {
        return;
      }
      this.anchorEl = anchorEl;

      this.tip?.destroy();
      delete this.tip;

      if (!this.anchorEl) {
        console.warn('No anchor found for popover');
        return;
      }

      if (this.isOpen) {
        this.initTippyInstance();
        this.tip?.show();
      }
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
      if (returnFirstEl(this.$el).getRootNode()
        .querySelector('.d-modal[aria-hidden="false"], .d-modal--transparent[aria-hidden="false"]') ||
        this.anchorEl?.closest('.d-zi-drawer')) {
        return 650;
      } else {
        return 300;
      }
    },

    defaultToggleOpen (e) {
      if (this.openOnContext) { return; }

      if (this.open === null || this.open === undefined) {
        if ((!this.anchorEl?.contains(e.target) && !this.anchorEl?.isEqualNode(e.target)) || this.anchorEl?.disabled) {
          return;
        }

        this.toggleOpen();
      }
    },

    async onContext (event) {
      if (!this.openOnContext) { return; }

      event.preventDefault();

      this.isOpen = true;
      await this.$nextTick();
      this.tip?.setProps({
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

      this.$emit('keydown', e);
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

    preventScrolling () {
      if (this.modal) {
        const element = this.anchorEl?.closest('body, .tippy-box');
        if (!element) return;
        if (element.tagName?.toLowerCase() === 'body') {
          disableRootScrolling(this.anchorEl.getRootNode().host);
          this.tip?.setProps({ offset: this.offset });
        } else {
          element.classList.add('d-zi-popover');
        }
      }
    },

    enableScrolling () {
      const element = this.anchorEl?.closest('body, .tippy-box');
      if (!element) return;
      if (element.tagName?.toLowerCase() === 'body') {
        enableRootScrolling(this.anchorEl.getRootNode().host);
        this.tip?.setProps({ offset: this.offset });
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
        if (this._isUnmounting) return;
      }

      if (this.contentWidth === null) {
        this.popoverContentEl.style.width = 'auto';
      }

      this.addEventListeners();
    },

    async onLeaveTransitionComplete () {
      if (this._isUnmounting) return;
      if (this.modal) {
        await this.focusFirstElement(this.$refs.anchor);
        if (this._isUnmounting) return;
        await this.$nextTick();
        if (this._isUnmounting) return;
        this.enableScrolling();
      }
      if (this._isUnmounting) return;
      this.tip?.unmount();
      this.$emit('opened', false);
      if (this.open !== null) {
        this.$emit('update:open', false);
      }
    },

    async onEnterTransitionComplete () {
      if (this._isUnmounting) return;
      this.focusInitialElement();
      await this.$nextTick();
      if (this._isUnmounting) return;
      this.preventScrolling();
      this.$emit('opened', true, this.$refs.popover__content);
      if (this.open !== null) {
        this.$emit('update:open', true);
      }
    },

    focusInitialElement () {
      if (this.initialFocusElement === 'dialog') {
        returnFirstEl(this.$refs.content?.$el)?.focus();
      }
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
      const result = returnFirstEl(this.$refs.content?.$el)?.querySelector(this.initialFocusElement);
      if (result) {
        result.focus();
      } else {
        console.warn('Could not find the element specified in dt-popover prop "initialFocusElement". ' +
          'Defaulting to focusing the dialog.');
        returnFirstEl(this.$refs.content?.$el)?.focus();
      }
    },

    onResize () {
      this.closePopover();
    },

    onClickOutside () {
      if (!this.hideOnClick) return;
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

      this.$emit('keydown', e);
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
        returnFirstEl(this.$refs.content?.$el).focus();
      }
    },

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

      this.tip?.destroy();

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
        hideOnClick: false,
        zIndex: this.modal ? 650 : this.calculateAnchorZindex(),
        onClickOutside: this.onClickOutside,
        onShow: this.onShow,
      });
    },

    onMouseEnter () {
      this.$emit('mouseenter-popover');
    },

    onMouseLeave () {
      this.$emit('mouseleave-popover');
    },

    onMouseEnterAnchor () {
      this.$emit('mouseenter-popover-anchor');
    },

    onMouseLeaveAnchor () {
      this.$emit('mouseleave-popover-anchor');
    },
  },
};
</script>
