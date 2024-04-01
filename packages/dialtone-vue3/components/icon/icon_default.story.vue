<template>
  <dt-icon
    :size="$attrs.size"
    :name="$attrs.name"
    :aria-label="$attrs.ariaLabel"
    :show-skeleton="$attrs.showSkeleton"
  />
</template>

<script>
import { DtIcon } from './';

export default {
  name: 'IconDefault',
  components: { DtIcon },
};
</script>
