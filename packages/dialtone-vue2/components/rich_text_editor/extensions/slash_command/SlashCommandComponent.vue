<!-- eslint-disable vue/no-restricted-class -->
<template>
  <node-view-wrapper
    class="d-d-inline-block"
  >
    {{ text }}
  </node-view-wrapper>
</template>

<script>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-2';

export default {
  name: 'SlashCommandsComponent',
  components: {
    NodeViewWrapper,
  },

  props: nodeViewProps,

  computed: {
    text () {
      return '/' + this.$props.node.attrs.command;
    },
  },
};
</script>
