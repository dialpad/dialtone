<template>
  <dt-emoji
    :code="$attrs.code"
    :size="$attrs.size"
    :img-class="$attrs.imgClass"
    :aria-label="$attrs.ariaLabel"
    :show-skeleton="$attrs.showSkeleton"
  />
</template>

<script>
import DtEmoji from './emoji.vue';

export default {
  name: 'DtEmojiDefault',
  components: { DtEmoji },
};
</script>
