<template>
  <dt-button
    v-dt-tooltip="tooltipText"
    data-qa="dt-split-button-alpha"
    :active="active"
    :aria-label="ariaLabel"
    :assertive-on-focus="assertiveOnFocus"
    :class="`d-split-btn__alpha d-split-btn__alpha--${size}`"
    :disabled="disabled"
    :icon-position="iconPosition"
    :importance="importance"
    :kind="kind"
    :label-class="labelClass"
    :loading="loading"
    :size="size"
  >
    <template #icon>
      <slot
        name="icon"
        :size="BUTTON_ICON_SIZES[size]"
      />
    </template>
    <slot name="default" />
  </dt-button>
</template>

<script>
import { BUTTON_ICON_SIZES, DtButton } from '@/components/button';

export default {
  name: 'SplitButtonAlpha',

  components: {
    DtButton,
  },

  props: {
    /**
     * Determines whether the button should have active styling
     */
    active: {
      type: Boolean,
      default: false,
    },

    /**
     * Descriptive label for the button
     */
    ariaLabel: {
      type: String,
      default: null,
    },

    /**
     * The position of the icon slot within the button.
     */
    iconPosition: {
      type: String,
      default: 'left',
    },

    /**
     * Used to customize the label container
     */
    labelClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Whether the button should display a loading animation or not.
     */
    loading: {
      type: Boolean,
      default: false,
    },

    /**
     * Text shown in tooltip when you hover the button
     */
    tooltipText: {
      type: String,
      default: '',
    },

    /**
     * Determines whether a screenreader reads live updates of
     * the button content to the user while the button is in focus.
     */
    assertiveOnFocus: {
      type: Boolean,
      default: false,
    },

    /**
     * HTML button disabled attribute
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * The fill and outline of the button associated with its visual importance.
     */
    importance: {
      type: String,
      default: 'primary',
    },

    /**
     * The color of the button.
     */
    kind: {
      type: String,
      default: 'default',
    },

    /**
     * The size of the button.
     */
    size: {
      type: String,
      default: 'md',
    },
  },

  data () {
    return {
      BUTTON_ICON_SIZES,
    };
  },
};
</script>
