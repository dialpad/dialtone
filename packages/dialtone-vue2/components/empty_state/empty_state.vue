<template>
  <dt-stack
    :class="emptyStateClasses"
  >
    <span
      v-if="showIllustration"
      class="d-empty-state__illustration"
    >
      <!-- @slot Slot for the illustration. Displays when size is 'lg' or 'md'. Overrides icon. -->
      <slot name="illustration" />
    </span>

    <span
      v-if="showIcon"
      class="d-empty-state__icon"
    >
      <!-- @slot Slot for the icon. Displayed if illustration is not provided. -->
      <slot
        name="icon"
        :icon-size="'800'"
      />
    </span>

    <dt-stack
      gap="450"
      :class="['d-empty-state__content', contentClass]"
    >
      <div :class="['d-empty-state__header-text', headlineClass]">
        {{ headerText }}
      </div>

      <p
        v-if="bodyText"
        :class="['d-empty-state__body-text', bodyClass]"
      >
        {{ bodyText }}
      </p>
    </dt-stack>

    <slot name="body" />
  </dt-stack>
</template>

<script>
import {
  EMPTY_STATE_BODY_SIZE_MODIFIERS,
  EMPTY_STATE_CONTENT_SIZE_MODIFIERS,
  EMPTY_STATE_HEADLINE_SIZE_MODIFIERS,
  EMPTY_STATE_SIZE_MODIFIERS,
} from './empty_state_constants.js';
import { DtStack } from '@/components/stack';

export default {
  name: 'DtEmptyState',

  components: {
    DtStack,
  },

  props: {
    /**
     * The empty state size.
     * @values 'sm', 'md', 'lg'
     */
    size: {
      type: String,
      default: 'lg',
      validator: (s) => Object.keys(EMPTY_STATE_SIZE_MODIFIERS).includes(s),
    },

    /**
     * Header text
     * @type {String}
     */
    headerText: {
      type: String,
      required: true,
    },

    /**
     * Body text
     * @type {String}
     */
    bodyText: {
      type: String,
      default: null,
    },
  },

  computed: {
    hasIcon () {
      return this.$scopedSlots.icon && this.$scopedSlots.icon();
    },

    hasIllustration () {
      return this.$scopedSlots.illustration && this.$scopedSlots.illustration();
    },

    isSmallSize () {
      return this.size === 'sm';
    },

    /**
     * Icon will be shown in lg and md size only if illustration is not provided
     * Icon will always be shown in sm size
     */
    showIcon () {
      return this.hasIcon && (!this.hasIllustration || this.isSmallSize);
    },

    /**
     * Illustration will always be shown in lg and md size
     * Illustration will not be shown in sm size
     */
    showIllustration () {
      return this.hasIllustration && !this.isSmallSize;
    },

    sizeClass () {
      return EMPTY_STATE_SIZE_MODIFIERS[this.size];
    },

    emptyStateClasses () {
      return ['d-empty-state', this.sizeClass];
    },

    contentClass () {
      return EMPTY_STATE_CONTENT_SIZE_MODIFIERS[this.size];
    },

    headlineClass () {
      return EMPTY_STATE_HEADLINE_SIZE_MODIFIERS[this.size];
    },

    bodyClass () {
      return EMPTY_STATE_BODY_SIZE_MODIFIERS[this.size];
    },
  },

  mounted () {
    if (!this.bodyText && !this.$slots.body) {
      console.error('DtEmptyState: You should provide either bodyText or content on body slot.');
    }
  },
};
</script>
