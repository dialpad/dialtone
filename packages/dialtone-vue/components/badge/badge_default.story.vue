<template>
  <dt-badge
    :text="$attrs.text"
    :type="$attrs.type"
    :kind="$attrs.kind"
    :decoration="$attrs.decoration"
    :label-class="$attrs.labelClass"
    :subtle="$attrs.subtle"
    :outlined="$attrs.outlined"
  >
    <template
      #startIcon="{ iconSize }"
    >
      <dt-icon
        v-if="$attrs.startIcon"
        :name="$attrs.startIcon"
        :size="iconSize"
      />
    </template>
    <template v-if="defaultSlot">
      {{ defaultSlot }}
    </template>
    <template
      #endIcon="{ iconSize }"
    >
      <dt-icon
        v-if="$attrs.endIcon"
        :name="$attrs.endIcon"
        :size="iconSize"
      />
    </template>
  </dt-badge>
</template>

<script>
import { DtBadge } from './';
import { DtIcon } from '@/components/icon';

export default {
  name: 'DtBadgeDefault',

  components: { DtBadge, DtIcon },
};
</script>
