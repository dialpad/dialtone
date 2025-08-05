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
    <img
      v-else
      class="d-icon d-icon--size-500"
      :alt="node.attrs.name"
      :aria-label="node.attrs.name"
      :title="node.attrs.name"
      :src="getImgSrc(node.attrs)"
      @error="handleImageError"
    >
  </node-view-wrapper>
</template>

<script>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-2';
import { CDN_URL } from '@/components/emoji_picker/emoji_picker_constants';
import { DtEmoji } from '@/components/emoji';

export default {
  name: 'EmojiComponent',
  components: {
    NodeViewWrapper,
    DtEmoji,
  },

  props: nodeViewProps,

  computed: {
    CDN_URL () {
      return CDN_URL;
    },
  },

  methods: {
    getImgSrc: function (emoji) {
      // TODO Update json structure to have a property for custom emojis and avoid using date_added
      if (emoji.image) { // if custom emoji
        return emoji.image;
      } else { // if regular emoji
        return this.CDN_URL + emoji.code + '.png';
      }
    },

    handleImageError: function (event) {
      console.log('test error emoji');
      // event.target.parentNode.style.display = 'none';
    },
  }
};
</script>
