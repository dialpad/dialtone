<template>
  <dt-stack gap="500">
    <div>
      <dt-button
        kind="danger"
        importance="primary"
      >
        <dt-emoji-text-wrapper>Button with shortcode :cry: emoji</dt-emoji-text-wrapper>
      </dt-button>
    </div>
    <dt-emoji-text-wrapper>
      Text only with unicode 😃 emoji
    </dt-emoji-text-wrapper>
    <div>
      <dt-button importance="primary">
        <dt-emoji-text-wrapper>Button wrapper :smile:</dt-emoji-text-wrapper>
      </dt-button>
    </div>
    <dt-emoji-text-wrapper size="800">
      Bigger emoji size :smile:
    </dt-emoji-text-wrapper>
    <dt-emoji-text-wrapper size="300">
      Smaller emoji size :smile:
    </dt-emoji-text-wrapper>
  </dt-stack>
</template>

<script>
import DtEmojiTextWrapper from './emoji_text_wrapper.vue';
import { DtButton } from '@/components/button';
import { DtStack } from '@/components/stack';

export default {
  name: 'DtEmojiTextWrapperVariants',
  components: { DtEmojiTextWrapper, DtButton, DtStack },
};
</script>
