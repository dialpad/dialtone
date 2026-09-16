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
      v-if="$attrs.startIcon"
      #startIcon="{ iconSize }"
    >
      <dt-icon
        :name="$attrs.startIcon"
        :size="iconSize"
      />
    </template>
    <template v-if="defaultSlot">
      {{ defaultSlot }}
    </template>
    <template
      v-if="$attrs.endIcon"
      #endIcon="{ iconSize }"
    >
      <dt-icon
        :name="$attrs.endIcon"
        :size="iconSize"
      />
    </template>
  </dt-badge>
</template>

<script>
import { DtBadge } from './';
import { DtIcon } from '@/components/Icon';

export default {
  name: 'DtBadgeDefault',

  components: { DtBadge, DtIcon },
};
</script>
