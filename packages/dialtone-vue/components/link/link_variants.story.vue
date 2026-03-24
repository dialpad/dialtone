<template>
  <div>
    <dt-stack
      gap="100"
      direction="row"
      class="d-p8"
    >
      <dt-link
        v-for="kind in LINK_VARIANTS"
        :key="kind"
        href="#"
        :kind="kind"
      >
        {{ kind }} link
      </dt-link>
    </dt-stack>
    <div class="d-bgc-contrast">
      <dt-stack
        gap="100"
        direction="row"
        class="d-p8"
      >
        <dt-link
          v-for="kind in LINK_VARIANTS"
          :key="kind"
          inverted
          href="#"
          :kind="kind"
        >
          {{ kind }} inverted
        </dt-link>
      </dt-stack>
    </div>
  </div>
</template>

<script>
import DtLink from './link.vue';
import DtStack from '../stack/stack.vue';
import { LINK_VARIANTS } from './link_constants';

export default {
  name: 'DtLinkVariants',
  components: { DtLink, DtStack },
  data () {
    return {
      LINK_VARIANTS,
    };
  },
};
</script>
