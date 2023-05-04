<template>
  <div>
    <dt-link
      :href="href"
      :kind="kind"
      :rel="rel"
      @click="onClick"
      @focusin="onFocusIn"
      @focusout="onFocusOut"
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
