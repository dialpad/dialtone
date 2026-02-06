<template>
  <dt-emoji-text-wrapper
    :size="$attrs.size"
    :element-type="$attrs.elementType"
  >
    <div
      v-if="defaultSlot"
      v-html="defaultSlot"
    />
  </dt-emoji-text-wrapper>
</template>

<script>
import DtEmojiTextWrapper from './emoji_text_wrapper.vue';

export default {
  name: 'DtEmojiTextWrapperDefault',
  components: { DtEmojiTextWrapper },
};
</script>
