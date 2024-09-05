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
      #leftIcon="{ iconSize }"
    >
      <dt-icon
        v-if="$attrs.leftIcon"
        :name="$attrs.leftIcon"
        :size="iconSize"
      />
    </template>
    <template v-if="$attrs.default">
      {{ $attrs.default }}
    </template>
    <template
      #rightIcon="{ iconSize }"
    >
      <dt-icon
        v-if="$attrs.rightIcon"
        :name="$attrs.rightIcon"
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
