<!-- eslint-disable vue/no-restricted-class -->
<template>
  <node-view-wrapper
    class="d-d-inline-block"
  >
    <dt-link
      kind="mention"
      @click="handleClick"
    >
      {{ text }}
    </dt-link>
  </node-view-wrapper>
</template>

<script>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3';

import { DtLink } from '@/components/link';

export default {
  compatConfig: { MODE: 3 },
  name: 'MentionComponent',
  components: {
    NodeViewWrapper,
    DtLink,
  },

  props: nodeViewProps,

  computed: {
    text () {
      return '@' + this.$props.node.attrs.name;
    },
  },

  methods: {
    handleClick (event) {
      event.preventDefault();
      const mentionData = {
        name: this.$props.node.attrs.name,
        id: this.$props.node.attrs.id,
        avatarSrc: this.$props.node.attrs.avatarSrc,
        contactKey: this.$props.node.attrs.contactKey,
      };
      this.$props.editor.emit('mention-click', mentionData);
    },
  },
};
</script>
