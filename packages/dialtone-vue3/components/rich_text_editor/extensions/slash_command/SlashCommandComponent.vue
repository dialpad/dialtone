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
  compatConfig: { MODE: 3 },
  name: 'SlashCommandsComponent',
  components: {
    NodeViewWrapper,
  },

  props: {
    ...nodeViewProps,
  },

  emits: ['selected-command'],

  computed: {
    text () {
      return '/' + this.$props.node.attrs.command;
    },
  },

  created () {
    const command = this.$props.node.attrs.command;

    // First emit the event using the component's own emit
    this.$emit('selected-command', command);

    // Access the callback from the editor's storage
    const onSelectedCommand = this.editor?.storage?.['slash-commands']?.onSelectedCommand;
    if (onSelectedCommand && typeof onSelectedCommand === 'function') {
      onSelectedCommand(command);
    }
  },
};
</script>
