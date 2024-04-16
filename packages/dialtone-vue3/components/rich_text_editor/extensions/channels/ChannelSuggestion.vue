<template>
  <dt-stack
    direction="row"
    gap="400"
  >
    <dt-icon-hash
      v-if="!item.locked"
      size="300"
    />
    <dt-icon-lock
      v-else
      size="300"
    />
    <span>{{ name }}</span>
  </dt-stack>
</template>

<script>
import { DtStack } from '@/components/stack';
import DtIconHash from '@dialpad/dialtone-icons/vue2/hash';
import DtIconLock from '@dialpad/dialtone-icons/vue2/lock';

export default {
  name: 'ChannelSuggestion',
  components: {
    DtStack,
    DtIconHash,
    DtIconLock,
  },

  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  computed: {
    name () {
      return this.item.name;
    },
  },
};
</script>
