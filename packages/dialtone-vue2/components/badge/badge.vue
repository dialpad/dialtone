<template>
  <span
    :class="[
      'd-badge',
      BADGE_TYPE_MODIFIERS[type],
      BADGE_KIND_MODIFIERS[kind],
      BADGE_DECORATION_MODIFIERS[decoration],
      { 'd-badge--subtle': subtle },
      { 'd-badge--outlined': outlined },
    ]"
    data-qa="dt-badge"
  >
    <span
      v-if="decoration"
      class="d-badge__decorative"
    />
    <span
      v-if="hasLeftIcon"
      class="d-badge__icon-left"
    >
      <!-- @slot Slot for left icon, icon-size slot prop defaults to '200' -->
      <slot
        name="leftIcon"
        :icon-size="'200'"
      />
    </span>
    <span :class="['d-badge__label', labelClass]">
      <!-- @slot Slot for badge content, defaults to text prop -->
      <slot>
        {{ text }}
      </slot>
    </span>
    <span
      v-if="hasRightIcon"
      class="d-badge__icon-right"
    >
      <!-- @slot Slot for right icon, icon-size slot prop defaults to '200' -->
      <slot
        name="rightIcon"
        :icon-size="'200'"
      />
    </span>
  </span>
</template>

<script>
import { BADGE_TYPE_MODIFIERS, BADGE_KIND_MODIFIERS, BADGE_DECORATION_MODIFIERS } from './badge_constants';

/**
 * A badge is a compact UI element that provides brief, descriptive information about an element.
 * It is terse, ideally one word.
 * @see https://dialtone.dialpad.com/components/badge.html
 */
export default {
  name: 'DtBadge',

  props: {
    /**
     * Text for the badge content
     */
    text: {
      type: String,
      default: '',
    },

    /**
     * The kind of badge which determines the styling
     * @values label, count
     */
    kind: {
      type: String,
      default: 'label',
      validator: (kind) => Object.keys(BADGE_KIND_MODIFIERS).includes(kind),
    },

    /**
     * Color for the badge background
     * @values default, info, success, warning, critical, bulletin, ai
     */
    type: {
      type: String,
      default: 'default',
      validator: (type) => Object.keys(BADGE_TYPE_MODIFIERS).includes(type),
    },

    /**
     * Decoration for the badge. This can be only used with kind: label and type: default
     * with no left and right icons
     * @values default, black-400, black-500, black-900, red-200, red-300, red-400, purple-200,
     * purple-300, purple-400, purple-500, blue-200, blue-300, blue-400, green-300, green-400,
     * green-500, gold-300, gold-400, gold-500, magenta-200, magenta-300, magenta-400
     */
    decoration: {
      type: String,
      default: undefined,
      validator: (type) => Object.keys(BADGE_DECORATION_MODIFIERS).includes(type),
    },

    /**
     * Used to customize the label container
     */
    labelClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Shows a subtle appearance for the badge
     * Currently only affects the badge when type is bulletin.
     */
    subtle: {
      type: Boolean,
      default: false,
    },

    /**
     * Outlines the badge with a border
     */
    outlined: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      BADGE_TYPE_MODIFIERS,
      BADGE_KIND_MODIFIERS,
      BADGE_DECORATION_MODIFIERS,
    };
  },

  computed: {
    hasLeftIcon () {
      return this.$scopedSlots.leftIcon && this.$scopedSlots.leftIcon();
    },

    hasRightIcon () {
      return this.$scopedSlots.rightIcon && this.$scopedSlots.rightIcon();
    },

    hasIcons () {
      return this.hasLeftIcon || this.hasRightIcon;
    },
  },

  updated () {
    this.validateProps();
  },

  methods: {
    validateProps () {
      this.validateTypePropCombination();
      this.validateDecorationPropCombination();
    },

    validateTypePropCombination () {
      if (this.type === 'ai' && this.kind === 'count') {
        console.error('DtBadge error: type: \'ai\' with kind: \'count\' is an invalid combination.');
      }
      if (this.type !== 'bulletin' && this.subtle) {
        console.error('DtBadge error: subtle can only be used with type \'bulletin\'');
      }
    },

    validateDecorationPropCombination () {
      if (!this.decoration) return;

      if (this.kind !== 'label' || this.type !== 'default') {
        console.error('DtBadge error: decoration prop can only be used with kind: \'label\' and type: \'default\'.');
      }

      if (this.hasIcons) {
        console.error('DtBadge error: decoration prop cannot be used with leftIcon or rightIcon.');
      }
    },
  },
};
</script>
