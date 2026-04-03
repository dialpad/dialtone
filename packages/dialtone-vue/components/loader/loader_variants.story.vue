<template>
  <dt-stack
    class="d-br d-pie-200"
    gap="200"
  >
    <h2>Sizes</h2>
    <dt-stack
      v-for="size in sizes"
      :key="size"
      direction="row"
      gap="200"
    >
      {{ size }}
      <dt-loader
        :size="size"
      />
    </dt-stack>
  </dt-stack>
</template>

<script>
import DtLoader from './loader.vue';
import DtStack from '@/components/stack/stack.vue';
import { ICON_SIZE_MODIFIERS } from '@/components/icon';

export default {
  name: 'DtLoaderVariants',
  components: { DtStack, DtLoader },
  data () {
    return {
      sizes: Object.keys(ICON_SIZE_MODIFIERS),
    };
  },
};
</script>
