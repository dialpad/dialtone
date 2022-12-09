<template>
  <dt-badge
    :text="text"
    :type="type"
    :kind="kind"
    :icon-left="iconLeft"
    :icon-right="iconRight"
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
