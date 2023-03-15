<template>
  <dt-tooltip
    :id="id"
    :offset="[0, -12]"
  >
    <template #anchor>
      <dt-button
        :importance="circle ? 'outlined' : 'clear'"
        kind="muted"
        icon-position="top"
        :disabled="disabled"
        :aria-label="ariaLabel"
        :label-class="callbarButtonTextClass"
        :width="buttonWidth"
        :class="callbarButtonClass"
        v-on="$listeners"
      >
        <slot />
        <slot
          slot="icon"
          name="icon"
        />
      </dt-button>
    </template>
    <slot name="tooltip" />
  </dt-tooltip>
</template>

<script>
import DtButton from '@/components/button/button';
import DtTooltip from '@/components/tooltip/tooltip';
import utils from '@/common/utils';

export const VALID_WIDTH_SIZE = ['sm', 'md', 'lg', 'xl'];

export default {
  name: 'DtRecipeCallbarButton',

  components: { DtButton, DtTooltip },

  inheritAttrs: true,

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
     * @see https://dialpad.design/components/button/
     */
    active: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines whether the button should have danger styling
     * default is false.
     * @values true, false
     * @see https://dialpad.design/components/button/
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
     * @see https://dialpad.design/components/button/
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
      validator: size => VALID_WIDTH_SIZE.includes(size),
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
        'dt-recipe-callbar-button',
        'd-px0',
        'd-fc-black-900',
        {
          'dt-recipe-callbar-button--circle': this.circle,
          'dt-recipe-callbar-button--active': this.active,
          'dt-recipe-callbar-button--danger': this.danger,
        }];
    },

    callbarButtonTextClass () {
      return [
        'd-fs-100 lg:d-d-none md:d-d-none sm:d-d-none',
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
  },
};
</script>

<style lang="less">
.dt-recipe-callbar-button:not(.dt-recipe-callbar-button--circle) {
  line-height: var(--lh-300);
}

.dt-recipe-callbar-button--circle {
  border-radius: var(--br-circle);
}

.dt-recipe-callbar-button.d-btn[disabled] {
  background-color: unset;
}

.dt-recipe-callbar-button--circle.d-btn[disabled] {
  border-color: unset;
}

.dt-recipe-callbar-button--active,
.dt-recipe-callbar-button--active:hover {
  .base-button__icon {
    color: var(--primary-color);
  }
}
</style>
