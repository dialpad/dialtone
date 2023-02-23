<template>
  <div data-qa="dt-tooltip-container">
    <a
      ref="anchor"
      role="presentation"
      data-qa="dt-tooltip-anchor"
      @focusin="onEnterAnchor"
      @focusout="onLeaveAnchor"
      @mouseenter="onEnterAnchor"
      @mouseleave="onLeaveAnchor"
      @keydown.esc="onLeaveAnchor"
    >
      <!-- @slot Slot for the anchor element -->
      <slot
        name="anchor"
      />
    </a>
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
      v-on="tooltipListeners"
    >
      <!-- In case when transitionend event doesn't work correct (for ex. tooltip component with custom trigger) -->
      <!-- after-leave event can be used instead of transitionend -->
      <!-- @slot Slot for the content, defaults to message prop -->
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
  TOOLTIP_STICKY_VALUES,
} from './tooltip_constants';
import { getUniqueString } from '@/common/utils';
import DtLazyShow from '../lazy_show/lazy_show';
import {
  createTippy,
  getAnchor,
  getPopperOptions,
} from '../popover/tippy_utils';

/**
 * A tooltip is a floating label that briefly explains an action, function, or an element.
 * Its content is exclusively text and shouldn't be vital information for users.
 * If richer media is desired, consider using a popover instead.
 * @see https://dialpad.design/components/tooltip.html
 */
export default {
  name: 'DtTooltip',
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
     * See <a href="https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements" target="_blank">Popper.js docs</a>
     * */
    fallbackPlacements: {
      type: Array,
      default: () => ['auto'],
    },

    /**
     * If true, applies inverted styles to the tooltip
     * @values true, false
     */
    inverted: {
      type: Boolean,
      default: false,
    },

    /**
     *  Displaces the tooltip from its reference element
     *  by the specified number of pixels. See
     *  <a href="https://atomiks.github.io/tippyjs/v6/all-props/#offset" target="_blank">Tippy.js docs</a>
     */
    offset: {
      type: Array,
      default: () => [0, -4],
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
      default: 'top',
      validator (placement) {
        return TOOLTIP_DIRECTIONS.includes(placement);
      },
    },

    /**
     * If the tooltip sticks to the anchor. This is usually not needed, but can be needed
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
        return TOOLTIP_STICKY_VALUES.includes(sticky);
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
     * @values true, false
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

  emits: [
    /**
     * Emitted when tooltip is shown or hidden
     *
     * @event shown
     * @type {Boolean}
     */
    'shown',

    /**
     * Sync show value
     *
     * @event update:show
     */
    'update:show',
  ],

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
    tooltipListeners () {
      return {
        ...this.$listeners,

        'after-leave': () => {
          this.onLeaveTransitionComplete();
        },

        'after-enter': () => {
          this.onEnterTransitionComplete();
        },
      };
    },

    tippyProps () {
      return {
        offset: this.offset,
        appendTo: this.anchorEl?.getRootNode()?.querySelector('body'),
        interactive: false,
        trigger: 'manual',
        placement: this.placement,
        sticky: this.sticky,
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

    isShown (isShown) {
      if (isShown) {
        this.setProps();
        this.tip.show();
      } else {
        this.tip.hide();
      }
    },

    sticky (sticky) {
      this.tip.setProps({
        sticky,
      });
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

  beforeDestroy () {
    if (this.tip) {
      this.tip?.destroy();
    }
  },

  methods: {
    calculateAnchorZindex () {
      // if a modal is currently active render at modal-element z-index, otherwise at tooltip z-index
      if (this.$el.getRootNode()
        .querySelector('.d-modal[aria-hidden="false"], .d-modal--transparent[aria-hidden="false"]') ||
        // Special case because we don't have any dialtone drawer component yet. Render at 651 when
        // anchor of popover is within a drawer.
        this.$el.closest('.d-zi-drawer')) {
        return 651;
      } else {
        return 400;
      }
    },

    hasVisibleFocus () {
      return getAnchor(this.$refs.anchor).matches(':focus-visible');
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

    onLeaveAnchor () {
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
