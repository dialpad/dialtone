<template>
  <dt-button
    :id="id"
    v-dt-tooltip="tooltipText"
    data-qa="dt-split-button-omega"
    :active="active"
    :aria-label="ariaLabel"
    :class="`d-split-btn__omega d-split-btn__omega--${size}`"
    :disabled="disabled"
    :importance="importance"
    :kind="kind"
    :size="size"
  >
    <template #icon>
      <slot
        name="icon"
        :size="SPLIT_BUTTON_ICON_SIZES[size]"
      >
        <dt-icon-chevron-down :size="SPLIT_BUTTON_ICON_SIZES[size]" />
      </slot>
    </template>
  </dt-button>
</template>

<script>
import { SPLIT_BUTTON_ICON_SIZES } from './split_button_constants';
import { DtButton } from '@/components/button';
import { DtIconChevronDown } from '@dialpad/dialtone-icons/vue3';
import { getUniqueString } from '@/common/utils';

export default {
  name: 'SplitButtonOmega',
  components: {
    DtButton,
    DtIconChevronDown,
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
     * HTML button disabled attribute
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Element ID, useful in case you need to reference the button
     * as an external anchor for popover
     */
    id: {
      type: String,
      default: getUniqueString(),
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

    /**
     * Text shown in tooltip when you hover the button
     */
    tooltipText: {
      type: String,
      default: '',
    },
  },

  data () {
    return {
      SPLIT_BUTTON_ICON_SIZES,
    };
  },
};
</script>
