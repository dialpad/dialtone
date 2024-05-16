<template>
  __SVG_CONTENT__
</template>

<script>
import { getUniqueString } from '@/src/utils';

export default {
  name: '__ILLUSTRATION_NAME__',

  props: {
    /**
     * The label of the illustration as read out by a screenreader. Leave this unset if your illustration is purely presentational
     */
    ariaLabel: {
      type: String,
      default: undefined,
    },
  },

  /**
  * @TODO: Remove this emit once the illustrations migration is complete,
  * they will no longer need this event.
  * */
  emits: ['loaded'],

  computed: {
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
