<template>
  <div>
    <dt-link
      v-for="kind in LINK_VARIANTS"
      :key="kind"
      href="#"
      :kind="kind"
      class="d-tt-capitalize d-mr8"
    >
      {{ kind }} link
    </dt-link>
    <div class="d-bgc-purple-600">
      <dt-link
        v-for="kind in LINK_VARIANTS"
        :key="kind"
        inverted
        href="#"
        :kind="kind"
        class="d-tt-capitalize d-mr8"
      >
        Inverted {{ kind }} link
      </dt-link>
    </div>
  </div>
</template>

<script>
import DtLink from './link.vue';
import { LINK_VARIANTS } from './link_constants';

export default {
  name: 'DtLinkVariants',
  components: { DtLink },
  data () {
    return {
      LINK_VARIANTS,
    };
  },
};
</script>
