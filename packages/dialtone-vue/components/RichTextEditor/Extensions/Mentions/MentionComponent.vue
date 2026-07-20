<!-- eslint-disable vue/no-restricted-class -->
<template>
  <node-view-wrapper
    class="d-d-inline-block"
  >
    <dt-link
      tone="mention"
      @click.prevent="handleClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @focusin="handleMouseEnter"
      @focusout="handleMouseLeave"
    >
      {{ text }}
    </dt-link>
  </node-view-wrapper>
</template>

<script>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3';

import { DtLink } from '@/components/Link';

export default {
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
    getMentionData () {
      return {
        name: this.$props.node.attrs.name,
        id: this.$props.node.attrs.id,
        avatarSrc: this.$props.node.attrs.avatarSrc,
        contactKey: this.$props.node.attrs.contactKey,
      };
    },

    handleClick () {
      this.$props.editor.emit('mention-click', this.getMentionData());
    },

    handleMouseEnter (event) {
      this.$props.editor.emit('mention-hover', { ...this.getMentionData(), event });
    },

    handleMouseLeave (event) {
      this.$props.editor.emit('mention-leave', { ...this.getMentionData(), event });
    },
  },
};
</script>
