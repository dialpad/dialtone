<!-- eslint-disable vue/no-restricted-class -->
<template>
  <node-view-wrapper
    class="d-d-inline-block"
  >
    <dt-emoji
      size="300"
      :code="node.attrs.code"
    />
  </node-view-wrapper>
</template>

<script>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3';

import { DtEmoji } from '@/components/emoji';

export default {
  name: 'EmojiComponent',
  components: {
    NodeViewWrapper,
    DtEmoji,
  },

  props: nodeViewProps,
};
</script>
