<template>
  __SVG_CONTENT__
</template>

<script>
import { getUniqueString } from '../utils';
import { ICON_SIZE_MODIFIERS } from '../constants';

export default {
  name: '__ICON_NAME__',

  props: {
    /**
     * The size of the icon.
     * @values 100, 200, 300, 400, 500, 600, 700, 800
     */
    size: {
      type: String,
      default: '500',
      validator: (s) => Object.keys(ICON_SIZE_MODIFIERS).includes(s),
    },

    /**
     * The label of the icon as read out by a screenreader. Leave this unset if your icon is purely presentational
     */
    ariaLabel: {
      type: String,
      default: undefined,
    },
  },

  /**
  * @TODO: Remove this emit once the icons migration is complete,
  * they will no longer need this event.
  * */
  emits: ['loaded'],

  computed: {
    iconSizeClass () {
      return ICON_SIZE_MODIFIERS[this.size];
    },

    ariaHidden () {
      return !this.ariaLabel ? 'true' : 'false';
    },
  },

  created () {
    this.$emit('loaded');
    this.uniqueID = getUniqueString();
  },
};
</script>
