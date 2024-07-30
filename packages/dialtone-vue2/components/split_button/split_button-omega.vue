<template>
  <dt-button
    :id="id"
    v-dt-tooltip="tooltipText"
    data-qa="dt-split-button-omega"
    :size="size"
    :active="active"
    :aria-label="ariaLabel"
    :disabled="disabled"
    :importance="importance"
    :kind="kind"
    :class="`d-split-btn__omega d-split-btn__omega--${size}`"
    @click="(e) => $emit('click', e)"
  >
    <template #icon>
      <slot name="icon">
        <dt-icon-chevron-down :size="SPLIT_BUTTON_ICON_SIZES[size]" />
      </slot>
    </template>
  </dt-button>
</template>

<script>
import { SPLIT_BUTTON_ICON_SIZES } from './split_button_constants';
import { DtButton } from '@/components/button';
import { DtIconChevronDown } from '@dialpad/dialtone-icons/vue2';
import { getUniqueString } from '@/common/utils';

export default {
  name: 'SplitButtonOmega',
  components: {
    DtButton,
    DtIconChevronDown,
  },

  props: {
    /**
     * Element ID, useful in case you need to reference the button
     * as an external anchor for popover
     */
    id: {
      type: String,
      default: getUniqueString(),
    },

    /**
     * Text shown in tooltip when you hover the button
     */
    tooltipText: {
      type: String,
      default: '',
    },

    /**
     * HTML button disabled attribute
     * <a
     *   class="d-link"
     *   href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#disabled"
     *   target="_blank"
     * >
     *   (Reference)
     * </a>
     * @values true, false
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * The fill and outline of the button associated with its visual importance.
     * @values clear, outlined, primary
     */
    importance: {
      type: String,
      default: 'primary',
    },

    /**
     * The color of the button.
     * @values default, muted, danger, inverted
     */
    kind: {
      type: String,
      default: 'default',
    },

    /**
     * Determines whether the button should have active styling
     * default is false.
     * @values true, false
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
     * The size of the button.
     * @values xs, sm, md, lg, xl
     */
    size: {
      type: String,
      default: 'md',
    },
  },

  data () {
    return {
      SPLIT_BUTTON_ICON_SIZES,
    };
  },
};
</script>
