<template>
  <dt-badge
    :label="$attrs.label"
    :kind="$attrs.kind"
    :variant="$attrs.variant"
    :emphasis="$attrs.emphasis"
    :size="$attrs.size"
    :icon-size="$attrs.iconSize"
    :decoration="$attrs.decoration"
    :label-class="$attrs.labelClass"
    :leading-class="$attrs.leadingClass"
    :trailing-class="$attrs.trailingClass"
    :start-icon-class="$attrs.startIconClass"
    :end-icon-class="$attrs.endIconClass"
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
import { DtIcon } from '@/components/Icon';

export default {
  name: 'DtBadgeDefault',

  components: { DtBadge, DtIcon },
};
</script>
