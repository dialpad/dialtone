<template>
  <div>
    <dt-link
      v-for="kind in filteredKindClasses"
      :key="kind"
      href="#"
      :kind="kind"
      class="d-tt-capitalize d-mr8"
    >
      {{ kind }} link
    </dt-link>
    <div class="d-bgc-purple-600">
      <dt-link
        kind="inverted"
        href="#"
        class="d-tt-capitalize"
      >
        Inverted link
      </dt-link>
    </div>
  </div>
</template>

<script>
import DtLink from './link';
import { LINK_VARIANTS, INVERTED } from './link_constants';

export default {
  name: 'DtLinkVariants',
  components: { DtLink },
  data () {
    return {
      LINK_VARIANTS,
    };
  },

  computed: {
    filteredKindClasses () {
      return LINK_VARIANTS.filter(kind => kind !== INVERTED);
    },
  },
};
</script>
