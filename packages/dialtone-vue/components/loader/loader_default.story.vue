<template>
  <dt-loader
    :aria-label="$attrs.ariaLabel"
    :size="$attrs.size"
  />
</template>

<script>
import DtLoader from './loader.vue';

export default {
  name: 'DtLoaderDefault',
  components: { DtLoader },
};
</script>
