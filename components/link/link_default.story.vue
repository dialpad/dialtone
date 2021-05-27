<template>
  <div>
    <dt-link
      :href="href"
      :kind="kind"
      :rel="rel"
    >
      {{ defaultSlot }}
    </dt-link>
  </div>
</template>

<script>
import DtLink from './link';

export default {
  name: 'DtLinkDefault',
  components: { DtLink },
  inheritAttrs: false,
};
</script>
