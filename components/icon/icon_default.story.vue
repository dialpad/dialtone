<template>
  <dt-icon
    :size="size"
    :name="name"
    :aria-label="ariaLabel"
  />
</template>

<script>
import DtIcon from './icon.vue';

export default {
  name: 'IconDefault',
  components: { DtIcon },
};
</script>
