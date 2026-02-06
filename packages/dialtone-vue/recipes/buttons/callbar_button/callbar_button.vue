<template>
  <dt-tooltip
    :id="id"
    :inverted="invertedTooltip"
    v-bind="addClassStyleAttrs($attrs)"
    :delay="tooltipDelay"
    :show="showTooltip"
    :offset="[0, 24]"
  >
    <template #anchor>
      <span
        :class="{ 'd-recipe-callbar-button--disabled': disabled }"
      >
        <dt-button
          :importance="buttonImportance"
          kind="muted"
          icon-position="top"
          :aria-disabled="disabled"
          :aria-label="ariaLabel"
          :label-class="callbarButtonTextClass"
          :width="buttonWidth"
          :class="callbarButtonClass"
          v-bind="removeClassStyleAttrs($attrs)"
          v-on="callbarButtonListeners"
        >
          <slot />
          <template #icon>
            <slot name="icon" />
          </template>
        </dt-button>
      </span>
    </template>
    <slot name="tooltip">
      {{ tooltipText }}
    </slot>
  </dt-tooltip>
</template>

<script>
import { CALLBAR_BUTTON_VALID_WIDTH_SIZE } from './callbar_button_constants';
import { DtButton } from '@/components/button';
import { DtTooltip } from '@/components/tooltip';
import utils, { extractVueListeners, removeClassStyleAttrs, addClassStyleAttrs } from '@/common/utils';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtRecipeCallbarButton',

  components: { DtButton, DtTooltip },

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
     * Determines whether the button should be disabled
     * default is false.
     * @values true, false
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether the button is a circle or not.
     * @values true, false
     * @see https://dialtone.dialpad.com/components/button/
     */
    circle: {
      type: Boolean,
      default: false,
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
     * The fill and outline of the button associated with its visual importance.
     * @values clear, outlined, primary
     */
    importance: {
      type: String,
      default: '',
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
     * Native click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',
  ],

  computed: {
    callbarButtonClass () {
      return [
        this.buttonClass,
        'd-recipe-callbar-button',
        {
          'd-recipe-callbar-button--circle': this.circle,
          'd-recipe-callbar-button--active': this.active,
          'd-recipe-callbar-button--danger': this.danger,
          'd-btn--disabled': this.disabled,
        }];
    },

    callbarButtonTextClass () {
      return [
        'd-recipe-callbar-button__text',
        this.textClass,
      ];
    },

    buttonWidth () {
      switch (this.buttonWidthSize) {
        case 'sm':
          return '4.5rem';
        case 'md':
          return '6rem';
        default:
          return '8.4rem';
      }
    },

    buttonImportance () {
      if (this.importance) {
        return this.importance;
      }
      return this.circle ? 'outlined' : 'clear';
    },

    callbarButtonListeners () {
      return {
        ...extractVueListeners(this.$attrs),
        click: (event) => this.$emit('click', event),
      };
    },
  },

  methods: {
    removeClassStyleAttrs,
    addClassStyleAttrs,
  },
};
</script>
