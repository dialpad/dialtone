<template>
  <div
    class="d-filter-pill"
    data-qa="dt-filter-pill"
  >
    <dt-popover
      v-model="isPopoverOpen"
      :append-to="appendTo"
      :fallback-placements="fallbackPlacements"
      :max-height="maxHeight"
      :max-width="maxWidth"
      :modal="false"
      :padding="padding"
      :placement="placement"
    >
      <template #anchor>
        <dt-button
          v-dt-tooltip="alphaTooltipText"
          :active="isActive"
          :class="[
            'd-filter-pill__primary',
            {
              'd-filter-pill--selected': isActive,
              'd-filter-pill__primary--has-clear': hasClear,
            },
          ]"
          :disabled="disabled"
          :kind="buttonKind"
          :size="size"
          data-qa="dt-filter-pill__button"
          icon-position="right"
          importance="outlined"
          @click="isPopoverOpen = true"
        >
          <span class="d-filter-pill__label">
            <span class="d-filter-pill__label-alpha">{{ label }}</span>
            <span
              v-if="activeFilterCount"
              class="d-filter-pill__label-omega"
            >{{ activeFilterCount }}</span>
          </span>
          <template #icon="{ iconSize }">
            <dt-icon-chevron-down
              :size="iconSize"
              class="d-filter-pill__icon"
              data-qa="dt-filter-pill__icon"
            />
          </template>
        </dt-button>
      </template>
      <template #content>
        <slot name="content" />
      </template>
    </dt-popover>
    <dt-button
      v-if="hasClear"
      v-dt-tooltip="omegaTooltipText"
      :active="isActive"
      :aria-label="clearButtonAriaLabel"
      :class="[
        'd-filter-pill__clear',
        { 'd-filter-pill__clear--selected': isActive },
      ]"
      :disabled="disabled"
      :kind="buttonKind"
      :size="size"
      :title="clearButtonTitle"
      data-qa="dt-filter-pill__clear-button"
      importance="outlined"
      @click="clearFilter"
    >
      <template #icon="{ iconSize }">
        <dt-icon-close :size="iconSize" />
      </template>
    </dt-button>
  </div>
</template>

<script>
import { DtPopover, POPOVER_APPEND_TO_VALUES, POPOVER_PADDING_CLASSES } from '@/components/popover';
import { BUTTON_SIZE_MODIFIERS, DtButton } from '@/components/button';
import { DtIconChevronDown, DtIconClose } from '@dialpad/dialtone-icons/vue3';
import { DialtoneLocalization } from '@/localization';

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
     * Controls whether the filter pill is active and sets the button highlighted styling.
     * Supports .sync modifier
     * @values true, false
     */
    active: {
      type: Boolean,
      default: false,
    },

    /**
     * Number of active filters to show in the pill
     */
    activeFilterCount: {
      type: Number,
      default: undefined,
    },

    /**
     * Text shown in tooltip when you hover the alpha button,
     * required if no content is passed to default slot
     */
    alphaTooltipText: {
      type: String,
      default: '',
    },

    /**
     * Sets the element to which the
     * <a class="d-link" href="https://dialtone.dialpad.com/components/popover.html#vue-api" target="_blank">popover component</a>
     *  is going to append to
     * @values body, parent, root, HTMLElement
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
     * Label of the button
     */
    label: {
      type: String,
      default: undefined,
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
     * Text shown in tooltip when you hover the omega button,
     * required as it is an icon only button
     */
    omegaTooltipText: {
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
     * Shows the clear button
     */
    showClear: {
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
     * Emitted when clicking the clear button
     *
     * @event clear
     * @type {Boolean | Array}
     */
    'clear',

    /**
     * Emitted when popover is shown or hidden
     *
     * @event opened
     * @type {Boolean | Array}
     */
    'open',

    /**
     * Emitted to sync value with parent
     *
     * @event update:active
     * @type {Boolean | Array}
     */
    'update:active',
  ],

  data () {
    return {
      isPopoverOpen: false,
      isActive: this.active,
      hasClear: this.showClear,
      i18n: new DialtoneLocalization(),
    };
  },

  computed: {
    buttonKind () {
      return this.isActive ? 'default': 'muted';
    },

    clearButtonAriaLabel () {
      return this.omegaTooltipText || this.i18n.$t('DIALTONE_FILTER_PILL_CLEAR_BUTTON_LABEL');
    },

    clearButtonTitle () {
      if (this.omegaTooltipText) return;

      return this.clearButtonAriaLabel
    },
  },

  watch: {
    isPopoverOpen (isOpen) {
      this.$emit('open', isOpen);
    },

    active: {
      immediate: true,
      handler (isActive) {
        this.$emit('update:active', isActive);
        this.isActive = isActive;
      },
    },

    showClear (clear) {
      this.hasClear = clear;
    },

    activeFilterCount (count) {
      if (count > 0) {
        this.isActive = true;
        this.hasClear = true;
      } else {
        this.isActive = false;
        this.hasClear = false;
      }

    },
  },

  methods: {
    clearFilter ($event) {
      this.isActive = false;
      this.hasClear = false;
      this.$emit('clear', $event)
    },
  },
};
</script>
