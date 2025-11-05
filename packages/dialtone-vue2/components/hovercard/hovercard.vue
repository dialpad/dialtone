<template>
  <dt-popover
    :id="id"
    ref="popover"
    :open="hovercardOpen"
    :placement="placement"
    :content-class="contentClass"
    :dialog-class="dialogClass"
    :fallback-placements="fallbackPlacements"
    :padding="padding"
    :transition="transition ? 'fade' : null"
    :offset="offset"
    :modal="false"
    initial-focus-element="none"
    :header-class="headerClass"
    :footer-class="footerClass"
    :append-to="appendTo"
    data-qa="dt-hovercard"
    :enter-delay="enterDelay"
    :leave-delay="leaveDelay"
    @opened="(e) => ($emit('opened', e))"
    @mouseenter-popover="onMouseEnter"
    @mouseleave-popover="onMouseLeave"
    @mouseenter-popover-anchor="onMouseEnter"
    @mouseleave-popover-anchor="onMouseLeave"
  >
    <template #anchor="{ attrs }">
      <slot
        name="anchor"
        v-bind="attrs"
      />
    </template>
    <template #content>
      <div
        @focusin="onContentFocusIn"
        @focusout="onContentFocusOut"
      >
        <!-- @slot Slot for the content that is displayed in the hovercard. -->
        <slot name="content" />
      </div>
    </template>
    <template #headerContent>
      <slot name="headerContent" />
    </template>

    <template #footerContent>
      <slot name="footerContent" />
    </template>
  </dt-popover>
</template>

<script>
import { POPOVER_APPEND_TO_VALUES, POPOVER_PADDING_CLASSES, DtPopover } from '@/components/popover/index.js';
import { TOOLTIP_DIRECTIONS, TOOLTIP_DELAY_MS } from '@/components/tooltip/index.js';
import { getUniqueString } from '@/common/utils';

export default {
  name: 'DtHovercard',

  components: {
    DtPopover,
  },

  props: {
  /**
     * Controls whether the hovercard is shown. Leaving this null will have the hovercard trigger on hover by default.
     * If you set this value, the default trigger behavior will be disabled, and you can control it as you need.
     * Supports .sync modifier
     * @values null, true, false
     */
    open: {
      type: Boolean,
      default: null,
    },

    /**
   * Fade transition when the content display is toggled.
   * @type boolean
   * @values true, false
   */
    transition: {
      type: Boolean,
      default: false,
    },

    /**
      * If the popover does not fit in the direction described by "placement",
     * it will attempt to change its direction to the "fallbackPlacements".
     * @see https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements"
     */
    fallbackPlacements: {
      type: Array,
      default: () => {
        return ['auto'];
      },
    },

    /**
   * The direction the popover displays relative to the anchor.
   * @see https://atomiks.github.io/tippyjs/v6/all-props/#placement"
   * @values top, top-start, top-end,
   * right, right-start, right-end,
   * left, left-start, left-end,
   * bottom, bottom-start, bottom-end,
   * auto, auto-start, auto-end
   */
    placement: {
      type: String,
      default: 'top-start',
      validator (placement) {
        return TOOLTIP_DIRECTIONS.includes(placement);
      },
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
     * Displaces the content box from its anchor element
     * by the specified number of pixels.
     * @see https://atomiks.github.io/tippyjs/v6/all-props/#offset"
     */
    offset: {
      type: Array,
      default: () => [0, 16],
    },

    /**
   * The id of the tooltip
   */
    id: {
      type: String,
      default () { return getUniqueString(); },
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
     * Additional class name for the content wrapper element.
     */
    contentClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
   * Sets the element to which the popover is going to append to.
   * 'body' will append to the nearest body (supports shadow DOM).
   * @values 'body', 'parent', HTMLElement,
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
     * The enter delay in milliseconds before the hovercard is shown.
     * @type number
     */
    enterDelay: {
      type: Number,
      default: TOOLTIP_DELAY_MS,
    },

    /**
     * The leave delay in milliseconds before the hovercard is hidden.
     * @type number
     */
    leaveDelay: {
      type: Number,
      default: TOOLTIP_DELAY_MS,
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
  ],

  data () {
    return {
      hovercardOpen: this.open,
      anchorEl: null,
      observer: null,
      inTimer: null,
      outTimer: null,
      contentFocused: false,
      mouseOverHovercard: false,
    };
  },

  watch: {
    open: {
      handler: function (open) {
        this.hovercardOpen = open;
      },

      immediate: true,
    },
  },

  mounted () {
    this.$nextTick(() => {
      this.anchorEl = this.$refs.popover?.$refs?.anchor?.firstElementChild;

      this.observer = new MutationObserver(() => {
        if (this.anchorEl && !this.anchorEl.isConnected) {
          // If the anchor element is removed from the DOM, close the hovercard
          this.hovercardOpen = false;
        }
      });

      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  },

  beforeDestroy () {
    if (this.observer) {
      this.observer.disconnect();
    }

    clearTimeout(this.inTimer);
    clearTimeout(this.outTimer);
  },

  methods: {
    setInTimer () {
      this.inTimer = setTimeout(() => {
        this.hovercardOpen = true;
      }, this.enterDelay);
    },

    setOutTimer () {
      this.outTimer = setTimeout(() => {
        this.hovercardOpen = false;
      }, this.leaveDelay);
    },

    onMouseEnter () {
      this.mouseOverHovercard = true;
      if (this.open === null) {
        clearTimeout(this.outTimer);
        this.setInTimer();
      }
    },

    onMouseLeave () {
      this.mouseOverHovercard = false;
      if (this.contentFocused) {
        return;
      }
      if (this.open === null) {
        clearTimeout(this.inTimer);
        this.setOutTimer();
      }
    },

    onContentFocusIn () {
      this.contentFocused = true;
    },

    onContentFocusOut () {
      this.contentFocused = false;

      // If mouse is not over the hovercard, close it
      if (!this.mouseOverHovercard && this.open === null) {
        clearTimeout(this.inTimer);
        this.setOutTimer();
      }
    },
  },
};
</script>
