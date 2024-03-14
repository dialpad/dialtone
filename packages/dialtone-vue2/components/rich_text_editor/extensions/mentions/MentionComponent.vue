<!-- eslint-disable vue/no-restricted-class -->
<template>
  <node-view-wrapper
    class="d-d-inline-block"
  >
    <dt-link
      kind="inverted"
      class="d-link--mention"
      :href="null"
    >
      {{ text }}
    </dt-link>
  </node-view-wrapper>
</template>

<script>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-2';

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
