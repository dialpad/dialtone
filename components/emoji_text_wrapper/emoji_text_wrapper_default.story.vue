<template>
  <dt-emoji-text-wrapper
    :size="size"
    :element-type="elementType"
  >
    <template v-if="defaultSlot">
      <html-fragment :html="defaultSlot" />
    </template>
  </dt-emoji-text-wrapper>
</template>

<script>
import DtEmojiTextWrapper from './emoji_text_wrapper.vue';
import { htmlFragment } from '@/common/utils';

export default {
  name: 'DtEmojiTextWrapperDefault',
  components: { DtEmojiTextWrapper, htmlFragment },
};
</script>
