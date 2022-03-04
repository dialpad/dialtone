<template>
  <dt-badge
    :text="$attrs.text"
    :color="$attrs.color"
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
