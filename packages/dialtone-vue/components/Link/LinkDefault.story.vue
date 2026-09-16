<template>
  <div>
    <dt-link
      :href="$attrs.href"
      :to="$attrs.to"
      :replace="$attrs.replace"
      :tone="$attrs.tone"
      :kind="$attrs.kind"
      :inverted="$attrs.inverted"
      :underline="$attrs.underline"
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
import DtLink from './Link.vue';

export default {
  name: 'DtLinkDefault',
  components: { DtLink },
  inheritAttrs: false,
};
</script>
