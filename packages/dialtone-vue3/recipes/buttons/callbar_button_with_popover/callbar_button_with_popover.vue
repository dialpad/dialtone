<template>
  <div
    class="d-recipe-callbar-button-with-popover"
    v-bind="addClassStyleAttrs($attrs)"
  >
    <dt-recipe-callbar-button
      :aria-label="ariaLabel"
      :disabled="disabled"
      :active="active"
      :danger="danger"
      :button-class="buttonClass"
      :button-width-size="buttonWidthSize"
      :text-class="textClass"
      :inverted-tooltip="invertedTooltip"
      :show-tooltip="showTooltip"
      :tooltip-text="tooltipText"
      :tooltip-delay="tooltipDelay"
      class="d-recipe-callbar-button-with-popover--main-button"
      @click="buttonClick"
    >
      <template #icon>
        <slot name="icon" />
      </template>
      <template #tooltip>
        <slot name="tooltip" />
      </template>
      <slot />
    </dt-recipe-callbar-button>
    <dt-popover
      v-if="showArrowButton"
      :id="id"
      :modal="false"
      :open="open"
      :placement="placement"
      :initial-focus-element="initialFocusElement"
      :show-close-button="showCloseButton"
      :offset="offset"
      padding="none"
      class="d-recipe-callbar-button-with-popover__popover-wrapper"
      :dialog-class="['d-recipe-callbar-button-with-popover__popover', contentClass]"
      v-bind="removeClassStyleAttrs($attrs)"
      :open-popover="showPopover"
      @opened="onModalIsOpened"
    >
      <template #anchor>
        <dt-button
          circle
          importance="clear"
          size="lg"
          :class="['d-recipe-callbar-button-with-popover__arrow',
                   { 'd-recipe-callbar-button-with-popover__arrow--large': !isCompactMode }]"
          width="2rem"
          :aria-label="arrowButtonLabel"
          :active="open"
          @click="arrowClick"
        >
          <template #icon>
            <dt-icon-chevron-up
              class="d-recipe-callbar-button-with-popover__arrow-icon"
              size="200"
            />
          </template>
        </dt-button>
      </template>
      <template #content>
        <slot name="content" />
      </template>
      <template #headerContent>
        <slot name="headerContent" />
      </template>
      <template #footerContent>
        <slot name="footerContent" />
      </template>
    </dt-popover>
  </div>
</template>

<script>
import { DtButton } from '@/components/button';
import { DtPopover } from '@/components/popover';
import { DtIconChevronUp } from '@dialpad/dialtone-icons/vue3';
import { DtRecipeCallbarButton, CALLBAR_BUTTON_VALID_WIDTH_SIZE } from '../callbar_button';
import utils, { warnIfUnmounted, removeClassStyleAttrs, addClassStyleAttrs, returnFirstEl } from '@/common/utils';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtRecipeCallbarButtonWithPopover',

  components: { DtRecipeCallbarButton, DtPopover, DtButton, DtIconChevronUp },

  /* inheritAttrs: false is generally an option we want to set on library
    components. This allows any attributes passed in that are not recognized
    as props to be passed down to another element or component using v-bind:$attrs
    more info: https://vuejs.org/v2/api/#inheritAttrs */
  inheritAttrs: false,

  props: {
    /**
     * Id for the item.
     */
    id: {
      type: String,
      default () {
        return utils.getUniqueString();
      },
    },

    /**
     * Aria label for the button. If empty, it takes its value from the default slot.
     */
    ariaLabel: {
      type: String,
      default: null,
      validator: (label) => {
        return label || this.$slots.default;
      },
    },

    /**
     * Aria label for the arrow. Cannot be empty.
     */
    arrowButtonLabel: {
      type: String,
      required: true,
      validator: (label) => {
        return !!label;
      },
    },

    /**
     * The direction the popover displays relative to the anchor.
     * @values 'bottom', 'bottom-start', 'bottom-end',
     *         'right', 'right-start', 'right-end',
     *         'left', 'left-start', 'left-end',
     *         'top', 'top-start', 'top-end'
     * @default 'top'
     */
    placement: {
      type: String,
      default: 'top',
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
      default: () => [0, 16],
    },

    /**
     * The element that is focused when the popover is opened. This can be an
     * HTMLElement within the popover, a string starting with '#' which will
     * find the element by ID. 'first' which will automatically focus
     * the first element, or 'dialog' which will focus the dialog window itself.
     * If the dialog is modal this prop cannot be 'none'.
     */
    initialFocusElement: {
      type: String,
      default: 'first',
    },

    /**
     * Determines visibility for close button
     */
    showCloseButton: {
      type: Boolean,
      default: true,
    },

    /**
     * Determines whether the button should be disabled
     * default is false.
     * @values true, false
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Forces showing the arrow, even if the button is disabled.
     * default is false
     * @values true, false
     */
    forceShowArrow: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines whether the button should have active styling
     * default is false.
     * @values true, false
     * @see https://dialtone.dialpad.com/components/button/
     */
    active: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines whether the button should have danger styling
     * default is false.
     * @values true, false
     * @see https://dialtone.dialpad.com/components/button/
     */
    danger: {
      type: Boolean,
      default: false,
    },

    /**
     * We need this declaration because of how Vue3 informs the component about a listener.
     * Spoiler alert: it doesn't.
     * Vue3 intends to work as a real pub-sub, meaning the publisher has not a clue of who the subscribers are.
     * This makes it impossible from the regular declaration (emits: ['click']) to check whether
     * we actually have a click handler or not.
     * We're hacking it by adding an onClick prop: https://github.com/vuejs/core/issues/5220
    */
    /* eslint-disable-next-line vue/no-unused-properties */
    onClick: {
      type: Function,
      default: null,
    },

    /**
     * Additional class name for the button wrapper element.
     */
    buttonClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional class name for the button text.
     */
    textClass: {
      type: [String, Array, Object],
      default: '',
    },

    /*
     * Width size. Valid values are: 'xl', 'lg', 'md' and 'sm'.
     */
    buttonWidthSize: {
      type: String,
      default: 'xl',
      validator: size => CALLBAR_BUTTON_VALID_WIDTH_SIZE.includes(size),
    },

    /**
     * Additional class name for the popover content wrapper element.
     */
    contentClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * To auto open the modal popover.
     */
    openPopover: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether the tooltip has an inverted background color.
     * @values true, false
     */
    invertedTooltip: {
      type: Boolean,
      default: false,
    },

    /**
     * Use this if you would like to manually override the logic for when the tooltip shows.
     * Otherwise it will just show on hover/focus.
     * @values null, true, false
     */
    showTooltip: {
      type: Boolean,
      default: null,
    },

    /**
     * The message that displays in the tooltip. This will be overridden by the tooltip slot.
     */
    tooltipText: {
      type: String,
      default: undefined,
    },

    /**
     * Whether there is a delay before the tooltip shows on hover/focus.
     * @values true, false
     */
    tooltipDelay: {
      type: Boolean,
      default: undefined,
    },
  },

  emits: [
    /**
     * Emitted when the arrow is clicked
     */
    'arrow-click',

    /**
     * Native click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',

    /**
     * Emitted when modal popover is opened or closed.
     */
    'opened',
  ],

  data () {
    return {
      open: false,
    };
  },

  computed: {
    showArrowButton () {
      return this.forceShowArrow || !this.disabled;
    },

    isCompactMode () {
      return this.buttonWidthSize === 'sm' || this.buttonWidthSize === 'md';
    },

    showPopover () {
      if (!this.openPopover || this.open) {
        this.syncOpenState();
        return false;
      }

      return this.toggleOpen();
    },
  },

  mounted () {
    warnIfUnmounted(returnFirstEl(this.$el), this.$options.name);
  },

  methods: {
    removeClassStyleAttrs,
    addClassStyleAttrs,
    arrowClick (ev) {
      this.$emit('arrow-click', ev);
      return this.toggleOpen();
    },

    toggleOpen () {
      return (this.open = !this.open);
    },

    syncOpenState () {
      this.open = this.openPopover;
    },

    buttonClick (ev) {
      // If no listener for the click event, the button click opens the popover
      // the same as if the arrow was clicked.
      if (!this.$props.onClick) {
        this.arrowClick(ev);
      } else {
        this.$emit('click', ev);
      }
    },

    onModalIsOpened (isOpened) {
      this.open = isOpened;
      this.$emit('opened', isOpened);
    },
  },

};
</script>
