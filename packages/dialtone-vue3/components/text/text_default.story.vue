<template>
  <dt-text
    :as="$attrs.as"
    :kind="$attrs.kind"
    :size="$attrs.size"
    :strength="$attrs.strength"
    :density="$attrs.density"
    :tone="$attrs.tone"
    :align="$attrs.align"
    :truncate="$attrs.truncate"
    :max-lines="$attrs.maxLines"
    :numeric="$attrs.numeric"
    :wrap="$attrs.wrap"
    :trim="$attrs.trim"
    :text="$attrs.textProp"
  >
    <template v-if="defaultSlot">
      {{ defaultSlot }}
    </template>
  </dt-text>
</template>

<script>
import { DtText } from './index';

export default {
  name: 'DtTextDefault',
  components: { DtText },
  inheritAttrs: false,
};
</script>
