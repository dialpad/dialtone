<template>
  <div :class="size === 'd-svg--size100p' ? 'd-w264 d-h264 d-ba' : undefined">
    <dt-emoji
      :code="code"
      :size="size"
      :img-class="imgClass"
      :aria-label="ariaLabel"
    />
  </div>
</template>

<script>
import DtEmoji from './emoji';

export default {
  name: 'DtEmojiDefault',
  components: { DtEmoji },
};
</script>
