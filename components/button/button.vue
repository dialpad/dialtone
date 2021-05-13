<template>
  <button
    :class="['base-button__button', ...buttonClasses]"
    :type="type"
    :aria-live="computedAriaLive"
    v-on="buttonListeners"
  >
    <!-- NOTE(cormac): This span is needed since we can't apply styles to slots. -->
    <span
      v-if="hasIconSlot"
      :class="['base-button__icon', 'd-btn__icon', iconPositionClass]"
    >
      <!-- @slot Button icon -->
      <slot
        name="icon"
      />
    </span>
    <span
      v-if="hasIconSlot"
      :class="['base-button__label', 'd-btn__label', ...labelPositionClasses]"
    >
      <slot />
    </span>
    <!-- @slot Button content -->
    <slot v-else />
  </button>
</template>

<script>
import Vue from 'vue';

export const BUTTON_SIZE_MODIFIERS = {
  xs: '--xs',
  sm: '--sm',
  md: '',
  lg: '--lg',
  xl: '--xl',
};

export const BUTTON_KIND_MODIFIERS = {
  default: '',
  danger: '--danger',
  inverted: '--inverted',
};

export const BUTTON_IMPORTANCE_MODIFIERS = {
  clear: '',
  primary: '--primary',
  outlined: '--outlined',
};

export const BUTTON_TYPES = ['submit', 'reset', 'button'];

export const ICON_POSITIONS = ['left-align', 'split-left', 'center-align', 'right-align'];

export const LINK_KIND_MODIFIERS = {
  default: '',
  warning: '--warning',
  danger: '--danger',
  success: '--success',
  dark: '--dark',
};

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
     * @see https://dialpad.design/components/buttons/
     */
    circle: {
      type: Boolean,
      default: false,
    },

    /**
     * The position of the icon slot within the button.
     * @values left, split-left, center, right
     * @see https://dialpad.design/components/buttons/
     */
    iconPosition: {
      type: String,
      default: 'center-align',
      validator: (position) => ICON_POSITIONS.includes(position),
    },

    /**
     * The fill and outline of the button associated with its visual importance.
     * @values clear, outlined, primary
     * @see https://dialpad.design/components/buttons/
     */
    importance: {
      type: String,
      default: 'primary',
      validator: (i) => Object.keys(BUTTON_IMPORTANCE_MODIFIERS).includes(i),
    },

    /**
     * Whether the button should be styled as a link or not.
     * @values true, false
     * @see https://dialpad.design/components/links/#
     */
    link: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether the link should be inverted if the button is styled as a link.
     * @values true, false
     * @see https://dialpad.design/components/links/#
     */
    linkInverted: {
      type: Boolean,
      default: false,
    },

    /**
     * The color of the link and button if the button is styled as a link.
     * @values danger, dark, default, success, warning
     * @see https://dialpad.design/components/links/#
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
     * @see https://dialpad.design/components/buttons/
     */
    size: {
      type: String,
      default: 'md',
      validator: (s) => Object.keys(BUTTON_SIZE_MODIFIERS).includes(s),
    },

    /**
     * Whether the button should display a loading animation or not.
     * @values true, false
     * @see https://dialpad.design/components/buttons/
     */
    loading: {
      type: Boolean,
      default: false,
    },

    /**
     * The color of the button.
     * @values default, danger, inverted
     * kind - default, danger, or inverted (https://dialpad.design/components/buttons/)
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
      const classes = this.link
        ? [this.buttonLinkClass]
        : [this.buttonMainClass, this.buttonSizeClass];

      return [...classes, this.buttonIconPositionClass];
    },

    buttonMainClass () {
      const shape = this.circle ? '--circle' : '';
      const kind = BUTTON_KIND_MODIFIERS[this.kind] || '';
      const importance = BUTTON_IMPORTANCE_MODIFIERS[this.importance] || '';
      const loading = this.loading ? '--loading' : '';

      // Button class structure: .d-btn--shape--kind--importance--state
      return `d-btn${shape}${kind}${importance}${loading}`;
    },

    buttonLinkClass () {
      const inverted = this.linkInverted ? '--inverted' : '';
      const linkKind = LINK_KIND_MODIFIERS[this.linkKind] || '';

      // Link class structure: .d-link--inverted--kind
      return `d-link${inverted}${linkKind}`;
    },

    buttonSizeClass () {
      const shape = this.circle ? '--circle' : '';
      const size = BUTTON_SIZE_MODIFIERS[this.size] || '';

      // Size class structure: .d-btn--shape--size
      return `d-btn${shape}${size}`;
    },

    buttonIconPositionClass () {
      // Note(cormac): When it has an icon, a button only needs extra styling if its icon is positioned left-align.
      if (this.hasIconSlot && this.iconPosition === 'left-align') {
        return 'button__left-align';
      }

      return '';
    },

    hasIconSlot () {
      return !!this.$slots.icon;
    },

    iconPositionClass () {
      // Note(cormac): When a button has an icon, the icon only needs extra styling when it's positioned right-align.
      if (this.hasIconSlot && this.iconPosition === 'right-align') {
        return 'd-btn__icon--last';
      }

      return '';
    },

    labelPositionClasses () {
      if (!this.hasIconSlot) {
        return [];
      }

      const classes = [];
      if (this.iconPosition === 'split-left' || this.iconPosition === 'right-align') {
        classes.push('d-flex1');
      }
      if (this.iconPosition === 'right-align') {
        classes.push('button__label__right-align');
      }
      return classes;
    },
  },

  created: function () {
    if (process.env.NODE_ENV === 'production') return;

    if (this.isUnsupportedCircleButton()) {
      Vue.util.warn(`Unsupported button: primary \
d-btn--circle and outlined d-btn--circle--danger are not supported.`, this);
    }
    if (this.isUnsupportedInvertedLink()) {
      Vue.util.warn('Unsupported link: inverted link is neither d-link--inverted nor d-link--inverted--danger.', this);
    }
    if (this.circle && this.link) {
      Vue.util.warn('Unsupported link: circle d-link is not supported.', this);
    }
  },

  methods: {
    isUnsupportedCircleButton () {
      // Caveat: d-btn--circle can't be primary and d-btn--circle--danger can't be outlined.
      const isBtnCirclePrimary = this.circle && this.kind === 'default' && this.importance === 'primary';
      const isBtnCircleDangerOutlined = this.circle && this.kind === 'danger' && this.importance === 'outlined';

      return isBtnCirclePrimary || isBtnCircleDangerOutlined;
    },

    isUnsupportedInvertedLink () {
      return this.linkInverted && this.linkKind !== 'danger' && this.linkKind !== 'default';
    },
  },
};
</script>

<style lang="less">
  @import '../../css/dialtone.less';

  .button__left-align,
  .button__label__right-align {
    .d-jc-flex-start();
  }
</style>
