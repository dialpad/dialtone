<template>
  <dt-progress
    :aria-label="$attrs.ariaLabel"
    :progress="$attrs.progress"
  />
</template>

<script>
import { DtProgress } from './';
export default { name: 'DtProgressDefault', components: { DtProgress } };
</script>
