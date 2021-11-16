<template>
  <div id="components-badge--variants-container">
    <dt-badge
      v-for="color in colors"
      :key="color"
      :text="color"
      :color="color"
      class="d-mr8 d-mb8"
    />
  </div>
</template>

<script>
import DtBadge from './badge';
import { BADGE_COLOR_MODIFIERS } from './badge_constants';

export default {
  name: 'DtBadgeVariants',

  components: { DtBadge },

  data () {
    return {
      BADGE_COLOR_MODIFIERS,
    };
  },

  computed: {
    colors () {
      return Object.keys(BADGE_COLOR_MODIFIERS);
    },
  },
};
</script>
