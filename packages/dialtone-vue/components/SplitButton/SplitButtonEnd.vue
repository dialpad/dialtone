<template>
  <dt-button
    :id="id"
    v-dt-tooltip="{ message: tooltipText, inverted: kind === 'inverted' }"
    data-qa="dt-split-button-end"
    :active="active"
    :aria-label="ariaLabel"
    :class="`d-split-btn__end d-split-btn__end--${size}`"
    :disabled="disabled"
    :importance="importance"
    :kind="kind"
    :size="size"
  >
    <template #icon>
      <slot
        name="icon"
        :size="SPLIT_BUTTON_ICON_SIZES[String(size)]"
      >
        <dt-icon-chevron-down :size="SPLIT_BUTTON_ICON_SIZES[String(size)]" />
      </slot>
    </template>
  </dt-button>
</template>

<script>
import { SPLIT_BUTTON_ICON_SIZES } from './SplitButtonConstants';
import { DtButton } from '@/components/Button';
import { DtIconChevronDown } from '@dialpad/dialtone-icons/vue';
import { getUniqueString } from '@/common/Utils';

export default {
  compatConfig: { MODE: 3 },
  name: 'SplitButtonEnd',
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
      type: [String, Number],
      default: 300,
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
