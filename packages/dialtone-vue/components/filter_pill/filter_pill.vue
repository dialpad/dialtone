<template>
  <div
    :class="[
      'd-filter-pill',
      { 'd-filter-pill--read-only': readOnly },
    ]"
    data-qa="dt-filter-pill"
  >
    <component
      :is="overlayComponent"
      :open="readOnly ? false : (useDropdown ? null : isOpen)"
      v-bind="overlayProps"
      @update:open="isOpen = $event"
    >
      <template #anchor="slotData">
        <dt-button
          v-dt-tooltip="resolvedStartTooltipText"
          v-bind="useDropdown ? slotData : slotData.attrs"
          :active="isActive"
          :aria-disabled="readOnly || undefined"
          :class="[
            'd-filter-pill__primary',
            {
              'd-filter-pill--selected': isActive,
            },
          ]"
          :disabled="disabled"
          :kind="buttonKind"
          :size="size"
          data-qa="dt-filter-pill__button"
          importance="outlined"
          @click="openPopover"
          @keydown.up.down.prevent="openPopover"
        >
          <template
            v-if="$slots.startIcon"
            #startIcon="{ iconSize }"
          >
            <!-- @slot Icon displayed before the label -->
            <slot
              name="startIcon"
              :icon-size="iconSize"
            />
          </template>
          <span class="d-filter-pill__label">
            <!-- @slot Allows you to customize the label slot -->
            <slot
              :label="label"
              :filters="filters"
              :active-filters="activeFilters"
              :active-filter-list="activeFilterList"
              :active-filter-overflow="activeFilterOverflow"
            >
              <span
                class="d-filter-pill__label-start"
                :title="label"
                v-text="label"
              />
              <span
                v-if="activeFilterList"
                class="d-filter-pill__label-end"
                :title="activeFilterList"
                v-text="activeFilterList"
              />
              <span
                v-if="activeFilterOverflow"
                class="d-filter-pill__label-end-overflow"
                :title="`plus ${activeFilters.length - 1} others`"
                v-text="activeFilterOverflow"
              />
            </slot>
          </span>
          <template
            v-if="!readOnly"
            #endIcon="{ iconSize }"
          >
            <dt-icon-chevron-down
              :size="iconSize"
              class="d-filter-pill__icon"
              data-qa="dt-filter-pill__icon"
            />
          </template>
        </dt-button>
      </template>
      <template
        v-if="!useDropdown"
        #content="{ close }"
      >
        <!-- @slot Allows you to override the popover content, only use this if you need custom behavior -->
        <slot
          :close="close"
          :apply="applySelection"
          :cancel="cancelSelection"
          :pending-filters="pendingFilters"
          name="content"
        >
          <dt-checkbox-group
            v-if="modelValue?.length"
            :selected-values="deferSelection ? pendingActiveFilters : activeFilters"
            :aria-label="label"
            name="contact-centers"
          >
            <dt-checkbox
              v-for="filter in displayFilters"
              :key="filter.name"
              :label="filter.name"
              :value="filter.name"
              @input="($event) => filter.active = $event"
            />
          </dt-checkbox-group>
        </slot>
      </template>
      <template
        v-if="!useDropdown && deferSelection"
        #footerContent
      >
        <dt-stack
          direction="row"
          gap="500"
          justify="end"
          data-qa="dt-filter-pill__deferred-footer"
        >
          <dt-button
            importance="clear"
            kind="muted"
            size="sm"
            data-qa="dt-filter-pill__cancel-button"
            @click="cancelSelection"
          >
            {{ cancelButtonLabel }}
          </dt-button>
          <dt-button
            importance="primary"
            size="sm"
            data-qa="dt-filter-pill__apply-button"
            @click="applySelection"
          >
            {{ applyButtonLabel }}
          </dt-button>
        </dt-stack>
      </template>
      <template
        v-if="useDropdown"
        #list="{ close }"
      >
        <!-- @slot Allows you to override the dropdown content -->
        <slot
          :close="close"
          name="content"
        >
          <dt-list-item
            v-for="filter in filters"
            :key="filter.name"
            role="menuitem"
            navigation-type="arrow-keys"
            :selected="filter.active"
            @click="selectFilter(filter, close)"
          >
            {{ filter.name }}
          </dt-list-item>
        </slot>
      </template>
    </component>
    <dt-button
      v-if="hasClear"
      v-dt-tooltip="endTooltipText"
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
import { DtCheckbox } from '@/components/checkbox';
import { DtCheckboxGroup } from '@/components/checkbox_group';
import { DtDropdown } from '@/components/dropdown';
import { DtListItem } from '@/components/list_item';
import { DtStack } from '@/components/stack';

export default {
  name: 'DtFilterPill',

  components: {
    DtCheckboxGroup,
    DtCheckbox,
    DtPopover,
    DtButton,
    DtIconClose,
    DtIconChevronDown,
    DtDropdown,
    DtListItem,
    DtStack,
  },

  inheritAttrs: false,

  props: {
    /**
     * When true, uses DtDropdown instead of DtPopover as the overlay.
     * Provides keyboard navigation (arrow keys) for list items.
     * Default content renders DtListItem elements (single-select)
     * instead of checkboxes (multi-select).
     */
    useDropdown: {
      type: Boolean,
      default: false,
    },

    /**
     * When true, checkbox changes are held in a pending state until the user
     * clicks Apply. Cancel or closing the popover discards pending changes.
     * Only applies to popover mode (not useDropdown).
     */
    deferSelection: {
      type: Boolean,
      default: false,
    },

    /**
     * Array of filters to display in the popover,
     * should be an array of objects with `name` and `active` properties
     */
    modelValue: {
      type: Array,
      default: () => [],
    },

    /**
     * Text shown in tooltip when you hover the start button,
     * required if no content is passed to default slot
     */
    startTooltipText: {
      type: String,
      default: '',
    },

    /**
     * HTML disabled attribute
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * When true, the pill cannot be interacted with but does not
     * receive disabled visual styling. Adds `d-filter-pill--read-only`
     * class and hides the chevron icon. The clear button is suppressed
     * and the tooltip falls back to a read-only message when
     * startTooltipText is not provided.
     */
    readOnly: {
      type: Boolean,
      default: false,
    },

    /**
     * Toggles the clear button visibility
     * @values true, false
     */
    hideClear: {
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
     * Text shown in tooltip when you hover the end button,
     * required as it is an icon only button
     */
    endTooltipText: {
      type: String,
      default: '',
    },

    /**
     * Sets the element to which the
     * <a class="d-link" href="https://dialtone.dialpad.com/components/popover.html#vue-api" target="_blank">popover component</a>
     *  is going to append to
     * @values body, parent, root, HTMLElement
     */
    popoverAppendTo: {
      type: [HTMLElement, String],
      default: 'body',
      validator: appendTo => {
        return POPOVER_APPEND_TO_VALUES.includes(appendTo) ||
          (appendTo instanceof HTMLElement);
      },
    },

    /**
     * If the dropdown does not fit in the direction described by "popoverPlacement",
     * it will attempt to change it's direction to the "popoverFallbackPlacements".
     *
     * @values top, top-start, top-end,
     * right, right-start, right-end,
     * left, left-start, left-end,
     * bottom, bottom-start, bottom-end,
     * auto, auto-start, auto-end
     * */
    popoverFallbackPlacements: {
      type: Array,
      default: () => {
        return ['auto'];
      },
    },

    /**
     * Determines maximum height for the popover before overflow.
     * Possible units rem|px|em
     */
    popoverMaxHeight: {
      type: String,
      default: '',
    },

    /**
     * Determines maximum width for the popover before overflow.
     * Possible units rem|px|%|em
     */
    popoverMaxWidth: {
      type: String,
      default: '',
    },

    /**
     * Padding size class for the popover content.
     * @values none, small, medium, large
     */
    popoverPadding: {
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
    popoverPlacement: {
      type: String,
      default: 'bottom-start',
    },

    /**
     * The size of the button.
     * @values xs, sm, md, lg, xl
     */
    size: {
      type: String,
      default: 'sm',
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
     * Emitted when the active filters change
     * @type {Array}
     */
    'update:modelValue',

    /**
     * Emitted when deferred selection is applied
     *
     * @event apply
     */
    'apply',
  ],

  data () {
    return {
      isOpen: false,
      i18n: new DialtoneLocalization(),
      filters: this.modelValue,
      pendingFilters: null,
    };
  },

  computed: {
    overlayComponent () {
      return this.useDropdown ? 'dt-dropdown' : 'dt-popover';
    },

    overlayProps () {
      const props = {
        'append-to': this.popoverAppendTo,
        'fallback-placements': this.popoverFallbackPlacements,
        'max-height': this.popoverMaxHeight,
        'max-width': this.popoverMaxWidth,
        modal: true,
        placement: this.popoverPlacement,
      };
      if (!this.useDropdown) {
        props.padding = this.popoverPadding;
      }
      return props;
    },

    buttonKind () {
      return (this.isActive && !this.disabled) ? 'default' : 'muted';
    },

    resolvedStartTooltipText () {
      if (this.readOnly) return this.startTooltipText || this.i18n.$t('DIALTONE_FILTER_PILL_READ_ONLY_TOOLTIP');
      return this.startTooltipText;
    },

    clearButtonAriaLabel () {
      return this.endTooltipText || this.i18n.$t('DIALTONE_FILTER_PILL_CLEAR_BUTTON_LABEL');
    },

    clearButtonTitle () {
      if (this.endTooltipText) return;

      return this.clearButtonAriaLabel
    },

    activeFilters () {
      return this.filters.filter(filter => filter.active).map(filter => filter.name);
    },

    activeFilterList () {
      if (this.activeFilters.length === this.filters.length && this.filters.length > 1) {
        return 'All';
      }

      return this.activeFilters[0] ?? '';
    },

    activeFilterOverflow () {
      if (this.activeFilters.length <= 1) return '';
      if (this.activeFilters.length === this.filters.length && this.filters.length > 1) return '';

      return '+' + (this.activeFilters.length - 1);
    },

    isActive () {
      return this.activeFilterList.length > 0;
    },

    hasClear () {
      return !this.readOnly && !this.hideClear && this.activeFilterList.length > 0;
    },

    displayFilters () {
      return (this.deferSelection && this.pendingFilters) ? this.pendingFilters : this.filters;
    },

    pendingActiveFilters () {
      if (!this.pendingFilters) return [];
      return this.pendingFilters.filter(f => f.active).map(f => f.name);
    },

    cancelButtonLabel () {
      return this.i18n.$t('DIALTONE_FILTER_PILL_CANCEL_BUTTON_LABEL');
    },

    applyButtonLabel () {
      return this.i18n.$t('DIALTONE_FILTER_PILL_APPLY_BUTTON_LABEL');
    },
  },

  watch: {
    isOpen (isOpen) {
      this.$emit('open', isOpen);
      if (this.deferSelection) {
        if (isOpen) {
          this.pendingFilters = JSON.parse(JSON.stringify(this.filters));
        } else {
          this.pendingFilters = null;
        }
      }
    },

    filters: {
      deep: true,
      handler (filters) {
        this.$emit('update:modelValue', filters);
      },
    },
  },

  mounted () {
    if (!(this.modelValue?.length || (this.$slots.content && this.$slots.content()))) {
      console.warn('Please provide content through the v-model or the "content" slot.')
    }
  },

  methods: {
    clearFilter ($event) {
      this.filters.forEach(filter => delete filter.active);
      this.$emit('clear', $event)
    },

    openPopover () {
      if (this.readOnly || this.useDropdown) return;
      this.isOpen = true;
    },

    selectFilter (selectedFilter, close) {
      this.filters.forEach(filter => {
        filter.active = filter === selectedFilter;
      });
      close();
    },

    applySelection () {
      if (!this.pendingFilters) return;
      this.filters.forEach((filter, i) => {
        if (this.pendingFilters[i]) {
          filter.active = this.pendingFilters[i].active;
        } else {
          delete filter.active;
        }
      });
      this.$emit('apply');
      this.isOpen = false;
    },

    cancelSelection () {
      this.isOpen = false;
    },
  },
};
</script>
