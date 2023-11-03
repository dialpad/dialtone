<template>
  <dt-icon
    :size="$attrs.size"
    :name="$attrs.name"
    :aria-label="$attrs.ariaLabel"
  />
</template>

<script>
import DtIcon from './icon.vue';

export default {
  name: 'IconDefault',
  components: { DtIcon },
};
</script>
