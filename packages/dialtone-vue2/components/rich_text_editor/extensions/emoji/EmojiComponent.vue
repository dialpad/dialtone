<!-- eslint-disable vue/no-restricted-class -->
<template>
  <node-view-wrapper
    class="d-d-inline-block d-va-bottom d-lh0"
  >
    <dt-emoji
      v-if="node.attrs.code"
      size="500"
      :code="node.attrs.code"
    />

    <template v-else>
      <dt-skeleton
        v-if="showSkeleton"
        :offset="0"
        class="d-icon d-icon--size-500"
        :shape-option="{ shape: 'circle', size: '100%' }"
      />

      <img
        v-show="!showSkeleton"
        class="d-icon d-icon--size-500"
        :alt="node.attrs.name"
        :aria-label="node.attrs.name"
        :title="node.attrs.name"
        :src="node.attrs.image"
        @load="handleImageLoad"
        @error="handleImageError"
      >
    </template>
  </node-view-wrapper>
</template>

<script>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-2';
import { DtEmoji } from '@/components/emoji';
import { DtSkeleton } from '@/components/skeleton';


export default {
  name: 'EmojiComponent',
  components: {
    NodeViewWrapper,
    DtEmoji,
    DtSkeleton,
  },

  props: nodeViewProps,

  data () {
    return {
      showSkeleton: true,
    };
  },

  methods: {
    handleImageLoad () {
      this.showSkeleton = false;
    },

    handleImageError: function (event) {
      this.showSkeleton = false;
      event.target.parentNode.remove();
    },
  },
};
</script>
