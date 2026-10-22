<template>
  <dt-badge
    :label="$attrs.label"
    :kind="$attrs.kind"
    :variant="$attrs.variant"
    :emphasis="$attrs.emphasis"
    :size="$attrs.size"
    :decoration="$attrs.decoration"
    :label-class="$attrs.labelClass"
    :leading-class="$attrs.leadingClass"
    :trailing-class="$attrs.trailingClass"
    :start-icon-class="$attrs.startIconClass"
    :end-icon-class="$attrs.endIconClass"
  >
    <template
      #startIcon
    >
      <dt-icon
        v-if="$attrs.startIcon"
        :name="$attrs.startIcon"
        size="200"
      />
    </template>
    <template v-if="defaultSlot">
      {{ defaultSlot }}
    </template>
    <template
      #endIcon
    >
      <dt-icon
        v-if="$attrs.endIcon"
        :name="$attrs.endIcon"
        size="200"
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
