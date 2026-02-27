<template>
  <span
    data-qa="dt-split-button"
    :class="[rootClass, 'd-split-btn']"
    :style="{ width }"
  >
    <split-button-alpha
      v-bind="alphaButtonProps"
      ref="alphaButton"
      @click="onStartClick"
    >
      <!-- Dual-icon path: when startEndIcon is provided, use DtButton's startIcon/endIcon -->
      <template
        v-if="$slots.startEndIcon"
        #startIcon="{ size: iconSize }"
      >
        <!-- @slot Start (left) button icon slot -->
        <slot
          v-if="$slots.startIcon"
          name="startIcon"
          :size="iconSize"
        />
        <!-- @slot @deprecated Use startIcon -->
        <slot
          v-else
          name="alphaIcon"
          :size="iconSize"
        />
      </template>
      <template
        v-if="$slots.startEndIcon"
        #endIcon="{ size: iconSize }"
      >
        <!-- @slot End-positioned icon within the start button (enables dual icons on the start button) -->
        <slot
          name="startEndIcon"
          :size="iconSize"
        />
      </template>
      <!-- Legacy single-icon path: uses DtButton's icon slot with iconPosition -->
      <template
        v-if="!$slots.startEndIcon"
        #icon="{ size: iconSize }"
      >
        <!-- @slot Start (left) button icon slot -->
        <slot
          v-if="$slots.startIcon"
          name="startIcon"
          :size="iconSize"
        />
        <!-- @slot @deprecated Use startIcon -->
        <slot
          v-else
          name="alphaIcon"
          :size="iconSize"
        />
      </template>
      <!-- @slot Default content slot -->
      <slot name="default" />
    </split-button-alpha>
    <!-- @slot End (right) content slot, overrides end button styling and functionality completely -->
    <template v-if="$slots.end">
      <slot name="end" />
    </template>
    <!-- @slot @deprecated Use end -->
    <template v-else-if="$slots.omega">
      <slot name="omega" />
    </template>
    <template v-else>
      <dt-dropdown
        v-if="$slots.dropdownList"
        :placement="dropdownPlacement"
        @click="isDropdownOpen = true"
        @opened="open => isDropdownOpen = open"
      >
        <template #anchor="attrs">
          <split-button-omega
            v-bind="{ ...attrs, ...omegaButtonProps }"
            :active="isDropdownOpen"
            @click="onEndClick"
          >
            <template #icon="{ size: iconSize }">
              <!-- @slot End (right) button icon slot -->
              <slot
                v-if="$slots.endIcon"
                name="endIcon"
                :size="iconSize"
              />
              <!-- @slot @deprecated Use endIcon -->
              <slot
                v-else
                name="omegaIcon"
                :size="iconSize"
              />
            </template>
          </split-button-omega>
        </template>
        <template #list="{ close }">
          <!-- @slot Built-in dropdown content slot, use of dt-list-item is highly recommended here. -->
          <slot
            name="dropdownList"
            :close="close"
          />
        </template>
      </dt-dropdown>

      <split-button-omega
        v-else
        v-bind="omegaButtonProps"
        @click="onEndClick"
      >
        <template #icon="{ size: iconSize }">
          <!-- @slot End (right) button icon slot -->
          <slot
            v-if="$slots.endIcon"
            name="endIcon"
            :size="iconSize"
          />
          <!-- @slot @deprecated Use endIcon -->
          <slot
            v-else
            name="omegaIcon"
            :size="iconSize"
          />
        </template>
      </split-button-omega>
    </template>
  </span>
</template>

<script>
import {
  BUTTON_IMPORTANCE_MODIFIERS,
  BUTTON_KIND_MODIFIERS,
  BUTTON_SIZE_MODIFIERS,
  ICON_POSITION_MODIFIERS,
} from '@/components/button';
import SplitButtonAlpha from './split_button-alpha.vue';
import SplitButtonOmega from './split_button-omega.vue';
import { DtDropdown } from '@/components/dropdown';
import { hasSlotContent, warnIfUnmounted, returnFirstEl } from '@/common/utils';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtSplitButton',

  components: {
    SplitButtonOmega,
    DtDropdown,
    SplitButtonAlpha,
  },

  inheritAttrs: false,

  props: {
    /**
     * Determines whether the start button should have active styling
     * @values true, false
     */
    startActive: {
      type: Boolean,
      default: false,
    },

    /**
     * @deprecated Use startActive
     * @values true, false
     */
    alphaActive: {
      type: Boolean,
      default: null,
    },

    /**
     * Descriptive label for the start button
     */
    startAriaLabel: {
      type: String,
      default: null,
    },

    /**
     * @deprecated Use startAriaLabel
     */
    alphaAriaLabel: {
      type: String,
      default: undefined,
    },

    /**
     * The position of the icon slot within the start button.
     * @values start, end, blockStart, blockEnd, left, right, top, bottom
     */
    startIconPosition: {
      type: String,
      default: 'left',
      validator: (position) => Object.keys(ICON_POSITION_MODIFIERS).includes(position),
    },

    /**
     * @deprecated Use startIconPosition
     * @values start, end, blockStart, blockEnd, left, right, top, bottom
     */
    alphaIconPosition: {
      type: String,
      default: undefined,
      validator: (position) => position === undefined || Object.keys(ICON_POSITION_MODIFIERS).includes(position),
    },

    /**
     * Used to customize the start label container
     */
    startLabelClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * @deprecated Use startLabelClass
     */
    alphaLabelClass: {
      type: [String, Array, Object],
      default: undefined,
    },

    /**
     * HTML button disabled attribute for start button only
     * <a class="d-link" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#disabled" target="_blank">
     *  (Reference)
     * </a>
     * @values true, false
     */
    startDisabled: {
      type: Boolean,
      default: false,
    },

    /**
     * @deprecated Use startDisabled
     * @values true, false
     */
    alphaDisabled: {
      type: Boolean,
      default: null,
    },

    /**
     * Whether the start button should display a loading animation or not.
     * @values true, false
     */
    startLoading: {
      type: Boolean,
      default: false,
    },

    /**
     * @deprecated Use startLoading
     * @values true, false
     */
    alphaLoading: {
      type: Boolean,
      default: null,
    },

    /**
     * Text shown in tooltip when you hover the start button,
     * required if no content is passed to default slot
     */
    startTooltipText: {
      type: String,
      default: undefined,
    },

    /**
     * @deprecated Use startTooltipText
     */
    alphaTooltipText: {
      type: String,
      default: undefined,
    },

    /**
     * Determines whether a screenreader reads live updates of
     * the button content to the user while the button
     * is in focus.
     * @values true, false
     */
    assertiveOnFocus: {
      type: Boolean,
      default: false,
    },

    /**
     * HTML button disabled attribute for both buttons.
     * Use startDisabled or endDisabled to disable buttons individually.
     * <a class="d-link" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#disabled" target="_blank">
     *  (Reference)
     * </a>
     * @values true, false
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * The direction the dropdown displays relative to the anchor.
     * @values top, top-start, top-end, right, right-start, right-end, left, left-start, left-end, bottom, bottom-start, bottom-end, auto, auto-start, auto-end
     */
    dropdownPlacement: {
      type: String,
      default: 'bottom-end',
    },

    /**
     * The fill and outline of the button associated with its visual importance.
     * @values clear, outlined, primary
     */
    importance: {
      type: String,
      default: 'primary',
      validator: (i) => Object.keys(BUTTON_IMPORTANCE_MODIFIERS).includes(i),
    },

    /**
     * The color of the button.
     * @values default, muted, danger, inverted
     */
    kind: {
      type: String,
      default: 'default',
      validator: (k) => Object.keys(BUTTON_KIND_MODIFIERS).includes(k),
    },

    /**
     * Determines whether the end button should have active styling
     * @values true, false
     */
    endActive: {
      type: Boolean,
      default: false,
    },

    /**
     * @deprecated Use endActive
     * @values true, false
     */
    omegaActive: {
      type: Boolean,
      default: null,
    },

    /**
     * Descriptive label for the end button
     */
    endAriaLabel: {
      type: String,
      default: null,
    },

    /**
     * @deprecated Use endAriaLabel
     */
    omegaAriaLabel: {
      type: String,
      default: undefined,
    },

    /**
     * HTML button disabled attribute for end button only
     * <a class="d-link" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#disabled" target="_blank">
     *  (Reference)
     * </a>
     * @values true, false
     */
    endDisabled: {
      type: Boolean,
      default: false,
    },

    /**
     * @deprecated Use endDisabled
     * @values true, false
     */
    omegaDisabled: {
      type: Boolean,
      default: null,
    },

    /**
     * Element ID, useful in case you need to reference the button
     * as an external anchor for popover.
     */
    endId: {
      type: String,
      default: undefined,
    },

    /**
     * @deprecated Use endId
     */
    omegaId: {
      type: String,
      default: undefined,
    },

    /**
     * Text shown in tooltip when you hover the end button,
     * required as it is an icon only button
     */
    endTooltipText: {
      type: String,
      default: undefined,
    },

    /**
     * @deprecated Use endTooltipText
     */
    omegaTooltipText: {
      type: String,
      default: undefined,
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

    /**
     * Button width, accepts
     * <a class="d-link" href="https://developer.mozilla.org/en-US/docs/Web/CSS/width" target="_blank">
     *   CSS width attribute
     * </a>
     * values
     */
    width: {
      type: String,
      default: null,
    },

    /**
     * Additional class name for the root element.
     * Can accept all of: String, Object, and Array, i.e. has the
     * same api as Vue's built-in handling of the class attribute.
     */
    rootClass: {
      type: [String, Object, Array],
      default: '',
    },
  },

  emits: [
    /**
     * Native start button click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'start-clicked',

    /**
     * @deprecated Use start-clicked
     */
    'alpha-clicked',

    /**
     * Native end button click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'end-clicked',

    /**
     * @deprecated Use end-clicked
     */
    'omega-clicked',
  ],

  data () {
    return {
      isDropdownOpen: false,
    };
  },

  computed: {
    alphaButtonProps () {
      return {
        active: this.alphaActive ?? this.startActive,
        ariaLabel: this.alphaAriaLabel ?? this.startAriaLabel,
        assertiveOnFocus: this.assertiveOnFocus,
        disabled: this.disabled || (this.alphaDisabled ?? this.startDisabled),
        iconPosition: this.alphaIconPosition ?? this.startIconPosition,
        labelClass: this.alphaLabelClass ?? this.startLabelClass,
        loading: this.alphaLoading ?? this.startLoading,
        importance: this.importance,
        kind: this.kind,
        size: this.size,
        tooltipText: this.alphaTooltipText ?? this.startTooltipText,
        class: this.$attrs.class,
        style: this.$attrs.style,
      };
    },

    omegaButtonProps () {
      return {
        id: this.omegaId ?? this.endId,
        active: this.omegaActive ?? this.endActive,
        ariaLabel: this.omegaAriaLabel ?? this.endAriaLabel,
        disabled: this.disabled || (this.omegaDisabled ?? this.endDisabled),
        importance: this.importance,
        kind: this.kind,
        size: this.size,
        tooltipText: this.omegaTooltipText ?? this.endTooltipText,
        class: this.$attrs.class,
        style: this.$attrs.style,
      };
    },
  },

  created () {
    this.validateProps();
  },

  updated () {
    this.validateProps();
  },

  mounted () {
    warnIfUnmounted(returnFirstEl(this.$el), this.$options.name);
  },

  methods: {
    onStartClick () {
      this.$emit('start-clicked');
      this.$emit('alpha-clicked');
    },

    onEndClick () {
      this.$emit('end-clicked');
      this.$emit('omega-clicked');
    },

    validateProps () {
      this.validateAlphaButtonProps();
      this.validateOmegaButtonProps();
    },

    validateAlphaButtonProps () {
      if (hasSlotContent(this.$slots.default)) return;

      if ((hasSlotContent(this.$slots.startIcon) || hasSlotContent(this.$slots.alphaIcon)) &&
        !(this.alphaTooltipText ?? this.startTooltipText)) {
        console.warn('start-tooltip-text prop must be set if start button has an icon only');
      }
    },

    validateOmegaButtonProps () {
      if (hasSlotContent(this.$slots.end) || hasSlotContent(this.$slots.omega)) return;

      if (!(this.omegaTooltipText ?? this.endTooltipText)) {
        console.warn('end-tooltip-text prop is required as it is an icon-only button');
      }
    },
  },
};
</script>
