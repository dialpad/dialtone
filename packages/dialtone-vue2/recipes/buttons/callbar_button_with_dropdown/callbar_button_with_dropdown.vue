<template>
  <div
    class="dt-recipe--callbar-button-with-dropdown"
  >
    <dt-recipe-callbar-button
      :aria-label="ariaLabel"
      :disabled="disabled"
      :active="active"
      :danger="danger"
      :button-class="buttonClass"
      :button-width-size="buttonWidthSize"
      :text-class="textClass"
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
      :open="open"
      :placement="placement"
      :fallback-placements="fallbackPlacements"
      padding="none"
      class="dt-recipe--callbar-button-with-dropdown--dropdown-wrapper"
      v-bind="$attrs"
      @opened="onModalIsOpened"
    >
      <template #anchor>
        <dt-button
          circle
          importance="clear"
          size="lg"
          :class="['dt-recipe--callbar-button-with-dropdown--arrow',
                   { 'dt-recipe--callbar-button-with-dropdown--arrow--large': !isCompactMode }]"
          width="2rem"
          :aria-label="arrowButtonLabel"
          :active="open"
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
      <template #list>
        <slot name="list" />
      </template>
    </dt-dropdown>
  </div>
</template>

<script>
import { DtButton } from '@/components/button';
import { DtDropdown } from '@/components/dropdown';
import { DtIconChevronUp } from '@dialpad/dialtone-icons/vue2';
import { DtRecipeCallbarButton, CALLBAR_BUTTON_VALID_WIDTH_SIZE } from '../callbar_button';
import utils, { warnIfUnmounted } from '@/common/utils';

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
    };
  },

  computed: {
    showArrowButton () {
      return this.forceShowArrow || !this.disabled;
    },

    isCompactMode () {
      return this.buttonWidthSize === 'sm' || this.buttonWidthSize === 'md';
    },

    showDropdown () {
      if (!this.openDropdown || this.open) {
        this.syncOpenState();
        return false;
      }

      return this.toggleOpen();
    },
  },

  mounted () {
    warnIfUnmounted(this.$el, this.$options.name);
  },

  methods: {
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
      if (!this.$listeners.click) {
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
