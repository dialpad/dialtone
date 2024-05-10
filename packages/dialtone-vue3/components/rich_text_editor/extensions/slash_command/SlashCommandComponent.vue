<!-- eslint-disable vue/no-restricted-class -->
<template>
  <node-view-wrapper
    class="d-d-inline-block"
  >
    {{ text }}
  </node-view-wrapper>
</template>

<script>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3';

export default {
  name: 'SlashCommandsComponent',
  components: {
    NodeViewWrapper,
  },

  props: nodeViewProps,

  emits: ['selected-command'],

  computed: {
    text () {
      return '/' + this.$props.node.attrs.command;
    },
  },

  created () {
    this.$parent.$emit('selected-command', this.$props.node.attrs.command);
  },
};
</script>
