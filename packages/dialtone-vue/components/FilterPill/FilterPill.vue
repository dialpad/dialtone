<template>
  <div
    :class="[
      'd-filter-pill',
      { 'd-filter-pill--read-only': readOnly },
    ]"
    v-bind="legacyRootAttrs()"
    data-qa="dt-filter-pill"
  >
    <component
      :is="overlayComponent"
      ref="overlay"
      :open="isOpen"
      v-bind="overlayProps"
      :aria-label="controlledAtBirth && !$slots.content ? label : undefined"
      :content-mode="contentMode"
      @update:open="onOverlayTerminalOpen"
      @opened="onOverlayOpened"
      @keydown="onOverlayKeydown"
    >
      <template #anchor="slotData">
        <dt-button
          ref="primaryButton"
          v-dt-tooltip="resolvedStartTooltipText"
          v-bind="anchorAttributes(slotData)"
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
          @keydown.up.down.prevent="onAnchorArrow"
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
          <span :class="['d-filter-pill__label', labelClass]">
            <!--
              @slot Customize the anchor label. Legacy and controlled bindings are conditional on options.
              @binding {string} label Dimension label.
              @binding {Array} filters Legacy filter records only.
              @binding {Array} activeFilters Legacy selected names only.
              @binding {string} activeFilterList Legacy first selection or All only.
              @binding {string} activeFilterOverflow Legacy overflow only.
              @binding {string | null | Array} selected Controlled committed snapshot only.
              @binding {Array} selectedOptions Controlled resolved option records only.
              @binding {string} displayLabel Controlled display summary only.
              @binding {boolean} isActive Controlled active state only.
            -->
            <slot
              v-if="controlledAtBirth"
              v-bind="controlledAnchorBindings"
            >
              <span class="sr-only">{{ controlledAccessibleLabel }}</span>
              <span
                v-if="controlledDropdown || !isActive || label"
                class="d-filter-pill__label-start"
                aria-hidden="true"
              >{{ controlledDropdown || !isActive ? controlledDisplayLabel : label }}</span>
              <span
                v-if="!controlledDropdown && isActive"
                :class="[
                  'd-filter-pill__label-end',
                  { 'd-filter-pill__label-end--standalone': !label },
                ]"
                aria-hidden="true"
              >{{ controlledDisplayLabel }}</span>
              <span
                v-if="controlledOverflow"
                class="d-filter-pill__label-end-overflow"
                :title="activeFilterOverflowTitle"
              >{{ controlledOverflow }}</span>
              <span
                v-if="hasSlotContent($slots.anchorEnd, controlledAnchorBindings)"
                :class="['d-filter-pill__anchor-end', anchorEndClass]"
              >
                <!--
                  @slot Noninteractive controlled trailing anchor content, retaining the built-in label.
                  @binding {string} label Dimension label.
                  @binding {string} displayLabel Committed display summary.
                  @binding {string | null | Array} selected Committed selection snapshot.
                  @binding {Array} selectedOptions Resolved committed option records.
                  @binding {boolean} isActive Whether committed selection filters results.
                -->
                <slot
                  name="anchorEnd"
                  v-bind="controlledAnchorBindings"
                />
              </span>
            </slot>
            <!--
              @slot Customize the anchor label. Legacy and controlled bindings are conditional on options.
              @binding {string} label Dimension label.
              @binding {Array} filters Legacy filter records only.
              @binding {Array} activeFilters Legacy selected names only.
              @binding {string} activeFilterList Legacy first selection or All only.
              @binding {string} activeFilterOverflow Legacy overflow only.
              @binding {string | null | Array} selected Controlled committed snapshot only.
              @binding {Array} selectedOptions Controlled resolved option records only.
              @binding {string} displayLabel Controlled display summary only.
              @binding {boolean} isActive Controlled active state only.
            -->
            <slot
              v-else
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
                :title="activeFilterLabel"
                v-text="activeFilterLabel"
              />
              <span
                v-if="activeFilterOverflow"
                class="d-filter-pill__label-end-overflow"
                :title="activeFilterOverflowTitle"
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
        v-if="!overlayUseDropdown"
        #content="{ close }"
      >
        <!--
          @slot Override overlay content. Bindings are conditional on the selection contract.
          @binding {Function} close Dismiss without applying.
          @binding {Function} apply Legacy popovers; controlled Promise callback (no-op outside open deferred popovers).
          @binding {Function} cancel Discard pending state and dismiss; legacy popovers or either controlled pattern.
          @binding {Array | null} pendingFilters Legacy popover draft records only.
          @binding {string | null | Array} selected Controlled committed snapshot only.
          @binding {Array | null} pendingSelected Controlled open deferred draft snapshot only.
          @binding {Function} setSelected Controlled explicit selection action only.
        -->
        <slot
          v-if="controlledAtBirth"
          name="content"
          v-bind="controlledContentBindings"
        >
          <dt-checkbox-group
            :model-value="checkboxRenderValues"
            :aria-label="label"
            :name="label || 'filter-pill'"
            :disabled="!controlledCanSelect"
          >
            <dt-checkbox
              v-for="option in controlledState.options"
              :id="controlledOptionId(option.value)"
              :key="option.value"
              :label="option.label"
              :value="option.value"
              @update:model-value="toggleControlledOption(option.value, $event)"
            >
              {{ option.label }}
              <span
                v-if="$slots.optionEnd"
                :class="['d-filter-pill__option-end', optionEndClass]"
              >
                <!--
                  @slot Noninteractive trailing choice content, retaining its label and handler.
                  @binding {Object} option Read-only option record.
                  @binding {boolean} selected Whether this row is selected, using a deferred draft when open.
                -->
                <slot
                  name="optionEnd"
                  :option="option"
                  :selected="controlledRowSelected(option.value)"
                />
              </span>
            </dt-checkbox>
          </dt-checkbox-group>
        </slot>
        <!--
          @slot Override overlay content. Bindings are conditional on the selection contract.
          @binding {Function} close Dismiss without applying.
          @binding {Function} apply Legacy popovers; controlled Promise callback (no-op outside open deferred popovers).
          @binding {Function} cancel Discard pending state and dismiss; legacy popovers or either controlled pattern.
          @binding {Array | null} pendingFilters Legacy popover draft records only.
          @binding {string | null | Array} selected Controlled committed snapshot only.
          @binding {Array | null} pendingSelected Controlled open deferred draft snapshot only.
          @binding {Function} setSelected Controlled explicit selection action only.
        -->
        <slot
          v-else
          :close="close"
          :apply="applySelection"
          :cancel="cancelSelection"
          :pending-filters="pendingFilters"
          name="content"
        >
          <dt-checkbox-group
            v-if="modelValue?.length"
            :model-value="deferSelection ? pendingActiveFilters : activeFilters"
            :aria-label="label"
            :name="label || 'filter-pill'"
          >
            <dt-checkbox
              v-for="filter in displayFilters"
              :key="filter.name"
              :label="filter.name"
              :value="filter.name"
              @update:model-value="($event) => filter.active = $event"
            />
          </dt-checkbox-group>
        </slot>
      </template>
      <template
        v-if="!overlayUseDropdown && $slots.headerContent"
        #headerContent="{ close }"
      >
        <!-- @slot Popover header or noninteractive built-in controlled dropdown heading.
          Absent in legacy dropdowns and full custom dropdown content.
          @binding {Function} close Dismiss without applying; popovers only.
        -->
        <slot
          name="headerContent"
          :close="controlledAtBirth ? closeControlled : close"
        />
      </template>
      <template
        v-if="!overlayUseDropdown && (deferSelection || $slots.footerContent)"
        #footerContent="{ close }"
      >
        <!-- @slot Allows you to customize the popover footer. Receives { close, apply, cancel } bindings. -->
        <slot
          name="footerContent"
          :close="controlledAtBirth ? closeControlled : close"
          :apply="applySelection"
          :cancel="cancelSelection"
        >
          <dt-stack
            v-if="deferSelection"
            direction="row"
            gap="400"
            justify="end"
            data-qa="dt-filter-pill__deferred-footer"
          >
            <dt-button
              importance="clear"
              kind="muted"
              :size="200"
              data-qa="dt-filter-pill__cancel-button"
              @click="cancelSelection"
            >
              {{ cancelButtonLabel }}
            </dt-button>
            <dt-button
              importance="primary"
              :size="200"
              data-qa="dt-filter-pill__apply-button"
              @click="applySelection"
            >
              {{ applyButtonLabel }}
            </dt-button>
          </dt-stack>
        </slot>
      </template>
      <template
        v-if="overlayUseDropdown"
        #list="{ close }"
      >
        <!--
          @slot Override overlay content. Bindings are conditional on the selection contract.
          @binding {Function} close Dismiss without applying.
          @binding {Function} apply Legacy popovers; controlled Promise callback (no-op outside open deferred popovers).
          @binding {Function} cancel Discard pending state and dismiss; legacy popovers or either controlled pattern.
          @binding {Array | null} pendingFilters Legacy popover draft records only.
          @binding {string | null | Array} selected Controlled committed snapshot only.
          @binding {Array | null} pendingSelected Controlled open deferred draft snapshot only.
          @binding {Function} setSelected Controlled explicit selection action only.
        -->
        <slot
          v-if="controlledAtBirth"
          name="content"
          v-bind="controlledContentBindings"
        >
          <li
            v-if="$slots.headerContent"
            role="presentation"
            :class="['d-filter-pill__menu-heading', headerContentClass]"
          >
            <dt-text
              variant="label-xs"
              :size="100"
              strength="medium"
              tone="tertiary"
              :density="500"
            >
              <!-- @slot Popover header or noninteractive built-in controlled dropdown heading.
                Absent in legacy dropdowns and full custom dropdown content. -->
              <slot name="headerContent" />
            </dt-text>
          </li>
          <dt-list-item
            v-for="option in controlledState.options"
            :id="controlledOptionId(option.value)"
            :key="option.value"
            role="menuitemradio"
            navigation-type="arrow-keys"
            :selected="controlledRowSelected(option.value)"
            :aria-disabled="!controlledCanSelect || undefined"
            @click="selectControlledOption(option.value)"
          >
            {{ option.label }}
            <template #selected>
              <dt-icon-check
                size="200"
                :class="{ 'd-filter-pill__selection-indicator--hidden': !controlledRowSelected(option.value) }"
                aria-hidden="true"
              />
            </template>
            <template
              v-if="$slots.optionEnd"
              #end
            >
              <span :class="['d-filter-pill__option-end', optionEndClass]">
                <!--
                  @slot Noninteractive trailing choice content, retaining its label and handler.
                  @binding {Object} option Read-only option record.
                  @binding {boolean} selected Whether this row is selected, using a deferred draft when open.
                -->
                <slot
                  name="optionEnd"
                  :option="option"
                  :selected="controlledRowSelected(option.value)"
                />
              </span>
            </template>
          </dt-list-item>
        </slot>
        <!--
          @slot Override overlay content. Bindings are conditional on the selection contract.
          @binding {Function} close Dismiss without applying.
          @binding {Function} apply Legacy popovers; controlled Promise callback (no-op outside open deferred popovers).
          @binding {Function} cancel Discard pending state and dismiss; legacy popovers or either controlled pattern.
          @binding {Array | null} pendingFilters Legacy popover draft records only.
          @binding {string | null | Array} selected Controlled committed snapshot only.
          @binding {Array | null} pendingSelected Controlled open deferred draft snapshot only.
          @binding {Function} setSelected Controlled explicit selection action only.
        -->
        <slot
          v-else
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
            <template #selected>
              <dt-icon-check
                size="200"
                :class="{ 'd-filter-pill__selection-indicator--hidden': !filter.active }"
                aria-hidden="true"
              />
            </template>
          </dt-list-item>
        </slot>
      </template>
    </component>
    <dt-button
      v-if="hasClear"
      ref="clearButton"
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
      <template #icon>
        <dt-icon-close :size="clearIconSize" />
      </template>
    </dt-button>
  </div>
</template>

<script>
import {
  DtPopover,
  POPOVER_APPEND_TO_VALUES,
  POPOVER_HEADER_FOOTER_PADDING_CLASSES,
  POPOVER_PADDING_CLASSES,
} from '@/components/Popover';
import { HTML_ELEMENT_TYPE } from '@/common/constants';
import { CONTENT_MODE_PROP } from '@/common/mode_constants';
import { ordinalSizeValidator } from '@/common/validators';
import { hasSlotContent } from '@/common/utils';
import { BUTTON_SIZE_MODIFIERS, BUTTON_ICON_SIZES, DtButton } from '@/components/Button';
import { DtIconChevronDown, DtIconClose, DtIconCheck } from '@dialpad/dialtone-icons/vue';
import { DialtoneLocalization } from '@/localization';
import { DtCheckbox } from '@/components/Checkbox';
import { DtCheckboxGroup } from '@/components/CheckboxGroup';
import { DtDropdown } from '@/components/Dropdown';
import { DtListItem } from '@/components/ListItem';
import { DtStack } from '@/components/Stack';
import { DtText } from '@/components/Text';
import ControlledSelection from './FilterPillControlled';

/**
 * @typedef {object} FilterPillOption
 * @property {string} value Stable choice identity.
 * @property {string} label Required choice label.
 * @property {string | null} [shortLabel] Optional anchor summary; null uses label.
 */

export default {
  name: 'DtFilterPill',

  components: {
    DtCheckboxGroup,
    DtCheckbox,
    DtPopover,
    DtButton,
    DtIconClose,
    DtIconCheck,
    DtIconChevronDown,
    DtDropdown,
    DtListItem,
    DtStack,
    DtText,
  },

  mixins: [ControlledSelection],

  props: {
    /**
     * An array at creation (including []) opts into authoritative selection. Remount to change contract or controlled pattern.
     * Records require string value and label. Optional shortLabel accepts string or null; null is absent and empty string is meaningful.
     */
    options: {
      type: /** @type {import('vue').PropType<readonly FilterPillOption[] | null>} */ (Array),
      default: undefined,
    },

    /** Controlled selection: string|null in dropdowns, readonly string[] in popovers. */
    selected: {
      type: /** @type {import('vue').PropType<string | null | readonly string[]>} */ ([String, Array]),
      default: undefined,
    },

    /**
     * Single-selection baseline. Null or omitted means absent; empty string is meaningful. Ignored in multiple selection.
     */
    neutralValue: {
      type: /** @type {import('vue').PropType<string | null>} */ (String),
      default: undefined,
    },

    /** Logical visibility synchronization for controlled selection. Null uses internal ownership. */
    open: {
      type: [Boolean, null],
      default: null,
    },

    /** Classes on the immediate noninteractive anchorEnd wrapper. */
    anchorEndClass: {
      type: [String, Array, Object],
      default: '',
    },

    /** Classes on each immediate noninteractive optionEnd wrapper. */
    optionEndClass: {
      type: [String, Array, Object],
      default: '',
    },

    /** Classes on the immediate headerContent wrapper. */
    headerContentClass: {
      type: [String, Array, Object],
      default: '',
    },

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
     * Applies to popover mode.
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
     * Shows the clear button when a filter is active
     * @values true, false
     */
    showClear: {
      type: Boolean,
      default: true,
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
      type: [HTML_ELEMENT_TYPE, String],
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
     * Padding preset for the popover content. Omit for d-py-100 d-px-150.
     * Set large to restore the previous content padding.
     * @values none, small, medium, large
     */
    popoverPadding: {
      type: String,
      default: undefined,
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
     * Additional CSS class(es) applied to the label wrapper element.
     */
    labelClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional CSS class(es) applied to the popover content area.
     * Applies to popover mode.
     */
    popoverContentClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional CSS class(es) applied to the outer popover header element (`d-popover__header`).
     * Applies to popover mode.
     */
    popoverHeaderClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional CSS class(es) applied to the outer popover footer element (`d-popover__footer`).
     * Applies to popover mode.
     */
    popoverFooterClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional CSS class(es) applied to the popover dialog element.
     * Applies to popover mode.
     */
    popoverDialogClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional CSS class(es) applied to the dropdown list wrapper.
     * Only applies when useDropdown is true.
     */
    dropdownListClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Applies a color mode to the positioned content element.
     * @values light, dark, invert
     */
    contentMode: CONTENT_MODE_PROP,

    /**
     * The size of the button.
     * @values 100, 200, 300, 400, 500
     */
    size: {
      type: [String, Number],
      default: 200,
      validator: ordinalSizeValidator(BUTTON_SIZE_MODIFIERS),
    },
  },

  emits: [
    /** Proposed controlled value. The parent remains authoritative. @type {string | null | Array} */
    'update:selected',

    /** User action snapshot: value, previousValue, reason and changed. @type {Object} */
    'selection-change',

    /** Logical visibility synchronization when controlled open is boolean. @type {boolean} */
    'update:open',

    /**
     * Controlled-only completed overlay visibility, after focus and scroll cleanup.
     * For removal, keep the modal, anchor and scroll container unchanged until opened(false).
     * Completion does not establish global scroll-lock ownership.
     * @type {boolean}
     */
    'opened',

    /**
     * Emitted when clicking the clear button
     *
     * @event clear
     * @type {Boolean | Array}
     */
    'clear',

    /**
     * Logical visibility notification when the overlay is shown or dismissed
     *
     * @event open
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
      filters: Array.isArray(this.options) ? [] : this.modelValue,
      pendingFilters: null,
    };
  },

  computed: {
    overlayUseDropdown () {
      return this.controlledAtBirth ? this.controlledDropdown : this.useDropdown;
    },

    overlayComponent () {
      return this.overlayUseDropdown ? 'dt-dropdown' : 'dt-popover';
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
      if (this.controlledAtBirth) {
        props.visibilityChangeCallback = this.onControlledVisibility;
        props.forwardAnchorArrowKeys = true;
      }
      if (this.overlayUseDropdown) {
        props['list-class'] = this.dropdownListClass;
      } else {
        const defaultPadding = this.popoverPadding === undefined;
        props.padding = defaultPadding ? 'none' : this.popoverPadding;
        props['content-class'] = defaultPadding
          ? ['d-py-100 d-px-150', this.popoverContentClass]
          : this.popoverContentClass;
        props['header-wrapper-class'] = defaultPadding
          ? [POPOVER_HEADER_FOOTER_PADDING_CLASSES.large, this.popoverHeaderClass]
          : this.popoverHeaderClass;
        props['header-class'] = this.headerContentClass;
        props['footer-wrapper-class'] = defaultPadding
          ? [POPOVER_HEADER_FOOTER_PADDING_CLASSES.large, this.popoverFooterClass]
          : this.popoverFooterClass;
        props['dialog-class'] = this.popoverDialogClass;
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

      return this.clearButtonAriaLabel;
    },

    activeFilters () {
      return this.filters.filter(filter => filter.active).map(filter => filter.name);
    },

    allFiltersActive () {
      return this.filters.length > 1 && this.activeFilters.length === this.filters.length;
    },

    activeFilterList () {
      if (this.allFiltersActive) {
        return 'All';
      }

      return this.activeFilters[0] ?? '';
    },

    activeFilterLabel () {
      if (this.allFiltersActive) {
        return this.i18n.$t('DIALTONE_FILTER_PILL_ALL_LABEL');
      }

      return this.activeFilterList;
    },

    activeFilterOverflowTitle () {
      const count = this.controlledAtBirth ? this.controlledState.values.length - 1 : this.activeFilters.length - 1;
      return this.i18n.$t('DIALTONE_FILTER_PILL_OVERFLOW_TITLE', { count });
    },

    activeFilterOverflow () {
      if (this.activeFilters.length <= 1 || this.allFiltersActive) return '';

      return '+' + (this.activeFilters.length - 1);
    },

    isActive () {
      if (this.controlledAtBirth) return this.controlledState.valid && this.controlledState.isActive;
      return this.activeFilterList.length > 0;
    },

    hasClear () {
      if (this.controlledAtBirth) {
        return !this.readOnly && this.showClear && this.controlledContractValid &&
          this.controlledState.valid && this.isActive;
      }
      return !this.readOnly && this.showClear && this.activeFilterList.length > 0;
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

    clearIconSize () {
      if (String(this.size) === '100') return '100';
      return BUTTON_ICON_SIZES[String(this.size)];
    },
  },

  watch: {
    isOpen (isOpen) {
      if (this.controlledAtBirth) return;
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
        if (!this.controlledAtBirth) this.$emit('update:modelValue', filters);
      },
    },
  },

  mounted () {
    if (!this.controlledAtBirth && !(this.modelValue?.length || this.$slots.content)) {
      console.warn('Please provide content through the v-model or the "content" slot.');
    }
    if (this.deferSelection && this.useDropdown) {
      console.warn('deferSelection has no effect when useDropdown is true.');
    }
  },

  methods: {
    hasSlotContent,

    clearFilter ($event) {
      if (this.controlledAtBirth) {
        const baseline = this.controlledDropdown ? (this.neutralValue ?? null) : [];
        this.controlledDraft = null;
        this.commitControlled(baseline, 'clear', true, $event);
        this.reconcileCheckboxes();
        return;
      }
      this.filters.forEach(filter => delete filter.active);
      this.$emit('clear', $event);
    },

    openPopover () {
      if (this.controlledAtBirth) { this.requestControlledOpen(true); return; }
      if (this.readOnly) return;
      this.isOpen = true;
    },

    selectFilter (selectedFilter, close) {
      this.filters.forEach(filter => {
        filter.active = filter === selectedFilter;
      });
      close();
    },

    /** Controlled Apply closes on success; custom footers should call apply() alone or await it. */
    applySelection () {
      if (this.controlledAtBirth) return this.applyControlledSelection();
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
      if (this.controlledAtBirth) { this.closeControlled(); return; }
      this.isOpen = false;
    },
  },
};
</script>
