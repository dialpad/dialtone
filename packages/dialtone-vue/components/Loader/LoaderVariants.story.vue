<template>
  <dt-stack
    direction="row"
    gap="500"
  >
    <dt-stack
      v-for="kind in kinds"
      :key="kind"
      class="d-br d-pie-200"
      gap="200"
    >
      <h2>Sizes ({{ kind }})</h2>
      <dt-stack
        v-for="size in sizes"
        :key="size"
        direction="row"
        gap="200"
      >
        {{ size }}
        <dt-loader
          :kind="kind"
          :size="size"
        />
      </dt-stack>
    </dt-stack>
  </dt-stack>
</template>

<script>
import DtLoader from './Loader.vue';
import DtStack from '@/components/Stack/Stack.vue';
import { ICON_SIZE_MODIFIERS } from '@/components/Icon';
import { LOADER_KIND_MODIFIERS } from './LoaderConstants';

export default {
  name: 'DtLoaderVariants',
  components: { DtStack, DtLoader },
  data () {
    return {
      kinds: Object.keys(LOADER_KIND_MODIFIERS),
      sizes: Object.keys(ICON_SIZE_MODIFIERS),
    };
  },
};
</script>
