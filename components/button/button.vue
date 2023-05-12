<template>
  <button
    :class="[
      'base-button__button',
      buttonClasses(),
    ]"
    data-qa="dt-button"
    :type="type"
    :disabled="disabled"
    :style="{ width: width }"
    :aria-live="computedAriaLive"
    :aria-label="loading ? 'loading' : $attrs['aria-label']"
    v-on="buttonListeners"
  >
    <!-- NOTE(cormac): This span is needed since we can't apply styles to slots. -->
    <span
      v-if="shouldRenderIcon()"
      data-qa="dt-button-icon"
      :class="[
        'base-button__icon',
        'd-btn__icon',
        ICON_POSITION_MODIFIERS[iconPosition],
      ]"
    >
      <!-- @slot Button icon -->
      <slot
        name="icon"
      />
    </span>
    <span
      v-if="$slots.default"
      data-qa="dt-button-label"
      :class="['d-btn__label', 'base-button__label', labelClass]"
    >
      <!-- @slot Content within button -->
      <slot />
    </span>
  </button>
</template>

<script>
import Vue from 'vue';

import {
  BUTTON_SIZE_MODIFIERS,
  BUTTON_KIND_MODIFIERS,
  BUTTON_IMPORTANCE_MODIFIERS,
  BUTTON_TYPES,
  ICON_POSITION_MODIFIERS,
  INVALID_COMBINATION,
} from './button_constants';

import { LINK_KIND_MODIFIERS } from '../link/link_constants';

/**
 * A button is a UI element which allows users to take an action throughout the app.
 * It is important a button is identifiable, consistent, and communicates its actions clearly,
 * and is appropriately sized to its action.
 * @see https://dialpad.design/components/button.html
 */
export default {
  name: 'DtButton',

  props: {
    /**
     * Whether the button is a circle or not.
     * @values true, false
     */
    circle: {
      type: Boolean,
      default: false,
    },

    /**
     * The position of the icon slot within the button.
     * @values left, right, top, bottom
     */
    iconPosition: {
      type: String,
      default: 'left',
      validator: (position) => Object.keys(ICON_POSITION_MODIFIERS).includes(position),
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
     * Whether the button should be styled as a link or not.
     * @values true, false
     * @see https://dialpad.design/components/link.html
     */
    link: {
      type: Boolean,
      default: false,
    },

    /**
     * The color of the link and button if the button is styled as a link.
     * @values default, warning, danger, success, muted, inverted
     * @see https://dialpad.design/components/link.html
     */
    linkKind: {
      type: String,
      default: 'default',
      validator: (lk) => Object.keys(LINK_KIND_MODIFIERS).includes(lk),
    },

    /**
     * HTML button disabled attribute
     * <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#disabled" target="_blank">
     *   (Reference)
     * </a>
     * @values true, false
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * HTML button type attribute
     * <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type" target="_blank">
     *   (Reference)
     * </a>
     * @values button, submit, reset
     */
    type: {
      type: String,
      default: 'button',
      validator: (t) => BUTTON_TYPES.includes(t),
    },

    /**
     * Button width, accepts
     * <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/width" target="_blank">
     *   CSS width attribute
     * </a>
     * values
     */
    width: {
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
      validator: (s) => Object.keys(BUTTON_SIZE_MODIFIERS).includes(s),
    },

    /**
     * Used to customize the label container
     */
    labelClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Whether the button should display a loading animation or not.
     * @values true, false
     */
    loading: {
      type: Boolean,
      default: false,
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
     * Determines whether the button should have active styling
     * default is false.
     * @values true, false
     */
    active: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
    /**
     * Native button click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',

    /**
     * Native button focus in event
     *
     * @event focusin
     * @type {FocusEvent}
     */
    'focusin',

    /**
     * Native button focus out event
     *
     * @event focusout
     * @type {FocusEvent}
     */
    'focusout',
  ],

  data () {
    return {
      ICON_POSITION_MODIFIERS,
      // whether the button is currently in focus
      isInFocus: false,
    };
  },

  computed: {

    buttonListeners () {
      if (!this.assertiveOnFocus) {
        return this.$listeners;
      }
      return {
        ...this.$listeners,
        focusin: (e) => {
          this.isInFocus = true;
        },

        focusout: (e) => {
          this.isInFocus = false;
        },
      };
    },

    computedAriaLive () {
      return this.assertiveOnFocus && this.isInFocus ? 'assertive' : this.$attrs.ariaLive;
    },
  },

  watch: {
    $props: {
      deep: true,
      immediate: true,
      handler () {
        if (process.env.NODE_ENV === 'production') return;

        if (this.circle && this.link) {
          Vue.util.warn('You cannot enable circle and link at the same time', this);
        }

        this.isInvalidPropCombination(this.circle, this.kind, this.importance);
      },
    },
  },

  methods: {
    buttonClasses () {
      if (this.link) {
        return [
          'd-link',
          LINK_KIND_MODIFIERS[this.linkKind],
          BUTTON_SIZE_MODIFIERS[this.size],
        ];
      }
      return [
        'd-btn',
        BUTTON_IMPORTANCE_MODIFIERS[this.importance],
        BUTTON_KIND_MODIFIERS[this.kind],
        BUTTON_SIZE_MODIFIERS[this.size],
        {
          'd-btn--circle': this.circle,
          'd-btn--loading': this.loading,
          'd-btn--icon-only': this.isIconOnly(),
          'd-btn--vertical': this.isVerticalIconLayout(),
          'd-btn--active': this.active,
        },
      ];
    },

    isInvalidPropCombination (circle, kind, importance) {
      for (const row of INVALID_COMBINATION) {
        if (circle === row.circle && kind === row.kind && importance === row.importance) {
          console.error(row.message);
          return false;
        }
      }
      return true;
    },

    shouldRenderIcon () {
      return this.$slots.icon && !this.link;
    },

    isIconOnly () {
      return this.shouldRenderIcon() && !this.$slots.default;
    },

    isVerticalIconLayout () {
      return this.shouldRenderIcon() && !this.isIconOnly() && ['top', 'bottom'].includes(this.iconPosition);
    },
  },
};
</script>
