<template>
  <dt-icon
    :size="size"
    :name="name"
    :aria-label="ariaLabel"
  />
</template>

<script>
import DtIcon from './icon';

export default {
  name: 'IconDefault',
  components: { DtIcon },
};
</script>
