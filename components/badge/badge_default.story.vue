<template>
  <dt-badge
    :text="args.text"
    :color="args.color"
  >
    <template v-if="args.default">
      {{ args.default }}
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
