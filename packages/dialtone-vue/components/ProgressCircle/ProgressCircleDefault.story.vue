<template>
  <dt-progress-circle
    :aria-label="$attrs.ariaLabel"
    :progress="$attrs.progress"
  />
</template>

<script>
import { DtProgressCircle } from './';
export default { name: 'DtProgressCircleDefault', components: { DtProgressCircle } };
</script>
