<template>
  <div
    :class="[
      'd-btn-group',
      BUTTON_GROUP_ALIGNMENT[alignment],
    ]"
    role="group"
  >
    <!-- @slot Default slot for button items -->
    <slot />
  </div>
</template>

<script>
import { BUTTON_GROUP_ALIGNMENT } from './ButtonGroupConstants';

export default {
  name: 'DtButtonGroup',

  props: {
    /**
     * Alignment of the buttons inside the container
     * @values start, end, space-between
     */
    alignment: {
      type: String,
      default: 'start',
      validator: (alignment) => Object.keys(BUTTON_GROUP_ALIGNMENT).includes(alignment),
    },
  },

  data () {
    return {
      BUTTON_GROUP_ALIGNMENT,
    };
  },
};
</script>
