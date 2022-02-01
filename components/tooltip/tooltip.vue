<template>
  <div data-qa="dt-tooltip-container">
    <div
      ref="anchor"
      data-qa="dt-tooltip-anchor"
    >
      <slot
        name="anchor"
        :attrs="{
          'aria-describedby': id,
        }"
      />
    </div>
    <dt-lazy-show
      :id="id"
      ref="content"
      :show="showTooltip"
      role="tooltip"
      aria-hidden="false"
      data-qa="dt-tooltip"
      appear
      :transition="transition"
      :class="[
        'd-tooltip',
        `d-tooltip__arrow-tippy--${placement}`,
        {
          [ TOOLTIP_KIND_MODIFIERS.inverted ]: inverted,
        },
        contentClass,
      ]"
      @after-leave="onLeave"
    >
      <!-- In case when transitionend event doesn't work correct (for ex. tooltip component with custom trigger) -->
      <!-- after-leave event can be used instead of transitionend -->
      <slot>
        {{ message }}
      </slot>
    </dt-lazy-show>
  </div>
</template>

<script>
import {
  TOOLTIP_KIND_MODIFIERS,
  TOOLTIP_HIDE_ON_CLICK_VARIANTS, TOOLTIP_DIRECTIONS,
} from './tooltip_constants';
import { getUniqueString } from '../utils';
import DtLazyShow from '../lazy_show/lazy_show';
import {
  createTippy,
  getAnchor,
  getPopperOptions,
} from '../popover/tippy_utils';
export default {
  name: 'Tooltip',
  components: {
    DtLazyShow,
  },

  props: {
    /**
     * The id of the tooltip
     */
    id: {
      type: String,
      default () { return getUniqueString(); },
    },

    /**
     * This property is needed for define fallback placements
     * by providing a list of placements to try.
     * */
    flip: {
      type: Array,
      default: () => ['right', 'bottom'],
    },

    /**
     * Add inverted class
     */
    inverted: {
      type: Boolean,
      default: false,
    },

    /**
     *  Displaces the tippy from its reference element
     *  in pixels (skidding and distance).
     *  https://atomiks.github.io/tippyjs/v6/all-props/#offset
     */
    offset: {
      type: Array,
      default: () => [0, 0],
    },

    /**
     * Describes the preferred placement of the tooltip
     */
    arrowDirection: {
      type: String,
      default: 'top',
      validator (arrowDirection) {
        return TOOLTIP_DIRECTIONS.includes(arrowDirection);
      },

    },

    /**
     * The element to append the tippy to.
     * https://atomiks.github.io/tippyjs/v6/all-props/#appendto
     */
    appendTo: {
      type: [String, HTMLElement],
      default: () => document.body,
    },

    /**
     * Determines if the tippy has interactive content inside of it,
     * so that it can be hovered over and clicked inside without hiding.
     * https://atomiks.github.io/tippyjs/v6/all-props/#interactive
     */
    interactive: {
      type: Boolean,
      default: false,
    },

    /**
     * Additional css classes for the tooltip content element.
     * Can accept all of String, Object, and Array, i.e. has the
     * same api as Vue's built-in handling of the class attribute.
     */
    contentClass: {
      type: [String, Object, Array],
      default: '',
    },

    /**
     * This describes the area that the element
     * will be checked for overflow relative to.
     * Flip modifier - https://popper.js.org/docs/v2/modifiers/flip/
     * Boundary option - https://popper.js.org/docs/v2/utils/detect-overflow/#boundary
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
     * tippy in px that will prevent it from hiding if the cursor left it.
     * https://atomiks.github.io/tippyjs/v6/all-props/#interactiveborder
     * */
    interactiveBorder: {
      type: Number,
      default: 2,
    },

    /**
     * A provided message for the tooltip content
     */
    message: {
      type: String,
      default: '',
    },

    /**
     * Determines the events that cause the tippy to show.
     * Multiple event names are separated by spaces.
     * https://atomiks.github.io/tippyjs/v6/all-props/#trigger
     * **/
    trigger: {
      type: String,
      default: 'mouseenter focus',
    },

    /**
     * https://atomiks.github.io/tippyjs/v6/all-props/#hideonclick
     * */
    hideOnClick: {
      type: [Boolean, String],
      default: false,
      validator (value) {
        return TOOLTIP_HIDE_ON_CLICK_VARIANTS.some(variant => variant === value);
      },
    },

    /**
     * Whether the tooltip should be shown.
     */
    show: {
      type: Boolean,
      default: false,
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
     * This property is needed for focus event
     */
    tabIndex: {
      type: String,
      default: '0',
    },

    zIndex: {
      type: [Number, String],
      default: 400,
      validator: zIndex => !!Number(zIndex),
    },
  },

  emits: ['update:show'],

  data () {
    return {
      TOOLTIP_KIND_MODIFIERS,
      tip: null,
      placement: 'auto',
      showTooltip: false,
      isPreventHideTooltip: false,
    };
  },

  computed: {
    tippyProps () {
      return {
        offset: this.offset,
        interactiveBorder: this.interactiveBorder,
        appendTo: this.appendTo,
        interactive: this.interactive,
        trigger: this.trigger,
        popperOptions: getPopperOptions({
          boundary: this.flipBoundary,
          flip: this.flip,
          hasHideModifierEnabled: true,
          onChangePlacement: (placement) => {
            this.placement = placement;
          },
        }),

        hideOnClick: this.hideOnClick,
      };
    },
  },

  watch: {
    tippyProps: {
      handler: 'setProps',
      deep: true,
    },

    arrowDirection: 'setProps',

    show: 'updateShow',

    hideOnClick: 'setProps',

    trigger: 'setProps',
  },

  mounted () {
    this.placement = this.arrowDirection;
    this.tip = createTippy(getAnchor(this.$refs.anchor, this.tabIndex), this.initOptions());
    this.updateShow();
  },

  beforeDestroy () {
    if (this.tip) {
      this.tip.destroy();
    }
  },

  methods: {
    async onLeave () {
      this.isPreventHideTooltip = true;
      this.tip?.unmount();
      this.$emit('update:show', false);
    },

    updateShow () {
      if (this.show) {
        this.showTooltip = this.show;
        this.setProps();
        this.tip.show();
      } else if (this.showTooltip) {
        this.showTooltip = false;
      }
    },

    setProps () {
      this.placement = this.arrowDirection;
      if (this.tip && this.tip.setProps) {
        this.tip.setProps({
          ...this.tippyProps,
          placement: this.placement,
          hideOnClick: this.hideOnClick,
          trigger: this.trigger,
        });
      }
    },

    onMount () {
      this.isPreventHideTooltip = false;
      this.showTooltip = true;
      this.setProps();
    },

    onHide () {
      this.showTooltip = false;
      /**
       *  https://atomiks.github.io/tippyjs/v6/all-props/#onhide
       *  return false from 'onHide' lifecycle to cancel a hide based on a condition.
       **/
      return this.isPreventHideTooltip;
    },

    initOptions () {
      return {
        contentElement: this.$refs.content.$el,
        allowHTML: true,
        placement: this.placement,
        zIndex: this.zIndex,
        onMount: this.onMount,
        onHide: this.onHide,
        ...this.tippyProps,
        onTrigger: (instance, { type }) => {
          if (!this.showTooltip && type !== 'click') {
            this.showTooltip = true;
          }
        },
      };
    },
  },
};
</script>

<style lang="less">
.tippy-box[data-popper-reference-hidden],
.tippy-box[data-popper-escaped] {
  .d-tooltip {
    visibility: hidden;
    pointer-events: none;
  }
}
</style>
