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
        label-class="d-fs-100"
        width="8.4rem"
        :class="callbarButtonClass"
      >
        <slot />
        <template #icon>
          <slot name="icon" />
        </template>
      </dt-button>
    </template>
    <slot name="tooltip" />
  </dt-tooltip>
</template>

<script>
import DtButton from '@/components/button/button';
import DtTooltip from '@/components/tooltip/tooltip';
import utils from '@/common/utils';

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
  },

  computed: {
    callbarButtonClass () {
      return [
        this.buttonClass,
        'dt-recipe-callbar-button',
        'd-px0',
        {
          'dt-recipe-callbar-button--circle': this.circle,
          'd-btn--icon-only': this.circle,
          'dt-recipe-callbar-button--active': this.active,
          'dt-recipe-callbar-button--danger': this.danger,
        }];
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

.dt-recipe-callbar-button--circle.d-btn--icon-only .d-btn__label {
  display: none;
}

.dt-recipe-callbar-button--active,
.dt-recipe-callbar-button--active:hover {
  .base-button__icon {
    color: var(--primary-color);
  }
}
</style>
