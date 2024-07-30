<template>
  <span
    data-qa="dt-split-button"
    class="d-split-btn"
    :style="{ width: width }"
  >
    <dt-button
      v-dt-tooltip="alphaTooltipText"
      data-qa="dt-split-button-alpha"
      :size="size"
      :class="[`d-split-btn__alpha d-split-btn__alpha--${size}`]"
      :active="alphaActive"
      :aria-label="alphaAriaLabel"
      :icon-position="alphaIconPosition"
      :label-class="alphaLabelClass"
      :loading="alphaLoading"
      :assertive-on-focus="assertiveOnFocus"
      :disabled="disabled"
      :importance="importance"
      :kind="kind"
      @click="(e) => handleClick('alpha', e)"
    >
      <template #icon>
        <!-- @slot Alpha (left) button icon slot -->
        <slot name="alphaIcon" />
      </template>
      <!-- @slot Default content slot -->
      <slot name="default" />
    </dt-button>
    <!-- @slot Omega (right) content slot -->
    <slot name="omega">
      <dt-dropdown v-if="!omegaId && $slots.dropdownList">
        <template #anchor="{ attrs }">
          <split-button-omega
            v-bind="{ ...attrs, ...omegaButtonProps }"
            @click="(e) => $emit('omega-clicked', e)"
          >
            <template #icon>
              <!-- @slot Omega (right) button icon slot -->
              <slot name="omegaIcon" />
            </template>
          </split-button-omega>
        </template>
        <template #list>
          <!-- @slot Built-in dropdown contents -->
          <slot name="dropdownList" />
        </template>
      </dt-dropdown>

      <split-button-omega
        v-else
        v-bind="omegaButtonProps"
        @click="(e) => $emit('omega-clicked', e)"
      >
        <template #icon>
          <!-- @slot Omega (right) button icon slot -->
          <slot name="omegaIcon" />
        </template>
      </split-button-omega>
    </slot>
  </span>
</template>

<script>
import {
  DtButton,
  BUTTON_IMPORTANCE_MODIFIERS,
  BUTTON_KIND_MODIFIERS,
  BUTTON_SIZE_MODIFIERS,
  ICON_POSITION_MODIFIERS,
} from '@/components/button';
import SplitButtonOmega from './split_button-omega.vue';
import { DtDropdown } from '@/components/dropdown';

export default {
  name: 'DtSplitButton',

  components: {
    DtButton,
    SplitButtonOmega,
    DtDropdown,
  },

  props: {
    /**
     * Determines whether the alpha button should have active styling
     * default is false.
     * @values true, false
     */
    alphaActive: {
      type: Boolean,
      default: false,
    },

    /**
     * Descriptive label for the alpha button
     */
    alphaAriaLabel: {
      type: String,
      default: null,
    },

    /**
     * The position of the icon slot within the alpha button.
     * @values left, right, top, bottom
     */
    alphaIconPosition: {
      type: String,
      default: 'left',
      validator: (position) => Object.keys(ICON_POSITION_MODIFIERS).includes(position),
    },

    /**
     * Used to customize the alpha label container
     */
    alphaLabelClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Whether the alpha button should display a loading animation or not.
     * @values true, false
     */
    alphaLoading: {
      type: Boolean,
      default: false,
    },

    /**
     * Text shown in tooltip when you hover the alpha button
     */
    alphaTooltipText: {
      type: String,
      default: '',
    },

    /**
     * Determines whether a screenreader reads live updates of
     * the button content to the user while the button
     * is in focus. default is to not.
     * @values true, false
     */
    assertiveOnFocus: {
      type: Boolean,
      default: false,
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
     * Determines whether the omega button should have active styling
     * default is false.
     * @values true, false
     */
    omegaActive: {
      type: Boolean,
      default: false,
    },

    /**
     * Descriptive label for the omega button
     */
    omegaAriaLabel: {
      type: String,
      default: null,
    },

    /**
     * Element ID, useful in case you need to reference the button
     * as an external anchor for popover
     */
    omegaId: {
      type: String,
      default: undefined,
    },

    /**
     * Text shown in tooltip when you hover the omega button
     */
    omegaTooltipText: {
      type: String,
      default: '',
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
  },

  emits: [
    /**
     * Native alpha button click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'alpha-clicked',

    /**
     * Native omega button click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'omega-clicked',
  ],

  computed: {
    omegaButtonProps () {
      return {
        id: this.omegaId,
        tooltipText: this.omegaTooltipText,
        size: this.size,
        active: this.omegaActive,
        ariaLabel: this.omegaAriaLabel,
        disabled: this.disabled,
        importance: this.importance,
        kind: this.kind,
      };
    },
  },

  methods: {
    handleClick (side, event) {
      this.$emit(`${side}-clicked`, event);
    },
  },
};
</script>
