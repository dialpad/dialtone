<template>
  <dt-icon
    :size="$attrs.size"
    :name="$attrs.name"
  />
</template>

<script>
import { DtIcon } from './';

export default {
  name: 'IconDefault',
  components: { DtIcon },
};
</script>
