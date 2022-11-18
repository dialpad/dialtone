<template>
  <div class="d-stack16">
    <dt-emoji-text-wrapper>
      <button class="d-btn d-btn--primary d-btn--danger">
        Button with shortcode :cry: emoji
      </button>
    </dt-emoji-text-wrapper>
    <dt-emoji-text-wrapper>
      Text only with unicode 😃 emoji
    </dt-emoji-text-wrapper>
    <dt-emoji-text-wrapper>
      Text only with invalid unicode 🫡 emoji
    </dt-emoji-text-wrapper>
    <dt-emoji-text-wrapper
      class="d-btn d-btn--primary"
      element-type="button"
    >
      Button wrapper :smile:
    </dt-emoji-text-wrapper>
    <dt-emoji-text-wrapper size="800">
      Bigger emoji size :smile:
    </dt-emoji-text-wrapper>
    <dt-emoji-text-wrapper size="300">
      Smaller emoji size :smile:
    </dt-emoji-text-wrapper>
  </div>
</template>

<script>
import DtEmojiTextWrapper from './emoji_text_wrapper';

export default {
  name: 'DtEmojiTextWrapperVariants',
  components: { DtEmojiTextWrapper },
};
</script>
