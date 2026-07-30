<template>
  <component
    :is="computedTag"
    :class="[
      'base-button__button',
      buttonClasses(),
    ]"
    data-qa="dt-button"
    :style="{ width: width }"
    :aria-live="computedAriaLive"
    :aria-label="loading ? i18n.$t('DIALTONE_LOADING') : $attrs['aria-label']"
    v-bind="computedAttrs"
    v-on="computedListeners"
  >
    <dt-loader
      v-if="loading && kind !== 'unstyled'"
      class="d-btn__loader"
      :size="loaderSize"
      aria-hidden="true"
    />
    <span
      v-if="hasSlotContent($slots.leading)"
      :class="['d-btn__leading', leadingClass]"
    >
      <!-- @slot Optional leading content at the start of the button, such as badges or indicators -->
      <slot name="leading" />
    </span>
    <!-- NEW: Block-start icon slot (above label) -->
    <span
      v-if="hasSlotContent($slots.blockStartIcon)"
      data-qa="dt-button-block-start-icon"
      :class="[
        'base-button__icon',
        {
          'd-btn__icon': kind !== 'unstyled',
          'd-btn__icon--top': kind !== 'unstyled',
        },
        blockStartIconClass,
      ]"
    >
      <!-- @slot Icon displayed above the button label (block-start) -->
      <slot
        name="blockStartIcon"
        :icon-size="iconSize"
      />
    </span>
    <!-- NEW: Start icon slot -->
    <span
      v-if="hasSlotContent($slots.startIcon)"
      data-qa="dt-button-start-icon"
      :class="[
        'base-button__icon',
        {
          'd-btn__icon': kind !== 'unstyled',
          'd-btn__icon--left': kind !== 'unstyled',
        },
        startIconClass,
      ]"
    >
      <!-- @slot Icon displayed at the start (aka left) of the button -->
      <slot
        name="startIcon"
        :icon-size="iconSize"
      />
    </span>
    <!-- NOTE(cormac): This span is needed since we can't apply styles to slots. -->
    <span
      v-if="shouldRenderLegacyIcon()"
      data-qa="dt-button-icon"
      :class="[
        'base-button__icon',
        {
          'd-btn__icon': kind !== 'unstyled',
          [ICON_POSITION_MODIFIERS[iconPosition]]: kind !== 'unstyled',
        },
        iconClass,
      ]"
    >
      <!-- @slot Button icon -->
      <slot
        name="icon"
        :icon-size="iconSize"
      />
    </span>
    <span
      v-if="hasSlotContent($slots.default)"
      data-qa="dt-button-label"
      :class="[
        'base-button__label',
        { 'd-btn__label': kind !== 'unstyled' },
        labelClass,
      ]"
    >
      <!-- @slot Content within button -->
      <slot />
    </span>
    <!-- NEW: End icon slot -->
    <span
      v-if="hasSlotContent($slots.endIcon)"
      data-qa="dt-button-end-icon"
      :class="[
        'base-button__icon',
        {
          'd-btn__icon': kind !== 'unstyled',
          'd-btn__icon--right': kind !== 'unstyled',
        },
        endIconClass,
      ]"
    >
      <!-- @slot Icon displayed at the end (aka right) of the button -->
      <slot
        name="endIcon"
        :icon-size="iconSize"
      />
    </span>
    <!-- NEW: Block-end icon slot (below label) -->
    <span
      v-if="hasSlotContent($slots.blockEndIcon)"
      data-qa="dt-button-block-end-icon"
      :class="[
        'base-button__icon',
        {
          'd-btn__icon': kind !== 'unstyled',
          'd-btn__icon--bottom': kind !== 'unstyled',
        },
        blockEndIconClass,
      ]"
    >
      <!-- @slot Icon displayed below the button label (block-end) -->
      <slot
        name="blockEndIcon"
        :icon-size="iconSize"
      />
    </span>
    <span
      v-if="hasSlotContent($slots.trailing)"
      :class="['d-btn__trailing', trailingClass]"
    >
      <!-- @slot Optional trailing content at the end of the button, such as badges or indicators -->
      <slot name="trailing" />
    </span>
  </component>
</template>

<script>
import { warn, resolveComponent } from 'vue';
import { hasSlotContent } from '@/common/utils';
import { ordinalSizeValidator } from '@/common/validators';
import DtLoader from '@/components/Loader/Loader.vue';

import {
  BUTTON_SIZE_MODIFIERS,
  BUTTON_KIND_MODIFIERS,
  BUTTON_IMPORTANCE_MODIFIERS,
  BUTTON_ICON_SIZES,
  BUTTON_TYPES,
  ICON_POSITION_MODIFIERS,
  INVALID_COMBINATION,
} from './ButtonConstants';

import { LINK_KIND_MODIFIERS, getLinkKindModifier } from '@/components/Link';
import { DialtoneLocalization } from '@/localization';

/**
 * A button is a UI element which allows users to take an action throughout the app.
 * It is important a button is identifiable, consistent, and communicates its actions clearly,
 * and is appropriately sized to its action.
 * @see https://dialtone.dialpad.com/components/button.html
 */
export default {
  name: 'DtButton',

  components: { DtLoader },

  props: {
    /**
     * Whether the button is a circle or not. Use only with icon-only buttons.
     * @values true, false
     */
    circle: {
      type: Boolean,
      default: false,
    },

    /**
     * The position of the icon slot within the button.
     * @deprecated Use startIcon / endIcon / blockStartIcon / blockEndIcon slots instead.
     * @values start, end, blockStart, blockEnd, left, right, top, bottom
     */
    iconPosition: {
      type: String,
      default: 'start',
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
     * @see DtLink
     */
    link: {
      type: Boolean,
      default: false,
    },

    /**
     * The color of the link and button if the button is styled as a link.
     * @values default, critical, warning, positive, muted, info, mention
     * @see DtLink
     */
    linkKind: {
      type: String,
      default: 'default',
      validator: (lk) => Object.keys(LINK_KIND_MODIFIERS).includes(lk),
    },

    /**
     * Determines whether the link should have inverted styling if the button is styled as a link.
     * @values true, false
     * @see DtLink
     * @deprecated Use v-dt-mode instead.
     */
    linkInverted: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines whether the link-styled button should display an underline.
     * Only applies when the link prop is true.
     * @values true, false
     */
    linkUnderline: {
      type: Boolean,
      default: true,
    },

    /**
     * @deprecated Use linkUnderline instead.
     * @values true, false
     */
    underline: {
      type: Boolean,
      default: null,
    },

    /**
     * HTML button disabled attribute
     * <a class="d-link" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#disabled" target="_blank"> (Reference) </a>
     * @values true, false
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * HTML button type attribute
     * <a class="d-link" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-type" target="_blank">(Reference)</a>
     * @values button, submit, reset
     */
    type: {
      type: String,
      default: 'button',
      validator: (t) => BUTTON_TYPES.includes(t),
    },

    /**
     * Button width, accepts
     * <a class="d-link" href="https://developer.mozilla.org/en-US/docs/Web/CSS/width" target="_blank">CSS width attribute</a> values
     */
    width: {
      type: String,
      default: null,
    },

    /**
     * The size of the button.
     * @values 100, 200, 300, 400, 500
     */
    size: {
      type: [String, Number],
      default: 300,
      validator: ordinalSizeValidator(BUTTON_SIZE_MODIFIERS),
    },

    /**
     * Used to customize the label container
     */
    labelClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Used to customize the leading container
     */
    leadingClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Used to customize the trailing container
     */
    trailingClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Used to customize the start icon container
     */
    startIconClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Used to customize the end icon container
     */
    endIconClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Used to customize the block-start (aka top) icon container
     */
    blockStartIconClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Used to customize the block-end (aka bottom) icon container
     */
    blockEndIconClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Used to customize the legacy icon container
     * @deprecated Use startIconClass or endIconClass
     */
    iconClass: {
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
     * @values default, unstyled, muted, critical, positive, inverted
     * @deprecated inverted is deprecated. Use v-dt-mode instead.
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

    /**
     * vue-router `to` prop. When provided, renders a `<router-link>`
     * for client-side SPA navigation.
     * @see https://router.vuejs.org/api/interfaces/RouterLinkProps.html#to
     */
    to: {
      type: [String, Object],
      default: null,
    },

    /**
     * When provided, renders an `<a>` element for standard browser navigation.
     */
    href: {
      type: String,
      default: null,
    },

    /**
     * HTML anchor target attribute. Only applied when using the `href` prop.
     * @values _self, _blank, _parent, _top
     */
    target: {
      type: String,
      default: null,
    },

    /**
     * HTML anchor rel attribute. Only applied when using the `href` prop.
     */
    rel: {
      type: String,
      default: null,
    },

    /**
     * vue-router `replace` prop. When true, navigation will not leave a
     * history entry. Only applied when using the `to` prop.
     * @values true, false
     */
    replace: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
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
      hasSlotContent,
      i18n: new DialtoneLocalization(),
    };
  },

  computed: {
    resolvedUnderline () {
      return this.underline ?? this.linkUnderline;
    },

    computedTag () {
      if (this.to) return this.resolveRouterLink();
      if (this.href) return 'a';
      return 'button';
    },

    isNativeButton () {
      return !this.to && !this.href;
    },

    computedAttrs () {
      if (this.to) {
        return {
          to: this.to,
          replace: this.replace,
          ...(this.disabled && { 'aria-disabled': 'true', tabindex: '-1' }),
        };
      }
      if (this.href) {
        return {
          href: this.disabled ? null : this.href,
          target: this.target,
          rel: this.rel,
          ...(this.disabled && { 'aria-disabled': 'true', tabindex: '-1' }),
        };
      }
      return {
        type: this.type,
        disabled: this.disabled,
      };
    },

    computedListeners () {
      const listeners = {
        focusin: (e) => {
          this.isInFocus = this.assertiveOnFocus;
          this.$emit('focusin', e);
        },

        focusout: (e) => {
          this.isInFocus = false;
          this.$emit('focusout', e);
        },
      };

      if (!this.isNativeButton) {
        // Prevent click when disabled for link elements.
        // stopImmediatePropagation prevents parent onClick attrs from firing.
        if (this.disabled) {
          listeners.click = (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
          };
        }

        // Space key handler: <a> only responds to Enter natively,
        // but buttons respond to both Enter and Space.
        listeners.keydown = (e) => {
          if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            if (!this.disabled) {
              e.target.click();
            }
          }
        };
      }

      return listeners;
    },

    computedAriaLive () {
      return this.assertiveOnFocus && this.isInFocus ? 'assertive' : this.$attrs.ariaLive;
    },

    iconSize () {
      return BUTTON_ICON_SIZES[String(this.size)];
    },

    loaderSize () {
      return BUTTON_ICON_SIZES[String(this.size)];
    },
  },

  watch: {
    $props: {
      deep: true,
      immediate: true,
      handler () {
        if (process.env.NODE_ENV === 'production') return;

        if (this.circle && this.link) {
          warn('You cannot enable circle and link at the same time', this);
        }

        this.isInvalidPropCombination(this.circle, this.kind, this.importance);
      },
    },
  },

  methods: {
    resolveRouterLink () {
      try {
        return resolveComponent('RouterLink');
      } catch {
        warn('DtButton: "to" prop requires vue-router. Falling back to <a>.');
        return 'a';
      }
    },

    buttonClasses () {
      if (this.link) {
        return [
          'd-link',
          getLinkKindModifier(this.linkKind, this.linkInverted),
          BUTTON_SIZE_MODIFIERS[String(this.size)],
          { 'd-link--no-underline': !this.resolvedUnderline },
        ];
      }
      if (this.kind === 'unstyled') {
        return ['d-btn--unstyled'];
      }
      return [
        'd-btn',
        BUTTON_IMPORTANCE_MODIFIERS[this.importance],
        BUTTON_KIND_MODIFIERS[this.kind],
        BUTTON_SIZE_MODIFIERS[String(this.size)],
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
      // Skip validation if unstyled is true
      if (this.kind === 'unstyled') {
        return true;
      }

      for (const row of INVALID_COMBINATION) {
        if (circle === row.circle && kind === row.kind && importance === row.importance) {
          warn(row.message);
          return false;
        }
      }
      return true;
    },

    hasStartIcon () {
      return hasSlotContent(this.$slots.startIcon);
    },

    hasEndIcon () {
      return hasSlotContent(this.$slots.endIcon);
    },

    hasBlockStartIcon () {
      return hasSlotContent(this.$slots.blockStartIcon);
    },

    hasBlockEndIcon () {
      return hasSlotContent(this.$slots.blockEndIcon);
    },

    hasNewIconSlots () {
      return this.hasStartIcon() || this.hasEndIcon() || this.hasBlockStartIcon() || this.hasBlockEndIcon();
    },

    shouldRenderLegacyIcon () {
      return hasSlotContent(this.$slots.icon) && !this.hasNewIconSlots() && !this.link;
    },

    isIconOnly () {
      return (this.hasNewIconSlots() || this.shouldRenderLegacyIcon()) && !hasSlotContent(this.$slots.default);
    },

    isVerticalIconLayout () {
      if (this.isIconOnly()) return false;
      if (this.hasBlockStartIcon() || this.hasBlockEndIcon()) return true;
      return !this.hasNewIconSlots() && ['top', 'bottom'].includes(this.iconPosition);
    },
  },
};
</script>
