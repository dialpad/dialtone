<template>
  <div :class="size === 'd-svg--size100p' ? 'd-w264 d-h264 d-ba' : undefined">
    <dt-emoji
      :code="$attrs.code"
      :size="$attrs.size"
      :img-class="$attrs.imgClass"
      :aria-label="$attrs.ariaLabel"
      :show-skeleton="$attrs.showSkeleton"
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
