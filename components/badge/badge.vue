<template>
  <span
    :class="[
      'd-badge',
      BADGE_COLOR_MODIFIERS[color],
    ]"
    data-qa="dt-badge"
  >
    <!-- @slot Slot for badge content, defaults to text prop -->
    <slot>
      {{ text }}
    </slot>
  </span>
</template>

<script>
import { BADGE_COLOR_MODIFIERS } from './badge_constants.js';

/**
 * A badge is a compact UI element that provides brief, descriptive information about an element.
 * It is terse, ideally one word.
 * @see https://dialpad.design/components/badge.html
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
     * Color for the badge background
     * @values base, black-700, green-400, orange-400,
     * pink-300, pink-500, pink-600, pink-700,
     * purple-100, purple-300, purple-500, purple-700,
     * red-500, white, yellow-300
     */
    color: {
      type: String,
      default: 'base',
      validator: (color) => Object.keys(BADGE_COLOR_MODIFIERS).includes(color),
    },
  },

  data () {
    return {
      BADGE_COLOR_MODIFIERS,
    };
  },
};
</script>
