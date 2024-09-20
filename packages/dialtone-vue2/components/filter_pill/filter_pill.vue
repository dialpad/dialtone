<template>
  <dt-popover
    v-model="isPopoverOpen"
    class="d-filter-pill"
    data-qa="dt-filter-pill"
    :placement="placement"
    :fallback-placements="fallbackPlacements"
    :append-to="appendTo"
    :max-height="maxHeight"
    :max-width="maxWidth"
    :padding="padding"
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
import { DtPopover, POPOVER_APPEND_TO_VALUES, POPOVER_PADDING_CLASSES } from '@/components/popover';
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
     * Sets the element to which the
     * <a class="d-link" href="https://dialtone.dialpad.com/components/popover.html#vue-api" target="_blank">popover component</a>
     *  is going to append to
     * @values 'body', 'parent', 'root', HTMLElement
     */
    appendTo: {
      type: [HTMLElement, String],
      default: 'body',
      validator: appendTo => {
        return POPOVER_APPEND_TO_VALUES.includes(appendTo) ||
          (appendTo instanceof HTMLElement);
      },
    },

    /**
     * HTML disabled attribute
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * If the popover does not fit in the direction described by "placement",
     * it will attempt to change its direction to the "fallbackPlacements".
     * <a class="d-link" href="https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements" target="_blank">Popper.js docs</a>
     * */
    fallbackPlacements: {
      type: Array,
      default: () => ['top-start', 'auto'],
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
     * Determines maximum height for the popover before overflow.
     * Possible units rem|px|em
     */
    maxHeight: {
      type: String,
      default: '',
    },

    /**
     * Determines maximum width for the popover before overflow.
     * Possible units rem|px|%|em
     */
    maxWidth: {
      type: String,
      default: '',
    },

    /**
     * Padding size class for the popover content.
     * @values none, small, medium, large
     */
    padding: {
      type: String,
      default: 'large',
      validator: (padding) => {
        return Object.keys(POPOVER_PADDING_CLASSES).some((item) => item === padding);
      },
    },

    /**
     * The direction the popover displays relative to the anchor.
     * <a class="d-link" href="https://atomiks.github.io/tippyjs/v6/all-props/#placement" target="_blank">Tippy.js docs</a>
     * @values top, top-start, top-end, right, right-start, right-end, left, left-start, left-end, bottom, bottom-start, bottom-end, auto, auto-start, auto-end
     */
    placement: {
      type: String,
      default: 'bottom-start',
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
