<template>
  <div>
    <dt-link
      :href="$attrs.href"
      :kind="$attrs.kind"
      :rel="$attrs.rel"
      @click="$attrs.onClick"
      @focusin="$attrs.onFocusIn"
      @focusout="$attrs.onFocusOut"
    >
      {{ defaultSlot }}
    </dt-link>
  </div>
</template>

<script>
import DtLink from './link.vue';

export default {
  name: 'DtLinkDefault',
  components: { DtLink },
  inheritAttrs: false,
};
</script>
