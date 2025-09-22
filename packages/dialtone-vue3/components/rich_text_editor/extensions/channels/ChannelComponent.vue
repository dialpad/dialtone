<!-- eslint-disable vue/no-restricted-class -->
<template>
  <node-view-wrapper
    class="d-d-inline-block"
  >
    <dt-link
      kind="mention"
    >
      <dt-stack
        direction="row"
        gap="0"
      >
        <dt-icon-lock
          v-if="$props.node.attrs.locked"
          size="200"
        />
        <span>{{ text }}</span>
      </dt-stack>
    </dt-link>
  </node-view-wrapper>
</template>

<script>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3';
import { DtIconLock } from '@dialpad/dialtone-icons/vue3';
import { DtStack } from '@/components/stack';

import { DtLink } from '@/components/link';

export default {
  compatConfig: { MODE: 3 },
  name: 'ChannelComponent',
  components: {
    NodeViewWrapper,
    DtLink,
    DtIconLock,
    DtStack,
  },

  props: nodeViewProps,

  computed: {
    text () {
      if (this.$props.node.attrs.locked) {
        return this.$props.node.attrs.name;
      }
      return '#' + this.$props.node.attrs.name;
    },
  },
};
</script>
