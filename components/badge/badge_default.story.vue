<template>
  <dt-badge
    :text="$attrs.text"
    :type="$attrs.type"
    :kind="$attrs.kind"
    :decoration="$attrs.decoration"
    :icon-left="$attrs.iconLeft"
    :icon-right="$attrs.iconRight"
    :label-class="$attrs.labelClass"
  >
    <template v-if="$attrs.default">
      {{ $attrs.default }}
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
