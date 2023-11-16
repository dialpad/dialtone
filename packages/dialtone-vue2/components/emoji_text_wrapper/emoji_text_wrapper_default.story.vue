<template>
  <dt-emoji-text-wrapper
    :size="$attrs.size"
    :element-type="$attrs.elementType"
  >
    <template v-if="$attrs.default">
      <html-fragment :html="$attrs.default" />
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
