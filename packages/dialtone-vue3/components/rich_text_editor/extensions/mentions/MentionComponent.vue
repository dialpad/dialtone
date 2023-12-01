<template>
  <node-view-wrapper
    class="d-d-inline-block"
  >
    <dt-link
      kind="inverted"
      class="dt-link--mention"
      :href="null"
    >
      {{ text }}
    </dt-link>
  </node-view-wrapper>
</template>

<script>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3';

import { DtLink } from '@/components/link';

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
};
</script>

<style lang="less">
.dt-link--mention {
  background-color: hsl(var(--dt-color-purple-400-hsl) / 10%);
  color: var(--dt-color-link-primary);
  border-radius: var(--dt-space-200);
  height: 1.8rem;

  &:hover {
    color: var(--dt-color-link-primary);
    background-color: hsl(var(--dt-color-purple-500-hsl) / 10%);
  }
}
</style>
