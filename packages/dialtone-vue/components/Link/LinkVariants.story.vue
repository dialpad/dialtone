<template>
  <div>
    <dt-stack
      gap="100"
    >
      <dt-stack
        class="d-fw-wrap"
        direction="row"
        gap="100"
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
import DtLink from './Link.vue';
import DtStack from '../Stack/Stack.vue';
import { LINK_VARIANTS } from './LinkConstants';

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
