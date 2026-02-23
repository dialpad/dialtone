<template>
  <div>
    <dt-stack
      gap="400"
    >
      <dt-stack
        class="d-fw-wrap"
        direction="row"
        gap="400"
        align="baseline"
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
      <dt-stack
        class="d-fw-wrap"
        direction="row"
        gap="400"
        align="baseline"
      >
        <dt-link
          href="#"
          :underline="false"
        >
          No underline {{ kind }} link
        </dt-link>
      </dt-stack>
    </dt-stack>
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
