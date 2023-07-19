<template>
  <dt-badge
    :text="text"
    :type="type"
    :kind="kind"
    :decoration="decoration"
    :icon-left="iconLeft"
    :icon-right="iconRight"
    :label-class="labelClass"
  >
    <template v-if="defaultSlot">
      {{ defaultSlot }}
    </template>
  </dt-badge>
</template>

<script>
import DtBadge from './badge.vue';

export default {
  name: 'DtBadgeDefault',

  components: { DtBadge },
};
</script>
