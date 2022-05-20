<template>
  <div data-qa="dt-tooltip-container">
    <div
      ref="anchor"
      data-qa="dt-tooltip-anchor"
      @focusin="onEnterAnchor"
      @focusout="onLeaveAnchor"
      @mouseenter="onEnterAnchor"
      @mouseleave="onLeaveAnchor"
      @keydown.esc="onLeaveAnchor"
    >
      <slot
        name="anchor"
      />
    </div>
    <dt-lazy-show
      :id="id"
      ref="content"
      :show="isShown && (!!message.trim() || !!$slots.default)"
      role="tooltip"
      aria-hidden="false"
      data-qa="dt-tooltip"
      appear
      :transition="transition"
      :class="[
        'd-tooltip',
        `d-tooltip__arrow-tippy--${currentPlacement}`,
        {
          [ TOOLTIP_KIND_MODIFIERS.inverted ]: inverted,
        },
        contentClass,
      ]"
      @after-leave="onLeaveTransitionComplete"
      @after-enter="onEnterTransitionComplete"
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
  TOOLTIP_DIRECTIONS,
} from './tooltip_constants';
import { getUniqueString } from '@/common/utils';
import DtLazyShow from '../lazy_show/lazy_show';
import {
  createTippy,
  getAnchor,
  getPopperOptions,
} from '../popover/tippy_utils';
export default {
  // eslint-disable-next-line vue/multi-word-component-names
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
     * If the popover does not fit in the direction described by "placement",
     * it will attempt to change it's direction to the "fallbackPlacements"
     * if defined, otherwise it will automatically position to a new location
     * as it sees best fit.
     * */
    fallbackPlacements: {
      type: Array,
      default: () => ['auto'],
    },

    /**
     * Add inverted class
     */
    inverted: {
      type: Boolean,
      default: false,
    },

    /**
     *  Displaces the tooltip from its reference element
     *  by the specified number of pixels.
     */
    offset: {
      type: Array,
      default: () => [0, 0],
    },

    /**
     * The direction the popover displays relative to the anchor.
     */
    placement: {
      type: String,
      default: 'top',
      validator (placement) {
        return TOOLTIP_DIRECTIONS.includes(placement);
      },
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
     * A provided message for the tooltip content
     */
    message: {
      type: String,
      default: '',
    },

    /**
     * Controls whether the tooltip is shown. Leaving this null will have the tooltip trigger on mouseover by default.
     * If you set this value, the default mouseover behavior will be disabled and you can control it as you need.
     * Supports .sync modifier
     */
    show: {
      type: Boolean,
      default: null,
    },

    /**
     * Named transition when the content display is toggled.
     * @see DtLazyShow
     */
    transition: {
      type: String,
      default: 'fade',
    },
  },

  emits: ['update:show', 'shown'],

  data () {
    return {
      TOOLTIP_KIND_MODIFIERS,
      tip: null,

      // Internal state for whether the tooltip is shown. Changing the prop
      // will update this.
      isShown: false,

      // this is where the placement currently is, this can be different than
      // the placement prop when there is not enough available room for the tip
      // to display and it uses a fallback placement.
      currentPlacement: this.placement,
    };
  },

  computed: {
    tippyProps () {
      return {
        offset: this.offset,
        appendTo: document.body,
        interactive: false,
        trigger: 'manual',
        placement: this.placement,
        popperOptions: getPopperOptions({
          fallbackPlacements: this.fallbackPlacements,
          hasHideModifierEnabled: true,
          onChangePlacement: this.onChangePlacement,
        }),
      };
    },
  },

  watch: {

    tippyProps: {
      handler: 'setProps',
      deep: true,
    },

    show: {
      handler: function (show) {
        if (show !== null) {
          this.isShown = show;
        }
      },

      immediate: true,
    },

    isShown (isShown, isPrev) {
      if (isShown) {
        this.setProps();
        this.tip.show();
      } else {
        this.tip.hide();
      }
    },
  },

  mounted () {
    this.tip = createTippy(getAnchor(this.$refs.anchor), this.initOptions());

    // immediate watcher fires before mounted, so have this here in case
    // show prop was initially set to true.
    if (this.isShown) {
      this.tip.show();
    }
  },

  beforeUnmount () {
    if (this.tip) {
      this.tip?.destroy();
    }
  },

  methods: {
    calculateAnchorZindex () {
      // if a modal is currently active render at modal-element z-index, otherwise at tooltip z-index
      if (document.querySelector('.d-modal[aria-hidden="false"], .d-modal--transparent[aria-hidden="false"]')) {
        return 651;
      } else {
        return 400;
      }
    },

    hasVisibleFocus () {
      return getAnchor(this.$refs.anchor).hasAttribute('data-focus-visible-added');
    },

    onEnterAnchor (e) {
      if (e.type === 'focusin') {
        // only show tooltips on visible focus when triggered via focus.
        // when the user is using the mouse they only want tooltips to display
        // on mouseover.
        //
        // Example: anchor of a popover is a button with tooltip.
        // closing it with the mouse would trigger the tooltip to display as
        // the anchor is focused on close. Not what we want.
        if (this.show === null && this.hasVisibleFocus()) {
          this.isShown = true;
        }
      } else {
        if (this.show === null) this.isShown = true;
      }
    },

    onLeaveAnchor (e) {
      if (this.show === null) this.isShown = false;
    },

    onChangePlacement (placement) {
      this.currentPlacement = placement;
    },

    onLeaveTransitionComplete () {
      this.tip?.unmount();
      this.$emit('shown', false);
      if (this.show !== null) {
        this.$emit('update:show', false);
      }
    },

    onEnterTransitionComplete () {
      this.$emit('shown', true);
      if (this.show !== null) {
        this.$emit('update:show', true);
      }
    },

    setProps () {
      if (this.tip && this.tip.setProps) {
        this.tip.setProps({
          ...this.tippyProps,
          zIndex: this.calculateAnchorZindex(),
        });
      }
    },

    onMount () {
      this.setProps();
    },

    initOptions () {
      return {
        contentElement: this.$refs.content.$el,
        allowHTML: true,
        zIndex: this.calculateAnchorZindex(),
        onMount: this.onMount,
        ...this.tippyProps,
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
