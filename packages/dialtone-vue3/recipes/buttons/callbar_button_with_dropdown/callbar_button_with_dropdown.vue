<template>
  <div
    class="dt-recipe--callbar-button-with-dropdown"
    v-bind="addClassStyleAttrs($attrs)"
  >
    <dt-recipe-callbar-button
      :active="active"
      :aria-label="ariaLabel"
      :button-class="buttonClass"
      :button-width-size="buttonWidthSize"
      :danger="danger"
      :disabled="disabled"
      :inverted-tooltip="invertedTooltip"
      :show-tooltip="showTooltip"
      :text-class="textClass"
      :tooltip-delay="tooltipDelay"
      :tooltip-text="tooltipText"
      class="dt-recipe--callbar-button-with-dropdown--main-button"
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
    <dt-dropdown
      v-if="showArrowButton"
      :id="id"
      :fallback-placements="fallbackPlacements"
      :open="open"
      :modal="false"
      :placement="placement"
      class="dt-recipe--callbar-button-with-dropdown--dropdown-wrapper"
      padding="none"
      v-bind="removeClassStyleAttrs($attrs)"
      @opened="onModalIsOpened"
    >
      <template #anchor>
        <dt-button
          :active="open"
          :class="['dt-recipe--callbar-button-with-dropdown--arrow',
                   { 'dt-recipe--callbar-button-with-dropdown--arrow--large': !isCompactMode }]"
          :circle="true"
          importance="clear"
          size="lg"
          :aria-label="arrowButtonLabel"
          :title="arrowButtonLabel"
          width="2rem"
          @click="arrowClick"
        >
          <template #icon>
            <dt-icon-chevron-up
              class="dt-recipe--callbar-button-with-dropdown--arrow__icon"
              size="200"
            />
          </template>
        </dt-button>
      </template>
      <template #list="{ close }">
        <slot
          :close="close"
          name="list"
        />
      </template>
    </dt-dropdown>
  </div>
</template>

<script>
import { DtButton } from '@/components/button';
import { DtDropdown } from '@/components/dropdown';
import { DtIconChevronUp } from '@dialpad/dialtone-icons/vue3';
import { DtRecipeCallbarButton, CALLBAR_BUTTON_VALID_WIDTH_SIZE } from '../callbar_button';
import utils, { warnIfUnmounted, removeClassStyleAttrs, addClassStyleAttrs, returnFirstEl } from '@/common/utils';
import { DialtoneLocalization } from '@/localization';

export default {
  name: 'DtRecipeCallbarButtonWithDropdown',

  components: { DtRecipeCallbarButton, DtDropdown, DtButton, DtIconChevronUp },

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
     * The direction the dropdown displays relative to the anchor.
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
     * If the dropdown does not fit in the direction described by "placement",
     * it will attempt to change it's direction to the "fallbackPlacements".
     *
     * @values top, top-start, top-end,
     * right, right-start, right-end,
     * left, left-start, left-end,
     * bottom, bottom-start, bottom-end,
     * auto, auto-start, auto-end
     * */
    fallbackPlacements: {
      type: Array,
      default: () => {
        return ['auto'];
      },
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
     * Emitted when modal dropdown is opened or closed.
     */
    'opened',
  ],

  data () {
    return {
      open: false,
      i18n: new DialtoneLocalization(),
    };
  },

  computed: {
    showArrowButton () {
      return this.forceShowArrow || !this.disabled;
    },

    isCompactMode () {
      return this.buttonWidthSize === 'sm' || this.buttonWidthSize === 'md';
    },

    arrowButtonLabel () {
      return this.i18n.$t('DIALTONE_CALLBAR_BUTTON_WITH_DROPDOWN_ARROW_BUTTON_ARIA_LABEL');
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
      this.open = this.openDropdown;
    },

    buttonClick (ev) {
      // If no listener for the click event, the button click opens the dropdown
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
