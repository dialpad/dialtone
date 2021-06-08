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
