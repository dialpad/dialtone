<template>
  <dt-badge
    :text="text"
    :color="color"
  >
    <template v-if="defaultSlot">
      {{ defaultSlot }}
    </template>
  </dt-badge>
</template>

<script>
import DtBadge from './badge';

export default {
  name: 'DtBadgeDefault',

  components: { DtBadge },
};
</script>
