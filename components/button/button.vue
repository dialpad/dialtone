<template>
  <button
    :class="['base-button__button', buttonClasses]"
    :type="type"
    :aria-live="computedAriaLive"
    v-on="buttonListeners"
  >
    <!-- NOTE(cormac): This span is needed since we can't apply styles to slots. -->
    <span
      v-if="$slots.icon"
      :class="['base-button__icon', iconClasses]"
    >
      <!-- @slot Button icon -->
      <slot
        name="icon"
      />
    </span>
    <span
      :class="['base-button__label', 'd-btn__label']"
    >
      <slot />
    </span>
  </button>
</template>

<script>
import Vue from 'vue';

export const BUTTON_SIZE_MODIFIERS = {
  xs: 'd-btn--xs',
  sm: 'd-btn--sm',
  md: '',
  lg: 'd-btn--lg',
  xl: 'd-btn--xl',
};

export const BUTTON_KIND_MODIFIERS = {
  default: '',
  danger: 'd-btn--danger',
  inverted: 'd-btn--inverted',
};

export const BUTTON_IMPORTANCE_MODIFIERS = {
  clear: '',
  primary: 'd-btn--primary',
  outlined: 'd-btn--outlined',
};

export const BUTTON_TYPES = ['submit', 'reset', 'button'];

export const ICON_POSITION_MODIFIERS = {
  left: 'd-btn__icon--left',
  right: 'd-btn__icon--right',
};

export const LINK_KIND_MODIFIERS = {
  default: 'd-link',
  warning: 'd-link--warning',
  danger: 'd-link--danger',
  success: 'd-link--success',
  muted: 'd-link--muted',
  inverted: 'd-link--inverted',
};

export const INVALID_COMBINATION = [
  { circle: true, kind: 'default', importance: 'primary', message: invalidCombinationMessage(true, 'default', 'primary') },
  { circle: true, kind: 'danger', importance: 'outlined', message: invalidCombinationMessage(true, 'danger', 'outlined') },
];

function invalidCombinationMessage (circle, kind, importance) {
  return `You cannot not have a ${circle ? 'circle ' : ''}button with kind: ${kind} and importance: ${importance} as it does not exist in our design system. See https://dialpad.design/components/button for a list of available button styles`;
}

function isInvalidPropCombination (circle, kind, importance) {
  for (const row of INVALID_COMBINATION) {
    if (circle === row.circle && kind === row.kind && importance === row.importance) {
      console.error(invalidCombinationMessage(circle, kind, importance));
      return false;
    }
  }
  return true;
}

/**
 * Base Vue component for Dialtone Buttons.
 * @displayName HSButton
 */
export default {
  name: 'HsButton',

  props: {
    /**
     * Whether the button is a circle or not.
     * @values true, false
     * @see https://dialpad.design/components/button/
     */
    circle: {
      type: Boolean,
      default: false,
    },

    /**
     * The position of the icon slot within the button.
     * @values left, right
     * @see https://dialpad.design/components/button/
     */
    iconPosition: {
      type: String,
      default: 'left',
      validator: (position) => Object.keys(ICON_POSITION_MODIFIERS).includes(position),
    },

    /**
     * The fill and outline of the button associated with its visual importance.
     * @values clear, outlined, primary
     * @see https://dialpad.design/components/button/
     */
    importance: {
      type: String,
      default: 'primary',
      validator: (i) => Object.keys(BUTTON_IMPORTANCE_MODIFIERS).includes(i),
    },

    /**
     * Whether the button should be styled as a link or not.
     * @values true, false
     * @see https://dialpad.design/components/link
     */
    link: {
      type: Boolean,
      default: false,
    },

    /**
     * The color of the link and button if the button is styled as a link.
     * @values danger, dark, default, success, warning
     * @see https://dialpad.design/components/link
     */
    linkKind: {
      type: String,
      default: 'default',
      validator: (lk) => Object.keys(LINK_KIND_MODIFIERS).includes(lk),
    },

    /**
     * The HTML button type attribute.
     * @values button, submit, reset
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button
     */
    type: {
      type: String,
      default: 'button',
      validator: (t) => BUTTON_TYPES.includes(t),
    },

    /**
     * The size of the button.
     * @values xs, s, md, lg, xl
     * @see https://dialpad.design/components/button
     */
    size: {
      type: String,
      default: 'md',
      validator: (s) => Object.keys(BUTTON_SIZE_MODIFIERS).includes(s),
    },

    /**
     * Whether the button should display a loading animation or not.
     * @values true, false
     * @see https://dialpad.design/components/button
     */
    loading: {
      type: Boolean,
      default: false,
    },

    /**
     * The color of the button.
     * @values default, danger, inverted
     * @see https://dialpad.design/components/button
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
  },

  emits: ['focusout', 'focusin'],

  data () {
    return {
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

    buttonClasses () {
      if (this.link) {
        return ['d-link', LINK_KIND_MODIFIERS[this.linkKind], BUTTON_SIZE_MODIFIERS[this.size]];
      }
      return ['d-btn', BUTTON_IMPORTANCE_MODIFIERS[this.importance], BUTTON_KIND_MODIFIERS[this.kind], BUTTON_SIZE_MODIFIERS[this.size], { 'd-btn--circle': this.circle, 'd-btn--loading': this.loading }];
    },

    iconClasses () {
      return ['d-btn__icon', ICON_POSITION_MODIFIERS[this.iconPosition]];
    },
  },

  watch: {
    $props: {
      immediate: true,
      handler () {
        if (process.env.NODE_ENV === 'production') return;

        if (this.circle && this.link) {
          Vue.util.warn('You cannot enable circle and link at the same time', this);
        }

        isInvalidPropCombination(this.circle, this.kind, this.importance);
      },
    },
  },
};
</script>
