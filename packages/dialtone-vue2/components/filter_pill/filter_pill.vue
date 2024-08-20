<template>
  <dt-popover class="d-filter-pill">
    <template #anchor>
      <div class="d-filter-pill__wrapper">
        <dt-button
          icon-position="right"
          importance="outlined"
          kind="muted"
          :class="{ 'd-filter-pill--active': active }"
          :disabled="disabled"
        >
          {{ label }}
          <template
            #icon
          >
            <dt-icon-chevron-down
              class="d-filter-pill__icon"
              size="200"
            />
          </template>
        </dt-button>
        <dt-button
          v-if="showReset"
          class="d-filter-pill__reset"
          circle
          importance="clear"
          kind="muted"
          size="sm"
          @click.prevent="$emit('reset')"
        >
          <template #icon>
            <dt-icon-close size="200" />
          </template>
        </dt-button>
      </div>
    </template>
    <template #content>
      <!-- @slot Content of the opened popover -->
      <slot name="content" />
    </template>
  </dt-popover>
</template>

<script>
// import { DEFAULT_CONSTANTS } from './filter_pill_constants';
import { DtPopover } from '@/components/popover';
import { DtButton } from '@/components/button';
import { DtIconChevronDown, DtIconClose } from '@dialpad/dialtone-icons/vue2';

export default {
  name: 'DtFilterPill',

  components: {
    DtPopover,
    DtButton,
    DtIconClose,
    DtIconChevronDown,
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
     * Shows the reset/clear icon
     */
    showReset: {
      type: Boolean,
      default: false,
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
      //
    };
  },

  computed: {},

  watch: {},

  methods: {},
};
</script>

<style lang="less">
.d-filter-pill {
  &__wrapper {
    position: relative;
    display: inline-block;

    &:has(.d-filter-pill__reset) .d-filter-pill__icon {
      visibility: hidden;
    }
  }

  &__icon {
    color: var(--dt-color-foreground-muted);
  }

  &__reset {
    position: absolute;
    right: var(--dt-space-200);
    top: 50%;
    transform: translateY(-50%);
    opacity: .5;

    &:hover {
      background-color: transparent;
      opacity: 1;
    }
  }

  &--active {
    border: 1px solid var(--dt-action-color-border-base-outlined-default);
    background-color: var(--dt-action-color-background-base-hover);

    &:hover {
      background-color: var(--dt-action-color-background-base-active);
      border: 1px solid var(--dt-action-color-border-base-outlined-default);
    }
  }
}
</style>
