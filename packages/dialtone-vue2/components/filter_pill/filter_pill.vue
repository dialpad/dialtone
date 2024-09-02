<template>
  <dt-popover
    v-model="isPopoverOpen"
    class="d-filter-pill"
    data-qa="dt-filter-pill"
  >
    <template #anchor>
      <div class="d-filter-pill__wrapper">
        <dt-button
          data-qa="dt-filter-pill__button"
          icon-position="right"
          importance="outlined"
          kind="muted"
          :size="size"
          :aria-busy="loading"
          :aria-label="loading ? label : undefined"
          :class="{ 'd-filter-pill--active': active }"
          :disabled="disabled"
          @click="isPopoverOpen = true"
        >
          <span v-if="!loading">
            {{ label }}
          </span>
          <dt-skeleton
            v-else
            :text-option="{ width: loadingSkeletonWidth }"
          />
          <template #icon="{ iconSize }">
            <dt-icon-chevron-down
              data-qa="dt-filter-pill__icon"
              class="d-filter-pill__icon"
              :size="iconSize"
            />
          </template>
        </dt-button>
        <dt-button
          v-if="showReset"
          data-qa="dt-filter-pill__reset-button"
          class="d-filter-pill__reset"
          circle
          importance="clear"
          kind="muted"
          :size="size"
          :aria-label="resetButtonAriaLabel"
          @click="$emit('reset', $event)"
        >
          <template #icon="{ iconSize }">
            <dt-icon-close :size="iconSize" />
          </template>
        </dt-button>
      </div>
    </template>
    <template #headerContent>
      <!-- @slot Header content of the opened popover -->
      <slot name="headerContent" />
    </template>
    <template #content>
      <!-- @slot Main content of the opened popover -->
      <slot name="content" />
    </template>
    <template #footerContent>
      <!-- @slot Footer content of the opened popover -->
      <slot name="footerContent" />
    </template>
  </dt-popover>
</template>

<script>
import { DtPopover } from '@/components/popover';
import { DtSkeleton } from '@/components/skeleton';
import { BUTTON_SIZE_MODIFIERS, DtButton } from '@/components/button';
import { DtIconChevronDown, DtIconClose } from '@dialpad/dialtone-icons/vue2';

export default {
  name: 'DtFilterPill',

  components: {
    DtPopover,
    DtButton,
    DtIconClose,
    DtIconChevronDown,
    DtSkeleton,
  },

  inheritAttrs: false,

  props: {
    /**
     * Sets the button highlighted styling
     */
    active: {
      type: Boolean,
      default: false,
    },

    /**
     * HTML disabled attribute
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Label of the button
     */
    label: {
      type: String,
      default: undefined,
    },

    /**
     * Determines if the filter is loading
     */
    loading: {
      type: Boolean,
      default: false,
    },

    /**
     * Sets the size of the skeleton
     * accepts CSS width attribute values
     */
    loadingSkeletonWidth: {
      type: String,
      default: '128px',
    },

    /**
     * Aria label for reset/clear button,
     * required if showReset is set
     */
    resetButtonAriaLabel: {
      type: String,
      default: undefined,
    },

    /**
     * Shows the reset/clear icon
     */
    showReset: {
      type: Boolean,
      default: false,
    },

    /**
     * The size of the button.
     * @values xs, sm, md, lg, xl
     */
    size: {
      type: String,
      default: 'md',
      validator: (s) => Object.keys(BUTTON_SIZE_MODIFIERS).includes(s),
    },
  },

  emits: [
    /**
     * Emitted when clicking the reset/clear button
     *
     * @event reset
     * @type {Boolean | Array}
     */
    'reset',

    /**
     * Emitted when popover is shown or hidden
     *
     * @event opened
     * @type {Boolean | Array}
     */
    'open',
  ],

  data () {
    return {
      isPopoverOpen: false,
    };
  },

  watch: {
    isPopoverOpen (isOpen) {
      this.$emit('open', isOpen);
    },

    showReset: {
      immediate: true,
      handler () {
        this.validateProps();
      },
    },
  },

  methods: {
    validateProps () {
      if (this.showReset && !this.resetButtonAriaLabel) {
        console.error('DtFilterPill a11y: reset-button-aria-label prop must be set if show-reset is set');
      }
    },
  },
};
</script>
